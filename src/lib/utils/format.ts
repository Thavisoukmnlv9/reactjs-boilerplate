import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(value: string | number | Date, pattern = 'PP'): string {
  return format(new Date(value), pattern)
}

export function formatDateTime(value: string | number | Date): string {
  return format(new Date(value), 'PPp')
}

export function fromNow(value: string | number | Date): string {
  return formatDistanceToNow(new Date(value), { addSuffix: true })
}

/** First letters of up to two words, e.g. "Ada Lovelace" -> "AL". */
export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
