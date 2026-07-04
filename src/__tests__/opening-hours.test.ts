import { describe, expect, it } from 'vitest'

import {
  defaultDaySchedule,
  formatDayLabel,
  formatTimeInput,
  isValidClockTime,
  normalizeSchedule,
  validateTimeFormat,
} from '@/shared/components/opening-hours/opening-hours-utils'

/**
 * Characterization tests for the pure opening-hours time logic extracted from
 * OpeningHoursV2 / OpeningHoursFormField. These pin the exact (including quirky)
 * behavior the components relied on inline.
 */

describe('validateTimeFormat', () => {
  it('empty string is valid (means closed)', () => {
    expect(validateTimeFormat('')).toBe(true)
  })
  it('accepts a well-formed HH:MM-HH:MM range', () => {
    expect(validateTimeFormat('09:00-18:00')).toBe(true)
    expect(validateTimeFormat('9:00-21:30')).toBe(true)
    expect(validateTimeFormat('00:00-23:59')).toBe(true)
  })
  it('rejects a single time (no range)', () => {
    expect(validateTimeFormat('09:00')).toBe(false)
  })
  it('rejects out-of-range hours/minutes', () => {
    expect(validateTimeFormat('24:00-25:00')).toBe(false)
    expect(validateTimeFormat('09:60-10:00')).toBe(false)
  })
  it('rejects garbage', () => {
    expect(validateTimeFormat('not-a-time')).toBe(false)
  })
})

describe('isValidClockTime', () => {
  it('accepts single loose clock times', () => {
    expect(isValidClockTime('9:00')).toBe(true)
    expect(isValidClockTime('21:30')).toBe(true)
  })
  it('rejects strings without a colon or with wrong minute length', () => {
    expect(isValidClockTime('0900')).toBe(false)
    expect(isValidClockTime('9:0')).toBe(false)
  })
  it('rejects a full range', () => {
    // Regex is not anchored to reject trailing range, but requires start-only
    expect(isValidClockTime('09:00-18:00')).toBe(false)
  })
})

describe('formatTimeInput', () => {
  it('empty input stays empty', () => {
    expect(formatTimeInput('')).toBe('')
  })

  it('single one/two digit hours are left untouched', () => {
    expect(formatTimeInput('9')).toBe('9')
    expect(formatTimeInput('09')).toBe('09')
  })

  it('single time with existing colon is normalized to HH:MM', () => {
    expect(formatTimeInput('09:00')).toBe('09:00')
    expect(formatTimeInput('9:5')).toBe('9:5')
    expect(formatTimeInput('09:0000')).toBe('09:00') // minutes truncated to 2
  })

  it('four bare digits WITHOUT a colon are NOT auto-colonized (single form)', () => {
    // Only the range branch inserts a colon into a 4-digit chunk.
    expect(formatTimeInput('0900')).toBe('0900')
  })

  it('strips characters outside [digit : -]', () => {
    expect(formatTimeInput('ab09:00')).toBe('09:00')
    expect(formatTimeInput('09h00')).toBe('0900')
  })

  it('formats a bare-digit range by inserting colons', () => {
    expect(formatTimeInput('0900-1800')).toBe('09:00-18:00')
  })

  it('leaves an already-colonized range unchanged', () => {
    expect(formatTimeInput('09:00-18:00')).toBe('09:00-18:00')
  })

  it('preserves the short-hours / trailing-colon quirk for "9-18"', () => {
    // start "9" (<2 chars) untouched; end "18" gets colon + empty minutes.
    expect(formatTimeInput('9-18')).toBe('9-18:')
  })

  it('range with mixed formatting', () => {
    expect(formatTimeInput('09:00-1800')).toBe('09:00-18:00')
  })
})

describe('formatDayLabel', () => {
  it('capitalizes the first three letters', () => {
    expect(formatDayLabel('monday')).toBe('Mon')
    expect(formatDayLabel('tuesday')).toBe('Tue')
    expect(formatDayLabel('mon')).toBe('Mon')
  })
  it('handles a short day key', () => {
    expect(formatDayLabel('fr')).toBe('Fr')
  })
})

describe('defaultDaySchedule', () => {
  it('uses 10:00/21:00 defaults', () => {
    expect(defaultDaySchedule()).toEqual({
      open: '10:00',
      close: '21:00',
      is_closed: false,
    })
  })
  it('accepts custom open/close', () => {
    expect(defaultDaySchedule('08:00', '17:00')).toEqual({
      open: '08:00',
      close: '17:00',
      is_closed: false,
    })
  })
})

describe('normalizeSchedule', () => {
  const days = ['mon', 'tue', 'wed'] as const

  it('fills absent days with a default open schedule', () => {
    const out = normalizeSchedule(days, {}, '10:00', '21:00')
    expect(out).toEqual({
      mon: { open: '10:00', close: '21:00', is_closed: false },
      tue: { open: '10:00', close: '21:00', is_closed: false },
      wed: { open: '10:00', close: '21:00', is_closed: false },
    })
  })

  it('fills partial day values with defaults for missing fields', () => {
    const out = normalizeSchedule(
      days,
      { mon: { open: '08:00' }, tue: { is_closed: true } },
      '10:00',
      '21:00'
    )
    expect(out.mon).toEqual({ open: '08:00', close: '21:00', is_closed: false })
    expect(out.tue).toEqual({ open: '10:00', close: '21:00', is_closed: true })
    expect(out.wed).toEqual({ open: '10:00', close: '21:00', is_closed: false })
  })

  it('respects an explicit is_closed=false and provided times', () => {
    const out = normalizeSchedule(
      ['mon'],
      { mon: { open: '07:30', close: '15:45', is_closed: false } },
      '10:00',
      '21:00'
    )
    expect(out.mon).toEqual({
      open: '07:30',
      close: '15:45',
      is_closed: false,
    })
  })

  it('only includes the requested days', () => {
    const out = normalizeSchedule(
      ['mon'],
      { mon: {}, tue: { open: '09:00' } },
      '10:00',
      '21:00'
    )
    expect(Object.keys(out)).toEqual(['mon'])
  })
})
