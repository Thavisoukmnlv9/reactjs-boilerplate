import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, ScrollText, ShieldAlert, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCan } from '@/core/access'
import { endpoints } from '@/core/api/endpoints'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useBulkPolicies, useDeletePolicy } from '@/features/policies/api/mutations'
import { usePoliciesQuery, usePolicyQuery, usePolicyStatsQuery } from '@/features/policies/api/queries'
import { POLICY_ACTIONS, POLICY_SUBJECTS, type PolicyView } from '@/features/policies/api/types'
import { PolicyEffectBadge } from '@/features/policies/components/policy-effect-badge'
import { PolicyForm } from '@/features/policies/components/policy-form'
import { useRolesQuery } from '@/features/roles/api/queries'
import { summarizeBulk } from '@/shared/api/bulk'
import { downloadFile } from '@/shared/api/download'
import { StatsCardsRow } from '@/shared/components/data-display/stats-cards-row'
import { EmptyState } from '@/shared/components/states/empty-state'
import { ErrorState } from '@/shared/components/states/error-state'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { confirm } from '@/shared/components/ui/confirm'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { DataTable } from '@/shared/table/data-table'
import { RowActions, type RowAction } from '@/shared/table/row-actions'
import { createSelectColumn } from '@/shared/table/select-column'
import { TableBulkActionBar } from '@/shared/table/table-bulk-action-bar'
import { TableExportMenu } from '@/shared/table/table-export-menu'
import { TableFilterChips } from '@/shared/table/table-filter-chips'
import { TableToolbar } from '@/shared/table/table-toolbar'
import { type TableSearchState, toQueryString, useTableUrlState } from '@/shared/table/table-url-state'
import { useTableSelection } from '@/shared/table/use-table-selection'

const ALL = '__all__'

interface PoliciesSearch extends TableSearchState {
  subject?: string
  action?: string
}

