import i18next from 'i18next'
import { Minus, Plus } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/core/utils/cn'

const LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
}

function resolveBcp47Locale(): string {
  const lang = i18next.resolvedLanguage ?? i18next.language ?? 'en'
  return LOCALE_MAP[lang] ?? lang
}

/**
 * Format an integer amount with the active locale's grouping separators.
 * Replaces the previous Indian-lakh formatter (`1,00,000`) which was wrong for
 * every locale we ship.
 */
export function formatCurrencyDigits(n: number, locale?: string): string {
  return new Intl.NumberFormat(locale ?? resolveBcp47Locale(), {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.floor(n)))
}

/** Parse a locale-formatted integer string back to a number. */
export function parseCurrencyDigits(s: string): number {
  const cleaned = s.replace(/[^0-9-]/g, '')
  const num = Number.parseInt(cleaned, 10)
  return Number.isNaN(num) ? 0 : num
}

export type CurrencyInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  id?: string
  'aria-invalid'?: boolean
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      value,
      onChange,
      min = 0,
      max = Number.MAX_SAFE_INTEGER,
      step = 1,
      disabled = false,
      className,
      id,
      'aria-invalid': ariaInvalid,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(() =>
      formatCurrencyDigits(value)
    )
    const isFocusedRef = React.useRef(false)

    React.useEffect(() => {
      if (!isFocusedRef.current) {
        setDisplayValue(formatCurrencyDigits(value))
      }
    }, [value])

    const handleDecrement = () => {
      const next = Math.max(min, value - step)
      if (next !== value) {
        onChange(next)
        setDisplayValue(formatCurrencyDigits(next))
      }
    }

    const handleIncrement = () => {
      const next = Math.min(max, value + step)
      if (next !== value) {
        onChange(next)
        setDisplayValue(formatCurrencyDigits(next))
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '')
      if (raw === '') {
        onChange(min)
        setDisplayValue('')
        return
      }
      const parsed = Number.parseInt(raw, 10)
      if (!Number.isNaN(parsed)) {
        const clamped = Math.min(max, Math.max(min, parsed))
        onChange(clamped)
        setDisplayValue(formatCurrencyDigits(clamped))
      }
    }

    const handleFocus = () => {
      isFocusedRef.current = true
    }

    const handleBlur = () => {
      isFocusedRef.current = false
      setDisplayValue(formatCurrencyDigits(value))
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
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="w-full min-w-0 border-0 bg-transparent px-3 py-1 text-center text-base outline-none selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed md:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
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

CurrencyInput.displayName = 'CurrencyInput'
