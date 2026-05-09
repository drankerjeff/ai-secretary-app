import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Textarea label="Meeting Notes" />)
    expect(screen.getByLabelText('Meeting Notes')).toBeInTheDocument()
  })

  it('shows hint when provided', () => {
    render(<Textarea hint="Markdown is supported" />)
    expect(screen.getByText('Markdown is supported')).toBeInTheDocument()
  })

  it('shows error and sets aria-invalid', () => {
    render(<Textarea error="This field is required" />)
    const ta = screen.getByRole('textbox')
    expect(ta).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required')
  })

  it('hides hint when error is present', () => {
    render(<Textarea hint="A hint" error="An error" />)
    expect(screen.queryByText('A hint')).not.toBeInTheDocument()
  })

  it('applies error border class when error is set', () => {
    render(<Textarea error="oops" />)
    expect(screen.getByRole('textbox').className).toContain('border-destructive')
  })

  it('shows character counter when maxLength is set', () => {
    render(<Textarea maxLength={200} />)
    expect(screen.getByText('0/200')).toBeInTheDocument()
  })

  it('updates character counter as user types', async () => {
    const user = userEvent.setup()
    render(<Textarea maxLength={200} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByText('5/200')).toBeInTheDocument()
  })

  it('counter turns destructive when at limit', async () => {
    const user = userEvent.setup()
    render(<Textarea maxLength={5} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    const counter = screen.getByText('5/5')
    expect(counter.className).toContain('text-destructive')
  })

  it('calls onChange with string value', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Textarea onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), 'abc')
    expect(onChange).toHaveBeenLastCalledWith('abc')
  })

  it('counter aria-live attribute is polite', () => {
    render(<Textarea maxLength={100} />)
    const counter = screen.getByText('0/100')
    expect(counter).toHaveAttribute('aria-live', 'polite')
  })
})
