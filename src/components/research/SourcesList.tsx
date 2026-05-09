import type { Source } from '@/types/research'

interface SourcesListProps {
  sources: Source[]
}

function IconExternalLink() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export function SourcesList({ sources }: SourcesListProps) {
  if (sources.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-footnote font-semibold text-foreground-secondary uppercase tracking-wide">
        出典
      </p>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="apple-card p-3 space-y-1">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-footnote font-medium text-primary hover:underline"
            >
              <span className="truncate">{source.title}</span>
              <IconExternalLink />
            </a>
            <p className="text-caption1 text-foreground-tertiary truncate">
              {source.url}
            </p>
            {source.excerpt && (
              <p className="text-footnote text-foreground-secondary leading-relaxed">
                {source.excerpt}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
