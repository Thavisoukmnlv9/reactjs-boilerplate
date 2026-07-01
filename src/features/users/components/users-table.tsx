import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { DataTable, type DataTableColumn } from '@/components/common/data-table'
import { RoleGate } from '@/components/common/role-gate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PERMISSIONS, ROUTES } from '@/config/constants'
import { formatDate } from '@/lib/utils'

import type { User } from '../types'

interface UsersTableProps {
  data: User[]
  isLoading?: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ data, isLoading, onEdit, onDelete }: UsersTableProps) {
  const { t } = useTranslation('users')

  const columns: DataTableColumn<User>[] = [
    {
      key: 'name',
      header: t('columns.name'),
      cell: (user) => (
        <Link to={ROUTES.userDetail(user.id)} className="font-medium hover:underline">
          {user.name}
        </Link>
      ),
    },
    {
      key: 'email',
      header: t('columns.email'),
      cell: (user) => <span className="text-muted-foreground">{user.email}</span>,
    },
    {
      key: 'role',
      header: t('columns.role'),
      cell: (user) => <Badge variant="secondary">{user.role}</Badge>,
    },
    {
      key: 'createdAt',
      header: t('columns.createdAt'),
      cell: (user) => formatDate(user.createdAt),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <RoleGate permission={PERMISSIONS.usersWrite}>
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="size-4" />
                {t('editUser')}
              </DropdownMenuItem>
            </RoleGate>
            <RoleGate permission={PERMISSIONS.usersDelete}>
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(user)}>
                <Trash2 className="size-4" />
                {t('deleteUser')}
              </DropdownMenuItem>
            </RoleGate>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(user) => user.id}
      isLoading={isLoading}
      emptyTitle={t('empty')}
    />
  )
}
