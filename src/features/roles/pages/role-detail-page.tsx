import { Link, useParams } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { useCan } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { useRoleQuery } from '@/features/roles/api/queries'
import { groupByModule, labelForCode, moduleLabel } from '@/features/roles/lib/permission-catalog'
import { Badge } from '@/shared/components/ui/badge'

export function RoleDetailPage() {
  const { roleId } = useParams({ strict: false }) as { roleId?: string }
  const { data: role, isLoading } = useRoleQuery(roleId)
  const canManage = useCan(PERMISSIONS.ROLES_MANAGE)

  if (isLoading || !role) return <p className="text-muted-foreground text-sm">Loading…</p>

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
                <Pencil className="size-4" /> Edit
              </Link>
            </Button>
          ) : undefined
        }
      />
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        {role.is_system ? <Badge variant="secondary">System</Badge> : null}
        <span>
          {role.permission_codes.length} permissions · {role.member_count} member{role.member_count === 1 ? '' : 's'}
        </span>
      </div>

      {role.permission_codes.length === 0 ? (
        <p className="text-muted-foreground text-sm">No permissions granted.</p>
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
