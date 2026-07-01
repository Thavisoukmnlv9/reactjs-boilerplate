import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { ErrorState } from '@/components/common/error-state'
import { PageHeader } from '@/components/common/page-header'
import { RoleGate } from '@/components/common/role-gate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PERMISSIONS } from '@/config/constants'
import { useDebounce } from '@/hooks/use-debounce'
import { useDisclosure } from '@/hooks/use-disclosure'

import { useDeleteUser, useUsers } from '../api/queries'
import { UserFormDialog } from '../components/user-form-dialog'
import { UsersTable } from '../components/users-table'
import type { User } from '../types'

export function UsersPage() {
  const { t } = useTranslation(['users', 'common'])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const usersQuery = useUsers({ search: debouncedSearch || undefined })
  const deleteUser = useDeleteUser()

  const formDialog = useDisclosure()
  const [editing, setEditing] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)

  function handleNew() {
    setEditing(null)
    formDialog.open()
  }

  function handleEdit(user: User) {
    setEditing(user)
    formDialog.open()
  }

  function confirmDelete() {
    if (!deleting) return
    deleteUser.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('users:title')}
        description={t('users:subtitle')}
        actions={
          <RoleGate permission={PERMISSIONS.usersWrite}>
            <Button onClick={handleNew}>
              <Plus className="size-4" />
              {t('users:newUser')}
            </Button>
          </RoleGate>
        }
      />

      <Input
        placeholder={t('common:actions.search')}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-xs"
      />

      {usersQuery.isError ? (
        <ErrorState
          message={usersQuery.error instanceof Error ? usersQuery.error.message : undefined}
          onRetry={() => void usersQuery.refetch()}
        />
      ) : (
        <UsersTable
          data={usersQuery.data ?? []}
          isLoading={usersQuery.isLoading}
          onEdit={handleEdit}
          onDelete={setDeleting}
        />
      )}

      <UserFormDialog open={formDialog.isOpen} onOpenChange={formDialog.setIsOpen} user={editing} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(next) => {
          if (!next) setDeleting(null)
        }}
        title={t('users:deleteUser')}
        description={deleting ? t('users:deleteConfirm', { name: deleting.name }) : undefined}
        destructive
        loading={deleteUser.isPending}
        confirmLabel={t('common:actions.delete')}
        cancelLabel={t('common:actions.cancel')}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
