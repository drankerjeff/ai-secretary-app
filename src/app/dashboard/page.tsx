export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">

      {/* Welcome */}
      <div className="space-y-1">
        <p className="text-footnote text-foreground-tertiary">ようこそ</p>
        <h1 className="text-title1 font-semibold text-foreground">AI Secretary</h1>
        <p className="text-callout text-foreground-secondary">
          左のメニューから各機能をお使いください。
        </p>
      </div>

      {/* Quick actions */}
      <section aria-label="クイックアクション">
        <h2 className="text-headline font-semibold text-foreground mb-4">クイックアクション</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: 'タスク管理',  href: '/dashboard/tasks',                  icon: '✓',  desc: 'タスクを追加・管理' },
            { label: 'カレンダー',  href: '/dashboard/calendar',               icon: '📅', desc: 'スケジュールを確認' },
            { label: '文章校正',    href: '/dashboard/documents/proofread',    icon: '✏️', desc: 'AI で誤字・表現を修正' },
            { label: '議事録',      href: '/dashboard/documents/minutes',      icon: '🎙', desc: 'AI で自動作成' },
            { label: '検索',        href: '/dashboard/documents/research',     icon: '🔍', desc: 'AI で検索・リサーチ' },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className={[
                'apple-card flex items-start gap-3 p-4',
                'transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
                'hover:scale-[1.02] hover:shadow-lg',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              ].join(' ')}
            >
              <span className="text-title3 leading-none" aria-hidden="true">{action.icon}</span>
              <div>
                <p className="text-subheadline font-semibold text-foreground">{action.label}</p>
                <p className="text-caption1 text-foreground-tertiary mt-0.5">{action.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
