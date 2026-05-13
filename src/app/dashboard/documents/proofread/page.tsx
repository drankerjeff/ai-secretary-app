'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Select } from '@/components/ui/Select'
import { ProofreadResult } from '@/components/documents/ProofreadResult'
import { ProofreadHistory } from '@/components/documents/ProofreadHistory'
import { useProofread } from '@/hooks/documents/useProofread'
import type { DocumentType, Suggestion } from '@/types/document'

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'general', label: '一般' },
  { value: 'email', label: 'メール' },
  { value: 'report', label: '報告書' },
]

const TYPE_LABELS: Record<Suggestion['type'], string> = {
  spelling:    '誤字脱字',
  grammar:     '文法',
  style:       '文体',
  punctuation: '句読点',
}

const TYPE_COLORS: Record<Suggestion['type'], string> = {
  spelling:    'text-destructive',
  grammar:     'text-warning',
  style:       'text-primary',
  punctuation: 'text-success',
}

const MAX_LENGTH = 5000

export default function ProofreadPage() {
  const { isLoading, error, result, history, isLoadingHistory, proofread, loadHistory, deleteHistory, clearResult } =
    useProofread()

  const [content, setContent] = useState('')
  const [documentType, setDocumentType] = useState<DocumentType>('general')
  const [leftTab, setLeftTab] = useState<'input' | 'analysis'>('input')

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

const handleSubmit = async () => {
    if (!content.trim()) return
    await proofread(content, documentType)
  }

  const handleRestore = (item: { original_content: string | null }) => {
    if (item.original_content) {
      setContent(item.original_content)
      clearResult()
      setLeftTab('input')
    }
  }

  const handleClear = () => {
    clearResult()
    setLeftTab('input')
  }

  const isOverLimit = content.length > MAX_LENGTH

  const typeCounts = useMemo(() => {
    if (!result) return null
    const counts: Partial<Record<Suggestion['type'], number>> = {}
    for (const s of result.suggestions) {
      counts[s.type] = (counts[s.type] ?? 0) + 1
    }
    return counts
  }, [result])

  const styleFeatures = useMemo(() => {
    if (!result) return null
    const text = result.original
    const sentences = text.split(/[。！？\n]/).filter((s) => s.trim().length > 2)

    // 形式性スコア
    const formalPatterns = ['です', 'ます', 'ございます', 'いたします', 'いただき', 'させていただ', '申し上げ']
    const formalCount = formalPatterns.reduce((sum, p) => sum + (text.split(p).length - 1), 0)
    const formalityScore = Math.min(10, Math.max(1, Math.round((formalCount / Math.max(sentences.length, 1)) * 2 + 3)))
    const formalityLabel = formalityScore >= 7 ? 'フォーマル' : formalityScore >= 4 ? 'ビジネス' : 'カジュアル'

    // 文の長さ
    const avgLen = sentences.reduce((sum, s) => sum + s.length, 0) / Math.max(sentences.length, 1)
    const sentenceLengthLabel = avgLen < 20 ? '短い' : avgLen < 45 ? '普通' : '長い'

    // 適書レベル
    const density = result.suggestions.length / Math.max(text.length / 100, 1)
    const readabilityLabel = density < 1 ? '読みやすい' : density < 3 ? '標準的' : '改善が必要'

    // よく使う表現
    const phraseList = [
      'お世話になります', 'よろしくお願いします', 'よろしくお願いいたします',
      'お疲れ様です', 'ご確認ください', 'ご連絡ください',
      'ありがとうございます', 'ありがとうございました', 'お願いいたします',
      'ご報告', 'いつでも', 'お気軽に', '特に問題はございません',
    ]
    const foundPhrases = phraseList.filter((p) => text.includes(p))

    return { formalityScore, formalityLabel, sentenceLengthLabel, readabilityLabel, foundPhrases }
  }, [result])

  const statItems: { type: Suggestion['type']; label: string }[] = [
    { type: 'spelling',    label: '誤字脱字' },
    { type: 'grammar',     label: '文法' },
    { type: 'style',       label: '文体' },
    { type: 'punctuation', label: '句読点' },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-title1 font-semibold text-foreground">文章校正</h1>
        <p className="text-callout text-foreground-secondary">
          AI が誤字・表現・文体を自動チェックします。
        </p>
        {/* page-level tab bar */}
        <div className="flex items-center gap-0.5 p-1 w-fit mt-2">
          <button
            onClick={() => setLeftTab('input')}
            className="px-4 py-1.5 text-subheadline font-medium text-foreground"
          >
            文書入力
          </button>
          <button
            onClick={() => setLeftTab('analysis')}
            className="px-4 py-1.5 text-subheadline font-medium text-foreground"
          >
            文体分析
          </button>
        </div>
      </div>

      {/* 2-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left panel */}
        <div className="p-5 space-y-4">

          {/* 文書入力 */}
          {leftTab === 'input' && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-subheadline font-semibold text-foreground">修正前</p>
                <div className="w-36">
                  <Select
                    options={DOCUMENT_TYPE_OPTIONS}
                    value={documentType}
                    onChange={(v) => setDocumentType(v as DocumentType)}
                    placeholder="文書タイプ"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <textarea
                  id="proofread-input"
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ここにテキストを貼り付けてください..."
                  className="w-full text-callout text-foreground placeholder:text-foreground-tertiary px-3.5 py-2.5 resize-none focus:outline-none"
                />
                <div className="flex justify-end">
                  <span className={['text-footnote', isOverLimit ? 'text-destructive' : 'text-foreground-tertiary'].join(' ')}>
                    {content.length}/{MAX_LENGTH}
                  </span>
                </div>
              </div>

              {error && <Alert type="error">{error}</Alert>}

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  loading={isLoading}
                  disabled={isLoading || !content.trim() || isOverLimit}
                  onClick={handleSubmit}
                >
                  AI で校正する
                </Button>
              </div>
            </>
          )}

          {/* 文体分析 */}
          {leftTab === 'analysis' && (
            <>
              {result && typeCounts ? (
                <div className="space-y-5">
                  {/* summary stats */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="p-4 text-center space-y-1">
                      <p className="text-title1 font-bold text-foreground">
                        {result.suggestions.length}
                      </p>
                      <p className="text-caption1 text-foreground-secondary">修正提案数</p>
                    </div>
                    {statItems.map(({ type, label }) => (
                      <div key={type} className="p-4 text-center space-y-1">
                        <p className={['text-title1 font-bold', TYPE_COLORS[type]].join(' ')}>
                          {typeCounts[type] ?? 0}
                        </p>
                        <p className="text-caption1 text-foreground-secondary">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* text length comparison */}
                  <div className="p-4 space-y-3">
                    <p className="text-footnote font-medium text-foreground-secondary">文字数</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0.5">
                        <p className="text-title2 font-bold text-foreground-secondary">
                          {result.original.length}
                        </p>
                        <p className="text-caption1 text-foreground-tertiary">修正前</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-title2 font-bold text-foreground">
                          {result.corrected.length}
                        </p>
                        <p className="text-caption1 text-foreground-tertiary">修正後</p>
                      </div>
                    </div>
                  </div>

                  {/* type breakdown */}
                  {result.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-footnote font-medium text-foreground-secondary">種別内訳</p>
                      {statItems.filter(({ type }) => (typeCounts[type] ?? 0) > 0).map(({ type, label }) => {
                        const count = typeCounts[type] ?? 0
                        const pct = Math.round((count / result.suggestions.length) * 100)
                        return (
                          <div key={type} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={['text-footnote font-medium', TYPE_COLORS[type]].join(' ')}>
                                {label}
                              </span>
                              <span className="text-footnote text-foreground-secondary">{count}件 ({pct}%)</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* 文体の特徴 */}
                  {styleFeatures && (
                    <div className="space-y-3">
                      <p className="text-footnote font-medium text-foreground-secondary">文体の特徴</p>

                      {/* 形式性レベル */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-footnote text-foreground">形式性レベル</span>
                          <span className="text-footnote font-semibold text-foreground">
                            {styleFeatures.formalityScore}/10
                          </span>
                        </div>
                        <span className="inline-block text-caption1 px-2 py-0.5 font-medium text-foreground">
                          {styleFeatures.formalityLabel}
                        </span>
                      </div>

                      {/* 文の長さ */}
                      <div className="flex items-center justify-between">
                        <span className="text-footnote text-foreground">文の長さ</span>
                        <span className="text-caption1 px-2 py-0.5 font-medium text-foreground">
                          {styleFeatures.sentenceLengthLabel}
                        </span>
                      </div>

                      {/* 適書レベル */}
                      <div className="flex items-center justify-between">
                        <span className="text-footnote text-foreground">適書レベル</span>
                        <span className="text-caption1 px-2 py-0.5 font-medium text-foreground">
                          {styleFeatures.readabilityLabel}
                        </span>
                      </div>

                      {/* よく使う表現 */}
                      {styleFeatures.foundPhrases.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-footnote text-foreground">よく使う表現</span>
                          <div className="flex flex-wrap gap-1.5">
                            {styleFeatures.foundPhrases.map((phrase) => (
                              <span
                                key={phrase}
                                className="text-caption1 px-2 py-0.5 text-foreground-secondary"
                              >
                                {phrase}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleClear} className="w-full">
                    クリアして新しい文章を入力
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground-tertiary" aria-hidden="true">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" />
                    <path d="M15 13v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2" />
                    <path d="M21 9v10a2 2 0 01-2 2h-2a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2z" />
                  </svg>
                  <p className="text-subheadline text-foreground-secondary">
                    文体分析の結果がここに表示されます
                  </p>
                  <p className="text-footnote text-foreground-tertiary">
                    「文書入力」タブでテキストを入力して校正してください
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setLeftTab('input')}>
                    文書入力へ
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: result */}
        <div className="p-5 min-h-[480px]">
          {result ? (
            <ProofreadResult result={result} onClear={handleClear} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground-tertiary" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <p className="text-subheadline text-foreground-secondary">
                修正後のテキストがここに表示されます
              </p>
              <p className="text-footnote text-foreground-tertiary">
                左にテキストを入力して「AI で校正する」を押してください
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-headline font-semibold text-foreground">校正履歴</h2>
        <ProofreadHistory
          history={history}
          isLoading={isLoadingHistory}
          onDelete={deleteHistory}
          onRestore={handleRestore}
        />
      </div>
    </div>
  )
}
