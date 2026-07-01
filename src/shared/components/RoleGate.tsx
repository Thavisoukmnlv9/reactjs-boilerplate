import type * as React from 'react'

import { cn } from '@/core/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import {
  type AppRole,
  useCurrentUserRole,
} from '@/shared/hooks/useCurrentUserRole'

export interface RoleGateProps {
  allowedRoles: AppRole[]
  children: React.ReactNode
  /**
   * When set, renders children but wraps them in a disabled overlay with a
   * tooltip explaining why the action is unavailable, instead of hiding
   * them. Use for "visible but disabled" UX.
   */
  disabledTooltip?: string
  /**
   * Fallback rendered when the user does not meet the role requirement and
   * `disabledTooltip` is not set. Defaults to `null` (nothing rendered).
   */
  fallback?: React.ReactNode
  /** Optional className applied to the wrapper when disabled-with-tooltip. */
  className?: string
}

export function RoleGate({
  allowedRoles,
  children,
  disabledTooltip,
  fallback = null,
  className,
}: RoleGateProps) {
  const { role } = useCurrentUserRole()
  const allowed = role != null && allowedRoles.includes(role)

  if (allowed) return <>{children}</>

  if (disabledTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              role="presentation"
              aria-disabled="true"
              className={cn(
                'inline-flex pointer-events-none opacity-50 cursor-not-allowed',
                className
              )}
            >
              {children}
            </span>
          </TooltipTrigger>
          <TooltipContent>{disabledTooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return <>{fallback}</>
}
