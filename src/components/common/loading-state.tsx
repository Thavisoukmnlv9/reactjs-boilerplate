import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />
}

export function LoadingState({ label, className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex items-center justify-center gap-2 p-10 text-sm',
        className,
      )}
    >
      <Spinner />
      {label ?? 'Loading…'}
    </div>
  )
}
