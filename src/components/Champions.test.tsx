import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Champions } from './Champions'
import type { LogEntry, Snack } from '../lib/types'

const now = new Date('2026-10-15T12:00:00Z')

const snacks: Snack[] = [
  {
    id: 'kitkat',
    name: 'KitKat',
    brand: 'Nestlé',
    emoji: '🍫',
    category: 'chocolate',
    wrapper: '#D6202B',
    stock: 10,
  },
  {
    id: 'twirl',
    name: 'Twirl',
    brand: 'Cadbury',
    emoji: '🌀',
    category: 'chocolate',
    wrapper: '#5B2A86',
    stock: 8,
  },
  {
    id: 'haribo',
    name: 'Starmix',
    brand: 'Haribo',
    emoji: '🐻',
    category: 'sweets',
    wrapper: '#FFCC00',
    stock: 12,
  },
]

describe('Champions', () => {
  it('renders "The crown is up for grabs 👑" when nobody has eaten anything', () => {
    render(<Champions log={[]} snacks={snacks} now={now} />)

    expect(screen.getByText('Snack Champions')).toBeInTheDocument()
    expect(screen.getByText('The crown is up for grabs 👑')).toBeInTheDocument()
  })

  it('renders the top 3 people with medals, counts, and favourite snack emojis', () => {
    const log: LogEntry[] = [
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T11:00:00Z' },
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T12:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T10:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T11:00:00Z' },
      { snackId: 'haribo', person: 'Charlie', at: '2026-10-14T10:00:00Z' },
    ]

    render(<Champions log={log} snacks={snacks} now={now} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)

    // Position 1: Alice with gold medal and 3 snacks
    expect(within(items[0]).getByText('🥇')).toBeInTheDocument()
    expect(within(items[0]).getByText('Alice')).toBeInTheDocument()
    expect(within(items[0]).getByText('3 snacks')).toBeInTheDocument()
    expect(within(items[0]).getByText('🍫')).toBeInTheDocument()

    // Position 2: Bob with silver medal and 2 snacks
    expect(within(items[1]).getByText('🥈')).toBeInTheDocument()
    expect(within(items[1]).getByText('Bob')).toBeInTheDocument()
    expect(within(items[1]).getByText('2 snacks')).toBeInTheDocument()
    expect(within(items[1]).getByText('🌀')).toBeInTheDocument()

    // Position 3: Charlie with bronze medal and 1 snack
    expect(within(items[2]).getByText('🥉')).toBeInTheDocument()
    expect(within(items[2]).getByText('Charlie')).toBeInTheDocument()
    expect(within(items[2]).getByText('1 snack')).toBeInTheDocument()
    expect(within(items[2]).getByText('🐻')).toBeInTheDocument()
  })

  it('renders only the people who have eaten when fewer than 3 have', () => {
    const log: LogEntry[] = [
      { snackId: 'kitkat', person: 'SoloSnacker', at: '2026-10-14T10:00:00Z' },
    ]

    render(<Champions log={log} snacks={snacks} now={now} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(within(items[0]).getByText('🥇')).toBeInTheDocument()
    expect(within(items[0]).getByText('SoloSnacker')).toBeInTheDocument()
    expect(within(items[0]).getByText(/1 snack/)).toBeInTheDocument()
    expect(within(items[0]).getByText('🍫')).toBeInTheDocument()
  })

  it('ignores snacks consumed more than 7 days ago', () => {
    const log: LogEntry[] = [
      { snackId: 'kitkat', person: 'OldSnacker', at: '2026-10-01T10:00:00Z' },
    ]

    render(<Champions log={log} snacks={snacks} now={now} />)

    expect(screen.getByText('The crown is up for grabs 👑')).toBeInTheDocument()
    expect(screen.queryByText('OldSnacker')).not.toBeInTheDocument()
  })
})
