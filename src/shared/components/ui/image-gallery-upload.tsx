import { ImageIcon, Loader2, XIcon } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

export type ImageGalleryUploadProps = {
  value?: string[]
  onChange?: (urls: string[]) => void
  onUpload?: (files: File[]) => Promise<string[]>
  onFileSelect?: (files: File[]) => void
  onRemoveImage?: (index: number) => void
  accept?: string
  maxSizeBytes?: number
  maxFiles?: number
  disabled?: boolean
  className?: string
  labels?: {
    upload?: string
    remove?: string
    invalidType?: string
    tooLarge?: string
    maxFilesExceeded?: string
    dragDrop?: string
    clickToSelect?: string
  }
  showHeroImage?: boolean
  heroImageLabel?: string
  label?: string
}

export function ImageGalleryUpload({
  value = [],
  onChange,
  onUpload,
  onFileSelect,
  onRemoveImage,
  accept = 'image/*',
  maxSizeBytes = 50 * 1024 * 1024,
  maxFiles = 10,
  disabled = false,
  className,
  labels,
  label = 'Gallery Images',
}: ImageGalleryUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewCountRef = useRef(value.length)

  // Sync with value prop
  useEffect(() => {
    setPreviews(value)
  }, [value])

  useEffect(() => {
    previewCountRef.current = previews.length
  }, [previews])

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

  const processFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      setError(null)

      // Validate files
      for (const file of files) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          return
        }
      }

      // Check max files limit using ref for current count (avoids stale closure)
      const overLimit = previewCountRef.current + files.length > maxFiles
      if (overLimit) {
        setError(
          labels?.maxFilesExceeded ?? `Maximum ${maxFiles} files allowed.`
        )
        return
      }

      // Handle files without upload function (just pass files to parent)
      if (!onUpload) {
        onFileSelect?.(files)
        if (inputRef.current) inputRef.current.value = ''
        return
      }

      // Handle files with upload function
      setUploading(true)
      try {
        const urls = await onUpload(files)
        setPreviews((currentPreviews) => {
          const newPreviews = [...currentPreviews, ...urls]
          onChange?.(newPreviews)
          return newPreviews
        })

        if (inputRef.current) inputRef.current.value = ''
      } catch (err) {
        setError((err as Error)?.message ?? 'Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [maxFiles, maxSizeBytes, accept, labels, onUpload, onChange, onFileSelect]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
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

      const files = Array.from(e.dataTransfer.files)
      processFiles(files)
    },
    [disabled, processFiles]
  )

  const removeImage = (index: number) => {
    if (onRemoveImage) {
      // Use custom remove handler if provided
      onRemoveImage(index)
    } else {
      // Default behavior
      const newPreviews = previews.filter((_, i) => i !== index)
      setPreviews(newPreviews)
      onChange?.(newPreviews)
    }
  }

  const onPick = () => inputRef.current?.click()

  // Since hero image is removed, all images are gallery images
  const galleryImages = previews
  return (
    <div className={cn('space-y-4', className)} role="group" aria-label={label}>
      <div className="space-y-2">
        <span className="font-medium text-sm text-foreground">
          {label} ({galleryImages.length}
          {maxFiles ? ` / ${maxFiles}` : ''})
        </span>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((preview, index) => (
              <Card
                key={`${preview.slice(0, 20)}-${index}`}
                className="group relative overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square w-full">
                    <img
                      src={preview}
                      alt={`${label} ${index + 1}`}
                      className="h-24 w-full rounded-md object-cover"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.onerror = null
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='1.5'%3E%3Crect width='24' height='24' rx='4'/%3E%3Cpath d='M8 10h.01M12 10h.01M16 10h.01M8 14h8'/%3E%3C/svg%3E"
                        target.classList.add('opacity-70')
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 rounded-md bg-destructive/90 p-0 shadow-sm opacity-90 transition-opacity hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
                      onClick={() => removeImage(index)}
                      disabled={disabled || uploading}
                      aria-label={labels?.remove ?? `Remove image ${index + 1}`}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Upload Area for Gallery */}
        {previews.length < maxFiles && (
          <div
            role="button"
            tabIndex={disabled || uploading ? -1 : 0}
            aria-label={
              labels?.dragDrop ?? 'Drag and drop images or click to select'
            }
            aria-disabled={disabled || uploading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (!disabled && !uploading) onPick()
              }
            }}
            className={cn(
              'rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-all duration-200',
              !disabled &&
                !uploading &&
                'cursor-pointer hover:border-primary/50 hover:bg-primary/5',
              dragActive &&
                !uploading &&
                'scale-[1.01] border-primary bg-primary/10',
              (disabled || uploading) && 'cursor-not-allowed opacity-60'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && !disabled && onPick()}
          >
            <div className="flex flex-col items-center gap-3">
              {uploading ? (
                <>
                  <div className="rounded-full bg-primary/10 p-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                  <p className="font-medium text-sm text-foreground">
                    Uploading…
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-muted/50 p-3">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground text-sm">
                      {labels?.dragDrop ?? 'Drag and drop images or'}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {labels?.clickToSelect ?? 'click to select'}
                    </p>
                  </div>
                  <p className="rounded-full bg-muted/30 px-3 py-1 text-muted-foreground text-xs">
                    PNG, JPG, GIF · max {Math.round(maxSizeBytes / 1024 / 1024)}
                    MB · {maxFiles - previews.length} left
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {/* Status messages */}
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
