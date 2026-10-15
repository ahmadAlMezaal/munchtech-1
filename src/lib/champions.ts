import type { LogEntry, Snack } from './types'

export interface Champion {
  person: string
  count: number
  favouriteEmoji: string
  favouriteSnack?: Snack
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function champions(
  log: readonly LogEntry[],
  snacks: readonly Snack[],
  now: Date,
): Champion[] {
  const nowMs = now.getTime()
  const windowStart = nowMs - SEVEN_DAYS_MS

  const snacksById = new Map<string, Snack>()
  for (const snack of snacks) {
    snacksById.set(snack.id, snack)
  }

  const peopleMap = new Map<
    string,
    {
      person: string
      totalCount: number
      snackStats: Map<string, { count: number; latest: number }>
    }
  >()

  for (const entry of log) {
    if (!entry.person) continue

    const at = Date.parse(entry.at)
    if (!Number.isFinite(at) || at < windowStart || at > nowMs) {
      continue
    }

    let stats = peopleMap.get(entry.person)
    if (!stats) {
      stats = {
        person: entry.person,
        totalCount: 0,
        snackStats: new Map(),
      }
      peopleMap.set(entry.person, stats)
    }

    stats.totalCount += 1

    const currentStat = stats.snackStats.get(entry.snackId) ?? { count: 0, latest: 0 }
    stats.snackStats.set(entry.snackId, {
      count: currentStat.count + 1,
      latest: Math.max(currentStat.latest, at),
    })
  }

  const ranked = Array.from(peopleMap.values())
    .sort((a, b) => {
      if (b.totalCount !== a.totalCount) {
        return b.totalCount - a.totalCount
      }
      return a.person.localeCompare(b.person)
    })
    .slice(0, 3)

  return ranked.map((personStats) => {
    let favouriteSnackId: string | null = null
    let maxSnackCount = -1
    let latestSnackTime = -1

    for (const [snackId, stat] of personStats.snackStats) {
      const isBetterCount = stat.count > maxSnackCount
      const isTieBreakerRecent =
        stat.count === maxSnackCount && stat.latest > latestSnackTime
      const isTieBreakerAlpha =
        stat.count === maxSnackCount &&
        stat.latest === latestSnackTime &&
        (favouriteSnackId === null || snackId.localeCompare(favouriteSnackId) < 0)

      if (isBetterCount || isTieBreakerRecent || isTieBreakerAlpha) {
        favouriteSnackId = snackId
        maxSnackCount = stat.count
        latestSnackTime = stat.latest
      }
    }

    const favouriteSnack = favouriteSnackId ? snacksById.get(favouriteSnackId) : undefined
    const favouriteEmoji = favouriteSnack?.emoji ?? '❓'

    return {
      person: personStats.person,
      count: personStats.totalCount,
      favouriteEmoji,
      favouriteSnack,
    }
  })
}
