import { describe, expect, it } from 'vitest'
import {
  add, applyOp, divide, equals, explain, explainSimplify, formatFraction, formatMixed,
  frac, gcd, isSimplest, lcm, multiply, simplify, speakFraction, subtract,
} from './fraction.js'

describe('fraction math', () => {
  it('finds gcd and lcm', () => {
    expect(gcd(12, 18)).toBe(6)
    expect(gcd(7, 5)).toBe(1)
    expect(lcm(4, 6)).toBe(12)
  })

  it('rejects zero denominators and non-integers', () => {
    expect(() => frac(1, 0)).toThrow(RangeError)
    expect(() => frac(1.5, 2)).toThrow(TypeError)
  })

  it('keeps the sign on the numerator', () => {
    expect(frac(1, -2)).toEqual({ n: -1, d: 2 })
  })

  it('simplifies', () => {
    expect(simplify(frac(6, 8))).toEqual({ n: 3, d: 4 })
    expect(simplify(frac(0, 5))).toEqual({ n: 0, d: 1 })
    expect(isSimplest(frac(3, 4))).toBe(true)
    expect(isSimplest(frac(2, 4))).toBe(false)
  })

  it('adds, subtracts, multiplies and divides', () => {
    expect(add(frac(1, 3), frac(1, 4))).toEqual({ n: 7, d: 12 })
    expect(add(frac(1, 2), frac(1, 2))).toEqual({ n: 1, d: 1 })
    expect(subtract(frac(3, 4), frac(1, 3))).toEqual({ n: 5, d: 12 })
    expect(multiply(frac(2, 3), frac(4, 5))).toEqual({ n: 8, d: 15 })
    expect(divide(frac(1, 2), frac(1, 4))).toEqual({ n: 2, d: 1 })
    expect(applyOp('divide', frac(2, 3), frac(4, 5))).toEqual({ n: 5, d: 6 })
  })

  it('refuses to divide by zero', () => {
    expect(() => divide(frac(1, 2), frac(0, 3))).toThrow(/zero/)
  })

  it('compares equivalent fractions', () => {
    expect(equals(frac(1, 2), frac(4, 8))).toBe(true)
    expect(equals(frac(1, 2), frac(2, 3))).toBe(false)
  })

  it('formats for display and for screen readers', () => {
    expect(formatFraction(frac(3, 4))).toBe('3/4')
    expect(formatFraction(frac(2, 1))).toBe('2')
    expect(formatMixed(frac(7, 4))).toBe('1 3/4')
    expect(speakFraction(frac(3, 4))).toBe('3 over 4')
  })
})

describe('worked steps', () => {
  it('explains adding with a common denominator', () => {
    const { steps, result } = explain('add', frac(1, 3), frac(1, 4))
    expect(result).toEqual({ n: 7, d: 12 })
    expect(steps.join(' ')).toMatch(/least common denominator is 12/)
  })

  it('explains dividing with keep, change, flip', () => {
    const { steps, result } = explain('divide', frac(2, 3), frac(4, 5))
    expect(result).toEqual({ n: 5, d: 6 })
    expect(steps.join(' ')).toMatch(/Keep the first fraction/)
    expect(steps.join(' ')).toMatch(/becomes 5\/4/)
  })

  it('mentions mixed numbers for improper results', () => {
    const { steps } = explain('add', frac(5, 6), frac(3, 4))
    expect(steps.at(-1)).toMatch(/1 7\/12/)
  })

  it('explains simplifying', () => {
    const { steps, result } = explainSimplify(frac(10, 15))
    expect(result).toEqual({ n: 2, d: 3 })
    expect(steps[0]).toMatch(/It's 5/)
  })
})
