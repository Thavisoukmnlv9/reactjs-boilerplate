import type React from 'react'
import { Label } from '@/shared/components/ui/label'
import { useFieldError } from '../core/useFieldError'
import { cx } from '../utils/cx'
import { toErrorMessage } from '../utils/error'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  children: React.ReactNode
}

export function Field({
  name,
  label,
  hint,
  requiredMark,
  className,
  children,
}: Props) {
  const err = useFieldError(name)
  return (
    <div className={cx('w-full', className)}>
      {label && (
        <Label htmlFor={name} className="mb-1 block font-medium text-sm">
          {label}
          {requiredMark ? <span className="text-red-600"> *</span> : null}
        </Label>
      )}
      {children}
      {!err && hint ? (
        <p className="mt-1 text-muted-foreground text-xs">{hint}</p>
      ) : null}
      {err ? (
        <p className="mt-1 text-red-600 text-xs">
          {toErrorMessage(
            err && typeof err === 'object' && 'message' in err
              ? (err as { message?: unknown }).message
              : undefined
          )}
        </p>
      ) : null}
    </div>
  )
}
