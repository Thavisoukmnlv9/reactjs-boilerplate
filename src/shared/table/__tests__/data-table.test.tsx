import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

// i18n keys render as their key (no provider needed) so sr-only labels stay queryable.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: {} }),
}))

import {
  DataTable,
  createExpandableColumn,
  createFilterableColumn,
  createSelectableColumn,
  createSortableColumn,
} from '../data-table'

type Row = { name: string; city: string }

const rows: Row[] = [
  { name: 'Alice', city: 'Paris' },
  { name: 'Bob', city: 'Lyon' },
]

const nameCol = createSortableColumn<Row>('name', 'Name')

// ---------------------------------------------------------------------------
// Column factories — pure. These flags are the public contract a "collapse into
// one factory" refactor must preserve exactly.
// ---------------------------------------------------------------------------
describe('data-table column factories', () => {
  it('createSortableColumn -> sortable, not filterable', () => {
    expect(createSortableColumn<Row>('name', 'Name')).toMatchObject({
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      enableColumnFilter: false,
    })
  })

  it('createFilterableColumn -> filterable, not sortable', () => {
    expect(createFilterableColumn<Row>('name', 'Name')).toMatchObject({
      enableSorting: false,
      enableColumnFilter: true,
    })
  })

  it('createSelectableColumn -> sortable AND filterable (name is a misnomer; do not "fix" in a refactor)', () => {
    expect(createSelectableColumn<Row>('name', 'Name')).toMatchObject({
      enableSorting: true,
      enableColumnFilter: true,
    })
  })

  it('createExpandableColumn -> id "expand", default size 50, neither sortable nor filterable', () => {
    expect(createExpandableColumn<Row>()).toMatchObject({
      id: 'expand',
      size: 50,
      enableSorting: false,
      enableColumnFilter: false,
    })
  })
})

// ---------------------------------------------------------------------------
// Controlled-state sync effects. A "useControlledTableSync" extraction must keep
// exactly these firing semantics (mount-fire on filters/selection/sorting;
// pagination guarded so it does NOT fire on mount).
// ---------------------------------------------------------------------------
describe('data-table controlled-state effects', () => {
  it('renders rows and header on the desktop path', () => {
    render(<DataTable columns={[nameCol]} data={rows} enablePagination={false} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('fires filter + rowSelection change on mount with empty defaults; pagination does NOT fire', () => {
    const onColumnFiltersChange = vi.fn()
    const onRowSelectionChange = vi.fn()
    const onPaginationChange = vi.fn()
    render(
      <DataTable
        columns={[nameCol]}
        data={rows}
        enablePagination={false}
        onColumnFiltersChange={onColumnFiltersChange}
        onRowSelectionChange={onRowSelectionChange}
        onPaginationChange={onPaginationChange}
      />,
    )
    expect(onColumnFiltersChange).toHaveBeenCalledWith([])
    expect(onRowSelectionChange).toHaveBeenCalledWith({})
    expect(onPaginationChange).not.toHaveBeenCalled()
  })

  it('fires sorting change on mount (initial sort seeded from props)', () => {
    const onSortingChange = vi.fn()
    render(
      <DataTable
        columns={[nameCol]}
        data={rows}
        enablePagination={false}
        onSortingChange={onSortingChange}
      />,
    )
    expect(onSortingChange).toHaveBeenCalled()
  })

  it('clicking a sortable header toggles sorting (fires onSortingChange again)', async () => {
    const user = userEvent.setup()
    const onSortingChange = vi.fn()
    render(
      <DataTable
        columns={[nameCol]}
        data={rows}
        enablePagination={false}
        onSortingChange={onSortingChange}
      />,
    )
    onSortingChange.mockClear()
    await user.click(screen.getByRole('button', { name: 'Name' }))
    expect(onSortingChange).toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Latent bugs — CURRENT (buggy) behavior encoded here so a reviewer sees intent.
// The B1 bugfix commits flip these assertions and fix the code.
// ---------------------------------------------------------------------------
describe('data-table bug regression guards', () => {
  it('pageCount: an empty table renders no page navigation (pageCount = 0, not 10)', () => {
    render(<DataTable columns={[nameCol]} data={[]} totalCount={0} />)
    expect(screen.queryByText('dataTable.nextPage')).not.toBeInTheDocument()
  })

  it('keyboard: pressing Enter on a sort header toggles once (ascending, like a single click)', async () => {
    const user = userEvent.setup()
    const onSortingChange = vi.fn()
    render(
      <DataTable
        columns={[nameCol]}
        data={rows}
        enablePagination={false}
        onSortingChange={onSortingChange}
      />,
    )
    const header = screen.getByRole('button', { name: 'Name' })
    header.focus()
    onSortingChange.mockClear()
    await user.keyboard('{Enter}')
    const last = onSortingChange.mock.calls.at(-1)?.[0] as Array<{ id: string; desc: boolean }>
    expect(last?.[0]).toMatchObject({ id: 'name', desc: false })
  })
})
