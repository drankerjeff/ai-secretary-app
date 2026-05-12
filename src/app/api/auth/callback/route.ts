import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // OAuthプロバイダーがエラーを返した場合
  if (error) {
    const params = new URLSearchParams({ error: errorDescription ?? error })
    return NextResponse.redirect(`${origin}/login?${params}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      const params = new URLSearchParams({ error: 'ログインに失敗しました。もう一度お試しください。' })
      return NextResponse.redirect(`${origin}/login?${params}`)
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
