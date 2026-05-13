'use client'

import { useEffect, useState, useCallback } from 'react'
import { AudioUploader } from '@/components/documents/AudioUploader'
import { TranscriptionProgress } from '@/components/documents/TranscriptionProgress'
import { MinutesList } from '@/components/documents/MinutesList'
import { MinutesDisplay } from '@/components/documents/MinutesDisplay'
import { useMinutes } from '@/hooks/documents/useMinutes'
import type { MinutesDocument } from '@/types/minutes'

export default function MinutesPage() {
  const {
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
  } = useMinutes()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    loadList()
  }, [loadList])

  const handleUpload = useCallback(async (file: File, title?: string) => {
    const id = await uploadMinutes(file, title)
    setSelectedId(id)
    pollStatus(id)
  }, [uploadMinutes, pollStatus])

  // Once polling finishes with a completed document, refresh the list
  useEffect(() => {
    if (pollingStatus && (pollingStatus.status === 'completed' || pollingStatus.status === 'failed')) {
      loadList()
    }
  }, [pollingStatus, loadList])

  const handleSelect = (id: string) => {
    setSelectedId(id)
  }

  const handleDelete = useCallback(async (id: string) => {
    await deleteMinutes(id)
    if (selectedId === id) setSelectedId(null)
  }, [deleteMinutes, selectedId])

  const handleUpdate = useCallback(async (data: Partial<MinutesDocument>) => {
    if (!selectedId) return
    await updateMinutes(selectedId, data)
  }, [updateMinutes, selectedId])

  const selectedMinutes = minutes.find((m) => m.id === selectedId) ?? null

  // While polling, show pollingStatus instead of stale list data
  const displayedDocument = pollingId === selectedId && pollingStatus
    ? pollingStatus
    : selectedMinutes

  const isPollingSelected = pollingId === selectedId && !!pollingStatus

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-title1 font-semibold text-foreground">議事録作成</h1>
        <p className="text-callout text-foreground-secondary">
          音声ファイルをアップロードすると AI が自動で文字起こしと議事録を生成します。
        </p>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left column */}
        <div className="space-y-4">
          {/* Upload card */}
          <div className="p-5 space-y-4">
            <p className="text-subheadline font-semibold text-foreground">音声ファイルのアップロード</p>
            <AudioUploader
              onUpload={handleUpload}
              isUploading={isUploading}
              error={uploadError}
            />
          </div>

          {/* Polling progress */}
          {isPollingSelected && pollingStatus && pollingStatus.status !== 'completed' && (
            <TranscriptionProgress
              status={pollingStatus.status}
              error={pollingStatus.error}
            />
          )}

          {/* Minutes list */}
          <div className="p-5 space-y-3">
            <p className="text-subheadline font-semibold text-foreground">議事録一覧</p>
            <MinutesList
              minutes={minutes}
              isLoading={isLoadingList}
              onSelect={handleSelect}
              onDelete={handleDelete}
              selectedId={selectedId}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="p-5 min-h-[480px]">
          {displayedDocument && displayedDocument.status === 'completed' ? (
            <MinutesDisplay
              minutes={displayedDocument}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(displayedDocument.id)}
            />
          ) : isPollingSelected && pollingStatus ? (
            /* Show progress in the right panel too while waiting */
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center">
              <TranscriptionProgress
                status={pollingStatus.status}
                error={pollingStatus.error}
              />
              <p className="text-footnote text-foreground-tertiary">
                完了次第ここに議事録が表示されます
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground-tertiary"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-subheadline text-foreground-secondary">
                議事録がここに表示されます
              </p>
              <p className="text-footnote text-foreground-tertiary">
                左から音声ファイルをアップロードするか、一覧から選択してください
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
