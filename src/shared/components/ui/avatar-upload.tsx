import { XIcon } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/core/utils/cn'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'

export type AvatarUploadProps = {
  value?: string | null // preview URL (when immediate mode)
  onChange?: (next: string | null) => void // set URL (immediate)
  onUpload?: (file: File) => Promise<string> // returns URL (immediate)
  onFileSelect?: (file: File | null) => void // deferred mode: emit selected file
  accept?: string // e.g. image/*
  maxSizeBytes?: number // optional size limit
  disabled?: boolean
  className?: string
  labels?: {
    upload?: string
    remove?: string
    change?: string
    invalidType?: string
    tooLarge?: string
  }
}

export function AvatarUpload({
  value,
  onChange,
  onUpload,
  onFileSelect,
  accept = 'image/*',
  maxSizeBytes = 5 * 1024 * 1024,
  disabled = false,
  className,
  labels,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    setPreview(value ?? null)
  }, [value])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const onPick = () => inputRef.current?.click()

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    if (accept && !file.type.startsWith('image/')) {
      setError(labels?.invalidType ?? 'Invalid file type')
      return
    }
    if (file.size > maxSizeBytes) {
      setError(labels?.tooLarge ?? 'File too large')
      return
    }

    // Deferred mode: no onUpload provided
    if (!onUpload) {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      const url = URL.createObjectURL(file)
      objectUrlRef.current = url
      setPreview(url)
      onFileSelect?.(file)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    // Immediate upload mode
    setUploading(true)
    try {
      const url = await onUpload(file)
      setPreview(url)
      onChange?.(url)
    } catch (err) {
      setError((err as Error)?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const clear = () => {
    setPreview(null)
    if (onUpload) onChange?.(null)
    else onFileSelect?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Avatar className="size-16">
        {preview ? (
          <AvatarImage src={preview} alt="avatar" />
        ) : (
          <AvatarFallback>AV</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            onClick={onPick}
          >
            {preview
              ? (labels?.change ?? 'Change')
              : (labels?.upload ?? 'Upload')}
          </Button>
          {preview ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled || uploading}
              onClick={clear}
            >
              <XIcon className="mr-1 h-4 w-4" />
              {labels?.remove ?? 'Remove'}
            </Button>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={onFile}
            disabled={disabled}
          />
        </div>
        {uploading ? (
          <p className="text-muted-foreground text-xs">Uploading...</p>
        ) : null}
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
      </div>
    </div>
  )
}
