import { MoreVerticalIcon } from 'lucide-react'
import type React from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export type SimpleDropdownItem = {
  label: string
  action?: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

export type SimpleDropdownProps = {
  items: (SimpleDropdownItem | { type: 'separator' })[]
  triggerLabel?: React.ReactNode
  align?: React.ComponentProps<typeof DropdownMenuContent>['align']
  side?: React.ComponentProps<typeof DropdownMenuContent>['side']
  onSelect?: ((event: Event) => void) | undefined
  className?: string
}

export function SimpleDropdown({
  items,
  triggerLabel,
  align = 'end',
  side = 'bottom',
  className,
  onSelect,
}: SimpleDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          {triggerLabel ?? <MoreVerticalIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        {items.map((it, idx) => {
          if ('type' in it && it.type === 'separator') {
            return <DropdownMenuSeparator key={`sep-${it.type}-${idx}`} />
          }
          const item = it as SimpleDropdownItem
          return (
            <DropdownMenuItem
              key={item.label}
              onClick={() => {
                item.action?.()
              }}
              onSelect={onSelect}
              data-variant={item.variant}
              disabled={item.disabled}
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
