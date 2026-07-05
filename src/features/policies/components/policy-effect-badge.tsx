import { useTranslation } from 'react-i18next'

import { cn } from '@/core/utils/cn'
import { Badge } from '@/shared/components/ui/badge'

/**
 * The ALLOW(green)/DENY(red) effect chip. One component so the effect reads the
 * same in the table row, the form summary and the detail view — DENY is the
 * fail-secure winner, so it always shows destructive.
 */
export function PolicyEffectBadge({ effect, className }: { effect: 'ALLOW' | 'DENY'; className?: string }) {
  const { t } = useTranslation('policies')
  return (
    <Badge variant={effect === 'DENY' ? 'destructive' : 'success'} className={cn('font-medium', className)}>
      {effect === 'DENY' ? t('effect.deny') : t('effect.allow')}
    </Badge>
  )
}
