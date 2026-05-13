import * as React from 'react'

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline'
  size?: 'sm' | 'md'
  dismissible?: boolean
  onDismiss?: () => void
  children: React.ReactNode
  className?: string
}

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-caption1 px-2 py-0.5',
  md: 'text-footnote px-2.5 py-1',
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dismissible = false,
      onDismiss,
      children,
      className = '',
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={[
          'inline-flex items-center gap-1 font-medium text-foreground',
          sizeStyles[size],
          className,
        ].join(' ')}
      >
        {children}

        {dismissible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDismiss?.()
            }}
            aria-label="Remove"
            className={[
              'inline-flex items-center justify-center',
              'p-3 -m-3',
              '-mr-2',
            ].join(' ')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'}
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
