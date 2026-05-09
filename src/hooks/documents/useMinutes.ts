'use client'

import { useState, useCallback, useRef } from 'react'
import type { MinutesDocument } from '@/types/minutes'

const POLL_INTERVAL_MS = 5000

export function useMinutes() {
  const [minutes, setMinutes] = useState<MinutesDocument[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pollingId, setPollingId] = useState<string | null>(null)
  const [pollingStatus, setPollingStatus] = useState<MinutesDocument | null>(null)

  // Store the interval ref so we can clear it when polling should stop
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setPollingId(null)
  }, [])

  const loadList = useCallback(async () => {
    setIsLoadingList(true)
    try {
      const res = await fetch('/api/documents/minutes')
      if (!res.ok) throw new Error(`一覧の取得に失敗しました (${res.status})`)
      const data: MinutesDocument[] = await res.json()
      setMinutes(data)
    } catch {
      // Silent — list will remain stale; caller can retry
    } finally {
      setIsLoadingList(false)
    }
  }, [])

  const uploadMinutes = useCallback(async (file: File, title?: string): Promise<string> => {
    setIsUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (title) formData.append('title', title)

      const res = await fetch('/api/documents/minutes', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `アップロードに失敗しました (${res.status})`)
      }
      const data: { id: string; status: string } = await res.json()
      return data.id
    } catch (err) {
      const msg = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setUploadError(msg)
      throw err
    } finally {
      setIsUploading(false)
    }
  }, [])

  const pollStatus = useCallback((id: string) => {
    // Clear any existing polling first
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setPollingId(id)

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/documents/minutes/${id}/status`)
        if (!res.ok) return
        const doc: MinutesDocument = await res.json()
        setPollingStatus(doc)

        if (doc.status === 'completed' || doc.status === 'failed') {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setPollingId(null)
          // Refresh list so the new document appears
          setMinutes((prev) => {
            const exists = prev.some((m) => m.id === doc.id)
            if (exists) return prev.map((m) => (m.id === doc.id ? doc : m))
            return [doc, ...prev]
          })
        }
      } catch {
        // Keep polling — transient network errors should not stop the loop
      }
    }

    // Run immediately, then on interval
    fetchStatus()
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS)
  }, [])

  const deleteMinutes = useCallback(async (id: string) => {
    // Optimistic removal
    setMinutes((prev) => prev.filter((m) => m.id !== id))
    try {
      const res = await fetch(`/api/documents/minutes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`削除に失敗しました (${res.status})`)
    } catch {
      // Restore list on failure
      await loadList()
    }
  }, [loadList])

  const updateMinutes = useCallback(async (id: string, data: Partial<MinutesDocument>) => {
    const res = await fetch(`/api/documents/minutes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error ?? `更新に失敗しました (${res.status})`)
    }
    const updated: MinutesDocument = await res.json()
    setMinutes((prev) => prev.map((m) => (m.id === id ? updated : m)))
  }, [])

  return {
    minutes,
    isLoadingList,
    isUploading,
    uploadError,
    uploadMinutes,
    pollStatus,
    pollingId,
    pollingStatus,
    loadList,
    deleteMinutes,
    updateMinutes,
    stopPolling,
  }
}
