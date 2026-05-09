import { SourcesList } from '@/components/research/SourcesList'
import type { ResearchResult as ResearchResultType } from '@/types/research'

interface ResearchResultProps {
  result: ResearchResultType
  onClear?: () => void
}

export function ResearchResult({ result }: ResearchResultProps) {
  return (
    <div className="space-y-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-subheadline font-semibold text-foreground">検索結果</p>
      </div>

      {/* Query */}
      <div className="apple-inset rounded-lg p-3">
        <p className="text-footnote text-foreground-tertiary mb-1">検索クエリ</p>
        <p className="text-callout text-foreground-secondary">{result.query}</p>
      </div>

      {/* Overview */}
      <div className="space-y-1.5">
        <p className="text-footnote font-semibold text-foreground-secondary uppercase tracking-wide">
          概要
        </p>
        <p className="text-callout text-foreground leading-relaxed">
          {result.summary.overview}
        </p>
      </div>

      {/* Key Points */}
      {result.summary.key_points.length > 0 && (
        <div className="space-y-2">
          <p className="text-footnote font-semibold text-foreground-secondary uppercase tracking-wide">
            主要ポイント
          </p>
          <ul className="space-y-2">
            {result.summary.key_points.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="text-callout text-foreground leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Topics */}
      {result.summary.related_topics.length > 0 && (
        <div className="space-y-2">
          <p className="text-footnote font-semibold text-foreground-secondary uppercase tracking-wide">
            関連トピック
          </p>
          <div className="flex flex-wrap gap-2">
            {result.summary.related_topics.map((topic, index) => (
              <span
                key={index}
                className="bg-background-secondary text-foreground-secondary rounded-full px-3 py-1 text-footnote"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      <SourcesList sources={result.sources} />
    </div>
  )
}
