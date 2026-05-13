'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { Spinner } from '@/components/ui/Spinner'
import { Alert } from '@/components/ui/Alert'

function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function LoginPage() {
  const { user, isLoading, signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(
    // コールバックルートからのエラーを初期値に設定
    searchParams.get('error')
  )

  // 認証済みならダッシュボードへ
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  async function handleSignIn() {
    setError(null)
    setSigningIn(true)
    try {
      await signIn()
    } catch {
      setError('Googleログインに失敗しました。もう一度お試しください。')
      setSigningIn(false)
    }
  }

  // セッション確認中またはリダイレクト待ち
  if (isLoading || (!isLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ・タイトル */}
        <div className="mb-8 text-center">
          <h1 className="text-largetitle font-semibold text-foreground">AI Secretary</h1>
          <p className="mt-2 text-callout text-foreground-secondary">
            スケジュール管理・議事録・文書作成をAIがサポート
          </p>
        </div>

        {/* カード */}
        <div className="p-8">
          <h2 className="mb-1 text-headline font-semibold text-foreground">ログイン</h2>
          <p className="mb-6 text-footnote text-foreground-tertiary">
            Googleアカウントでサインインしてください
          </p>

          {error && (
            <div className="mb-4">
              <Alert type="error">{error}</Alert>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-3 px-4 py-3 text-subheadline font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingIn ? (
              <Spinner size="sm" />
            ) : (
              <IconGoogle />
            )}
            {signingIn ? 'ログイン中...' : 'Googleでログイン'}
          </button>
        </div>

        <p className="mt-6 text-center text-caption1 text-foreground-quaternary">
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  )
}
