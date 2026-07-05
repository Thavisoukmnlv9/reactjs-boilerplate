import { Check, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '@/shared/hooks/use-language'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

/**
 * The single language switcher, for both guest and authenticated pages.
 *
 * Reads the active language and writes changes through `useLanguage()`, which
 * keeps the URL `?lang=`, i18next, and (when authenticated) server preferences
 * in sync. Language definitions come from `@/config/languages` — the one place
 * languages are declared.
 */
export function LanguageSwitcher() {
  const { t } = useTranslation('common')
  const { active, languages, setLanguage, isPending } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('language')} disabled={isPending}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            lang={l.code}
            onClick={() => setLanguage(l.code)}
            className="flex items-center justify-between gap-3"
          >
            <span>{l.label}</span>
            {l.code === active ? <Check className="h-3.5 w-3.5" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
