import type { LogEntry, Snack } from '../lib/types'
import { PEOPLE } from './people'

const DAY_MS = 24 * 60 * 60 * 1000

function seededRandom(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedLog(snacks: Snack[], now: Date, count = 40): LogEntry[] {
  const random = seededRandom(1337)
  const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)]

  const entries: LogEntry[] = []
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(random() ** 2 * 45)
    const at = new Date(now.getTime() - daysAgo * DAY_MS)
    at.setHours(9 + Math.floor(random() * 8), Math.floor(random() * 60), 0, 0)
    if (at > now) at.setTime(at.getTime() - DAY_MS)
    entries.push({ snackId: pick(snacks).id, person: pick(PEOPLE), at: at.toISOString() })
  }

  return entries.sort((a, b) => a.at.localeCompare(b.at))
}
