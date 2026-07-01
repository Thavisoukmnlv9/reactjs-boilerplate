import type React from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  type MatrixVariantItem,
  VariantMatrixGrid,
} from '@/modules/pos/clothing/_shared/components/VariantMatrixGrid'
import { Field } from '../fields/Field'

export type FormVariantMatrixValue = MatrixVariantItem[]

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Called when a variant cell is clicked — the consumer opens an edit sheet. */
  onEditCell?: (variant: MatrixVariantItem) => void
}

/**
 * RHF-bound wrapper around the existing VariantMatrixGrid. The stored value is
 * the array of variants; selection is local UI state (the wizard is responsible
 * for bulk edits and writing the resulting variants back into the field).
 */
export function FormVariantMatrix({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  onEditCell,
}: Props) {
  const { control } = useFormContext()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const variants = Array.isArray(field.value)
            ? (field.value as MatrixVariantItem[])
            : []
          if (variants.length === 0) {
            return (
              <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
                No variants yet. Use the variant generator to build a size ×
                color matrix.
              </div>
            )
          }
          return (
            <div
              className={
                disabled ? 'pointer-events-none opacity-60' : undefined
              }
            >
              <VariantMatrixGrid
                variants={variants}
                selectedIds={selectedIds}
                onSelectedChange={setSelectedIds}
                onCellClick={onEditCell}
              />
            </div>
          )
        }}
      />
    </Field>
  )
}
