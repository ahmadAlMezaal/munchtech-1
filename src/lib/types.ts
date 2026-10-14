export type Category =
  | 'drinks'
  | 'chocolate'
  | 'crisps'
  | 'sweets'
  | 'biscuits'

export interface Snack {
  id: string
  name: string
  brand: string
  emoji: string
  category: Category
  wrapper: string
  stock: number
}

export interface LogEntry {
  snackId: string
  person: string
  at: string
}

export interface AppState {
  snacks: Snack[]
  log: LogEntry[]
}
