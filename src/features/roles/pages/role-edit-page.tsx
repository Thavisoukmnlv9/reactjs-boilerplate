import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/common/page-header'
import { useRoleQuery } from '@/features/roles/api/queries'
import { RoleForm } from '@/features/roles/components/role-form'

export function RoleEditPage() {
  const { t } = useTranslation(['roles', 'common'])
  const { roleId } = useParams({ strict: false }) as { roleId?: string }
  const { data: role, isLoading } = useRoleQuery(roleId)

  if (isLoading || !role) return <p className="text-muted-foreground text-sm">{t('common:states.loading')}</p>

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title={t('edit.title', { name: role.name })}
        description={role.is_system ? t('edit.systemDescription') : undefined}
      />
      <RoleForm mode="edit" initial={role} readOnly={role.is_system} />
    </div>
  )
}
