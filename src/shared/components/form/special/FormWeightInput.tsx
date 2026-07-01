import type React from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { NumberInput } from '@/shared/components/ui/number-Input'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group'
import { useFieldError } from '../core/useFieldError'
import { Field } from '../fields/Field'

type Unit = 'kg' | 'g'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Stored value is always grams. Display unit is user-toggled. */
  defaultUnit?: Unit
  min?: number
  max?: number
}

const G_PER_KG = 1000

function toFiniteNumber(raw: unknown, fallback: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw.trim())
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export function FormWeightInput({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  defaultUnit = 'kg',
  min = 0,
  max = 100_000_000,
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)
  const [unit, setUnit] = useState<Unit>(defaultUnit)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const grams = toFiniteNumber(field.value, min)
          const displayValue = unit === 'kg' ? grams / G_PER_KG : grams
          const step = unit === 'kg' ? 0.01 : 1
          const handleChange = (next: number) => {
            const nextGrams =
              unit === 'kg' ? Math.round(next * G_PER_KG) : Math.round(next)
            field.onChange(nextGrams)
          }
          return (
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <NumberInput
                  ref={field.ref}
                  id={name}
                  value={displayValue}
                  onChange={handleChange}
                  min={min}
                  max={max}
                  step={step}
                  showThousandsSeparator
                  disabled={disabled}
                  aria-invalid={Boolean(error)}
                />
              </div>
              <ToggleGroup
                type="single"
                value={unit}
                onValueChange={(v) => {
                  if (v === 'kg' || v === 'g') setUnit(v)
                }}
                className="shrink-0"
                disabled={disabled}
              >
                <ToggleGroupItem value="kg" className="h-9 px-3 text-sm">
                  kg
                </ToggleGroupItem>
                <ToggleGroupItem value="g" className="h-9 px-3 text-sm">
                  g
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )
        }}
      />
    </Field>
  )
}
