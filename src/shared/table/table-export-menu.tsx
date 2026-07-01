import { DownloadIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

export type ExportFormat = 'csv' | 'xlsx' | 'json'

type Props = {
  /** Map of format → handler. Pass only the formats you support. */
  onExport: Partial<Record<ExportFormat, () => void | Promise<void>>>
  disabled?: boolean
  buttonLabel?: string
}

const FORMAT_LABEL: Record<ExportFormat, string> = {
  csv: 'Export CSV',
  xlsx: 'Export Excel (.xlsx)',
  json: 'Export JSON',
}

export function TableExportMenu({
  onExport,
  disabled,
  buttonLabel = 'Export',
}: Props) {
  const formats = (Object.keys(onExport) as ExportFormat[]).filter(
    (f) => typeof onExport[f] === 'function'
  )
  if (formats.length === 0) return null

  if (formats.length === 1) {
    const f = formats[0]
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-9"
        disabled={disabled}
        onClick={() => void onExport[f]?.()}
      >
        <DownloadIcon className="mr-1.5 size-3.5" />
        {FORMAT_LABEL[f]}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9" disabled={disabled}>
          <DownloadIcon className="mr-1.5 size-3.5" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.map((f) => (
          <DropdownMenuItem key={f} onClick={() => void onExport[f]?.()}>
            {FORMAT_LABEL[f]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
