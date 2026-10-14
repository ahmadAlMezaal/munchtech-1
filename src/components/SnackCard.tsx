import type { CSSProperties } from 'react'
import { inkOn } from '../lib/colour'
import type { Snack } from '../lib/types'

interface Props {
  snack: Snack
  code: string
  canConsume: boolean
  onConsume: (snackId: string) => void
}

export function SnackCard({ snack, code, canConsume, onConsume }: Props) {
  const style = { '--wrapper': snack.wrapper, '--wrapper-ink': inkOn(snack.wrapper) } as CSSProperties

  return (
    <li className="slot" style={style}>
      <div className="slot__packet">
        <span className="slot__emoji" aria-hidden="true">{snack.emoji}</span>
        <span className="slot__brand">{snack.brand}</span>
        <span className="slot__name">{snack.name}</span>
      </div>
      <div className="slot__coil" aria-hidden="true" />
      <div className="slot__label">
        <span className="slot__code" aria-label={`Slot ${code}`}>{code}</span>
        <span className="slot__stock" data-testid={`stock-${snack.id}`}>
          {snack.stock} left
        </span>
      </div>
      <button
        type="button"
        className="slot__consume"
        disabled={!canConsume}
        onClick={() => onConsume(snack.id)}
        aria-label={`Consume ${snack.name}`}
      >
        Consume
      </button>
    </li>
  )
}
