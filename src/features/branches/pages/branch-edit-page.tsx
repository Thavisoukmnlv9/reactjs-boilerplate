import { Navigate, useParams } from '@tanstack/react-router'

/** `/branches/$branchId/edit` now opens the in-context edit Sheet on the branches list. */
export function BranchEditPage() {
  const { branchId } = useParams({ strict: false }) as { branchId?: string }
  return <Navigate to="/branches" search={{ sheet: 'edit', sheetId: branchId }} replace />
}
