export type SearchType = 'general' | 'latest' | 'academic' | 'news'

export interface Source {
  title: string
  url: string
  excerpt?: string
}

export interface ResearchSummary {
  overview: string
  key_points: string[]
  related_topics: string[]
}

export interface ResearchMetadata {
  search_type: SearchType
  optimized_query?: string
  key_points: string[]
  related_topics: string[]
  sources: Source[]
}

export interface ResearchResult {
  id: string
  query: string
  search_type: SearchType
  summary: ResearchSummary
  sources: Source[]
  created_at: string
}
