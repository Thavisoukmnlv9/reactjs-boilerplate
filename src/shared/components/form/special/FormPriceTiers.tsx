import { PlusIcon, TrashIcon } from 'lucide-react'
import type React from 'react'
import {
  Controller,
  type FieldValues,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { CurrencyInput } from '@/shared/components/ui/currency-input'
import { Input } from '@/shared/components/ui/input'
import { Field } from '../fields/Field'

export type PriceTier = {
  label: string
  price_cents: number
}

const DEFAULT_TIERS: PriceTier[] = [
  { label: 'Regular', price_cents: 0 },
  { label: 'Member', price_cents: 0 },
  { label: 'Wholesale', price_cents: 0 },
]

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Suggested defaults when the array is empty. */
  defaults?: PriceTier[]
  /** Cap the number of tiers (UI guard rail). */
  maxTiers?: number
}

export function FormPriceTiers({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  defaults = DEFAULT_TIERS,
  maxTiers = 6,
}: Props) {
  const { control } = useFormContext<FieldValues>()
  const { fields, append, remove } = useFieldArray({ control, name })

  const handleAdd = () => {
    if (fields.length >= maxTiers) return
    const next = defaults[fields.length] ?? {
      label: `Tier ${fields.length + 1}`,
      price_cents: 0,
    }
    append(next)
  }

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <div className="flex flex-col gap-2">
        {fields.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-muted-foreground text-sm">
            No price tiers yet.
          </div>
        ) : null}

        {fields.map((row, index) => (
          <div
            key={row.id}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] items-center gap-2"
          >
            <Controller
              control={control}
              name={`${name}.${index}.label`}
              render={({ field }) => (
                <Input
                  placeholder="Label (e.g. Member)"
                  disabled={disabled}
                  value={(field.value as string) ?? ''}
                  onChange={field.onChange}
                  ref={field.ref}
                />
              )}
            />
            <Controller
              control={control}
              name={`${name}.${index}.price_cents`}
              render={({ field }) => (
                <CurrencyInput
                  value={
                    typeof field.value === 'number' &&
                    !Number.isNaN(field.value)
                      ? field.value
                      : 0
                  }
                  onChange={field.onChange}
                  min={0}
                  disabled={disabled}
                  ref={field.ref}
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label={`Remove tier ${index + 1}`}
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
            onClick={handleAdd}
            disabled={disabled || fields.length >= maxTiers}
          >
            <PlusIcon className="mr-1 size-4" />
            Add tier
          </Button>
        </div>
      </div>
    </Field>
  )
}
