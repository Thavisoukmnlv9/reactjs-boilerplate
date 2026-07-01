import type React from 'react'
import type { FieldPath, FieldValues } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Field } from './Field'

type Option = { label: React.ReactNode; value: string }

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  options: Option[]
  placeholder?: string
  requiredMark?: boolean
  disabled?: boolean
  clearable?: boolean
  clearLabel?: React.ReactNode
  onValueChange?: (value: string) => void
}

const CLEAR_SENTINEL = '__none__'

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  hint,
  icon,
  options,
  placeholder,
  requiredMark,
  disabled,
  clearable,
  clearLabel,
  onValueChange,
}: Props<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()
  const renderableOptions = options.filter((o) => o.value !== '')
  const selectEl = (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          value={field.value ?? ''}
          onValueChange={(value) => {
            const next = value === CLEAR_SENTINEL ? '' : value
            field.onChange(next)
            onValueChange?.(next)
          }}
          disabled={disabled}
        >
          <SelectTrigger className={cn('w-full', icon && 'pl-9')}>
            <SelectValue placeholder={placeholder ?? 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {clearable ? (
              <SelectItem value={CLEAR_SENTINEL}>
                {clearLabel ?? '—'}
              </SelectItem>
            ) : null}
            {renderableOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      {icon ? (
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          {selectEl}
        </div>
      ) : (
        selectEl
      )}
    </Field>
  )
}
