import type React from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { Switch } from '@/shared/components/ui/switch'
import { useFieldError } from '../core/useFieldError'
import { cx } from '../utils/cx'
import { toErrorMessage } from '../utils/error'

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
  className?: string
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  hint,
  icon,
  requiredMark,
  className,
}: Props<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()
  const err = useFieldError(name)

  return (
    <div className={cx('w-full', className)}>
      <div
        className={cx(
          'flex items-center justify-between gap-2 rounded-lg border bg-background py-1.5 px-3 transition-colors',
          'border-border/80 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20',
          err && 'border-destructive/50'
        )}
      >
        <label
          htmlFor={name}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
        >
          {icon ? (
            <span className="flex shrink-0 text-muted-foreground [&_svg]:size-5">
              {icon}
            </span>
          ) : null}
          <span className="min-w-0 flex-1">
            {label != null ? (
              <span className="block text-sm font-medium text-foreground">
                {label}
                {requiredMark ? (
                  <span className="text-destructive"> *</span>
                ) : null}
              </span>
            ) : null}
            {hint != null ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {hint}
              </span>
            ) : null}
          </span>
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Switch
              id={name}
              checked={!!field.value}
              onCheckedChange={(v: boolean) => field.onChange(v)}
              className="shrink-0 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
          )}
        />
      </div>
      {err ? (
        <p className="mt-1 text-xs text-destructive">
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
