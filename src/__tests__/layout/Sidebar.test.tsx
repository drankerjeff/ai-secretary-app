import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}))

jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
    className,
    'aria-current': ariaCurrent,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    'aria-current'?: string
  }) {
    return (
      <a href={href} className={className} aria-current={ariaCurrent}>
        {children}
      </a>
    )
  }
})

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard')
  })

  it('renders nav with correct aria-label', () => {
    render(<Sidebar />)
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeInTheDocument()
  })

  it('renders the AI Secretary logo text', () => {
    render(<Sidebar />)
    expect(screen.getByText('AI Secretary')).toBeInTheDocument()
  })

  it('renders dashboard link', () => {
    render(<Sidebar />)
    const link = screen.getByRole('link', { name: /ダッシュボード/ })
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('renders tasks link', () => {
    render(<Sidebar />)
    const link = screen.getByRole('link', { name: /タスク管理/ })
    expect(link).toHaveAttribute('href', '/dashboard/tasks')
  })

  it('renders calendar link', () => {
    render(<Sidebar />)
    const link = screen.getByRole('link', { name: /カレンダー/ })
    expect(link).toHaveAttribute('href', '/dashboard/calendar')
  })

  it('renders proofread link', () => {
    render(<Sidebar />)
    const link = screen.getByRole('link', { name: /文章校正/ })
    expect(link).toHaveAttribute('href', '/dashboard/documents/proofread')
  })

  it('renders minutes link', () => {
    render(<Sidebar />)
    const link = screen.getByRole('link', { name: /議事録/ })
    expect(link).toHaveAttribute('href', '/dashboard/documents/minutes')
  })

  it('sets aria-current="page" on the active dashboard link', () => {
    mockUsePathname.mockReturnValue('/dashboard')
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /ダッシュボード/ })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('sets aria-current="page" on the active tasks link', () => {
    mockUsePathname.mockReturnValue('/dashboard/tasks')
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /タスク管理/ })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('does not set aria-current on inactive links', () => {
    mockUsePathname.mockReturnValue('/dashboard')
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /タスク管理/ })).not.toHaveAttribute('aria-current')
  })

  it('renders ドキュメント group label', () => {
    render(<Sidebar />)
    expect(screen.getByText('ドキュメント')).toBeInTheDocument()
  })
})
