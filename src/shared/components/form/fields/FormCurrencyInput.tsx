import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { CurrencyInput } from '@/shared/components/ui/currency-input'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  placeholder?: string
  requiredMark?: boolean
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export function FormCurrencyInput({
  name,
  label,
  hint,
  icon,
  requiredMark,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled,
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  const currencyEl = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value =
          typeof field.value === 'number' && !Number.isNaN(field.value)
            ? field.value
            : min
        return (
          <CurrencyInput
            ref={field.ref}
            id={name}
            value={value}
            onChange={field.onChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(icon && 'pl-9')}
          />
        )
      }}
    />
  )

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      {icon ? (
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          {currencyEl}
        </div>
      ) : (
        currencyEl
      )}
    </Field>
  )
}
