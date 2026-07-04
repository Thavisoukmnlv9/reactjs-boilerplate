import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useUpdateRole } from '@/features/roles/api/mutations'
import { useRoleQuery } from '@/features/roles/api/queries'
import { RoleForm } from '@/features/roles/components/role-form'

export function RoleEditPage() {
  const { roleId } = useParams({ strict: false }) as { roleId?: string }
  const navigate = useNavigate()
  const { data: role, isLoading } = useRoleQuery(roleId)
  const update = useUpdateRole()

  if (isLoading || !role) return <p className="text-muted-foreground text-sm">Loading…</p>
  const isSystem = role.is_system

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <PageHeader
        title={`Edit ${role.name}`}
        description={isSystem ? 'System roles are read-only. Duplicate one to customize it.' : undefined}
      />
      <RoleForm
        mode="edit"
        disabled={isSystem}
        initial={{ name: role.name, description: role.description, permission_codes: role.permission_codes }}
        isPending={update.isPending}
        onCancel={() => void navigate({ to: '/roles/$roleId', params: { roleId: role.id } })}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync({ id: role.id, data: values })
            toast.success('Role updated')
            void navigate({ to: '/roles/$roleId', params: { roleId: role.id } })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
