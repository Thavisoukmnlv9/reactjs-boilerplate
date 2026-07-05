import type { ColumnDef } from '@tanstack/react-table'
import { Archive, ArchiveRestore, Building2, Layers, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCan } from '@/core/access'
import { endpoints } from '@/core/api/endpoints'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useBulkBranches, useDeleteBranch, useMakeMainBranch } from '@/features/branches/api/mutations'
import { useBranchesQuery, useBranchQuery, useBranchStatsQuery } from '@/features/branches/api/queries'
import { BRANCH_VERTICALS, type BranchView } from '@/features/branches/api/types'
import { BranchForm } from '@/features/branches/components/branch-form'
import { summarizeBulk } from '@/shared/api/bulk'
import { downloadFile } from '@/shared/api/download'
import { IdentityCell } from '@/shared/components/data-display/identity-cell'
import { StatsCardsRow } from '@/shared/components/data-display/stats-cards-row'
import { StatusChip } from '@/shared/components/data-display/status-chip'
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
import { TableBulkActionBar, type BulkAction } from '@/shared/table/table-bulk-action-bar'
import { TableColumnVisibility } from '@/shared/table/table-column-visibility'
import { TableExportMenu } from '@/shared/table/table-export-menu'
import { TableFilterChips } from '@/shared/table/table-filter-chips'
import { TableSearch } from '@/shared/table/table-search'
import { TableToolbar } from '@/shared/table/table-toolbar'
import { type TableSearchState, toQueryString, useTableUrlState } from '@/shared/table/table-url-state'
import { useTableSelection } from '@/shared/table/use-table-selection'

const ALL = '__all__'

interface BranchesSearch extends TableSearchState {
  status?: 'active' | 'archived'
  vertical?: string
}

const HIDEABLE = [
  { id: 'code', labelKey: 'columns.code' },
  { id: 'vertical', labelKey: 'columns.vertical' },
  { id: 'is_active', labelKey: 'columns.status' },
] as const

