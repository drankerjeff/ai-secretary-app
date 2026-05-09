'use client'

import * as React from 'react'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      type = 'text',
      id,
      className = '',
      inputSize = 'md',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = id ?? React.useId()
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    const hasError = Boolean(error)

    const sizeClass =
      inputSize === 'sm'
        ? 'text-footnote py-1.5'
        : inputSize === 'lg'
          ? 'text-body py-3'
          : 'text-callout py-2.5'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-subheadline font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className="absolute left-3 flex items-center text-foreground-tertiary pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={hasError}
            aria-describedby={
              [hasError ? errorId : '', hint ? hintId : '']
                .filter(Boolean)
                .join(' ') || undefined
            }
            className={[
              'w-full rounded-lg bg-background-secondary border',
              'text-foreground placeholder:text-foreground-tertiary',
              'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-ring',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError ? 'border-destructive' : 'border-border',
              leftIcon ? 'pl-10' : 'pl-3.5',
              isPassword ? 'pr-10' : 'pr-3.5',
              sizeClass,
              className,
            ].join(' ')}
            {...props}
          />

          {isPassword && (
            // Password toggle must be keyboard-reachable so screen-reader and
            // keyboard-only users can reveal/hide the password.  tabIndex={-1}
            // was removed; the button is in normal tab order.
            // Touch target: min 44×44px via min-w/min-h so the hit area is
            // sufficient even though the icon is 18px.
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className={[
                'absolute right-0 flex items-center justify-center',
                'min-w-[44px] min-h-[44px]',
                'text-foreground-tertiary hover:text-foreground-secondary',
                'transition-colors duration-250',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'rounded-lg',
              ].join(' ')}
            >
              {showPassword ? (
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
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>

        {hasError && (
          <p id={errorId} role="alert" className="text-footnote text-destructive">
            {error}
          </p>
        )}

        {hint && !hasError && (
          <p id={hintId} className="text-footnote text-foreground-tertiary">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
