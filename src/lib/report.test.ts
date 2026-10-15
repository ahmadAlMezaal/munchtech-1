import { describe, expect, it } from 'vitest'
import { monthlyReport } from './report'
import type { LogEntry, Snack } from './types'

const snacks: Snack[] = ['Apple', 'Biscuit', 'Crisps', 'Dates', 'Egg', 'Fig'].map((name) => ({
  id: name.toLowerCase(), name, brand: '', emoji: '', category: 'sweets', wrapper: '#fff', stock: 10,
}))

function entry(snackId: string, date = new Date(2026, 9, 15)): LogEntry {
  return { snackId, person: 'Mo', at: date.toISOString() }
}

describe('monthlyReport', () => {
  it('counts only the selected calendar month, including its start and excluding its end', () => {
    const log = [
      entry('apple', new Date(2026, 9, 1)),
      entry('apple', new Date(2026, 9, 31, 23, 59, 59)),
      entry('apple', new Date(2026, 8, 30, 23, 59, 59)),
      entry('apple', new Date(2026, 10, 1)),
      entry('apple', new Date(2025, 9, 15)),
    ]
    expect(monthlyReport(log, snacks, 2026, 9)).toEqual({
      total: 2, topSnacks: [{ snackId: 'apple', name: 'Apple', count: 2 }],
    })
  })

  it('orders by consumption and limits the ranking to five without limiting the total', () => {
    const log = snacks.flatMap((snack, index) => Array.from({ length: index + 1 }, () => entry(snack.id)))
    const before = structuredClone({ log, snacks })
    const report = monthlyReport(log, snacks, 2026, 9)
    expect(report.total).toBe(21)
    expect(report.topSnacks.map((snack) => [snack.name, snack.count])).toEqual([
      ['Fig', 6], ['Egg', 5], ['Dates', 4], ['Crisps', 3], ['Biscuit', 2],
    ])
    expect({ log, snacks }).toEqual(before)
  })

  it('breaks ties alphabetically, regardless of log or catalogue order', () => {
    const log = [...snacks].reverse().map((snack) => entry(snack.id))
    expect(monthlyReport(log, [...snacks].reverse(), 2026, 9).topSnacks.map((snack) => snack.name))
      .toEqual(['Apple', 'Biscuit', 'Crisps', 'Dates', 'Egg'])
  })

  it('returns an empty report for a month without activity', () => {
    expect(monthlyReport([entry('apple')], snacks, 2026, 8)).toEqual({ total: 0, topSnacks: [] })
    expect(monthlyReport([], snacks, 2026, 9)).toEqual({ total: 0, topSnacks: [] })
  })

  it('keeps consumption of snacks missing from the catalogue', () => {
    expect(monthlyReport([entry('missing')], snacks, 2026, 9)).toEqual({
      total: 1, topSnacks: [{ snackId: 'missing', name: 'Mystery snack', count: 1 }],
    })
  })
})
