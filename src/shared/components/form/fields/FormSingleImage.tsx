import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  SingleImageUpload,
  type SingleImageUploadProps,
} from '@/shared/components/ui/single-image-upload'
import { Field } from './Field'

export type FormSingleImageProps = Omit<
  SingleImageUploadProps,
  'value' | 'onChange'
> & {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  fileFieldName?: string
  onFileSelect?: (file: File | null) => void
}

export function FormSingleImage({
  name,
  label,
  hint,
  requiredMark,
  className,
  fileFieldName,
  onFileSelect,
  ...props
}: FormSingleImageProps) {
  const { control, setValue, watch } = useFormContext()
  const fileKey = fileFieldName ?? `${name}File`
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const file = watch(fileKey as any) as File | null

  useEffect(() => {
    if (file) {
      const newFileUrl = URL.createObjectURL(file)
      fileUrl && URL.revokeObjectURL(fileUrl)
      setFileUrl(newFileUrl)
      const combinedUrl = newFileUrl
      setPreviewUrl(combinedUrl)
      setValue(name, combinedUrl)
    } else {
      const currentUrl = watch(name) as string
      const previewUrl = currentUrl && currentUrl !== '' ? currentUrl : null
      setPreviewUrl(previewUrl)
    }
  }, [file, name, setValue, watch])

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
        render={({ field }) => {
          useEffect(() => {
            const existingUrl =
              field.value && field.value !== '' ? field.value : null
            setPreviewUrl(existingUrl)
          }, [field.value])

          const handleFileSelect = (file: File | null) => {
            setValue(fileKey as any, file)
            onFileSelect?.(file)
          }

          const handleChange = (url: string | null) => {
            setPreviewUrl(url)
            // Convert null to empty string for form field
            const fieldValue = url || ''
            field.onChange(fieldValue)
            if (!url) {
              setValue(fileKey as any, null)
              onFileSelect?.(null)
            }
          }

          return (
            <SingleImageUpload
              {...props}
              value={previewUrl}
              onChange={handleChange}
              onFileSelect={handleFileSelect}
              className={className}
            />
          )
        }}
      />
    </Field>
  )
}
