import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { NumberInput } from '@/shared/components/ui/number-Input'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  className?: string
}

export function FormPercentage({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  min = 0,
  max = 100,
  step = 0.01,
  className,
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value =
            typeof field.value === 'number' && !Number.isNaN(field.value)
              ? field.value
              : min
          return (
            <div className="relative w-full">
              <NumberInput
                ref={field.ref}
                id={name}
                value={value}
                onChange={field.onChange}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                className={cn('pr-9', className)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                %
              </span>
            </div>
          )
        }}
      />
    </Field>
  )
}
