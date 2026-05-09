import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { proofreadText, OpenAIError } from '@/lib/ai/openai'
import type { Json } from '@/types/database'
import type { DocumentType, ProofreadResult, ProofreadMetadata } from '@/types/document'

const VALID_DOCUMENT_TYPES: DocumentType[] = ['email', 'report', 'general']
const MAX_CONTENT_LENGTH = 5000

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
  const { content, documentType, title } = body as {
    content: unknown
    documentType: unknown
    title: unknown
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `content must be ${MAX_CONTENT_LENGTH} characters or fewer` },
      { status: 400 }
    )
  }

  const resolvedType: DocumentType = VALID_DOCUMENT_TYPES.includes(documentType as DocumentType)
    ? (documentType as DocumentType)
    : 'general'

  const resolvedTitle =
    typeof title === 'string' && title.trim()
      ? title.trim()
      : `校正 ${new Date().toLocaleDateString('ja-JP')}`

  let corrected: string
  let suggestions: ProofreadMetadata['suggestions']

  try {
    const result = await proofreadText(content, resolvedType)
    corrected = result.corrected
    suggestions = result.suggestions
  } catch (err) {
    if (err instanceof OpenAIError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const metadata: ProofreadMetadata = { suggestions, documentType: resolvedType }

  const { data: doc, error: dbError } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      type: 'proofread',
      title: resolvedTitle,
      original_content: content,
      processed_content: corrected,
      metadata: metadata as unknown as Json,
    })
    .select()
    .single()

  if (dbError || !doc) {
    return NextResponse.json(
      { error: dbError?.message ?? 'Failed to save document' },
      { status: 500 }
    )
  }

  const result: ProofreadResult = {
    documentId: doc.id,
    original: content,
    corrected,
    suggestions,
    createdAt: doc.created_at,
  }

  return NextResponse.json(result, { status: 201 })
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
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'proofread')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
