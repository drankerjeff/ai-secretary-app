import { createClient } from './client'
import type { InsertTask, UpdateTask } from '@/types/database'
import type { TaskStatus } from '@/types/task'

export async function getTasks(userId: string) {
  const supabase = createClient()
  return supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function createTask(data: InsertTask) {
  const supabase = createClient()
  return supabase.from('tasks').insert(data).select().single()
}

export async function updateTask(id: string, data: UpdateTask) {
  const supabase = createClient()
  return supabase.from('tasks').update(data).eq('id', id).select().single()
}

export async function deleteTask(id: string) {
  const supabase = createClient()
  return supabase.from('tasks').delete().eq('id', id)
}

// Returns incomplete tasks with due_date within the next 2 days (including overdue)
export async function getAlertTasks(userId: string) {
  const supabase = createClient()
  const twoDaysFromNow = new Date()
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2)

  return supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .not('due_date', 'is', null)
    .lte('due_date', twoDaysFromNow.toISOString())
    .order('due_date', { ascending: true })
}

export async function toggleTaskStatus(id: string, currentStatus: TaskStatus) {
  const supabase = createClient()
  const nextStatus: TaskStatus = currentStatus === 'pending' ? 'completed' : 'pending'
  return supabase
    .from('tasks')
    .update({ status: nextStatus })
    .eq('id', id)
    .select()
    .single()
}
