import { cn } from '@/core/utils/cn'

/**
 * Business Sync — "The Hub Mark".
 *
 * One orange core linked to three satellites: every channel synced to a single
 * source of truth. Renders the full-color rounded tile lockup. Size it via
 * `className` (defaults to `size-6`).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn('size-6 shrink-0', className)}
      fill="none"
      role="img"
      aria-label="Business Sync"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="119.5" fill="#F54A00" />
      <g stroke="#fff" strokeWidth="38" strokeLinecap="round">
        <line x1="256" y1="256" x2="256" y2="128" />
        <line x1="256" y1="256" x2="136.5" y2="367" />
        <line x1="256" y1="256" x2="375.5" y2="367" />
      </g>
      <circle cx="256" cy="128" r="43" fill="#fff" />
      <circle cx="136.5" cy="367" r="43" fill="#fff" />
      <circle cx="375.5" cy="367" r="43" fill="#fff" />
      <rect
        x="209"
        y="209"
        width="94"
        height="94"
        rx="28"
        fill="#F54A00"
        stroke="#fff"
        strokeWidth="17"
      />
    </svg>
  )
}
