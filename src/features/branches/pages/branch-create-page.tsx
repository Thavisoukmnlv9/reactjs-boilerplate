import { Navigate } from '@tanstack/react-router'

/** `/branches/new` now opens the in-context create Sheet on the branches list. */
export function BranchCreatePage() {
  return <Navigate to="/branches" search={{ sheet: 'create' }} replace />
}
