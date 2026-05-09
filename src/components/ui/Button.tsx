'use client'

import * as React from 'react'
import { Spinner } from './Spinner'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

const variantStyles: Record<
  NonNullable<ButtonProps['variant']>,
  string
> = {
  primary: [
    'bg-primary text-primary-foreground rounded-full',
    'hover:shadow-primary-glow hover:brightness-110',
    'active:brightness-90',
  ].join(' '),
  secondary: [
    'bg-background-secondary text-foreground rounded-lg',
    'hover:bg-background-tertiary',
    'active:brightness-90',
  ].join(' '),
  outline: [
    'border border-border text-foreground bg-transparent rounded-lg',
    'hover:bg-fill',
    'active:bg-fill-secondary',
  ].join(' '),
  ghost: [
    'text-foreground bg-transparent rounded-lg',
    'hover:bg-fill',
    'active:bg-fill-secondary',
  ].join(' '),
  destructive: [
    'bg-destructive text-destructive-foreground rounded-lg',
    'hover:brightness-110',
    'active:brightness-90',
  ].join(' '),
}

// All sizes meet the 44px minimum touch target requirement.
// sm uses min-h-[44px] to satisfy the constraint while keeping the visual padding compact.
const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-footnote px-3 py-1.5 min-h-[44px] gap-1.5',
  md: 'text-callout px-4 py-2.5 min-h-[44px] gap-2',
  lg: 'text-body px-5 py-3 min-h-[52px] gap-2.5',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center font-semibold',
          'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:pointer-events-none',
          'select-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading ? (
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            color={
              variant === 'primary' || variant === 'destructive'
                ? 'foreground'
                : 'primary'
            }
          />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {/* Use `invisible` instead of `opacity-0 absolute` so the button retains
            its natural width during the loading state and does not collapse. */}
        {children && (
          <span className={loading ? 'invisible' : undefined}>
            {children}
          </span>
        )}

        {!loading && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
