'use client'

import type { CalendarEvent } from '@/types/calendar'

interface EventItemProps {
  event: CalendarEvent
  onClick: (event: CalendarEvent) => void
}

const sourceStyle: Record<CalendarEvent['source'], string> = {
  task:   'bg-[#FFD60A] text-black',
  google: 'bg-[#0A84FF] text-white',
  manual: 'bg-[#30D158] text-white',
}

function formatTime(isoString: string): string {
  const d = new Date(isoString)
  const h = d.getHours()
  const m = d.getMinutes()
  const period = h < 12 ? '午前' : '午後'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${period}${hour}時` : `${period}${hour}:${String(m).padStart(2, '0')}`
}

export function EventItem({ event, onClick }: EventItemProps) {
  const timeLabel = event.is_all_day ? null : formatTime(event.start_datetime)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      title={event.title}
      className={[
        'w-full h-5 px-1.5 rounded-sm text-xs font-medium truncate text-left',
        'transition-opacity duration-150 hover:opacity-85',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        sourceStyle[event.source],
      ].join(' ')}
    >
      {timeLabel && <span className="opacity-90 mr-0.5">{timeLabel}</span>}
      {event.title}
    </button>
  )
}
