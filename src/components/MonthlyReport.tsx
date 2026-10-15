import { useState } from 'react'
import { monthlyReport } from '../lib/report'
import type { LogEntry, Snack } from '../lib/types'

interface Props {
  log: LogEntry[]
  snacks: Snack[]
  now: Date
}

export function MonthlyReport({ log, snacks, now }: Props) {
  const [monthOffset, setMonthOffset] = useState(0)
  const selected = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const report = monthlyReport(log, snacks, selected.getFullYear(), selected.getMonth())

  return (
    <section className="monthly-report" aria-labelledby="monthly-report-title">
      <h2 id="monthly-report-title">Monthly report</h2>
      <div className="monthly-report__selector">
        <button type="button" aria-label="Previous month" onClick={() => setMonthOffset((offset) => offset - 1)}>←</button>
        <p aria-live="polite">{selected.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        <button type="button" aria-label="Next month" onClick={() => setMonthOffset((offset) => offset + 1)}>→</button>
      </div>
      <p className="monthly-report__total">{report.total} {report.total === 1 ? 'snack' : 'snacks'} consumed</p>
      {report.total === 0 ? (
        <p className="receipt__empty">Nothing eaten yet</p>
      ) : (
        <>
          <h3>Top 5 snacks</h3>
          <ol className="monthly-report__snacks">
            {report.topSnacks.map((snack) => (
              <li key={snack.snackId}><span>{snack.name}</span><strong>{snack.count}</strong></li>
            ))}
          </ol>
        </>
      )}
    </section>
  )
}
