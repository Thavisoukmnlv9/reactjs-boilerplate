import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback } from 'react'

import { currentLocale, syncLanguage } from '@/app/i18n/language-sync'
import { codeToTag, LANGUAGES, type SupportedLocale } from '@/config/languages'
import { tokenStorage } from '@/core/access'
import {
  type MePreferences,
  useUpdateMePreferencesMutation,
} from '@/modules/platform/me/api/preferences-queries'

/**
 * The single write-path for changing language. Picking a language:
 *   1. writes `?lang=` to the URL — the read-model, retained across navigation;
 *   2. applies it to i18next (which caches it to localStorage); and
 *   3. persists it to server preferences when the user is authenticated.
 *
 * Safe on both guest and authenticated pages: the server write is token-gated.
 */
export function useLanguage() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { lang?: SupportedLocale }
  const update = useUpdateMePreferencesMutation()

  const active = search.lang ?? currentLocale()

  const setLanguage = useCallback(
    (code: SupportedLocale) => {
      void navigate({
        to: '.',
        search: (prev: Record<string, unknown>) => ({ ...prev, lang: code }),
        replace: true,
      })
      syncLanguage(code)
      if (tokenStorage.getAccessToken()) {
        update.mutate({ locale: codeToTag(code) } satisfies Partial<MePreferences>)
      }
    },
    [navigate, update]
  )

  return { active, languages: LANGUAGES, setLanguage, isPending: update.isPending }
}
