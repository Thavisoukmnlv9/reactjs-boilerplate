import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OpeningHoursFormField } from '../OpeningHoursFormField'

const ALL_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

describe('<OpeningHoursFormField>', () => {
  it('summary shows a badge per day (time when open, Closed when empty)', () => {
    render(
      <OpeningHoursFormField value={{ monday: '09:00-18:00' }} onChange={vi.fn()} />,
    )
    expect(screen.getByText('Mon: 09:00-18:00')).toBeInTheDocument()
    expect(screen.getByText('Tue: Closed')).toBeInTheDocument()
  })

  it('closing a day clears its hours (onChange sets it to "")', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OpeningHoursFormField value={{ monday: '09:00-18:00' }} onChange={onChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Show Details' }))
    await user.click(screen.getAllByRole('switch')[0]) // monday
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ monday: '' }))
  })

  // Key finding: reopening does NOT restore prior hours — it fills the default. So
  // `closedDays` is derivable from `value` (a day is closed iff its value is empty).
  it('reopening a closed day fills the DEFAULT 09:00-18:00 (prior hours are not restored)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OpeningHoursFormField value={{ monday: '' }} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Show Details' }))
    await user.click(screen.getAllByRole('switch')[0]) // monday (currently closed)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ monday: '09:00-18:00' }),
    )
  })

  it('"Open All" sets every day to 09:00-18:00', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OpeningHoursFormField value={{}} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Show Details' }))
    await user.click(screen.getByRole('button', { name: 'Open All' }))
    const arg = onChange.mock.calls.at(-1)?.[0] as Record<string, string>
    for (const d of ALL_DAYS) expect(arg[d]).toBe('09:00-18:00')
  })

  it('"Close All" sets every day to ""', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <OpeningHoursFormField value={{ monday: '09:00-18:00' }} onChange={onChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Show Details' }))
    await user.click(screen.getByRole('button', { name: 'Close All' }))
    const arg = onChange.mock.calls.at(-1)?.[0] as Record<string, string>
    for (const d of ALL_DAYS) expect(arg[d]).toBe('')
  })
})
