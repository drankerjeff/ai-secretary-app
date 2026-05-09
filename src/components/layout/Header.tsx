'use client'

import * as React from 'react'
import { UserMenu } from './UserMenu'

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

// ---- SearchPopover ----

function SearchPopover() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Auto-focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    } else {
      setQuery('')
    }
  }, [open])

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {/* Icon button */}
      <button
        type="button"
        aria-label="検索"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={[
          'relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[--radius]',
          'transition-colors duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring',
          open
            ? 'bg-fill text-foreground'
            : 'text-foreground-secondary hover:bg-fill-quaternary hover:text-foreground',
        ].join(' ')}
      >
        <IconSearch />
      </button>

      {/* Dropdown search box */}
      {open && (
        <div
          role="search"
          aria-label="検索ボックス"
          className="absolute right-0 top-[calc(100%+8px)] w-72 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="apple-glass rounded-[--radius-lg] shadow-lg overflow-hidden">
            {/* Input row */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-subtle">
              <span className="text-foreground-tertiary shrink-0" aria-hidden="true">
                <IconSearch />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="検索..."
                aria-label="検索キーワード"
                className={[
                  'flex-1 bg-transparent text-callout text-foreground',
                  'placeholder:text-foreground-tertiary',
                  'outline-none border-none',
                ].join(' ')}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="クリア"
                  className="text-foreground-tertiary hover:text-foreground transition-colors duration-250 shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Hint / empty state */}
            <div className="px-4 py-3">
              {query ? (
                <p className="text-footnote text-foreground-secondary">
                  「<span className="text-foreground font-medium">{query}</span>」を検索中...
                </p>
              ) : (
                <p className="text-footnote text-foreground-tertiary">
                  キーワードを入力してください
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---- Header ----

interface HeaderProps {
  title?: string
  onMenuClick: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border-subtle px-4 apple-glass">
      {/* Hamburger (mobile only) */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="メニューを開く"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[--radius] text-foreground-secondary transition-colors duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-fill-quaternary hover:text-foreground lg:hidden outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title */}
      {title && (
        <h1 className="text-headline font-semibold text-foreground flex-1 truncate">{title}</h1>
      )}
      {!title && <div className="flex-1" />}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search popover */}
        <SearchPopover />

        {/* Notification bell */}
        <button
          type="button"
          aria-label="通知"
          className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[--radius] text-foreground-secondary transition-colors duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-fill-quaternary hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <IconBell />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" aria-label="未読通知あり" />
        </button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  )
}
