import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCreateRole } from '@/features/roles/api/mutations'
import { RoleForm } from '@/features/roles/components/role-form'

export function RoleCreatePage() {
  const navigate = useNavigate()
  const create = useCreateRole()

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <PageHeader title="Create role" description="Name the role and choose exactly what it can do." />
      <RoleForm
        mode="create"
        isPending={create.isPending}
        onCancel={() => void navigate({ to: '/roles' })}
        onSubmit={async (values) => {
          try {
            const role = await create.mutateAsync(values)
            toast.success('Role created')
            void navigate({ to: '/roles/$roleId', params: { roleId: role.id } })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
