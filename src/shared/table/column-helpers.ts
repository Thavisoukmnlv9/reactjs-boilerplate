import { formatCurrency } from '@/core/utils/currency'
import { formatDate } from '@/core/utils/date'

export function dateColumn<T>(key: keyof T, header: string) {
  return { key, header, render: (row: T) => formatDate(String(row[key])) }
}

export function currencyColumn<T>(key: keyof T, header: string) {
  return { key, header, render: (row: T) => formatCurrency(Number(row[key])) }
}
