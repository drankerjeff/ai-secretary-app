import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `あなたはリサーチ結果の要約・構造化の専門家です。
与えられたテキストを分析し、以下のJSON形式のみで応答してください。余分な説明は不要です。

{
  "overview": "全体の概要（200字以内の日本語）",
  "key_points": ["要点1", "要点2", "要点3", "要点4", "要点5"],
  "related_topics": ["関連トピック1", "関連トピック2", "関連トピック3", "関連トピック4", "関連トピック5"]
}

- overview: 検索結果全体を簡潔にまとめた説明（200字以内）
- key_points: 最も重要な情報・ポイントを箇条書き形式で5件以内
- related_topics: このテーマに関連する調査すべき関連トピック・キーワードを3〜5件
- すべての文言は日本語で記述してください`

export interface StructuredSummary {
  overview: string
  key_points: string[]
  related_topics: string[]
}

export class SummarizerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SummarizerError'
  }
}

export async function structureSummary(
  rawContent: string,
  query: string
): Promise<StructuredSummary> {
  let response
  try {
    response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `検索クエリ: ${query}\n\n検索結果テキスト:\n${rawContent}`,
        },
      ],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OpenAI API request failed'
    throw new SummarizerError(message)
  }

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new SummarizerError('OpenAI returned an empty response')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new SummarizerError('OpenAI returned invalid JSON')
  }

  const data = parsed as Record<string, unknown>

  if (
    typeof data.overview !== 'string' ||
    !Array.isArray(data.key_points) ||
    !Array.isArray(data.related_topics)
  ) {
    throw new SummarizerError('OpenAI response schema mismatch')
  }

  return {
    overview: data.overview,
    key_points: data.key_points as string[],
    related_topics: data.related_topics as string[],
  }
}
