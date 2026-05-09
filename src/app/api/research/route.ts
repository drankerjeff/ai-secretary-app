import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchWithPerplexity, PerplexityError } from '@/lib/research/perplexityClient'
import { structureSummary, SummarizerError } from '@/lib/research/summarizer'
import type { Json } from '@/types/database'
import type { SearchType, ResearchResult, ResearchMetadata, Source } from '@/types/research'

const VALID_SEARCH_TYPES: SearchType[] = ['general', 'latest', 'academic', 'news']
const MAX_QUERY_LENGTH = 500

function citationToSource(url: string): Source {
  return { title: url, url }
}

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
  const { query, searchType } = body as {
    query: unknown
    searchType: unknown
  }

  if (!query || typeof query !== 'string' || !query.trim()) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `query must be ${MAX_QUERY_LENGTH} characters or fewer` },
      { status: 400 }
    )
  }

  const resolvedSearchType: SearchType = VALID_SEARCH_TYPES.includes(searchType as SearchType)
    ? (searchType as SearchType)
    : 'general'

  let perplexityResult: Awaited<ReturnType<typeof searchWithPerplexity>>
  try {
    perplexityResult = await searchWithPerplexity(query, resolvedSearchType)
  } catch (err) {
    if (err instanceof PerplexityError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  let structured: Awaited<ReturnType<typeof structureSummary>>
  try {
    structured = await structureSummary(perplexityResult.content, query)
  } catch (err) {
    if (err instanceof SummarizerError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  const sources: Source[] = perplexityResult.citations.map(citationToSource)

  const metadata: ResearchMetadata = {
    search_type: resolvedSearchType,
    key_points: structured.key_points,
    related_topics: structured.related_topics,
    sources,
  }

  const { data: doc, error: dbError } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      type: 'research',
      title: query.slice(0, 50),
      original_content: query,
      processed_content: structured.overview,
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

  const result: ResearchResult = {
    id: doc.id,
    query,
    search_type: resolvedSearchType,
    summary: {
      overview: structured.overview,
      key_points: structured.key_points,
      related_topics: structured.related_topics,
    },
    sources,
    created_at: doc.created_at,
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
    .eq('type', 'research')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results: ResearchResult[] = (data ?? []).map(documentToResearchResult)

  return NextResponse.json(results)
}
