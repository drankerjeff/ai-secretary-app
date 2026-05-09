import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavigationItem } from '@/components/layout/NavigationItem'

// next/link needs to be mocked for jsdom
jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
    onClick,
    className,
    'aria-current': ariaCurrent,
  }: {
    href: string
    children: React.ReactNode
    onClick?: () => void
    className?: string
    'aria-current'?: string
  }) {
    return (
      <a href={href} onClick={onClick} className={className} aria-current={ariaCurrent}>
        {children}
      </a>
    )
  }
})

const baseProps = {
  href: '/dashboard/tasks',
  label: 'タスク管理',
  icon: <svg data-testid="nav-icon" />,
  isActive: false,
}

describe('NavigationItem', () => {
  it('renders a link with correct href', () => {
    render(<NavigationItem {...baseProps} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard/tasks')
  })

  it('renders label text', () => {
    render(<NavigationItem {...baseProps} />)
    expect(screen.getByText('タスク管理')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<NavigationItem {...baseProps} />)
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument()
  })

  it('sets aria-current="page" when isActive is true', () => {
    render(<NavigationItem {...baseProps} isActive />)
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  })

  it('does not set aria-current when isActive is false', () => {
    render(<NavigationItem {...baseProps} isActive={false} />)
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current')
  })

  it('applies active background class when isActive', () => {
    render(<NavigationItem {...baseProps} isActive />)
    expect(screen.getByRole('link').className).toContain('bg-fill')
  })

  it('does not apply active background class when inactive', () => {
    render(<NavigationItem {...baseProps} isActive={false} />)
    const link = screen.getByRole('link')
    // Active state adds 'bg-fill text-foreground'; inactive uses 'hover:bg-fill-quaternary'
    // Check that the standalone 'bg-fill' class (not 'bg-fill-*') is absent.
    const classes = link.className.split(' ')
    expect(classes).not.toContain('bg-fill')
  })

  it('renders badge when badge prop is provided', () => {
    render(<NavigationItem {...baseProps} badge={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not render badge when badge is undefined', () => {
    render(<NavigationItem {...baseProps} />)
    // no span with badge styling
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<NavigationItem {...baseProps} onClick={onClick} />)
    await user.click(screen.getByRole('link'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
