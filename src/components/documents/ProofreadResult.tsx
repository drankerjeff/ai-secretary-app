import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import type { ProofreadResult as ProofreadResultType, Suggestion } from '@/types/document'

interface ProofreadResultProps {
  result: ProofreadResultType
  onClear: () => void
}

type SuggestionType = Suggestion['type']
type SuggestionState = 'pending' | 'accepted' | 'rejected'

const typeConfig: Record<SuggestionType, { label: string; badgeClass: string }> = {
  spelling:    { label: '誤字',   badgeClass: 'bg-destructive/15 text-destructive' },
  grammar:     { label: '文法',   badgeClass: 'bg-warning/15 text-warning' },
  style:       { label: '文体',   badgeClass: 'bg-primary/15 text-primary' },
  punctuation: { label: '句読点', badgeClass: 'bg-success/15 text-success' },
}

export function ProofreadResult({ result, onClear }: ProofreadResultProps) {
  const [copied, setCopied] = useState(false)
  const [states, setStates] = useState<Record<number, SuggestionState>>({})
  const [correctedText, setCorrectedText] = useState(result.corrected)
  const [activeFilter, setActiveFilter] = useState<SuggestionType | 'all'>('all')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(correctedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const accept = (index: number) => {
    const prev = states[index] ?? 'pending'
    if (prev === 'rejected') {
      const s = result.suggestions[index]
      setCorrectedText((t) => t.replace(s.original, s.suggested))
    }
    setStates((p) => ({ ...p, [index]: 'accepted' }))
  }

  const reject = (index: number) => {
    const prev = states[index] ?? 'pending'
    if (prev !== 'rejected') {
      const s = result.suggestions[index]
      setCorrectedText((t) => t.replace(s.suggested, s.original))
    }
    setStates((p) => ({ ...p, [index]: 'rejected' }))
  }

  const presentTypes = useMemo(
    () => [...new Set(result.suggestions.map((s) => s.type))],
    [result.suggestions]
  )

  const filtered = activeFilter === 'all'
    ? result.suggestions
    : result.suggestions.filter((s) => s.type === activeFilter)

  const counts = useMemo(() => {
    const c: Partial<Record<SuggestionType, number>> = {}
    for (const s of result.suggestions) c[s.type] = (c[s.type] ?? 0) + 1
    return c
  }, [result.suggestions])

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between">
        <p className="text-subheadline font-semibold text-foreground">修正後</p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? 'コピーしました' : 'コピー'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            クリア
          </Button>
        </div>
      </div>

      {/* corrected text */}
      <div className="apple-inset rounded-lg p-4">
        <pre className="whitespace-pre-wrap text-callout text-foreground font-sans leading-relaxed">
          {correctedText}
        </pre>
      </div>

      {/* suggestions */}
      {result.suggestions.length > 0 ? (
        <div className="space-y-3 flex-1">
          {/* filter tabs */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveFilter('all')}
                className={[
                  'px-3 py-1 rounded-full text-footnote font-medium transition-colors',
                  activeFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-background-secondary text-foreground-secondary hover:text-foreground',
                ].join(' ')}
              >
                すべて ({result.suggestions.length})
              </button>
              {presentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={[
                    'px-3 py-1 rounded-full text-footnote font-medium transition-colors',
                    activeFilter === type
                      ? 'bg-primary text-white'
                      : 'bg-background-secondary text-foreground-secondary hover:text-foreground',
                  ].join(' ')}
                >
                  {typeConfig[type].label} ({counts[type]})
                </button>
              ))}
            </div>
            <button
              onClick={() => result.suggestions.forEach((_, i) => accept(i))}
              className="shrink-0 px-3 py-1 rounded-full text-footnote font-medium bg-success/15 text-success hover:bg-success/25 transition-colors"
            >
              すべて採用
            </button>
          </div>

          {/* suggestion cards */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filtered.map((suggestion) => {
              const realIndex = result.suggestions.indexOf(suggestion)
              const state = states[realIndex] ?? 'pending'
              const { label, badgeClass } = typeConfig[suggestion.type]

              return (
                <div
                  key={realIndex}
                  className={[
                    'apple-card p-3 space-y-2 transition-opacity',
                    state === 'rejected' ? 'opacity-40' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <span
                        className={[
                          'inline-flex items-center px-2 py-0.5 rounded-full text-caption1 font-semibold',
                          badgeClass,
                        ].join(' ')}
                      >
                        {label}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-footnote text-foreground line-through decoration-destructive">
                          {suggestion.original}
                        </span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-foreground-tertiary shrink-0"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                        <span className="text-footnote font-semibold text-foreground">
                          {suggestion.suggested}
                        </span>
                      </div>
                      <p className="text-caption1 text-foreground-secondary">
                        {suggestion.explanation}
                      </p>
                    </div>

                    {/* accept / reject */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => accept(realIndex)}
                        className={[
                          'flex items-center gap-1 px-2.5 py-1 rounded-md text-caption1 font-semibold transition-colors',
                          state === 'accepted'
                            ? 'bg-success text-white'
                            : 'bg-success/15 text-success hover:bg-success/25',
                        ].join(' ')}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        採用
                      </button>
                      <button
                        onClick={() => reject(realIndex)}
                        className={[
                          'flex items-center gap-1 px-2.5 py-1 rounded-md text-caption1 font-semibold transition-colors',
                          state === 'rejected'
                            ? 'bg-destructive text-white'
                            : 'bg-destructive/15 text-destructive hover:bg-destructive/25',
                        ].join(' ')}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        却下
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="apple-inset rounded-lg p-3 text-center">
          <p className="text-footnote text-foreground-secondary">
            修正箇所は見つかりませんでした
          </p>
        </div>
      )}
    </div>
  )
}
