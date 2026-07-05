import i18next from 'i18next'

import { DEFAULT_LOCALE, toSupportedLocale, type SupportedLocale } from '@/config/languages'

/** The active i18next language, narrowed to a supported base code. */
export function currentLocale(): SupportedLocale {
  return toSupportedLocale(i18next.language) ?? DEFAULT_LOCALE
}

/**
 * Apply `lang` to i18next when it differs from the active language. Resources are
 * bundled, so this resolves synchronously; the language detector caches the
 * choice to localStorage, so URL-driven changes persist for the next visit with
 * no extra code. Unsupported values are ignored (the caller keeps its state).
 */
export function syncLanguage(lang: string | undefined | null): void {
  const next = toSupportedLocale(lang ?? undefined)
  if (next && next !== currentLocale()) {
    void i18next.changeLanguage(next)
  }
}
