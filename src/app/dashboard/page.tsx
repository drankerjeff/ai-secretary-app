import Link from 'next/link'

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

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    label: 'タスク管理',
    href: '/dashboard/tasks',
    icon: <IconCheck />,
    desc: 'タスクを追加・整理する',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    label: 'カレンダー',
    href: '/dashboard/calendar',
    icon: <IconCalendar />,
    desc: 'スケジュールを確認する',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    label: '文章校正',
    href: '/dashboard/documents/proofread',
    icon: <IconEdit />,
    desc: 'AI で誤字・表現を修正',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    label: '議事録',
    href: '/dashboard/documents/minutes',
    icon: <IconMic />,
    desc: '音声から議事録を自動作成',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    label: 'リサーチ',
    href: '/dashboard/documents/research',
    icon: <IconSearch />,
    desc: 'AI で検索・情報収集',
    color: 'text-info',
    bg: 'bg-info/10',
  },
] as const

// ── Page ───────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-4xl">

      {/* Welcome */}
      <div className="space-y-1.5">
        <p className="text-footnote text-foreground-tertiary uppercase tracking-wider">ようこそ</p>
        <h1 className="text-title1 font-semibold text-gradient-primary">AI Secretary</h1>
        <p className="text-callout text-foreground-secondary">
          スケジュール管理・議事録・文書作成を AI がサポートします。
        </p>
      </div>

      <div className="apple-divider" />

      {/* Quick actions */}
      <section aria-label="クイックアクション">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-headline font-semibold text-foreground">クイックアクション</h2>
          <span className="text-caption1 text-foreground-quaternary">{QUICK_ACTIONS.length} 機能</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={[
                'apple-card flex items-start gap-4 p-5 group',
                'transition-all duration-250 ease-apple-ease',
                'hover:scale-[1.015] hover:shadow-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              ].join(' ')}
            >
              {/* Icon */}
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[--radius] ${action.bg} ${action.color}`}>
                {action.icon}
              </span>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-subheadline font-semibold text-foreground">{action.label}</p>
                <p className="text-caption1 text-foreground-tertiary mt-0.5 leading-relaxed">{action.desc}</p>
              </div>

              {/* Arrow */}
              <span className="text-foreground-quaternary group-hover:text-foreground-secondary transition-colors duration-200 shrink-0 mt-1">
                <IconArrow />
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
