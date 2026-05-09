'use client'

import { Spinner } from '@/components/ui/Spinner'
import type { MinutesDocument } from '@/types/minutes'

interface StatusBadgeProps {
  status: MinutesDocument['status']
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'completed') {
    return (
      <span className="text-caption1 font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
        完了
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="text-caption1 font-semibold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
        失敗
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-caption1 font-semibold px-2 py-0.5 rounded-full bg-warning/15 text-warning">
      <Spinner size="sm" color="muted" />
      処理中
    </span>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export interface MinutesListProps {
  minutes: MinutesDocument[]
  isLoading: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  selectedId: string | null
}

export function MinutesList({ minutes, isLoading, onSelect, onDelete, selectedId }: MinutesListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="md" color="primary" />
      </div>
    )
  }

  if (minutes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground-tertiary"
          aria-hidden="true"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        <p className="text-subheadline text-foreground-secondary">議事録がありません</p>
        <p className="text-footnote text-foreground-tertiary">
          音声ファイルをアップロードして議事録を作成してください
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2" role="list">
      {minutes.map((doc) => (
        <li key={doc.id}>
          <div
            className={[
              'group flex items-start justify-between gap-3 rounded-xl px-4 py-3 cursor-pointer',
              'transition-colors duration-150',
              selectedId === doc.id
                ? 'bg-primary/10 border border-primary/30'
                : 'apple-inset hover:bg-background-tertiary border border-transparent',
            ].join(' ')}
            onClick={() => onSelect(doc.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(doc.id) }}
            aria-pressed={selectedId === doc.id}
            aria-label={`議事録: ${doc.title}`}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-callout font-semibold text-foreground truncate">{doc.title}</p>
              <p className="text-caption1 text-foreground-tertiary">{formatDate(doc.created_at)}</p>
              <StatusBadge status={doc.status} />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(doc.id)
              }}
              aria-label={`${doc.title} を削除`}
              className={[
                'shrink-0 mt-0.5 p-1.5 rounded-lg text-foreground-tertiary',
                'hover:text-destructive hover:bg-destructive/10',
                'opacity-0 group-hover:opacity-100 transition-all duration-150',
                'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              ].join(' ')}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
