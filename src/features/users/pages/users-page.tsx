import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Send, Trash2, UserPlus, Users as UsersIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { PageHeader } from '@/components/common/page-header'
import { useCan } from '@/core/access'
import { endpoints } from '@/core/api/endpoints'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useRolesQuery } from '@/features/roles/api/queries'
import { useBulkUsers, useRemoveUser, useResendInvite } from '@/features/users/api/mutations'
import { useUsersQuery, useUserQuery, useUserStatsQuery } from '@/features/users/api/queries'
import type { MemberView } from '@/features/users/api/types'
import { UserForm } from '@/features/users/components/user-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { DataTable } from '@/shared/table/data-table'
import { RowActions, type RowAction } from '@/shared/table/row-actions'
import { createSelectColumn } from '@/shared/table/select-column'
import { TableBulkActionBar } from '@/shared/table/table-bulk-action-bar'
import { TableColumnVisibility } from '@/shared/table/table-column-visibility'
import { TableExportMenu } from '@/shared/table/table-export-menu'
import { TableFilterChips } from '@/shared/table/table-filter-chips'
import { TableSearch } from '@/shared/table/table-search'
import { TableToolbar } from '@/shared/table/table-toolbar'
import { type TableSearchState, toQueryString, useTableUrlState } from '@/shared/table/table-url-state'
import { useTableSelection } from '@/shared/table/use-table-selection'

const MEMBER_STATUSES = ['ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED'] as const
const ALL = '__all__'

interface UsersSearch extends TableSearchState {
  status?: string
  role_id?: string
}

const HIDEABLE_IDS = ['role', 'branches', 'status'] as const

