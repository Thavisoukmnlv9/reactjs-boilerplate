import { Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

interface Props {
  feature?: string
  reason?:
    | 'feature_not_in_plan'
    | 'subscription_limit_exceeded'
    | 'subscription_past_due'
    | 'trial_expired'
  title?: string
  description?: string
  ctaLabel?: string
  href?: string
}

const DEFAULT_COPY: Record<
  NonNullable<Props['reason']>,
  { title: string; description: string }
> = {
  feature_not_in_plan: {
    title: 'Upgrade to unlock this feature',
    description:
      "This feature isn't included in your current plan. Upgrade to use it.",
  },
  subscription_limit_exceeded: {
    title: "You've reached your plan limit",
    description: 'Upgrade to a higher tier to add more resources.',
  },
  subscription_past_due: {
    title: 'Your subscription is past due',
    description: 'Update your payment method to restore access.',
  },
  trial_expired: {
    title: 'Your trial has ended',
    description: 'Pick a plan to keep using paid features.',
  },
}

export function UpgradeCTA({
  feature,
  reason = 'feature_not_in_plan',
  title,
  description,
  ctaLabel,
  href = '/platform/subscription/plans',
}: Props) {
  const copy = DEFAULT_COPY[reason]
  const resolvedTitle = title ?? copy.title
  const resolvedDesc = description ?? copy.description
  const resolvedCta =
    ctaLabel ??
    (reason === 'subscription_past_due' ? 'Update payment' : 'See plans')

  const url = feature
    ? `${href}?highlight=${encodeURIComponent(feature)}`
    : href

  return (
    <Card className="border-dashed">
      <CardContent className="flex items-start gap-4 p-6">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-medium">{resolvedTitle}</h3>
          <p className="text-sm text-muted-foreground">{resolvedDesc}</p>
        </div>
        <Button asChild>
          <Link to={url}>{resolvedCta}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
