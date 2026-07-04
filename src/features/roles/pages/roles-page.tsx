import { Link } from '@tanstack/react-router'
import { Pencil, Plus, Shield, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { useCan } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useDeleteRole } from '@/features/roles/api/mutations'
import { useRolesQuery } from '@/features/roles/api/queries'

export function RolesPage() {
  const { data, isLoading, isError } = useRolesQuery()
  const canManage = useCan(PERMISSIONS.ROLES_MANAGE)
  const del = useDeleteRole()
  const roles = data?.items ?? []

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete the "${name}" role?`)) return
    try {
      await del.mutateAsync(id)
      toast.success('Role deleted')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Roles bundle permissions. Assign them to members to control access."
        actions={
          canManage ? (
            <Button asChild size="sm">
              <Link to="/roles/new">
                <Plus className="size-4" /> New role
              </Link>
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading roles…</p>
      ) : isError ? (
        <p className="text-destructive text-sm">Failed to load roles.</p>
      ) : roles.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <Shield className="text-muted-foreground mx-auto size-8" />
          <p className="mt-2 text-sm font-medium">No roles yet</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => {
                const locked = r.is_system || r.member_count > 0
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link to="/roles/$roleId" params={{ roleId: r.id }} className="font-medium hover:underline">
                        {r.name}
                      </Link>{' '}
                      {r.is_system ? (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          System
                        </Badge>
                      ) : null}
                      {r.description ? <p className="text-muted-foreground text-xs">{r.description}</p> : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.permission_codes.length}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.member_count}</TableCell>
                    <TableCell>
                      {canManage && !r.is_system ? (
                        <div className="flex justify-end gap-1">
                          <Button asChild variant="ghost" size="icon" aria-label="Edit">
                            <Link to="/roles/$roleId/edit" params={{ roleId: r.id }}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            disabled={locked || del.isPending}
                            title={r.member_count > 0 ? 'Role is in use' : undefined}
                            onClick={() => handleDelete(r.id, r.name)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
