import { UploadIcon, XIcon } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from './button'
import { Card, CardContent } from './card'

export type SingleImageUploadProps = {
  value?: string | null
  onChange?: (url: string | null) => void
  onUpload?: (file: File) => Promise<string>
  onFileSelect?: (file: File | null) => void
  accept?: string
  maxSizeBytes?: number
  disabled?: boolean
  className?: string
  labels?: {
    upload?: string
    remove?: string
    invalidType?: string
    tooLarge?: string
    dragDrop?: string
    clickToSelect?: string
  }
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto'
  height?: string
}

export function SingleImageUpload({
  value = null,
  onChange,
  onUpload,
  onFileSelect,
  accept = 'image/*',
  maxSizeBytes = 50 * 1024 * 1024,
  disabled = false,
  className,
  labels,
  aspectRatio = 'landscape',
  height = 'h-48',
}: SingleImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  // Sync with value prop
  useEffect(() => {
    setPreview(value)
  }, [value])

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const validateFile = (file: File): string | null => {
    if (accept && !file.type.startsWith('image/')) {
      return labels?.invalidType ?? 'Invalid file type. Please select an image.'
    }
    if (file.size > maxSizeBytes) {
      return (
        labels?.tooLarge ??
        `File too large. Maximum size is ${Math.round(maxSizeBytes / 1024 / 1024)}MB.`
      )
    }
    return null
  }

  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      // Handle file without upload function (create object URL)
      if (!onUpload) {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
        const url = URL.createObjectURL(file)
        objectUrlRef.current = url
        setPreview(url)
        onChange?.(url)
        onFileSelect?.(file)

        if (inputRef.current) inputRef.current.value = ''
        return
      }

      // Handle file with upload function
      setUploading(true)
      try {
        const url = await onUpload(file)
        setPreview(url)
        onChange?.(url)

        if (inputRef.current) inputRef.current.value = ''
      } catch (err) {
        setError((err as Error)?.message ?? 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [maxSizeBytes, accept, labels, onUpload, onChange, onFileSelect]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      const file = e.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    },
    [disabled, processFile]
  )

  const removeImage = () => {
    setPreview(null)
    onChange?.(null)
    onFileSelect?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const onPick = () => inputRef.current?.click()

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'landscape':
        return 'aspect-video'
      case 'portrait':
        return 'aspect-[3/4]'
      case 'auto':
      default:
        return ''
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {preview ? (
        <Card className="group relative">
          <CardContent className="p-0">
            <div className={cn('relative', getAspectRatioClass())}>
              <img
                src={preview}
                alt="Uploaded image"
                className={cn(
                  'w-full rounded-md object-cover',
                  aspectRatio === 'auto' ? height : 'h-full'
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={removeImage}
                disabled={disabled || uploading}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            'cursor-pointer rounded-lg border-2 border-muted-foreground/25 border-dashed p-12 text-center transition-all duration-200 hover:border-primary/50 hover:bg-primary/5',
            getAspectRatioClass(),
            dragActive && 'scale-[1.02] border-primary bg-primary/10',
            disabled && 'cursor-not-allowed opacity-50 hover:scale-100'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onPick}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted/50 p-4">
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground text-sm">
                {labels?.dragDrop ?? 'Drag and drop an image or'}
              </p>
              <p className="text-muted-foreground text-sm">
                {labels?.clickToSelect ?? 'click to select'}
              </p>
            </div>
            <p className="rounded-full bg-muted/30 px-3 py-1 text-muted-foreground text-xs">
              PNG, JPG, GIF max {Math.round(maxSizeBytes / 1024 / 1024)}MB
            </p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {uploading && (
        <p className="text-muted-foreground text-sm">Uploading image...</p>
      )}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
