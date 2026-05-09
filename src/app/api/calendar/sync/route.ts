import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listGoogleEvents, GoogleCalendarError } from '@/lib/calendar/googleCalendar'
import type { InsertCalendarEvent } from '@/types/database'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { accessToken, year, month } = body

  if (!accessToken || typeof accessToken !== 'string') {
    return NextResponse.json({ error: 'accessToken is required' }, { status: 400 })
  }
  if (
    typeof year !== 'number' ||
    typeof month !== 'number' ||
    month < 1 ||
    month > 12
  ) {
    return NextResponse.json(
      { error: 'year and month (1-12) are required numbers' },
      { status: 400 }
    )
  }

  // ±1日のバッファを加えてタイムゾーンのズレによる取りこぼしを防ぐ
  const firstDay = new Date(Date.UTC(year, month - 1, 0, 0, 0, 0))  // 先月末
  const lastDay = new Date(Date.UTC(year, month, 1, 23, 59, 59))    // 来月2日
  const timeMin = firstDay.toISOString()
  const timeMax = lastDay.toISOString()

  // Google Calendar からイベントを取得する
  let googleEvents
  try {
    googleEvents = await listGoogleEvents(accessToken, timeMin, timeMax)
  } catch (err) {
    if (err instanceof GoogleCalendarError) {
      return NextResponse.json(
        { error: 'Failed to fetch events from Google Calendar', detail: err.message },
        { status: 502 }
      )
    }
    throw err
  }

  if (googleEvents.length === 0) {
    return NextResponse.json({ synced: 0, message: 'No events found for the specified month' })
  }

  // Google イベントを Supabase の InsertCalendarEvent 型に変換する
  const records: InsertCalendarEvent[] = googleEvents.map((ev) => {
    const isAllDay = Boolean(ev.start.date && !ev.start.dateTime)
    const startDatetime = ev.start.dateTime ?? `${ev.start.date}T00:00:00.000Z`
    const endDatetime = ev.end.dateTime ?? `${ev.end.date}T00:00:00.000Z`

    return {
      user_id: user.id,
      google_event_id: ev.id,
      title: ev.summary ?? '(no title)',
      description: ev.description ?? null,
      start_datetime: startDatetime,
      end_datetime: endDatetime,
      location: ev.location ?? null,
      is_all_day: isAllDay,
      color: ev.colorId ?? null,
      source: 'google' as const,
      task_id: null,
    }
  })

  // 認証済みのサーバークライアントで直接 upsert する
  const { data, error } = await supabase
    .from('calendar_events')
    .upsert(records, {
      onConflict: 'google_event_id,user_id',
      ignoreDuplicates: false,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    synced: data?.length ?? 0,
    message: `Successfully synced ${data?.length ?? 0} event(s) for ${year}/${String(month).padStart(2, '0')}`,
  })
}
