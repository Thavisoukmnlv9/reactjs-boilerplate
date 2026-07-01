import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import {
  MultiSelect,
  type MultiSelectOption,
} from '@/shared/components/ui/multi-select'
import { Field } from './Field'

export type FormMultiSelectProps = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
  className?: string
  options: MultiSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  clearable?: boolean
  maxViewportHeight?: number
  renderOptionLabel?: (opt: MultiSelectOption) => React.ReactNode
}

export function FormMultiSelect({
  name,
  label,
  hint,
  icon,
  requiredMark,
  className,
  ...props
}: FormMultiSelectProps) {
  const { control } = useFormContext()

  const selectEl = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MultiSelect
          values={Array.isArray(field.value) ? (field.value as string[]) : []}
          onValuesChange={(vals) => field.onChange(vals)}
          options={props.options}
          placeholder={props.placeholder}
          searchPlaceholder={props.searchPlaceholder}
          disabled={props.disabled}
          clearable={props.clearable}
          maxViewportHeight={props.maxViewportHeight}
          renderOptionLabel={props.renderOptionLabel}
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
          <div className={cn(icon && 'pl-9')}>{selectEl}</div>
        </div>
      ) : (
        selectEl
      )}
    </Field>
  )
}
