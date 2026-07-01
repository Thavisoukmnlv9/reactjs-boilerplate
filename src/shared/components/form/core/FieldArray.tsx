import type React from 'react'
import {
  type UseFieldArrayReturn,
  useFieldArray,
  useFormContext,
} from 'react-hook-form'

type Props = {
  name: string
  children: (fa: UseFieldArrayReturn) => React.ReactNode
}

export function FieldArray({ name, children }: Props) {
  const { control } = useFormContext()
  const fa = useFieldArray({ control, name })
  return <>{children(fa)}</>
}
