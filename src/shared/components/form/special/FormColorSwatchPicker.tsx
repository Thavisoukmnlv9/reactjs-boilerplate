import { CheckIcon } from 'lucide-react'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { Field } from '../fields/Field'

export type ColorSwatchOption = {
  hex: string
  label?: string
}

/** Default palette — neutral fashion-friendly set. Override via `palette`. */
const DEFAULT_PALETTE: ColorSwatchOption[] = [
  { hex: '#000000', label: 'Black' },
  { hex: '#ffffff', label: 'White' },
  { hex: '#374151', label: 'Charcoal' },
  { hex: '#9ca3af', label: 'Grey' },
  { hex: '#dc2626', label: 'Red' },
  { hex: '#ea580c', label: 'Orange' },
  { hex: '#f59e0b', label: 'Amber' },
  { hex: '#65a30d', label: 'Olive' },
  { hex: '#16a34a', label: 'Green' },
  { hex: '#0d9488', label: 'Teal' },
  { hex: '#0284c7', label: 'Blue' },
  { hex: '#1d4ed8', label: 'Navy' },
  { hex: '#7c3aed', label: 'Purple' },
  { hex: '#db2777', label: 'Pink' },
  { hex: '#92400e', label: 'Brown' },
  { hex: '#fde68a', label: 'Cream' },
]

function normalizeHex(input?: string | null): string | null {
  if (!input) return null
  const trimmed = input.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{3,8}$/.test(trimmed)) return null
  return `#${trimmed.toLowerCase()}`
}

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  palette?: ColorSwatchOption[]
  /** Allow free-form hex entry alongside the palette. */
  allowCustom?: boolean
}

export function FormColorSwatchPicker({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  palette = DEFAULT_PALETTE,
  allowCustom = true,
}: Props) {
  const { control } = useFormContext()

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const current = normalizeHex(field.value as string | undefined)
          const matchedLabel = palette.find((c) => c.hex === current)?.label
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full justify-start gap-2"
                  disabled={disabled}
                >
                  <span
                    className={cn(
                      'inline-block size-5 shrink-0 rounded-full border border-border ring-1 ring-black/5',
                      !current && 'bg-muted'
                    )}
                    style={current ? { backgroundColor: current } : undefined}
                    aria-hidden
                  />
                  <span className="truncate">
                    {current ? (matchedLabel ?? current) : 'Pick a color'}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72">
                <div className="grid grid-cols-8 gap-2">
                  {palette.map((c) => {
                    const isSelected = current === c.hex
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.label ?? c.hex}
                        aria-label={c.label ?? c.hex}
                        onClick={() => field.onChange(c.hex)}
                        className={cn(
                          'relative flex size-7 items-center justify-center rounded-full border border-border ring-1 ring-black/5 transition-transform',
                          'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring',
                          isSelected && 'ring-2 ring-ring'
                        )}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected ? (
                          <CheckIcon className="size-3.5 text-white drop-shadow" />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
                {allowCustom ? (
                  <div className="mt-3 flex items-center gap-2 border-t pt-3">
                    <input
                      type="color"
                      className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
                      value={current ?? '#000000'}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={disabled}
                      aria-label="Custom color picker"
                    />
                    <Input
                      placeholder="#000000"
                      className="h-9 flex-1"
                      value={(field.value as string) ?? ''}
                      onChange={(e) => {
                        const normalized = normalizeHex(e.target.value)
                        field.onChange(normalized ?? e.target.value)
                      }}
                      disabled={disabled}
                    />
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>
          )
        }}
      />
    </Field>
  )
}
