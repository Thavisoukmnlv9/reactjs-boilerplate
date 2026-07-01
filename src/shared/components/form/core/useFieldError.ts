import { useFormContext, useFormState } from 'react-hook-form'
import { getByDotPath } from '../utils/dotPath'

export function useFieldError(name: string) {
  const { control } = useFormContext()
  const { errors } = useFormState({ control, name })
  return getByDotPath(errors, name)
}
