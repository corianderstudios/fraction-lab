import { explain, explainSimplify } from '../lib/fraction.js'
import { Equation, FractionDisplay } from './FractionDisplay.jsx'
import FractionBar from './FractionBar.jsx'

export function ExampleCard({ number, op, a, b }) {
  const { steps, result } = explain(op, a, b)
  const headingId = `example-${op}-${number}`
  return (
    <article aria-labelledby={headingId} className="panel p-5">
      <h3 id={headingId} className="text-lg font-semibold">Example {number}</h3>
      <div className="mt-3">
        <Equation a={a} op={op} b={b} result={result} />
      </div>
      <ol className="steps">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </article>
  )
}

export function SimplifyExampleCard({ number, value }) {
  const { steps, result } = explainSimplify(value)
  const headingId = `example-basics-${number}`
  return (
    <article aria-labelledby={headingId} className="panel p-5">
      <h3 id={headingId} className="text-lg font-semibold">Example {number}: simplify</h3>
      <p className="mt-3 flex items-center gap-3">
        <FractionDisplay value={value} />
        <span aria-hidden="true" className="font-serif text-2xl text-muted">=</span>
        <span className="sr-only"> equals </span>
        <FractionDisplay value={result} className="font-semibold text-accent" />
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <FractionBar value={value} label={`${value.n}/${value.d}`} />
        {result.d !== 1 && <FractionBar value={result} label={`${result.n}/${result.d}`} />}
      </div>
      <ol className="steps">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </article>
  )
}
