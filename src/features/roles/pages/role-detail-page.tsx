import { Link, useParams } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { useCan } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useRoleQuery } from '@/features/roles/api/queries'
import { groupByModule, labelForCode, moduleLabel } from '@/features/roles/lib/permission-catalog'
import { Badge } from '@/shared/components/ui/badge'

export function RoleDetailPage() {
  const { t } = useTranslation(['roles', 'common'])
  const { roleId } = useParams({ strict: false }) as { roleId?: string }
  const { data: role, isLoading } = useRoleQuery(roleId)
  const canManage = useCan(PERMISSIONS.ROLES_MANAGE)

  if (isLoading || !role) return <p className="text-muted-foreground text-sm">{t('common:states.loading')}</p>

  const grouped = groupByModule(
    role.permission_codes.map((code) => ({ id: code, code, module: code.split('.')[0] ?? 'platform', description: null }))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={role.name}
        description={role.description ?? undefined}
        actions={
          canManage && !role.is_system ? (
            <Button asChild size="sm">
              <Link to="/roles/$roleId/edit" params={{ roleId: role.id }}>
                <Pencil className="size-4" /> {t('common:actions.edit')}
              </Link>
            </Button>
          ) : undefined
        }
      />
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        {role.is_system ? <Badge variant="secondary">{t('columns.system')}</Badge> : null}
        <span>
          {t('detail.permissionsMembers', { permissions: role.permission_codes.length, count: role.member_count })}
        </span>
      </div>

      {role.permission_codes.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('detail.noPermissions')}</p>
      ) : (
        <div className="space-y-4">
          {grouped.map((g) => (
            <div key={g.module}>
              <h3 className="mb-1.5 text-sm font-semibold">{moduleLabel(g.module)}</h3>
              <div className="flex flex-wrap gap-1.5">
                {g.perms.map((p) => (
                  <Badge key={p.code} variant="outline" className="capitalize">
                    {labelForCode(p.code)}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
