import { describe, expect, it } from 'vitest'
import { applyOp, equals } from './fraction.js'
import {
  MAX_LEVEL, MIN_LEVEL, createRng, freshQuestion, generateQuestion, nextLevel,
} from './questionGenerator.js'

const OPS = ['add', 'subtract', 'multiply', 'divide']

describe('adaptive difficulty', () => {
  it('goes up after a right answer and down after a wrong one', () => {
    expect(nextLevel(2, true)).toBe(3)
    expect(nextLevel(2, false)).toBe(1)
  })

  it('stays between the minimum and maximum level', () => {
    expect(nextLevel(MAX_LEVEL, true)).toBe(MAX_LEVEL)
    expect(nextLevel(MIN_LEVEL, false)).toBe(MIN_LEVEL)
  })
})

describe('generateQuestion', () => {
  const rng = createRng(42)

  for (const op of OPS) {
    for (let level = MIN_LEVEL; level <= MAX_LEVEL; level++) {
      it(`creates valid ${op} questions at level ${level}`, () => {
        for (let i = 0; i < 150; i++) {
          const q = generateQuestion(op, level, rng)
          expect(q.level).toBe(level)
          expect(q.a.d).toBeGreaterThan(0)
          expect(q.b.d).toBeGreaterThan(0)
          expect(q.a.n).toBeGreaterThan(0)
          expect(q.b.n).toBeGreaterThan(0)
          expect(equals(q.answer, applyOp(op, q.a, q.b))).toBe(true)
          if (op === 'subtract') expect(q.answer.n).toBeGreaterThan(0)
        }
      })
    }
  }

  it('uses matching denominators at level 1 and different ones at level 4 for adding', () => {
    for (let i = 0; i < 50; i++) {
      const easy = generateQuestion('add', 1, rng)
      expect(easy.a.d).toBe(easy.b.d)
      const harder = generateQuestion('add', 4, rng)
      expect(harder.a.d).not.toBe(harder.b.d)
    }
  })

  it('works with a constant random source', () => {
    const q = generateQuestion('add', 1, () => 0)
    expect(q.answer).toEqual({ n: 2, d: 3 })
  })

  it('avoids repeating the previous question when possible', () => {
    const r = createRng(7)
    let prev = null
    let repeats = 0
    for (let i = 0; i < 100; i++) {
      const q = freshQuestion('multiply', 4, r, prev)
      if (prev && q.a.n === prev.a.n && q.a.d === prev.a.d && q.b.n === prev.b.n && q.b.d === prev.b.d) repeats++
      prev = q
    }
    expect(repeats).toBe(0)
  })
})
