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
  const [badges, setBadges] = React.useState(['Design', 'Development', 'AI'])

  // Tabs state
  const [activeTab, setActiveTab] = React.useState('overview')

  const selectOptions = [
    { value: 'tokyo', label: 'Tokyo' },
    { value: 'osaka', label: 'Osaka' },
    { value: 'kyoto', label: 'Kyoto' },
    { value: 'sapporo', label: 'Sapporo' },
    { value: 'fukuoka', label: 'Fukuoka' },
  ]

  const demoTabs = [
    { id: 'overview', label: 'Overview', icon: <IconCalendar /> },
    { id: 'tasks', label: 'Tasks', icon: <IconMail /> },
    { id: 'settings', label: 'Settings' },
  ]

  const handleLoadingDemo = () => {
    setLoadingBtn(true)
    setTimeout(() => setLoadingBtn(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-14">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-footnote text-foreground-tertiary uppercase tracking-widest">
            UI Component Library
          </p>
          <h1 className="text-largetitle font-semibold text-gradient-primary">
            AI Secretary
          </h1>
          <p className="text-body text-foreground-secondary">
            Design system showcase — all 10 shared components
          </p>
        </div>

        {/* ---- 1. Button ---- */}
        <Section title="1. Button">
          <div className="space-y-4">
            {/* Variants */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* With icons */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">With icons</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<IconPlus />}>New Task</Button>
                <Button variant="outline" rightIcon={<IconSearch />}>Search</Button>
                <Button variant="secondary" leftIcon={<IconCalendar />} rightIcon={<IconMail />}>
                  Schedule
                </Button>
              </div>
            </div>

            {/* Loading & disabled */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Loading &amp; Disabled</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading={loadingBtn} onClick={handleLoadingDemo}>
                  {loadingBtn ? 'Saving...' : 'Click to load'}
                </Button>
                <Button variant="outline" disabled>Disabled</Button>
                <Button variant="destructive" loading>Processing</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- 2. Input ---- */}
        <Section title="2. Input">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="Hisayoshi Tamura"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              hint="Enter your legal name"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<IconMail />}
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={passwordVal}
              onChange={(e) => setPasswordVal(e.target.value)}
            />
            <Input
              label="Search"
              type="search"
              placeholder="Search tasks..."
              leftIcon={<IconSearch />}
              error="No results found for this query"
            />
          </div>
        </Section>

        {/* ---- 3. Card ---- */}
        <Section title="3. Card">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader withBorder>
                <h3 className="text-headline font-semibold text-foreground">Standard Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-callout text-foreground-secondary">
                  This is a standard apple-card with header, body, and footer subcomponents.
                </p>
              </CardBody>
              <CardFooter withBorder>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </CardFooter>
            </Card>

            <Card clickable>
              <CardBody>
                <div className="space-y-2">
                  <Badge variant="primary">Clickable</Badge>
                  <h3 className="text-headline font-semibold text-foreground">Interactive Card</h3>
                  <p className="text-callout text-foreground-secondary">
                    Hover to see scale + shadow animation. Also keyboard accessible.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* ---- 4. Modal ---- */}
        <Section title="4. Modal">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
          </div>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Schedule Meeting"
            size="md"
          >
            <div className="space-y-4">
              <p className="text-callout text-foreground-secondary">
                Fill in the details to schedule a new meeting. The modal traps focus,
                closes on Escape, and closes when clicking the overlay.
              </p>
              <Input label="Meeting Title" placeholder="Q2 Planning Session" />
              <Input label="Date" type="date" leftIcon={<IconCalendar />} />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>Schedule</Button>
              </div>
            </div>
          </Modal>
        </Section>

        {/* ---- 5. Alert ---- */}
        <Section title="5. Alert">
          <div className="space-y-3">
            <Alert type="info" title="New feature available">
              Your AI secretary can now handle calendar invites automatically.
            </Alert>
            <Alert type="success" title="Task completed">
              The meeting notes have been sent to all participants.
            </Alert>
            <Alert type="warning" title="Action required">
              Your API key will expire in 3 days. Please renew it.
            </Alert>
            {alertVisible && (
              <Alert
                type="error"
                title="Connection failed"
                dismissible
                onDismiss={() => setAlertVisible(false)}
              >
                Unable to sync with calendar. Check your network connection.
              </Alert>
            )}
            {!alertVisible && (
              <Button variant="ghost" size="sm" onClick={() => setAlertVisible(true)}>
                Restore dismissed alert
              </Button>
            )}
          </div>
        </Section>

        {/* ---- 6. Select ---- */}
        <Section title="6. Select">
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="City"
              options={selectOptions}
              value={selectVal}
              onChange={setSelectVal}
              placeholder="Choose a city"
            />
            <Select
              label="City (Searchable)"
              options={selectOptions}
              value={searchableVal}
              onChange={setSearchableVal}
              placeholder="Search and select"
              searchable
            />
            <Select
              label="With error"
              options={selectOptions}
              value=""
              onChange={() => {}}
              placeholder="Required field"
              error="Please select a city"
            />
            <Select
              label="Disabled"
              options={selectOptions}
              value=""
              onChange={() => {}}
              placeholder="Not available"
              disabled
            />
          </div>
        </Section>

        {/* ---- 7. Textarea ---- */}
        <Section title="7. Textarea">
          <div className="grid gap-5 sm:grid-cols-2">
            <Textarea
              label="Meeting Notes"
              placeholder="Enter notes from the meeting..."
              hint="Markdown is supported"
              value={textareaVal}
              onChange={setTextareaVal}
              maxLength={200}
            />
            <Textarea
              label="Auto-resize"
              placeholder="Type here and watch me grow..."
              autoResize
              hint="Expands as you type"
            />
            <Textarea
              label="With error"
              placeholder="Required field"
              error="This field is required"
            />
          </div>
        </Section>

        {/* ---- 8. Badge ---- */}
        <Section title="8. Badge">
          <div className="space-y-4">
            {/* Variants */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Variants</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="sm">Small</Badge>
                <Badge variant="primary" size="md">Medium</Badge>
              </div>
            </div>

            {/* Dismissible */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Dismissible tags</p>
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
                    onClick={() => setBadges(['Design', 'Development', 'AI'])}
                  >
                    Reset badges
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* ---- 9. Spinner ---- */}
        <Section title="9. Spinner">
          <div className="space-y-4">
            {/* Sizes */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Sizes</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-caption1 text-foreground-tertiary">sm (16px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-caption1 text-foreground-tertiary">md (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-caption1 text-foreground-tertiary">lg (32px)</span>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Colors</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner color="primary" />
                  <span className="text-caption1 text-foreground-tertiary">primary</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner color="foreground" />
                  <span className="text-caption1 text-foreground-tertiary">foreground</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner color="muted" />
                  <span className="text-caption1 text-foreground-tertiary">muted</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- 10. Tabs ---- */}
        <Section title="10. Tabs">
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
                  Overview tab content — showing your AI secretary dashboard summary.
                </p>
              )}
              {activeTab === 'tasks' && (
                <p className="text-callout text-foreground-secondary">
                  Tasks tab content — showing pending and completed tasks.
                </p>
              )}
              {activeTab === 'settings' && (
                <p className="text-callout text-foreground-secondary">
                  Settings tab content — configure your AI secretary preferences.
                </p>
              )}
            </div>

            <div>
              <p className="text-footnote text-foreground-tertiary mb-3">Full-width variant</p>
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
            AI Secretary — UI Component Library — Next.js 16 · React 19 · TypeScript · Tailwind CSS v3
          </p>
        </div>
      </div>
    </main>
  )
}
