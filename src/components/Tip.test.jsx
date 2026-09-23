import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Tip from './Tip.jsx'

function setup() {
  const user = userEvent.setup()
  render(
    <div>
      <Tip title="Keep, Change, Flip">Keep the first, change the sign, flip the second.</Tip>
      <button type="button">Outside</button>
    </div>,
  )
  const trigger = screen.getByRole('button', { name: /tip: keep, change, flip/i })
  return { user, trigger }
}

describe('Tip', () => {
  it('starts closed', () => {
    const { trigger } = setup()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText(/flip the second/i)).not.toBeVisible()
  })

  it('opens on click and shows the tip', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/flip the second/i)).toBeVisible()
  })

  it('opens with the keyboard and closes with Escape, returning focus', async () => {
    const { user, trigger } = setup()
    await user.tab()
    expect(trigger).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    expect(screen.getByRole('button', { name: /close tip/i })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('closes when clicking outside', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