export function UsersPage() {
  const { t } = useTranslation(['users', 'common'])
  const { search, pageIndex, pageSize, setPagination, setSort, setQuery, setFilter, openCreate, openEdit, closeSheet } =
    useTableUrlState<UsersSearch>()

  const canInvite = useCan(PERMISSIONS.USERS_INVITE)
  const canManage = useCan(PERMISSIONS.USERS_MANAGE)
  const canBulk = useCan(PERMISSIONS.USERS_BULK)
  const canExport = useCan(PERMISSIONS.USERS_EXPORT)

  const usersQuery = useUsersQuery({
    q: search.q,
    status: search.status,
    role_id: search.role_id,
    sort: search.sort,
    order: search.order,
    limit: pageSize,
    offset: pageIndex * pageSize,
  })
  const statsQuery = useUserStatsQuery()
  const { data: rolesData } = useRolesQuery({ limit: 100 })
  const roles = rolesData?.items ?? []
  const roleName = (id: string | null) => roles.find((r) => r.id === id)?.name ?? '—'

  const items = usersQuery.data?.items ?? []
  const total = usersQuery.data?.total ?? 0

  const selection = useTableSelection(items)
  const bulk = useBulkUsers()
  const remove = useRemoveUser()
  const resend = useResendInvite()

  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const editing = search.sheet === 'edit'
  const editMemberQuery = useUserQuery(editing ? search.sheetId : undefined)

  async function handleRemove(id: string, name: string | null) {
    const ok = await confirm({
      title: name ? t('confirm.removeTitle', { name }) : t('confirm.removeTitleFallback'),
      description: t('confirm.removeDescription'),
      confirmText: t('confirm.removeConfirm'),
      confirmVariant: 'destructive',
    })
    if (!ok) return
    try {
      await remove.mutateAsync(id)
      toast.success(t('toasts.memberRemoved'))
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function handleResend(id: string) {
    try {
      const res = await resend.mutateAsync(id)
      const url = `${window.location.origin}/accept-invite?token=${res.invite_token}`
      await navigator.clipboard.writeText(url)
      toast.success(t('toasts.inviteLinkCopied'))
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  async function runBulk(action: 'remove' | 'resend_invite', verb: string, confirmFirst = false) {
    if (confirmFirst) {
      const ok = await confirm({
        title: t('confirm.removeMany', { count: selection.selectedCount }),
        description: t('confirm.removeManyDescription'),
        confirmText: t('confirm.removeConfirm'),
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
      const qs = toQueryString({
        q: search.q,
        status: search.status,
        role_id: search.role_id,
        sort: search.sort,
        order: search.order,
        format: 'csv',
      })
      await downloadFile(`${endpoints.users.export}${qs}`, 'users.csv')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const columns = useMemo<ColumnDef<MemberView, unknown>[]>(() => {
    const base: ColumnDef<MemberView, unknown>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        header: t('columns.member'),
        enableSorting: true,
        cell: ({ row }) => {
          const m = row.original
          return (
            <IdentityCell
              avatarText={m.user.name ?? m.user.email ?? '?'}
              avatarUrl={m.user.avatar_url}
              primary={m.user.name ?? m.user.email ?? t('empty.unknownMember')}
              secondary={m.user.email}
            />
          )
        },
      },
      {
        id: 'role',
        header: t('columns.role'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-sm">
            {roleName(row.original.role_id)}
            {row.original.is_owner ? (
              <Badge variant="secondary" className="text-[10px]">
                {t('badges.owner')}
              </Badge>
            ) : null}
          </span>
        ),
      },
      {
        id: 'branches',
        header: t('columns.branches'),
        enableSorting: false,
        cell: ({ row }) => <span className="tabular-nums text-muted-foreground text-sm">{row.original.branch_ids.length}</span>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('columns.status'),
        enableSorting: true,
        cell: ({ row }) => <StatusChip status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 120,
        cell: ({ row }) => {
          const m = row.original
          const actions: RowAction[] = []
          if (canManage) actions.push({ label: t('common:actions.edit'), icon: Pencil, onClick: () => openEdit(m.id) })
          if (canInvite && m.status === 'PENDING')
            actions.push({ label: t('actions.resend'), icon: Send, onClick: () => void handleResend(m.id) })
          if (canManage && !m.is_owner)
            actions.push({
              label: t('confirm.removeConfirm'),
              icon: Trash2,
              variant: 'destructive',
              onClick: () => void handleRemove(m.id, m.user.name),
            })
          return actions.length ? <div className="flex justify-end"><RowActions actions={actions} /></div> : null
        },
      },
    ]
    const visible = base.filter((c) => !hidden.has(c.id as string))
    return canBulk ? [createSelectColumn(selection, 'member'), ...visible] : visible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, canManage, canBulk, canInvite, roles, selection, t])

  const statItems = [
    { id: 'total', label: t('stats.total'), value: statsQuery.data?.total ?? 0, icon: <UsersIcon /> },
    { id: 'active', label: t('stats.active'), value: statsQuery.data?.active ?? 0, tone: 'success' as const },
    { id: 'pending', label: t('stats.pending'), value: statsQuery.data?.pending ?? 0, tone: 'warning' as const },
    { id: 'suspended', label: t('stats.suspended'), value: statsQuery.data?.suspended ?? 0, tone: 'danger' as const },
  ]

  const chips = []
  if (search.status)
    chips.push({ id: 'status', label: t('filters.statusChip', { value: search.status }), onRemove: () => setFilter('status', undefined) })
  if (search.role_id)
    chips.push({ id: 'role', label: t('filters.roleChip', { value: roleName(search.role_id) }), onRemove: () => setFilter('role_id', undefined) })

  const hasFilters = Boolean(search.q || search.status || search.role_id)
  const unfilteredEmpty = !usersQuery.isLoading && !usersQuery.isError && total === 0 && !hasFilters

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          canInvite ? (
            <Button size="sm" onClick={openCreate}>
              <UserPlus className="size-4" /> {t('actions.invite')}
            </Button>
          ) : undefined
        }
      />

      <StatsCardsRow items={statItems} isLoading={statsQuery.isLoading} />

      {unfilteredEmpty ? (
        <EmptyState
          icon={<UsersIcon className="size-7" />}
          title={t('empty.title')}
          description={t('empty.description')}
          action={
            canInvite ? (
              <Button onClick={openCreate}>
                <UserPlus className="size-4" /> {t('actions.invite')}
              </Button>
            ) : undefined
          }
        />
      ) : usersQuery.isError ? (
        <ErrorState message={(usersQuery.error as Error)?.message} onRetry={() => void usersQuery.refetch()} />
      ) : (
        <div>
          <TableToolbar
            left={
              <>
                <TableSearch value={search.q ?? ''} onChange={setQuery} placeholder={t('filters.searchPlaceholder')} />
                <Select value={search.status ?? ALL} onValueChange={(v) => setFilter('status', v === ALL ? undefined : v)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder={t('filters.statusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{t('filters.allStatuses')}</SelectItem>
                    {MEMBER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={search.role_id ?? ALL} onValueChange={(v) => setFilter('role_id', v === ALL ? undefined : v)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder={t('filters.rolePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>{t('filters.allRoles')}</SelectItem>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
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
                  columns={HIDEABLE_IDS.map((id) => ({ id, label: t(`columns.${id}`), visible: !hidden.has(id), hideable: true }))}
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
            key={`${search.q ?? ''}|${search.status ?? ''}|${search.role_id ?? ''}|${pageSize}`}
            columns={columns}
            data={items}
            totalCount={total}
            isLoading={usersQuery.isLoading}
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
            keyExtractor={(u) => u.id}
            emptyMessage={t('empty.filtered')}
          />
        </div>
      )}

      {canBulk ? (
        <TableBulkActionBar
          selectedCount={selection.selectedCount}
          totalCount={total}
          onClearSelection={selection.clear}
          actions={[
            { label: t('actions.resendInvites'), icon: Send, onClick: () => void runBulk('resend_invite', t('toasts.invitesRefreshed')) },
            {
              label: t('confirm.removeConfirm'),
              icon: Trash2,
              variant: 'destructive',
              onClick: () => void runBulk('remove', t('toasts.removed'), true),
            },
          ]}
        />
      ) : null}

      <Sheet open={search.sheet === 'create' || editing} onOpenChange={(o) => (o ? null : closeSheet())}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          <SheetHeader className="border-b">
            <SheetTitle>{search.sheet === 'create' ? t('sheet.inviteTitle') : t('sheet.editTitle')}</SheetTitle>
            <SheetDescription>
              {search.sheet === 'create' ? t('sheet.inviteDescription') : t('sheet.editDescription')}
            </SheetDescription>
          </SheetHeader>
          {search.sheet === 'create' ? (
            <UserForm key="create" mode="create" onDone={closeSheet} />
          ) : editMemberQuery.data ? (
            <UserForm key={editMemberQuery.data.id} mode="edit" initial={editMemberQuery.data} onDone={closeSheet} />
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
