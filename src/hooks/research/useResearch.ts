'use client'

import { useState, useCallback } from 'react'
import type { ResearchResult, SearchType } from '@/types/research'

export function useResearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [history, setHistory] = useState<ResearchResult[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const search = useCallback(async (query: string, searchType: SearchType) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, searchType }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `エラーが発生しました (${res.status})`)
      }
      const data: ResearchResult = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true)
    try {
      const res = await fetch('/api/research')
      if (!res.ok) {
        throw new Error(`履歴の取得に失敗しました (${res.status})`)
      }
      const data: ResearchResult[] = await res.json()
      setHistory(data)
    } catch {
      // silently fail — history is non-critical
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const deleteResearch = useCallback(
    async (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id))
      try {
        const res = await fetch(`/api/research/${id}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          throw new Error(`削除に失敗しました (${res.status})`)
        }
      } catch {
        await loadHistory()
      }
    },
    [loadHistory]
  )

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  const restoreFromHistory = useCallback((item: ResearchResult) => {
    setResult(item)
    setError(null)
  }, [])

  return {
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
  }
}
