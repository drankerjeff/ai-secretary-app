'use client'

import { useRef, useEffect, useCallback } from 'react'

const ITEM_HEIGHT = 44
const VISIBLE_PADDING = 1 // items above/below center → 3 rows total

interface TimeScrollPickerProps {
  items: string[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TimeScrollPicker({ items, value, onChange, disabled }: TimeScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isProgrammatic = useRef(false)

  const scrollToIndex = useCallback((index: number, smooth = false) => {
    const el = containerRef.current
    if (!el) return
    isProgrammatic.current = true
    el.scrollTo({ top: index * ITEM_HEIGHT, behavior: smooth ? 'smooth' : 'instant' })
    setTimeout(() => { isProgrammatic.current = false }, 150)
  }, [])

  useEffect(() => {
    const index = items.indexOf(value)
    if (index >= 0) scrollToIndex(index)
  }, [value, items, scrollToIndex])

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return
    const el = containerRef.current
    if (!el) return
    const index = Math.round(el.scrollTop / ITEM_HEIGHT)
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    if (items[clamped] !== value) onChange(items[clamped])
  }, [items, value, onChange])

  const containerHeight = (VISIBLE_PADDING * 2 + 1) * ITEM_HEIGHT // 3 × 44 = 132px

  return (
    <div
      className={[
        'relative rounded-lg overflow-hidden border border-border bg-background-secondary',
        disabled ? 'opacity-40 pointer-events-none select-none' : 'select-none',
      ].join(' ')}
      style={{ height: containerHeight, width: 80 }}
    >
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: VISIBLE_PADDING * ITEM_HEIGHT,
          background: 'linear-gradient(to bottom, var(--background-secondary), transparent)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: VISIBLE_PADDING * ITEM_HEIGHT,
          background: 'linear-gradient(to top, var(--background-secondary), transparent)',
        }}
      />
      {/* Center highlight */}
      <div
        className="absolute inset-x-0 z-10 pointer-events-none border-t border-b border-primary/40 bg-primary/10"
        style={{ top: VISIBLE_PADDING * ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      {/* Scroll list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        <div style={{ height: VISIBLE_PADDING * ITEM_HEIGHT }} aria-hidden="true" />
        {items.map((item) => (
          <div
            key={item}
            role="option"
            aria-selected={item === value}
            className={[
              'flex items-center justify-center snap-center cursor-pointer transition-colors font-mono',
              item === value
                ? 'text-primary font-semibold text-callout'
                : 'text-foreground-secondary text-callout hover:text-foreground',
            ].join(' ')}
            style={{ height: ITEM_HEIGHT }}
            onClick={() => {
              onChange(item)
              scrollToIndex(items.indexOf(item), true)
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: VISIBLE_PADDING * ITEM_HEIGHT }} aria-hidden="true" />
      </div>
    </div>
  )
}
