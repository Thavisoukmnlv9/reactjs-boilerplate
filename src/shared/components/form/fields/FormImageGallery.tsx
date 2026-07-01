import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  ImageGalleryUpload,
  type ImageGalleryUploadProps,
} from '@/shared/components/ui/image-gallery-upload'
import { Field } from './Field'

export type FormImageGalleryProps = Omit<
  ImageGalleryUploadProps,
  'value' | 'onChange'
> & {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  fileFieldName?: string
  onFileSelect?: (files: File[]) => void
  heroImageLabel?: string
}

export function FormImageGallery({
  name,
  label,
  hint,
  requiredMark,
  className,
  fileFieldName,
  onFileSelect,
  heroImageLabel,
  ...props
}: FormImageGalleryProps) {
  const { control, setValue, watch } = useFormContext()
  const fileKey = fileFieldName ?? `${name}Files`

  const serverUrls = (watch(name) as string[]) || []
  const files = (watch(fileKey as any) as File[]) || []

  // Create blob URLs directly in useMemo to avoid useEffect loops
  const blobUrls = React.useMemo(() => {
    return files.map((f) => URL.createObjectURL(f))
  }, [files])

  // Cleanup blob URLs when component unmounts or files change
  React.useEffect(() => {
    return () => {
      blobUrls.forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url)
      })
    }
  }, [blobUrls])

  const previewUrls = React.useMemo(() => {
    return [...serverUrls, ...blobUrls]
  }, [serverUrls, blobUrls])

  const handleRemoveImage = (index: number) => {
    const serverCount = serverUrls.length

    if (index < serverCount) {
      const nextServer = serverUrls.filter((_, i) => i !== index)
      setValue(name, nextServer, { shouldDirty: true, shouldTouch: true })
      return
    }

    const blobIdx = index - serverCount
    const url = blobUrls[blobIdx]

    if (url?.startsWith('blob:')) URL.revokeObjectURL(url)

    const nextFiles = files.filter((_, i) => i !== blobIdx)
    setValue(fileKey as any, nextFiles, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

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
        render={() => {
          const handleFileSelect = (picked: File[]) => {
            setValue(fileKey as any, picked, {
              shouldDirty: true,
              shouldTouch: true,
            })
            onFileSelect?.(picked)
          }

          const handleChange = (urls: string[]) => {
            setValue(name, urls, { shouldDirty: true, shouldTouch: true })
          }

          return (
            <ImageGalleryUpload
              {...props}
              label={label}
              heroImageLabel={heroImageLabel}
              value={previewUrls}
              onChange={handleChange}
              onFileSelect={handleFileSelect}
              onRemoveImage={handleRemoveImage}
            />
          )
        }}
      />
    </Field>
  )
}
