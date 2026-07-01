/**
 * `<TypedConfirmDialog>` — destructive-confirm dialog that requires the user to
 * type a specific phrase (typically the entity name or "CONFIRM") before the
 * action can fire. Built on top of `<Dialog>` so it slots into existing
 * dialog-driven flows.
 *
 * Usage:
 *
 *   <TypedConfirmDialog
 *     open={open}
 *     onOpenChange={setOpen}
 *     title="Auto-resolve duplicates?"
 *     description="This merges every detected duplicate group using the highest-spend-wins rule."
 *     confirmPhrase="CONFIRM"
 *     confirmLabel="Auto-resolve"
 *     onConfirm={handleConfirm}
 *     isLoading={mutation.isPending}
 *   />
 */

import * as React from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

export interface TypedConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmPhrase: string
  confirmLabel?: string
  cancelLabel?: string
  /** When true the phrase comparison ignores case. Default true. */
  caseInsensitive?: boolean
  onConfirm: () => void
  isLoading?: boolean
}

export function TypedConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmPhrase,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  caseInsensitive = true,
  onConfirm,
  isLoading,
}: TypedConfirmDialogProps) {
  const [value, setValue] = React.useState('')

  // Reset the typed value whenever the dialog re-opens so a previous typed
  // string doesn't survive a cancel + reopen.
  React.useEffect(() => {
    if (!open) setValue('')
  }, [open])

  const normalize = (s: string) => (caseInsensitive ? s.toUpperCase() : s)
  const isMatch = normalize(value.trim()) === normalize(confirmPhrase.trim())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="typed-confirm-input">
            Type{' '}
            <span className="font-mono font-semibold">{confirmPhrase}</span> to
            proceed
          </Label>
          <Input
            id="typed-confirm-input"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            disabled={!isMatch || isLoading}
            onClick={onConfirm}
          >
            {isLoading ? 'Working…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
