import { Navigate, useParams } from '@tanstack/react-router'

/** `/users/$memberId` now opens the in-context edit Sheet on the members list. */
export function UserDetailPage() {
  const { memberId } = useParams({ strict: false }) as { memberId?: string }
  return <Navigate to="/users" search={{ sheet: 'edit', sheetId: memberId }} replace />
}
