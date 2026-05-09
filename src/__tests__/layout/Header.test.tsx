import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) {
    return <a href={href} className={className}>{children}</a>
  }
})

import { Header } from '@/components/layout/Header'

describe('Header', () => {
  it('renders a header element', () => {
    render(<Header onMenuClick={jest.fn()} />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the hamburger menu button', () => {
    render(<Header onMenuClick={jest.fn()} />)
    // exact label to distinguish from "ユーザーメニューを開く"
    expect(screen.getByRole('button', { name: 'メニューを開く' })).toBeInTheDocument()
  })

  it('calls onMenuClick when hamburger is clicked', async () => {
    const user = userEvent.setup()
    const onMenuClick = jest.fn()
    render(<Header onMenuClick={onMenuClick} />)
    await user.click(screen.getByRole('button', { name: 'メニューを開く' }))
    expect(onMenuClick).toHaveBeenCalledTimes(1)
  })

  it('renders title as h1 when title prop provided', () => {
    render(<Header onMenuClick={jest.fn()} title="タスク管理" />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('タスク管理')
  })

  it('does not render h1 when title is not provided', () => {
    render(<Header onMenuClick={jest.fn()} />)
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('renders notification bell button', () => {
    render(<Header onMenuClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /通知/i })).toBeInTheDocument()
  })

  it('renders user menu trigger button', () => {
    render(<Header onMenuClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /ユーザーメニューを開く/i })).toBeInTheDocument()
  })
})
