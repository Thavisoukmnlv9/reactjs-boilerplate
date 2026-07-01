import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'

/**
 * Helper to create a virtualizer with common configuration
 * @param containerRef Reference to the scrollable container
 * @param itemCount Total number of items to virtualize
 * @param overscan Number of items to render outside the viewport
 * @returns Virtualizer instance
 */
export function createVirtualizer(
  containerRef: RefObject<HTMLElement | null>,
  itemCount: number,
  overscan = 5
) {
  return useVirtualizer({
    count: itemCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 36, // Default item height
    overscan,
  })
}
