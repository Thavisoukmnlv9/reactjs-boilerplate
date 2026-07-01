import { useEffect, useState } from 'react'
import { Input } from '@/shared/components/ui/input'

interface Props {
  valueBps: number
  onChangeBps: (bps: number) => void
  /** Maximum percent allowed (default 100%). */
  maxPercent?: number
  disabled?: boolean
  id?: string
  className?: string
}

/**
 * Friendly percent input that stores its value as basis points (1 bps =
 * 0.01%; 1000 bps = 10%). Owners type "10.00" and we save 1000; they don't
 * need to know the underlying representation.
 *
 * Pair with {@link PercentInputHint} or render a sample-receipt line below
 * for the clearest UX.
 */
export function PercentInput({
  valueBps,
  onChangeBps,
  maxPercent = 100,
  disabled,
  id,
  className,
}: Props) {
  const [display, setDisplay] = useState(() => bpsToDisplay(valueBps))

  // Reformat when the canonical value changes from the outside (e.g. form
  // reset / load) — but skip while the user is in the middle of typing
  // by letting the local string stay until blur.
  useEffect(() => {
    setDisplay(bpsToDisplay(valueBps))
  }, [valueBps])

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        value={display}
        disabled={disabled}
        className={className ?? 'pr-8'}
        onChange={(e) => {
          const next = e.target.value
          setDisplay(next)
          const n = Number.parseFloat(next)
          if (Number.isFinite(n) && n >= 0 && n <= maxPercent) {
            onChangeBps(Math.round(n * 100))
          }
        }}
        onBlur={() => setDisplay(bpsToDisplay(valueBps))}
      />
      <span
        className="absolute inset-y-0 right-3 grid place-items-center text-sm text-muted-foreground"
        aria-hidden
      >
        %
      </span>
    </div>
  )
}

function bpsToDisplay(bps: number): string {
  return (Math.max(0, bps) / 100).toFixed(2)
}
