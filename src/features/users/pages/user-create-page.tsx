import { useNavigate } from '@tanstack/react-router'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInviteUser } from '@/features/users/api/mutations'
import { UserForm, type UserFormValues } from '@/features/users/components/user-form'

export function UserCreatePage() {
  const navigate = useNavigate()
  const invite = useInviteUser()
  const [issued, setIssued] = useState<{ token: string; email: string } | null>(null)
  const link = issued ? `${window.location.origin}/accept-invite?token=${issued.token}` : ''

  async function handleSubmit(v: UserFormValues) {
    try {
      const res = await invite.mutateAsync({
        email: v.email.trim(),
        name: v.name.trim() || undefined,
        role_id: v.role_id,
        branch_ids: v.branch_ids,
        default_branch_id: v.default_branch_id || null,
        staff_title: v.staff_title.trim() || null,
        staff_note: v.staff_note.trim() || null,
      })
      setIssued({ token: res.invite_token, email: res.member.user.email ?? v.email })
      toast.success('Invite created')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <PageHeader title="Invite member" description="Send an invite link — the member sets their own password." />

      {issued ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Check className="size-4 text-green-600" /> Invite ready for {issued.email}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <code className="flex-1 truncate text-xs">{link}</code>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Copy invite link"
                onClick={() => {
                  void navigator.clipboard.writeText(link)
                  toast.success('Invite link copied')
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">Valid for 7 days.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIssued(null)}>
                Invite another
              </Button>
              <Button onClick={() => void navigate({ to: '/users' })}>Done</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <UserForm mode="create" isPending={invite.isPending} onCancel={() => void navigate({ to: '/users' })} onSubmit={handleSubmit} />
      )}
    </div>
  )
}
