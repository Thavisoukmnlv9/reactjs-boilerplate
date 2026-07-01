import { ImagePlus, Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/core/utils/cn'
import { Button } from '../ui/button'
import {
  ACCEPT_ATTR,
  ACCEPTED_FORMATS_LABEL,
  MAX_FILE_SIZE,
  MAX_IMAGES,
} from './image-upload'

interface DropZoneProps {
  onFiles: (files: FileList | File[]) => void
  canAddMore: boolean
  imageCount: number
  fileInputRef: React.RefObject<HTMLInputElement>
}

export function DropZone({
  onFiles,
  canAddMore,
  imageCount,
  fileInputRef,
}: DropZoneProps) {
  const { t } = useTranslation()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files)
      }
    },
    [onFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFiles(e.target.files)
        e.target.value = ''
      }
    },
    [onFiles]
  )

  const atLimit = !canAddMore

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer',
        atLimit
          ? 'border-border bg-muted opacity-60 cursor-not-allowed'
          : isDragOver
            ? 'border-primary bg-primary/5 ring-4 ring-primary/10 scale-[1.01]'
            : 'border-border bg-muted/30 hover:border-primary/60 hover:bg-primary/[0.03]'
      )}
      onClick={() => !atLimit && fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!atLimit) fileInputRef.current?.click()
        }
      }}
      role="button"
      tabIndex={atLimit ? -1 : 0}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
          isDragOver
            ? 'bg-primary/10 text-primary'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        {isDragOver ? (
          <ImagePlus className="h-6 w-6" />
        ) : (
          <Upload className="h-6 w-6" />
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {atLimit
            ? t('imageUploader.maxReached', { max: MAX_IMAGES })
            : isDragOver
              ? t('imageUploader.dropHere')
              : t('imageUploader.dragDrop')}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {atLimit
            ? t('imageUploader.removeToUpload')
            : t('imageUploader.hint', {
                current: imageCount,
                max: MAX_IMAGES,
                size: MAX_FILE_SIZE / (1024 * 1024),
                formats: ACCEPTED_FORMATS_LABEL,
              })}
        </p>
      </div>

      {!atLimit && !isDragOver && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          {t('imageUploader.browse')}
        </Button>
      )}
    </div>
  )
}
