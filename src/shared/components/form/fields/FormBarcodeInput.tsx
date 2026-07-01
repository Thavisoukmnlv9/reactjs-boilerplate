import { ScanLineIcon } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Field } from './Field'

export type BarcodeSymbology =
  | 'EAN13'
  | 'EAN8'
  | 'UPCA'
  | 'UPCE'
  | 'CODE128'
  | 'CODE39'
  | 'ITF'
  | 'QR'
  | 'PLU'
  | 'CUSTOM'

function ean13CheckDigit(d13: string): number {
  let sum = 0
  for (let i = 0; i < 13; i++) {
    const n = Number(d13[i])
    const pos = i + 1
    sum += pos % 2 === 1 ? n : n * 3
  }
  return (10 - (sum % 10)) % 10
}

function generateEan13Barcode(): string {
  const bytes = new Uint8Array(13)
  crypto.getRandomValues(bytes)
  let base = ''
  for (let i = 0; i < 13; i++) {
    base += String(bytes[i]! % 10)
  }
  return base + String(ean13CheckDigit(base))
}

function upcaCheckDigit(d11: string): number {
  let oddSum = 0
  let evenSum = 0
  for (let i = 0; i < 11; i++) {
    const n = Number(d11[i])
    if (i % 2 === 0) oddSum += n
    else evenSum += n
  }
  return (10 - ((oddSum * 3 + evenSum) % 10)) % 10
}

export function validateBarcode(
  value: string,
  symbology: BarcodeSymbology
): { valid: boolean; reason?: string } {
  const v = value.trim()
  if (v === '') return { valid: true } // empty is fine — symbology only fires when there is a value
  switch (symbology) {
    case 'EAN13': {
      if (!/^\d{13}$/.test(v))
        return { valid: false, reason: 'EAN-13 requires 13 digits.' }
      const expected = ean13CheckDigit(v.slice(0, 13))
      if (Number(v[12]) !== expected)
        return { valid: false, reason: 'Invalid EAN-13 check digit.' }
      return { valid: true }
    }
    case 'EAN8':
      if (!/^\d{8}$/.test(v))
        return { valid: false, reason: 'EAN-8 requires 8 digits.' }
      return { valid: true }
    case 'UPCA': {
      if (!/^\d{12}$/.test(v))
        return { valid: false, reason: 'UPC-A requires 12 digits.' }
      const expected = upcaCheckDigit(v.slice(0, 11))
      if (Number(v[11]) !== expected)
        return { valid: false, reason: 'Invalid UPC-A check digit.' }
      return { valid: true }
    }
    case 'UPCE':
      if (!/^\d{6,8}$/.test(v))
        return { valid: false, reason: 'UPC-E requires 6–8 digits.' }
      return { valid: true }
    case 'CODE128':
      if (v.length < 1 || v.length > 80)
        return { valid: false, reason: 'CODE128 must be 1–80 characters.' }
      return { valid: true }
    case 'CODE39':
      if (!/^[A-Z0-9\-. $/+%]+$/.test(v))
        return {
          valid: false,
          reason: 'CODE39 only accepts A–Z, 0–9 and -. $/+%.',
        }
      return { valid: true }
    case 'ITF':
      if (!/^\d+$/.test(v) || v.length % 2 !== 0)
        return { valid: false, reason: 'ITF requires an even count of digits.' }
      return { valid: true }
    case 'QR':
      if (v.length > 2953)
        return { valid: false, reason: 'QR payload too long.' }
      return { valid: true }
    case 'PLU':
      if (!/^\d{4,5}$/.test(v))
        return { valid: false, reason: 'PLU requires 4–5 digits.' }
      return { valid: true }
    case 'CUSTOM':
      return { valid: true }
  }
}

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'name' | 'id' | 'type'
> & {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  placeholder?: string
  requiredMark?: boolean
  /** Override default EAN-13 generation. */
  onGenerateBarcode?: () => string
  /** Restrict / validate the input to a symbology. Defaults to 'CUSTOM' (no check). */
  symbology?: BarcodeSymbology
  /** Show a camera-scan button. Wire `onScan` to open the host app's scanner. */
  onScanRequested?: () => void
}

export function FormBarcodeInput({
  name,
  label = 'Barcode',
  hint,
  icon,
  placeholder = 'Optional',
  requiredMark,
  className,
  onGenerateBarcode,
  symbology = 'CUSTOM',
  onScanRequested,
  disabled,
  ...rest
}: Props) {
  const { register, setValue, watch } = useFormContext()
  const value = watch(name) as string | undefined
  const [liveReason, setLiveReason] = useState<string | null>(null)

  const handleGenerate = () => {
    const next = onGenerateBarcode?.() ?? generateEan13Barcode()
    setValue(name, next, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
    setLiveReason(null)
  }

  const handleCopy = async () => {
    const text = typeof value === 'string' ? value.trim() : ''
    if (!text) {
      toast.warning('Nothing to copy', {
        description: 'Enter or generate a barcode first.',
      })
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Barcode copied')
    } catch {
      toast.error('Could not copy', {
        description: 'Clipboard access was denied.',
      })
    }
  }

  const handleBlur = () => {
    if (symbology === 'CUSTOM') return
    const text = typeof value === 'string' ? value : ''
    const result = validateBarcode(text, symbology)
    setLiveReason(result.valid ? null : (result.reason ?? null))
  }

  return (
    <Field
      name={name}
      label={label}
      hint={liveReason ?? hint}
      requiredMark={requiredMark}
    >
      <div className="flex min-w-0 flex-row items-center gap-2">
        <div className="relative min-w-0 flex-1">
          {icon ? (
            <span className="pointer-events-none absolute left-3 top-1/2 z-[1] flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {icon}
            </span>
          ) : null}
          <Input
            id={name}
            type="text"
            autoComplete="off"
            className={cn(
              'min-w-0 w-full',
              icon && 'pl-9',
              liveReason && 'border-destructive',
              className
            )}
            placeholder={placeholder}
            disabled={disabled}
            {...register(name, { onBlur: handleBlur })}
            {...rest}
          />
        </div>
        <div className="flex shrink-0 flex-row gap-2">
          {onScanRequested ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={disabled}
              onClick={onScanRequested}
              aria-label="Scan barcode"
              title="Scan barcode"
            >
              <ScanLineIcon className="size-4" />
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            disabled={disabled}
            onClick={handleGenerate}
          >
            Generate
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            disabled={disabled}
            onClick={() => void handleCopy()}
          >
            Copy
          </Button>
        </div>
      </div>
    </Field>
  )
}
