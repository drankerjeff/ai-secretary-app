import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadAudioToStorage } from '@/lib/storage/audioStorage'
import { createTranscription, AssemblyAIError } from '@/lib/transcription/assemblyai'
import type { Json } from '@/types/database'
import type { MinutesMetadata, MinutesDocument } from '@/types/minutes'

export const maxDuration = 60

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/x-m4a',
  'video/mp4',
  'video/webm',
  'audio/webm',
]
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a', 'mp4', 'webm']
const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200 MB

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

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  const titleRaw = formData.get('title')
  const title =
    typeof titleRaw === 'string' && titleRaw.trim()
      ? titleRaw.trim()
      : `議事録 ${new Date().toLocaleDateString('ja-JP')}`

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File size must be 200MB or less' }, { status: 413 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.type)
  const extOk = ALLOWED_EXTENSIONS.includes(ext)

  if (!mimeOk && !extOk) {
    return NextResponse.json(
      { error: 'Unsupported file format. Use mp3, wav, m4a, mp4, or webm.' },
      { status: 400 }
    )
  }

  // Upload to Supabase Storage
  let audioUrl: string
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    audioUrl = await uploadAudioToStorage(buffer, file.name, file.type || 'audio/mpeg', user.id)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Storage upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Submit transcription job to AssemblyAI
  let assemblyaiId: string
  try {
    assemblyaiId = await createTranscription(audioUrl)
  } catch (err) {
    if (err instanceof AssemblyAIError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    return NextResponse.json({ error: 'Transcription service error' }, { status: 500 })
  }

  const metadata: MinutesMetadata = {
    assemblyai_id: assemblyaiId,
    status: 'transcribing',
    audio_url: audioUrl,
  }

  const { data: doc, error: dbError } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      type: 'minutes',
      title,
      metadata: metadata as unknown as Json,
    })
    .select('id, metadata')
    .single()

  if (dbError || !doc) {
    return NextResponse.json(
      { error: dbError?.message ?? 'Failed to save document' },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: doc.id, status: 'transcribing' }, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('documents')
    .select('id, title, original_content, processed_content, metadata, created_at')
    .eq('user_id', user.id)
    .eq('type', 'minutes')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const documents: MinutesDocument[] = (data ?? []).map(rowToMinutesDocument)

  return NextResponse.json(documents)
}
