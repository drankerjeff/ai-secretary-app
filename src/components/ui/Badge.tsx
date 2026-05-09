import * as React from 'react'

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline'
  size?: 'sm' | 'md'
  dismissible?: boolean
  onDismiss?: () => void
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-fill text-foreground-secondary',
  primary: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  destructive: 'bg-destructive/15 text-destructive',
  outline: 'border border-border text-foreground-secondary bg-transparent',
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
          'inline-flex items-center gap-1 rounded-full font-medium',
          variantStyles[variant],
          sizeStyles[size],
          className,
        ].join(' ')}
      >
        {children}

        {dismissible && (
          // Outer button carries the 44×44 minimum touch target via negative margin
          // and padding expansion while keeping the visual icon small.
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDismiss?.()
            }}
            aria-label="Remove"
            className={[
              // Minimum 44×44 touch target achieved with p-3 on a small icon button.
              // We use -m-3 to cancel the visual size increase so the badge layout
              // does not expand, keeping the pill visually compact.
              'inline-flex items-center justify-center',
              'rounded-full',
              'transition-opacity duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
              'hover:opacity-70',
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
