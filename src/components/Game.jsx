import { useEffect, useId, useRef, useState } from 'react'
import { explain, equals, formatFraction, isSimplest, simplify, speakFraction } from '../lib/fraction.js'
import { parseFractionInput } from '../lib/sanitize.js'
import {
  MAX_LEVEL,
  MAX_QUESTIONS,
  START_LEVEL,
  freshQuestion,
  generateQuestion,
  nextLevel,
} from '../lib/questionGenerator.js'
import FractionInput from './FractionInput.jsx'
import { Equation } from './FractionDisplay.jsx'
import ScoreTracker from './ScoreTracker.jsx'

const EMPTY_ANSWER = { numerator: '', denominator: '' }

function summaryMessage(score) {
  if (score >= 9) return 'Outstanding. You have this skill down.'
  if (score >= 7) return 'Great work. A little more practice and it will be automatic.'
  if (score >= 4) return 'Good effort. Revisit the lesson tips, then try again.'
  return 'Every question is practice. Read through the examples and give it another go.'
}

/**
 * Adaptive 10-question game. Right answer → next question one level harder.
 * Wrong answer → next question one level easier.
 */
export default function Game({ op, rng = Math.random, onFinish }) {
  const [level, setLevel] = useState(START_LEVEL)
  const [question, setQuestion] = useState(() => generateQuestion(op, START_LEVEL, rng))
  const [history, setHistory] = useState([])
  const [answer, setAnswer] = useState(EMPTY_ANSWER)
  const [phase, setPhase] = useState('asking') // 'asking' | 'feedback' | 'done'
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)

  const numeratorRef = useRef(null)
  const denominatorRef = useRef(null)
  const nextRef = useRef(null)
  const summaryRef = useRef(null)
  const focusInputNext = useRef(false)
  const errorId = useId()
  const headingId = useId()

  const score = history.filter((h) => h.correct).length
  const questionNumber = phase === 'asking' ? history.length + 1 : history.length
  const isLastQuestion = history.length >= MAX_QUESTIONS

  useEffect(() => {
    if (phase === 'feedback') nextRef.current?.focus()
    else if (phase === 'done') summaryRef.current?.focus()
    else if (focusInputNext.current) {
      focusInputNext.current = false
      numeratorRef.current?.focus()
    }
  }, [phase, question])

  useEffect(() => {
    if (phase === 'done') onFinish?.(score)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function handleSubmit(e) {
    e.preventDefault()
    if (phase !== 'asking') return
    const parsed = parseFractionInput(answer.numerator, answer.denominator)
    if (!parsed.ok) {
      setError(parsed)
      ;(parsed.field === 'denominator' ? denominatorRef : numeratorRef).current?.focus()
      return
    }
    setError(null)
    const correct = equals(parsed.value, question.answer)
    setHistory((h) => [...h, { correct, level: question.level }])
    setFeedback({ correct, given: parsed.value, canSimplify: correct && !isSimplest(parsed.value) })
    setPhase('feedback')
  }

  function handleNext() {
    if (isLastQuestion) {
      setPhase('done')
      return
    }
    const newLevel = nextLevel(level, feedback.correct)
    setLevel(newLevel)
    setQuestion((prev) => freshQuestion(op, newLevel, rng, prev))
    setAnswer(EMPTY_ANSWER)
    setFeedback(null)
    focusInputNext.current = true
    setPhase('asking')
  }

  function restart() {
    setLevel(START_LEVEL)
    setQuestion(generateQuestion(op, START_LEVEL, rng))
    setHistory([])
    setAnswer(EMPTY_ANSWER)
    setFeedback(null)
    setError(null)
    focusInputNext.current = true
    setPhase('asking')
  }

  if (phase === 'done') {
    const highest = Math.max(...history.map((h) => h.level))
    return (
      <div className="space-y-4">
        <ScoreTracker history={history} level={level} currentIndex={-1} />
        <section aria-labelledby={headingId} className="panel p-6 text-center sm:p-8">
          <h2 id={headingId} ref={summaryRef} tabIndex={-1} className="text-3xl font-semibold focus:outline-none">
            Game finished
          </h2>
          <p className="mt-4 font-serif text-5xl font-semibold text-accent">
            {score} out of {MAX_QUESTIONS}
          </p>
          <p className="mt-3 text-lg">{summaryMessage(score)}</p>
          <p className="mt-1 text-muted">Highest level reached: {highest} of {MAX_LEVEL}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={restart} className="btn-primary">Play again</button>
            <a href="#/games" className="btn-secondary">Choose another game</a>
          </div>
        </section>
      </div>
    )
  }

  let levelNote = ''
  if (feedback && !isLastQuestion) {
    const upcoming = nextLevel(level, feedback.correct)
    if (feedback.correct) {
      levelNote = upcoming > level ? 'The next question will be a little harder.' : "You're at the top level. Keep it going."
    } else {
      levelNote = upcoming < level ? 'The next question will be a little easier.' : "Here's another one at this level."
    }
  }

  return (
    <div className="space-y-4">
      <ScoreTracker history={history} level={level} currentIndex={phase === 'asking' ? history.length : -1} />

      <section aria-labelledby={headingId} className="panel p-5 sm:p-6">
        <h2 id={headingId} className="text-2xl font-semibold">
          Question {questionNumber} of {MAX_QUESTIONS}
        </h2>
        <p className="mt-1 text-muted">Solve it and type your answer. Equivalent answers count; simplest form is best.</p>

        <div className="mt-5">
          <Equation a={question.a} op={op} b={question.b} result="?" size="lg" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <div className="flex flex-wrap items-end gap-4">
            <FractionInput
              label="Answer"
              value={answer}
              onChange={(v) => {
                setAnswer(v)
                if (error) setError(null)
              }}
              numeratorRef={numeratorRef}
              denominatorRef={denominatorRef}
              invalidField={error?.field ?? null}
              describedBy={error ? errorId : undefined}
              disabled={phase !== 'asking'}
            />
            <button type="submit" className="btn-primary" disabled={phase !== 'asking'}>
              Check answer
            </button>
          </div>
          {error && (
            <p id={errorId} role="alert" className="mt-3 rounded-lg bg-gentle-soft px-3 py-2 font-bold text-gentle">
              {error.error}
            </p>
          )}
        </form>

        <div role="status" aria-live="polite" aria-atomic="true">
          {feedback && (
            <div
              className={`mt-5 rounded-xl border-2 p-4 ${
                feedback.correct ? 'border-good/40 bg-good-soft text-good' : 'border-gentle/40 bg-gentle-soft text-gentle'
              }`}
            >
              {feedback.correct ? (
                <p className="font-bold">
                  Correct! {formatFraction(feedback.given)} is right.
                  {feedback.canSimplify && ` It simplifies to ${formatFraction(simplify(feedback.given))}.`}
                </p>
              ) : (
                <p className="font-bold">
                  Not quite. The answer is {formatFraction(question.answer)}
                  <span className="sr-only"> ({speakFraction(question.answer)})</span>.
                </p>
              )}
              {levelNote && <p className="mt-1 text-ink">{levelNote}</p>}
            </div>
          )}
        </div>

        {feedback && !feedback.correct && (
          <details className="mt-3 rounded-xl border border-line p-4">
            <summary className="cursor-pointer font-bold">See how to solve it</summary>
            <ol className="steps">
              {explain(op, question.a, question.b).steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </details>
        )}

        {feedback && (
          <div className="mt-5">
            <button ref={nextRef} type="button" onClick={handleNext} className="btn-primary">
              {isLastQuestion ? 'See results' : 'Next question'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

