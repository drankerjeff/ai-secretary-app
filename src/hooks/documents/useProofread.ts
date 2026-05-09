'use client'

import { useState, useCallback } from 'react'
import type { DocumentType, ProofreadResult, ProofreadMetadata } from '@/types/document'

interface HistoryItem {
  id: string
  title: string
  original_content: string | null
  processed_content: string | null
  metadata: ProofreadMetadata | null
  created_at: string
}

export function useProofread() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ProofreadResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const proofread = useCallback(async (content: string, documentType: DocumentType) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/documents/proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, documentType }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `エラーが発生しました (${res.status})`)
      }
      const data: ProofreadResult = await res.json()
      setResult(data)
      setHistory((prev) => {
        const item: HistoryItem = {
          id: data.documentId,
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          original_content: data.original,
          processed_content: data.corrected,
          metadata: {
            suggestions: data.suggestions,
            documentType,
          },
          created_at: data.createdAt,
        }
        return [item, ...prev]
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true)
    try {
      const res = await fetch('/api/documents/proofread')
      if (!res.ok) {
        throw new Error(`履歴の取得に失敗しました (${res.status})`)
      }
      const data: HistoryItem[] = await res.json()
      setHistory(data)
    } catch {
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const deleteHistory = useCallback(async (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
    try {
      const res = await fetch(`/api/documents/proofread/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error(`削除に失敗しました (${res.status})`)
      }
    } catch {
      await loadHistory()
    }
  }, [loadHistory])

  const clearResult = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    result,
    history,
    isLoadingHistory,
    proofread,
    loadHistory,
    deleteHistory,
    clearResult,
  }
}
