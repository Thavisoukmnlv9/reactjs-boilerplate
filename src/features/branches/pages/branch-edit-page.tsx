import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useUpdateBranch } from '@/features/branches/api/mutations'
import { useBranchQuery } from '@/features/branches/api/queries'
import { BranchForm } from '@/features/branches/components/branch-form'

export function BranchEditPage() {
  const { branchId } = useParams({ strict: false }) as { branchId?: string }
  const navigate = useNavigate()
  const { data: branch, isLoading } = useBranchQuery(branchId)
  const update = useUpdateBranch()

  if (isLoading || !branch) return <p className="text-muted-foreground text-sm">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <PageHeader title={`Edit ${branch.name}`} description="Use the branches list to change which branch is main." />
      <BranchForm
        mode="edit"
        initial={branch}
        isPending={update.isPending}
        onCancel={() => void navigate({ to: '/branches' })}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync({ id: branch.id, data: values })
            toast.success('Branch updated')
            void navigate({ to: '/branches' })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
