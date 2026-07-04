import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { useBranchesQuery } from '@/features/branches/api/queries'
import { useRolesQuery } from '@/features/roles/api/queries'
import type { MemberView } from '@/features/users/api/types'

const NONE = '__none__'

export interface UserFormValues {
  email: string
  name: string
  role_id: string
  branch_ids: string[]
  default_branch_id: string
  staff_title: string
  staff_note: string
}

interface Props {
  mode: 'create' | 'edit'
  initial?: MemberView
  onSubmit: (values: UserFormValues) => void
  onCancel?: () => void
  isPending?: boolean
}

export function UserForm({ mode, initial, onSubmit, onCancel, isPending }: Props) {
  const { data: rolesData } = useRolesQuery()
  const { data: branchesData } = useBranchesQuery()
  const roles = rolesData?.items ?? []
  const branches = (branchesData?.items ?? []).filter((b) => b.is_active)

  const [f, setF] = useState<UserFormValues>({
    email: initial?.user.email ?? '',
    name: initial?.user.name ?? '',
    role_id: initial?.role_id ?? '',
    branch_ids: initial?.branch_ids ?? [],
    default_branch_id: initial?.default_branch_id ?? '',
    staff_title: initial?.staff_title ?? '',
    staff_note: initial?.staff_note ?? '',
  })
  const set = <K extends keyof UserFormValues>(k: K, v: UserFormValues[K]) => setF((p) => ({ ...p, [k]: v }))

  function toggleBranch(id: string) {
    setF((p) => {
      const next = p.branch_ids.includes(id) ? p.branch_ids.filter((x) => x !== id) : [...p.branch_ids, id]
      return { ...p, branch_ids: next, default_branch_id: next.includes(p.default_branch_id) ? p.default_branch_id : '' }
    })
  }

  const selectedRole = roles.find((r) => r.id === f.role_id)
  const roleImpact = useMemo(() => {
    if (!selectedRole) return null
    const modules = new Set(selectedRole.permission_codes.map((c) => c.split('.')[0]))
    return { perms: selectedRole.permission_codes.length, modules: modules.size }
  }, [selectedRole])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(f)
      }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="u-email">Email</Label>
            {mode === 'create' ? (
              <Input id="u-email" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="teammate@company.com" />
            ) : (
              <p className="text-muted-foreground pt-2 text-sm">{initial?.user.email}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-name">Name</Label>
            <Input id="u-name" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role &amp; access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={f.role_id} onValueChange={(v) => set('role_id', v)} disabled={initial?.is_owner}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                    {r.is_system ? ' (system)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {roleImpact ? (
            <p className="text-muted-foreground text-sm">
              Grants <span className="text-foreground font-medium">{roleImpact.perms}</span> permissions across{' '}
              <span className="text-foreground font-medium">{roleImpact.modules}</span> module
              {roleImpact.modules === 1 ? '' : 's'}.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Branch access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {branches.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active branches to assign.</p>
          ) : (
            <div className="space-y-2">
              {branches.map((b) => (
                <label key={b.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={f.branch_ids.includes(b.id)} onCheckedChange={() => toggleBranch(b.id)} />
                  {b.name}
                </label>
              ))}
            </div>
          )}
          {f.branch_ids.length > 0 ? (
            <div className="space-y-1.5">
              <Label>Default branch</Label>
              <Select value={f.default_branch_id || NONE} onValueChange={(v) => set('default_branch_id', v === NONE ? '' : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {branches
                    .filter((b) => f.branch_ids.includes(b.id))
                    .map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Staff details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="u-title">Title</Label>
            <Input id="u-title" value={f.staff_title} onChange={(e) => set('staff_title', e.target.value)} placeholder="e.g. Barista" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-note">Notes</Label>
            <Textarea id="u-note" rows={2} value={f.staff_note} onChange={(e) => set('staff_note', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending || !f.role_id || (mode === 'create' && !f.email.trim())}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Send invite' : 'Save changes'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
