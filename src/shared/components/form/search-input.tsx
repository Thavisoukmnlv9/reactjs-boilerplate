import { Search } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/core/utils/cn'
import { Input } from '@/shared/components/ui/input'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
        <Search />
      </span>
      <Input
        type="search"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}
