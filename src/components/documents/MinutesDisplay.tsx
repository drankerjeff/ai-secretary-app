'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { MinutesDocument, NextAction } from '@/types/minutes'

interface MinutesDisplayProps {
  minutes: MinutesDocument
  onUpdate: (data: Partial<MinutesDocument>) => Promise<void>
  onDelete: () => void
}

interface EditState {
  title: string
  summary: string
  discussed_topics: string[]
  decisions: string[]
  next_actions: NextAction[]
}

function initEditState(m: MinutesDocument): EditState {
  return {
    title: m.title,
    summary: m.summary ?? '',
    discussed_topics: m.discussed_topics.length > 0 ? [...m.discussed_topics] : [''],
    decisions: m.decisions.length > 0 ? [...m.decisions] : [''],
    next_actions: m.next_actions.length > 0 ? [...m.next_actions] : [{ task: '' }],
  }
}

export function MinutesDisplay({ minutes, onUpdate, onDelete }: MinutesDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [transcriptionOpen, setTranscriptionOpen] = useState(false)
  const [edit, setEdit] = useState<EditState>(() => initEditState(minutes))

  const startEdit = () => {
    setEdit(initEditState(minutes))
    setIsEditing(true)
  }

  const cancelEdit = () => setIsEditing(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate({
        title: edit.title.trim() || minutes.title,
        summary: edit.summary.trim() || undefined,
        discussed_topics: edit.discussed_topics.map((t) => t.trim()).filter(Boolean),
        decisions: edit.decisions.map((d) => d.trim()).filter(Boolean),
        next_actions: edit.next_actions.filter((a) => a.task.trim()),
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  // --- list helpers ---
  const setTopics = (fn: (prev: string[]) => string[]) =>
    setEdit((e) => ({ ...e, discussed_topics: fn(e.discussed_topics) }))
  const setDecisions = (fn: (prev: string[]) => string[]) =>
    setEdit((e) => ({ ...e, decisions: fn(e.decisions) }))
  const setActions = (fn: (prev: NextAction[]) => NextAction[]) =>
    setEdit((e) => ({ ...e, next_actions: fn(e.next_actions) }))

  const inputClass = [
    'w-full rounded-lg bg-background-secondary border border-border text-callout text-foreground',
    'placeholder:text-foreground-tertiary px-3 py-1.5',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
  ].join(' ')

  const sectionLabel = 'text-footnote font-semibold text-foreground-secondary uppercase tracking-wider'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        {isEditing ? (
          <input
            autoFocus
            value={edit.title}
            onChange={(e) => setEdit((prev) => ({ ...prev, title: e.target.value }))}
            className={[inputClass, 'text-title3 font-semibold flex-1'].join(' ')}
          />
        ) : (
          <h2 className="text-title3 font-semibold text-foreground flex-1 min-w-0 truncate">
            {minutes.title}
          </h2>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={isSaving}>
                キャンセル
              </Button>
              <Button variant="primary" size="sm" loading={isSaving} onClick={handleSave}>
                保存
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={startEdit}>
                編集
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                削除
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {(isEditing || minutes.summary) && (
        <section className="space-y-2">
          <p className={sectionLabel}>サマリー</p>
          {isEditing ? (
            <textarea
              rows={4}
              value={edit.summary}
              onChange={(e) => setEdit((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="サマリーを入力..."
              className={[inputClass, 'resize-none'].join(' ')}
            />
          ) : (
            <div className="apple-inset rounded-xl p-4">
              <p className="text-callout text-foreground leading-relaxed">{minutes.summary}</p>
            </div>
          )}
        </section>
      )}

      {/* Discussed topics */}
      {(isEditing || minutes.discussed_topics.length > 0) && (
        <section className="space-y-2.5">
          <p className={sectionLabel}>議論された内容</p>
          {isEditing ? (
            <div className="space-y-2">
              {edit.discussed_topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={topic}
                    onChange={(e) => setTopics((prev) => prev.map((t, j) => j === i ? e.target.value : t))}
                    placeholder={`議題 ${i + 1}`}
                    className={inputClass}
                  />
                  <button
                    onClick={() => setTopics((prev) => prev.filter((_, j) => j !== i))}
                    className="shrink-0 text-foreground-tertiary hover:text-destructive transition-colors"
                    aria-label="削除"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setTopics((prev) => [...prev, ''])}
                className="text-footnote text-primary hover:underline"
              >
                + 追加
              </button>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {minutes.discussed_topics.map((topic, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span className="text-callout text-foreground">{topic}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Decisions */}
      {(isEditing || minutes.decisions.length > 0) && (
        <section className="space-y-2.5">
          <p className={sectionLabel}>決定事項</p>
          {isEditing ? (
            <div className="space-y-2">
              {edit.decisions.map((decision, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={decision}
                    onChange={(e) => setDecisions((prev) => prev.map((d, j) => j === i ? e.target.value : d))}
                    placeholder={`決定事項 ${i + 1}`}
                    className={inputClass}
                  />
                  <button
                    onClick={() => setDecisions((prev) => prev.filter((_, j) => j !== i))}
                    className="shrink-0 text-foreground-tertiary hover:text-destructive transition-colors"
                    aria-label="削除"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setDecisions((prev) => [...prev, ''])}
                className="text-footnote text-primary hover:underline"
              >
                + 追加
              </button>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {minutes.decisions.map((decision, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-success" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-callout text-foreground">{decision}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Next actions */}
      {(isEditing || minutes.next_actions.length > 0) && (
        <section className="space-y-2.5">
          <p className={sectionLabel}>ネクストアクション</p>
          {isEditing ? (
            <div className="space-y-3">
              {edit.next_actions.map((action, i) => (
                <div key={i} className="apple-inset rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={action.task}
                      onChange={(e) => setActions((prev) => prev.map((a, j) => j === i ? { ...a, task: e.target.value } : a))}
                      placeholder="タスク内容"
                      className={inputClass}
                    />
                    <button
                      onClick={() => setActions((prev) => prev.filter((_, j) => j !== i))}
                      className="shrink-0 text-foreground-tertiary hover:text-destructive transition-colors"
                      aria-label="削除"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={action.assignee ?? ''}
                      onChange={(e) => setActions((prev) => prev.map((a, j) => j === i ? { ...a, assignee: e.target.value } : a))}
                      placeholder="担当者"
                      className={inputClass}
                    />
                    <input
                      value={action.due_date ?? ''}
                      onChange={(e) => setActions((prev) => prev.map((a, j) => j === i ? { ...a, due_date: e.target.value } : a))}
                      placeholder="期日"
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setActions((prev) => [...prev, { task: '' }])}
                className="text-footnote text-primary hover:underline"
              >
                + 追加
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {minutes.next_actions.map((action, i) => (
                <div key={i} className="apple-inset rounded-lg px-4 py-3 space-y-1">
                  <p className="text-callout font-medium text-foreground">{action.task}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {action.assignee && (
                      <span className="flex items-center gap-1.5 text-footnote text-foreground-secondary">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        {action.assignee}
                      </span>
                    )}
                    {action.due_date && (
                      <span className="flex items-center gap-1.5 text-footnote text-foreground-secondary">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {action.due_date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Transcription (collapsible) */}
      {minutes.transcription && (
        <section className="space-y-2">
          <button
            onClick={() => setTranscriptionOpen((o) => !o)}
            className="flex items-center gap-2 text-footnote font-semibold text-foreground-secondary hover:text-foreground transition-colors"
            aria-expanded={transcriptionOpen}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={['transition-transform duration-200', transcriptionOpen ? 'rotate-90' : ''].join(' ')}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            文字起こし全文
          </button>
          {transcriptionOpen && (
            <div className="apple-inset rounded-xl p-4 max-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-footnote text-foreground-secondary font-sans leading-relaxed">
                {minutes.transcription}
              </pre>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
