import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Input } from '@/shared/components/ui/input'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
}

const HEX_RE = /^#[0-9a-f]{6}$/i

export function FormColorPicker({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  className,
  placeholder = '#000000',
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = typeof field.value === 'string' ? field.value : ''
          const swatch = HEX_RE.test(value) ? value : '#ffffff'
          return (
            <div className={cn('flex items-center gap-2', className)}>
              <label
                htmlFor={`${name}-swatch`}
                className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-input"
                style={{ backgroundColor: swatch }}
                aria-label="Pick color"
              >
                <input
                  id={`${name}-swatch`}
                  type="color"
                  value={swatch}
                  disabled={disabled}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
              <Input
                id={name}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            </div>
          )
        }}
      />
    </Field>
  )
}
