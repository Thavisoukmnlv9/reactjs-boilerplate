import { GripVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react'
import {
  Controller,
  type FieldValues,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { CurrencyInput } from '@/shared/components/ui/currency-input'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { FormInput } from '../fields/FormInput'
import { FormNumberInput } from '../fields/FormNumberInput'
import { FormSwitch } from '../fields/FormSwitch'

export type ModifierOption = {
  name: string
  /** Price delta vs. base, in cents. */
  price_delta_cents: number
  is_default?: boolean
  display_order?: number
}

export type ModifierGroupValue = {
  name: string
  description?: string
  required: boolean
  multi_select: boolean
  min_select: number
  max_select: number
  display_order?: number
  is_active: boolean
  options: ModifierOption[]
}

type Props = {
  /** Path prefix for the modifier group object. Pass `''` to bind fields at
   * the form root. */
  name: string
  /** Hide / show the inline options editor. */
  includeOptionsEditor?: boolean
  disabled?: boolean
}

function prefixed(prefix: string, key: string): string {
  return prefix === '' ? key : `${prefix}.${key}`
}

export function FormModifierGroupBuilder({
  name,
  includeOptionsEditor = true,
  disabled,
}: Props) {
  const { control } = useFormContext<FieldValues>()
  const multiSelect = useWatch({
    control,
    name: prefixed(name, 'multi_select'),
  })

  return (
    <div className="flex flex-col gap-4">
      <FormInput
        name={prefixed(name, 'name')}
        label="Group name"
        placeholder="e.g. Spice level"
        requiredMark
        disabled={disabled}
      />

      <FormInput
        name={prefixed(name, 'description')}
        label="Description"
        placeholder="Optional hint shown to staff"
        disabled={disabled}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormSwitch
          name={prefixed(name, 'required')}
          label="Required"
          hint="Guest must pick at least one option."
        />
        <FormSwitch
          name={prefixed(name, 'multi_select')}
          label="Allow multiple"
          hint="Pick more than one option from this group."
        />
      </div>

      {multiSelect ? (
        <div className="grid grid-cols-2 gap-3">
          <FormNumberInput
            name={prefixed(name, 'min_select')}
            label="Min selected"
            min={0}
            max={50}
            disabled={disabled}
          />
          <FormNumberInput
            name={prefixed(name, 'max_select')}
            label="Max selected"
            min={1}
            max={50}
            disabled={disabled}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormNumberInput
          name={prefixed(name, 'display_order')}
          label="Display order"
          min={0}
          max={9999}
          disabled={disabled}
        />
        <FormSwitch name={prefixed(name, 'is_active')} label="Active" />
      </div>

      {includeOptionsEditor ? (
        <OptionsEditor
          optionsName={prefixed(name, 'options')}
          disabled={disabled}
        />
      ) : null}
    </div>
  )
}

function OptionsEditor({
  optionsName,
  disabled,
}: {
  optionsName: string
  disabled?: boolean
}) {
  const { control, register } = useFormContext<FieldValues>()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: optionsName,
  })

  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-medium text-sm">Options</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ name: '', price_delta_cents: 0, is_default: false })
          }
          disabled={disabled}
        >
          <PlusIcon className="mr-1 size-4" />
          Add option
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed bg-background p-3 text-center text-muted-foreground text-sm">
          No options yet.
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        {fields.map((row, index) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] items-center gap-2 rounded-md border bg-background p-2"
          >
            <button
              type="button"
              className="cursor-grab text-muted-foreground"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => index > 0 && move(index, index - 1)}
              aria-label="Reorder"
            >
              <GripVerticalIcon className="size-4" />
            </button>
            <Input
              placeholder="Option name"
              autoComplete="off"
              disabled={disabled}
              {...register(`${optionsName}.${index}.name`)}
            />
            <Controller
              control={control}
              name={`${optionsName}.${index}.price_delta_cents`}
              render={({ field }) => (
                <CurrencyInput
                  value={
                    typeof field.value === 'number' &&
                    !Number.isNaN(field.value)
                      ? field.value
                      : 0
                  }
                  onChange={field.onChange}
                  min={-Number.MAX_SAFE_INTEGER}
                  disabled={disabled}
                  ref={field.ref}
                />
              )}
            />
            <Controller
              control={control}
              name={`${optionsName}.${index}.is_default`}
              render={({ field }) => (
                <label className="flex items-center gap-2 px-2 text-muted-foreground text-xs">
                  <Switch
                    checked={Boolean(field.value)}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                    disabled={disabled}
                  />
                  Default
                </label>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label={`Remove option ${index + 1}`}
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
