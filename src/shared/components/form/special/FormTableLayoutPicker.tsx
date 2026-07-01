import { Move3dIcon } from 'lucide-react'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Field } from '../fields/Field'

export type TableLayoutEntry = {
  id: string
  label: string
  capacity?: number
  /** Free-form geometry payload (canvas-specific). */
  geometry?: unknown
}

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Called when the user wants to open the visual editor. The host page is
   * responsible for routing or revealing the canvas (Phase 2 will move that
   * canvas into shared/). */
  onOpenEditor?: () => void
}

/**
 * Phase 1 contract for the visual table-layout picker. This field provides the
 * value-bound shell that downstream verticals (e.g. food service) can attach to
 * so the canvas-open flow is consistent; the host page supplies the canvas.
 */
export function FormTableLayoutPicker({
  name,
  label = 'Table layout',
  hint,
  requiredMark,
  disabled,
  onOpenEditor,
}: Props) {
  const { control } = useFormContext()

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const tables = Array.isArray(field.value)
            ? (field.value as TableLayoutEntry[])
            : []
          return (
            <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">
                    {tables.length === 0
                      ? 'No tables placed yet.'
                      : `${tables.length} table${tables.length === 1 ? '' : 's'} on layout`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Open the visual editor to add, move, or resize tables.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={disabled || !onOpenEditor}
                  onClick={onOpenEditor}
                >
                  <Move3dIcon className="mr-2 size-4" />
                  Open editor
                </Button>
              </div>
              {tables.length > 0 ? (
                <ul className="grid grid-cols-2 gap-1 text-muted-foreground text-xs sm:grid-cols-3 md:grid-cols-4">
                  {tables.slice(0, 12).map((t) => (
                    <li
                      key={t.id}
                      className="truncate rounded bg-background px-2 py-1"
                    >
                      {t.label}
                      {typeof t.capacity === 'number'
                        ? ` · ${t.capacity}p`
                        : null}
                    </li>
                  ))}
                  {tables.length > 12 ? (
                    <li className="rounded bg-background px-2 py-1">
                      +{tables.length - 12} more
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          )
        }}
      />
    </Field>
  )
}
