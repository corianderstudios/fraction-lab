import { applyOp, equals, frac } from './fraction.js'

export const MIN_LEVEL = 1
export const MAX_LEVEL = 5
export const START_LEVEL = 1
export const MAX_QUESTIONS = 10
export const LEVEL_NAMES = ['Warm-up', 'Easy', 'Medium', 'Tricky', 'Challenge']

/** Right answer → one step harder. Wrong answer → one step easier. */
export function nextLevel(level, wasCorrect) {
  const next = level + (wasCorrect ? 1 : -1)
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, next))
}

/** Small seeded random generator (mulberry32) so tests can be repeatable. */
export function createRng(seed = 1) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const randInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1))
const pick = (rng, list) => list[Math.floor(rng() * list.length)]
const proper = (rng, d) => frac(randInt(rng, 1, d - 1), d)
const maybeSwap = (rng, a, b) => (rng() < 0.5 ? [b, a] : [a, b])

const COPRIME_PAIRS = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7], [5, 6]]
const SHARED_FACTOR_PAIRS = [[4, 6], [6, 8], [6, 9], [8, 12], [9, 12], [10, 15], [6, 10], [4, 10]]

function addPair(rng, level) {
  switch (level) {
    case 1: {
      // Same denominator, small, answer stays below 1.
      const d = randInt(rng, 3, 8)
      const n1 = randInt(rng, 1, d - 2)
      const n2 = randInt(rng, 1, d - 1 - n1)
      return [frac(n1, d), frac(n2, d)]
    }
    case 2: {
      // Same denominator; may need simplifying or go past 1.
      const d = randInt(rng, 4, 10)
      return [proper(rng, d), proper(rng, d)]
    }
    case 3: {
      // One denominator is a multiple of the other.
      const d = pick(rng, [2, 3, 4, 5])
      const m = pick(rng, [2, 3])
      return maybeSwap(rng, proper(rng, d), proper(rng, d * m))
    }
    case 4: {
      const [d1, d2] = pick(rng, COPRIME_PAIRS)
      return maybeSwap(rng, proper(rng, d1), proper(rng, d2))
    }
    default: {
      // Least common denominator is smaller than the product: needs real thought.
      const [d1, d2] = pick(rng, SHARED_FACTOR_PAIRS)
      return maybeSwap(rng, proper(rng, d1), proper(rng, d2))
    }
  }
}

function subtractPair(rng, level) {
  let a
  let b
  if (level === 1) {
    const d = randInt(rng, 3, 9)
    const n1 = randInt(rng, 2, d - 1)
    a = frac(n1, d)
    b = frac(randInt(rng, 1, n1 - 1), d)
  } else {
    ;[a, b] = addPair(rng, level)
  }
  // Keep answers positive: bigger fraction first.
  if (a.n * b.d < b.n * a.d) [a, b] = [b, a]
  if (equals(a, b)) {
    if (a.n + 1 < a.d) a = frac(a.n + 1, a.d)
    else b = frac(b.n, b.d * 2)
  }
  return [a, b]
}

function multiplyPair(rng, level) {
  switch (level) {
    case 1:
      return [frac(1, randInt(rng, 2, 5)), frac(1, randInt(rng, 2, 5))]
    case 2:
      return [proper(rng, randInt(rng, 2, 6)), proper(rng, randInt(rng, 2, 6))]
    case 3:
      return maybeSwap(rng, frac(randInt(rng, 2, 6)), proper(rng, randInt(rng, 3, 8)))
    case 4:
      return [proper(rng, randInt(rng, 3, 9)), proper(rng, randInt(rng, 3, 9))]
    default:
      return [proper(rng, randInt(rng, 6, 12)), proper(rng, randInt(rng, 6, 12))]
  }
}

function dividePair(rng, level) {
  switch (level) {
    case 1:
      return [proper(rng, randInt(rng, 2, 4)), frac(1, randInt(rng, 2, 4))]
    case 2:
      return [proper(rng, randInt(rng, 2, 6)), proper(rng, randInt(rng, 2, 6))]
    case 3:
      return rng() < 0.5
        ? [frac(randInt(rng, 2, 5)), proper(rng, randInt(rng, 2, 6))]
        : [proper(rng, randInt(rng, 2, 6)), frac(randInt(rng, 2, 5))]
    case 4:
      return [proper(rng, randInt(rng, 3, 9)), proper(rng, randInt(rng, 3, 9))]
    default:
      return [proper(rng, randInt(rng, 6, 12)), proper(rng, randInt(rng, 6, 12))]
  }
}

const PAIR_MAKERS = { add: addPair, subtract: subtractPair, multiply: multiplyPair, divide: dividePair }

export function generateQuestion(op, level = START_LEVEL, rng = Math.random) {
  const maker = PAIR_MAKERS[op]
  if (!maker) throw new Error(`Unknown operation: ${op}`)
  const safeLevel = Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level)))
  const [a, b] = maker(rng, safeLevel)
  return { op, level: safeLevel, a, b, answer: applyOp(op, a, b) }
}

const sameQuestion = (q1, q2) =>
  !!q1 && !!q2 && q1.a.n === q2.a.n && q1.a.d === q2.a.d && q1.b.n === q2.b.n && q1.b.d === q2.b.d

/** Like generateQuestion, but tries not to repeat the previous question. */
export function freshQuestion(op, level, rng = Math.random, previous = null) {
  let q = generateQuestion(op, level, rng)
  for (let i = 0; i < 6 && sameQuestion(q, previous); i++) q = generateQuestion(op, level, rng)
  return q
}
