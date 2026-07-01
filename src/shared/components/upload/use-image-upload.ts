import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  type ExistingImage,
  generateId,
  type ImageItem,
  isAcceptedFile,
  isPreviewableFile,
  MAX_FILE_SIZE,
  MAX_IMAGES,
  type SavePayload,
} from './image-upload'

function loadImageMeta(
  file: File
): Promise<{ url: string; width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    // HEIC/TIFF can't be decoded by `<img>` in most browsers. Give them no
    // object URL at all (an undecodable blob doesn't reliably fire `onerror`),
    // so the card shows a format placeholder immediately. The file still gets
    // staged and the backend re-encodes it to AVIF on upload.
    if (!isPreviewableFile(file)) {
      resolve({ url: '', width: null, height: null })
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () =>
      resolve({ url, width: img.naturalWidth, height: img.naturalHeight })
    // A "previewable" type can still be corrupt — fall back to the placeholder.
    img.onerror = () => resolve({ url, width: null, height: null })
    img.src = url
  })
}

function simulateUpload(
  id: string,
  onProgress: (id: string, progress: number) => void,
  onComplete: (id: string, success: boolean) => void
) {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 10
    if (progress >= 100) {
      clearInterval(interval)
      onProgress(id, 100)
      const success = Math.random() > 0.1
      setTimeout(() => onComplete(id, success), 200)
    } else {
      onProgress(id, Math.min(progress, 99))
    }
  }, 300)
}

function extractFilename(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const name = pathname.split('/').pop()
    return name || 'Existing image'
  } catch {
    return 'Existing image'
  }
}

function ensureCover(images: ImageItem[]): ImageItem[] {
  if (images.length === 0) return images
  if (images.some((img) => img.is_cover)) return images
  return images.map((img, i) => (i === 0 ? { ...img, is_cover: true } : img))
}

export function useImageUpload(
  initialImages?: ExistingImage[],
  formMode = false
) {
  const [images, setImages] = useState<ImageItem[]>(() => {
    if (!initialImages?.length) return []
    return ensureCover(
      initialImages.map((img) => {
        const stableKey = (img.storage_key ?? img.image_url).trim()
        const previewUrl = img.image_url
        return {
          id: generateId(),
          image_file: null,
          image_url: stableKey,
          preview_url: previewUrl,
          name: img.name || extractFilename(previewUrl),
          sizeBytes: img.sizeBytes ?? null,
          width: img.width ?? null,
          height: img.height ?? null,
          mimeType: img.mimeType ?? null,
          status: 'existing' as const,
          progress: 100,
          is_cover: false,
        }
      })
    )
  })

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [initialUrls] = useState<Set<string>>(
    () =>
      new Set(
        (initialImages ?? [])
          .map((i) => (i.storage_key ?? i.image_url).trim())
          .filter(Boolean)
      )
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedImage = images.find((img) => img.id === selectedId) || null

  const updateImage = useCallback((id: string, updates: Partial<ImageItem>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    )
  }, [])

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const available = MAX_IMAGES - images.length

      if (available <= 0) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`)
        return
      }

      const toProcess = fileArray.slice(0, available)
      if (fileArray.length > available) {
        toast.warning(`Only ${available} more image(s) can be added`)
      }

      const noCoverYet = !images.some((img) => img.is_cover)
      let firstNewSet = false

      for (const file of toProcess) {
        if (!isAcceptedFile(file)) {
          toast.error(`"${file.name}" is not an image file.`)
          continue
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`"${file.name}" exceeds 5MB limit.`)
          continue
        }

        try {
          const { url, width, height } = await loadImageMeta(file)
          const shouldBeCover = noCoverYet && !firstNewSet
          if (shouldBeCover) firstNewSet = true

          const newImage: ImageItem = {
            id: generateId(),
            image_file: file,
            image_url: null,
            preview_url: url,
            name: file.name,
            sizeBytes: file.size,
            width,
            height,
            mimeType: file.type,
            // In form mode the file is only *staged* — the real upload happens
            // when the form is submitted. Mark it ready immediately rather than
            // faking a progress/upload cycle that can spuriously "fail".
            status: formMode ? 'success' : 'uploading',
            progress: formMode ? 100 : 0,
            is_cover: shouldBeCover,
          }

          setImages((prev) => [...prev, newImage])

          if (!formMode) {
            simulateUpload(
              newImage.id,
              (id, progress) => updateImage(id, { progress }),
              (id, success) =>
                updateImage(id, {
                  status: success ? 'success' : 'error',
                  progress: 100,
                  error: success ? undefined : 'Upload failed. Please retry.',
                })
            )
          }
        } catch {
          toast.error(`Failed to read "${file.name}"`)
        }
      }
    },
    [images, updateImage, formMode]
  )

  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const removed = prev.find((img) => img.id === id)
        if (removed?.image_file && removed.preview_url) {
          URL.revokeObjectURL(removed.preview_url)
        }
        const filtered = prev.filter((img) => img.id !== id)
        return ensureCover(filtered)
      })
      if (selectedId === id) setSelectedId(null)
    },
    [selectedId]
  )

  const setCover = useCallback((id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, is_cover: img.id === id }))
    )
  }, [])

  const clearAll = useCallback(() => {
    for (const img of images) {
      if (img.image_file && img.preview_url)
        URL.revokeObjectURL(img.preview_url)
    }
    setImages([])
    setSelectedId(null)
  }, [images])

  const retryUpload = useCallback(
    (id: string) => {
      if (formMode) {
        updateImage(id, { status: 'success', progress: 100, error: undefined })
        return
      }
      updateImage(id, { status: 'uploading', progress: 0, error: undefined })
      simulateUpload(
        id,
        (imgId, progress) => updateImage(imgId, { progress }),
        (imgId, success) =>
          updateImage(imgId, {
            status: success ? 'success' : 'error',
            progress: 100,
            error: success ? undefined : 'Upload failed. Please retry.',
          })
      )
    },
    [updateImage, formMode]
  )

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }, [])

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Cover outputs
  const coverImage = images.find((img) => img.is_cover) || null
  const cover_url = coverImage?.image_url ?? null
  const cover_file = coverImage?.image_file ?? null

  // Save payload
  const savePayload = useMemo<SavePayload>(() => {
    const currentUrlImages = images.filter((img) => img.image_url)
    const currentUrls = new Set(
      currentUrlImages.flatMap((img) => (img.image_url ? [img.image_url] : []))
    )

    return {
      existing_image_urls_to_keep: [...currentUrls],
      existing_image_urls_to_delete: [...initialUrls].filter(
        (u) => !currentUrls.has(u)
      ),
      new_image_files_to_upload: images
        .filter(
          (img) =>
            img.image_file &&
            (img.status === 'success' || img.status === 'uploading')
        )
        .flatMap((img) => (img.image_file ? [img.image_file] : [])),
      cover_url,
      cover_file,
      ordered_images: images.map((img) => ({
        type: img.image_url ? ('url' as const) : ('file' as const),
        value: img.image_url ?? `file:${img.id}`,
      })),
      ordered_ids: images.map((img) => img.image_url ?? img.id),
    }
  }, [images, initialUrls, cover_url, cover_file])

  return {
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
    canAddMore: images.length < MAX_IMAGES,
    cover_url,
    cover_file,
    savePayload,
  }
}
