import { useParams } from '@tanstack/react-router'

import { PageHeader } from '@/components/common/page-header'
import { useRoleQuery } from '@/features/roles/api/queries'
import { RoleForm } from '@/features/roles/components/role-form'

export function RoleEditPage() {
  const { roleId } = useParams({ strict: false }) as { roleId?: string }
  const { data: role, isLoading } = useRoleQuery(roleId)

  if (isLoading || !role) return <p className="text-muted-foreground text-sm">Loading…</p>

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title={`Edit ${role.name}`}
        description={role.is_system ? 'System roles are read-only. Duplicate one to customize it.' : undefined}
      />
      <RoleForm mode="edit" initial={role} readOnly={role.is_system} />
    </div>
  )
}
