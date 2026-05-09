import React from 'react'
import { render, screen } from '@testing-library/react'

import DashboardPage from '@/app/dashboard/page'
import TasksPage from '@/app/dashboard/tasks/page'
import CalendarPage from '@/app/dashboard/calendar/page'
import ResearchPage from '@/app/dashboard/documents/research/page'
import MinutesPage from '@/app/dashboard/documents/minutes/page'
import ProofreadPage from '@/app/dashboard/documents/proofread/page'

describe('DashboardPage', () => {
  it('renders without crashing', () => {
    render(<DashboardPage />)
  })

  it('renders the AI Secretary heading', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { name: 'AI Secretary' })).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<DashboardPage />)
    expect(screen.getByText('左のメニューから各機能をお使いください。')).toBeInTheDocument()
  })

  it('heading has text-title1 class', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('text-title1')
  })
})

describe('TasksPage', () => {
  it('renders without crashing', () => {
    render(<TasksPage />)
  })

  it('renders タスク管理 heading', () => {
    render(<TasksPage />)
    expect(screen.getByRole('heading', { name: 'タスク管理' })).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<TasksPage />)
    expect(screen.getByText('タスクの追加・管理ができます。')).toBeInTheDocument()
  })
})

describe('CalendarPage', () => {
  it('renders without crashing', () => {
    render(<CalendarPage />)
  })

  it('renders カレンダー heading', () => {
    render(<CalendarPage />)
    expect(screen.getByRole('heading', { name: 'カレンダー' })).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<CalendarPage />)
    expect(screen.getByText('スケジュールを確認・管理できます。')).toBeInTheDocument()
  })
})

describe('ResearchPage', () => {
  it('renders without crashing', () => {
    render(<ResearchPage />)
  })

  it('renders 検索 heading', () => {
    render(<ResearchPage />)
    expect(screen.getByRole('heading', { name: '検索' })).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<ResearchPage />)
    expect(screen.getByText('AI がトピックを検索・リサーチし、要点をまとめます。')).toBeInTheDocument()
  })
})

describe('MinutesPage', () => {
  it('renders without crashing', () => {
    render(<MinutesPage />)
  })

  it('renders 議事録 heading', () => {
    render(<MinutesPage />)
    expect(screen.getByRole('heading', { name: '議事録' })).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<MinutesPage />)
    expect(screen.getByText('音声または議題から AI が議事録を自動生成します。')).toBeInTheDocument()
  })
})

describe('ProofreadPage', () => {
  it('renders without crashing', () => {
    render(<ProofreadPage />)
  })

  it('renders 文章校正 heading', () => {
    render(<ProofreadPage />)
    expect(screen.getByRole('heading', { name: '文章校正' })).toBeInTheDocument()
  })

  it('renders subtext', () => {
    render(<ProofreadPage />)
    expect(screen.getByText('AI が誤字・表現・文体を自動チェックします。')).toBeInTheDocument()
  })
})
