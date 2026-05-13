'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function IconBranch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  )
}

function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function BranchPublishPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? json.message ?? 'Branch発行に失敗しました')
      setSuccess(true)
      setName('')
      setTimeout(() => router.push('/dashboard/branches'), 1500)
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラー')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-title2 font-bold text-foreground">Branchの発行</h1>
        <p className="mt-1 text-subheadline text-foreground-secondary">
          新しいSupabaseプレビューブランチを発行します
        </p>
      </div>

      <div className="p-6 space-y-5">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-headline font-semibold text-foreground">発行しました</p>
            <p className="text-subheadline text-foreground-secondary">Branch管理ページに移動します…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="branch-name" className="text-footnote font-medium text-foreground-secondary">
                Branch名
              </label>
              <div className="flex items-center gap-3 px-3.5 py-2.5">
                <span className="text-foreground-quaternary shrink-0">
                  <IconBranch />
                </span>
                <input
                  id="branch-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="例: feature/new-ui"
                  disabled={submitting}
                  className="flex-1 bg-transparent text-body text-foreground placeholder:text-foreground-quaternary outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <p className="text-caption1 text-red-400">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="flex items-center gap-2 px-5 py-2.5 text-subheadline font-semibold text-foreground disabled:opacity-50"
              >
                {submitting ? <><IconSpinner />発行中…</> : '発行する'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/branches')}
                className="px-4 py-2.5 text-subheadline font-medium text-foreground-secondary"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
