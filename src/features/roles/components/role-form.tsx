import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { moduleOf } from '@/features/roles/lib/permission-catalog'
import { PermissionMatrix } from '@/features/roles/components/permission-matrix'
import type { RoleWriteInput } from '@/features/roles/api/types'

interface Props {
  mode: 'create' | 'edit'
  initial?: { name: string; description: string | null; permission_codes: string[] }
  onSubmit: (values: RoleWriteInput) => void
  onCancel?: () => void
  isPending?: boolean
  /** System roles are read-only. */
  disabled?: boolean
}

export function RoleForm({ mode, initial, onSubmit, onCancel, isPending, disabled }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [codes, setCodes] = useState<string[]>(initial?.permission_codes ?? [])
  const moduleCount = useMemo(() => new Set(codes.map(moduleOf)).size, [codes])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name: name.trim(), description: description.trim() || null, permission_codes: codes })
      }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Name</Label>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} disabled={disabled} placeholder="e.g. Shift Supervisor" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Description</Label>
            <Textarea id="role-desc" value={description ?? ''} onChange={(e) => setDescription(e.target.value)} disabled={disabled} rows={2} placeholder="What can members with this role do?" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Permissions</h3>
          <p className="text-muted-foreground text-sm">
            Grants <span className="text-foreground font-medium">{codes.length}</span> permissions across{' '}
            <span className="text-foreground font-medium">{moduleCount}</span> module{moduleCount === 1 ? '' : 's'}
          </p>
        </div>
        <PermissionMatrix value={codes} onChange={setCodes} disabled={disabled} />
      </div>

      {!disabled ? (
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending || !name.trim()}>
            {isPending ? 'Saving…' : mode === 'create' ? 'Create role' : 'Save changes'}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}
