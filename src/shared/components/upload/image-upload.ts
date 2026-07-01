export type ImageStatus =
  | 'existing'
  | 'queued'
  | 'uploading'
  | 'success'
  | 'error'

export interface ImageItem {
  id: string
  image_file: File | null
  image_url: string | null
  preview_url: string
  name: string
  sizeBytes: number | null
  width: number | null
  height: number | null
  mimeType: string | null
  status: ImageStatus
  progress: number
  is_cover: boolean
  error?: string
}

export interface ExistingImage {
  /** Display URL (`<img src>`), e.g. presigned HTTPS URL. */
  image_url: string
  /** Object storage key when `image_url` is not the key (e.g. Wasabi). Omit for legacy single-field URLs. */
  storage_key?: string
  width?: number
  height?: number
  sizeBytes?: number
  mimeType?: string
  name?: string
}

export interface SavePayload {
  existing_image_urls_to_keep: string[]
  existing_image_urls_to_delete: string[]
  new_image_files_to_upload: File[]
  cover_url: string | null
  cover_file: File | null
  ordered_images: Array<{ type: 'url' | 'file'; value: string }>
  /** Same order as ordered_images; value is image url (existing) or `file:${id}` (new). Use for mapping description by id/url. */
  ordered_ids: string[]
}

/**
 * The frontend accepts *any* image and uploads it as-is. Deciding which
 * formats to re-encode to AVIF (and which to keep verbatim, e.g. SVG) lives
 * entirely in the backend's `prepare_image_for_upload`. We only keep a short
 * extension list as a fallback for files the browser hands over with an empty
 * or generic MIME type (common for `.heic`/`.tif`).
 */
const KNOWN_IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'bmp',
  'tif',
  'tiff',
  'heic',
  'heif',
  'avif',
  'svg',
])

/** Short label shown in hints/messages. */
export const ACCEPTED_FORMATS_LABEL = 'Any image, converted to AVIF'

/** `accept` attribute — let the OS file picker offer every image type. */
export const ACCEPT_ATTR = 'image/*'

function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
}

/**
 * Whether a dropped/selected file is an image. Accepts anything with an
 * `image/*` MIME, falling back to a known image extension when the browser
 * reports an empty or generic type (e.g. HEIC/TIFF). The backend is the
 * authority on what actually gets converted vs. rejected.
 */
export function isAcceptedFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return KNOWN_IMAGE_EXTENSIONS.has(fileExtension(file.name))
}

/** Formats that browsers generally cannot render in an `<img>` for preview. */
const UNPREVIEWABLE_EXTENSIONS = new Set(['heic', 'heif', 'tif', 'tiff'])
const UNPREVIEWABLE_TYPES = new Set(['image/heic', 'image/heif', 'image/tiff'])

/** Whether this file can likely be previewed via `<img>` in the browser. */
export function isPreviewableFile(file: File): boolean {
  if (file.type && UNPREVIEWABLE_TYPES.has(file.type)) return false
  return !UNPREVIEWABLE_EXTENSIONS.has(fileExtension(file.name))
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const MAX_IMAGES = 10

export function formatFileSize(bytes: number | null): string {
  if (bytes == null) return 'Unknown'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFormatLabel(mime: string | null): string {
  if (!mime) return 'Unknown'
  const map: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/avif': 'AVIF',
    'image/tiff': 'TIFF',
    'image/heic': 'HEIC',
    'image/heif': 'HEIF',
    'image/svg+xml': 'SVG',
  }
  return map[mime] || mime
}

export function computeAspectRatio(w: number | null, h: number | null): string {
  if (!w || !h) return 'N/A'
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(w, h)
  return `${w / d}:${h / d}`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}
