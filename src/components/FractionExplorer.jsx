import { useId, useState } from 'react'
import { explainSimplify, formatFraction, formatMixed, frac, speakFraction } from '../lib/fraction.js'
import { parseFractionInput } from '../lib/sanitize.js'
import FractionInput from './FractionInput.jsx'
import FractionBar from './FractionBar.jsx'
import { FractionDisplay } from './FractionDisplay.jsx'
import { ShuffleIcon } from './Icons.jsx'

function explore(raw) {
  const parsed = parseFractionInput(raw.numerator, raw.denominator)
  if (!parsed.ok) return { error: parsed.error, field: parsed.field }
  const f = parsed.value
  const { steps, result } = explainSimplify(f)
  const equivalents = [2, 3, 4].map((k) => frac(f.n * k, f.d * k))
  return { f, steps, simplest: result, equivalents, improper: f.n > f.d && f.d !== 1 }
}

/** Playground for the basics lesson: build a fraction and see it drawn, simplified and scaled. */
export default function FractionExplorer() {
  const [value, setValue] = useState({ numerator: '6', denominator: '8' })
  const [output, setOutput] = useState(() => explore({ numerator: '6', denominator: '8' }))
  const headingId = useId()
  const errorId = useId()

  function handleSubmit(e) {
    e.preventDefault()
    setOutput(explore(value))
  }

  function randomize() {
    const d = 2 + Math.floor(Math.random() * 7)
    const n = 1 + Math.floor(Math.random() * (d - 1))
    const k = 2 + Math.floor(Math.random() * 3)
    const next = { numerator: String(n * k), denominator: String(d * k) }
    setValue(next)
    setOutput(explore(next))
  }

  return (
    <section aria-labelledby={headingId} className="panel p-5">
      <h2 id={headingId} className="text-2xl font-semibold">Playground</h2>
      <p className="mt-1 text-muted">Build a fraction and select Explore to see it drawn, simplified and scaled.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <FractionInput
          label="Your fraction"
          value={value}
          onChange={setValue}
          invalidField={output.error ? output.field : null}
          describedBy={output.error ? errorId : undefined}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" className="btn-primary">Explore</button>
          <button type="button" onClick={randomize} className="btn-secondary">
            <ShuffleIcon className="h-4 w-4" />
            Random fraction
          </button>
        </div>
      </form>

      <div role="status" aria-live="polite" className="mt-5">
        {output.error ? (
          <p id={errorId} className="rounded-lg bg-gentle-soft px-3 py-2 font-bold text-gentle">{output.error}</p>
        ) : (
          <p className="font-bold">
            Simplest form: {formatFraction(output.simplest)}
            <span className="sr-only"> ({speakFraction(output.simplest)})</span>
            {output.improper && <span> which is {formatMixed(output.f)} as a mixed number</span>}
          </p>
        )}
      </div>

      {!output.error && (
        <div className="mt-4 space-y-5">
          <FractionBar value={output.f} label={`Your fraction, ${output.f.n}/${output.f.d}`} />
          <div>
            <h3 className="text-lg font-semibold">Equivalent fractions</h3>
            <p className="mt-1 text-sm text-muted">Multiply the top and bottom by 2, 3 and 4. Same amount, smaller pieces.</p>
            <ul className="mt-3 flex flex-wrap items-center gap-5">
              {output.equivalents.map((eq) => (
                <li key={`${eq.n}-${eq.d}`}>
                  <FractionDisplay value={eq} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Simplifying it</h3>
            <ol className="steps">
              {output.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}
