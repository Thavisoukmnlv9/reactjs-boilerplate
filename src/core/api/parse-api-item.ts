import type { ApiResponse } from '@/core/types/api'

/**
 * Extracts a single resource from an ApiResponse envelope.
 *
 * Backend variants observed in the wild:
 *   - `{ data: { item: Resource } }`
 *   - `{ data: Resource }`                (flat, with `id` on the root)
 *
 * Returns null if the payload is empty or doesn't match either shape.
 */
export function parseApiItem<T extends { id?: unknown }>(
  res: unknown
): T | null {
  const raw = res as ApiResponse<T> | null | undefined
  const d = raw?.data
  if (d == null || typeof d !== 'object') return null
  if ('item' in d) {
    const item = (d as { item: T | null }).item
    return item ?? null
  }
  if ('id' in (d as Record<string, unknown>)) {
    return d as T
  }
  return null
}
