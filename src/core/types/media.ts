/** Object-stored image metadata (POS branches, products, menus, etc.). */
export interface StoredMediaImage {
  id?: string
  is_cover: boolean
  url: string
  storage_key?: string
  size?: number
  content_type?: string
  file_name?: string
}

/** Storage key for sync/delete; prefers ``storage_key``, else falls back to ``url`` (legacy). */
export function mediaImageStorageKey(m: StoredMediaImage): string {
  const sk = m.storage_key?.trim()
  if (sk) return sk
  return m.url
}
