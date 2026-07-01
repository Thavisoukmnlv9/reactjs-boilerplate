/**
 * `<FormPercentBps>` — percentage input bound to a basis-points field.
 *
 * Backend stores tax rates / discount rates / service-fee rates as **basis points**
 * (integer 0–10000 = 0–100%). The form field works with the human-friendly percent
 * (0–100, two decimals); this component converts at the edge so the form value sent
 * to the API is the integer bps the backend expects.
 *
 * Usage:
 *
 *   <FormPercentBps name="rate_bps" label="VAT rate" hint="0–100%" />
 *
 *   // schema treats the form value as basis points:
 *   z.coerce.number().int().min(0).max(10000)
 */

import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { NumberInput } from '@/shared/components/ui/number-Input'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

export type FormPercentBpsProps = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Minimum percent value. Defaults to 0. */
  minPercent?: number
  /** Maximum percent value. Defaults to 100. */
  maxPercent?: number
  /** Step in percent. Defaults to 0.01 (1 basis point). */
  stepPercent?: number
  className?: string
}

export const bpsToPercent = (bps: number): number =>
  Number.isFinite(bps) ? Math.round(bps) / 100 : 0

export const percentToBps = (pct: number): number =>
  Number.isFinite(pct) ? Math.round(pct * 100) : 0

export function FormPercentBps({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  minPercent = 0,
  maxPercent = 100,
  stepPercent = 0.01,
  className,
}: FormPercentBpsProps) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const bpsValue =
            typeof field.value === 'number' && !Number.isNaN(field.value)
              ? field.value
              : percentToBps(minPercent)
          const percent = bpsToPercent(bpsValue)
          return (
            <div className="relative w-full">
              <NumberInput
                ref={field.ref}
                id={name}
                value={percent}
                onChange={(next: number) => field.onChange(percentToBps(next))}
                min={minPercent}
                max={maxPercent}
                step={stepPercent}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                className={cn('pr-9', className)}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">
                %
              </span>
            </div>
          )
        }}
      />
    </Field>
  )
}
