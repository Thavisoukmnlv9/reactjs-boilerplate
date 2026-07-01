import { PlusIcon, TrashIcon } from 'lucide-react'
import * as React from 'react'
import {
  Controller,
  type FieldValues,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { NumberInput } from '@/shared/components/ui/number-Input'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group'
import { Field } from '../fields/Field'

export type Measurement = {
  key: string
  value_cm: number
  note?: string
}

export const STANDARD_MEASUREMENT_KEYS = [
  'Waist',
  'Inseam',
  'Outseam',
  'Chest',
  'Bust',
  'Hip',
  'Shoulder',
  'Sleeve',
  'Neck',
  'Bicep',
  'Wrist',
  'Thigh',
  'Calf',
  'Back length',
] as const

type Unit = 'cm' | 'in'

const CM_PER_INCH = 2.54

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Keys to present as quick-add chips. Defaults to the standard set. */
  presetKeys?: readonly string[]
  defaultUnit?: Unit
}

export function FormMeasurementSet({
  name,
  label = 'Measurements',
  hint,
  requiredMark,
  disabled,
  presetKeys = STANDARD_MEASUREMENT_KEYS,
  defaultUnit = 'cm',
}: Props) {
  const { control, register } = useFormContext<FieldValues>()
  const { fields, append, remove } = useFieldArray({ control, name })

  // Display unit is local to the editor; we always persist in cm.
  const [unit, setUnit] = React.useState<Unit>(defaultUnit)

  const usedKeys = new Set(
    fields.map((row) =>
      (row as unknown as Measurement).key?.toLowerCase().trim()
    )
  )
  const availablePresets = presetKeys.filter(
    (k) => !usedKeys.has(k.toLowerCase())
  )

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {availablePresets.map((k) => (
            <Button
              key={k}
              type="button"
              variant="outline"
              size="sm"
              className="h-7"
              disabled={disabled}
              onClick={() => append({ key: k, value_cm: 0 })}
            >
              <PlusIcon className="mr-1 size-3" />
              {k}
            </Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Display</span>
            <ToggleGroup
              type="single"
              value={unit}
              onValueChange={(v) => {
                if (v === 'cm' || v === 'in') setUnit(v)
              }}
              disabled={disabled}
            >
              <ToggleGroupItem value="cm" className="h-7 px-2 text-xs">
                cm
              </ToggleGroupItem>
              <ToggleGroupItem value="in" className="h-7 px-2 text-xs">
                in
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-sm">
            No measurements recorded.
          </div>
        ) : null}

        {fields.map((row, index) => (
          <div
            key={row.id}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.4fr)_auto] items-center gap-2"
          >
            <Input
              placeholder="Measurement"
              disabled={disabled}
              {...register(`${name}.${index}.key`)}
            />
            <Controller
              control={control}
              name={`${name}.${index}.value_cm`}
              render={({ field }) => {
                const cm =
                  typeof field.value === 'number' && !Number.isNaN(field.value)
                    ? field.value
                    : 0
                const displayed = unit === 'cm' ? cm : cm / CM_PER_INCH
                const handleChange = (next: number) => {
                  const nextCm = unit === 'cm' ? next : next * CM_PER_INCH
                  field.onChange(Math.round(nextCm * 10) / 10)
                }
                return (
                  <div className="relative">
                    <NumberInput
                      ref={field.ref}
                      value={Math.round(displayed * 10) / 10}
                      onChange={handleChange}
                      min={0}
                      step={unit === 'cm' ? 0.5 : 0.25}
                      disabled={disabled}
                    />
                    <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                      {unit}
                    </span>
                  </div>
                )
              }}
            />
            <Input
              placeholder="Note (optional)"
              disabled={disabled}
              {...register(`${name}.${index}.note`)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label={`Remove measurement ${index + 1}`}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        ))}

        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => append({ key: '', value_cm: 0 })}
          >
            <PlusIcon className="mr-1 size-4" />
            Add custom
          </Button>
        </div>
      </div>
    </Field>
  )
}
