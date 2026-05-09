import OpenAI from 'openai'
import type { DocumentType, Suggestion } from '@/types/document'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `あなたは日本語文章校正の専門家です。以下のルールに従って文章を校正してください：
1. 誤字・脱字の修正
2. 文法・助詞の誤りの修正
3. 句読点の最適化
4. 文体の統一と読みやすさの向上
5. 二重否定・冗長表現の改善

文書タイプに応じて適切な文体を適用してください：
- email: メール文として適切な敬語・丁寧語
- report: 報告書として適切な客観的文体
- general: 一般的な読みやすい文体

必ず以下のJSON形式のみで応答してください：
{
  "corrected": "校正後の文章全体",
  "suggestions": [
    {
      "type": "spelling",
      "original": "元の表現",
      "suggested": "修正後の表現",
      "explanation": "修正理由（簡潔に）"
    }
  ]
}`

interface ProofreadResponse {
  corrected: string
  suggestions: Suggestion[]
}

export class OpenAIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OpenAIError'
  }
}

export async function proofreadText(
  content: string,
  documentType: DocumentType
): Promise<ProofreadResponse> {
  let response
  try {
    response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `文書タイプ: ${documentType}\n\n校正対象:\n${content}`,
        },
      ],
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OpenAI API request failed'
    throw new OpenAIError(message)
  }

  const raw = response.choices[0]?.message?.content
  if (!raw) {
    throw new OpenAIError('OpenAI returned an empty response')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new OpenAIError('OpenAI returned invalid JSON')
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).corrected !== 'string' ||
    !Array.isArray((parsed as Record<string, unknown>).suggestions)
  ) {
    throw new OpenAIError('OpenAI response schema mismatch')
  }

  return parsed as ProofreadResponse
}
