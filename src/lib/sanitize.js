// Every field a user can type into is a whole-number box, so we keep a strict allow-list:
// digits only, short length. Anything else (tags, quotes, scripts, emoji…) is dropped.
// React also escapes all rendered text, and we never use dangerouslySetInnerHTML.

import { frac } from './fraction.js'

export const MAX_DIGITS = 4

export function sanitizeInteger(raw, maxLength = MAX_DIGITS) {
  const text = typeof raw === 'string' ? raw : raw == null ? '' : String(raw)
  // NFKC turns look-alike characters (e.g. full-width "１２") into plain digits first.
  return text.normalize('NFKC').replace(/[^0-9]/g, '').slice(0, maxLength)
}

export function toSafeInt(str) {
  if (!/^[0-9]+$/.test(str)) return null
  const n = Number.parseInt(str, 10)
  return Number.isSafeInteger(n) ? n : null
}

/**
 * Turns the two raw input strings into a fraction.
 * Returns { ok: true, value } or { ok: false, error, field }.
 */
export function parseFractionInput(rawNumerator, rawDenominator) {
  const nStr = sanitizeInteger(rawNumerator)
  const dStr = sanitizeInteger(rawDenominator)
  if (nStr === '') return { ok: false, field: 'numerator', error: 'Enter a numerator (the top number).' }
  if (dStr === '') {
    return { ok: false, field: 'denominator', error: 'Enter a denominator (the bottom number). Use 1 for a whole number.' }
  }
  const n = toSafeInt(nStr)
  const d = toSafeInt(dStr)
  if (n === null) return { ok: false, field: 'numerator', error: 'Use a whole number for the numerator.' }
  if (d === null) return { ok: false, field: 'denominator', error: 'Use a whole number for the denominator.' }
  if (d === 0) {
    return { ok: false, field: 'denominator', error: "The denominator can't be 0. A whole can't be split into zero parts." }
  }
  return { ok: true, value: frac(n, d) }
}
