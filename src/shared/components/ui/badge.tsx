import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/core/utils/cn'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border font-medium transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        muted:
          'border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80',
        accent:
          'border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/90',
        success:
          'border-transparent bg-success text-success-foreground [a&]:hover:bg-success/90',
        warning:
          'border-transparent bg-warning text-warning-foreground [a&]:hover:bg-warning/90',
        info: 'border-transparent bg-sky-500 text-white dark:bg-sky-600 [a&]:hover:bg-sky-600 dark:[a&]:hover:bg-sky-700',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        default: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type BadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    leadingIcon?: React.ReactNode
    trailingIcon?: React.ReactNode
  }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leadingIcon,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'span'

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {leadingIcon ?? null}
        {children}
        {trailingIcon ?? null}
      </Comp>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
