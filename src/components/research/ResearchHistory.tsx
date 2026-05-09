import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import type { ResearchResult, SearchType } from '@/types/research'

interface ResearchHistoryProps {
  history: ResearchResult[]
  isLoading: boolean
  onSelect: (item: ResearchResult) => void
  onDelete: (id: string) => Promise<void>
}

const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  general: '総合',
  latest: '最新',
  academic: '学術',
  news: 'ニュース',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function ResearchHistory({
  history,
  isLoading,
  onSelect,
  onDelete,
}: ResearchHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" color="primary" />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="apple-inset rounded-lg p-6 text-center">
        <p className="text-subheadline text-foreground-secondary">
          リサーチ履歴はありません
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.map((item) => (
        <div
          key={item.id}
          className="group apple-card p-3 flex items-center gap-3 cursor-pointer hover:brightness-110 transition-all"
          onClick={() => onSelect(item)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(item)
            }
          }}
          aria-label={`リサーチ結果を表示: ${item.query}`}
        >
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-subheadline font-medium text-foreground truncate">
                {item.query}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-caption1 bg-primary/15 text-primary shrink-0">
                {SEARCH_TYPE_LABELS[item.search_type]}
              </span>
            </div>
            <p className="text-caption1 text-foreground-tertiary">
              {formatDate(item.created_at)}
            </p>
          </div>
          <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item.id)
              }}
              className="text-destructive hover:bg-destructive/10"
              aria-label={`削除: ${item.query}`}
            >
              削除
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
