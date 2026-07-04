import { useNavigate, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useUpdateUser } from '@/features/users/api/mutations'
import { useUserQuery } from '@/features/users/api/queries'
import { UserForm } from '@/features/users/components/user-form'

export function UserDetailPage() {
  const { memberId } = useParams({ strict: false }) as { memberId?: string }
  const navigate = useNavigate()
  const { data: member, isLoading } = useUserQuery(memberId)
  const update = useUpdateUser()

  if (isLoading || !member) return <p className="text-muted-foreground text-sm">Loading…</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <PageHeader
        title={member.user.name ?? member.user.email ?? 'Member'}
        description={member.status === 'PENDING' ? 'Invite pending — not yet accepted.' : undefined}
      />
      <UserForm
        mode="edit"
        initial={member}
        isPending={update.isPending}
        onCancel={() => void navigate({ to: '/users' })}
        onSubmit={async (v) => {
          try {
            await update.mutateAsync({
              id: member.id,
              data: {
                name: v.name.trim() || undefined,
                role_id: v.role_id,
                branch_ids: v.branch_ids,
                default_branch_id: v.default_branch_id || null,
                staff_title: v.staff_title.trim() || null,
                staff_note: v.staff_note.trim() || null,
              },
            })
            toast.success('Member updated')
            void navigate({ to: '/users' })
          } catch (e) {
            toast.error((e as Error).message)
          }
        }}
      />
    </div>
  )
}
