'use client'

import { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'video/mp4', 'video/webm', 'audio/webm']
const ACCEPTED_EXTENSIONS = '.mp3,.wav,.m4a,.mp4,.webm'
const MAX_BYTES = 200 * 1024 * 1024 // 200 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export interface AudioUploaderProps {
  onUpload: (file: File, title?: string) => Promise<void>
  isUploading: boolean
  error: string | null
}

export function AudioUploader({ onUpload, isUploading, error }: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const validate = useCallback((file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const validExt = ['mp3', 'wav', 'm4a', 'mp4', 'webm'].includes(ext)
    const validType = ACCEPTED_TYPES.includes(file.type) || validExt
    if (!validType) return '対応していないファイル形式です。mp3, wav, m4a, mp4, webm をお使いください。'
    if (file.size > MAX_BYTES) return `ファイルサイズが上限 (200 MB) を超えています。`
    return null
  }, [])

  const handleFile = useCallback((file: File) => {
    const err = validate(file)
    if (err) {
      setLocalError(err)
      setSelectedFile(null)
      return
    }
    setLocalError(null)
    setSelectedFile(file)
  }, [validate])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected if needed
    e.target.value = ''
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    await onUpload(selectedFile, title.trim() || undefined)
    // Clear state on success — errors keep the form intact
    setSelectedFile(null)
    setTitle('')
  }

  const displayError = localError ?? error

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="音声ファイルをアップロード"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed',
          'px-6 py-10 cursor-pointer select-none transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/60 hover:bg-background-secondary',
        ].join(' ')}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isDragging ? 'text-primary' : 'text-foreground-tertiary'}
          aria-hidden="true"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>

        {selectedFile ? (
          <div className="text-center space-y-1">
            <p className="text-subheadline font-semibold text-foreground">{selectedFile.name}</p>
            <p className="text-footnote text-foreground-secondary">{formatBytes(selectedFile.size)}</p>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <p className="text-subheadline font-semibold text-foreground">
              ファイルをドロップするかクリックして選択
            </p>
            <p className="text-footnote text-foreground-tertiary">
              mp3, wav, m4a, mp4, webm — 最大 200 MB
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="sr-only"
          onChange={handleInputChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Title input */}
      <div className="space-y-1.5">
        <label htmlFor="minutes-title" className="text-footnote font-medium text-foreground-secondary">
          タイトル（任意）
        </label>
        <input
          id="minutes-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：2026年5月定例会議"
          className={[
            'w-full rounded-lg bg-background-secondary border border-border',
            'text-callout text-foreground placeholder:text-foreground-tertiary',
            'px-3.5 py-2.5',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
            'transition-all duration-250',
          ].join(' ')}
        />
      </div>

      {displayError && <Alert type="error">{displayError}</Alert>}

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="md"
          loading={isUploading}
          disabled={isUploading || !selectedFile}
          onClick={handleSubmit}
        >
          アップロードして文字起こし
        </Button>
      </div>
    </div>
  )
}
