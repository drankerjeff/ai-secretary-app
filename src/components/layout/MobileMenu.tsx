'use client'

import { useEffect } from 'react'
import { Sidebar } from './Sidebar'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-overlay"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className="absolute inset-y-0 left-0 w-64"
      >
        {/* Close button — min 44×44px touch target */}
        <button
          type="button"
          onClick={onClose}
          aria-label="メニューを閉じる"
          className="absolute right-2 top-2 flex min-h-[44px] min-w-[44px] items-center justify-center text-foreground-secondary outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  )
}
