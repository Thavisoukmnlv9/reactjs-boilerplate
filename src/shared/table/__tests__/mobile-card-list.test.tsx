import type { ColumnDef } from '@tanstack/react-table'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { MobileCardList } from '../mobile-card-list'

type Row = { name: string; city: string }

const data: Row[] = [
  { name: 'Alice', city: 'Paris' },
  { name: 'Bob', city: 'Lyon' },
]

// Value column WITH a cell fn -> exercises buildMobileCellContext().getValue().
const nameCol: ColumnDef<Row, unknown> = {
  id: 'name',
  accessorKey: 'name',
  header: 'Name',
  cell: ({ getValue }) => <span>cell:{String(getValue())}</span>,
}
// Value column WITHOUT a cell fn -> exercises the raw-value fallback branch.
const cityCol: ColumnDef<Row, unknown> = {
  id: 'city',
  accessorKey: 'city',
  header: 'City',
}
// Actions column -> exercises the actions branch + its cell fn.
const actionsCol: ColumnDef<Row, unknown> = {
  id: 'actions',
  header: '',
  cell: () => <button type="button">Act</button>,
}
const expandCol: ColumnDef<Row, unknown> = { id: 'expand' }
const selectCol: ColumnDef<Row, unknown> = { id: 'select' }

// ---------------------------------------------------------------------------
// These pin the cell-rendering contract the `renderMobileCell` extraction must
// preserve: cell functions receive the mobile cell context (getValue), each
// branch keeps its own fallback, select/expand columns are skipped as fields,
// and the actions cell hosts the expand toggle.
// ---------------------------------------------------------------------------
describe('MobileCardList — cell rendering + expand toggle', () => {
  const base = { isLoading: false, pageSize: 10, noDataMessage: 'none' } as const

  it('renders cell content through the cell context and shows column headers', () => {
    render(<MobileCardList columns={[nameCol, cityCol]} data={data} {...base} />)
    expect(screen.getByText('cell:Alice')).toBeInTheDocument()
    expect(screen.getByText('cell:Bob')).toBeInTheDocument()
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0)
  })

  it('renders the raw-value fallback when a column has no cell fn', () => {
    render(<MobileCardList columns={[cityCol]} data={data} {...base} />)
    expect(screen.getByText('Paris')).toBeInTheDocument()
    expect(screen.getByText('Lyon')).toBeInTheDocument()
  })

  it('renders the actions cell and skips the select column as a field', () => {
    render(<MobileCardList columns={[selectCol, nameCol, actionsCol]} data={[data[0]]} {...base} />)
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument()
    expect(screen.getByText('cell:Alice')).toBeInTheDocument()
  })

  it('shows an Expand toggle (when an expand column exists) that reveals expanded content', async () => {
    const user = userEvent.setup()
    render(
      <MobileCardList
        columns={[nameCol, actionsCol, expandCol]}
        data={[data[0]]}
        {...base}
        renderExpandedContent={(r) => <div>expanded:{(r.original as Row).name}</div>}
      />,
    )
    expect(screen.queryByText('expanded:Alice')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Expand/i }))
    expect(screen.getByText('expanded:Alice')).toBeInTheDocument()
  })

  it('renders skeletons while loading (no data shown)', () => {
    render(<MobileCardList columns={[nameCol]} data={data} {...base} isLoading pageSize={4} />)
    expect(screen.queryByText('cell:Alice')).not.toBeInTheDocument()
  })

  it('renders the empty message when there is no data', () => {
    render(<MobileCardList columns={[nameCol]} data={[]} {...base} noDataMessage="Nothing here" />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })
})
