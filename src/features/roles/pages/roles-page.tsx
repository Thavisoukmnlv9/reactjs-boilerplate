import { useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Shield, ShieldCheck, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCan } from '@/core/access'
import { endpoints } from '@/core/api/endpoints'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useBulkRoles, useDeleteRole } from '@/features/roles/api/mutations'
import { useRolesQuery, useRoleStatsQuery } from '@/features/roles/api/queries'
import type { RoleView } from '@/features/roles/api/types'
import { summarizeBulk } from '@/shared/api/bulk'
import { downloadFile } from '@/shared/api/download'
import { StatsCardsRow } from '@/shared/components/data-display/stats-cards-row'
import { EmptyState } from '@/shared/components/states/empty-state'
import { ErrorState } from '@/shared/components/states/error-state'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { confirm } from '@/shared/components/ui/confirm'
import { DataTable } from '@/shared/table/data-table'
import { RowActions, type RowAction } from '@/shared/table/row-actions'
import { createSelectColumn } from '@/shared/table/select-column'
import { TableBulkActionBar } from '@/shared/table/table-bulk-action-bar'
import { TableExportMenu } from '@/shared/table/table-export-menu'
import { TableSearch } from '@/shared/table/table-search'
import { TableToolbar } from '@/shared/table/table-toolbar'
import { toQueryString, useTableUrlState } from '@/shared/table/table-url-state'
import { useTableSelection } from '@/shared/table/use-table-selection'

export function RolesPage() {
  const navigate = useNavigate()
  const { search, pageIndex, pageSize, setPagination, setSort, setQuery } = useTableUrlState()

  const canManage = useCan(PERMISSIONS.ROLES_MANAGE)

  const rolesQuery = useRolesQuery({
    q: search.q,
    sort: search.sort,
    order: search.order,
    limit: pageSize,
    offset: pageIndex * pageSize,
  })
  const statsQuery = useRoleStatsQuery()

  const items = rolesQuery.data?.items ?? []
  const total = rolesQuery.data?.total ?? 0

  const selection = useTableSelection(items)
  const bulk = useBulkRoles()
  const del = useDeleteRole()

  async function handleDelete(id: string, name: string) {
    const ok = await confirm({ title: `Delete the "${name}" role?`, description: 'This cannot be undone.', confirmText: 'Delete', confirmVariant: 'destructive' })
    if (!ok) return
    try {
      await del.mutateAsync(id)
      toast.success('Role deleted')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleBulkDelete() {
    const ok = await confirm({
      title: `Delete ${selection.selectedCount} role${selection.selectedCount === 1 ? '' : 's'}?`,
      description: 'System roles and roles still in use are skipped.',
      confirmText: 'Delete',
      confirmVariant: 'destructive',
    })
    if (!ok) return
    try {
      const result = await bulk.mutateAsync({ action: 'delete', ids: selection.ids })
      const { ok: good, message } = summarizeBulk(result, 'deleted')
      if (good) toast.success(message)
      else toast.error(message)
      selection.clear()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleExport() {
    try {
      await downloadFile(`${endpoints.roles.export}${toQueryString({ q: search.q, sort: search.sort, order: search.order, format: 'csv' })}`, 'roles.csv')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const columns = useMemo<ColumnDef<RoleView, unknown>[]>(() => {
    const base: ColumnDef<RoleView, unknown>[] = [
      {
        id: 'name',
        header: 'Role',
        enableSorting: true,
        cell: ({ row }) => {
          const r = row.original
          return (
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
                <Shield />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-medium leading-tight">
                  <button type="button" className="truncate hover:underline" onClick={() => void navigate({ to: '/roles/$roleId', params: { roleId: r.id } })}>
                    {r.name}
                  </button>
                  {r.is_system ? <Badge variant="secondary" className="text-[10px]">System</Badge> : null}
                </div>
                {r.description ? <div className="truncate text-muted-foreground text-xs">{r.description}</div> : null}
              </div>
            </div>
          )
        },
      },
      { id: 'permissions', header: 'Permissions', enableSorting: false, cell: ({ row }) => <span className="tabular-nums text-muted-foreground text-sm">{row.original.permission_codes.length}</span> },
      { id: 'members', header: 'Members', enableSorting: false, cell: ({ row }) => <span className="tabular-nums text-muted-foreground text-sm">{row.original.member_count}</span> },
      {
        id: 'is_system',
        header: 'Type',
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant={row.original.is_system ? 'secondary' : 'outline'}>{row.original.is_system ? 'System' : 'Custom'}</Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          const r = row.original
          if (!canManage || r.is_system) return null
          const actions: RowAction[] = [{ label: 'Edit', icon: Pencil, to: '/roles/$roleId/edit', params: { roleId: r.id } }]
          if (r.member_count === 0) actions.push({ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => void handleDelete(r.id, r.name) })
          return <div className="flex justify-end"><RowActions actions={actions} /></div>
        },
      },
    ]
    return canManage ? [createSelectColumn(selection, 'role'), ...base] : base
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage, selection, navigate])

  const statItems = [
    { id: 'total', label: 'Total roles', value: statsQuery.data?.total ?? 0, icon: <Shield /> },
    { id: 'system', label: 'System', value: statsQuery.data?.system ?? 0 },
    { id: 'custom', label: 'Custom', value: statsQuery.data?.custom ?? 0, tone: 'accent' as const },
    { id: 'unused', label: 'Unused', value: statsQuery.data?.unused ?? 0, tone: 'warning' as const },
  ]

  const hasFilters = Boolean(search.q)
  const unfilteredEmpty = !rolesQuery.isLoading && !rolesQuery.isError && total === 0 && !hasFilters

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Roles bundle permissions. Assign them to members to control access."
        actions={
          canManage ? (
            <Button size="sm" onClick={() => void navigate({ to: '/roles/new' })}>
              <Plus className="size-4" /> New role
            </Button>
          ) : undefined
        }
      />

      <StatsCardsRow items={statItems} isLoading={statsQuery.isLoading} />

      {unfilteredEmpty ? (
        <EmptyState
          icon={<ShieldCheck className="size-7" />}
          title="No roles yet"
          description="Create a custom role to grant members a tailored set of permissions."
          action={canManage ? <Button onClick={() => void navigate({ to: '/roles/new' })}><Plus className="size-4" /> New role</Button> : undefined}
        />
      ) : rolesQuery.isError ? (
        <ErrorState message={(rolesQuery.error as Error)?.message} onRetry={() => void rolesQuery.refetch()} />
      ) : (
        <div>
          <TableToolbar
            left={<TableSearch value={search.q ?? ''} onChange={setQuery} placeholder="Search roles…" />}
            right={<TableExportMenu onExport={{ csv: handleExport }} />}
          />
          <DataTable
            key={`${search.q ?? ''}|${pageSize}`}
            columns={columns}
            data={items}
            totalCount={total}
            isLoading={rolesQuery.isLoading}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={setPagination}
            sortBy={search.sort}
            sortOrder={search.order}
            onSortingChange={(s) => {
              const c = s[0]
              setSort(c?.id || undefined, c?.id ? (c.desc ? 'desc' : 'asc') : undefined)
            }}
            enableRowSelection={false}
            enableFiltering={false}
            keyExtractor={(r) => r.id}
            emptyMessage="No roles match your search."
          />
        </div>
      )}

      {canManage ? (
        <TableBulkActionBar
          selectedCount={selection.selectedCount}
          totalCount={total}
          onClearSelection={selection.clear}
          actions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => void handleBulkDelete() }]}
        />
      ) : null}
    </div>
  )
}
