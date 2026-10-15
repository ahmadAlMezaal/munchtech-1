import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MonthlyReport } from './MonthlyReport'
import type { LogEntry, Snack } from '../lib/types'

const snacks: Snack[] = [
  { id: 'kitkat', name: 'KitKat', brand: 'Nestlé', emoji: '🍫', category: 'chocolate', wrapper: '#D6202B', stock: 10 },
]
const now = new Date(2026, 0, 15)
const log: LogEntry[] = [
  { snackId: 'kitkat', person: 'Mo', at: new Date(2026, 0, 5).toISOString() },
  { snackId: 'kitkat', person: 'Mo', at: new Date(2025, 11, 5).toISOString() },
  { snackId: 'kitkat', person: 'Wanda', at: new Date(2025, 11, 6).toISOString() },
]

describe('MonthlyReport', () => {
  it('shows the current month, total and snack counts', () => {
    render(<MonthlyReport log={log} snacks={snacks} now={now} />)
    expect(screen.getByText('January 2026')).toBeInTheDocument()
    expect(screen.getByText('1 snack consumed')).toBeInTheDocument()
    const ranking = screen.getByRole('list')
    expect(within(ranking).getByText('KitKat')).toBeInTheDocument()
    expect(within(ranking).getByText('1')).toBeInTheDocument()
  })

  it('navigates across years to past months and back, showing an empty month', async () => {
    const user = userEvent.setup()
    render(<MonthlyReport log={log} snacks={snacks} now={now} />)
    await user.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(screen.getByText('December 2025')).toBeInTheDocument()
    expect(screen.getByText('2 snacks consumed')).toBeInTheDocument()
    expect(within(screen.getByRole('list')).getByText('2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(screen.getByText('November 2025')).toBeInTheDocument()
    expect(screen.getByText('0 snacks consumed')).toBeInTheDocument()
    expect(screen.getByText('Nothing eaten yet')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByText('December 2025')).toBeInTheDocument()
    expect(screen.getByText('2 snacks consumed')).toBeInTheDocument()
  })
})
