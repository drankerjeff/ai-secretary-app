'use client'

import { useTasks } from '@/hooks/tasks/useTasks'
import type { Task, Priority } from '@/types/task'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
}

const PRIORITY_BADGE: Record<Priority, { label: string; className: string }> = {
  high: { label: '高', className: 'bg-red-500/20 text-red-400' },
  medium: { label: '中', className: 'bg-yellow-500/20 text-yellow-400' },
  low: { label: '低', className: 'bg-green-500/20 text-green-400' },
}

function DueDateLabel({ dueDate }: { dueDate: string }) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(todayStart.getDate() + 1)
  const dayAfterStart = new Date(tomorrowStart)
  dayAfterStart.setDate(tomorrowStart.getDate() + 1)

  if (due >= todayStart && due < tomorrowStart) {
    return <span className="text-warning text-caption1 font-medium">今日</span>
  }
  if (due >= tomorrowStart && due < dayAfterStart) {
    return <span className="text-foreground-secondary text-caption1">明日</span>
  }
  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays)
    return (
      <span className="text-destructive text-caption1 font-medium">
        {overdueDays}日超過
      </span>
    )
  }

  const dateStr = due.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
  return <span className="text-foreground-tertiary text-caption1">{dateStr}</span>
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask } = useTasks()

  const isCompleted = task.status === 'completed'

  return (
    <div className="apple-card px-4 py-3 flex items-start gap-3">
      {/* Checkbox */}
      <button
        type="button"
        aria-label={isCompleted ? 'タスクを未完了にする' : 'タスクを完了にする'}
        aria-pressed={isCompleted}
        onClick={() => toggleTaskStatus(task.id)}
        className={[
          'mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
          'transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isCompleted
            ? 'bg-primary border-primary'
            : 'border-border hover:border-primary',
        ].join(' ')}
      >
        {isCompleted && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className={[
            'text-callout font-medium',
            isCompleted
              ? 'line-through text-foreground-tertiary'
              : 'text-foreground',
          ].join(' ')}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="text-footnote text-foreground-secondary line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {task.priority && (
            <span
              className={[
                'text-caption1 font-medium px-2 py-0.5 rounded-full',
                PRIORITY_BADGE[task.priority].className,
              ].join(' ')}
            >
              {PRIORITY_BADGE[task.priority].label}
            </span>
          )}
          {task.due_date && <DueDateLabel dueDate={task.due_date} />}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label="タスクを編集"
          onClick={() => onEdit(task)}
          className={[
            'inline-flex items-center justify-center min-w-[36px] min-h-[36px]',
            'rounded-lg text-foreground-secondary hover:text-foreground hover:bg-fill',
            'transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          ].join(' ')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="タスクを削除"
          onClick={() => deleteTask(task.id)}
          className={[
            'inline-flex items-center justify-center min-w-[36px] min-h-[36px]',
            'rounded-lg text-foreground-secondary hover:text-destructive hover:bg-destructive/10',
            'transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          ].join(' ')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
