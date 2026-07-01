import { motion, Reorder } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  Globe,
  GripVertical,
  Loader2,
  RotateCcw,
  Star,
  X,
} from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { formatFileSize, getFormatLabel, type ImageItem } from './image-upload'

interface PreviewGridProps {
  images: ImageItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onSetCover: (id: string) => void
  onRetry: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  /** When true, staged files are not really uploaded yet — suppress the upload-success check. */
  formMode?: boolean
  /** Optional: render extra content (e.g. description textarea) below each image card. */
  renderImageExtra?: (image: ImageItem, index: number) => ReactNode
}

export function PreviewGrid({
  images,
  selectedId,
  onSelect,
  onRemove,
  onSetCover,
  onRetry,
  onReorder,
  formMode,
  renderImageExtra,
}: PreviewGridProps) {
  if (images.length === 0) return null

  return (
    <Reorder.Group
      axis="x"
      values={images}
      onReorder={(newOrder) => {
        const oldIds = images.map((i) => i.id)
        const newIds = newOrder.map((i) => i.id)
        for (let i = 0; i < newIds.length; i++) {
          if (oldIds[i] !== newIds[i]) {
            const fromIndex = oldIds.indexOf(newIds[i])
            onReorder(fromIndex, i)
            break
          }
        }
      }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    >
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedId === image.id}
          formMode={formMode}
          onSelect={() => onSelect(image.id)}
          onRemove={() => onRemove(image.id)}
          onSetCover={() => onSetCover(image.id)}
          onRetry={() => onRetry(image.id)}
          renderExtra={renderImageExtra?.(image, index)}
        />
      ))}
    </Reorder.Group>
  )
}

function ImageCard({
  image,
  isSelected,
  formMode,
  onSelect,
  onRemove,
  onSetCover,
  onRetry,
  renderExtra,
}: {
  image: ImageItem
  isSelected: boolean
  formMode?: boolean
  onSelect: () => void
  onRemove: () => void
  onSetCover: () => void
  onRetry: () => void
  renderExtra?: ReactNode
}) {
  const [previewFailed, setPreviewFailed] = useState(false)
  const isExisting = image.status === 'existing'
  const dims =
    image.width && image.height ? `${image.width}×${image.height}` : null
  const isBusy = image.status === 'uploading' || image.status === 'error'
  // HEIC/TIFF can't be rendered by `<img>` in most browsers. Show a format
  // placeholder instead of a broken image — the backend converts to AVIF.
  const canPreview = !!image.preview_url && !previewFailed
  const mimeLabel = getFormatLabel(image.mimeType)
  const formatLabel =
    mimeLabel !== 'Unknown'
      ? mimeLabel
      : (image.name.split('.').pop() || 'IMG').toUpperCase()

  return (
    <Reorder.Item
      value={image}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all cursor-pointer',
        isSelected
          ? 'ring-2 ring-primary border-primary'
          : image.is_cover
            ? 'ring-1 ring-primary/40 border-primary/40 hover:shadow-md'
            : 'hover:shadow-md hover:border-muted-foreground/30'
      )}
      whileDrag={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
    >
      {/* Top-left: cover badge, or drag handle on hover */}
      <div className="absolute top-1.5 left-1.5 z-10">
        {image.is_cover ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            <Star className="h-2.5 w-2.5 fill-current" />
            Cover
          </span>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-card/85 backdrop-blur-sm text-muted-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Top-right: quick actions on hover (set cover + remove) */}
      <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {!image.is_cover && !isBusy && (
          <button
            type="button"
            title="Set as cover"
            aria-label="Set as cover"
            onClick={(e) => {
              e.stopPropagation()
              onSetCover()
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-card/85 backdrop-blur-sm text-muted-foreground shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          title="Remove"
          aria-label="Remove image"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-card/85 backdrop-blur-sm text-muted-foreground shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Thumbnail */}
      <div
        className="relative aspect-square overflow-hidden bg-muted"
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        role="button"
        tabIndex={0}
      >
        {canPreview ? (
          <img
            src={image.preview_url}
            alt={image.name}
            loading="lazy"
            onError={() => setPreviewFailed(true)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-muted text-muted-foreground">
            <FileImage className="h-7 w-7" />
            <span className="rounded bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold">
              {formatLabel}
            </span>
          </div>
        )}

        {/* Existing badge */}
        {isExisting && (
          <div className="absolute bottom-1 left-1">
            <span className="inline-flex items-center gap-0.5 rounded bg-secondary/90 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-medium text-secondary-foreground">
              <Globe className="h-2.5 w-2.5" />
              Saved
            </span>
          </div>
        )}

        {/* Upload overlay */}
        {image.status === 'uploading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/70 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div className="mt-2 w-3/4 h-1.5 rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${image.progress}%` }}
                transition={{ ease: 'linear', duration: 0.3 }}
              />
            </div>
            <span className="mt-1 text-[10px] font-medium text-muted-foreground">
              {Math.round(image.progress)}%
            </span>
          </div>
        )}

        {image.status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/70 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRetry()
              }}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
          </div>
        )}

        {/* In form mode files are only staged, so a success check on every card
            is noise — only confirm a real completed upload. */}
        {image.status === 'success' && !formMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-1 right-1"
          >
            <CheckCircle2 className="h-4 w-4 text-success drop-shadow" />
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div
        className="flex flex-col gap-0.5 p-2"
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
        role="button"
        tabIndex={0}
      >
        <p className="truncate text-xs font-medium text-foreground">
          {image.name}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>{formatFileSize(image.sizeBytes)}</span>
          {dims && (
            <>
              <span>·</span>
              <span>{dims}</span>
            </>
          )}
        </div>
      </div>
      {renderExtra != null && <div className="p-2 pt-0">{renderExtra}</div>}
    </Reorder.Item>
  )
}
