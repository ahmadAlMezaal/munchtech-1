import seedSnacks from '../data/snacks.json'
import { seedLog } from '../data/seed'
import type { AppState, Snack } from './types'

export const STATE_KEY = 'munchtech-1:state'
export const PERSON_KEY = 'munchtech-1:person'
export const SLOTS_PER_ROW = 5

export function createInitialState(now: Date): AppState {
  const snacks = (seedSnacks as Snack[]).map((snack) => ({ ...snack }))
  return { snacks, log: seedLog(snacks, now) }
}

export function loadState(storage: Storage | null, now: Date): AppState {
  try {
    const raw = storage?.getItem(STATE_KEY)
    if (!raw) return createInitialState(now)
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (!Array.isArray(parsed.snacks) || !Array.isArray(parsed.log)) {
      return createInitialState(now)
    }
    return { ...parsed, snacks: parsed.snacks, log: parsed.log }
  } catch {
    return createInitialState(now)
  }
}

export function saveState(storage: Storage | null, state: AppState) {
  try {
    storage?.setItem(STATE_KEY, JSON.stringify(state))
  } catch {
    return
  }
}

export function findSnack(state: AppState, snackId: string): Snack | undefined {
  return state.snacks.find((snack) => snack.id === snackId)
}

export function consume(state: AppState, snackId: string, person: string, now: Date): AppState {
  const snack = findSnack(state, snackId)
  if (!snack) return state

  return {
    ...state,
    snacks: state.snacks.map((s) => (s.id === snackId ? { ...s, stock: s.stock - 1 } : s)),
    log: [...state.log, { snackId, person, at: now.toISOString() }],
  }
}

export function slotCode(index: number): string {
  const row = String.fromCharCode(65 + Math.floor(index / SLOTS_PER_ROW))
  return `${row}${(index % SLOTS_PER_ROW) + 1}`
}

export function browserStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}
