import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

import { MobileMenu } from '@/components/layout/MobileMenu'

describe('MobileMenu', () => {
  it('renders nothing when open is false', () => {
    render(<MobileMenu open={false} onClose={jest.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog panel when open is true', () => {
    render(<MobileMenu open onClose={jest.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('dialog has aria-modal true', () => {
    render(<MobileMenu open onClose={jest.fn()} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('dialog has accessible label', () => {
    render(<MobileMenu open onClose={jest.fn()} />)
    expect(screen.getByRole('dialog', { name: /ナビゲーションメニュー/ })).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<MobileMenu open onClose={jest.fn()} />)
    expect(screen.getByRole('button', { name: /メニューを閉じる/i })).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<MobileMenu open onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /メニューを閉じる/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    const { container } = render(<MobileMenu open onClose={onClose} />)
    const overlay = container.querySelector('[aria-hidden="true"]')
    expect(overlay).toBeInTheDocument()
    await user.click(overlay!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key pressed', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<MobileMenu open onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll when open', () => {
    render(<MobileMenu open onClose={jest.fn()} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', () => {
    const { rerender } = render(<MobileMenu open onClose={jest.fn()} />)
    rerender(<MobileMenu open={false} onClose={jest.fn()} />)
    expect(document.body.style.overflow).toBe('')
  })

  it('renders sidebar navigation inside the panel', () => {
    render(<MobileMenu open onClose={jest.fn()} />)
    expect(screen.getByRole('navigation', { name: 'メインナビゲーション' })).toBeInTheDocument()
  })
})
