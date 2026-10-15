import { snackOfTheWeek } from '../lib/store'
import type { AppState } from '../lib/types'

interface Props {
  state: AppState
  now: Date
}

export function SnackOfTheWeek({ state, now }: Props) {
  const champion = snackOfTheWeek(state, now)

  return (
    <section className="weekly-banner" aria-labelledby="weekly-banner__title">
      <div className="weekly-banner__trophy" aria-hidden="true">
        🏆
      </div>
      <div className="weekly-banner__content">
        <h2 className="weekly-banner__title" id="weekly-banner__title">
          Snack of the week
        </h2>
        {champion ? (
          <p className="weekly-banner__champion">
            <span className="weekly-banner__emoji" aria-hidden="true">
              {champion.snack.emoji}
            </span>
            <span>
              <strong>{champion.snack.name}</strong>
              <span className="weekly-banner__count">eaten {champion.count} times this week</span>
            </span>
          </p>
        ) : (
          <p className="weekly-banner__empty">No champion yet. Go grab a snack!</p>
        )}
      </div>
    </section>
  )
}
