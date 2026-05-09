import { useCalendarContext } from '@/contexts/CalendarContext'

export function useCalendar() {
  const ctx = useCalendarContext()
  return ctx
}
