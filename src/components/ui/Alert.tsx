import * as React from 'react'

export interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const typeConfig = {
  info: {
    container: 'bg-info/10 border-info/30 text-info',
    accent: 'bg-info',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    // info is non-urgent — use role=status / aria-live=polite
    role: 'status' as const,
  },
  success: {
    container: 'bg-success/10 border-success/30 text-success',
    accent: 'bg-success',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    // success is non-urgent — use role=status / aria-live=polite
    role: 'status' as const,
  },
  warning: {
    container: 'bg-warning/10 border-warning/30 text-warning-foreground',
    accent: 'bg-warning',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    // warning is urgent — use role=alert / aria-live=assertive
    role: 'alert' as const,
  },
  error: {
    container: 'bg-destructive/10 border-destructive/30 text-destructive',
    accent: 'bg-destructive',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    // error is urgent — use role=alert / aria-live=assertive
    role: 'alert' as const,
  },
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ type, title, children, dismissible = false, onDismiss, className = '' }, ref) => {
    const config = typeConfig[type]

    return (
      <div
        ref={ref}
        role={config.role}
        aria-live={config.role === 'alert' ? 'assertive' : 'polite'}
        className={[
          'relative flex gap-3 rounded-lg border pl-4 pr-4 py-3.5 overflow-hidden',
          config.container,
          className,
        ].join(' ')}
      >
        {/* Left accent bar — color driven purely by CSS variable tokens */}
        <span
          className={[
            'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
            config.accent,
          ].join(' ')}
          aria-hidden="true"
        />

        {/* Icon */}
        <span className="mt-0.5 shrink-0">{config.icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-subheadline font-semibold mb-0.5">{title}</p>
          )}
          <div className="text-footnote opacity-90">{children}</div>
        </div>

        {/* Dismiss button — 44×44px touch target via min-w/min-h */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className={[
              'shrink-0 self-center',
              'inline-flex items-center justify-center',
              'min-w-[44px] min-h-[44px]',
              'rounded-lg hover:opacity-70',
              'transition-opacity duration-250',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
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
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }
