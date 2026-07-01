import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Input } from '@/shared/components/ui/input'
import { Field } from './Field'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  placeholder?: string
  requiredMark?: boolean
}

export function FormNumber({
  name,
  label,
  hint,
  icon,
  placeholder,
  requiredMark,
  className,
  ...rest
}: Props) {
  const { control } = useFormContext()

  const inputEl = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          id={name}
          type="number"
          value={field.value}
          onChange={(e) => {
            const val = e.target.value
            if (Number.isNaN(val)) {
              field.onChange(undefined)
            } else {
              field.onChange(Number(val))
            }
          }}
          placeholder={placeholder}
          className={cn(icon && 'pl-9', className)}
          {...rest}
        />
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
          {inputEl}
        </div>
      ) : (
        inputEl
      )}
    </Field>
  )
}
