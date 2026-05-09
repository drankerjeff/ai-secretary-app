import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
    role,
    onClick,
    className,
  }: {
    href: string
    children: React.ReactNode
    role?: string
    onClick?: () => void
    className?: string
  }) {
    return (
      <a href={href} role={role} onClick={onClick} className={className}>
        {children}
      </a>
    )
  }
})

import { UserMenu } from '@/components/layout/UserMenu'

describe('UserMenu', () => {
  it('renders the avatar button', () => {
    render(<UserMenu />)
    expect(screen.getByRole('button', { name: /ユーザーメニューを開く/i })).toBeInTheDocument()
  })

  it('menu is not visible initially', () => {
    render(<UserMenu />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens menu when avatar button clicked', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('avatar button has aria-expanded false initially', () => {
    render(<UserMenu />)
    expect(screen.getByRole('button', { name: /ユーザーメニューを開く/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('avatar button has aria-expanded true when open', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByRole('button', { name: /ユーザーメニューを開く/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('shows user display name in menu', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByText('Tamura Hisayoshi')).toBeInTheDocument()
  })

  it('shows email in menu', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByText('1344tamura@gmail.com')).toBeInTheDocument()
  })

  it('renders settings menu item link', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    const settingsLink = screen.getByRole('menuitem', { name: /設定/ })
    expect(settingsLink).toBeInTheDocument()
    expect(settingsLink).toHaveAttribute('href', '/dashboard/settings')
  })

  it('renders logout menu item button', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByRole('menuitem', { name: /ログアウト/ })).toBeInTheDocument()
  })

  it('closes menu when Escape key pressed', async () => {
    const user = userEvent.setup()
    render(<UserMenu />)
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <UserMenu />
        <div data-testid="outside">Outside</div>
      </div>
    )
    await user.click(screen.getByRole('button', { name: /ユーザーメニューを開く/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
