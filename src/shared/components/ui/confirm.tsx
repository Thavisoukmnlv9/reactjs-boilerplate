'use client'

import i18next from 'i18next'
import { XIcon } from 'lucide-react'
import type * as React from 'react'
import { toast } from 'sonner'
import { Button } from './button'

type ConfirmOptions = {
  /** Title text shown at the top */
  title?: React.ReactNode
  /** Optional description content under the title */
  description?: React.ReactNode
  /** Confirm button label */
  confirmText?: React.ReactNode
  /** Cancel button label */
  cancelText?: React.ReactNode
  /** Variant style for confirm button */
  confirmVariant?: 'default' | 'destructive' | 'secondary' | 'outline'
  /** Auto-close timeout in ms (0 to disable) */
  autoCloseMs?: number
}

/**
 * Opens a Sonner toast with inline confirm/cancel actions and resolves a promise with the result.
 */
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  // Defaults are resolved inside the function body (not at module scope) so they
  // reflect the current language on every call.
  const {
    title = i18next.t('common:confirm.title'),
    description,
    confirmText = i18next.t('common:confirm.confirm'),
    cancelText = i18next.t('common:confirm.cancel'),
    confirmVariant = 'default',
    autoCloseMs = 0,
  } = options

  return new Promise<boolean>((resolve) => {
    const id = toast.custom(
      (t) => {
        const close = () => toast.dismiss(t)
        const onConfirm = () => {
          resolve(true)
          close()
        }
        const onCancel = () => {
          resolve(false)
          close()
        }

        return (
          <div className="group/toast w-[min(92vw,420px)] rounded-md border bg-popover p-3 text-popover-foreground shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1">
                {title ? (
                  <div className="font-medium text-sm">{title}</div>
                ) : null}
                {description ? (
                  <div className="text-muted-foreground text-sm">
                    {description}
                  </div>
                ) : null}
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={onCancel}>
                    {cancelText}
                  </Button>
                  <Button
                    variant={confirmVariant}
                    size="sm"
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                aria-label={i18next.t('common:confirm.dismiss')}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
        )
      },
      {
        id: 'confirm-' + Math.random().toString(36).slice(2),
        position: 'top-center',
      }
    )

    if (autoCloseMs > 0) {
      window.setTimeout(() => toast.dismiss(id), autoCloseMs)
    }
  })
}

export { toast }
