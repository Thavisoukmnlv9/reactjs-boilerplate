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

type NavigateFn = ReturnType<typeof useNavigate>

/**
 * Both the inline and dropdown branches map a RowAction to its click handler the
 * same way: a `to` action navigates (params/search preserved); an `onClick`
 * action is returned by reference so React's event argument passes straight
 * through.
 */
function resolveActionHandler(action: RowAction, navigate: NavigateFn): () => void {
  return 'to' in action
    ? () => void navigate({ to: action.to, params: action.params, search: action.search })
    : action.onClick
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
          const onClick = resolveActionHandler(a, navigate)
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
        const action = resolveActionHandler(a, navigate)
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
