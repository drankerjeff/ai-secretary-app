'use client'

interface CalendarHeaderProps {
  currentDate: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onSync: () => Promise<void>
  isSyncing: boolean
  lastSyncedAt: Date | null
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
  onSync,
  isSyncing,
  lastSyncedAt,
}: CalendarHeaderProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const syncLabel = lastSyncedAt
    ? `最終同期: ${lastSyncedAt.getHours().toString().padStart(2, '0')}:${lastSyncedAt.getMinutes().toString().padStart(2, '0')}`
    : null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            aria-label="前月"
            className={[
              'inline-flex items-center justify-center min-w-[36px] min-h-[36px] rounded-lg',
              'text-foreground-secondary hover:text-foreground hover:bg-fill',
              'transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ].join(' ')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <h2 className="text-title3 font-semibold text-foreground min-w-[6rem] text-center">
            {year}年{month}月
          </h2>

          <button
            type="button"
            onClick={onNext}
            aria-label="次月"
            className={[
              'inline-flex items-center justify-center min-w-[36px] min-h-[36px] rounded-lg',
              'text-foreground-secondary hover:text-foreground hover:bg-fill',
              'transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ].join(' ')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className={[
              'inline-flex items-center justify-center px-3 py-1.5 min-h-[36px] rounded-lg',
              'text-footnote font-semibold text-foreground',
              'bg-background-secondary border border-border',
              'hover:bg-background-tertiary transition-all duration-250',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ].join(' ')}
          >
            今日
          </button>

          <div className="flex flex-col items-end gap-0.5">
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg',
                'text-footnote font-semibold text-primary',
                'bg-primary/10 border border-primary/30',
                'hover:bg-primary/20 transition-all duration-250',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:opacity-50 disabled:pointer-events-none',
              ].join(' ')}
            >
              {isSyncing ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <polyline points="23 20 23 14 17 14" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
              )}
              Googleと同期
            </button>
            {syncLabel && (
              <span className="text-caption1 text-foreground-tertiary pr-0.5">{syncLabel}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={[
              'py-2 text-center text-caption1 font-semibold',
              i === 0 ? 'text-destructive' : i === 6 ? 'text-primary' : 'text-foreground-secondary',
            ].join(' ')}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
