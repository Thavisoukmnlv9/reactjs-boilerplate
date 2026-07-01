import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM d, yyyy HH:mm')
}