export function BranchesPage() {
  const { t } = useTranslation(['branches', 'common'])
  const { search, pageIndex, pageSize, setPagination, setSort, setQuery, setFilter, openCreate, openEdit, closeSheet } =
    useTableUrlState<BranchesSearch>()

  const canManage = useCan(PERMISSIONS.BRANCHES_MANAGE)
  const canDelete = useCan(PERMISSIONS.BRANCHES_DELETE)
  const canBulk = useCan(PERMISSIONS.BRANCHES_BULK)
  const canExport = useCan(PERMISSIONS.BRANCHES_EXPORT)

  const isActive = search.status === 'active' ? true : search.status === 'archived' ? false : undefined
  const branchesQuery = useBranchesQuery({
    q: search.q,
    is_active: isActive,
    vertical: search.vertical,
    sort: search.sort,
    order: search.order,
    limit: pageSize,
    offset: pageIndex * pageSize,
  })
  const statsQuery = useBranchStatsQuery()

  const items = branchesQuery.data?.items ?? []
  const total = branchesQuery.data?.total ?? 0

  const selection = useTableSelection(items)
  const bulk = useBulkBranches()
  const del = useDeleteBranch()
  const makeMain = useMakeMainBranch()
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const editing = search.sheet === 'edit'
  const editBranchQuery = useBranchQuery(editing ? search.sheetId : undefined)

  async function handleMakeMain(id: string, name: string) {
    const ok = await confirm({ title: t('confirm.makeMainTitle', { name }), description: t('confirm.makeMainDescription'), confirmText: t('confirm.makeMainConfirm') })
    if (!ok) return
    try {
      await makeMain.mutateAsync(id)
      toast.success(t('toasts.mainUpdated'))
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

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

  async function runBulk(action: 'archive' | 'activate' | 'delete', verb: string, destructive = false) {
    if (destructive) {
      const ok = await confirm({
        title: t('confirm.deleteMany', { count: selection.selectedCount }),
        description: t('confirm.deleteManyDescription'),
        confirmText: t('common:actions.delete'),
        confirmVariant: 'destructive',
      })
      if (!ok) return
    }
    try {
      const result = await bulk.mutateAsync({ action, ids: selection.ids })
      const { ok, message } = summarizeBulk(result, verb)
      if (ok) toast.success(message)
      else toast.error(message)
      selection.clear()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleExport() {
    try {
      const qs = toQueryString({ q: search.q, is_active: isActive, vertical: search.vertical, sort: search.sort, order: search.order, format: 'csv' })
      await downloadFile(`${endpoints.branches.export}${qs}`, 'branches.csv')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const columns = useMemo<ColumnDef<BranchView, unknown>[]>(() => {
    const base: ColumnDef<BranchView, unknown>[] = [
      {
        id: 'name',
        header: t('columns.name'),
        enableSorting: true,
        cell: ({ row }) => {
          const b = row.original
          return (
            <IdentityCell
              icon={<Building2 />}
              primary={
                <span className="flex items-center gap-1.5">
                  {b.name}
                  {b.is_main ? (
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <Star className="size-3" /> {t('main')}
                    </Badge>
                  ) : null}
                </span>
              }
              secondary={b.code ?? undefined}
            />
          )
        },
      },
      { id: 'code', header: t('columns.code'), enableSorting: true, cell: ({ row }) => <span className="font-mono text-muted-foreground text-sm">{row.original.code ?? '—'}</span> },
      {
        id: 'vertical',
        header: t('columns.vertical'),
        enableSorting: true,
        cell: ({ row }) => <span className="text-muted-foreground text-sm capitalize">{row.original.vertical?.toLowerCase() ?? '—'}</span>,
      },
      { id: 'is_active', header: t('columns.status'), enableSorting: true, cell: ({ row }) => <StatusChip status={row.original.is_active ? 'Active' : 'Archived'} /> },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          const b = row.original
          const actions: RowAction[] = []
          if (canManage && !b.is_main) actions.push({ label: t('actions.makeMain'), icon: Star, onClick: () => void handleMakeMain(b.id, b.name) })
          if (canManage) actions.push({ label: t('actions.edit'), icon: Pencil, onClick: () => openEdit(b.id) })
          if (canDelete && !b.is_main) actions.push({ label: t('actions.delete'), icon: Trash2, variant: 'destructive', onClick: () => void handleDelete(b.id, b.name) })
          return actions.length ? <div className="flex justify-end"><RowActions actions={actions} /></div> : null
        },
      },
    ]
    const visible = base.filter((c) => !hidden.has(c.id as string))
    return canBulk ? [createSelectColumn(selection, 'branch'), ...visible] : visible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, canManage, canDelete, canBulk, selection, t])

  const statItems = [
    { id: 'total', label: t('stats.total'), value: statsQuery.data?.total ?? 0, icon: <Building2 /> },
    { id: 'active', label: t('stats.active'), value: statsQuery.data?.active ?? 0, tone: 'success' as const },
    { id: 'archived', label: t('stats.archived'), value: statsQuery.data?.archived ?? 0, tone: 'warning' as const },
    { id: 'verticals', label: t('stats.verticals'), value: Object.keys(statsQuery.data?.by_vertical ?? {}).length, icon: <Layers /> },
  ]

  const chips = []
  if (search.status) chips.push({ id: 'status', label: t('filters.statusChip', { value: search.status }), onRemove: () => setFilter('status', undefined) })
  if (search.vertical) chips.push({ id: 'vertical', label: t('filters.verticalChip', { value: search.vertical }), onRemove: () => setFilter('vertical', undefined) })

  const hasFilters = Boolean(search.q || search.status || search.vertical)
  const unfilteredEmpty = !branchesQuery.isLoading && !branchesQuery.isError && total === 0 && !hasFilters

  const bulkActions: BulkAction[] = []
  if (canBulk) {
    bulkActions.push({ label: t('actions.activate'), icon: ArchiveRestore, onClick: () => void runBulk('activate', 'activated') })
    bulkActions.push({ label: t('actions.archive'), icon: Archive, onClick: () => void runBulk('archive', 'archived') })
    bulkActions.push({ label: t('common:actions.delete'), icon: Trash2, variant: 'destructive', onClick: () => void runBulk('delete', 'deleted', true) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          canManage ? (
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> {t('new')}
            </Button>
          ) : undefined
        }
      />

      <StatsCardsRow items={statItems} isLoading={statsQuery.isLoading} />

      {unfilteredEmpty ? (
        <EmptyState
          icon={<Building2 className="size-7" />}
          title={t('empty.title')}
          description={t('empty.description')}
          action={canManage ? <Button onClick={openCreate}><Plus className="size-4" /> {t('new')}</Button> : undefined}
        />
      ) : branchesQuery.isError ? (
        <ErrorState message={(branchesQuery.error as Error)?.message} onRetry={() => void branchesQuery.refetch()} />
      ) : (
        <div>
          <TableToolbar
            left={
              <>
                <TableSearch value={search.q ?? ''} onChange={setQuery} placeholder={t('filters.searchPlaceholder')} />
                <Select value={search.status ?? ALL} onValueChange={(v) => setFilter('status', v === ALL ? undefined : v)}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder={t('filters.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{t('filters.allStatuses')}</SelectItem>
                    <SelectItem value="active">{t('status.active')}</SelectItem>
                    <SelectItem value="archived">{t('status.archived')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={search.vertical ?? ALL} onValueChange={(v) => setFilter('vertical', v === ALL ? undefined : v)}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder={t('filters.vertical')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{t('filters.allVerticals')}</SelectItem>
                    {BRANCH_VERTICALS.map((v) => (
                      <SelectItem key={v} value={v} className="capitalize">
                        {v.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TableFilterChips chips={chips} />
              </>
            }
            right={
              <>
                <TableColumnVisibility
                  columns={HIDEABLE.map((c) => ({ id: c.id, label: t(c.labelKey), visible: !hidden.has(c.id), hideable: true }))}
                  onChange={(id, visible) =>
                    setHidden((prev) => {
                      const next = new Set(prev)
                      if (visible) next.delete(id)
                      else next.add(id)
                      return next
                    })
                  }
                />
                {canExport ? <TableExportMenu onExport={{ csv: handleExport }} /> : null}
              </>
            }
          />

          <DataTable
            key={`${search.q ?? ''}|${search.status ?? ''}|${search.vertical ?? ''}|${pageSize}`}
            columns={columns}
            data={items}
            totalCount={total}
            isLoading={branchesQuery.isLoading}
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
            keyExtractor={(b) => b.id}
            emptyMessage={t('empty.filtered')}
          />
        </div>
      )}

      {bulkActions.length ? (
        <TableBulkActionBar selectedCount={selection.selectedCount} totalCount={total} onClearSelection={selection.clear} actions={bulkActions} />
      ) : null}

      <Sheet open={search.sheet === 'create' || editing} onOpenChange={(o) => (o ? null : closeSheet())}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b">
            <SheetTitle>{search.sheet === 'create' ? t('form.createTitle') : t('form.editTitle')}</SheetTitle>
            <SheetDescription>
              {search.sheet === 'create' ? t('form.createDescription') : t('form.editDescription')}
            </SheetDescription>
          </SheetHeader>
          {search.sheet === 'create' ? (
            <BranchForm key="create" mode="create" onDone={closeSheet} />
          ) : editBranchQuery.data ? (
            <BranchForm key={editBranchQuery.data.id} mode="edit" initial={editBranchQuery.data} onDone={closeSheet} />
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
