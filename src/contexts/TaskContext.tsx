'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import {
  getTasks,
  createTask as dbCreateTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  toggleTaskStatus as dbToggleTaskStatus,
} from '@/lib/supabase/tasks'
import type { Task, TaskFilters, TaskInput } from '@/types/task'

interface TaskContextType {
  tasks: Task[]
  isLoading: boolean
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  createTask: (input: TaskInput) => Promise<void>
  updateTask: (id: string, input: Partial<TaskInput>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskStatus: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  due: 'all',
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS)

  const load = useCallback(async () => {
    if (!user) {
      setTasks([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const { data, error } = await getTasks(user.id)
    if (!error && data) {
      setTasks(data as Task[])
    }
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const createTask = useCallback(
    async (input: TaskInput) => {
      if (!user) return

      // Optimistic insert with a temporary id
      const tempId = `temp-${Date.now()}`
      const optimistic: Task = {
        id: tempId,
        user_id: user.id,
        title: input.title,
        description: input.description ?? null,
        priority: input.priority ?? null,
        due_date: input.due_date ?? null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setTasks((prev) => [optimistic, ...prev])

      const { data, error } = await dbCreateTask({
        user_id: user.id,
        title: input.title,
        description: input.description ?? null,
        priority: input.priority ?? null,
        due_date: input.due_date ?? null,
      })

      if (error || !data) {
        // Roll back on failure
        setTasks((prev) => prev.filter((t) => t.id !== tempId))
        throw error ?? new Error('Failed to create task')
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === tempId ? (data as Task) : t))
      )
    },
    [user]
  )

  const updateTask = useCallback(
    async (id: string, input: Partial<TaskInput>) => {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ...input,
                description: input.description !== undefined ? input.description : t.description,
                priority: input.priority !== undefined ? input.priority : t.priority,
                due_date: input.due_date !== undefined ? input.due_date : t.due_date,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      )

      const { data, error } = await dbUpdateTask(id, {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.priority !== undefined && { priority: input.priority }),
        ...(input.due_date !== undefined && { due_date: input.due_date }),
      })

      if (error || !data) {
        // Reload to restore consistent state
        await load()
        throw error ?? new Error('Failed to update task')
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? (data as Task) : t))
      )
    },
    [load]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      // Optimistic remove
      setTasks((prev) => prev.filter((t) => t.id !== id))

      const { error } = await dbDeleteTask(id)
      if (error) {
        await load()
        throw error
      }
    },
    [load]
  )

  const toggleTaskStatus = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      // Optimistic toggle
      const nextStatus = task.status === 'pending' ? 'completed' : 'pending'
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: nextStatus, updated_at: new Date().toISOString() }
            : t
        )
      )

      const { data, error } = await dbToggleTaskStatus(id, task.status)
      if (error || !data) {
        await load()
        throw error ?? new Error('Failed to toggle task status')
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? (data as Task) : t))
      )
    },
    [tasks, load]
  )

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        reload: load,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
