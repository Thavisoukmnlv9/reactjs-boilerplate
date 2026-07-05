import { Navigate } from '@tanstack/react-router'

/** `/policies/new` now opens the in-context create Sheet on the policies list. */
export function PolicyCreatePage() {
  return <Navigate to="/policies" search={{ sheet: 'create' }} replace />
}
