'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'
import { cn } from '@/core/utils/cn'

interface CustomToasterProps extends ToasterProps {
  /**
   * Custom className for the toaster container
   */
  className?: string
  /**
   * Position of the toaster on screen
   * @default "top-right"
   */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  /**
   * Whether to show close button
   * @default true
   */
  closeButton?: boolean
  /**
   * Whether to show progress bar
   * @default true
   */
  richColors?: boolean
  /**
   * Whether to expand toasts on hover
   * @default true
   */
  expand?: boolean
  /**
   * Whether to show toast icons
   * @default true
   */
  visibleToasts?: number
}

const Toaster = ({
  className,
  position = 'top-right',
  closeButton = true,
  richColors = true,
  expand = true,
  visibleToasts = 3,
  ...props
}: CustomToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position={position}
      closeButton={closeButton}
      richColors={richColors}
      expand={expand}
      visibleToasts={visibleToasts}
      toastOptions={{
        duration: 4000,
        className:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
      }}
      className={cn(
        'toaster group',
        // Enhanced positioning and spacing
        'z-[100]',
        // Responsive positioning
        position.includes('top') ? 'top-4' : 'bottom-4',
        position.includes('left')
          ? 'left-4'
          : position.includes('right')
            ? 'right-4'
            : '-translate-x-1/2 left-1/2',
        className
      )}
      style={
        {
          // Normal toast styling using design system colors
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--normal-shadow': 'var(--shadow-lg)',

          // Error toast styling
          '--error-bg': 'var(--destructive)',
          '--error-text': 'var(--destructive-foreground)',
          '--error-border': 'var(--destructive)',
          '--error-shadow': 'var(--shadow-lg)',

          // Success toast styling - using brand colors
          '--success-bg': 'hsl(142.1 76.2% 36.3%)',
          '--success-text': 'hsl(355.7 100% 97.3%)',
          '--success-border': 'hsl(142.1 76.2% 36.3%)',
          '--success-shadow': 'var(--shadow-lg)',

          // Warning toast styling - using brand orange
          '--warning-bg': 'var(--accent)',
          '--warning-text': 'var(--accent-foreground)',
          '--warning-border': 'var(--accent)',
          '--warning-shadow': 'var(--shadow-lg)',

          // Info toast styling
          '--info-bg': 'var(--primary)',
          '--info-text': 'var(--primary-foreground)',
          '--info-border': 'var(--primary)',
          '--info-shadow': 'var(--shadow-lg)',

          // Loading toast styling
          '--loading-bg': 'var(--muted)',
          '--loading-text': 'var(--muted-foreground)',
          '--loading-border': 'var(--border)',
          '--loading-shadow': 'var(--shadow-lg)',

          // Enhanced animations and transitions
          '--toast-transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '--toast-hover-scale': '1.02',

          // Typography using design system
          '--toast-font-family': 'var(--font-sans)',
          '--toast-font-size': 'var(--font-size-sm)',
          '--toast-line-height': 'var(--line-height-normal)',

          // Border radius from design system
          '--toast-border-radius': 'var(--radius)',

          // Enhanced spacing
          '--toast-padding': '0.75rem 1rem',
          '--toast-gap': '0.5rem',

          // Progress bar styling
          '--progress-bg': 'var(--muted)',
          '--progress-fill': 'var(--primary)',

          // Close button styling
          '--close-button-bg': 'transparent',
          '--close-button-hover-bg': 'var(--muted)',
          '--close-button-text': 'var(--muted-foreground)',
          '--close-button-hover-text': 'var(--foreground)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export type { CustomToasterProps as ToasterProps }
export { Toaster }
