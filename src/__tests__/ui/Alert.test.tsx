import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert } from '@/components/ui/Alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert type="info">Info message</Alert>)
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Alert type="info" title="Heads up">Content</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
  })

  it('info type uses role status', () => {
    render(<Alert type="info">Info</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('success type uses role status', () => {
    render(<Alert type="success">Success</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('warning type uses role alert', () => {
    render(<Alert type="warning">Warning</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('error type uses role alert', () => {
    render(<Alert type="error">Error</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('info has aria-live polite', () => {
    render(<Alert type="info">Info</Alert>)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('error has aria-live assertive', () => {
    render(<Alert type="error">Error</Alert>)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  it('renders dismiss button when dismissible', () => {
    render(<Alert type="info" dismissible>Info</Alert>)
    expect(screen.getByRole('button', { name: /dismiss alert/i })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = jest.fn()
    render(<Alert type="error" dismissible onDismiss={onDismiss}>Error</Alert>)
    await user.click(screen.getByRole('button', { name: /dismiss alert/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not render dismiss button when not dismissible', () => {
    render(<Alert type="info">Info</Alert>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies info container classes', () => {
    render(<Alert type="info">Info</Alert>)
    const el = screen.getByRole('status')
    expect(el.className).toContain('bg-primary/10')
  })

  it('applies error container classes', () => {
    render(<Alert type="error">Error</Alert>)
    const el = screen.getByRole('alert')
    expect(el.className).toContain('bg-destructive/10')
  })
})
