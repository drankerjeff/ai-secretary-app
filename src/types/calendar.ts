export interface CalendarEvent {
  id: string
  user_id: string | null
  google_event_id: string | null
  title: string
  description: string | null
  start_datetime: string
  end_datetime: string
  location: string | null
  is_all_day: boolean
  color: string | null
  source: 'manual' | 'google' | 'task'
  task_id: string | null
  created_at: string
  updated_at: string
}

export interface EventInput {
  title: string
  description?: string
  start_datetime: string
  end_datetime: string
  location?: string
  is_all_day?: boolean
}
