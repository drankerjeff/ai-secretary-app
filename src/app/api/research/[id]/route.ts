import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'
import type { SearchType, ResearchResult, Source } from '@/types/research'

const VALID_SEARCH_TYPES: SearchType[] = ['general', 'latest', 'academic', 'news']

function documentToResearchResult(doc: {
  id: string
  original_content: string | null
  processed_content: string | null
  metadata: Json | null
  created_at: string
}): ResearchResult {
  const meta = (doc.metadata ?? {}) as Record<string, unknown>
  const key_points = Array.isArray(meta.key_points) ? (meta.key_points as string[]) : []
  const related_topics = Array.isArray(meta.related_topics)
    ? (meta.related_topics as string[])
    : []
  const sources = Array.isArray(meta.sources) ? (meta.sources as Source[]) : []
  const search_type: SearchType = VALID_SEARCH_TYPES.includes(meta.search_type as SearchType)
    ? (meta.search_type as SearchType)
    : 'general'

  return {
    id: doc.id,
    query: doc.original_content ?? '',
    search_type,
    summary: {
      overview: doc.processed_content ?? '',
      key_points,
      related_topics,
    },
    sources,
    created_at: doc.created_at,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: doc, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('type', 'research')
    .single()

  if (error || !doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (doc.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(documentToResearchResult(doc))
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('id, user_id')
    .eq('id', id)
    .eq('type', 'research')
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (doc.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error: deleteError } = await supabase.from('documents').delete().eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
