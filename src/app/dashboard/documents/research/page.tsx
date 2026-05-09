'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ResearchResult } from '@/components/research/ResearchResult'
import { ResearchHistory } from '@/components/research/ResearchHistory'
import { useResearch } from '@/hooks/research/useResearch'
import type { ResearchResult as ResearchResultType } from '@/types/research'

const MAX_LENGTH = 500

function IconSearch() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary opacity-60"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

export default function ResearchPage() {
  const {
    isLoading,
    error,
    result,
    history,
    isLoadingHistory,
    search,
    loadHistory,
    deleteResearch,
    clearResult,
    restoreFromHistory,
  } = useResearch()

  const [query, setQuery] = useState('')

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleSubmit = async () => {
    if (!query.trim()) return
    await search(query, 'general')
    await loadHistory()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSelectHistory = (item: ResearchResultType) => {
    restoreFromHistory(item)
  }

  const isOverLimit = query.length > MAX_LENGTH

  // ── Result view ────────────────────────────────────────────────
  if (result) {
    return (
      <div className="space-y-4">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearResult}
            className="flex items-center gap-1.5 text-callout text-foreground-secondary hover:text-foreground transition-colors shrink-0"
            aria-label="検索画面に戻る"
          >
            <IconArrowLeft />
            新しい検索
          </button>
          <div className="flex-1 apple-inset rounded-lg px-4 py-2 min-w-0">
            <p className="text-callout text-foreground truncate">{result.query}</p>
          </div>
        </div>

        {/* Full-width results */}
        <div className="apple-card p-6">
          <ResearchResult result={result} />
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="apple-card p-5 space-y-3">
            <h2 className="text-headline font-semibold text-foreground">リサーチ履歴</h2>
            <ResearchHistory
              history={history}
              isLoading={isLoadingHistory}
              onSelect={handleSelectHistory}
              onDelete={deleteResearch}
            />
          </div>
        )}
      </div>
    )
  }

  // ── Search view (Google-style) ─────────────────────────────────
  return (
    <div className="flex flex-col items-center pt-16 pb-12 space-y-8 min-h-[70vh]">
      {/* Title + icon */}
      <div className="flex flex-col items-center gap-3 text-center">
        <IconSearch />
        <div className="space-y-1">
          <h1 className="text-largeTitle font-bold text-foreground">リサーチ</h1>
          <p className="text-callout text-foreground-secondary">
            AI がトピックを調査し、要点と出典をまとめます。
          </p>
        </div>
      </div>

      {/* Search box */}
      <div className="w-full max-w-2xl space-y-3">
        <div className="space-y-1">
          <textarea
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="調査したいトピックや質問を入力してください..."
            className={[
              'w-full rounded-xl bg-background-secondary border text-callout text-foreground',
              'placeholder:text-foreground-tertiary px-4 py-3 resize-none',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
              'transition-all duration-250',
              isOverLimit ? 'border-destructive' : 'border-border',
            ].join(' ')}
          />
          <div className="flex items-center justify-between">
            <p className="text-caption1 text-foreground-quaternary">⌘+Enter で検索</p>
            <span
              className={[
                'text-footnote',
                isOverLimit ? 'text-destructive' : 'text-foreground-tertiary',
              ].join(' ')}
            >
              {query.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="md"
            loading={isLoading}
            disabled={isLoading || !query.trim() || isOverLimit}
            onClick={handleSubmit}
          >
            AI でリサーチする
          </Button>
        </div>
      </div>

      {/* History */}
      {(history.length > 0 || isLoadingHistory) && (
        <div className="w-full max-w-2xl">
          <div className="border-t border-border pt-6 space-y-3">
            <h2 className="text-headline font-semibold text-foreground">リサーチ履歴</h2>
            <ResearchHistory
              history={history}
              isLoading={isLoadingHistory}
              onSelect={handleSelectHistory}
              onDelete={deleteResearch}
            />
          </div>
        </div>
      )}
    </div>
  )
}
