'use client'

import * as React from 'react'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  fullWidth?: boolean
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  fullWidth = false,
  className = '',
}: TabsProps) {
  const tablistRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex((t) => t.id === tabId)

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = tabs[(currentIndex + 1) % tabs.length]
      onChange(next.id)
      const el = tablistRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-id="${next.id}"]`
      )
      el?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length]
      onChange(prev.id)
      const el = tablistRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-id="${prev.id}"]`
      )
      el?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(tabs[0].id)
      const el = tablistRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-id="${tabs[0].id}"]`
      )
      el?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      const last = tabs[tabs.length - 1]
      onChange(last.id)
      const el = tablistRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-id="${last.id}"]`
      )
      el?.focus()
    }
  }

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Navigation tabs"
      className={[
        'inline-flex bg-background-secondary rounded-lg p-1 gap-0.5',
        fullWidth ? 'w-full' : 'w-fit',
        className,
      ].join(' ')}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            data-tab-id={tab.id}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={[
              'inline-flex items-center justify-center gap-2',
              'text-subheadline font-medium px-3.5 py-2 rounded',
              'min-h-[44px]',
              'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              fullWidth ? 'flex-1' : '',
              isActive
                ? 'bg-background-elevated text-foreground shadow-sm'
                : 'text-foreground-secondary hover:text-foreground hover:bg-fill',
            ].join(' ')}
          >
            {tab.icon && (
              <span className="inline-flex shrink-0" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
