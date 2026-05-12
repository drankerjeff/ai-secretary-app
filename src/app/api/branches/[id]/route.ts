import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const API = 'https://api.supabase.com/v1'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!ACCESS_TOKEN) {
    return NextResponse.json({ error: 'SUPABASE_ACCESS_TOKEN が未設定です' }, { status: 500 })
  }

  const { id } = await params
  const res = await fetch(`${API}/branches/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  })

  if (res.status === 204) return new NextResponse(null, { status: 204 })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
