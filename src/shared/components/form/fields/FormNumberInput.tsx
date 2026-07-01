import type React from 'react'
import { useEffect } from 'react'
import {
  Controller,
  type ControllerRenderProps,
  useFormContext,
} from 'react-hook-form'
import { NumberInput } from '@/shared/components/ui/number-Input'
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
  showThousandsSeparator?: boolean
  disabled?: boolean
}

function toFiniteNumber(raw: unknown, fallback: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed === '') return fallback
    const parsed = Number(trimmed)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

type ControlledNumberInputProps = {
  field: ControllerRenderProps
  id: string
  min: number
  max: number
  step: number
  showThousandsSeparator: boolean
  disabled?: boolean
  ariaInvalid: boolean
  prefix?: React.ReactNode
}

function ControlledNumberInput({
  field,
  id,
  min,
  max,
  step,
  showThousandsSeparator,
  disabled,
  ariaInvalid,
  prefix,
}: ControlledNumberInputProps) {
  const fallback = Math.min(max, Math.max(min, 0))
  const value = toFiniteNumber(field.value, fallback)

  useEffect(() => {
    if (field.value !== value) field.onChange(value)
  }, [field.value, value, field.onChange])

  return (
    <NumberInput
      ref={field.ref}
      id={id}
      value={value}
      onChange={field.onChange}
      min={min}
      max={max}
      step={step}
      showThousandsSeparator={showThousandsSeparator}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      prefix={prefix}
    />
  )
}

export function FormNumberInput({
  name,
  label,
  hint,
  icon,
  requiredMark,
  min = 0,
  max = 100000000000,
  step = 1,
  showThousandsSeparator = true,
  disabled,
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ControlledNumberInput
            field={field}
            id={name}
            min={min}
            max={max}
            step={step}
            showThousandsSeparator={showThousandsSeparator}
            disabled={disabled}
            ariaInvalid={Boolean(error)}
            prefix={icon}
          />
        )}
      />
    </Field>
  )
}
