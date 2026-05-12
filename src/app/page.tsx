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

// ---- Icons (inline SVG helpers) ----

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

// ---- Toast helper ----

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 1800)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-[--radius] bg-background-elevated border border-border-subtle shadow-lg text-callout text-foreground">
      {message}
    </div>
  )
}

// ---- Section wrapper ----

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-title3 font-semibold text-foreground border-b border-border-subtle pb-3">
        {title}
      </h2>
      {children}
    </section>
  )
}

// ---- Demo Page ----

export default function DemoPage() {
  // Toast
  const [toast, setToast] = React.useState<string | null>(null)
  const showToast = (msg: string) => setToast(msg)

  // Button state
  const [loadingBtn, setLoadingBtn] = React.useState(false)

  // Input state
  const [inputVal, setInputVal] = React.useState('')
  const [emailVal, setEmailVal] = React.useState('')
  const [passwordVal, setPasswordVal] = React.useState('')

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false)

  // Select state
  const [selectVal, setSelectVal] = React.useState('')
  const [searchableVal, setSearchableVal] = React.useState('')

  // Textarea state
  const [textareaVal, setTextareaVal] = React.useState('')

  // Alert dismiss state
  const [alertVisible, setAlertVisible] = React.useState(true)

  // Badge dismiss state
  const [badges, setBadges] = React.useState(['デザイン', '開発', 'AI'])

  // Tabs state
  const [activeTab, setActiveTab] = React.useState('overview')

  const selectOptions = [
    { value: 'tokyo', label: '東京' },
    { value: 'osaka', label: '大阪' },
    { value: 'kyoto', label: '京都' },
    { value: 'sapporo', label: '札幌' },
    { value: 'fukuoka', label: '福岡' },
  ]

  const demoTabs = [
    { id: 'overview', label: '概要', icon: <IconCalendar /> },
    { id: 'tasks', label: 'タスク', icon: <IconMail /> },
    { id: 'settings', label: '設定' },
  ]

  const handleLoadingDemo = () => {
    setLoadingBtn(true)
    setTimeout(() => setLoadingBtn(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="mx-auto max-w-3xl space-y-14">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-footnote text-foreground-tertiary uppercase tracking-widest">
            UIコンポーネントライブラリ
          </p>
          <h1 className="text-largetitle font-semibold text-gradient-primary">
            AI Secretary
          </h1>
          <p className="text-body text-foreground-secondary">
            デザインシステム — 全10コンポーネント
          </p>
        </div>

        {/* ---- 1. Button ---- */}
        <Section title="1. ボタン">
          <div className="space-y-4">
            {/* Variants */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">バリアント</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => showToast('プライマリボタンが押されました')}>プライマリ</Button>
                <Button variant="secondary" onClick={() => showToast('セカンダリボタンが押されました')}>セカンダリ</Button>
                <Button variant="outline" onClick={() => showToast('アウトラインボタンが押されました')}>アウトライン</Button>
                <Button variant="ghost" onClick={() => showToast('ゴーストボタンが押されました')}>ゴースト</Button>
                <Button variant="destructive" onClick={() => showToast('デストラクティブボタンが押されました')}>削除</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">サイズ</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={() => showToast('小ボタンが押されました')}>小</Button>
                <Button size="md" onClick={() => showToast('中ボタンが押されました')}>中</Button>
                <Button size="lg" onClick={() => showToast('大ボタンが押されました')}>大</Button>
              </div>
            </div>

            {/* With icons */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">アイコン付き</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<IconPlus />} onClick={() => showToast('新規タスクを作成します')}>新規タスク</Button>
                <Button variant="outline" rightIcon={<IconSearch />} onClick={() => showToast('検索します')}>検索</Button>
                <Button variant="secondary" leftIcon={<IconCalendar />} rightIcon={<IconMail />} onClick={() => showToast('スケジュールを追加します')}>
                  スケジュール
                </Button>
              </div>
            </div>

            {/* Loading & disabled */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">ローディング &amp; 無効</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading={loadingBtn} onClick={handleLoadingDemo}>
                  {loadingBtn ? '保存中...' : 'クリックしてロード'}
                </Button>
                <Button variant="outline" disabled>無効</Button>
                <Button variant="destructive" loading>処理中</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- 2. Input ---- */}
        <Section title="2. 入力フィールド">
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
        </Section>

        {/* ---- 3. Card ---- */}
        <Section title="3. カード">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader withBorder>
                <h3 className="text-headline font-semibold text-foreground">スタンダードカード</h3>
              </CardHeader>
              <CardBody>
                <p className="text-callout text-foreground-secondary">
                  ヘッダー・ボディ・フッターを持つ標準カードです。
                </p>
              </CardBody>
              <CardFooter withBorder>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => showToast('詳細を表示します')}>詳細を見る</Button>
                </div>
              </CardFooter>
            </Card>

            <Card clickable onClick={() => showToast('カードがクリックされました')}>
              <CardBody>
                <div className="space-y-2">
                  <Badge variant="primary">クリック可能</Badge>
                  <h3 className="text-headline font-semibold text-foreground">インタラクティブカード</h3>
                  <p className="text-callout text-foreground-secondary">
                    ホバーするとスケール・シャドウアニメーションが表示されます。
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* ---- 4. Modal ---- */}
        <Section title="4. モーダル">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              モーダルを開く
            </Button>
          </div>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="会議をスケジュール"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-callout text-foreground-secondary">
                会議の詳細を入力してください。モーダルはEscキーまたはオーバーレイクリックで閉じます。
              </p>
              <Input label="会議タイトル" placeholder="Q2 計画セッション" />
              <Input label="日付" type="date" leftIcon={<IconCalendar />} />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>キャンセル</Button>
                <Button variant="primary" onClick={() => { setModalOpen(false); showToast('会議をスケジュールしました') }}>スケジュール</Button>
              </div>
            </div>
          </Modal>
        </Section>

        {/* ---- 5. Alert ---- */}
        <Section title="5. アラート">
          <div className="space-y-3">
            <Alert type="info" title="新機能が利用可能です">
              AIアシスタントがカレンダーの招待を自動処理できるようになりました。
            </Alert>
            <Alert type="success" title="タスク完了">
              会議のメモが全参加者に送信されました。
            </Alert>
            <Alert type="warning" title="対応が必要です">
              APIキーの有効期限が3日後に切れます。更新してください。
            </Alert>
            {alertVisible && (
              <Alert
                type="error"
                title="接続に失敗しました"
                dismissible
                onDismiss={() => setAlertVisible(false)}
              >
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

        {/* ---- 6. Select ---- */}
        <Section title="6. セレクト">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="都市"
              options={selectOptions}
              value={selectVal}
              onChange={setSelectVal}
              placeholder="都市を選択"
            />
            <Select
              label="都市（検索可能）"
              options={selectOptions}
              value={searchableVal}
              onChange={setSearchableVal}
              placeholder="検索して選択"
              searchable
            />
            <Select
              label="エラー表示"
              options={selectOptions}
              value=""
              onChange={() => {}}
              placeholder="必須項目"
              error="都市を選択してください"
            />
            <Select
              label="無効"
              options={selectOptions}
              value=""
              onChange={() => {}}
              placeholder="利用不可"
              disabled
            />
          </div>
        </Section>

        {/* ---- 7. Textarea ---- */}
        <Section title="7. テキストエリア">
          <div className="grid gap-5 sm:grid-cols-2">
            <Textarea
              label="会議メモ"
              placeholder="会議のメモを入力..."
              hint="Markdownに対応しています"
              value={textareaVal}
              onChange={setTextareaVal}
              maxLength={200}
            />
            <Textarea
              label="自動リサイズ"
              placeholder="入力すると自動的に広がります..."
              autoResize
              hint="入力に合わせて拡張されます"
            />
            <Textarea
              label="エラー表示"
              placeholder="必須項目"
              error="この項目は必須です"
            />
          </div>
        </Section>

        {/* ---- 8. Badge ---- */}
        <Section title="8. バッジ">
          <div className="space-y-4">
            {/* Variants */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">バリアント</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">デフォルト</Badge>
                <Badge variant="primary">プライマリ</Badge>
                <Badge variant="success">成功</Badge>
                <Badge variant="warning">警告</Badge>
                <Badge variant="destructive">削除</Badge>
                <Badge variant="outline">アウトライン</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">サイズ</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm">小</Badge>
                <Badge variant="primary" size="md">中</Badge>
              </div>
            </div>

            {/* Dismissible */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">削除可能なタグ</p>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="primary"
                    dismissible
                    onDismiss={() => setBadges((prev) => prev.filter((b) => b !== badge))}
                  >
                    {badge}
                  </Badge>
                ))}
                {badges.length === 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBadges(['デザイン', '開発', 'AI'])}
                  >
                    バッジをリセット
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* ---- 9. Spinner ---- */}
        <Section title="9. スピナー">
          <div className="space-y-4">
            {/* Sizes */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">サイズ</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-caption1 text-foreground-tertiary">小 (16px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-caption1 text-foreground-tertiary">中 (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-caption1 text-foreground-tertiary">大 (32px)</span>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">カラー</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner color="primary" />
                  <span className="text-caption1 text-foreground-tertiary">プライマリ</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner color="foreground" />
                  <span className="text-caption1 text-foreground-tertiary">フォアグラウンド</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner color="muted" />
                  <span className="text-caption1 text-foreground-tertiary">ミュート</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- 10. Tabs ---- */}
        <Section title="10. タブ">
          <div className="space-y-4">
            <Tabs
              tabs={demoTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="apple-inset rounded-lg p-4"
            >
              {activeTab === 'overview' && (
                <p className="text-callout text-foreground-secondary">
                  概要タブのコンテンツ — AIアシスタントのダッシュボードサマリーを表示します。
                </p>
              )}
              {activeTab === 'tasks' && (
                <p className="text-callout text-foreground-secondary">
                  タスクタブのコンテンツ — 未完了・完了済みのタスクを表示します。
                </p>
              )}
              {activeTab === 'settings' && (
                <p className="text-callout text-foreground-secondary">
                  設定タブのコンテンツ — AIアシスタントの設定を行います。
                </p>
              )}
            </div>

            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">全幅バリアント</p>
              <Tabs
                tabs={demoTabs.slice(0, 3)}
                activeTab={activeTab}
                onChange={setActiveTab}
                fullWidth
              />
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="border-t border-border-subtle pt-8 text-center">
          <p className="text-footnote text-foreground-quaternary">
            AI Secretary — UIコンポーネントライブラリ — Next.js 16 · React 19 · TypeScript · Tailwind CSS v3
          </p>
        </div>
      </div>
    </main>
  )
}
