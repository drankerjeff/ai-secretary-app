'use client'

import * as React from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  label?: string
  error?: string
  disabled?: boolean
  id?: string
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  label,
  error,
  disabled = false,
  id,
  className = '',
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [focusedIndex, setFocusedIndex] = React.useState(-1)

  const inputId = id ?? React.useId()
  const errorId = `${inputId}-error`
  const listboxId = `${inputId}-listbox`

  const containerRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  const filteredOptions = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 0)
    }
    if (!open) {
      setSearch('')
      setFocusedIndex(-1)
    }
  }, [open, searchable])

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setFocusedIndex(0)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setFocusedIndex(filteredOptions.length - 1)
    }
  }

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((i) =>
        i < filteredOptions.length - 1 ? i + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((i) =>
        i > 0 ? i - 1 : filteredOptions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
        onChange(filteredOptions[focusedIndex].value)
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
  }

  const handleSelect = (optValue: string) => {
    onChange(optValue)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const hasError = Boolean(error)

  return (
    <div
      ref={containerRef}
      className={['relative flex flex-col gap-1.5 w-full', className].join(' ')}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-subheadline font-medium text-foreground"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        id={inputId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        className={[
          'w-full flex items-center justify-between',
          'rounded-lg bg-background-secondary border text-callout',
          'px-3.5 py-2.5 min-h-[44px]',
          'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-ring',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          hasError ? 'border-destructive' : 'border-border',
          open ? 'ring-2 ring-ring border-ring' : '',
        ].join(' ')}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-foreground-tertiary'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            'shrink-0 text-foreground-tertiary',
            'transition-transform duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
            open ? 'rotate-180' : '',
          ].join(' ')}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={[
            'absolute top-full left-0 right-0 z-50 mt-1',
            'bg-background-elevated rounded-lg shadow-lg border border-border',
            'overflow-hidden',
          ].join(' ')}
          onKeyDown={handleListKeyDown}
        >
          {searchable && (
            <div className="p-2 border-b border-border-subtle">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setFocusedIndex(0)
                }}
                placeholder="Search..."
                aria-label="Search options"
                className={[
                  'w-full bg-background-secondary border border-border rounded-lg',
                  'text-callout text-foreground placeholder:text-foreground-tertiary',
                  'px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
                ].join(' ')}
              />
            </div>
          )}

          <ul
            id={listboxId}
            role="listbox"
            aria-label={label ?? 'Options'}
            className="max-h-60 overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-footnote text-foreground-tertiary text-center">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value
                const isFocused = index === focusedIndex
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={[
                      'flex items-center justify-between',
                      'px-3.5 py-2.5 text-callout cursor-pointer',
                      'transition-colors duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
                      isSelected
                        ? 'text-primary bg-primary/10'
                        : isFocused
                          ? 'text-foreground bg-fill'
                          : 'text-foreground hover:bg-fill',
                    ].join(' ')}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
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
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}

      {hasError && (
        <p id={errorId} role="alert" className="text-footnote text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
