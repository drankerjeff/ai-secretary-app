'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { TimeScrollPicker } from '@/components/tasks/TimeScrollPicker'
import type { Task, TaskInput, Priority } from '@/types/task'

interface TaskFormProps {
  task?: Task
  onSubmit: (input: TaskInput) => Promise<void>
  onCancel: () => void
}

const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

// 30分単位のスロット: ["00:00", "00:30", "01:00", ..., "23:30"]
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

function parseDatetime(isoString: string) {
  const local = isoString.slice(0, 16) // "YYYY-MM-DDTHH:mm"
  const date = local.slice(0, 10)
  const h = local.slice(11, 13)
  const m = Number(local.slice(14, 16)) < 30 ? '00' : '30'
  return { date, time: `${h}:${m}` }
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<string>(task?.priority ?? '')
  const initial = task?.due_date ? parseDatetime(task.due_date) : null
  const [dueDate, setDueDate] = useState(initial?.date ?? '')
  const [dueTime, setDueTime] = useState(initial?.time ?? '09:00')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setError(null)
    setIsSubmitting(true)
    try {
      const input: TaskInput = {
        title: title.trim(),
        ...(description.trim() && { description: description.trim() }),
        ...(priority && { priority: priority as Priority }),
        ...(dueDate && { due_date: new Date(`${dueDate}T${dueTime}`).toISOString() }),
      }
      await onSubmit(input)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error">{error}</Alert>}

      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクのタイトルを入力"
        required
        autoFocus
      />

      <Textarea
        label="説明（任意）"
        value={description ?? ''}
        onChange={(value) => setDescription(value)}
        placeholder="タスクの詳細を入力"
        rows={3}
      />

      <Select
        label="優先度"
        options={PRIORITY_OPTIONS}
        value={priority}
        onChange={setPriority}
        placeholder="優先度を選択"
      />

      {/* 期限日時: 日付 + 統合時刻ピッカーを横並び */}
      <div className="flex flex-col gap-1.5">
        <span className="text-subheadline font-medium text-foreground">期限日時</span>
        <div className="flex items-center gap-3">
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={[
              'flex-1 rounded-lg bg-background-secondary border border-border',
              'text-callout text-foreground px-3.5 py-2.5',
              'transition-all duration-250 [color-scheme:dark]',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
            ].join(' ')}
          />
          <TimeScrollPicker
            items={TIME_SLOTS}
            value={dueTime}
            onChange={setDueTime}
            disabled={!dueDate}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting} disabled={!title.trim()}>
          {task ? '保存' : '作成'}
        </Button>
      </div>
    </form>
  )
}
