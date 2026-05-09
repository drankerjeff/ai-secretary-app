import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '@/components/ui/Select'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

describe('Select', () => {
  it('renders trigger button with placeholder text', () => {
    render(<Select options={options} onChange={jest.fn()} placeholder="Choose one" />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Choose one')
  })

  it('shows selected option label', () => {
    render(<Select options={options} value="b" onChange={jest.fn()} />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Beta')
  })

  it('opens listbox on trigger click', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('lists all options when open', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} />)
    await user.click(screen.getByRole('combobox'))
    options.forEach(({ label }) => {
      expect(screen.getByRole('option', { name: label })).toBeInTheDocument()
    })
  })

  it('calls onChange with option value when option clicked', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Select options={options} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Beta' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Alpha' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Select options={options} onChange={jest.fn()} label="City" />)
    expect(screen.getByText('City')).toBeInTheDocument()
  })

  it('shows error message and aria-invalid when error is set', () => {
    render(<Select options={options} onChange={jest.fn()} error="Required" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Select options={options} onChange={jest.fn()} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('does not open when disabled and clicked', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} disabled />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows selected option with aria-selected true', async () => {
    const user = userEvent.setup()
    render(<Select options={options} value="c" onChange={jest.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('option', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true')
  })

  it('renders search input when searchable is true', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} searchable />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('textbox', { name: /search options/i })).toBeInTheDocument()
  })

  it('filters options when searching', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} searchable />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('textbox', { name: /search options/i }), 'alp')
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Beta' })).not.toBeInTheDocument()
  })

  it('shows "No options found" when search yields no results', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} searchable />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('textbox', { name: /search options/i }), 'zzz')
    expect(screen.getByText('No options found')).toBeInTheDocument()
  })

  it('trigger has aria-expanded false when closed', () => {
    render(<Select options={options} onChange={jest.fn()} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('trigger has aria-expanded true when open', async () => {
    const user = userEvent.setup()
    render(<Select options={options} onChange={jest.fn()} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })
})
