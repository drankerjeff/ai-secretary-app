'use client'

import * as React from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Modal,
  Select,
  Spinner,
  Tabs,
  Textarea,
} from '@/components/ui'

// ── Icons ──────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ── Primitives ─────────────────────────────────────────────

function Divider() {
  return <div className="apple-divider" aria-hidden="true" />
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="apple-glass px-5 py-3 rounded-full flex items-center gap-2.5 shadow-lg">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/20 text-success shrink-0">
          <IconCheck />
        </span>
        <span className="text-subheadline text-foreground whitespace-nowrap">{message}</span>
      </div>
    </div>
  )
}

// Section wrapper — Apple-style numbered section heading
function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-caption1 font-semibold shrink-0">
          {number}
        </span>
        <h2 className="text-title3 font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// Demo group — label + content
function DemoGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-caption1 font-semibold uppercase tracking-wider text-foreground-quaternary pl-1">
        {label}
      </p>
      {children}
    </div>
  )
}

// ── Color swatch ───────────────────────────────────────────

function ColorSwatch({ name, variable, textDark = false }: { name: string; variable: string; textDark?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-12 rounded-lg border border-border-subtle shadow-sm"
        style={{ background: `var(${variable})` }}
      />
      <div>
        <p className={`text-caption1 font-medium ${textDark ? 'text-foreground' : 'text-foreground-secondary'}`}>{name}</p>
        <p className="text-caption2 text-foreground-tertiary font-mono">{variable}</p>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────

export default function DesignSystemPage() {
  // State
  const [toast, setToast] = React.useState<string | null>(null)
  const showToast = (msg: string) => setToast(msg)

  const [loadingBtn, setLoadingBtn] = React.useState(false)
  const [inputVal, setInputVal]     = React.useState('')
  const [emailVal, setEmailVal]     = React.useState('')
  const [passwordVal, setPasswordVal] = React.useState('')
  const [modalOpen, setModalOpen]   = React.useState(false)
  const [selectVal, setSelectVal]   = React.useState('')
  const [searchableVal, setSearchableVal] = React.useState('')
  const [textareaVal, setTextareaVal] = React.useState('')
  const [alertVisible, setAlertVisible] = React.useState(true)
  const [badges, setBadges]         = React.useState(['デザイン', '開発', 'AI'])
  const [activeTab, setActiveTab]   = React.useState('overview')

  const selectOptions = [
    { value: 'tokyo',    label: '東京' },
    { value: 'osaka',    label: '大阪' },
    { value: 'kyoto',    label: '京都' },
    { value: 'sapporo',  label: '札幌' },
    { value: 'fukuoka',  label: '福岡' },
  ]
  const demoTabs = [
    { id: 'overview',  label: '概要',  icon: <IconCalendar /> },
    { id: 'tasks',     label: 'タスク', icon: <IconMail /> },
    { id: 'settings',  label: '設定' },
  ]

  const handleLoadingDemo = () => {
    setLoadingBtn(true)
    setTimeout(() => setLoadingBtn(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-border-subtle">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(10,132,255,0.12) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full apple-glass text-caption1 font-medium text-foreground-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-subtle" aria-hidden="true" />
            チケット #01 — デザインシステム
          </div>
          <div className="space-y-3">
            <h1 className="text-largetitle font-semibold text-gradient-primary leading-tight">
              AI Secretary
            </h1>
            <p className="text-title3 font-light text-foreground-secondary">
              UIコンポーネントライブラリ
            </p>
          </div>
          <p className="text-body text-foreground-tertiary max-w-xl leading-relaxed">
            Apple Human Interface Guidelines に準拠したデザインシステム。
            CSS変数ベースのトークン、厳密な型付け、WAI-ARIA完全対応。
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { value: '10', label: 'コンポーネント' },
              { value: 'HIG', label: 'Apple 準拠' },
              { value: '44px', label: 'タッチターゲット' },
              { value: 'WCAG AA', label: 'アクセシビリティ' },
            ].map((s) => (
              <div key={s.label} className="apple-inset px-4 py-2.5 rounded-lg">
                <p className="text-title3 font-semibold text-foreground">{s.value}</p>
                <p className="text-caption1 text-foreground-tertiary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-14 space-y-16">

        {/* ── Design Tokens ─────────────────────────────── */}
        <section className="space-y-10 animate-fade-in">
          <div className="space-y-1">
            <p className="text-caption1 font-semibold uppercase tracking-wider text-foreground-quaternary">
              デザイントークン
            </p>
            <h2 className="text-title2 font-semibold text-foreground">カラーパレット</h2>
          </div>

          <div className="space-y-6">
            <DemoGroup label="バックグラウンド">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch name="Base"      variable="--background" />
                <ColorSwatch name="Elevated"  variable="--background-elevated" />
                <ColorSwatch name="Secondary" variable="--background-secondary" />
                <ColorSwatch name="Tertiary"  variable="--background-tertiary" />
              </div>
            </DemoGroup>

            <DemoGroup label="システムカラー">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch name="Blue (Primary)"    variable="--primary" />
                <ColorSwatch name="Green (Success)"   variable="--success" />
                <ColorSwatch name="Yellow (Warning)"  variable="--warning" textDark />
                <ColorSwatch name="Red (Destructive)" variable="--destructive" />
              </div>
            </DemoGroup>

            <DemoGroup label="フィル / セパレーター">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch name="Fill"      variable="--fill" />
                <ColorSwatch name="Fill 2nd"  variable="--fill-secondary" />
                <ColorSwatch name="Border"    variable="--border" />
                <ColorSwatch name="Subtle"    variable="--border-subtle" />
              </div>
            </DemoGroup>
          </div>

          <Divider />

          {/* Typography scale */}
          <div className="space-y-1">
            <p className="text-caption1 font-semibold uppercase tracking-wider text-foreground-quaternary">
              デザイントークン
            </p>
            <h2 className="text-title2 font-semibold text-foreground">タイポグラフィスケール</h2>
          </div>
          <div className="apple-card divide-y divide-border-subtle">
            {[
              { cls: 'text-largetitle',  label: 'Large Title',  spec: '34px / 41px' },
              { cls: 'text-title1',      label: 'Title 1',      spec: '28px / 34px' },
              { cls: 'text-title2',      label: 'Title 2',      spec: '22px / 28px' },
              { cls: 'text-title3',      label: 'Title 3',      spec: '20px / 25px' },
              { cls: 'text-headline',    label: 'Headline',     spec: '17px / 22px  Semibold' },
              { cls: 'text-body',        label: 'Body',         spec: '17px / 22px' },
              { cls: 'text-callout',     label: 'Callout',      spec: '16px / 21px' },
              { cls: 'text-subheadline', label: 'Subheadline',  spec: '15px / 20px' },
              { cls: 'text-footnote',    label: 'Footnote',     spec: '13px / 18px' },
              { cls: 'text-caption1',    label: 'Caption 1',    spec: '12px / 16px' },
              { cls: 'text-caption2',    label: 'Caption 2',    spec: '11px / 13px' },
            ].map(({ cls, label, spec }) => (
              <div key={cls} className="flex items-baseline justify-between px-5 py-3 gap-4">
                <span className={`${cls} text-foreground`}>{label}</span>
                <span className="text-caption2 text-foreground-quaternary font-mono shrink-0">{spec}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── 1. Button ─────────────────────────────────── */}
        <Section number="1" title="ボタン">
          <div className="apple-card p-6 space-y-6">
            <DemoGroup label="バリアント">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary"     onClick={() => showToast('プライマリボタン')}>プライマリ</Button>
                <Button variant="secondary"   onClick={() => showToast('セカンダリボタン')}>セカンダリ</Button>
                <Button variant="outline"     onClick={() => showToast('アウトライン')}>アウトライン</Button>
                <Button variant="ghost"       onClick={() => showToast('ゴースト')}>ゴースト</Button>
                <Button variant="destructive" onClick={() => showToast('削除アクション')}>削除</Button>
              </div>
            </DemoGroup>

            <Divider />

            <DemoGroup label="サイズ">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={() => showToast('小ボタン')}>小</Button>
                <Button size="md" onClick={() => showToast('中ボタン')}>中</Button>
                <Button size="lg" onClick={() => showToast('大ボタン')}>大</Button>
              </div>
            </DemoGroup>

            <Divider />

            <DemoGroup label="アイコン付き">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary"   leftIcon={<IconPlus />}   onClick={() => showToast('新規タスク作成')}>新規タスク</Button>
                <Button variant="outline"   rightIcon={<IconSearch />} onClick={() => showToast('検索')}>検索</Button>
                <Button variant="secondary" leftIcon={<IconCalendar />} rightIcon={<IconMail />} onClick={() => showToast('スケジュール')}>
                  スケジュール
                </Button>
              </div>
            </DemoGroup>

            <Divider />

            <DemoGroup label="ローディング & 無効">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary"     loading={loadingBtn} onClick={handleLoadingDemo}>
                  {loadingBtn ? '保存中...' : 'クリックしてロード'}
                </Button>
                <Button variant="outline"     disabled>無効</Button>
                <Button variant="destructive" loading>処理中</Button>
              </div>
            </DemoGroup>
          </div>
        </Section>

        <Divider />

        {/* ── 2. Input ──────────────────────────────────── */}
        <Section number="2" title="入力フィールド">
          <div className="apple-card p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="氏名"
                placeholder="田村 寿"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                hint="正式な氏名を入力してください"
              />
              <Input
                label="メールアドレス"
                type="email"
                placeholder="you@example.com"
                leftIcon={<IconMail />}
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
              />
              <Input
                label="パスワード"
                type="password"
                placeholder="8文字以上"
                value={passwordVal}
                onChange={(e) => setPasswordVal(e.target.value)}
              />
              <Input
                label="検索"
                type="search"
                placeholder="タスクを検索..."
                leftIcon={<IconSearch />}
                error="該当するタスクが見つかりません"
              />
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── 3. Card ───────────────────────────────────── */}
        <Section number="3" title="カード">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader withBorder>
                <h3 className="text-headline font-semibold text-foreground">スタンダードカード</h3>
              </CardHeader>
              <CardBody>
                <p className="text-callout text-foreground-secondary">
                  ヘッダー・ボディ・フッターを持つ標準カードです。border と shadow はデザイントークンで制御されます。
                </p>
              </CardBody>
              <CardFooter withBorder>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => showToast('詳細を表示')}>詳細を見る</Button>
                </div>
              </CardFooter>
            </Card>

            <Card clickable onClick={() => showToast('カードをクリック')}>
              <CardBody>
                <div className="space-y-2">
                  <Badge variant="primary">クリック可能</Badge>
                  <h3 className="text-headline font-semibold text-foreground">インタラクティブカード</h3>
                  <p className="text-callout text-foreground-secondary">
                    ホバーでスケール・シャドウアニメーション。キーボード操作にも対応。
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Section>

        <Divider />

        {/* ── 4. Modal ──────────────────────────────────── */}
        <Section number="4" title="モーダル">
          <div className="apple-card p-6">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              モーダルを開く
            </Button>
          </div>

          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="会議をスケジュール" size="md">
            <div className="space-y-4">
              <p className="text-callout text-foreground-secondary">
                会議の詳細を入力してください。Esc キーまたはオーバーレイクリックで閉じます。フォーカストラップ対応。
              </p>
              <Input label="会議タイトル" placeholder="Q2 計画セッション" />
              <Input label="日付" type="date" leftIcon={<IconCalendar />} />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost"   onClick={() => setModalOpen(false)}>キャンセル</Button>
                <Button variant="primary" onClick={() => { setModalOpen(false); showToast('会議をスケジュールしました') }}>
                  スケジュール
                </Button>
              </div>
            </div>
          </Modal>
        </Section>

        <Divider />

        {/* ── 5. Alert ──────────────────────────────────── */}
        <Section number="5" title="アラート">
          <div className="space-y-3">
            <Alert type="info" title="新機能が利用可能です">
              AIアシスタントがカレンダー招待を自動処理できるようになりました。
            </Alert>
            <Alert type="success" title="タスク完了">
              会議のメモが全参加者に送信されました。
            </Alert>
            <Alert type="warning" title="対応が必要です">
              APIキーの有効期限が3日後に切れます。更新してください。
            </Alert>
            {alertVisible && (
              <Alert type="error" title="接続に失敗しました" dismissible onDismiss={() => setAlertVisible(false)}>
                カレンダーと同期できません。ネットワーク接続を確認してください。
              </Alert>
            )}
            {!alertVisible && (
              <Button variant="ghost" size="sm" onClick={() => setAlertVisible(true)}>
                アラートを元に戻す
              </Button>
            )}
          </div>
        </Section>

        <Divider />

        {/* ── 6. Select ─────────────────────────────────── */}
        <Section number="6" title="セレクト">
          <div className="apple-card p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Select label="都市" options={selectOptions} value={selectVal} onChange={setSelectVal} placeholder="都市を選択" />
              <Select label="都市（検索可能）" options={selectOptions} value={searchableVal} onChange={setSearchableVal} placeholder="検索して選択" searchable />
              <Select label="エラー表示" options={selectOptions} value="" onChange={() => {}} placeholder="必須項目" error="都市を選択してください" />
              <Select label="無効" options={selectOptions} value="" onChange={() => {}} placeholder="利用不可" disabled />
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── 7. Textarea ───────────────────────────────── */}
        <Section number="7" title="テキストエリア">
          <div className="apple-card p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Textarea
                label="会議メモ"
                placeholder="会議のメモを入力..."
                hint="Markdown に対応しています"
                value={textareaVal}
                onChange={setTextareaVal}
                maxLength={200}
              />
              <Textarea label="自動リサイズ" placeholder="入力すると自動的に広がります..." autoResize hint="入力に合わせて拡張" />
              <Textarea label="エラー表示" placeholder="必須項目" error="この項目は必須です" />
            </div>
          </div>
        </Section>

        <Divider />

        {/* ── 8. Badge ──────────────────────────────────── */}
        <Section number="8" title="バッジ">
          <div className="apple-card p-6 space-y-6">
            <DemoGroup label="バリアント">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">デフォルト</Badge>
                <Badge variant="primary">プライマリ</Badge>
                <Badge variant="success">成功</Badge>
                <Badge variant="warning">警告</Badge>
                <Badge variant="destructive">削除</Badge>
                <Badge variant="outline">アウトライン</Badge>
              </div>
            </DemoGroup>
            <Divider />
            <DemoGroup label="サイズ">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm">小</Badge>
                <Badge variant="primary" size="md">中</Badge>
              </div>
            </DemoGroup>
            <Divider />
            <DemoGroup label="削除可能なタグ">
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge key={badge} variant="primary" dismissible onDismiss={() => setBadges((p) => p.filter((b) => b !== badge))}>
                    {badge}
                  </Badge>
                ))}
                {badges.length === 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setBadges(['デザイン', '開発', 'AI'])}>
                    バッジをリセット
                  </Button>
                )}
              </div>
            </DemoGroup>
          </div>
        </Section>

        <Divider />

        {/* ── 9. Spinner ────────────────────────────────── */}
        <Section number="9" title="スピナー">
          <div className="apple-card p-6 space-y-6">
            <DemoGroup label="サイズ">
              <div className="flex items-center gap-8">
                {[{ size: 'sm' as const, label: '小 16px' }, { size: 'md' as const, label: '中 24px' }, { size: 'lg' as const, label: '大 32px' }].map(({ size, label }) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <Spinner size={size} />
                    <span className="text-caption2 text-foreground-tertiary">{label}</span>
                  </div>
                ))}
              </div>
            </DemoGroup>
            <Divider />
            <DemoGroup label="カラー">
              <div className="flex items-center gap-8">
                {[
                  { color: 'primary' as const,    label: 'Primary' },
                  { color: 'foreground' as const,  label: 'Foreground' },
                  { color: 'muted' as const,       label: 'Muted' },
                ].map(({ color, label }) => (
                  <div key={color} className="flex flex-col items-center gap-2">
                    <Spinner color={color} />
                    <span className="text-caption2 text-foreground-tertiary">{label}</span>
                  </div>
                ))}
              </div>
            </DemoGroup>
          </div>
        </Section>

        <Divider />

        {/* ── 10. Tabs ──────────────────────────────────── */}
        <Section number="10" title="タブ">
          <div className="apple-card p-6 space-y-5">
            <Tabs tabs={demoTabs} activeTab={activeTab} onChange={setActiveTab} />
            <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="apple-inset rounded-lg p-4">
              {activeTab === 'overview' && (
                <p className="text-callout text-foreground-secondary">概要タブ — ダッシュボードサマリーを表示します。</p>
              )}
              {activeTab === 'tasks' && (
                <p className="text-callout text-foreground-secondary">タスクタブ — 未完了・完了済みのタスクを表示します。</p>
              )}
              {activeTab === 'settings' && (
                <p className="text-callout text-foreground-secondary">設定タブ — AIアシスタントの設定を行います。</p>
              )}
            </div>
            <div>
              <p className="text-caption2 text-foreground-quaternary mb-3 uppercase tracking-wider font-semibold">全幅</p>
              <Tabs tabs={demoTabs} activeTab={activeTab} onChange={setActiveTab} fullWidth />
            </div>
          </div>
        </Section>

        {/* ── Footer ────────────────────────────────────── */}
        <div className="pt-4">
          <Divider />
          <div className="pt-8 text-center space-y-1">
            <p className="text-subheadline font-medium text-foreground-secondary">AI Secretary</p>
            <p className="text-caption1 text-foreground-quaternary">
              UIコンポーネントライブラリ · Next.js 16 · React 19 · TypeScript · Tailwind CSS v3
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
