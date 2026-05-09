import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `あなたは会議の議事録作成の専門家です。
与えられた文字起こしテキストを読み、以下のJSON形式のみで議事録を生成してください。
余分な説明やコメントは不要です。JSON のみを返してください。

{
  "title": "会議タイトル（内容から推測）",
  "summary": "会議の概要（2〜4文程度の日本語）",
  "discussed_topics": ["議題1", "議題2", "..."],
  "decisions": ["決定事項1", "決定事項2", "..."],
  "next_actions": [
    {
      "task": "アクションアイテムの説明",
      "assignee": "担当者名（不明な場合は省略）",
      "due_date": "期日（YYYY-MM-DD形式、不明な場合は省略）"
    }
  ]
}

- discussed_topics: 会議で取り上げられた主な話題や議題の一覧
- decisions: 会議中に下された決定事項・合意内容の一覧
- next_actions: 会議後に誰かが実施すべきアクションアイテムの一覧
- すべての文言は日本語で記述してください`

export interface MinutesData {
  title: string
  summary: string
  discussed_topics: string[]
  decisions: string[]
  next_actions: { task: string; assignee?: string; due_date?: string }[]
}

export class MinutesGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MinutesGenerationError'
  }
}

export async function generateMinutes(transcription: string): Promise<MinutesData> {
  let response
  try {
    response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `以下の会議の文字起こしから議事録を作成してください：\n\n${transcription}`,
        },
      ],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OpenAI API request failed'
    throw new MinutesGenerationError(message)
  }

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new MinutesGenerationError('OpenAI returned an empty response')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new MinutesGenerationError('OpenAI returned invalid JSON')
  }

  const data = parsed as Record<string, unknown>

  if (
    typeof data.title !== 'string' ||
    typeof data.summary !== 'string' ||
    !Array.isArray(data.discussed_topics) ||
    !Array.isArray(data.decisions) ||
    !Array.isArray(data.next_actions)
  ) {
    throw new MinutesGenerationError('OpenAI response schema mismatch')
  }

  return {
    title: data.title,
    summary: data.summary,
    discussed_topics: data.discussed_topics as string[],
    decisions: data.decisions as string[],
    next_actions: data.next_actions as MinutesData['next_actions'],
  }
}
