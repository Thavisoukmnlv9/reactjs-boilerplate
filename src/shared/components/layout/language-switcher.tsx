import { useNavigate, useSearch } from '@tanstack/react-router'
import i18next from 'i18next'
import { Check, Globe } from 'lucide-react'
import { useEffect } from 'react'
import {
  type MePreferences,
  useMePreferencesQuery,
  useUpdateMePreferencesMutation,
} from '@/modules/platform/me/api/preferences-queries'
import type { SupportedLang } from '@/routes/__root'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface LangChoice {
  /** BCP-47 tag stored on the server (e.g. 'en-US'). */
  tag: string
  /** Short i18next code used by `i18n.changeLanguage` ('en', 'lo', 'th'). */
  i18nCode: SupportedLang
  label: string
}

const CHOICES: LangChoice[] = [
  { tag: 'en-US', i18nCode: 'en', label: 'English' },
  { tag: 'lo-LA', i18nCode: 'lo', label: 'ລາວ (Lao)' },
  { tag: 'th-TH', i18nCode: 'th', label: 'ไทย (Thai)' },
  { tag: 'zh-CN', i18nCode: 'zh', label: '中文 (Chinese)' },
  { tag: 'vi-VN', i18nCode: 'vi', label: 'Tiếng Việt (Vietnamese)' },
]

function tagToI18nCode(tag: string): string {
  return CHOICES.find((c) => c.tag === tag)?.i18nCode ?? 'en'
}

function i18nCodeToTag(code: string): string {
  return CHOICES.find((c) => c.i18nCode === code)?.tag ?? 'en-US'
}

/**
 * Topbar language switcher.
 *
 * URL `?lang=` is the active source — the root route keeps it across page
 * navigations via `retainSearchParams`. When the URL has no `lang`, we fall
 * back to the server-side `/me/preferences.locale`. Picking a language writes
 * to both URL and preferences so the choice survives reloads and devices.
 */
export function LanguageSwitcher() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { lang?: string }
  const query = useMePreferencesQuery()
  const update = useUpdateMePreferencesMutation()

  const activeI18nCode =
    search.lang ?? tagToI18nCode(query.data?.locale ?? 'en-US')
  const activeTag = i18nCodeToTag(activeI18nCode)

  useEffect(() => {
    if (search.lang) return
    if (!query.data) return
    const code = tagToI18nCode(query.data.locale)
    if (i18next.language !== code) void i18next.changeLanguage(code)
  }, [query.data, search.lang])

  function pick(choice: LangChoice) {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, lang: choice.i18nCode }),
      replace: true,
    })
    update.mutate({ locale: choice.tag } satisfies Partial<MePreferences>)
    if (i18next.language !== choice.i18nCode) {
      void i18next.changeLanguage(choice.i18nCode)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change language"
          disabled={update.isPending}
        >
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CHOICES.map((c) => {
          const isActive = c.tag === activeTag
          return (
            <DropdownMenuItem
              key={c.tag}
              onClick={() => pick(c)}
              className="flex items-center justify-between gap-3"
            >
              <span>{c.label}</span>
              {isActive ? <Check className="h-3.5 w-3.5" /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
