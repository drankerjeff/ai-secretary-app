import { createClient } from './client'
import type { InsertCalendarEvent, UpdateCalendarEvent } from '@/types/database'

export async function getCalendarEvents(
  userId: string,
  startDate: string,
  endDate: string
) {
  const supabase = createClient()
  return supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_datetime', startDate)
    .lte('start_datetime', endDate)
    .order('start_datetime', { ascending: true })
}

export async function createCalendarEvent(data: InsertCalendarEvent) {
  const supabase = createClient()
  return supabase.from('calendar_events').insert(data).select().single()
}

export async function updateCalendarEvent(id: string, data: UpdateCalendarEvent) {
  const supabase = createClient()
  return supabase
    .from('calendar_events')
    .update(data)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteCalendarEvent(id: string) {
  const supabase = createClient()
  return supabase.from('calendar_events').delete().eq('id', id)
}

/**
 * Google から取得したイベント群を Supabase に upsert する。
 * google_event_id + user_id の一意インデックスを利用して重複を防ぐ。
 */
export async function upsertGoogleEvents(
  userId: string,
  events: InsertCalendarEvent[]
) {
  if (events.length === 0) return { data: [], error: null, count: 0 }

  const supabase = createClient()

  // user_id を強制的に付与してから upsert
  const records = events.map((e) => ({ ...e, user_id: userId }))

  const { data, error } = await supabase
    .from('calendar_events')
    .upsert(records, {
      onConflict: 'google_event_id,user_id',
      ignoreDuplicates: false,
    })
    .select()

  return { data, error, count: data?.length ?? 0 }
}
