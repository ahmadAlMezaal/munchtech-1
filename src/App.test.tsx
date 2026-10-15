import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('asks for a name before anyone can consume', () => {
    render(<App />)

    expect(screen.getByText('Pick your name to start snacking.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Consume KitKat' })).toBeDisabled()
  })

  it('consumes a snack and logs it', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText("Who's snacking?"), 'Wanda')
    await user.click(screen.getByRole('button', { name: 'Consume KitKat' }))

    expect(screen.getByTestId('stock-kitkat')).toHaveTextContent('9 left')
    expect(screen.getByText('Enjoy your KitKat, Wanda')).toBeInTheDocument()
    const receipt = screen.getByRole('complementary', { name: 'Who had what' })
    expect(within(receipt).getAllByText(/Wanda had 🍫 KitKat/).length).toBeGreaterThan(0)
  })

  it('remembers who is snacking', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.selectOptions(screen.getByLabelText("Who's snacking?"), 'Mo')
    unmount()

    render(<App />)

    expect(screen.getByLabelText("Who's snacking?")).toHaveValue('Mo')
  })

  it('displays the snack champions panel', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Snack Champions' })).toBeInTheDocument()
  })
})
