import { Navigate, useParams } from '@tanstack/react-router'

/** `/policies/$policyId/edit` now opens the in-context edit Sheet on the policies list. */
export function PolicyEditPage() {
  const { policyId } = useParams({ strict: false }) as { policyId?: string }
  return <Navigate to="/policies" search={{ sheet: 'edit', sheetId: policyId }} replace />
}
