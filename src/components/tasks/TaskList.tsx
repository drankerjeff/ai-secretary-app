'use client'

import { Spinner } from '@/components/ui/Spinner'
import { TaskItem } from './TaskItem'
import { useTasks } from '@/hooks/tasks/useTasks'
import type { Task } from '@/types/task'

interface TaskListProps {
  onEdit: (task: Task) => void
}

export function TaskList({ onEdit }: TaskListProps) {
  const { filteredTasks, isLoading } = useTasks()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="apple-inset rounded-lg p-10 text-center space-y-2">
        <p className="text-title3 text-foreground-tertiary" aria-hidden="true">✓</p>
        <p className="text-subheadline font-semibold text-foreground">タスクはありません</p>
        <p className="text-footnote text-foreground-tertiary">
          「タスクを追加」ボタンから新しいタスクを作成してください。
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2" role="list" aria-label="タスク一覧">
      {filteredTasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskItem task={task} onEdit={onEdit} />
        </div>
      ))}
    </div>
  )
}
