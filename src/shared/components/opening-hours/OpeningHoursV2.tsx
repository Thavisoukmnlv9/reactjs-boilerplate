import { Clock, Copy, Lock, Unlock } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/core/utils/cn'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { TimePicker } from './TimePicker'

export interface OpeningHoursDayValue {
  open: string
  close: string
  is_closed: boolean
}

export type OpeningHoursSchedule = Record<string, OpeningHoursDayValue>

/** Value accepted from form/API (open/close optional when closed) */
export type OpeningHoursScheduleInput = Record<
  string,
  Partial<OpeningHoursDayValue> & { is_closed?: boolean }
>

export interface OpeningHoursV2Props {
  /** Day keys to display (e.g. ["mon", "tue", "wed"]) */
  days: readonly string[]
  value?: OpeningHoursScheduleInput
  onChange?: (value: OpeningHoursSchedule) => void
  className?: string
  /** Optional; when not set, no header is shown (e.g. when used with FormOpeningHours label) */
  title?: string
  disabled?: boolean
  error?: string
  /** Default time when opening a closed day */
  defaultOpen?: string
  defaultClose?: string
  /** Show quick actions (Open all / Close all / Apply to open days) */
  showQuickActions?: boolean
}

const defaultDaySchedule = (
  open = '10:00',
  close = '21:00'
): OpeningHoursDayValue => ({
  open,
  close,
  is_closed: false,
})

function formatDayLabel(day: string): string {
  const d = day.slice(0, 3)
  return d.charAt(0).toUpperCase() + d.slice(1)
}

export const OpeningHoursV2 = React.forwardRef<
  HTMLDivElement,
  OpeningHoursV2Props
>(
  (
    {
      days,
      value = {},
      onChange,
      className,
      title,
      disabled = false,
      error,
      defaultOpen = '10:00',
      defaultClose = '21:00',
      showQuickActions = true,
    },
    ref
  ) => {
    const [quickOpen, setQuickOpen] = React.useState(defaultOpen)
    const [quickClose, setQuickClose] = React.useState(defaultClose)

    const schedule = React.useMemo(() => {
      const next: OpeningHoursSchedule = {}
      days.forEach((day) => {
        next[day] =
          value[day] != null
            ? {
                open: value[day].open ?? defaultOpen,
                close: value[day].close ?? defaultClose,
                is_closed: value[day].is_closed ?? false,
              }
            : defaultDaySchedule(defaultOpen, defaultClose)
      })
      return next
    }, [days, value, defaultOpen, defaultClose])

    const updateDay = React.useCallback(
      (day: string, patch: Partial<OpeningHoursDayValue>) => {
        if (!onChange) return
        const current =
          schedule[day] ?? defaultDaySchedule(defaultOpen, defaultClose)
        onChange({
          ...schedule,
          [day]: { ...current, ...patch },
        })
      },
      [onChange, schedule, defaultOpen, defaultClose]
    )

    const openAllDays = React.useCallback(() => {
      if (!onChange) return
      const next: OpeningHoursSchedule = {}
      days.forEach((day) => {
        next[day] = defaultDaySchedule(defaultOpen, defaultClose)
      })
      onChange(next)
    }, [onChange, days, defaultOpen, defaultClose])

    const closeAllDays = React.useCallback(() => {
      if (!onChange) return
      const next: OpeningHoursSchedule = {}
      days.forEach((day) => {
        next[day] = { open: defaultOpen, close: defaultClose, is_closed: true }
      })
      onChange(next)
    }, [onChange, days, defaultOpen, defaultClose])

    const applyToOpenDays = React.useCallback(() => {
      if (!onChange) return
      const openTime =
        quickOpen && /^\d{1,2}:\d{2}$/.test(quickOpen) ? quickOpen : defaultOpen
      const closeTime =
        quickClose && /^\d{1,2}:\d{2}$/.test(quickClose)
          ? quickClose
          : defaultClose
      const next: OpeningHoursSchedule = {}
      days.forEach((day) => {
        const current = schedule[day]
        if (current?.is_closed) {
          next[day] = { ...current }
        } else {
          next[day] = { open: openTime, close: closeTime, is_closed: false }
        }
      })
      onChange(next)
    }, [
      onChange,
      days,
      schedule,
      quickOpen,
      quickClose,
      defaultOpen,
      defaultClose,
    ])

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {title && (
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <Clock className="text-muted-foreground h-5 w-5" />
            <h3 className="font-semibold text-base">{title}</h3>
          </div>
        )}

        {showQuickActions && (
          <div className="flex flex-wrap items-center gap-3 border-b bg-muted/30  py-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openAllDays}
                disabled={disabled}
                className="gap-1.5"
              >
                <Unlock className="h-3.5 w-3.5" />
                Open all
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeAllDays}
                disabled={disabled}
                className="gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                Close all
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <TimePicker
                value={quickOpen}
                onChange={setQuickOpen}
                disabled={disabled}
                className="h-8 w-28"
                columnHeight={160}
              />
              <span className="text-muted-foreground text-sm">to</span>
              <TimePicker
                value={quickClose}
                onChange={setQuickClose}
                disabled={disabled}
                className="h-8 w-28"
                columnHeight={160}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyToOpenDays}
                disabled={disabled}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Apply to open days
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 py-5">
          {days.map((day) => {
            const daySchedule = schedule[day]
            const isClosed = daySchedule?.is_closed ?? true
            return (
              <div
                key={day}
                className={cn(
                  'flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3 transition-colors',
                  isClosed
                    ? 'border-border/60 bg-muted/20'
                    : 'border-border bg-background'
                )}
              >
                <span className="min-w-[3.25rem] text-sm font-semibold text-foreground">
                  {formatDayLabel(day)}
                </span>
                <Switch
                  checked={!isClosed}
                  onCheckedChange={(checked) =>
                    updateDay(day, {
                      is_closed: !checked,
                      ...(checked
                        ? { open: defaultOpen, close: defaultClose }
                        : {}),
                    })
                  }
                  disabled={disabled}
                  className="data-[state=checked]:bg-primary"
                />
                {!isClosed ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <TimePicker
                      value={daySchedule?.open ?? defaultOpen}
                      onChange={(v) => updateDay(day, { open: v })}
                      disabled={disabled}
                      className="h-9 w-28"
                    />
                    <span className="text-muted-foreground text-sm font-medium">
                      to
                    </span>
                    <TimePicker
                      value={daySchedule?.close ?? defaultClose}
                      onChange={(v) => updateDay(day, { close: v })}
                      disabled={disabled}
                      className="h-9 w-28"
                    />
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-xs font-medium">
                    Closed
                  </Badge>
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <p className="border-t px-5 py-2 text-destructive text-sm">{error}</p>
        )}
      </div>
    )
  }
)

OpeningHoursV2.displayName = 'OpeningHoursV2'
