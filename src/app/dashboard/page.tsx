'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthContext'

// ── Icons ──────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

// ── Types ──────────────────────────────────────────────────

type TaskStatus = '進行中' | '未着手' | '完了'

interface StatCard {
  icon: React.ReactNode
  value: string | number
  label: string
  subLabel: string
}

interface RecentTask {
  id: string
  title: string
  date: string
  status: TaskStatus
}

// ── Static data (placeholder until real API integration) ───

const STAT_CARDS: StatCard[] = [
  {
    icon: <IconCheck />,
    value: 8,
    label: '未完了タスク',
    subLabel: '期限: 今日 3件',
  },
  {
    icon: <IconCalendar />,
    value: 3,
    label: '本日の予定',
    subLabel: '次: 14:00 チームMTG',
  },
  {
    icon: <IconMic />,
    value: 12,
    label: '作成済み議事録',
    subLabel: '今月',
  },
  {
    icon: <IconEdit />,
    value: 5,
    label: '校正済み文書',
    subLabel: '今週',
  },
]

const RECENT_TASKS: RecentTask[] = [
  { id: '1', title: 'プロジェクト企画書の作成', date: '2026/05/12', status: '進行中' },
  { id: '2', title: 'チームミーティングの議事録', date: '2026/05/12', status: '未着手' },
  { id: '3', title: 'Q2レポートのレビュー', date: '2026/05/11', status: '完了' },
  { id: '4', title: 'クライアント向けプレゼン資料', date: '2026/05/13', status: '未着手' },
  { id: '5', title: 'バグ修正: ログイン画面のエラー', date: '2026/05/11', status: '進行中' },
]

// ── Subcomponents ──────────────────────────────────────────

function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="p-5 flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        {card.icon}
      </span>
      <div className="min-w-0">
        <p className="text-title2 font-semibold text-foreground leading-none">{card.value}</p>
        <p className="text-subheadline font-medium text-foreground-secondary mt-1">{card.label}</p>
        <p className="text-caption1 text-foreground-tertiary mt-0.5">{card.subLabel}</p>
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: RecentTask }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-subheadline font-medium text-foreground truncate">{task.title}</p>
        <p className="text-caption1 text-foreground-tertiary mt-0.5">{task.date}</p>
      </div>
      <span className="shrink-0 px-2.5 py-0.5 text-caption1 font-medium">
        {task.status}
      </span>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'おはようございます'
  if (hour < 18) return 'こんにちは'
  return 'こんばんは'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? ''

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Welcome */}
      <div className="space-y-1">
        <p className="text-footnote text-foreground-tertiary">{getGreeting()}</p>
        <h1 className="text-largetitle font-semibold text-foreground">{displayName}</h1>
        <p className="text-callout text-foreground-secondary">今日も AI Secretary がサポートします。</p>
      </div>

      {/* Stat cards */}
      <section aria-label="サマリー">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCardItem key={card.label} card={card} />
          ))}
        </div>
      </section>

      {/* Recent tasks */}
      <section aria-label="最近のタスク">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline font-semibold text-foreground">最近のタスク</h2>
          <Link
            href="/dashboard/tasks"
            className="text-footnote text-foreground-secondary"
          >
            すべて表示
          </Link>
        </div>

        <div className="px-5 divide-y divide-border-subtle">
          {RECENT_TASKS.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      </section>

    </div>
  )
}
