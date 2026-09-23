// Pure fraction math + step-by-step explanations. No React in here, so it's easy to test.

export const OPS = {
  add: { symbol: '+', word: 'plus', name: 'Adding', verb: 'Add' },
  subtract: { symbol: '−', word: 'minus', name: 'Subtracting', verb: 'Subtract' },
  multiply: { symbol: '×', word: 'times', name: 'Multiplying', verb: 'Multiply' },
  divide: { symbol: '÷', word: 'divided by', name: 'Dividing', verb: 'Divide' },
}

export function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a || 1
}

export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b)
}

/** Build a fraction. The sign always lives on the numerator. */
export function frac(n, d = 1) {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) {
    throw new TypeError('Numerator and denominator must be whole numbers')
  }
  if (d === 0) throw new RangeError('The denominator cannot be zero')
  if (d < 0) return { n: -n, d: -d }
  return { n, d }
}

export function simplify({ n, d }) {
  const g = gcd(n, d)
  return frac(n / g, d / g)
}

export const isSimplest = ({ n, d }) => gcd(n, d) === 1
export const equals = (a, b) => a.n * b.d === b.n * a.d

export const add = (a, b) => simplify(frac(a.n * b.d + b.n * a.d, a.d * b.d))
export const subtract = (a, b) => simplify(frac(a.n * b.d - b.n * a.d, a.d * b.d))
export const multiply = (a, b) => simplify(frac(a.n * b.n, a.d * b.d))
export function divide(a, b) {
  if (b.n === 0) throw new RangeError("You can't divide by zero")
  return simplify(frac(a.n * b.d, a.d * b.n))
}

const OP_FNS = { add, subtract, multiply, divide }
export function applyOp(op, a, b) {
  const fn = OP_FNS[op]
  if (!fn) throw new Error(`Unknown operation: ${op}`)
  return fn(a, b)
}

export function toMixed({ n, d }) {
  const sign = n < 0 ? -1 : 1
  const abs = Math.abs(n)
  return { sign, whole: Math.floor(abs / d), n: abs % d, d }
}

/** "3/4", or just "2" for whole numbers. */
export const formatFraction = ({ n, d }) => (d === 1 ? `${n}` : `${n}/${d}`)
/** Always shows the denominator, e.g. "3/1" — handy inside worked steps. */
const fx = ({ n, d }) => `${n}/${d}`

export function formatMixed(f) {
  const m = toMixed(f)
  const sign = m.sign < 0 ? '-' : ''
  if (m.n === 0) return `${sign}${m.whole}`
  if (m.whole === 0) return `${sign}${m.n}/${m.d}`
  return `${sign}${m.whole} ${m.n}/${m.d}`
}

/** Screen-reader friendly wording, e.g. "3 over 4". */
export const speakFraction = ({ n, d }) => (d === 1 ? `${n}` : `${n} over ${d}`)

const isImproper = (f) => f.d !== 1 && Math.abs(f.n) > f.d

function finish(raw, steps) {
  const g = gcd(raw.n, raw.d)
  let result = raw
  if (g > 1) {
    result = simplify(raw)
    steps.push(`Simplify: divide the top and bottom by ${g}. ${fx(raw)} = ${formatFraction(result)}.`)
  } else {
    steps.push(`${fx(raw)} is already in simplest form.`)
  }
  if (isImproper(result)) steps.push(`As a mixed number, that's ${formatMixed(result)}.`)
  return { steps, result }
}

function explainAddSubtract(op, a, b) {
  const sign = OPS[op].symbol
  const verb = OPS[op].verb
  const combine = (x, y) => (op === 'add' ? x + y : x - y)
  const steps = []

  if (a.d === b.d) {
    steps.push(`The denominators already match (${a.d}), so the pieces are the same size.`)
    const n = combine(a.n, b.n)
    steps.push(`${verb} the numerators: ${a.n} ${sign} ${b.n} = ${n}.`)
    steps.push(`Keep the denominator the same: ${n}/${a.d}.`)
    return finish(frac(n, a.d), steps)
  }

  const L = lcm(a.d, b.d)
  const ka = L / a.d
  const kb = L / b.d
  const a2 = frac(a.n * ka, L)
  const b2 = frac(b.n * kb, L)
  steps.push(`The denominators are different (${a.d} and ${b.d}). The least common denominator is ${L}.`)
  steps.push(
    ka === 1
      ? `${fx(a)} already has ${L} on the bottom.`
      : `Rewrite ${fx(a)}: multiply the top and bottom by ${ka} to get ${fx(a2)}.`,
  )
  steps.push(
    kb === 1
      ? `${fx(b)} already has ${L} on the bottom.`
      : `Rewrite ${fx(b)}: multiply the top and bottom by ${kb} to get ${fx(b2)}.`,
  )
  const n = combine(a2.n, b2.n)
  steps.push(`${verb} the numerators: ${a2.n} ${sign} ${b2.n} = ${n}. Keep ${L} on the bottom: ${n}/${L}.`)
  return finish(frac(n, L), steps)
}

function explainMultiply(a, b) {
  const steps = []
  if (a.d === 1 || b.d === 1) steps.push('Write any whole number as a fraction over 1.')
  const n = a.n * b.n
  const d = a.d * b.d
  steps.push(`Multiply the numerators straight across: ${a.n} × ${b.n} = ${n}.`)
  steps.push(`Multiply the denominators straight across: ${a.d} × ${b.d} = ${d}.`)
  steps.push(`That gives ${n}/${d}.`)
  return finish(frac(n, d), steps)
}

function explainDivide(a, b) {
  if (b.n === 0) throw new RangeError("You can't divide by zero")
  const flipped = frac(b.d, b.n)
  const steps = []
  if (a.d === 1 || b.d === 1) steps.push('Write any whole number as a fraction over 1.')
  steps.push(`Keep the first fraction: ${fx(a)}.`)
  steps.push('Change ÷ into ×.')
  steps.push(`Flip the second fraction: ${fx(b)} becomes ${fx(flipped)}.`)
  const n = a.n * flipped.n
  const d = a.d * flipped.d
  steps.push(`Multiply: ${a.n} × ${flipped.n} = ${n} on top and ${a.d} × ${flipped.d} = ${d} on the bottom, giving ${n}/${d}.`)
  return finish(frac(n, d), steps)
}

/** Returns { steps: string[], result: fraction } for a + − × ÷ problem. */
export function explain(op, a, b) {
  switch (op) {
    case 'add':
    case 'subtract':
      return explainAddSubtract(op, a, b)
    case 'multiply':
      return explainMultiply(a, b)
    case 'divide':
      return explainDivide(a, b)
    default:
      throw new Error(`Unknown operation: ${op}`)
  }
}

/** Walks through reducing a single fraction to simplest form. */
export function explainSimplify(f) {
  const steps = []
  const g = gcd(f.n, f.d)
  const result = simplify(f)
  steps.push(`Find the greatest common factor of ${f.n} and ${f.d}. It's ${g}.`)
  if (g === 1) {
    steps.push(`Because it's 1, ${fx(f)} is already in simplest form.`)
  } else {
    steps.push(`Divide the numerator by ${g}: ${f.n} ÷ ${g} = ${f.n / g}.`)
    steps.push(`Divide the denominator by ${g}: ${f.d} ÷ ${g} = ${f.d / g}.`)
    steps.push(`So ${fx(f)} = ${formatFraction(result)}.`)
  }
  if (isImproper(result)) steps.push(`As a mixed number, that's ${formatMixed(result)}.`)
  return { steps, result }
}
