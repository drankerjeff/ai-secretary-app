import { createClient } from './client'
import type { InsertUser, UpdateUser } from '@/types/database'

export async function getUserById(id: string) {
  const supabase = createClient()
  return supabase.from('users').select('*').eq('id', id).single()
}

export async function updateUser(id: string, data: UpdateUser) {
  const supabase = createClient()
  return supabase.from('users').update(data).eq('id', id).select().single()
}

export async function upsertUser(data: InsertUser) {
  const supabase = createClient()
  return supabase
    .from('users')
    .upsert(data, { onConflict: 'id' })
    .select()
    .single()
}
