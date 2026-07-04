import { Link } from '@tanstack/react-router'
import { Pencil, Plus, ScrollText, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { useCan } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useDeletePolicy } from '@/features/policies/api/mutations'
import { usePoliciesQuery } from '@/features/policies/api/queries'

export function PoliciesPage() {
  const { data, isLoading, isError } = usePoliciesQuery()
  const canManage = useCan(PERMISSIONS.POLICIES_MANAGE)
  const del = useDeletePolicy()
  const policies = data?.items ?? []

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this policy?')) return
    try {
      await del.mutateAsync(id)
      toast.success('Policy deleted')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access policies"
        description="Attribute rules layered on top of roles. DENY always wins."
        actions={
          canManage ? (
            <Button asChild size="sm">
              <Link to="/policies/new">
                <Plus className="size-4" /> New policy
              </Link>
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading policies…</p>
      ) : isError ? (
        <p className="text-destructive text-sm">Failed to load policies.</p>
      ) : policies.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <ScrollText className="text-muted-foreground mx-auto size-8" />
          <p className="mt-2 text-sm font-medium">No policies yet</p>
          <p className="text-muted-foreground text-sm">Roles alone control access until you add refinements here.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Effect</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Applies to</TableHead>
                <TableHead>Conditions</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Badge
                      className={
                        p.effect === 'DENY'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-green-500/10 text-green-600 dark:text-green-400'
                      }
                    >
                      {p.effect}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium">{p.action}</span> on <span className="font-medium">{p.subject}</span>
                    {p.description ? <p className="text-muted-foreground text-xs">{p.description}</p> : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.role_id ? 'Role-scoped' : 'Everyone'}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.conditions ? 'Conditional' : '—'}</TableCell>
                  <TableCell>
                    {canManage ? (
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label="Edit">
                          <Link to="/policies/$policyId/edit" params={{ policyId: p.id }}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Delete" disabled={del.isPending} onClick={() => handleDelete(p.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ) : null}
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
