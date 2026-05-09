import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TaskStatus, Priority } from '@/types/task'

const VALID_STATUSES: TaskStatus[] = ['pending', 'completed']
const VALID_PRIORITIES: Priority[] = ['high', 'medium', 'low']

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get('status')
  const priorityParam = searchParams.get('priority')
  const due = searchParams.get('due')

  const status = VALID_STATUSES.includes(statusParam as TaskStatus)
    ? (statusParam as TaskStatus)
    : null

  const priority = VALID_PRIORITIES.includes(priorityParam as Priority)
    ? (priorityParam as Priority)
    : null

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }
  if (priority) {
    query = query.eq('priority', priority)
  }
  if (due && due !== 'all') {
    const now = new Date()
    if (due === 'today') {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      query = query.gte('due_date', start.toISOString()).lte('due_date', end.toISOString())
    } else if (due === 'week') {
      const end = new Date(now)
      end.setDate(now.getDate() + 7)
      query = query.lte('due_date', end.toISOString())
    } else if (due === 'overdue') {
      query = query.lt('due_date', now.toISOString()).eq('status', 'pending')
    }
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, priority, due_date } = body

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const validPriority = VALID_PRIORITIES.includes(priority as Priority)
    ? (priority as Priority)
    : null

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description ?? null,
      priority: validPriority,
      due_date: due_date ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
