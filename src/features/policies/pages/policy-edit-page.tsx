import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useUpdatePolicy } from '@/features/policies/api/mutations'
import { usePolicyQuery } from '@/features/policies/api/queries'
import { PolicyForm } from '@/features/policies/components/policy-form'

export function PolicyEditPage() {
  const { policyId } = useParams({ strict: false }) as { policyId?: string }
  const navigate = useNavigate()
  const { data: policy, isLoading } = usePolicyQuery(policyId)
  const update = useUpdatePolicy()

  if (isLoading || !policy) return <p className="text-muted-foreground text-sm">Loading…</p>

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      <PageHeader title="Edit policy" />
      <PolicyForm
        mode="edit"
        initial={policy}
        isPending={update.isPending}
        onCancel={() => void navigate({ to: '/policies' })}
        onSubmit={async (values) => {
          try {
            await update.mutateAsync({ id: policy.id, data: values })
            toast.success('Policy updated')
            void navigate({ to: '/policies' })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
