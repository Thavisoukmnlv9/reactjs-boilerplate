export function formatThousands(
  value: number | string,
  decimals?: number
): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value

  if (Number.isNaN(num)) return String(value)

  return decimals !== undefined
    ? num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : num.toLocaleString()
}
