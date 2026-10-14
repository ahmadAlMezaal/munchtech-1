# Munchtech-1

The office snack machine: a Vite + React + TypeScript single-page app. No backend; all state is JSON in `localStorage`.

## Commands

Run all of these before finishing; CI runs the same.

```bash
npm ci
npm run lint    # oxlint
npm test        # vitest
npm run build   # type-checks, then builds
```

## Layout

- `src/lib/`: pure logic, no React. `types.ts` (data shapes), `store.ts` (load/save, `consume()`, slot codes), `colour.ts`, `time.ts`.
- `src/data/`: seed snacks (`snacks.json`), people (`people.ts`), and the seeded activity log (`seed.ts`).
- `src/components/`: `SnackGrid` (the machine and tray), `SnackCard` (one slot), `ActivityLog` (the receipt), `NamePicker`.
- `src/App.tsx`: wires state, persistence and the current person together.
- `src/index.css`: all styles. Colours and fonts are CSS variables on `:root`.

## Conventions

- Put logic in `src/lib/` as pure functions that take `now: Date` instead of calling `new Date()`, and test them next to the file (`*.test.ts`).
- State changes return a new `AppState`; never mutate.
- Saved state may come from an older version of the app. When adding a field to `AppState` or `LogEntry`, make `loadState` handle data without it.
- UI copy is British English, sentence case, and friendly.
- Keep the vending-machine look: new sections should feel like part of the machine or the receipt, using the existing CSS variables.
- Every new user-facing behaviour needs a test.
