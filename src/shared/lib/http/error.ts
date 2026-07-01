import { toast } from 'sonner'
import { ApiError, parseApiError } from '@/core/api/api-error'

export function toErrorMessage(error: unknown): string {
  if (ApiError.isApiError(error)) return error.errorDetail
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

// 402 Payment Required — surfaced by the backend exception hierarchy
// (FeatureNotInPlan, LimitExceeded, SubscriptionPastDue, TrialExpired) so the
// frontend can distinguish "you can't do this on your plan" from a generic 403.
function getBillingActionLabel(code: string | undefined): string {
  switch (code) {
    case 'subscription_past_due':
      return 'Update payment'
    case 'trial_expired':
      return 'Choose a plan'
    default:
      return 'See plans'
  }
}

function showBillingToast(error: ApiError): void {
  const code = error.code
  const label = getBillingActionLabel(code)
  // Sonner toast with an action button that navigates to the plans / billing
  // page. We use window.location to avoid wiring the router here.
  const target =
    code === 'subscription_past_due'
      ? '/platform/billing'
      : '/platform/subscription/plans'
  toast.error(error.errorDetail, {
    action: {
      label,
      onClick: () => window.location.assign(target),
    },
  })
}

export function handleMutationError(error: unknown): void {
  const apiError = parseApiError(error)

  if (apiError.status === 402) {
    showBillingToast(apiError)
    return
  }

  if (apiError.isValidationError) {
    toast.error('Validation Error', { description: apiError.errorDetail })
    return
  }
  if (apiError.isConflict) {
    // Prefer the backend's specific reason (e.g. "Unit 'kg' is referenced by 3
    // inventory item(s)…", "code already exists") — 409 here is a business conflict,
    // not only optimistic-concurrency. Fall back to the generic stale-record hint.
    toast.error('Conflict', {
      description:
        apiError.errorDetail ||
        'This record was modified by another user. Please refresh.',
    })
    return
  }
  if (apiError.isForbidden) {
    toast.error('Forbidden', {
      description: "You don't have permission to do that.",
    })
    return
  }

  toast.error(apiError.status >= 500 ? 'Server Error' : 'Request Error', {
    description: apiError.errorDetail,
  })
}
