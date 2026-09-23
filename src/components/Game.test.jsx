import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Game from './Game.jsx'
import { generateQuestion } from '../lib/questionGenerator.js'

// A constant random source makes every question predictable.
const rng = () => 0

async function answer(user, n, d) {
  const num = screen.getByLabelText('Answer numerator')
  const den = screen.getByLabelText('Answer denominator')
  await user.type(num, String(n))
  await user.type(den, `${d}{Enter}`)
}

describe('Game', () => {
  it('shows the first question at level 1', () => {
    render(<Game op="add" rng={rng} />)
    expect(screen.getByRole('heading', { name: /question 1 of 10/i })).toBeInTheDocument()
    expect(screen.getByText(/level 1 of 5/i)).toBeInTheDocument()
    expect(screen.getByText('Score: 0 of 0')).toBeInTheDocument()
  })

  it('makes the next question harder after a correct answer (keyboard only)', async () => {
    const user = userEvent.setup()
    render(<Game op="add" rng={rng} />)
    const { answer: correct } = generateQuestion('add', 1, rng)

    await user.tab()
    expect(screen.getByLabelText('Answer numerator')).toHaveFocus()
    await user.keyboard(String(correct.n))
    await user.tab()
    await user.keyboard(`${correct.d}{Enter}`)

    expect(screen.getByText(/correct!/i)).toBeInTheDocument()
    expect(screen.getByText('Score: 1 of 1')).toBeInTheDocument()
    expect(screen.getByText(/next question will be a little harder/i)).toBeInTheDocument()

    const next = screen.getByRole('button', { name: /next question/i })
    expect(next).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: /question 2 of 10/i })).toBeInTheDocument()
    expect(screen.getByText(/level 2 of 5/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Answer numerator')).toHaveFocus()
  })

  it('makes the next question easier after a wrong answer', async () => {
    const user = userEvent.setup()
    render(<Game op="add" rng={rng} />)

    const first = generateQuestion('add', 1, rng).answer
    await answer(user, first.n, first.d)
    await user.keyboard('{Enter}')
    expect(screen.getByText(/level 2 of 5/i)).toBeInTheDocument()

    await answer(user, 99, 1)
    expect(screen.getByText(/not quite. the answer is/i)).toBeInTheDocument()
    expect(screen.getByText(/a little easier/i)).toBeInTheDocument()
    expect(screen.getByText('See how to solve it')).toBeInTheDocument()
    await user.keyboard('{Enter}')
    expect(screen.getByText(/level 1 of 5/i)).toBeInTheDocument()
    expect(screen.getByText('Score: 1 of 2')).toBeInTheDocument()
  })

  it('accepts equivalent answers and suggests the simplest form', async () => {
    const user = userEvent.setup()
    render(<Game op="add" rng={rng} />)
    const { answer: correct } = generateQuestion('add', 1, rng)
    await answer(user, correct.n * 2, correct.d * 2)
    expect(screen.getByText(/correct!/i)).toHaveTextContent(`simplifies to ${correct.n}/${correct.d}`)
  })

  it('sanitizes typed input', async () => {
    const user = userEvent.setup()
    render(<Game op="add" rng={rng} />)
    const num = screen.getByLabelText('Answer numerator')
    await user.type(num, '<b>2</b>')
    expect(num).toHaveValue('2')
  })

  it('explains empty or invalid answers without counting them', async () => {
    const user = userEvent.setup()
    render(<Game op="add" rng={rng} />)
    await user.type(screen.getByLabelText('Answer numerator'), '2{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent(/enter a denominator/i)
    expect(screen.getByLabelText('Answer denominator')).toHaveFocus()
    expect(screen.getByText('Score: 0 of 0')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Answer denominator'), '0{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent(/can't be 0/i)
  })

  it('ends after ten questions and reports the score', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()
    render(<Game op="multiply" rng={rng} onFinish={onFinish} />)
    for (let i = 0; i < 10; i++) {
      await answer(user, 999, 1)
      await user.keyboard('{Enter}')
    }
    expect(screen.getByRole('heading', { name: /game finished/i })).toHaveFocus()
    expect(screen.getByText('0 out of 10')).toBeInTheDocument()
    expect(onFinish).toHaveBeenCalledWith(0)
  })
})
