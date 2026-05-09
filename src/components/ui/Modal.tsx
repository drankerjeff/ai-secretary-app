'use client'

import * as React from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
}

export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
}: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const titleId = React.useId()

  // Focus trap + Escape key + body overflow lock
  React.useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    if (!dialog) return

    // Capture the element that had focus before the modal opened so we can
    // restore it on close (important for screen-reader / keyboard flow).
    const previouslyFocused = document.activeElement as HTMLElement | null

    // Move focus into dialog on the first focusable element
    const firstFocusable = dialog.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )

      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      // Restore focus to the element that opened the modal
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    // The outer div is a purely positional container — no ARIA attributes needed.
    // aria-modal and the dialog role live on the <dialog> element itself.
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-apple animate-in fade-in duration-250"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel — uses native <dialog> for correct AT semantics */}
      <dialog
        ref={dialogRef}
        open
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={[
          'relative z-10 w-full apple-card rounded-xl p-0 m-0',
          'animate-in fade-in slide-in-from-bottom-4 duration-250',
          sizeMap[size],
        ].join(' ')}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border-subtle">
          {title ? (
            <h2
              id={titleId}
              className="text-headline font-semibold text-foreground"
            >
              {title}
            </h2>
          ) : (
            <span />
          )}

          {/* Close button — must meet 44×44px touch target */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={[
              'inline-flex items-center justify-center',
              'min-w-[44px] min-h-[44px]',
              'rounded-lg text-foreground-secondary hover:text-foreground hover:bg-fill',
              'transition-all duration-250',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            ].join(' ')}
          >
            <svg
              width="18"
              height="18"
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
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </dialog>
    </div>
  )
}
