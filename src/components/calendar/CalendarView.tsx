'use client'

import { useMemo } from 'react'
import { EventItem } from './EventItem'
import type { CalendarEvent } from '@/types/calendar'

interface CalendarViewProps {
  events: CalendarEvent[]
  currentDate: Date
  onEventClick: (event: CalendarEvent) => void
  onDayClick: (date: string) => void
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function CalendarView({ events, currentDate, onEventClick, onDayClick }: CalendarViewProps) {
  const today = formatDateKey(new Date())

  const cells = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startOffset = firstDay.getDay()
    const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7

    return Array.from({ length: totalCells }, (_, i) => {
      const diff = i - startOffset
      const date = new Date(year, month, 1 + diff)
      return {
        date,
        key: formatDateKey(date),
        isCurrentMonth: date.getMonth() === month,
      }
    })
  }, [currentDate])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      // ローカルタイムゾーンで日付キーを生成する（UTCスライスはJSTでずれる）
      const key = formatDateKey(new Date(event.start_datetime))
      const existing = map.get(key) ?? []
      existing.push(event)
      map.set(key, existing)
    }
    return map
  }, [events])

  return (
    <div className="apple-card overflow-hidden">
      <div className="grid grid-cols-7 divide-x divide-border-subtle">
        {cells.map(({ date, key, isCurrentMonth }, idx) => {
          const dayEvents = eventsByDay.get(key) ?? []
          const isToday = key === today
          const isWeekend = date.getDay() === 0 || date.getDay() === 6

          const visibleCount = 3
          const visibleEvents = dayEvents.slice(0, visibleCount)
          const overflow = dayEvents.length - visibleCount

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              aria-label={`${date.getMonth() + 1}月${date.getDate()}日`}
              onClick={() => onDayClick(key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onDayClick(key)
              }}
              className={[
                'min-h-[80px] sm:min-h-[100px] p-1 sm:p-1.5 flex flex-col gap-0.5 cursor-pointer',
                'border-b border-border-subtle',
                idx % 7 === 0 ? 'border-l-0' : '',
                'hover:bg-fill/30 transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-ring',
              ].join(' ')}
            >
              <div className="flex justify-center mb-0.5">
                <span
                  className={[
                    'inline-flex items-center justify-center w-6 h-6 rounded-full text-caption1 font-medium',
                    isToday
                      ? 'bg-primary text-white'
                      : isCurrentMonth
                        ? isWeekend
                          ? date.getDay() === 0
                            ? 'text-destructive'
                            : 'text-primary'
                          : 'text-foreground'
                        : 'text-foreground-tertiary opacity-50',
                  ].join(' ')}
                >
                  {date.getDate()}
                </span>
              </div>

              <div className="flex flex-col gap-px min-w-0">
                {visibleEvents.map((event) => (
                  <EventItem key={event.id} event={event} onClick={onEventClick} />
                ))}
                {overflow > 0 && (
                  <span className="text-caption1 text-foreground-secondary pl-1">
                    +{overflow}件
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
