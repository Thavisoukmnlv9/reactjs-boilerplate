import { useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Shield, ShieldCheck, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['roles', 'common'])
  const navigate = useNavigate()
  const { search, pageIndex, pageSize, setPagination, setSort, setQuery } = useTableUrlState()

  const canManage = useCan(PERMISSIONS.ROLES_MANAGE)
  const canBulk = useCan(PERMISSIONS.ROLES_BULK)
  const canExport = useCan(PERMISSIONS.ROLES_EXPORT)

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
    const ok = await confirm({ title: t('confirm.deleteTitle', { name }), description: t('confirm.deleteDescription'), confirmText: t('common:actions.delete'), confirmVariant: 'destructive' })
    if (!ok) return
    try {
      await del.mutateAsync(id)
      toast.success(t('toasts.deleted'))
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleBulkDelete() {
    const ok = await confirm({
      title: t('confirm.deleteMany', { count: selection.selectedCount }),
      description: t('confirm.deleteManyDescription'),
      confirmText: t('common:actions.delete'),
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
        header: t('columns.role'),
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
                  {r.is_system ? <Badge variant="secondary" className="text-[10px]">{t('columns.system')}</Badge> : null}
                </div>
                {r.description ? <div className="truncate text-muted-foreground text-xs">{r.description}</div> : null}
              </div>
            </div>
          )
        },
      },
      { id: 'permissions', header: t('columns.permissions'), enableSorting: false, cell: ({ row }) => <span className="tabular-nums text-muted-foreground text-sm">{row.original.permission_codes.length}</span> },
      { id: 'members', header: t('columns.members'), enableSorting: false, cell: ({ row }) => <span className="tabular-nums text-muted-foreground text-sm">{row.original.member_count}</span> },
      {
        id: 'is_system',
        header: t('columns.type'),
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant={row.original.is_system ? 'secondary' : 'outline'}>{row.original.is_system ? t('columns.system') : t('columns.custom')}</Badge>
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
          const actions: RowAction[] = [{ label: t('common:actions.edit'), icon: Pencil, to: '/roles/$roleId/edit', params: { roleId: r.id } }]
          if (r.member_count === 0) actions.push({ label: t('common:actions.delete'), icon: Trash2, variant: 'destructive', onClick: () => void handleDelete(r.id, r.name) })
          return <div className="flex justify-end"><RowActions actions={actions} /></div>
        },
      },
    ]
    return canBulk ? [createSelectColumn(selection, 'role'), ...base] : base
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage, canBulk, selection, navigate, t])

  const statItems = [
    { id: 'total', label: t('stats.total'), value: statsQuery.data?.total ?? 0, icon: <Shield /> },
    { id: 'system', label: t('stats.system'), value: statsQuery.data?.system ?? 0 },
    { id: 'custom', label: t('stats.custom'), value: statsQuery.data?.custom ?? 0, tone: 'accent' as const },
    { id: 'unused', label: t('stats.unused'), value: statsQuery.data?.unused ?? 0, tone: 'warning' as const },
  ]

  const hasFilters = Boolean(search.q)
  const unfilteredEmpty = !rolesQuery.isLoading && !rolesQuery.isError && total === 0 && !hasFilters

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          canManage ? (
            <Button size="sm" onClick={() => void navigate({ to: '/roles/new' })}>
              <Plus className="size-4" /> {t('newRole')}
            </Button>
          ) : undefined
        }
      />

      <StatsCardsRow items={statItems} isLoading={statsQuery.isLoading} />

      {unfilteredEmpty ? (
        <EmptyState
          icon={<ShieldCheck className="size-7" />}
          title={t('empty.title')}
          description={t('empty.description')}
          action={canManage ? <Button onClick={() => void navigate({ to: '/roles/new' })}><Plus className="size-4" /> {t('newRole')}</Button> : undefined}
        />
      ) : rolesQuery.isError ? (
        <ErrorState message={(rolesQuery.error as Error)?.message} onRetry={() => void rolesQuery.refetch()} />
      ) : (
        <div>
          <TableToolbar
            left={<TableSearch value={search.q ?? ''} onChange={setQuery} placeholder={t('actions.searchPlaceholder')} />}
            right={canExport ? <TableExportMenu onExport={{ csv: handleExport }} /> : null}
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
            emptyMessage={t('empty.noSearchResults')}
          />
        </div>
      )}

      {canBulk ? (
        <TableBulkActionBar
          selectedCount={selection.selectedCount}
          totalCount={total}
          onClearSelection={selection.clear}
          actions={[{ label: t('common:actions.delete'), icon: Trash2, variant: 'destructive', onClick: () => void handleBulkDelete() }]}
        />
      ) : null}
    </div>
  )
}
