import { champions } from '../lib/champions'
import type { LogEntry, Snack } from '../lib/types'

interface Props {
  log?: LogEntry[]
  snacks?: Snack[]
  state?: { log: LogEntry[]; snacks: Snack[] }
  now: Date
}

const MEDALS = ['🥇', '🥈', '🥉'] as const

export function Champions({ log, snacks, state, now }: Props) {
  const actualLog = log ?? state?.log ?? []
  const actualSnacks = snacks ?? state?.snacks ?? []
  const leaders = champions(actualLog, actualSnacks, now)

  return (
    <section className="champions" aria-labelledby="champions-heading">
      <div className="champions__header">
        <h2 id="champions-heading" className="champions__title">
          Snack Champions
        </h2>
        <span className="champions__subtitle">Top snackers this week</span>
      </div>

      {leaders.length === 0 ? (
        <p className="champions__empty">The crown is up for grabs 👑</p>
      ) : (
        <ol className="champions__list">
          {leaders.map((champion, index) => (
            <li key={champion.person} className={`champions__item champions__item--${index + 1}`}>
              <span className="champions__medal">{MEDALS[index]}</span>
              <div className="champions__details">
                <div className="champions__person-row">
                  <span className="champions__name">{champion.person}</span>
                  <span className="champions__count">
                    {champion.count} {champion.count === 1 ? 'snack' : 'snacks'}
                  </span>
                </div>
                <div
                  className="champions__favourite"
                  title={`Favourite: ${champion.favouriteSnack?.name ?? champion.favouriteEmoji}`}
                >
                  <span className="champions__favourite-emoji">{champion.favouriteEmoji}</span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
