import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const API = 'https://api.supabase.com/v1'
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN

function managementHeaders() {
  return {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!PROJECT_REF || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'SUPABASE_PROJECT_REF / SUPABASE_ACCESS_TOKEN が未設定です' }, { status: 500 })
  }

  const res = await fetch(`${API}/projects/${PROJECT_REF}/branches`, {
    headers: managementHeaders(),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!PROJECT_REF || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'SUPABASE_PROJECT_REF / SUPABASE_ACCESS_TOKEN が未設定です' }, { status: 500 })
  }

  const { name } = await req.json()
  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Branch名を入力してください' }, { status: 400 })
  }

  const res = await fetch(`${API}/projects/${PROJECT_REF}/branches`, {
    method: 'POST',
    headers: managementHeaders(),
    body: JSON.stringify({ branch_name: name.trim(), git_branch: name.trim() }),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
