import { Plus, Tag, Trash2, X } from 'lucide-react'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Field } from './Field'

export type FormArrayTextProps = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
  className?: string
  placeholder?: string
  addButtonText?: string
  maxItems?: number
  disabled?: boolean
}

export function FormArrayText({
  name,
  label,
  hint,
  icon,
  requiredMark,
  className,
  placeholder = 'Enter text',
  addButtonText = 'Add Item',
  maxItems,
  disabled = false,
}: FormArrayTextProps) {
  const { control } = useFormContext()

  const controllerEl = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const values = Array.isArray(field.value) ? field.value : []

        const addItem = () => {
          if (maxItems && values.length >= maxItems) return
          field.onChange([...values, ''])
        }

        const removeItem = (index: number) => {
          const newValues = values.filter((_, i) => i !== index)
          field.onChange(newValues)
        }

        const updateItem = (index: number, value: string) => {
          const newValues = [...values]
          newValues[index] = value
          field.onChange(newValues)
        }

        const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (values[index]?.trim()) {
              addItem()
            }
          }
        }

        return (
          <div className="space-y-3">
            {/* Display existing items as badges */}
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
                {values.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="group flex items-center gap-1 border bg-background px-3 py-1.5 font-medium text-sm shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <Tag className="h-3 w-3" />
                    <span className="max-w-[200px] truncate">
                      {value || 'Empty'}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={disabled}
                      className="ml-1 h-4 w-4 p-0 transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Input section */}
            <div className="space-y-2">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-lg border bg-background p-2 transition-all duration-200 hover:border-primary/50"
                >
                  <div className="flex-1">
                    <Input
                      value={value}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder={placeholder}
                      disabled={disabled}
                      className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={disabled}
                    className="h-8 w-8 opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Add new item button */}
              {(!maxItems || values.length < maxItems) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  disabled={disabled}
                  className="group h-10 w-full border-2 border-dashed transition-all duration-200 hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="font-medium">{addButtonText}</span>
                </Button>
              )}

              {/* Max items reached message */}
              {maxItems && values.length >= maxItems && (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Maximum {maxItems} items allowed
                  </p>
                </div>
              )}

              {/* Empty state */}
              {values.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  <Tag className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No items added yet</p>
                  <p className="text-xs">Click "Add Item" to get started</p>
                </div>
              )}
            </div>
          </div>
        )
      }}
    />
  )

  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      {icon ? (
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-3 flex text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          <div className={cn(icon && 'pl-9')}>{controllerEl}</div>
        </div>
      ) : (
        controllerEl
      )}
    </Field>
  )
}
