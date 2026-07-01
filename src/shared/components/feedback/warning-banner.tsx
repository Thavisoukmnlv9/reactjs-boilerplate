import { AlertTriangle } from 'lucide-react'
import { cn } from '@/core/utils/cn'

export function WarningBanner({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  )
}
