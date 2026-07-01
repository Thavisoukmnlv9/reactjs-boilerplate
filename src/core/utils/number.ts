export function formatNumber(n: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(n)
}

export function formatPercent(n: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
  }).format(n / 100)
}
