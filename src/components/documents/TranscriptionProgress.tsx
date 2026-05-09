'use client'

import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'
import type { MinutesStatus } from '@/types/minutes'

interface Step {
  label: string
  status: MinutesStatus[]
}

const STEPS: Step[] = [
  { label: 'ファイルアップロード',  status: ['uploading'] },
  { label: '音声認識処理中',        status: ['transcribing'] },
  { label: '議事録生成',            status: ['generating'] },
  { label: '完了',                  status: ['completed'] },
]

const PROGRESS_PCT: Record<MinutesStatus, number> = {
  uploading:    10,
  transcribing: 40,
  generating:   75,
  completed:   100,
  failed:        0,
}

function stepState(stepStatuses: MinutesStatus[], current: MinutesStatus): 'done' | 'active' | 'pending' {
  const ORDER: MinutesStatus[] = ['uploading', 'transcribing', 'generating', 'completed', 'failed']
  const currentIdx = ORDER.indexOf(current)
  const stepIdx = ORDER.indexOf(stepStatuses[0])

  if (current === 'failed') return 'pending'
  if (currentIdx > stepIdx) return 'done'
  if (stepStatuses.includes(current)) return 'active'
  return 'pending'
}

interface TranscriptionProgressProps {
  status: MinutesStatus
  error?: string
}

export function TranscriptionProgress({ status, error }: TranscriptionProgressProps) {
  return (
    <div className="apple-card p-5 space-y-4">
      <p className="text-subheadline font-semibold text-foreground">処理状況</p>

      {/* 全体の進捗 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-footnote text-foreground-secondary">全体の進捗</span>
          <span className="text-footnote font-semibold text-foreground">
            {PROGRESS_PCT[status]}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-background-secondary overflow-hidden">
          <div
            className={[
              'h-full rounded-full transition-all duration-700 ease-out',
              status === 'failed' ? 'bg-destructive' : 'bg-primary',
            ].join(' ')}
            style={{ width: `${PROGRESS_PCT[status]}%` }}
          />
        </div>
      </div>

      <ol className="space-y-3">
        {STEPS.map((step, i) => {
          const state = stepState(step.status, status)
          return (
            <li key={i} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className="shrink-0 flex items-center justify-center w-6 h-6">
                {state === 'done' ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-success"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" className="opacity-20" fill="currentColor" stroke="none" />
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : state === 'active' ? (
                  <Spinner size="sm" color="primary" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-foreground-tertiary" />
                  </span>
                )}
              </div>

              {/* Step label */}
              <span
                className={[
                  'text-footnote',
                  state === 'done'   ? 'text-success font-medium' :
                  state === 'active' ? 'text-foreground font-semibold' :
                                       'text-foreground-tertiary',
                ].join(' ')}
              >
                {step.label}
                {state === 'active' && '...'}
              </span>
            </li>
          )
        })}
      </ol>

      {status === 'failed' && (
        <Alert type="error" title="処理に失敗しました">
          {error ?? '音声の処理中にエラーが発生しました。もう一度お試しください。'}
        </Alert>
      )}
    </div>
  )
}
