import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import MultiSelectChips from '@/shared/components/ui/multi-select-chips'
import { Field } from './Field'

export type FormMultiSelectChipsOption = { value: string; label: string }

export type FormMultiSelectChipsProps = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  icon?: React.ReactNode
  placeholder?: string
  options: FormMultiSelectChipsOption[]
  disabled?: boolean
}

export function FormMultiSelectChips({
  name,
  label,
  hint,
  requiredMark,
  className,
  icon,
  options,
}: FormMultiSelectChipsProps) {
  const { control } = useFormContext()

  const chipsEl = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MultiSelectChips
          options={options}
          selected={Array.isArray(field.value) ? (field.value as string[]) : []}
          onChange={(vals) => field.onChange(vals)}
          helperText={undefined}
        />
      )}
    />
  )

  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      {icon ? (
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          <div className={cn(icon && 'pl-9')}>{chipsEl}</div>
        </div>
      ) : (
        chipsEl
      )}
    </Field>
  )
}
