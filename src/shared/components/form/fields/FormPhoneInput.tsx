import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { PhoneInput } from '@/shared/components/ui/phone-input'
import { Field } from './Field'

type CountryCode = import('react-phone-number-input').Country

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  placeholder?: string
  requiredMark?: boolean
  defaultCountry?: CountryCode
  disabled?: boolean
  className?: string
  international?: boolean
  initialValueFormat?: 'national' | 'international'
}

export function FormPhoneInput({
  name,
  label,
  hint,
  placeholder = 'Enter phone number',
  requiredMark,
  defaultCountry = 'LA',
  disabled = false,
  className,
  international = true,
  initialValueFormat = 'national',
}: Props) {
  const { control } = useFormContext()

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name as never}
        render={({ field }) => (
          <PhoneInput
            international={international}
            initialValueFormat={initialValueFormat as 'national' | undefined}
            id={name}
            defaultCountry={defaultCountry}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'h-9 w-full rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
              className
            )}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
    </Field>
  )
}
