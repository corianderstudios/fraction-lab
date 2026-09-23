import { OPS, speakFraction } from '../lib/fraction.js'

const SIZES = { sm: 'text-base', md: 'text-2xl', lg: 'text-4xl' }

/** A stacked fraction (numerator over denominator) with a screen-reader reading. */
export function FractionDisplay({ value, size = 'md', className = '' }) {
  const sizeClass = SIZES[size] ?? SIZES.md
  if (value.d === 1) {
    return <span className={`font-serif tabular-nums ${sizeClass} ${className}`}>{value.n}</span>
  }
  return (
    <span className={`mx-0.5 inline-flex flex-col items-center align-middle font-serif leading-tight tabular-nums ${sizeClass} ${className}`}>
      <span aria-hidden="true" className="px-1">{value.n}</span>
      <span aria-hidden="true" className="h-0.5 w-full rounded bg-current" />
      <span aria-hidden="true" className="px-1">{value.d}</span>
      <span className="sr-only">{speakFraction(value)}</span>
    </span>
  )
}

/** a (op) b = result. Pass result="?" to show an unknown. */
export function Equation({ a, op, b, result, size = 'md' }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <FractionDisplay value={a} size={size} />
      <span aria-hidden="true" className="font-serif text-2xl text-muted">{OPS[op].symbol}</span>
      <span className="sr-only"> {OPS[op].word} </span>
      <FractionDisplay value={b} size={size} />
      {result !== undefined && (
        <>
          <span aria-hidden="true" className="font-serif text-2xl text-muted">=</span>
          {result === '?' ? (
            <>
              <span aria-hidden="true" className="font-serif text-2xl text-muted">?</span>
              <span className="sr-only"> equals what?</span>
            </>
          ) : (
            <>
              <span className="sr-only"> equals </span>
              <FractionDisplay value={result} size={size} className="font-semibold text-accent" />
            </>
          )}
        </>
      )}
    </p>
  )
}
