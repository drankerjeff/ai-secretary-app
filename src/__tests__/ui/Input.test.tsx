import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Full Name" />)
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByText('Full Name')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<Input label="Email" id="email-field" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id', 'email-field')
  })

  it('shows hint text when provided', () => {
    render(<Input hint="Enter your legal name" />)
    expect(screen.getByText('Enter your legal name')).toBeInTheDocument()
  })

  it('shows error message and sets aria-invalid when error is provided', () => {
    render(<Input error="This field is required" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const errorMsg = screen.getByRole('alert')
    expect(errorMsg).toHaveTextContent('This field is required')
  })

  it('hides hint when error is present', () => {
    render(<Input hint="Some hint" error="An error" />)
    expect(screen.queryByText('Some hint')).not.toBeInTheDocument()
    expect(screen.getByText('An error')).toBeInTheDocument()
  })

  it('applies error border class when error prop set', () => {
    render(<Input error="bad" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-destructive')
  })

  it('renders password type with toggle button', () => {
    render(<Input type="password" label="Password" />)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<Input type="password" label="Password" />)
    const input = screen.getByLabelText('Password')
    const toggle = screen.getByRole('button', { name: /show password/i })
    expect(input).toHaveAttribute('type', 'password')
    await user.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()
  })

  it('applies leftIcon padding class when leftIcon is provided', () => {
    render(<Input leftIcon={<span />} />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('pl-10')
  })

  it('calls onChange handler', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Input onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(onChange).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('applies sm size class', () => {
    render(<Input inputSize="sm" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('py-1.5')
  })

  it('applies lg size class', () => {
    render(<Input inputSize="lg" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('py-3')
  })
})
