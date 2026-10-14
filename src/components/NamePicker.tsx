import { PEOPLE } from '../data/people'

interface Props {
  person: string | null
  onChange: (person: string | null) => void
}

export function NamePicker({ person, onChange }: Props) {
  return (
    <label className="picker">
      <span className="picker__label">Who's snacking?</span>
      <select
        className="picker__select"
        value={person ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">Pick your name</option>
        {PEOPLE.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  )
}
