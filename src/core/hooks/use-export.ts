import { downloadCsv } from '@/core/utils/download'

export function useExport() {
  const exportCsv = (filename: string, rows: Record<string, unknown>[]) => {
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')
      ),
    ].join('\n')
    downloadCsv(filename, csv)
  }
  return { exportCsv }
}
