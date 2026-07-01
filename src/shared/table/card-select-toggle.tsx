import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/core/utils/cn'

export type CardSelectToggleProps = {
  checked: boolean
  onCheckedChange: () => void
  /** Accessible label, e.g. `Select ${item.name}`. */
  label: string
  /** `'surface'` for cards without a cover image (white ring would vanish). */
  tone?: 'photo' | 'surface'
  className?: string
}

/**
 * Circular glass selection toggle for grid cards. Pin it inside a `relative`
 * wrapper; it anchors itself to the top-left corner and fills brand-orange with
 * a check when selected — legible over any cover image or plain card surface.
 */
export function CardSelectToggle({
  checked,
  onCheckedChange,
  label,
  tone = 'photo',
  className,
}: CardSelectToggleProps) {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={() => onCheckedChange()}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className={cn(
        'group absolute left-3 top-3 z-10 grid size-7 place-items-center rounded-full border outline-none backdrop-blur-sm',
        'transition-[background-color,border-color,transform,box-shadow] duration-200 ease-[var(--ui-ease-spring,cubic-bezier(0.32,0.72,0,1))]',
        tone === 'photo'
          ? 'border-white/85 bg-black/30 text-white shadow-sm hover:scale-105 hover:bg-black/45'
          : 'border-input bg-background/90 text-muted-foreground shadow-sm hover:scale-105 hover:bg-background',
        'data-[state=checked]:border-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-md',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        className={cn(
          'transition-[transform,opacity] duration-150 ease-out',
          checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        )}
      >
        <CheckIcon className="size-4" strokeWidth={3} aria-hidden />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
