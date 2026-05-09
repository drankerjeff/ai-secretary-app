import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    render(<Modal open={false} onClose={jest.fn()} title="Test" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open is true', () => {
    render(<Modal open onClose={jest.fn()} title="My Modal" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Modal open onClose={jest.fn()} title="Schedule Meeting" />)
    expect(screen.getByText('Schedule Meeting')).toBeInTheDocument()
  })

  it('has aria-modal true', () => {
    render(<Modal open onClose={jest.fn()} title="Test" />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby pointing at title id when title is provided', () => {
    render(<Modal open onClose={jest.fn()} title="My Title" />)
    const dialog = screen.getByRole('dialog')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(screen.getByText('My Title').id).toBe(labelledBy)
  })

  it('renders close button', () => {
    render(<Modal open onClose={jest.fn()} title="Test" />)
    expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<Modal open onClose={onClose} title="Test" />)
    await user.click(screen.getByRole('button', { name: /close modal/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    const { container } = render(<Modal open onClose={onClose} title="Test" />)
    // overlay is the div with aria-hidden="true" and absolute inset-0
    const overlay = container.querySelector('[aria-hidden="true"].absolute')
    expect(overlay).toBeInTheDocument()
    await user.click(overlay!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<Modal open onClose={onClose} title="Test" />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders children inside dialog body', () => {
    render(
      <Modal open onClose={jest.fn()} title="Test">
        <p>Modal body content</p>
      </Modal>
    )
    expect(screen.getByText('Modal body content')).toBeInTheDocument()
  })

  it('applies sm size max-width class', () => {
    render(<Modal open onClose={jest.fn()} size="sm" title="Small" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('max-w-[400px]')
  })

  it('applies md size max-width class by default', () => {
    render(<Modal open onClose={jest.fn()} title="Medium" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('max-w-[560px]')
  })

  it('applies lg size max-width class', () => {
    render(<Modal open onClose={jest.fn()} size="lg" title="Large" />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('max-w-[720px]')
  })
})
