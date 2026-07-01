import { downloadCsv } from '@/core/utils/download'

/** RFC-4180 cell escaping. */
function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export type CsvColumn<T> = {
  header: string
  value: (item: T) => unknown
}

export function rowsToCsv<T>(items: T[], columns: CsvColumn<T>[]): string {
  const lines: string[] = [
    columns.map((c) => escapeCsvCell(c.header)).join(','),
  ]
  for (const item of items) {
    lines.push(columns.map((c) => escapeCsvCell(c.value(item))).join(','))
  }
  return lines.join('\n')
}

/** Build CSV from a column map and trigger a dated download. */
export function downloadRowsCsv<T>(
  filenamePrefix: string,
  items: T[],
  columns: CsvColumn<T>[]
): void {
  const csv = rowsToCsv(items, columns)
  const today = new Date().toISOString().slice(0, 10)
  downloadCsv(`${filenamePrefix}-${today}.csv`, csv)
}
