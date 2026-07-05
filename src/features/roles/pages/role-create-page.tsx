import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/common/page-header'
import { RoleForm } from '@/features/roles/components/role-form'

export function RoleCreatePage() {
  const { t } = useTranslation('roles')
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title={t('create.title')} description={t('create.description')} />
      <RoleForm mode="create" />
    </div>
  )
}
