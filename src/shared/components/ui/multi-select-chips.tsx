import { X } from 'lucide-react'
import { cn } from '@/core/utils/cn'

interface MultiSelectChipsProps {
  label?: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  helperText?: string
}

const MultiSelectChips = ({
  label,
  options,
  selected,
  onChange,
  helperText,
}: MultiSelectChipsProps) => {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  return (
    <div className="space-y-1.5">
      {label != null && label !== '' && (
        <label className="field-label block font-medium text-sm text-foreground">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-input bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span>{opt.label}</span>
              {isActive && (
                <span
                  className="inline-flex shrink-0 rounded-full p-0.5 hover:bg-primary-foreground/20"
                  aria-hidden
                >
                  <X size={14} strokeWidth={2.5} />
                </span>
              )}
            </button>
          )
        })}
      </div>
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  )
}

export default MultiSelectChips
