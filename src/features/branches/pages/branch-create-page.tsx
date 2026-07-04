import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCreateBranch } from '@/features/branches/api/mutations'
import { BranchForm } from '@/features/branches/components/branch-form'

export function BranchCreatePage() {
  const navigate = useNavigate()
  const create = useCreateBranch()

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <PageHeader title="New branch" description="The first branch of an org becomes the main branch automatically." />
      <BranchForm
        mode="create"
        isPending={create.isPending}
        onCancel={() => void navigate({ to: '/branches' })}
        onSubmit={async (values) => {
          try {
            await create.mutateAsync(values)
            toast.success('Branch created')
            void navigate({ to: '/branches' })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
