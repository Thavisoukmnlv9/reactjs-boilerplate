import { useNavigate, useSearch } from '@tanstack/react-router'
import i18next from 'i18next'
import { Check, Globe } from 'lucide-react'
import type { SupportedLang } from '@/routes/__root'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface LangChoice {
  /** Short i18next code used by `i18n.changeLanguage`. */
  i18nCode: SupportedLang
  label: string
}

const CHOICES: LangChoice[] = [
  { i18nCode: 'en', label: 'English' },
  { i18nCode: 'lo', label: 'ລາວ (Lao)' },
  { i18nCode: 'th', label: 'ไทย (Thai)' },
  { i18nCode: 'zh', label: '中文 (Chinese)' },
  { i18nCode: 'vi', label: 'Tiếng Việt (Vietnamese)' },
]

/**
 * Auth-free language switcher for guest pages (login, password reset, etc.).
 *
 * Mirrors the topbar `LanguageSwitcher` but skips the `/me/preferences` call,
 * which requires authentication. The choice is reflected in the URL `?lang=`
 * (kept across navigations by `retainSearchParams` on the root route).
 */
export function GuestLanguageSwitcher() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { lang?: SupportedLang }

  const activeI18nCode: SupportedLang =
    search.lang ?? ((i18next.language as SupportedLang) || 'en')

  function pick(choice: LangChoice) {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, lang: choice.i18nCode }),
      replace: true,
    })
    if (i18next.language !== choice.i18nCode) {
      void i18next.changeLanguage(choice.i18nCode)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CHOICES.map((c) => {
          const isActive = c.i18nCode === activeI18nCode
          return (
            <DropdownMenuItem
              key={c.i18nCode}
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
