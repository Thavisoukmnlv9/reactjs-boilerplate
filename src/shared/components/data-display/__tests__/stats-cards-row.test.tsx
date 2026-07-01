import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatsCardsRow } from '../stats-cards-row'

describe('<StatsCardsRow>', () => {
  it('renders each item with its label and value', () => {
    render(
      <StatsCardsRow
        items={[
          { id: 'total', label: 'Total', value: 42 },
          { id: 'active', label: 'Active', value: 30, tone: 'success' },
        ]}
      />
    )
    expect(screen.getByText('Total')).not.toBeNull()
    expect(screen.getByText('42')).not.toBeNull()
    expect(screen.getByText('Active')).not.toBeNull()
    expect(screen.getByText('30')).not.toBeNull()
  })

  it('shows skeleton placeholders while loading', () => {
    const { container } = render(
      <StatsCardsRow
        isLoading
        items={[{ id: 'total', label: 'Total', value: 42 }]}
      />
    )
    // The actual value should not be rendered during load.
    expect(screen.queryByText('42')).toBeNull()
    expect(container.querySelector('[data-stat-id="total"]')).not.toBeNull()
  })

  it('renders a dash for null/undefined/empty values', () => {
    render(
      <StatsCardsRow
        items={[
          { id: 'a', label: 'A', value: null },
          { id: 'b', label: 'B', value: undefined },
          { id: 'c', label: 'C', value: '' },
        ]}
      />
    )
    expect(screen.getAllByText('—').length).toBe(3)
  })

  it('attaches data-stat-id for testing/instrumentation', () => {
    const { container } = render(
      <StatsCardsRow
        items={[{ id: 'open-pos', label: 'Open POs', value: 7 }]}
      />
    )
    expect(container.querySelector('[data-stat-id="open-pos"]')).not.toBeNull()
  })
})
