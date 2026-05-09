import React from 'react'
import { render, screen } from '@testing-library/react'

// page.tsx (the demo/login page) uses several UI components which are 'use client'
// We just need to confirm it renders without crashing and key elements are present.

// Mock next modules used transitively
jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
})

import DemoPage from '@/app/page'

describe('Root page (DemoPage / UI showcase)', () => {
  it('renders without crashing', () => {
    render(<DemoPage />)
  })

  it('renders the page heading "AI Secretary"', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /AI Secretary/i, level: 1 })).toBeInTheDocument()
  })

  it('renders the Button section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /1\. Button/i })).toBeInTheDocument()
  })

  it('renders primary variant button', () => {
    render(<DemoPage />)
    expect(screen.getByRole('button', { name: /^primary$/i })).toBeInTheDocument()
  })

  it('renders the Input section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /2\. Input/i })).toBeInTheDocument()
  })

  it('renders Full Name label', () => {
    render(<DemoPage />)
    expect(screen.getByText('Full Name')).toBeInTheDocument()
  })

  it('renders the Card section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /3\. Card/i })).toBeInTheDocument()
  })

  it('renders the Modal section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /4\. Modal/i })).toBeInTheDocument()
  })

  it('renders "Open Modal" button', () => {
    render(<DemoPage />)
    expect(screen.getByRole('button', { name: /open modal/i })).toBeInTheDocument()
  })

  it('renders the Alert section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /5\. Alert/i })).toBeInTheDocument()
  })

  it('renders the Select section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /6\. Select/i })).toBeInTheDocument()
  })

  it('renders the Textarea section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /7\. Textarea/i })).toBeInTheDocument()
  })

  it('renders the Badge section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /8\. Badge/i })).toBeInTheDocument()
  })

  it('renders the Spinner section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /9\. Spinner/i })).toBeInTheDocument()
  })

  it('renders the Tabs section heading', () => {
    render(<DemoPage />)
    expect(screen.getByRole('heading', { name: /10\. Tabs/i })).toBeInTheDocument()
  })

  it('renders the tablist', () => {
    render(<DemoPage />)
    expect(screen.getAllByRole('tablist').length).toBeGreaterThan(0)
  })

  it('renders multiple spinner elements', () => {
    render(<DemoPage />)
    const spinners = screen.getAllByRole('status', { name: /loading/i })
    expect(spinners.length).toBeGreaterThan(0)
  })
})
