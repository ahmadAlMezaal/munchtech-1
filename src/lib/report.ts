import type { LogEntry, Snack } from './types'

// Months are zero-based, as in Date.getMonth(); calendar boundaries use local time.
export function monthlyReport(log: LogEntry[], snacks: Snack[], year: number, month: number) {
  const start = new Date(year, month, 1).getTime()
  const end = new Date(year, month + 1, 1).getTime()
  const counts = new Map<string, number>()
  let total = 0

  for (const entry of log) {
    const at = new Date(entry.at).getTime()
    if (at >= start && at < end) {
      total += 1
      counts.set(entry.snackId, (counts.get(entry.snackId) ?? 0) + 1)
    }
  }

  const names = new Map(snacks.map((snack) => [snack.id, snack.name]))
  const topSnacks = [...counts].map(([snackId, count]) => ({
    snackId,
    name: names.get(snackId) ?? 'Mystery snack',
    count,
  })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'en-GB') || a.snackId.localeCompare(b.snackId))
    .slice(0, 5)

  return { total, topSnacks }
}
