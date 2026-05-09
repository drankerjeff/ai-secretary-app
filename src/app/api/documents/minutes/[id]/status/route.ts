import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTranscriptionStatus, AssemblyAIError } from '@/lib/transcription/assemblyai'
import { generateMinutes, MinutesGenerationError } from '@/lib/minutes/minutesGenerator'
import type { Json } from '@/types/database'
import type { MinutesMetadata, MinutesDocument } from '@/types/minutes'

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

  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('id, title, original_content, processed_content, metadata, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('type', 'minutes')
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const meta = (doc.metadata ?? {}) as unknown as MinutesMetadata

  // Only poll AssemblyAI when status is 'transcribing'
  if (meta.status !== 'transcribing') {
    return NextResponse.json(rowToMinutesDocument(doc))
  }

  if (!meta.assemblyai_id) {
    return NextResponse.json({ error: 'Missing assemblyai_id in metadata' }, { status: 500 })
  }

  // Check transcription status from AssemblyAI
  let transcriptionResult
  try {
    transcriptionResult = await getTranscriptionStatus(meta.assemblyai_id)
  } catch (err) {
    if (err instanceof AssemblyAIError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    return NextResponse.json({ error: 'Transcription status check failed' }, { status: 500 })
  }

  // Still in progress — return current state without DB update
  if (transcriptionResult.status === 'queued' || transcriptionResult.status === 'processing') {
    return NextResponse.json(rowToMinutesDocument(doc))
  }

  // Transcription failed
  if (transcriptionResult.status === 'error') {
    const failedMeta: MinutesMetadata = {
      ...meta,
      status: 'failed',
      error: transcriptionResult.error ?? 'Transcription failed',
    }

    const { data: updated, error: updateError } = await supabase
      .from('documents')
      .update({ metadata: failedMeta as unknown as Json })
      .eq('id', id)
      .select('id, title, original_content, processed_content, metadata, created_at')
      .single()

    if (updateError || !updated) {
      return NextResponse.json({ error: 'Failed to update document status' }, { status: 500 })
    }

    return NextResponse.json(rowToMinutesDocument(updated))
  }

  // Transcription completed — generate minutes with OpenAI
  const transcriptionText = transcriptionResult.text ?? ''

  // Mark status as 'generating' while we call OpenAI
  const generatingMeta: MinutesMetadata = {
    ...meta,
    status: 'generating',
  }
  await supabase
    .from('documents')
    .update({
      original_content: transcriptionText,
      metadata: generatingMeta as unknown as Json,
    })
    .eq('id', id)

  let minutesData
  try {
    minutesData = await generateMinutes(transcriptionText)
  } catch (err) {
    const errorMessage =
      err instanceof MinutesGenerationError ? err.message : 'Minutes generation failed'

    const failedMeta: MinutesMetadata = {
      ...generatingMeta,
      status: 'failed',
      error: errorMessage,
    }
    const { data: updated, error: updateError } = await supabase
      .from('documents')
      .update({ metadata: failedMeta as unknown as Json })
      .eq('id', id)
      .select('id, title, original_content, processed_content, metadata, created_at')
      .single()

    if (updateError || !updated) {
      return NextResponse.json({ error: 'Failed to update document status' }, { status: 500 })
    }

    if (err instanceof MinutesGenerationError) {
      return NextResponse.json(rowToMinutesDocument(updated), { status: 502 })
    }
    return NextResponse.json(rowToMinutesDocument(updated), { status: 500 })
  }

  // Persist completed minutes
  const completedMeta: MinutesMetadata = {
    ...meta,
    status: 'completed',
    discussed_topics: minutesData.discussed_topics,
    decisions: minutesData.decisions,
    next_actions: minutesData.next_actions,
    summary: minutesData.summary,
  }

  const { data: completed, error: completeError } = await supabase
    .from('documents')
    .update({
      title: minutesData.title || doc.title,
      original_content: transcriptionText,
      processed_content: minutesData.summary,
      metadata: completedMeta as unknown as Json,
    })
    .eq('id', id)
    .select('id, title, original_content, processed_content, metadata, created_at')
    .single()

  if (completeError || !completed) {
    return NextResponse.json(
      { error: completeError?.message ?? 'Failed to save completed minutes' },
      { status: 500 }
    )
  }

  return NextResponse.json(rowToMinutesDocument(completed))
}
