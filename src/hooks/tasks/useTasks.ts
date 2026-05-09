import { useMemo } from 'react'
import { useTaskContext } from '@/contexts/TaskContext'
import type { Task, TaskFilters } from '@/types/task'

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)
  return date >= startOfWeek && date < endOfWeek
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => {
    if (filters.status !== 'all' && task.status !== filters.status) return false
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false

    if (filters.due !== 'all') {
      if (!task.due_date) return false
      if (filters.due === 'today' && !isToday(task.due_date)) return false
      if (filters.due === 'week' && !isThisWeek(task.due_date)) return false
      if (filters.due === 'overdue' && !isOverdue(task.due_date)) return false
    }

    return true
  })
}

export function useTasks() {
  const { tasks, isLoading, filters, setFilters, createTask, updateTask, deleteTask, toggleTaskStatus, reload } =
    useTaskContext()

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters])

  return {
    tasks,
    filteredTasks,
    isLoading,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    reload,
  }
}
