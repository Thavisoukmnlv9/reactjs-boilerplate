import { Clock } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/core/utils/cn'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { formatTimeInput, validateTimeFormat } from './opening-hours-utils'

export interface OpeningHoursData {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface OpeningHoursFormFieldProps {
  value?: OpeningHoursData
  onChange?: (value: OpeningHoursData) => void
  className?: string
  showTitle?: boolean
  title?: string
  disabled?: boolean
  error?: string
}

const DAYS_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

const DAY_SHORT_LABELS = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
} as const

export const OpeningHoursFormField = React.forwardRef<
  HTMLDivElement,
  OpeningHoursFormFieldProps
>(
  (
    {
      value = {},
      onChange,
      className,
      showTitle = true,
      title = 'Opening Hours',
      disabled = false,
      error,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [closedDays, setClosedDays] = React.useState<
      Set<keyof OpeningHoursData>
    >(new Set())
    const [quickSetValue, setQuickSetValue] = React.useState('09:00-18:00')

    // Initialize closed days based on current value
    React.useEffect(() => {
      const closed = new Set<keyof OpeningHoursData>()
      const safeValue = value || {}
      DAYS_ORDER.forEach((day) => {
        if (!safeValue[day] || safeValue[day]?.trim() === '') {
          closed.add(day)
        }
      })
      setClosedDays(closed)
    }, [value])

    const handleTimeChange = (
      day: keyof OpeningHoursData,
      timeValue: string
    ) => {
      if (!onChange) return

      const formatted = formatTimeInput(timeValue)
      const safeValue = value || {}
      const newValue = { ...safeValue, [day]: formatted }
      onChange(newValue)

      // Update closed days
      if (formatted.trim() === '') {
        setClosedDays((prev) => new Set([...prev, day]))
      } else {
        setClosedDays((prev) => {
          const newSet = new Set(prev)
          newSet.delete(day)
          return newSet
        })
      }
    }

    const toggleDayClosed = (day: keyof OpeningHoursData) => {
      if (!onChange) return

      const isCurrentlyClosed = closedDays.has(day)
      const newClosedDays = new Set(closedDays)
      const safeValue = value || {}

      if (isCurrentlyClosed) {
        // Open the day with default hours
        newClosedDays.delete(day)
        const newValue = { ...safeValue, [day]: '09:00-18:00' }
        onChange(newValue)
      } else {
        // Close the day
        newClosedDays.add(day)
        const newValue = { ...safeValue, [day]: '' }
        onChange(newValue)
      }

      setClosedDays(newClosedDays)
    }

    const setAllDaysSame = (timeValue: string) => {
      if (!onChange) return

      const formatted = formatTimeInput(timeValue)
      const newValue: OpeningHoursData = {}
      DAYS_ORDER.forEach((day) => {
        if (!closedDays.has(day)) {
          newValue[day] = formatted
        }
      })
      onChange(newValue)
    }

    const openAllDays = () => {
      if (!onChange) return

      const newValue: OpeningHoursData = {}
      DAYS_ORDER.forEach((day) => {
        newValue[day] = '09:00-18:00'
      })
      onChange(newValue)
      setClosedDays(new Set())
    }

    const closeAllDays = () => {
      if (!onChange) return

      const newValue: OpeningHoursData = {}
      DAYS_ORDER.forEach((day) => {
        newValue[day] = ''
      })
      onChange(newValue)
      setClosedDays(new Set(DAYS_ORDER))
    }

    const hasError = (day: keyof OpeningHoursData) => {
      const safeValue = value || {}
      const timeValue = safeValue[day] || ''
      return timeValue && !validateTimeFormat(timeValue)
    }

    return (
      <Card ref={ref} className={cn('w-full', className)} {...props}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              disabled={disabled}
            >
              {isOpen ? 'Hide Details' : 'Show Details'}
            </Button>
            {isOpen && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openAllDays}
                  disabled={disabled}
                >
                  Open All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeAllDays}
                  disabled={disabled}
                >
                  Close All
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        {isOpen && (
          <CardContent className="space-y-4">
            {/* Quick Actions */}
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
              <Label className="font-medium text-sm">Quick Set:</Label>
              <Input
                placeholder="09:00-18:00"
                className="w-32"
                value={quickSetValue}
                onChange={(e) => setQuickSetValue(e.target.value)}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAllDaysSame(quickSetValue)}
                disabled={disabled}
              >
                Apply to Open Days
              </Button>
            </div>

            {/* Day Inputs */}
            <div className="space-y-3">
              {DAYS_ORDER.map((day) => {
                const isClosed = closedDays.has(day)
                const timeValue = value[day] || ''
                const hasTimeError = hasError(day)

                return (
                  <div
                    key={day}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex min-w-[100px] items-center gap-2">
                      <Switch
                        checked={!isClosed}
                        onCheckedChange={() => toggleDayClosed(day)}
                        disabled={disabled}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label className="font-medium text-sm">
                        {DAY_SHORT_LABELS[day]}
                      </Label>
                    </div>

                    <div className="flex-1">
                      {isClosed ? (
                        <Badge variant="secondary" className="text-xs">
                          Closed
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="09:00-18:00"
                            value={timeValue}
                            onChange={(e) =>
                              handleTimeChange(day, e.target.value)
                            }
                            disabled={disabled || isClosed}
                            className={cn(
                              'w-40',
                              hasTimeError &&
                                'border-destructive focus-visible:ring-destructive'
                            )}
                          />
                          {hasTimeError && (
                            <span className="text-destructive text-xs">
                              Invalid format
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </CardContent>
        )}

        {/* Summary View */}
        {!isOpen && (
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {DAYS_ORDER.map((day) => {
                const safeValue = value || {}
                const timeValue = safeValue[day]
                const isClosed = !timeValue || timeValue.trim() === ''

                return (
                  <Badge
                    key={day}
                    variant={isClosed ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {DAY_SHORT_LABELS[day]}: {isClosed ? 'Closed' : timeValue}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>
    )
  }
)

OpeningHoursFormField.displayName = 'OpeningHoursFormField'
