import { describe, expect, it } from 'vitest'
import { parseFractionInput, sanitizeInteger } from './sanitize.js'

describe('sanitizeInteger', () => {
  it('keeps only digits', () => {
    expect(sanitizeInteger('12abc')).toBe('12')
    expect(sanitizeInteger(' 3 ')).toBe('3')
  })

  it('strips markup and script injection attempts', () => {
    const out = sanitizeInteger('<img src=x onerror=alert(1)>7')
    expect(out).toBe('17')
    expect(out).not.toMatch(/[<>"'=()]/)
    expect(sanitizeInteger('"><script>alert(2)</script>')).toBe('2')
  })

  it('converts full-width digits and drops signs and decimals', () => {
    expect(sanitizeInteger('１２')).toBe('12')
    expect(sanitizeInteger('-5')).toBe('5')
    expect(sanitizeInteger('1.5')).toBe('15')
  })

  it('limits the length', () => {
    expect(sanitizeInteger('123456789')).toBe('1234')
  })

  it('handles non-string values', () => {
    expect(sanitizeInteger(null)).toBe('')
    expect(sanitizeInteger(undefined)).toBe('')
    expect(sanitizeInteger(42)).toBe('42')
  })
})

describe('parseFractionInput', () => {
  it('parses a valid fraction', () => {
    expect(parseFractionInput('3', '4')).toEqual({ ok: true, value: { n: 3, d: 4 } })
  })

  it('explains what is missing', () => {
    expect(parseFractionInput('', '4')).toMatchObject({ ok: false, field: 'numerator' })
    expect(parseFractionInput('3', '')).toMatchObject({ ok: false, field: 'denominator' })
  })

  it('rejects a zero denominator', () => {
    expect(parseFractionInput('3', '0')).toMatchObject({ ok: false, field: 'denominator' })
  })

  it('sanitizes before parsing', () => {
    expect(parseFractionInput('<b>3</b>', '4;DROP')).toEqual({ ok: true, value: { n: 3, d: 4 } })
  })
})
