import { useEffect, useState } from 'react'
import { ActivityLog } from './components/ActivityLog'
import { NamePicker } from './components/NamePicker'
import { SnackGrid, type Dispensed } from './components/SnackGrid'
import { SnackOfTheWeek } from './components/SnackOfTheWeek'
import { PERSON_KEY, browserStorage, consume, findSnack, loadState, saveState } from './lib/store'

function loadPerson(): string | null {
  try {
    return browserStorage()?.getItem(PERSON_KEY) ?? null
  } catch {
    return null
  }
}

function savePerson(person: string | null) {
  try {
    const storage = browserStorage()
    if (person) storage?.setItem(PERSON_KEY, person)
    else storage?.removeItem(PERSON_KEY)
  } catch {
    return
  }
}

export default function App() {
  const [state, setState] = useState(() => loadState(browserStorage(), new Date()))
  const [person, setPerson] = useState(loadPerson)
  const [dispensed, setDispensed] = useState<Dispensed | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => saveState(browserStorage(), state), [state])
  useEffect(() => savePerson(person), [person])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  function handleConsume(snackId: string) {
    if (!person) return
    const snack = findSnack(state, snackId)
    if (!snack) return
    const at = new Date()
    setNow(at)
    setState((current) => consume(current, snackId, person, at))
    setDispensed((previous) => ({ snack, person, count: (previous?.count ?? 0) + 1 }))
  }

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1 className="logo">Munchtech-1</h1>
          <p className="tagline">The office snack machine. Take one, we'll keep count.</p>
        </div>
        <NamePicker person={person} onChange={setPerson} />
      </header>

      {!person && (
        <p className="nudge" role="status">
          Pick your name to start snacking.
        </p>
      )}

      <SnackOfTheWeek state={state} now={now} />

      <main className="layout">
        <SnackGrid
          snacks={state.snacks}
          canConsume={person !== null}
          dispensed={dispensed}
          onConsume={handleConsume}
        />
        <ActivityLog log={state.log} snacks={state.snacks} now={now} />
      </main>
    </div>
  )
}
