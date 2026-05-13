'use client'

import { useState, useEffect, useCallback } from 'react'

// ---- Types ----

interface Branch {
  id: string
  name: string
  project_ref: string
  is_default: boolean
  status: string
  created_at: string
  preview_project_status: string
}

// ---- Status badge ----

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string }> = {
    ACTIVE_HEALTHY: { label: '稼働中' },
    FUNCTIONS_DEPLOYED: { label: '準備完了' },
    CREATING: { label: '作成中' },
    COMING_UP: { label: '起動中' },
    GOING_DOWN: { label: '停止中' },
    INACTIVE: { label: '停止中' },
  }
  const s = map[status] ?? { label: status }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-caption1 font-medium text-foreground-secondary">
      {s.label}
    </span>
  )
}

// ---- Branch row ----

function BranchRow({ branch, onDelete }: { branch: Branch; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    await onDelete(branch.id)
    setDeleting(false)
    setConfirming(false)
  }

  const date = new Date(branch.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 p-4">
      {/* Branch icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <IconBranch className="text-foreground-secondary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body font-semibold text-foreground truncate">{branch.name}</span>
          {branch.is_default && (
            <span className="px-2 py-0.5 text-caption1 font-medium text-foreground-secondary">
              デフォルト
            </span>
          )}
          <StatusBadge status={branch.status} />
        </div>
        <p className="text-caption1 text-foreground-tertiary mt-0.5">
          {branch.project_ref} &middot; 作成日 {date}
        </p>
      </div>

      {/* Delete */}
      {!branch.is_default && (
        <div className="shrink-0">
          {confirming ? (
            <div className="flex items-center gap-2">
              <span className="text-caption1 text-foreground-secondary">削除しますか?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-caption1 font-medium text-foreground disabled:opacity-50"
              >
                {deleting ? '削除中…' : '削除'}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="px-3 py-1.5 text-caption1 font-medium text-foreground-secondary"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-2 text-foreground-quaternary"
              aria-label={`${branch.name} を削除`}
            >
              <IconTrash />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ---- Main page ----

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)

  const fetchBranches = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/branches')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Branch一覧の取得に失敗しました')
      setBranches(Array.isArray(json) ? json : (json.branches ?? []))
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラー')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBranches() }, [fetchBranches])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setCreateError(null)
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? json.message ?? 'Branch作成に失敗しました')
      setNewName('')
      await fetchBranches()
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : '不明なエラー')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' })
    if (res.ok || res.status === 204) {
      setBranches(prev => prev.filter(b => b.id !== id))
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title2 font-bold text-foreground">Branch管理</h1>
        <p className="mt-1 text-subheadline text-foreground-secondary">
          Supabaseプレビューブランチの発行・管理
        </p>
      </div>

      {/* Create form */}
      <div className="p-5 space-y-3">
        <h2 className="text-headline font-semibold text-foreground">新規Branch発行</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="例: feature/new-ui"
            disabled={creating}
            className="flex-1 px-3.5 py-2.5 text-body text-foreground bg-transparent outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2.5 text-subheadline font-semibold text-foreground disabled:opacity-50"
          >
            {creating ? (
              <>
                <IconSpinner />
                作成中…
              </>
            ) : (
              <>
                <IconPlus />
                発行
              </>
            )}
          </button>
        </form>
        {createError && (
          <p className="text-caption1 text-red-400">{createError}</p>
        )}
      </div>

      {/* Branch list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-headline font-semibold text-foreground">
            既存のBranch
            {!loading && <span className="ml-2 text-footnote font-normal text-foreground-tertiary">({branches.length}件)</span>}
          </h2>
          <button
            onClick={fetchBranches}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-caption1 font-medium text-foreground-secondary disabled:opacity-50"
          >
            <IconRefresh className={loading ? 'animate-spin' : ''} />
            更新
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-foreground-tertiary">
            <IconSpinner />
            <span className="ml-2 text-subheadline">読み込み中…</span>
          </div>
        ) : error ? (
          <div className="p-5 text-center space-y-2">
            <p className="text-body text-foreground">{error}</p>
            <p className="text-caption1 text-foreground-tertiary">
              .env.local に SUPABASE_PROJECT_REF と SUPABASE_ACCESS_TOKEN が設定されているか確認してください
            </p>
          </div>
        ) : branches.length === 0 ? (
          <div className="p-10 text-center text-foreground-tertiary text-subheadline">
            Branchがありません
          </div>
        ) : (
          <div className="space-y-2">
            {branches.map(branch => (
              <BranchRow key={branch.id} branch={branch} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Icons ----

function IconBranch({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function IconRefresh({ className = '' }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
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
