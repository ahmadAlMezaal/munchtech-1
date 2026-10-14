import { slotCode } from '../lib/store'
import type { Snack } from '../lib/types'
import { SnackCard } from './SnackCard'

export interface Dispensed {
  snack: Snack
  person: string
  count: number
}

interface Props {
  snacks: Snack[]
  canConsume: boolean
  dispensed: Dispensed | null
  onConsume: (snackId: string) => void
}

export function SnackGrid({ snacks, canConsume, dispensed, onConsume }: Props) {
  return (
    <section className="machine" aria-label="Snack machine">
      <div className="machine__glass">
        <ul className="machine__shelves">
          {snacks.map((snack, index) => (
            <SnackCard
              key={snack.id}
              snack={snack}
              code={slotCode(index)}
              canConsume={canConsume}
              onConsume={onConsume}
            />
          ))}
        </ul>
      </div>
      <div className="machine__tray" aria-live="polite">
        {dispensed ? (
          <p className="tray__message" key={dispensed.count}>
            <span className="tray__drop" aria-hidden="true">{dispensed.snack.emoji}</span>
            Enjoy your {dispensed.snack.name}, {dispensed.person}
          </p>
        ) : (
          <p className="tray__message tray__message--empty">Your snack drops here</p>
        )}
      </div>
    </section>
  )
}
