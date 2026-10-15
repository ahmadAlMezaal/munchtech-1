import { describe, expect, it } from 'vitest'
import { champions } from './champions'
import type { LogEntry, Snack } from './types'

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
  {
    id: 'monster-munch',
    name: 'Monster Munch',
    brand: 'Walkers',
    emoji: '👾',
    category: 'crisps',
    wrapper: '#E60000',
    stock: 6,
  },
]

describe('champions', () => {
  it('returns an empty array when the log is empty', () => {
    expect(champions([], snacks, now)).toEqual([])
  })

  it('ranks people by number of snacks consumed in the last 7 days', () => {
    const log: LogEntry[] = [
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-13T10:00:00Z' },
      { snackId: 'twirl', person: 'Alice', at: '2026-10-12T10:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T11:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-13T11:00:00Z' },
      { snackId: 'monster-munch', person: 'Charlie', at: '2026-10-14T12:00:00Z' },
    ]

    const result = champions(log, snacks, now)

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      person: 'Alice',
      count: 3,
      favouriteEmoji: '🍫',
      favouriteSnack: snacks[0],
    })
    expect(result[1]).toEqual({
      person: 'Bob',
      count: 2,
      favouriteEmoji: '🌀',
      favouriteSnack: snacks[1],
    })
    expect(result[2]).toEqual({
      person: 'Charlie',
      count: 1,
      favouriteEmoji: '👾',
      favouriteSnack: snacks[3],
    })
  })

  it('only returns the top 3 when more than 3 people have consumed snacks', () => {
    const log: LogEntry[] = [
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:30:00Z' },
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T11:00:00Z' },
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T11:30:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T10:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T11:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T12:00:00Z' },
      { snackId: 'haribo', person: 'Charlie', at: '2026-10-14T10:00:00Z' },
      { snackId: 'haribo', person: 'Charlie', at: '2026-10-14T11:00:00Z' },
      { snackId: 'monster-munch', person: 'Dave', at: '2026-10-14T10:00:00Z' },
    ]

    const result = champions(log, snacks, now)

    expect(result).toHaveLength(3)
    expect(result.map((c) => c.person)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('returns fewer than 3 champions when fewer than 3 people have eaten anything', () => {
    const singleLog: LogEntry[] = [
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
    ]
    expect(champions(singleLog, snacks, now)).toHaveLength(1)

    const twoLog: LogEntry[] = [
      { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      { snackId: 'twirl', person: 'Bob', at: '2026-10-14T11:00:00Z' },
    ]
    expect(champions(twoLog, snacks, now)).toHaveLength(2)
  })

  describe('ties', () => {
    it('orders ties alphabetically by person name', () => {
      const log: LogEntry[] = [
        { snackId: 'kitkat', person: 'Zara', at: '2026-10-14T10:00:00Z' },
        { snackId: 'kitkat', person: 'Zara', at: '2026-10-14T11:00:00Z' },
        { snackId: 'twirl', person: 'Alice', at: '2026-10-14T10:00:00Z' },
        { snackId: 'twirl', person: 'Alice', at: '2026-10-14T11:00:00Z' },
        { snackId: 'haribo', person: 'Mo', at: '2026-10-14T10:00:00Z' },
        { snackId: 'haribo', person: 'Mo', at: '2026-10-14T11:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result.map((c) => c.person)).toEqual(['Alice', 'Mo', 'Zara'])
    })

    it('breaks ties at the 3rd-place boundary alphabetically', () => {
      const log: LogEntry[] = [
        { snackId: 'kitkat', person: 'TopScorer', at: '2026-10-14T10:00:00Z' },
        { snackId: 'kitkat', person: 'TopScorer', at: '2026-10-14T11:00:00Z' },
        { snackId: 'kitkat', person: 'TopScorer', at: '2026-10-14T12:00:00Z' },
        { snackId: 'twirl', person: 'SecondScorer', at: '2026-10-14T10:00:00Z' },
        { snackId: 'twirl', person: 'SecondScorer', at: '2026-10-14T11:00:00Z' },
        { snackId: 'haribo', person: 'Dave', at: '2026-10-14T10:00:00Z' },
        { snackId: 'monster-munch', person: 'Charlie', at: '2026-10-14T10:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result.map((c) => c.person)).toEqual(['TopScorer', 'SecondScorer', 'Charlie'])
    })
  })

  describe('7-day window', () => {
    it('ignores entries older than 7 days', () => {
      const log: LogEntry[] = [
        // 8 days ago - should be ignored
        { snackId: 'kitkat', person: 'OldTimer', at: '2026-10-07T11:59:59Z' },
        // 7 days ago plus 1 second - should be ignored
        { snackId: 'kitkat', person: 'OldTimer', at: '2026-10-08T11:59:59Z' },
        // Within 7 days
        { snackId: 'twirl', person: 'RecentEater', at: '2026-10-09T10:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result).toHaveLength(1)
      expect(result[0].person).toBe('RecentEater')
      expect(result[0].count).toBe(1)
    })

    it('includes entries exactly at the 7-day boundary', () => {
      const log: LogEntry[] = [
        // Exactly 7 days before 2026-10-15T12:00:00Z
        { snackId: 'kitkat', person: 'BoundaryPerson', at: '2026-10-08T12:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result).toHaveLength(1)
      expect(result[0].person).toBe('BoundaryPerson')
      expect(result[0].count).toBe(1)
    })

    it('ignores future entries', () => {
      const log: LogEntry[] = [
        { snackId: 'kitkat', person: 'TimeTraveler', at: '2026-10-15T12:00:01Z' },
        { snackId: 'twirl', person: 'RealPerson', at: '2026-10-15T11:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result).toHaveLength(1)
      expect(result[0].person).toBe('RealPerson')
    })

    it('returns an empty array if all entries are older than 7 days', () => {
      const log: LogEntry[] = [
        { snackId: 'kitkat', person: 'Alice', at: '2026-10-01T10:00:00Z' },
        { snackId: 'twirl', person: 'Bob', at: '2026-10-02T10:00:00Z' },
      ]

      expect(champions(log, snacks, now)).toEqual([])
    })
  })

  describe('favourite snack', () => {
    it('shows the snack a person had most this week as their favourite', () => {
      const log: LogEntry[] = [
        { snackId: 'haribo', person: 'Alice', at: '2026-10-12T10:00:00Z' },
        { snackId: 'kitkat', person: 'Alice', at: '2026-10-13T10:00:00Z' },
        { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result[0].favouriteEmoji).toBe('🍫')
      expect(result[0].favouriteSnack?.name).toBe('KitKat')
    })

    it('only considers snacks from within the last 7 days for the favourite snack', () => {
      const log: LogEntry[] = [
        // 10 Haribos 2 weeks ago
        ...Array.from({ length: 10 }, (_, i) => ({
          snackId: 'haribo',
          person: 'Alice',
          at: `2026-09-30T10:0${i}:00Z`,
        })),
        // 1 KitKat this week
        { snackId: 'kitkat', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result).toHaveLength(1)
      expect(result[0].count).toBe(1)
      expect(result[0].favouriteEmoji).toBe('🍫')
      expect(result[0].favouriteSnack?.name).toBe('KitKat')
    })

    it('breaks favourite snack ties in favour of the most recently consumed snack', () => {
      const log: LogEntry[] = [
        { snackId: 'kitkat', person: 'Alice', at: '2026-10-12T10:00:00Z' },
        { snackId: 'twirl', person: 'Alice', at: '2026-10-14T15:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result[0].favouriteEmoji).toBe('🌀')
      expect(result[0].favouriteSnack?.name).toBe('Twirl')
    })

    it('handles unknown snack IDs with a fallback emoji', () => {
      const log: LogEntry[] = [
        { snackId: 'mystery-snack', person: 'Alice', at: '2026-10-14T10:00:00Z' },
      ]

      const result = champions(log, snacks, now)

      expect(result[0].favouriteEmoji).toBe('❓')
      expect(result[0].favouriteSnack).toBeUndefined()
    })
  })
})
