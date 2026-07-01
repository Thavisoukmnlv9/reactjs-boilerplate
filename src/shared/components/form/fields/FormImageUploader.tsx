import type React from 'react'
import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { ImageUploader } from '@/shared/components/upload/ImageUploader'
import type {
  ExistingImage,
  SavePayload,
} from '@/shared/components/upload/image-upload'
import { Field } from './Field'
import { FormTextarea } from './FormTextarea'

const DEFAULT_COVER_URL_NAME = 'cover_image_url'
const DEFAULT_COVER_FILE_NAME = 'cover_image_file'
const DEFAULT_IMAGES_URLS_NAME = 'images_urls'
const DEFAULT_IMAGES_FILES_NAME = 'images_files'
const DEFAULT_IMAGES_DESCRIPTIONS_NAME = 'gallery_descriptions'

export interface FormImageUploaderProps {
  /** Resolve presigned/display URL for a stored object key (e.g. Wasabi). */
  getMediaPreviewUrl?: (storageKey: string) => string | undefined
  /** Field name for cover image URL (existing or to keep). */
  coverImageUrlName?: string
  /** Field name for cover image File (new upload). */
  coverImageFileName?: string
  /** Field name for gallery image URLs array. */
  imagesUrlsName?: string
  /** Field name for gallery image Files array. */
  imagesFilesName?: string
  /** Field name for per-image descriptions (Record keyed by image url or id). Used when showDescription is true. */
  imagesDescriptionsName?: string
  /** When true, show a FormTextarea below each image for description. */
  showDescription?: boolean
  /** When true, write files as { is_cover, file, description }[] instead of File[]. */
  imageFilesAsObjects?: boolean
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
}

export function FormImageUploader({
  getMediaPreviewUrl,
  coverImageUrlName = DEFAULT_COVER_URL_NAME,
  coverImageFileName = DEFAULT_COVER_FILE_NAME,
  imagesUrlsName = DEFAULT_IMAGES_URLS_NAME,
  imagesFilesName = DEFAULT_IMAGES_FILES_NAME,
  imagesDescriptionsName = DEFAULT_IMAGES_DESCRIPTIONS_NAME,
  showDescription = false,
  imageFilesAsObjects = false,
  label,
  hint,
  requiredMark,
  className,
}: FormImageUploaderProps) {
  const { watch, setValue } = useFormContext()

  const coverUrl = watch(coverImageUrlName) as string | undefined
  const imagesUrlsRaw = watch(imagesUrlsName)
  const imagesUrls = Array.isArray(imagesUrlsRaw)
    ? imagesUrlsRaw.map((u: unknown) =>
        typeof u === 'object' && u != null && 'url' in u
          ? (u as { url: string }).url
          : String(u)
      )
    : []

  const existingImages = useMemo((): ExistingImage[] | undefined => {
    const cover =
      typeof coverUrl === 'string' && coverUrl.trim() !== ''
        ? coverUrl.trim()
        : null
    const urls = Array.isArray(imagesUrls) ? imagesUrls.filter(Boolean) : []
    const combined = cover
      ? [cover, ...urls.filter((u: string) => u !== cover)]
      : urls
    if (combined.length === 0) return undefined
    const resolvePreview = (key: string) => {
      if (key.startsWith('http://') || key.startsWith('https://')) return key
      return getMediaPreviewUrl?.(key) ?? key
    }
    return combined.map((storageKey) => ({
      image_url: resolvePreview(storageKey),
      storage_key:
        storageKey.startsWith('http://') || storageKey.startsWith('https://')
          ? undefined
          : storageKey,
    }))
  }, [coverUrl, imagesUrls, getMediaPreviewUrl])

  const handleSave = useCallback(
    (payload: SavePayload) => {
      setValue(coverImageUrlName, payload.cover_url ?? '', {
        shouldDirty: true,
        shouldTouch: true,
      })
      setValue(coverImageFileName, payload.cover_file ?? null, {
        shouldDirty: true,
        shouldTouch: true,
      })
      const orderedIds = payload.ordered_ids ?? []
      if (showDescription && orderedIds.length > 0) {
        const descriptionsRecord =
          (watch(imagesDescriptionsName) as Record<string, string>) ?? {}
        const urlEntries = payload.ordered_images
          .map((o, i) => ({ ...o, id: orderedIds[i] }))
          .filter((o) => o.type === 'url')
        const fileEntries = payload.ordered_images
          .map((o, i) => ({ ...o, id: orderedIds[i] }))
          .filter((o) => o.type === 'file')
        setValue(
          imagesUrlsName,
          urlEntries.map((o) => ({
            is_cover: payload.cover_url === o.value,
            url: o.value,
            description: descriptionsRecord[o.id] ?? '',
          })),
          { shouldDirty: true, shouldTouch: true }
        )
        const rawFiles = payload.new_image_files_to_upload ?? []
        const filesValue = fileEntries.map((entry, i) => ({
          is_cover:
            payload.cover_file != null && rawFiles[i] === payload.cover_file,
          file: rawFiles[i],
          description: descriptionsRecord[entry.id] ?? '',
        }))
        setValue(imagesFilesName, filesValue, {
          shouldDirty: true,
          shouldTouch: true,
        })
      } else {
        const urlsFromOrdered = payload.ordered_images
          .filter((o) => o.type === 'url')
          .map((o) => o.value)
        setValue(imagesUrlsName, urlsFromOrdered, {
          shouldDirty: true,
          shouldTouch: true,
        })
        const rawFiles = payload.new_image_files_to_upload ?? []
        const filesValue = imageFilesAsObjects
          ? [
              ...(payload.cover_file
                ? [
                    {
                      is_cover: true as const,
                      file: payload.cover_file,
                      description: '' as string,
                    },
                  ]
                : []),
              ...rawFiles
                .filter((f) => f !== payload.cover_file)
                .map((f) => ({
                  is_cover: false as const,
                  file: f,
                  description: '' as string,
                })),
            ]
          : rawFiles
        setValue(imagesFilesName, filesValue, {
          shouldDirty: true,
          shouldTouch: true,
        })
      }
    },
    [
      setValue,
      watch,
      coverImageUrlName,
      coverImageFileName,
      imagesUrlsName,
      imagesFilesName,
      imagesDescriptionsName,
      showDescription,
      imageFilesAsObjects,
    ]
  )

  return (
    <Field
      name={coverImageUrlName}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      <ImageUploader
        existingImages={existingImages}
        onSave={handleSave}
        formMode
        renderImageExtra={
          showDescription
            ? (image) => (
                <FormTextarea
                  name={`${imagesDescriptionsName}.${image.image_url ?? image.id}`}
                  placeholder="Description (optional)"
                  className="min-h-[60px] text-xs"
                  rows={2}
                />
              )
            : undefined
        }
      />
    </Field>
  )
}
