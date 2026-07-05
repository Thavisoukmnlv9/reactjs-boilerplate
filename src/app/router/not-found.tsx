import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function NotFound() {
  const { t } = useTranslation('common')
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-muted-foreground text-sm font-medium">{t('notFound.code')}</p>
      <h1 className="text-2xl font-semibold">{t('notFound.title')}</h1>
      <Button asChild>
        <Link to="/">{t('notFound.home')}</Link>
      </Button>
    </div>
  )
}
