import { Link } from '@tanstack/react-router'
import { Building2, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { useCan } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useDeleteBranch, useMakeMainBranch } from '@/features/branches/api/mutations'
import { useBranchesQuery } from '@/features/branches/api/queries'

export function BranchesPage() {
  const { data, isLoading, isError } = useBranchesQuery()
  const canManage = useCan(PERMISSIONS.BRANCHES_MANAGE)
  const canDelete = useCan(PERMISSIONS.BRANCHES_DELETE)
  const del = useDeleteBranch()
  const makeMain = useMakeMainBranch()
  const branches = data?.items ?? []

  async function handleMakeMain(id: string, name: string) {
    if (!window.confirm(`Make "${name}" the main branch?`)) return
    try {
      await makeMain.mutateAsync(id)
      toast.success('Main branch updated')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }
  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await del.mutateAsync(id)
      toast.success('Branch deleted')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branches"
        description="Locations members operate. Exactly one branch is the main branch."
        actions={
          canManage ? (
            <Button asChild size="sm">
              <Link to="/branches/new">
                <Plus className="size-4" /> New branch
              </Link>
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading branches…</p>
      ) : isError ? (
        <p className="text-destructive text-sm">Failed to load branches.</p>
      ) : branches.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <Building2 className="text-muted-foreground mx-auto size-8" />
          <p className="mt-2 text-sm font-medium">No branches yet</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Vertical</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <span className="font-medium">{b.name}</span>
                    {b.is_main ? (
                      <Badge variant="secondary" className="ml-2 gap-1 text-xs">
                        <Star className="size-3" /> Main
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.code ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{b.vertical ?? '—'}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm">
                      <span className={`size-2 rounded-full ${b.is_active ? 'bg-green-500' : 'bg-muted-foreground/40'}`} />
                      {b.is_active ? 'Active' : 'Archived'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {canManage && !b.is_main ? (
                        <Button variant="ghost" size="icon" aria-label="Make main" title="Make main" onClick={() => handleMakeMain(b.id, b.name)}>
                          <Star className="size-4" />
                        </Button>
                      ) : null}
                      {canManage ? (
                        <Button asChild variant="ghost" size="icon" aria-label="Edit">
                          <Link to="/branches/$branchId/edit" params={{ branchId: b.id }}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                      ) : null}
                      {canDelete && !b.is_main ? (
                        <Button variant="ghost" size="icon" aria-label="Delete" disabled={del.isPending} onClick={() => handleDelete(b.id, b.name)}>
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
