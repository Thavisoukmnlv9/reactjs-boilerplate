import type React from 'react'
import {
  type FieldValues,
  type UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'

export type FieldArrayHelpers<TItem> = {
  fields: (TItem & { id: string })[]
  append: UseFieldArrayReturn['append']
  prepend: UseFieldArrayReturn['prepend']
  remove: UseFieldArrayReturn['remove']
  move: UseFieldArrayReturn['move']
  insert: UseFieldArrayReturn['insert']
  update: UseFieldArrayReturn['update']
  replace: UseFieldArrayReturn['replace']
  swap: UseFieldArrayReturn['swap']
}

type Props<TItem> = {
  name: string
  children: (helpers: FieldArrayHelpers<TItem>) => React.ReactNode
}

export function FormFieldArray<TItem = unknown>({
  name,
  children,
}: Props<TItem>) {
  const { control } = useFormContext<FieldValues>()
  const fa = useFieldArray({ control, name })
  return (
    <>
      {children({
        fields: fa.fields as unknown as (TItem & { id: string })[],
        append: fa.append,
        prepend: fa.prepend,
        remove: fa.remove,
        move: fa.move,
        insert: fa.insert,
        update: fa.update,
        replace: fa.replace,
        swap: fa.swap,
      })}
    </>
  )
}
