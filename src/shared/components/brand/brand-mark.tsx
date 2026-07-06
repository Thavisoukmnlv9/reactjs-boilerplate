import { cn } from '@/core/utils/cn'

/**
 * App brand mark — Ministry of Agriculture and Environment emblem.
 *
 * Renders the emblem from `public/logo.png`. Size it via `className`
 * (defaults to `size-6`).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Ministry of Agriculture and Environment"
      className={cn('size-6 shrink-0 object-contain', className)}
    />
  )
}
