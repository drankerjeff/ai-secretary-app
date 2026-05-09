'use client'

import * as React from 'react'

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
  autoResize?: boolean
  onChange?: (value: string) => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      maxLength,
      autoResize = false,
      onChange,
      id,
      className = '',
      defaultValue,
      value,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef

    const [charCount, setCharCount] = React.useState(() => {
      const initial = value ?? defaultValue ?? ''
      return String(initial).length
    })

    const inputId = id ?? React.useId()
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    const hasError = Boolean(error)
    const atLimit = maxLength !== undefined && charCount >= maxLength

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setCharCount(newValue.length)
      onChange?.(newValue)

      if (autoResize && resolvedRef.current) {
        resolvedRef.current.style.height = 'auto'
        resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`
      }
    }

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

        <textarea
          ref={resolvedRef}
          id={inputId}
          rows={autoResize ? 1 : rows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={hasError}
          aria-describedby={
            [hasError ? errorId : '', hint ? hintId : '']
              .filter(Boolean)
              .join(' ') || undefined
          }
          onChange={handleChange}
          className={[
            'w-full rounded-lg bg-background-secondary border',
            'text-callout text-foreground placeholder:text-foreground-tertiary',
            'px-3.5 py-2.5',
            'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-ring',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            autoResize ? 'overflow-hidden resize-none' : 'resize-y',
            hasError ? 'border-destructive' : 'border-border',
            className,
          ].join(' ')}
          {...props}
        />

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
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

          {maxLength !== undefined && (
            <p
              className={[
                'text-caption1 shrink-0',
                atLimit ? 'text-destructive' : 'text-foreground-tertiary',
              ].join(' ')}
              aria-live="polite"
              aria-atomic="true"
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
