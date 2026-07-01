import { useNavigate } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { useIsMobile } from '@/core/hooks/use-mobile'
import { Button } from '@/shared/components/ui/button'
import { SimpleDropdown } from '@/shared/table/simple-dropdown'

export type RowAction =
  | {
      label: string
      onClick: () => void
      variant?: 'destructive' | 'secondary' | 'outline'
      icon?: LucideIcon
    }
  | {
      label: string
      to: string
      params?: Record<string, string>
      search?: Record<string, unknown>
      variant?: 'destructive' | 'secondary' | 'outline'
      icon?: LucideIcon
    }

export function RowActions({
  actions,
  maxInline = 2,
}: {
  actions: RowAction[]
  maxInline?: number
}) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const inline = actions.length <= maxInline || isMobile

  if (inline) {
    return (
      <div className="flex gap-2">
        {actions.map((a) => {
          const Icon = a.icon
          const onClick =
            'to' in a
              ? () =>
                  void navigate({
                    to: a.to,
                    params: a.params,
                    search: a.search,
                  })
              : a.onClick
          return (
            <Button
              key={a.label}
              variant={
                a.variant ?? (a.label === 'Edit' ? 'outline' : 'secondary')
              }
              size="sm"
              onClick={onClick}
            >
              {Icon ? <Icon className="mr-1.5 h-3.5 w-3.5" /> : null}
              {a.label}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <SimpleDropdown
      items={actions.map((a) => {
        const Icon = a.icon
        const action =
          'to' in a
            ? () =>
                void navigate({ to: a.to, params: a.params, search: a.search })
            : a.onClick
        return {
          label: a.label,
          icon: Icon ? <Icon className="mr-2 h-4 w-4" /> : undefined,
          variant: a.variant === 'destructive' ? 'destructive' : undefined,
          action,
        }
      })}
    />
  )
}
