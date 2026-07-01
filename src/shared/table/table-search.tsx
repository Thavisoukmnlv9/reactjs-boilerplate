import { SearchIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Input } from '@/shared/components/ui/input'

type Props = {
  value: string
  onChange: (next: string) => void
  placeholder?: string
  /** Debounce window in ms. Defaults to 300. */
  debounceMs?: number
  className?: string
}

export function TableSearch({
  value,
  onChange,
  placeholder = 'Search…',
  debounceMs = 300,
  className,
}: Props) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  useEffect(() => {
    if (local === value) return
    const t = window.setTimeout(() => onChange(local), debounceMs)
    return () => window.clearTimeout(t)
  }, [local, value, onChange, debounceMs])

  return (
    <div className={cn('relative w-full sm:w-64', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        type="search"
      />
      {local ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setLocal('')
            onChange('')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
