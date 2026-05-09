import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '@/components/ui/Tabs'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'settings', label: 'Settings' },
]

describe('Tabs', () => {
  it('renders a tablist', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  it('renders all tab buttons', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('renders tab labels', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tasks' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument()
  })

  it('active tab has aria-selected true', () => {
    render(<Tabs tabs={tabs} activeTab="tasks" onChange={jest.fn()} />)
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveAttribute('aria-selected', 'true')
  })

  it('inactive tabs have aria-selected false', () => {
    render(<Tabs tabs={tabs} activeTab="tasks" onChange={jest.fn()} />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false')
  })

  it('active tab has tabIndex 0', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabIndex', '0')
  })

  it('inactive tabs have tabIndex -1', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveAttribute('tabIndex', '-1')
  })

  it('calls onChange when a tab is clicked', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Tabs tabs={tabs} activeTab="overview" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Tasks' }))
    expect(onChange).toHaveBeenCalledWith('tasks')
  })

  it('active tab has elevated background class', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    const activeTab = screen.getByRole('tab', { name: 'Overview' })
    expect(activeTab.className).toContain('bg-background-elevated')
  })

  it('active tab aria-controls points to tabpanel id', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-controls',
      'tabpanel-overview'
    )
  })

  it('applies w-full when fullWidth is true', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} fullWidth />)
    expect(screen.getByRole('tablist').className).toContain('w-full')
  })

  it('applies w-fit when fullWidth is false', () => {
    render(<Tabs tabs={tabs} activeTab="overview" onChange={jest.fn()} />)
    expect(screen.getByRole('tablist').className).toContain('w-fit')
  })

  it('navigates to next tab with ArrowRight', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Tabs tabs={tabs} activeTab="overview" onChange={onChange} />)
    screen.getByRole('tab', { name: 'Overview' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('tasks')
  })

  it('navigates to prev tab with ArrowLeft', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Tabs tabs={tabs} activeTab="tasks" onChange={onChange} />)
    screen.getByRole('tab', { name: 'Tasks' }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith('overview')
  })

  it('wraps from last to first tab with ArrowRight', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Tabs tabs={tabs} activeTab="settings" onChange={onChange} />)
    screen.getByRole('tab', { name: 'Settings' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('overview')
  })

  it('renders icon when tab has icon', () => {
    const tabsWithIcon = [{ id: 'a', label: 'A', icon: <span data-testid="tab-icon" /> }]
    render(<Tabs tabs={tabsWithIcon} activeTab="a" onChange={jest.fn()} />)
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument()
  })
})
