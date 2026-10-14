const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function dayLabel(at: Date, now: Date): string {
  const diff = Math.round((startOfDay(now) - startOfDay(at)) / DAY_MS)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return at.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function clockTime(at: Date): string {
  return at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
