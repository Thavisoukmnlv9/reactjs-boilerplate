import { SlidersHorizontalIcon } from 'lucide-react'
import type React from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export type ColumnVisibilityItem = {
  id: string
  label: React.ReactNode
  visible: boolean
  /** Set to false to forbid hiding a load-bearing column (e.g. name). */
  hideable?: boolean
}

type Props = {
  columns: ColumnVisibilityItem[]
  onChange: (id: string, visible: boolean) => void
  buttonLabel?: string
}

export function TableColumnVisibility({
  columns,
  onChange,
  buttonLabel = 'Columns',
}: Props) {
  if (columns.length === 0) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <SlidersHorizontalIcon className="mr-1.5 size-3.5" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((c) => (
          <DropdownMenuCheckboxItem
            key={c.id}
            checked={c.visible}
            disabled={c.hideable === false}
            onCheckedChange={(checked) => onChange(c.id, Boolean(checked))}
          >
            {c.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
