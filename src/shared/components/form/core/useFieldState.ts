import { useFormContext, useFormState } from 'react-hook-form'

export function useFieldState(name: string) {
  const { control } = useFormContext()
  return useFormState({ control, name })
}
