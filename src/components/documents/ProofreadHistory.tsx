import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import type { ProofreadMetadata } from '@/types/document'

interface HistoryItem {
  id: string
  title: string
  original_content: string | null
  processed_content: string | null
  metadata: ProofreadMetadata | null
  created_at: string
}

interface ProofreadHistoryProps {
  history: HistoryItem[]
  isLoading: boolean
  onDelete: (id: string) => Promise<void>
  onRestore: (item: HistoryItem) => void
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

export function ProofreadHistory({
  history,
  isLoading,
  onDelete,
  onRestore,
}: ProofreadHistoryProps) {
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
          校正履歴はまだありません
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.map((item) => {
        const suggestionCount = item.metadata?.suggestions.length ?? 0
        return (
          <div
            key={item.id}
            className="apple-card p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-subheadline font-medium text-foreground truncate">
                  {item.title || '(無題)'}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/15 text-primary text-caption1 font-semibold shrink-0">
                  {suggestionCount}件の修正
                </span>
              </div>
              <p className="text-footnote text-foreground-tertiary">
                {formatDate(item.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRestore(item)}
              >
                復元
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                削除
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
