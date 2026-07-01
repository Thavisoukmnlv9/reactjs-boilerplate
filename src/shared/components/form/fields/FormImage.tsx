import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  AvatarUpload,
  type AvatarUploadProps,
} from '@/shared/components/ui/avatar-upload'
import { Field } from './Field'

export type FormImageGalleryUploadProps = Omit<
  AvatarUploadProps,
  'value' | 'onChange'
> & {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  fileFieldName?: string // optional alt destination for file storage
  onFileSelect?: (file: File) => void
}

export function FormImage({
  name,
  label,
  hint,
  requiredMark,
  className,
  fileFieldName,
  onFileSelect,
  ...props
}: FormImageGalleryUploadProps) {
  const { control, setValue } = useFormContext()
  const fileKey = fileFieldName ?? `${name}_file`
  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AvatarUpload
            {...props}
            value={field.value}
            onChange={(val) => field.onChange(val)}
            onFileSelect={(file) => {
              setValue(fileKey as any, file)
              onFileSelect?.(file)
            }}
          />
        )}
      />
    </Field>
  )
}
