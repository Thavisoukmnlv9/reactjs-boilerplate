import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCreatePolicy } from '@/features/policies/api/mutations'
import { PolicyForm } from '@/features/policies/components/policy-form'

export function PolicyCreatePage() {
  const navigate = useNavigate()
  const create = useCreatePolicy()

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      <PageHeader title="New policy" description="Refine what roles can do with an attribute rule." />
      <PolicyForm
        mode="create"
        isPending={create.isPending}
        onCancel={() => void navigate({ to: '/policies' })}
        onSubmit={async (values) => {
          try {
            await create.mutateAsync(values)
            toast.success('Policy created')
            void navigate({ to: '/policies' })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
