import { useId } from 'react'
import { MAX_DIGITS, sanitizeInteger } from '../lib/sanitize.js'

/**
 * Two stacked whole-number boxes. Every keystroke and paste is sanitized to digits only.
 * value = { numerator: string, denominator: string }
 */
export default function FractionInput({
  label,
  value,
  onChange,
  numeratorRef,
  denominatorRef,
  invalidField = null,
  describedBy,
  disabled = false,
}) {
  const id = useId()
  const common = {
    type: 'text',
    inputMode: 'numeric',
    pattern: '[0-9]*',
    autoComplete: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    maxLength: MAX_DIGITS,
    className: 'frac-input',
    'aria-describedby': describedBy,
  }

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-1 text-sm font-bold text-muted">{label}</legend>
      <div className="flex flex-col items-center gap-1.5">
        <label htmlFor={`${id}-n`} className="sr-only">{`${label} numerator`}</label>
        <input
          {...common}
          id={`${id}-n`}
          ref={numeratorRef}
          value={value.numerator}
          aria-invalid={invalidField === 'numerator'}
          onChange={(e) => onChange({ ...value, numerator: sanitizeInteger(e.target.value) })}
        />
        <span aria-hidden="true" className="h-0.5 w-16 rounded bg-ink" />
        <label htmlFor={`${id}-d`} className="sr-only">{`${label} denominator`}</label>
        <input
          {...common}
          id={`${id}-d`}
          ref={denominatorRef}
          value={value.denominator}
          aria-invalid={invalidField === 'denominator'}
          onChange={(e) => onChange({ ...value, denominator: sanitizeInteger(e.target.value) })}
        />
      </div>
    </fieldset>
  )
}
