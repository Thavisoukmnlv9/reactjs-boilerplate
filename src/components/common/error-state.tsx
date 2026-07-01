import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title, message, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation('common')
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center',
        className,
      )}
    >
      <div className="bg-destructive/10 flex size-11 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title ?? t('states.error')}</p>
        {message ? <p className="text-muted-foreground text-sm">{message}</p> : null}
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('actions.retry')}
        </Button>
      ) : null}
    </div>
  )
}
