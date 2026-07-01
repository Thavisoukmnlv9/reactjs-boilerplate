import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { appConfig } from '@/config/app-config'

const LABELS: Record<string, string> = { en: 'English', lo: 'ລາວ' }

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {appConfig.supportedLocales.map((lng) => (
          <DropdownMenuItem key={lng} onClick={() => void i18n.changeLanguage(lng)}>
            {LABELS[lng] ?? lng}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
