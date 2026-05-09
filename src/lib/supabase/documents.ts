import { createClient } from './client'
import type { Database, InsertDocument, UpdateDocument } from '@/types/database'

type DocumentType = Database['public']['Tables']['documents']['Row']['type']

export async function getDocuments(userId: string, type?: DocumentType) {
  const supabase = createClient()
  const query = supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (type) {
    return query.eq('type', type)
  }
  return query
}

export async function createDocument(data: InsertDocument) {
  const supabase = createClient()
  return supabase.from('documents').insert(data).select().single()
}

export async function updateDocument(id: string, data: UpdateDocument) {
  const supabase = createClient()
  return supabase.from('documents').update(data).eq('id', id).select().single()
}

export async function deleteDocument(id: string) {
  const supabase = createClient()
  return supabase.from('documents').delete().eq('id', id)
}
