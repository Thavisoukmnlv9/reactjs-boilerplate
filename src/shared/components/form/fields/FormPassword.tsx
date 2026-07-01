import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import {
  PasswordInput,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
} from '@/shared/components/ui/password-input'
import { Field } from './Field'

export type FormPasswordProps = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
  placeholder?: string
  className?: string
  visible?: boolean
}

export function FormPassword({
  name,
  label,
  hint,
  icon,
  requiredMark,
  className,
  placeholder,
}: FormPasswordProps) {
  const { control } = useFormContext()
  const inputEl = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <PasswordInput>
          <PasswordInputInput
            value={field.value ?? ''}
            onChange={field.onChange}
            placeholder={placeholder}
            className={cn(icon && 'pl-9', className)}
          />
          <PasswordInputAdornmentToggle />
        </PasswordInput>
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
          {inputEl}
        </div>
      ) : (
        inputEl
      )}
    </Field>
  )
}
