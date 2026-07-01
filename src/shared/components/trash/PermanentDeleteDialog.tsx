import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { permanentDeleteWithPin } from '@/shared/lib/soft-delete/permanent-delete-confirm'

export interface PermanentDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Label of the resource type, e.g. "Product". */
  resourceLabel: string
  /** Exact name the user must type to confirm. */
  recordName: string
  /** Called with the verified manager-pin elevation token. The caller sends it as `X-Manager-Authorization`. */
  onConfirm: (managerToken: string) => Promise<void>
  /** Called after successful confirm — typically for cache invalidation. */
  afterConfirm?: () => void
}

/**
 * Confirmation modal for permanent (hard) delete. Requires the user to:
 * 1. Type the record name exactly.
 * 2. Enter a manager PIN — verified via `/security/manager-pin/verify`.
 *
 * On success, calls `onConfirm(token)` so the caller can send the
 * `X-Manager-Authorization` header on the permanent-delete request.
 */
export function PermanentDeleteDialog(props: PermanentDeleteDialogProps) {
  const {
    open,
    onOpenChange,
    resourceLabel,
    recordName,
    onConfirm,
    afterConfirm,
  } = props
  const [typedName, setTypedName] = useState('')
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const nameOk = typedName === recordName
  const canSubmit = nameOk && pin.length >= 4 && !submitting

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await permanentDeleteWithPin({
        managerPin: pin,
        onConfirm,
      })
      toast.success(`${resourceLabel} permanently deleted`)
      afterConfirm?.()
      onOpenChange(false)
      setTypedName('')
      setPin('')
    } catch (error) {
      toast.error('Permanent delete failed', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Permanently delete this {resourceLabel.toLowerCase()}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. Type the {resourceLabel.toLowerCase()} name
            and enter a manager PIN to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="confirm-name">
              Type <span className="font-mono">{recordName}</span> to confirm
            </Label>
            <Input
              id="confirm-name"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="manager-pin">Manager PIN</Label>
            <Input
              id="manager-pin"
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="off"
              maxLength={12}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              disabled={!canSubmit}
              onClick={handleConfirm}
            >
              {submitting ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
