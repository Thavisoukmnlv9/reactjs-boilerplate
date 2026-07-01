import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

import { UpgradeCTA } from './upgrade-cta'
import { useCan } from './use-entitlements'

interface Props {
  feature: string
  /** Optional human label for the feature, used in the lock tooltip. */
  label?: string
  /** "lock" disables children with a tooltip; "hide" returns null; "cta" renders the upgrade card. */
  fallback?: 'lock' | 'hide' | 'cta'
  children: ReactNode
}

/**
 * Render children only if the org's plan includes `feature`.
 *
 * - fallback="lock"  → children rendered with reduced opacity + tooltip on hover
 * - fallback="hide"  → returns null (caller takes responsibility for the empty state)
 * - fallback="cta"   → renders an UpgradeCTA card in place of children
 */
export function FeatureGate({
  feature,
  label,
  fallback = 'lock',
  children,
}: Props) {
  const allowed = useCan(feature)
  if (allowed) return <>{children}</>

  if (fallback === 'hide') return null
  if (fallback === 'cta')
    return <UpgradeCTA feature={feature} reason="feature_not_in_plan" />

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            aria-disabled="true"
            className="relative inline-flex cursor-not-allowed opacity-50"
          >
            {children}
            <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-1 ring-border">
              <Lock className="h-2.5 w-2.5" />
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {label ?? feature} is not included in your plan.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
