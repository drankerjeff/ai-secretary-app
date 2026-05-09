import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createGoogleEvent, GoogleCalendarError } from '@/lib/calendar/googleCalendar'
import type { InsertCalendarEvent } from '@/types/database'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json(
      { error: 'start and end query parameters are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_datetime', start)
    .lte('start_datetime', end)
    .order('start_datetime', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

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
  const {
    title,
    description,
    start_datetime,
    end_datetime,
    location,
    is_all_day,
    color,
    source,
    task_id,
    google_event_id,
    access_token,
  } = body

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (!start_datetime || !end_datetime) {
    return NextResponse.json(
      { error: 'start_datetime and end_datetime are required' },
      { status: 400 }
    )
  }

  const insertData: InsertCalendarEvent = {
    user_id: user.id,
    title: title.trim(),
    description: description ?? null,
    start_datetime,
    end_datetime,
    location: location ?? null,
    is_all_day: is_all_day ?? false,
    color: color ?? null,
    source: source ?? 'manual',
    task_id: task_id ?? null,
    google_event_id: google_event_id ?? null,
  }

  // Google Calendar にも作成する場合
  if (access_token && !google_event_id) {
    try {
      const googleEvent = await createGoogleEvent(access_token, {
        summary: insertData.title,
        description: insertData.description ?? undefined,
        start: insertData.is_all_day
          ? { date: start_datetime.split('T')[0] }
          : { dateTime: start_datetime },
        end: insertData.is_all_day
          ? { date: end_datetime.split('T')[0] }
          : { dateTime: end_datetime },
        location: insertData.location ?? undefined,
      })
      insertData.google_event_id = googleEvent.id
      insertData.source = 'google'
    } catch (err) {
      if (err instanceof GoogleCalendarError) {
        return NextResponse.json(
          { error: 'Failed to create event in Google Calendar', detail: err.message },
          { status: 502 }
        )
      }
      throw err
    }
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
