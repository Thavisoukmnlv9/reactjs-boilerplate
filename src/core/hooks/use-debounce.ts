import debounce from 'lodash.debounce'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): T & { cancel: () => void; flush: () => void } {
  const fnRef = useRef(fn)
  fnRef.current = fn

  const debouncedFn = useCallback(
    debounce((...args: Parameters<T>) => fnRef.current(...args), delay),
    [delay]
  ) as T & { cancel: () => void; flush: () => void }

  useEffect(() => () => debouncedFn.cancel(), [debouncedFn])

  return debouncedFn
}
