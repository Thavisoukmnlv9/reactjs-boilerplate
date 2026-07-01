import { ArrowRight, Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { DropZone } from './DropZone'
import { ImageDetailPanel } from './ImageDetailPanel'
import type { ExistingImage, ImageItem, SavePayload } from './image-upload'
import { PreviewGrid } from './PreviewGrid'
import { useImageUpload } from './use-image-upload'

interface ImageUploaderProps {
  existingImages?: ExistingImage[]
  onSave?: (payload: SavePayload) => void
  formMode?: boolean
  /** When provided, rendered below each image in the grid (e.g. description textarea). */
  renderImageExtra?: (image: ImageItem, index: number) => React.ReactNode
}

export function ImageUploader({
  existingImages,
  onSave,
  formMode,
  renderImageExtra,
}: ImageUploaderProps) {
  const {
    images,
    selectedImage,
    selectedId,
    setSelectedId,
    processFiles,
    removeImage,
    setCover,
    clearAll,
    retryUpload,
    reorderImages,
    openFilePicker,
    fileInputRef,
    canAddMore,
    savePayload,
  } = useImageUpload(existingImages, formMode)

  useEffect(() => {
    if (formMode && onSave) {
      onSave(savePayload)
    }
  }, [formMode, onSave, savePayload])

  const handleSave = () => {
    const pending = images.filter((img) => img.status === 'uploading')
    if (pending.length > 0) {
      toast.warning('Please wait for all uploads to complete')
      return
    }
    const errors = images.filter((img) => img.status === 'error')
    if (errors.length > 0) {
      toast.warning('Some images failed to upload. Retry or remove them.')
      return
    }

    if (onSave) {
      onSave(savePayload)
    }

    toast.success(`${images.length} image(s) saved successfully!`)
  }

  return (
    <div className="w-full">
      <div>
        {/* Body */}
        <div className="flex flex-col gap-5">
          <DropZone
            onFiles={processFiles}
            canAddMore={canAddMore}
            imageCount={images.length}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          />

          <PreviewGrid
            images={images}
            selectedId={selectedId}
            formMode={formMode}
            onSelect={(id) => setSelectedId(id)}
            onRemove={removeImage}
            onSetCover={setCover}
            onRetry={retryUpload}
            onReorder={reorderImages}
            renderImageExtra={renderImageExtra}
          />
        </div>

        {/* Footer */}
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            {images.length > 1 && (
              <p className="order-last w-full text-xs text-muted-foreground sm:order-first sm:w-auto">
                Drag to reorder · hover a photo to set it as cover.
              </p>
            )}
            <div className="flex gap-2">
              {canAddMore && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openFilePicker}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Upload More
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </Button>
            </div>
            {!formMode && (
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                className="gap-1.5"
              >
                Save & Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <ImageDetailPanel
        image={selectedImage}
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        onSetCover={setCover}
        onRemove={removeImage}
      />
    </div>
  )
}
