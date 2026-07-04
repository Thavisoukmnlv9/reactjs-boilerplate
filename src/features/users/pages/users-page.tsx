import { Link } from '@tanstack/react-router'
import { Send, Trash2, UserPlus, Users as UsersIcon } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { useCan } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useRolesQuery } from '@/features/roles/api/queries'
import { useRemoveUser, useResendInvite } from '@/features/users/api/mutations'
import { useUsersQuery } from '@/features/users/api/queries'

function initials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

const statusTone: Record<string, string> = {
  ACTIVE: 'bg-green-500/10 text-green-600 dark:text-green-400',
  PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  INACTIVE: 'bg-muted text-muted-foreground',
  SUSPENDED: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export function UsersPage() {
  const { data, isLoading, isError } = useUsersQuery()
  const { data: rolesData } = useRolesQuery()
  const canInvite = useCan(PERMISSIONS.USERS_INVITE)
  const canManage = useCan(PERMISSIONS.USERS_MANAGE)
  const remove = useRemoveUser()
  const resend = useResendInvite()
  const members = data?.items ?? []
  const roleName = (id: string | null) => rolesData?.items.find((r) => r.id === id)?.name ?? '—'

  async function handleResend(id: string) {
    try {
      const res = await resend.mutateAsync(id)
      const url = `${window.location.origin}/accept-invite?token=${res.invite_token}`
      await navigator.clipboard.writeText(url)
      toast.success('New invite link copied')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }
  async function handleRemove(id: string, name: string | null) {
    if (!window.confirm(`Remove ${name ?? 'this member'}?`)) return
    try {
      await remove.mutateAsync(id)
      toast.success('Member removed')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Members of your organization and their roles."
        actions={
          canInvite ? (
            <Button asChild size="sm">
              <Link to="/users/new">
                <UserPlus className="size-4" /> Invite member
              </Link>
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading members…</p>
      ) : isError ? (
        <p className="text-destructive text-sm">Failed to load members.</p>
      ) : members.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <UsersIcon className="text-muted-foreground mx-auto size-8" />
          <p className="mt-2 text-sm font-medium">No members yet</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branches</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{initials(m.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to="/users/$memberId" params={{ memberId: m.id }} className="font-medium hover:underline">
                          {m.user.name ?? m.user.email}
                        </Link>
                        <p className="text-muted-foreground text-xs">{m.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {roleName(m.role_id)}
                    {m.is_owner ? <Badge variant="secondary" className="ml-1 text-xs">Owner</Badge> : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.branch_ids.length}</TableCell>
                  <TableCell>
                    <Badge className={statusTone[m.status] ?? 'bg-muted'}>{m.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {canInvite && m.status === 'PENDING' ? (
                        <Button variant="ghost" size="icon" aria-label="Resend invite" title="Resend invite" onClick={() => handleResend(m.id)}>
                          <Send className="size-4" />
                        </Button>
                      ) : null}
                      {canManage && !m.is_owner ? (
                        <Button variant="ghost" size="icon" aria-label="Remove" disabled={remove.isPending} onClick={() => handleRemove(m.id, m.user.name)}>
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
