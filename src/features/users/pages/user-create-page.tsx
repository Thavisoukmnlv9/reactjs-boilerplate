import { Navigate } from '@tanstack/react-router'

/** `/users/new` now opens the in-context create Sheet on the members list. */
export function UserCreatePage() {
  return <Navigate to="/users" search={{ sheet: 'create' }} replace />
}
