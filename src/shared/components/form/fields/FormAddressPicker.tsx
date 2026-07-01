import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

export type AddressValue = {
  province?: string
  district?: string
  village?: string
}

export type AddressRegion = {
  province: string
  districts: { name: string; villages: string[] }[]
}

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  regions: AddressRegion[]
  provinceLabel?: string
  districtLabel?: string
  villageLabel?: string
}

export function FormAddressPicker({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  regions,
  provinceLabel = 'Province',
  districtLabel = 'District',
  villageLabel = 'Village',
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = (field.value as AddressValue) ?? {}
          const province = regions.find((r) => r.province === value.province)
          const district = province?.districts.find(
            (d) => d.name === value.district
          )

          const setPart = (next: AddressValue) => field.onChange(next)

          return (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div>
                <span className="mb-1 block text-muted-foreground text-xs">
                  {provinceLabel}
                </span>
                <Select
                  value={value.province ?? ''}
                  disabled={disabled}
                  onValueChange={(v) =>
                    setPart({
                      province: v,
                      district: undefined,
                      village: undefined,
                    })
                  }
                >
                  <SelectTrigger aria-invalid={Boolean(error)}>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.province} value={r.province}>
                        {r.province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="mb-1 block text-muted-foreground text-xs">
                  {districtLabel}
                </span>
                <Select
                  value={value.district ?? ''}
                  disabled={disabled || !province}
                  onValueChange={(v) =>
                    setPart({ ...value, district: v, village: undefined })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {province?.districts.map((d) => (
                      <SelectItem key={d.name} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="mb-1 block text-muted-foreground text-xs">
                  {villageLabel}
                </span>
                <Select
                  value={value.village ?? ''}
                  disabled={disabled || !district}
                  onValueChange={(v) => setPart({ ...value, village: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent>
                    {district?.villages.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )
        }}
      />
    </Field>
  )
}