export function PoliciesPage() {
  const { search, pageIndex, pageSize, setPagination, setSort, setFilter, openCreate, openEdit, closeSheet } =
    useTableUrlState<PoliciesSearch>()

  const canManage = useCan(PERMISSIONS.POLICIES_MANAGE)
  const canBulk = useCan(PERMISSIONS.POLICIES_BULK)
  const canExport = useCan(PERMISSIONS.POLICIES_EXPORT)

  const policiesQuery = usePoliciesQuery({
    subject: search.subject,
    action: search.action,
    sort: search.sort,
    order: search.order,
    limit: pageSize,
    offset: pageIndex * pageSize,
  })
  const statsQuery = usePolicyStatsQuery()
  const { data: rolesData } = useRolesQuery({ limit: 100 })
  const roles = rolesData?.items ?? []
  const roleName = (id: string | null) => (id ? roles.find((r) => r.id === id)?.name ?? 'Role-scoped' : 'Everyone')

  const items = policiesQuery.data?.items ?? []
  const total = policiesQuery.data?.total ?? 0

  const selection = useTableSelection(items)
  const bulk = useBulkPolicies()
  const del = useDeletePolicy()

  const editing = search.sheet === 'edit'
  const editPolicyQuery = usePolicyQuery(editing ? search.sheetId : undefined)

  async function handleDelete(id: string) {
    const ok = await confirm({ title: 'Delete this policy?', description: 'Access falls back to roles alone.', confirmText: 'Delete', confirmVariant: 'destructive' })
    if (!ok) return
    try {
      await del.mutateAsync(id)
      toast.success('Policy deleted')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleBulkDelete() {
    const ok = await confirm({
      title: `Delete ${selection.selectedCount} polic${selection.selectedCount === 1 ? 'y' : 'ies'}?`,
      description: 'This cannot be undone.',
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
      await downloadFile(
        `${endpoints.policies.export}${toQueryString({ subject: search.subject, action: search.action, sort: search.sort, order: search.order, format: 'csv' })}`,
        'policies.csv',
      )
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const columns = useMemo<ColumnDef<PolicyView, unknown>[]>(() => {
    const base: ColumnDef<PolicyView, unknown>[] = [
      { id: 'effect', header: 'Effect', enableSorting: true, size: 90, cell: ({ row }) => <PolicyEffectBadge effect={row.original.effect} /> },
      {
        id: 'action',
        header: 'Rule',
        enableSorting: true,
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="min-w-0">
              <div className="truncate text-sm">
                <span className="font-mono font-medium">{p.action}</span> on <span className="font-mono font-medium">{p.subject}</span>
              </div>
              {p.description ? <div className="truncate text-muted-foreground text-xs">{p.description}</div> : null}
            </div>
          )
        },
      },
      { id: 'applies_to', header: 'Applies to', enableSorting: false, cell: ({ row }) => <span className="text-muted-foreground text-sm">{roleName(row.original.role_id)}</span> },
      {
        id: 'conditions',
        header: 'Conditions',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.conditions ? <Badge variant="outline">Conditional</Badge> : <span className="text-muted-foreground text-sm">—</span>,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          if (!canManage) return null
          const actions: RowAction[] = [
            { label: 'Edit', icon: Pencil, onClick: () => openEdit(row.original.id) },
            { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => void handleDelete(row.original.id) },
          ]
          return <div className="flex justify-end"><RowActions actions={actions} /></div>
        },
      },
    ]
    return canBulk ? [createSelectColumn(selection, 'policy'), ...base] : base
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage, canBulk, selection, roles])

  const statItems = [
    { id: 'total', label: 'Total policies', value: statsQuery.data?.total ?? 0, icon: <ScrollText /> },
    { id: 'allow', label: 'Allow', value: statsQuery.data?.allow ?? 0, tone: 'success' as const },
    { id: 'deny', label: 'Deny', value: statsQuery.data?.deny ?? 0, tone: 'danger' as const },
    { id: 'conditional', label: 'Conditional', value: statsQuery.data?.conditional ?? 0, tone: 'accent' as const },
  ]

  const chips = []
  if (search.subject) chips.push({ id: 'subject', label: `Subject: ${search.subject}`, onRemove: () => setFilter('subject', undefined) })
  if (search.action) chips.push({ id: 'action', label: `Action: ${search.action}`, onRemove: () => setFilter('action', undefined) })

  const hasFilters = Boolean(search.subject || search.action)
  const unfilteredEmpty = !policiesQuery.isLoading && !policiesQuery.isError && total === 0 && !hasFilters

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access policies"
        description="Attribute rules layered on top of roles. DENY always wins."
        actions={
          canManage ? (
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> New policy
            </Button>
          ) : undefined
        }
      />

      <StatsCardsRow items={statItems} isLoading={statsQuery.isLoading} />

      {unfilteredEmpty ? (
        <EmptyState
          icon={<ShieldAlert className="size-7" />}
          title="No policies yet"
          description="Roles alone control access until you add attribute-based refinements here."
          action={canManage ? <Button onClick={openCreate}><Plus className="size-4" /> New policy</Button> : undefined}
        />
      ) : policiesQuery.isError ? (
        <ErrorState message={(policiesQuery.error as Error)?.message} onRetry={() => void policiesQuery.refetch()} />
      ) : (
        <div>
          <TableToolbar
            left={
              <>
                <Select value={search.subject ?? ALL} onValueChange={(v) => setFilter('subject', v === ALL ? undefined : v)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All subjects</SelectItem>
                    {POLICY_SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={search.action ?? ALL} onValueChange={(v) => setFilter('action', v === ALL ? undefined : v)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All actions</SelectItem>
                    {POLICY_ACTIONS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TableFilterChips chips={chips} />
              </>
            }
            right={canExport ? <TableExportMenu onExport={{ csv: handleExport }} /> : null}
          />

          <DataTable
            key={`${search.subject ?? ''}|${search.action ?? ''}|${pageSize}`}
            columns={columns}
            data={items}
            totalCount={total}
            isLoading={policiesQuery.isLoading}
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
            keyExtractor={(p) => p.id}
            emptyMessage="No policies match your filters."
          />
        </div>
      )}

      {canBulk ? (
        <TableBulkActionBar
          selectedCount={selection.selectedCount}
          totalCount={total}
          onClearSelection={selection.clear}
          actions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => void handleBulkDelete() }]}
        />
      ) : null}

      <Sheet open={search.sheet === 'create' || editing} onOpenChange={(o) => (o ? null : closeSheet())}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b">
            <SheetTitle>{search.sheet === 'create' ? 'New policy' : 'Edit policy'}</SheetTitle>
            <SheetDescription>Attribute rules refine role permissions. DENY always wins.</SheetDescription>
          </SheetHeader>
          {search.sheet === 'create' ? (
            <PolicyForm key="create" mode="create" onDone={closeSheet} />
          ) : editPolicyQuery.data ? (
            <PolicyForm key={editPolicyQuery.data.id} mode="edit" initial={editPolicyQuery.data} onDone={closeSheet} />
          ) : (
            <div className="flex-1 space-y-3 p-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
