import { ConfirmDialog } from './confirm-dialog'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entityName?: string
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteDialog({
  open,
  onOpenChange,
  entityName = 'item',
  onConfirm,
  isLoading,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${entityName}?`}
      description="This action cannot be undone."
      onConfirm={onConfirm}
      confirmLabel="Delete"
      isLoading={isLoading}
    />
  )
}
