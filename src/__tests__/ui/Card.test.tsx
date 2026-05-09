import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello card</Card>)
    expect(screen.getByText('Hello card')).toBeInTheDocument()
  })

  it('has no role by default (not clickable)', () => {
    render(<Card>Content</Card>)
    const el = screen.getByText('Content').closest('div')
    expect(el).not.toHaveAttribute('role', 'button')
  })

  it('has role button when clickable is true', () => {
    render(<Card clickable>Clickable card</Card>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('is keyboard focusable when clickable', () => {
    render(<Card clickable>Focusable</Card>)
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '0')
  })

  it('applies hover and scale classes when clickable', () => {
    render(<Card clickable>Hover</Card>)
    expect(screen.getByRole('button').className).toContain('cursor-pointer')
    expect(screen.getByRole('button').className).toContain('hover:scale-[1.015]')
  })

  it('applies apple-card class', () => {
    render(<Card>Base</Card>)
    // The outermost div should have apple-card
    const el = screen.getByText('Base').closest('div')
    expect(el?.className).toContain('apple-card')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header text</CardHeader>)
    expect(screen.getByText('Header text')).toBeInTheDocument()
  })

  it('adds border class when withBorder is true', () => {
    render(<CardHeader withBorder>Header</CardHeader>)
    const el = screen.getByText('Header').closest('div')
    expect(el?.className).toContain('border-b')
  })

  it('does not add border class when withBorder is false', () => {
    render(<CardHeader>No border</CardHeader>)
    const el = screen.getByText('No border').closest('div')
    expect(el?.className).not.toContain('border-b')
  })
})

describe('CardBody', () => {
  it('renders children', () => {
    render(<CardBody>Body content</CardBody>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('applies padding classes', () => {
    render(<CardBody>Content</CardBody>)
    const el = screen.getByText('Content').closest('div')
    expect(el?.className).toContain('px-5')
    expect(el?.className).toContain('py-4')
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer text</CardFooter>)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  it('adds border-t class when withBorder is true', () => {
    render(<CardFooter withBorder>Footer</CardFooter>)
    const el = screen.getByText('Footer').closest('div')
    expect(el?.className).toContain('border-t')
  })
})
