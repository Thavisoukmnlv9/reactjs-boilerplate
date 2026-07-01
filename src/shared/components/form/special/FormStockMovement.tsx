import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { NumberInput } from '@/shared/components/ui/number-Input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group'
import { Field } from '../fields/Field'

export type StockMovementType = 'ADD' | 'ADJUST' | 'DAMAGE'

const TYPE_LABEL: Record<StockMovementType, string> = {
  ADD: 'Receive',
  ADJUST: 'Adjust',
  DAMAGE: 'Damage',
}

const TYPE_HINT: Record<StockMovementType, string> = {
  ADD: 'Add stock from a delivery or transfer in.',
  ADJUST: 'Correct the on-hand count after a cycle count.',
  DAMAGE: 'Write off damaged, expired, or lost stock.',
}

type Props = {
  /** Path to the type field (StockMovementType). */
  typeName: string
  /** Path to the quantity field (positive integer). */
  qtyName: string
  /** Path to the reason field (string). */
  reasonName: string
  /** Path to the reference field (e.g. invoice number, internal note). */
  refName?: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Which movement types to expose. */
  enabledTypes?: StockMovementType[]
}

export function FormStockMovement({
  typeName,
  qtyName,
  reasonName,
  refName,
  label = 'Stock movement',
  hint,
  requiredMark,
  disabled,
  enabledTypes = ['ADD', 'ADJUST', 'DAMAGE'],
}: Props) {
  const { control, register, watch } = useFormContext()
  const currentType = (watch(typeName) as StockMovementType) ?? enabledTypes[0]

  return (
    <Field
      name={typeName}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
    >
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name={typeName}
          render={({ field }) => (
            <ToggleGroup
              type="single"
              value={(field.value as string) ?? enabledTypes[0]}
              onValueChange={(v) => {
                if (v) field.onChange(v)
              }}
              disabled={disabled}
              className="justify-start"
            >
              {enabledTypes.map((t) => (
                <ToggleGroupItem key={t} value={t} className="h-9 px-3 text-sm">
                  {TYPE_LABEL[t]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
        <p className="text-muted-foreground text-xs">
          {TYPE_HINT[currentType]}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-muted-foreground text-xs">
              Quantity
            </span>
            <Controller
              control={control}
              name={qtyName}
              render={({ field }) => (
                <NumberInput
                  ref={field.ref}
                  id={qtyName}
                  value={
                    typeof field.value === 'number' &&
                    !Number.isNaN(field.value)
                      ? field.value
                      : 0
                  }
                  onChange={field.onChange}
                  min={0}
                  step={1}
                  showThousandsSeparator
                  disabled={disabled}
                />
              )}
            />
          </div>
          {refName ? (
            <div>
              <span className="mb-1 block text-muted-foreground text-xs">
                Reference
              </span>
              <Input
                id={refName}
                placeholder="e.g. invoice no. or PO ref"
                autoComplete="off"
                disabled={disabled}
                {...register(refName)}
              />
            </div>
          ) : null}
        </div>

        <div>
          <span className="mb-1 block text-muted-foreground text-xs">
            Reason
          </span>
          <Textarea
            id={reasonName}
            rows={2}
            placeholder={
              currentType === 'DAMAGE'
                ? 'Describe what happened…'
                : 'Optional note for the audit log.'
            }
            disabled={disabled}
            {...register(reasonName)}
          />
        </div>
      </div>
    </Field>
  )
}
