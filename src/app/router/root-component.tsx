import { Outlet, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'

import { syncLanguage } from '@/app/i18n/language-sync'
import { tagToCode, type SupportedLocale } from '@/config/languages'
import { useMePreferencesQuery } from '@/modules/platform/me/api/preferences-queries'

/**
 * Keeps i18next in step with the URL `?lang=` reactively (covering back/forward
 * within a route), and applies the authenticated user's saved locale as a
 * fallback when the URL omits `lang`.
 *
 * Precedence: URL `?lang=` > server `/me/preferences.locale` (once loaded) >
 * localStorage > navigator > default — the last three are handled by the
 * i18next language detector at init. The root `beforeLoad` already applies the
 * URL lang before first paint; this effect covers subsequent client updates.
 */
function LanguageSync() {
  const { lang } = useSearch({ strict: false }) as { lang?: SupportedLocale }
  const prefs = useMePreferencesQuery()
  const serverLocale = prefs.data?.locale

  useEffect(() => {
    if (lang) syncLanguage(lang)
  }, [lang])

  useEffect(() => {
    if (!lang && serverLocale) syncLanguage(tagToCode(serverLocale))
  }, [lang, serverLocale])

  return null
}

/** Root route element: the routed page plus the language-sync side effect. */
export function RootComponent() {
  return (
    <>
      <Outlet />
      <LanguageSync />
    </>
  )
}
