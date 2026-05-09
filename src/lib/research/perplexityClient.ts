import OpenAI from 'openai'
import type { SearchType } from '@/types/research'

const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY!,
  baseURL: 'https://api.perplexity.ai',
})

export class PerplexityError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PerplexityError'
  }
}

export interface PerplexitySearchResult {
  content: string
  citations: string[]
}

function buildSystemPrompt(searchType: SearchType): string {
  const base = '必ず日本語で回答してください。'

  const typeInstructions: Record<SearchType, string> = {
    general: '情報をバランスよく幅広く収集し、わかりやすくまとめてください。',
    latest:
      '最新の情報・ニュース・アップデートを優先して収集してください。情報の鮮度を重視してください。',
    academic:
      '学術論文・研究・専門的知見を優先して収集してください。信頼性の高い情報源を重視してください。',
    news: '最近のニュース・報道を優先して収集してください。事実関係を正確に伝えてください。',
  }

  return base + typeInstructions[searchType]
}

export async function searchWithPerplexity(
  query: string,
  searchType: SearchType
): Promise<PerplexitySearchResult> {
  let response
  try {
    response = await client.chat.completions.create({
      model: 'sonar',
      messages: [
        { role: 'system', content: buildSystemPrompt(searchType) },
        { role: 'user', content: query },
      ],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Perplexity API request failed'
    throw new PerplexityError(message)
  }

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new PerplexityError('Perplexity returned an empty response')
  }

  const citations =
    (response as unknown as { citations?: string[] }).citations ?? []

  return { content, citations }
}
