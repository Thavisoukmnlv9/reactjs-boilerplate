'use client'

import * as React from 'react'

import { cn } from '@/core/utils/cn'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type OverflowTooltipProps = {
  /** Text rendered (truncated) in the box. */
  children: React.ReactNode
  /**
   * Tooltip content shown when the text is clipped. Defaults to `children`,
   * which is correct whenever `children` is plain text.
   */
  label?: React.ReactNode
  /** Classes for the truncating element. */
  className?: string
  /** Which side the tooltip pops to. */
  side?: React.ComponentProps<typeof TooltipContent>['side']
  /** Tag of the truncating element. Defaults to `span`. */
  as?: 'span' | 'p' | 'div'
}

/**
 * Renders truncated text and, only when it actually overflows its box, reveals
 * a tooltip with the full content on hover/focus. Measures with a
 * ResizeObserver so it re-checks on layout changes (container resize, i18n).
 */
export function OverflowTooltip({
  children,
  label,
  className,
  side = 'top',
  as: Tag = 'span',
}: OverflowTooltipProps) {
  const ref = React.useRef<HTMLElement>(null)
  const [overflowing, setOverflowing] = React.useState(false)

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    setOverflowing(el.scrollWidth > el.clientWidth)
  }, [])

  React.useLayoutEffect(() => {
    measure()
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  const content = (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('block truncate', className)}
    >
      {children}
    </Tag>
  )

  if (!overflowing) return content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side={side}>{label ?? children}</TooltipContent>
    </Tooltip>
  )
}
