import { PageHeader } from '@/components/common/page-header'
import { RoleForm } from '@/features/roles/components/role-form'

export function RoleCreatePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Create role" description="Name the role and choose exactly what it can do." />
      <RoleForm mode="create" />
    </div>
  )
}
