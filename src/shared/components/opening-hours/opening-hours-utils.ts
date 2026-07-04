/**
 * Pure time-range parsing / validation / normalization for the opening-hours
 * components. No React, no DOM — extracted verbatim from `OpeningHoursV2` and
 * `OpeningHoursFormField` so the algorithms can be unit-tested in isolation.
 */

export interface OpeningHoursDayValue {
  open: string
  close: string
  is_closed: boolean
}

export type OpeningHoursSchedule = Record<string, OpeningHoursDayValue>

export type OpeningHoursScheduleInput = Record<
  string,
  Partial<OpeningHoursDayValue> & { is_closed?: boolean }
>

/** Matches a full `HH:MM-HH:MM` range (24h). */
export const TIME_RANGE_REGEX =
  /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

/** Matches a single loose clock time like `9:00` or `21:30`. */
export const CLOCK_TIME_REGEX = /^\d{1,2}:\d{2}$/

/**
 * Validate an `HH:MM-HH:MM` range string.
 * An empty string is considered valid (it means "closed").
 */
export function validateTimeFormat(time: string): boolean {
  if (!time) return true // Empty is valid (closed)
  return TIME_RANGE_REGEX.test(time)
}

/** Whether a single time string looks like a clock time (`\d{1,2}:\d{2}`). */
export function isValidClockTime(value: string): boolean {
  return CLOCK_TIME_REGEX.test(value)
}

/**
 * Auto-format a time input as the user types, preserving the hyphen for time
 * ranges. Inserts a colon after the hours once two digits are present.
 */
export function formatTimeInput(value: string): string {
  // Auto-format time input as user types, preserving hyphen for time ranges
  const cleaned = value.replace(/[^\d:-]/g, '')

  // Check if it contains a hyphen (time range format)
  if (cleaned.includes('-')) {
    const [startTime, endTime] = cleaned.split('-')

    // Format start time
    let formattedStart = startTime
    if (startTime.length >= 2 && !startTime.includes(':')) {
      formattedStart = startTime.slice(0, 2) + ':' + startTime.slice(2, 4)
    }

    // Format end time
    let formattedEnd = endTime
    if (endTime.length >= 2 && !endTime.includes(':')) {
      formattedEnd = endTime.slice(0, 2) + ':' + endTime.slice(2, 4)
    }

    return `${formattedStart}-${formattedEnd}`
  }

  // Single time format (no hyphen)
  const parts = cleaned.split(':')

  if (parts.length === 1 && parts[0].length <= 2) {
    return parts[0]
  }

  if (parts.length === 2) {
    const hours = parts[0].slice(0, 2)
    const minutes = parts[1].slice(0, 2)
    return `${hours}:${minutes}`
  }

  return cleaned
}

/** Short, capitalized day label (e.g. `"monday"` → `"Mon"`). */
export function formatDayLabel(day: string): string {
  const d = day.slice(0, 3)
  return d.charAt(0).toUpperCase() + d.slice(1)
}

/** Build a default open day-schedule with the given times. */
export function defaultDaySchedule(
  open = '10:00',
  close = '21:00'
): OpeningHoursDayValue {
  return { open, close, is_closed: false }
}

/**
 * Normalize a (possibly partial) schedule input into a full schedule keyed by
 * the provided `days`, filling missing `open`/`close`/`is_closed` with the
 * given defaults. Days absent from `value` become a default open schedule.
 */
export function normalizeSchedule(
  days: readonly string[],
  value: OpeningHoursScheduleInput,
  defaultOpen: string,
  defaultClose: string
): OpeningHoursSchedule {
  const next: OpeningHoursSchedule = {}
  days.forEach((day) => {
    next[day] =
      value[day] != null
        ? {
            open: value[day].open ?? defaultOpen,
            close: value[day].close ?? defaultClose,
            is_closed: value[day].is_closed ?? false,
          }
        : defaultDaySchedule(defaultOpen, defaultClose)
  })
  return next
}
