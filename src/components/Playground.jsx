import { useId, useState } from 'react'
import { OPS, explain, formatFraction, speakFraction } from '../lib/fraction.js'
import { parseFractionInput } from '../lib/sanitize.js'
import { generateQuestion } from '../lib/questionGenerator.js'
import FractionInput from './FractionInput.jsx'
import FractionBar from './FractionBar.jsx'
import { Equation } from './FractionDisplay.jsx'
import { ShuffleIcon } from './Icons.jsx'

const DEFAULTS = {
  add: [{ numerator: '1', denominator: '2' }, { numerator: '1', denominator: '3' }],
  subtract: [{ numerator: '3', denominator: '4' }, { numerator: '1', denominator: '6' }],
  multiply: [{ numerator: '2', denominator: '3' }, { numerator: '3', denominator: '4' }],
  divide: [{ numerator: '3', denominator: '4' }, { numerator: '1', denominator: '8' }],
}

function solve(op, rawA, rawB) {
  const pa = parseFractionInput(rawA.numerator, rawA.denominator)
  if (!pa.ok) return { error: `First fraction: ${pa.error}`, which: 'a', field: pa.field }
  const pb = parseFractionInput(rawB.numerator, rawB.denominator)
  if (!pb.ok) return { error: `Second fraction: ${pb.error}`, which: 'b', field: pb.field }
  if (op === 'divide' && pb.value.n === 0) {
    return { error: "You can't divide by zero. Give the second fraction a top number bigger than 0.", which: 'b', field: 'numerator' }
  }
  const { steps, result } = explain(op, pa.value, pb.value)
  return { a: pa.value, b: pb.value, steps, result }
}

export default function Playground({ op }) {
  const [a, setA] = useState(DEFAULTS[op][0])
  const [b, setB] = useState(DEFAULTS[op][1])
  const [output, setOutput] = useState(() => solve(op, DEFAULTS[op][0], DEFAULTS[op][1]))
  const headingId = useId()
  const errorId = useId()

  function handleSubmit(e) {
    e.preventDefault()
    setOutput(solve(op, a, b))
  }

  function randomize() {
    const q = generateQuestion(op, 1 + Math.floor(Math.random() * 5))
    const nextA = { numerator: String(q.a.n), denominator: String(q.a.d) }
    const nextB = { numerator: String(q.b.n), denominator: String(q.b.d) }
    setA(nextA)
    setB(nextB)
    setOutput(solve(op, nextA, nextB))
  }

  const error = output.error
  const showBars = !error && (op === 'add' || op === 'subtract')

  return (
    <section aria-labelledby={headingId} className="panel p-5">
      <h2 id={headingId} className="text-2xl font-semibold">Playground</h2>
      <p className="mt-1 text-muted">
        Type any two fractions and select Solve (or press Enter). Use 1 on the bottom for a whole number.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <div className="flex flex-wrap items-center gap-4">
          <FractionInput
            label="First fraction"
            value={a}
            onChange={setA}
            invalidField={output.which === 'a' ? output.field : null}
            describedBy={error ? errorId : undefined}
          />
          <span aria-hidden="true" className="mt-6 font-serif text-3xl text-muted">{OPS[op].symbol}</span>
          <FractionInput
            label="Second fraction"
            value={b}
            onChange={setB}
            invalidField={output.which === 'b' ? output.field : null}
            describedBy={error ? errorId : undefined}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" className="btn-primary">Solve</button>
          <button type="button" onClick={randomize} className="btn-secondary">
            <ShuffleIcon className="h-4 w-4" />
            Random problem
          </button>
        </div>
      </form>

      <div role="status" aria-live="polite" className="mt-5">
        {error ? (
          <p id={errorId} className="rounded-lg bg-gentle-soft px-3 py-2 font-bold text-gentle">{error}</p>
        ) : (
          <p className="font-bold">
            Answer: {formatFraction(output.result)}
            <span className="sr-only"> ({speakFraction(output.result)})</span>
          </p>
        )}
      </div>

      {!error && (
        <div className="mt-4 space-y-4">
          <Equation a={output.a} op={op} b={output.b} result={output.result} />
          {showBars && (
            <div className="grid gap-3 sm:grid-cols-3">
              <FractionBar value={output.a} label="First fraction" />
              <FractionBar value={output.b} label="Second fraction" />
              <FractionBar value={output.result} label="Answer" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">How it works</h3>
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
