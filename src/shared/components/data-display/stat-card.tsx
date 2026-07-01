import type { ReactNode } from 'react'
import { cn } from '@/core/utils/cn'
import { Card, CardContent } from '@/shared/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2 flex items-end gap-2">
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <span
              className={cn(
                'text-sm font-medium mb-1',
                trend.value >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
