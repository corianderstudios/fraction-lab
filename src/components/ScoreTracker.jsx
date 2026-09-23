import { LEVEL_NAMES, MAX_LEVEL, MAX_QUESTIONS } from '../lib/questionGenerator.js'
import { CheckIcon } from './Icons.jsx'

/**
 * Calm score display: correct answers are soft green, missed ones a warm sand color
 * (no red, no crosses). history = [{ correct, level }]
 */
export default function ScoreTracker({ history, level, currentIndex }) {
  const correct = history.filter((h) => h.correct).length
  return (
    <div className="panel flex flex-wrap items-center justify-between gap-4 p-4">
      <div>
        <p className="font-serif text-xl font-semibold">
          Score: {correct} of {history.length}
        </p>
        <p className="text-sm text-muted">
          Level {level} of {MAX_LEVEL}: {LEVEL_NAMES[level - 1]}
        </p>
        <div aria-hidden="true" className="mt-1.5 flex gap-1">
          {Array.from({ length: MAX_LEVEL }, (_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i < level ? 'bg-accent' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      <ol aria-label="Question results" className="flex flex-wrap gap-1.5">
        {Array.from({ length: MAX_QUESTIONS }, (_, i) => {
          const h = history[i]
          let classes = 'border-line bg-canvas'
          let text = 'not answered yet'
          if (h?.correct) {
            classes = 'border-good/50 bg-good-soft text-good'
            text = 'correct'
          } else if (h) {
            classes = 'border-gentle/40 bg-gentle-soft'
            text = 'not quite'
          } else if (i === currentIndex) {
            classes = 'border-accent bg-canvas'
            text = 'current question'
          }
          return (
            <li key={i} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${classes}`}>
              {h?.correct && <CheckIcon className="h-4 w-4" />}
              <span className="sr-only">{`Question ${i + 1}: ${text}`}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
