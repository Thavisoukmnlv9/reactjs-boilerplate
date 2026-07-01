import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import TagsInput from '@/shared/components/ui/tags-input'
import { Field } from './Field'

export interface FormTagsInputProps {
  name: string
  suggestions?: string[]
  label?: React.ReactNode
  placeholder?: string
  maxTags?: number
  maxLength?: number
  hint?: React.ReactNode
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  requiredMark?: boolean
}

export function FormTagsInput({
  name,
  suggestions = [],
  label,
  placeholder,
  maxTags,
  maxLength,
  hint,
  disabled,
  className,
  icon,
  requiredMark,
}: FormTagsInputProps) {
  const { control } = useFormContext()

  const content = (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState }) => (
        <TagsInput
          tags={Array.isArray(field.value) ? field.value : []}
          onChange={field.onChange}
          suggestions={suggestions}
          label=""
          placeholder={placeholder}
          maxTags={maxTags}
          maxLength={maxLength}
          hint=""
          error={fieldState.error?.message}
          disabled={disabled}
          icon={icon}
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
      {content}
    </Field>
  )
}
