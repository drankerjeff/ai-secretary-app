import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'
import type { MinutesMetadata, MinutesDocument, NextAction } from '@/types/minutes'

export const maxDuration = 60

function rowToMinutesDocument(row: {
  id: string
  title: string
  original_content: string | null
  processed_content: string | null
  metadata: Json | null
  created_at: string
}): MinutesDocument {
  const meta = (row.metadata ?? {}) as unknown as MinutesMetadata

  return {
    id: row.id,
    title: row.title,
    status: meta.status ?? 'failed',
    transcription: row.original_content ?? undefined,
    discussed_topics: meta.discussed_topics ?? [],
    decisions: meta.decisions ?? [],
    next_actions: meta.next_actions ?? [],
    summary: meta.summary ?? undefined,
    audio_url: meta.audio_url ?? undefined,
    created_at: row.created_at,
    error: meta.error ?? undefined,
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
    .select('id, title, original_content, processed_content, metadata, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('type', 'minutes')
    .single()

  if (error || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  return NextResponse.json(rowToMinutesDocument(doc))
}

export async function PATCH(
  request: NextRequest,
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

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from('documents')
    .select('id, user_id, metadata')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('type', 'minutes')
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const currentMeta = (existing.metadata ?? {}) as unknown as MinutesMetadata

  // Build the updated metadata by merging patch fields
  const updatedMeta: MinutesMetadata = {
    ...currentMeta,
  }
  if (Array.isArray(body.discussed_topics)) {
    updatedMeta.discussed_topics = body.discussed_topics as string[]
  }
  if (Array.isArray(body.decisions)) {
    updatedMeta.decisions = body.decisions as string[]
  }
  if (Array.isArray(body.next_actions)) {
    updatedMeta.next_actions = body.next_actions as NextAction[]
  }

  const newTitle =
    typeof body.title === 'string' && body.title.trim() ? body.title.trim() : undefined

  const { data: updated, error: updateError } = await supabase
    .from('documents')
    .update({
      ...(newTitle ? { title: newTitle } : {}),
      metadata: updatedMeta as unknown as Json,
    })
    .eq('id', id)
    .select('id, title, original_content, processed_content, metadata, created_at')
    .single()

  if (updateError || !updated) {
    return NextResponse.json(
      { error: updateError?.message ?? 'Update failed' },
      { status: 500 }
    )
  }

  return NextResponse.json(rowToMinutesDocument(updated))
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
    .eq('type', 'minutes')
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
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
