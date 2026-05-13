'use client'

import { useState } from 'react'
import { TaskProvider } from '@/contexts/TaskContext'
import { TaskAlertBanner } from '@/components/tasks/TaskAlertBanner'
import { TaskFilter } from '@/components/tasks/TaskFilter'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useTasks } from '@/hooks/tasks/useTasks'
import type { Task, TaskInput } from '@/types/task'

function TasksContent() {
  const { createTask, updateTask, tasks } = useTasks()
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const twoDaysLater = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const alertCount = tasks.filter(
    (t) => t.status === 'pending' && t.due_date && new Date(t.due_date) <= twoDaysLater
  ).length
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  const handleSubmit = async (input: TaskInput) => {
    if (editingTask) {
      await updateTask(editingTask.id, input)
    } else {
      await createTask(input)
    }
    handleClose()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-title1 font-semibold text-foreground">タスク管理</h1>
            {pendingCount > 0 && (
              <>
                <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-1.5 text-footnote font-semibold text-foreground">
                  {pendingCount}
                </span>
                <span className="text-callout text-foreground-secondary">残りのタスク</span>
                {alertCount > 0 && (
                  <span className="text-callout font-semibold text-destructive">
                    ⚠ {alertCount}件が期限2日以内
                  </span>
                )}
              </>
            )}
          </div>
          <p className="text-callout text-foreground-secondary">タスクの追加・管理ができます。</p>
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          タスクを追加
        </Button>
      </div>

      {/* Alert banner for tasks due within 2 days */}
      <TaskAlertBanner />

      {/* Filters */}
      <TaskFilter />

      {/* Task list */}
      <TaskList onEdit={openEdit} />

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        title={editingTask ? 'タスクを編集' : 'タスクを追加'}
        size="md"
      >
        <TaskForm
          task={editingTask ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  )
}

export default function TasksPage() {
  return (
    <TaskProvider>
      <TasksContent />
    </TaskProvider>
  )
}
