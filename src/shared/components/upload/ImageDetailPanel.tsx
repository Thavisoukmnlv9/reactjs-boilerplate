import { FileImage, FileUp, Globe, Star, Trash2 } from 'lucide-react'
import { useIsMobile } from '@/core/hooks/use-mobile'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import {
  computeAspectRatio,
  formatFileSize,
  getFormatLabel,
  type ImageItem,
} from './image-upload'

interface ImageDetailPanelProps {
  image: ImageItem | null
  open: boolean
  onClose: () => void
  onSetCover: (id: string) => void
  onRemove: (id: string) => void
}

export function ImageDetailPanel({
  image,
  open,
  onClose,
  onSetCover,
  onRemove,
}: ImageDetailPanelProps) {
  const isMobile = useIsMobile()

  if (!image) return null

  const isExisting = image.status === 'existing'

  const details = [
    { label: 'File name', value: image.name },
    { label: 'Size', value: formatFileSize(image.sizeBytes) },
    {
      label: 'Width',
      value: image.width ? `${image.width} px` : 'Not available',
    },
    {
      label: 'Height',
      value: image.height ? `${image.height} px` : 'Not available',
    },
    { label: 'Format', value: getFormatLabel(image.mimeType) },
    {
      label: 'Aspect ratio',
      value: computeAspectRatio(image.width, image.height),
    },
    {
      label: 'Source',
      value: isExisting ? 'Existing (URL)' : 'New upload (File)',
    },
  ]

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={
          isMobile ? 'h-[85vh] rounded-t-2xl' : 'w-[380px] sm:w-[420px]'
        }
      >
        <SheetHeader className="flex flex-row items-center justify-between pr-0">
          <SheetTitle className="text-base font-semibold">
            Image Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-4 overflow-y-auto">
          {/* Preview */}
          <div className="relative overflow-hidden rounded-lg bg-muted">
            {image.preview_url ? (
              <img
                src={image.preview_url}
                alt={image.name}
                className="w-full max-h-64 object-contain"
              />
            ) : (
              <div className="flex h-48 w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <FileImage className="h-10 w-10" />
                <span className="text-xs font-semibold">
                  {getFormatLabel(image.mimeType) === 'Unknown'
                    ? (image.name.split('.').pop() || 'IMG').toUpperCase()
                    : getFormatLabel(image.mimeType)}
                </span>
                <span className="text-[11px]">
                  Preview available after upload
                </span>
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              {image.is_cover && (
                <Badge className="">
                  <Star className="h-3 w-3 fill-current" />
                  Cover
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1 text-[10px]">
                {isExisting ? (
                  <>
                    <Globe className="h-2.5 w-2.5" /> Saved
                  </>
                ) : (
                  <>
                    <FileUp className="h-2.5 w-2.5" /> New
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-lg border bg-card p-3">
            <div className="flex flex-col gap-2.5">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-muted-foreground">
                    {d.label}
                  </span>
                  <span className="text-xs font-medium text-foreground max-w-[200px] truncate text-right">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {!image.is_cover && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="justify-start gap-2"
                onClick={() => onSetCover(image.id)}
              >
                <Star className="h-4 w-4" />
                Set as Cover
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onRemove(image.id)
                onClose()
              }}
            >
              <Trash2 className="h-4 w-4" />
              Remove Image
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
