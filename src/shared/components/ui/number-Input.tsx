import { Minus, Plus } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/core/utils/cn'

const groupedIntegerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  useGrouping: true,
})

export function formatGroupedInteger(n: number): string {
  return groupedIntegerFormatter.format(Math.trunc(n))
}

export type NumberInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** When true, shows thousands separators (e.g. 1,000). Form values stay numeric. */
  showThousandsSeparator?: boolean
  disabled?: boolean
  className?: string
  id?: string
  'aria-invalid'?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100000000000,
      step = 1,
      showThousandsSeparator = true,
      disabled = false,
      className,
      id,
      'aria-invalid': ariaInvalid,
      prefix,
      suffix,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(() =>
      showThousandsSeparator ? formatGroupedInteger(value) : String(value)
    )
    const isFocusedRef = React.useRef(false)

    React.useEffect(() => {
      if (!isFocusedRef.current) {
        setDisplayValue(
          showThousandsSeparator ? formatGroupedInteger(value) : String(value)
        )
      }
    }, [value, showThousandsSeparator])

    const handleDecrement = () => {
      const next = Math.max(min, value - step)
      if (next !== value) {
        onChange(next)
        if (showThousandsSeparator) setDisplayValue(formatGroupedInteger(next))
      }
    }

    const handleIncrement = () => {
      const next = Math.min(max, value + step)
      if (next !== value) {
        onChange(next)
        if (showThousandsSeparator) setDisplayValue(formatGroupedInteger(next))
      }
    }

    const emptyValue = Math.min(max, Math.max(min, 0))

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      const isNegative = min < 0 && raw.trim().startsWith('-')
      if (showThousandsSeparator) {
        const digits = raw.replace(/\D/g, '')
        if (digits === '') {
          // Allow a lone "-" while the user is still typing a negative value.
          if (isNegative) {
            setDisplayValue('-')
            return
          }
          onChange(emptyValue)
          setDisplayValue('')
          return
        }
        const magnitude = Number.parseInt(digits, 10)
        if (!Number.isNaN(magnitude)) {
          const parsed = isNegative ? -magnitude : magnitude
          if (parsed > max || parsed < min) return
          onChange(parsed)
          setDisplayValue(formatGroupedInteger(parsed))
        }
        return
      }
      if (raw === '' || raw === '-') {
        if (isNegative) return
        onChange(emptyValue)
        return
      }
      const parsed = Number.parseInt(raw, 10)
      if (!Number.isNaN(parsed)) {
        if (parsed > max || parsed < min) return
        onChange(parsed)
      }
    }

    const handleFocus = () => {
      if (showThousandsSeparator) isFocusedRef.current = true
    }

    const handleBlur = () => {
      if (showThousandsSeparator) {
        isFocusedRef.current = false
        setDisplayValue(formatGroupedInteger(value))
      }
    }

    const handleKeyDown = (
      e: React.KeyboardEvent,
      action: 'decrement' | 'increment'
    ) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        action === 'decrement' ? handleDecrement() : handleIncrement()
      }
    }

    const stepperProps = (action: 'decrement' | 'increment') => ({
      role: 'button' as const,
      tabIndex: -1,
      'aria-label': action === 'decrement' ? 'Decrease' : 'Increase',
      onClick: action === 'decrement' ? handleDecrement : handleIncrement,
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, action),
    })

    return (
      <div
        role="group"
        aria-invalid={ariaInvalid}
        className={cn(
          'flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]',
          'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
      >
        <span
          {...stepperProps('decrement')}
          aria-disabled={disabled || value <= min}
          className={cn(
            'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-l-md border-r border-input bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
            (disabled || value <= min) && 'pointer-events-none opacity-50'
          )}
        >
          <Minus className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 items-center">
          {prefix && (
            <span className="flex shrink-0 items-center pl-3 text-muted-foreground [&_svg]:size-4">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="numeric"
            value={showThousandsSeparator ? displayValue : value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            className={cn(
              'w-full min-w-0 border-0 bg-transparent py-1 text-base outline-none selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed md:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              prefix ? 'pl-2' : 'pl-3',
              suffix ? 'pr-2' : 'pr-3',
              prefix || suffix ? 'text-left' : 'text-center'
            )}
          />
          {suffix && (
            <span className="flex shrink-0 items-center pr-3 text-muted-foreground [&_svg]:size-4">
              {suffix}
            </span>
          )}
        </div>
        <span
          {...stepperProps('increment')}
          aria-disabled={disabled || value >= max}
          className={cn(
            'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-r-md border-l border-input bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
            (disabled || value >= max) && 'pointer-events-none opacity-50'
          )}
        >
          <Plus className="size-4" />
        </span>
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'
