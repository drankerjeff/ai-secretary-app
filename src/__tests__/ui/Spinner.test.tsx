import React from 'react'
import { render, screen } from '@testing-library/react'
import { Spinner } from '@/components/ui/Spinner'

describe('Spinner', () => {
  it('renders with role status and accessible label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })

  it('renders sr-only text "Loading..."', () => {
    render(<Spinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    render(<Spinner size="sm" />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('h-4')
    expect(inner?.className).toContain('w-4')
  })

  it('applies md size class by default', () => {
    render(<Spinner />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('h-6')
    expect(inner?.className).toContain('w-6')
  })

  it('applies lg size class', () => {
    render(<Spinner size="lg" />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('h-8')
    expect(inner?.className).toContain('w-8')
  })

  it('applies primary color class by default', () => {
    render(<Spinner />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('border-primary')
  })

  it('applies foreground color class', () => {
    render(<Spinner color="foreground" />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('border-t-foreground')
  })

  it('applies muted color class', () => {
    render(<Spinner color="muted" />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('border-t-muted-foreground')
  })

  it('applies animate-spin class', () => {
    render(<Spinner />)
    const inner = screen.getByRole('status').querySelector('span:not(.sr-only)')
    expect(inner?.className).toContain('animate-spin')
  })
})
