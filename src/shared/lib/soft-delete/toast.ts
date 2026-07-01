import { toast } from 'sonner'

export interface SoftDeleteWithUndoOptions {
  /** Human-readable resource label, e.g. "Product". */
  resourceLabel: string
  /** Name of the row being deleted, shown in the toast. */
  recordName: string
  /** Calls the backend soft-delete endpoint. */
  onDelete: () => Promise<void>
  /** Calls the backend restore endpoint. */
  onRestore: () => Promise<void>
  /** Window in ms during which Undo is offered. Default 10s. */
  undoMs?: number
  /** Optional callbacks for refetch / cache invalidation. */
  afterDelete?: () => void
  afterRestore?: () => void
}

/**
 * Soft-delete with an undo toast. Calls `onDelete` immediately and shows a
 * sonner toast with an "Undo" action that calls `onRestore` if clicked before
 * the toast auto-dismisses.
 */
export async function softDeleteWithUndo(
  opts: SoftDeleteWithUndoOptions
): Promise<void> {
  const undoMs = opts.undoMs ?? 10000
  try {
    await opts.onDelete()
    opts.afterDelete?.()
  } catch (error) {
    toast.error(`Failed to delete ${opts.resourceLabel.toLowerCase()}`, {
      description: error instanceof Error ? error.message : undefined,
    })
    return
  }

  toast(`${opts.resourceLabel} deleted`, {
    description: opts.recordName,
    duration: undoMs,
    action: {
      label: 'Undo',
      onClick: async () => {
        try {
          await opts.onRestore()
          opts.afterRestore?.()
          toast.success(`${opts.resourceLabel} restored`)
        } catch (error) {
          toast.error(`Failed to restore ${opts.resourceLabel.toLowerCase()}`, {
            description: error instanceof Error ? error.message : undefined,
          })
        }
      },
    },
  })
}
