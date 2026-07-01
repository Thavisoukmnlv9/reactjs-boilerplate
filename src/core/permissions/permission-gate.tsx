import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'
import { useCan } from './permission-hooks'

interface PermissionGateProps {
  permission: string
  /**
   * ``hide`` (default for sections) removes the children entirely.
   * ``disable`` (default for buttons) keeps them visible but greyed
   * with a tooltip explaining why — better discoverability for users
   * who don't know whether a feature is missing or just locked.
   */
  mode?: 'hide' | 'disable'
  /** Optional copy override for the disabled-state tooltip. */
  reason?: string
  /** What to render when ``mode='hide'`` and access is denied. */
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({
  permission,
  mode = 'disable',
  reason,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { t } = useTranslation()
  const allowed = useCan(permission)
  if (allowed) return <>{children}</>
  if (mode === 'hide') return <>{fallback}</>

  const tooltipText =
    reason ?? t('permission.deniedHint', { permission }) ?? 'No permission'

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="inline-block cursor-not-allowed opacity-60"
            aria-disabled="true"
          >
            {Children.map(children, (child) => {
              if (!isValidElement(child)) return child
              return cloneElement(
                child as ReactElement<Record<string, unknown>>,
                {
                  disabled: true,
                  'aria-disabled': true,
                  onClick: (e: React.MouseEvent) => e.preventDefault(),
                }
              )
            })}
          </span>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
