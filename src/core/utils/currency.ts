/**
 * Format a Decimal-style cents value into a localized currency string.
 * Defaults are LAK + lo-LA (matches platform brief). Pass overrides explicitly
 * when the value is bound to a different tenant/branch currency.
 */
export function formatCurrency(
  cents: number,
  currency = 'LAK',
  locale = 'lo-LA'
): string {
  // LAK has no minor units. Force fractionDigits = 0 so we don't render
  // "₭1,234.56" for an integer kip value coming back from the API.
  const isZeroFraction = currency === 'LAK' || currency === 'JPY'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(isZeroFraction
      ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      : {}),
  }).format(cents / (isZeroFraction ? 1 : 100))
}
