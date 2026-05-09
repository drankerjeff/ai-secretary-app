export type Priority = 'high' | 'medium' | 'low'
export type TaskStatus = 'pending' | 'completed'

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string | null
  priority: Priority | null
  due_date?: string | null
  status: TaskStatus
  created_at: string
  updated_at: string
}

export interface TaskFilters {
  status: 'all' | TaskStatus
  priority: 'all' | Priority
  due: 'all' | 'today' | 'week' | 'overdue'
}

export interface TaskInput {
  title: string
  description?: string
  priority?: Priority
  due_date?: string
}
