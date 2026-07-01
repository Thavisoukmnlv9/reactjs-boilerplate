import * as TabsPrimitive from '@radix-ui/react-tabs'
import { motion } from 'motion/react'
import type * as React from 'react'

import { cn } from '@/core/utils/cn'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-2 py-1 font-medium text-foreground text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {leadingIcon ?? null}
      {children}
      {trailingIcon ?? null}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      asChild
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    >
      <motion.div
        key={props.value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
