import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  updateGoogleEvent,
  deleteGoogleEvent,
  GoogleCalendarError,
} from '@/lib/calendar/googleCalendar'
import type { UpdateCalendarEvent } from '@/types/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // オーナーシップを確認する (RLS も同様に保護するが、明示的な 404 を返す)
  const { data: existing } = await supabase
    .from('calendar_events')
    .select('id, google_event_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const { access_token, ...eventFields } = body

  const updates: UpdateCalendarEvent = {}
  if (eventFields.title !== undefined) updates.title = eventFields.title
  if (eventFields.description !== undefined) updates.description = eventFields.description
  if (eventFields.start_datetime !== undefined) updates.start_datetime = eventFields.start_datetime
  if (eventFields.end_datetime !== undefined) updates.end_datetime = eventFields.end_datetime
  if (eventFields.location !== undefined) updates.location = eventFields.location
  if (eventFields.is_all_day !== undefined) updates.is_all_day = eventFields.is_all_day
  if (eventFields.color !== undefined) updates.color = eventFields.color
  if (eventFields.source !== undefined) updates.source = eventFields.source
  if (eventFields.task_id !== undefined) updates.task_id = eventFields.task_id

  // Google Calendar にも反映する
  if (access_token && existing.google_event_id) {
    try {
      const googlePatch: Parameters<typeof updateGoogleEvent>[2] = {}
      if (updates.title !== undefined) googlePatch.summary = updates.title
      if (updates.description !== undefined) {
        // Google API は null を受け取れないため undefined に変換する
        googlePatch.description = updates.description ?? undefined
      }
      if (updates.location !== undefined) {
        googlePatch.location = updates.location ?? undefined
      }
      if (updates.start_datetime !== undefined) {
        googlePatch.start = updates.is_all_day
          ? { date: updates.start_datetime.split('T')[0] }
          : { dateTime: updates.start_datetime }
      }
      if (updates.end_datetime !== undefined) {
        googlePatch.end = updates.is_all_day
          ? { date: updates.end_datetime.split('T')[0] }
          : { dateTime: updates.end_datetime }
      }

      if (Object.keys(googlePatch).length > 0) {
        await updateGoogleEvent(access_token, existing.google_event_id, googlePatch)
      }
    } catch (err) {
      if (err instanceof GoogleCalendarError) {
        return NextResponse.json(
          { error: 'Failed to update event in Google Calendar', detail: err.message },
          { status: 502 }
        )
      }
      throw err
    }
  }

  const { data, error } = await supabase
    .from('calendar_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // オーナーシップを確認する
  const { data: existing } = await supabase
    .from('calendar_events')
    .select('id, google_event_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // クエリパラメータから access_token を取得 (DELETE body は使わない)
  const { searchParams } = new URL(request.url)
  const accessToken = searchParams.get('access_token')

  // Google Calendar 側のイベントも削除する
  if (accessToken && existing.google_event_id) {
    try {
      await deleteGoogleEvent(accessToken, existing.google_event_id)
    } catch (err) {
      if (err instanceof GoogleCalendarError) {
        return NextResponse.json(
          { error: 'Failed to delete event from Google Calendar', detail: err.message },
          { status: 502 }
        )
      }
      throw err
    }
  }

  const { error } = await supabase.from('calendar_events').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
