import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

type Option = { value: string; label: string }

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  placeholder?: string
  options: Option[]
  onCreate?: (label: string) => Promise<Option | undefined> | Option | undefined
}

export function FormComboboxCreatable({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  placeholder = 'Select…',
  options,
  onCreate,
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selected = options.find((o) => o.value === field.value)
          const trimmed = query.trim()
          const showCreate =
            !!onCreate &&
            trimmed.length > 0 &&
            !options.some(
              (o) => o.label.toLowerCase() === trimmed.toLowerCase()
            )

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={Boolean(error)}
                  disabled={disabled}
                  className={cn(
                    'w-full justify-between font-normal',
                    !selected && 'text-muted-foreground'
                  )}
                >
                  {selected ? selected.label : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search…"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          onSelect={() => {
                            field.onChange(opt.value)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === opt.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {opt.label}
                        </CommandItem>
                      ))}
                      {showCreate ? (
                        <CommandItem
                          key="__create__"
                          value={`__create__${trimmed}`}
                          onSelect={async () => {
                            const created = await onCreate?.(trimmed)
                            if (created) {
                              field.onChange(created.value)
                              setOpen(false)
                              setQuery('')
                            }
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create &ldquo;{trimmed}&rdquo;
                        </CommandItem>
                      ) : null}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )
        }}
      />
    </Field>
  )
}
