/**
 * Format a minor-unit (cents) value into a localized currency string.
 * Defaults are USD + en-US. Pass overrides explicitly when the value is bound
 * to a different tenant/branch currency.
 */
export function formatCurrency(
  cents: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  // Zero-fraction currencies (e.g. JPY) have no minor units — render whole
  // numbers so we don't show "¥1,234.56" for an integer value from the API.
  const isZeroFraction = currency === 'JPY'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(isZeroFraction
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : {}),
  }).format(cents / (isZeroFraction ? 1 : 100))
}
