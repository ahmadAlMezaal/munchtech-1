import { describe, expect, it } from 'vitest'
import { STATE_KEY, consume, createInitialState, loadState, saveState, slotCode, snackOfTheWeek } from './store'
import type { AppState } from './types'

const now = new Date('2026-10-15T12:00:00Z')

function stateWith(stock: number): AppState {
  return {
    snacks: [
      { id: 'kitkat', name: 'KitKat', brand: 'Nestlé', emoji: '🍫', category: 'chocolate', wrapper: '#D6202B', stock },
    ],
    log: [],
  }
}

describe('consume', () => {
  it('takes one from stock and records who had it', () => {
    const next = consume(stateWith(3), 'kitkat', 'Ollie', now)

    expect(next.snacks[0].stock).toBe(2)
    expect(next.log).toEqual([{ snackId: 'kitkat', person: 'Ollie', at: now.toISOString() }])
  })

  it('leaves the original state untouched', () => {
    const before = stateWith(3)
    consume(before, 'kitkat', 'Ollie', now)

    expect(before.snacks[0].stock).toBe(3)
    expect(before.log).toHaveLength(0)
  })

  it('ignores unknown snacks', () => {
    const before = stateWith(3)

    expect(consume(before, 'mystery', 'Ollie', now)).toBe(before)
  })
})

describe('loadState', () => {
  it('starts from the seed when nothing is saved', () => {
    const state = loadState(localStorage, now)

    expect(state.snacks).toHaveLength(20)
    expect(state.log.length).toBeGreaterThan(0)
  })

  it('reads back what was saved', () => {
    saveState(localStorage, stateWith(7))

    expect(loadState(localStorage, now).snacks[0].stock).toBe(7)
  })

  it('falls back to the seed when the saved data is corrupt', () => {
    localStorage.setItem(STATE_KEY, '{not json')

    expect(loadState(localStorage, now).snacks).toHaveLength(20)
  })

  it('works without storage', () => {
    expect(loadState(null, now).snacks).toHaveLength(20)
  })
})

describe('createInitialState', () => {
  it('seeds a log with no entries in the future', () => {
    const { log } = createInitialState(now)

    expect(log.every((entry) => new Date(entry.at) <= now)).toBe(true)
  })
})

describe('slotCode', () => {
  it('labels slots like a vending machine', () => {
    expect([0, 4, 5, 19].map(slotCode)).toEqual(['A1', 'A5', 'B1', 'D5'])
  })
})

describe('snackOfTheWeek', () => {
  const twoSnacks: AppState = {
    snacks: [
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
        stock: 7,
      },
    ],
    log: [],
  }

  it('selects the most consumed snack from the last seven days', () => {
    const state = {
      ...twoSnacks,
      log: [
        { snackId: 'kitkat', person: 'A', at: '2026-10-14T10:00:00Z' },
        { snackId: 'twirl', person: 'B', at: '2026-10-12T10:00:00Z' },
        { snackId: 'kitkat', person: 'C', at: '2026-10-11T10:00:00Z' },
        { snackId: 'twirl', person: 'D', at: '2026-10-01T10:00:00Z' },
      ],
    }

    expect(snackOfTheWeek(state, now)).toEqual({ snack: twoSnacks.snacks[0], count: 2 })
  })

  it('breaks a tie in favour of the most recently consumed snack', () => {
    const state = {
      ...twoSnacks,
      log: [
        { snackId: 'kitkat', person: 'A', at: '2026-10-14T10:00:00Z' },
        { snackId: 'twirl', person: 'B', at: '2026-10-15T11:00:00Z' },
      ],
    }

    expect(snackOfTheWeek(state, now)?.snack.id).toBe('twirl')
  })

  it('returns null when no snack was eaten in the last seven days', () => {
    const state = {
      ...twoSnacks,
      log: [{ snackId: 'kitkat', person: 'A', at: '2026-10-07T11:59:59Z' }],
    }

    expect(snackOfTheWeek(state, now)).toBeNull()
    expect(snackOfTheWeek(twoSnacks, now)).toBeNull()
  })
})
