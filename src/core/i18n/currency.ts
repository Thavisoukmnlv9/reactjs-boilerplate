import * as React from 'react'

import { authStore } from '@/core/auth/auth-store'

const DEFAULT_CURRENCY = 'LAK'
const DEFAULT_LOCALE = 'lo-LA'

export function useCurrencyFormatter(): Intl.NumberFormat {
  const currency = authStore(
    (s) => s.organization?.currency ?? DEFAULT_CURRENCY
  )
  const locale = authStore((s) => s.organization?.locale ?? DEFAULT_LOCALE)
  return React.useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency }),
    [locale, currency]
  )
}

export function useFormatCurrency(): (amount: number) => string {
  const fmt = useCurrencyFormatter()
  return React.useCallback((amount: number) => fmt.format(amount), [fmt])
}
