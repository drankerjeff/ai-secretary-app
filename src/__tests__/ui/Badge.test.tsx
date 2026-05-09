import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    render(<Badge>Default</Badge>)
    const el = screen.getByText('Default').closest('span')
    expect(el?.className).toContain('bg-fill')
  })

  it('applies primary variant class', () => {
    render(<Badge variant="primary">Primary</Badge>)
    const el = screen.getByText('Primary').closest('span')
    expect(el?.className).toContain('text-primary')
  })

  it('applies success variant class', () => {
    render(<Badge variant="success">Done</Badge>)
    const el = screen.getByText('Done').closest('span')
    expect(el?.className).toContain('text-success')
  })

  it('applies warning variant class', () => {
    render(<Badge variant="warning">Warn</Badge>)
    const el = screen.getByText('Warn').closest('span')
    expect(el?.className).toContain('text-warning')
  })

  it('applies destructive variant class', () => {
    render(<Badge variant="destructive">Error</Badge>)
    const el = screen.getByText('Error').closest('span')
    expect(el?.className).toContain('text-destructive')
  })

  it('applies outline variant class', () => {
    render(<Badge variant="outline">Outline</Badge>)
    const el = screen.getByText('Outline').closest('span')
    expect(el?.className).toContain('border')
  })

  it('applies sm size class', () => {
    render(<Badge size="sm">Small</Badge>)
    const el = screen.getByText('Small').closest('span')
    expect(el?.className).toContain('px-2')
  })

  it('applies md size class by default', () => {
    render(<Badge>Medium</Badge>)
    const el = screen.getByText('Medium').closest('span')
    expect(el?.className).toContain('px-2.5')
  })

  it('renders dismiss button when dismissible is true', () => {
    render(<Badge dismissible>Tag</Badge>)
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = jest.fn()
    render(<Badge dismissible onDismiss={onDismiss}>Tag</Badge>)
    await user.click(screen.getByRole('button', { name: /remove/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not render dismiss button when dismissible is false', () => {
    render(<Badge>No dismiss</Badge>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('has rounded-full class', () => {
    render(<Badge>Pill</Badge>)
    const el = screen.getByText('Pill').closest('span')
    expect(el?.className).toContain('rounded-full')
  })
})
