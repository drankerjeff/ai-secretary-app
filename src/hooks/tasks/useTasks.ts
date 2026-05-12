import { useMemo } from 'react'
import { useTaskContext } from '@/contexts/TaskContext'
import type { Task, TaskFilters, TaskSort } from '@/types/task'

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

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  const keyword = filters.search.trim().toLowerCase()

  const filtered = tasks.filter((task) => {
    if (filters.status !== 'all' && task.status !== filters.status) return false
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false

    if (filters.due !== 'all') {
      if (!task.due_date) return false
      if (filters.due === 'today' && !isToday(task.due_date)) return false
      if (filters.due === 'week' && !isThisWeek(task.due_date)) return false
      if (filters.due === 'overdue' && !isOverdue(task.due_date)) return false
    }

    if (keyword) {
      const inTitle = task.title.toLowerCase().includes(keyword)
      const inDesc = task.description?.toLowerCase().includes(keyword) ?? false
      if (!inTitle && !inDesc) return false
    }

    return true
  })

  return applySortOrder(filtered, filters.sort)
}

function applySortOrder(tasks: Task[], sort: TaskSort): Task[] {
  const copy = [...tasks]
  switch (sort) {
    case 'due_asc':
      return copy.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })
    case 'due_desc':
      return copy.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
      })
    case 'priority_desc':
      return copy.sort((a, b) => {
        const pa = a.priority ? (PRIORITY_ORDER[a.priority] ?? 99) : 99
        const pb = b.priority ? (PRIORITY_ORDER[b.priority] ?? 99) : 99
        return pa - pb
      })
    case 'created_desc':
    default:
      return copy.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
  }
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
