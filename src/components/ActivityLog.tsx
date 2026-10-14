import { clockTime, dayLabel } from '../lib/time'
import type { LogEntry, Snack } from '../lib/types'

interface Props {
  log: LogEntry[]
  snacks: Snack[]
  now: Date
  limit?: number
}

export function ActivityLog({ log, snacks, now, limit = 30 }: Props) {
  const names = new Map(snacks.map((snack) => [snack.id, snack]))
  const recent = [...log].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)

  const days: { label: string; entries: LogEntry[] }[] = []
  for (const entry of recent) {
    const label = dayLabel(new Date(entry.at), now)
    const last = days[days.length - 1]
    if (last?.label === label) last.entries.push(entry)
    else days.push({ label, entries: [entry] })
  }

  return (
    <aside className="receipt" aria-label="Who had what">
      <header className="receipt__head">
        <p className="receipt__title">Munchtech-1</p>
        <p>Who had what, and when</p>
      </header>

      {days.length === 0 ? (
        <p className="receipt__empty">Nothing yet. The first snack is on the house.</p>
      ) : (
        days.map((day) => (
          <section key={day.label} className="receipt__day">
            <h3>{day.label}</h3>
            <ul>
              {day.entries.map((entry) => {
                const snack = names.get(entry.snackId)
                return (
                  <li key={`${entry.at}-${entry.person}-${entry.snackId}`}>
                    <span>
                      {entry.person} had {snack ? `${snack.emoji} ${snack.name}` : 'a mystery snack'}
                    </span>
                    <time dateTime={entry.at}>{clockTime(new Date(entry.at))}</time>
                  </li>
                )
              })}
            </ul>
          </section>
        ))
      )}

      <footer className="receipt__foot">
        <p>{log.length} snacks served</p>
      </footer>
    </aside>
  )
}
