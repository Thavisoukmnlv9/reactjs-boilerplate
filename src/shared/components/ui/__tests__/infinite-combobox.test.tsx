import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { InfiniteCombobox } from '../infinite-combobox'

// jsdom has no layout, so @tanstack/react-virtual measures the scroll element as
// 0-height and renders no rows. Mock the virtualizer to render EVERY row; the
// component's real selection + infinite-scroll effect logic is still exercised —
// only the virtualization math is stubbed. The effect deps are untouched.
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 42,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        key: index,
        start: index * 42,
        size: 42,
        end: (index + 1) * 42,
        lane: 0,
      })),
    scrollToIndex: () => {},
  }),
}))

type Item = { id: string; name: string }

const ALL: Item[] = Array.from({ length: 8 }, (_, i) => ({
  id: `id${i}`,
  name: `Item ${i}`,
}))

/** Paged, filterable query over an in-memory list — stands in for the API queryFn prop. */
function makeQueryFn(pageSize = 5) {
  return vi.fn(
    async ({ search, pageParam }: { search: string; pageParam: number }) => {
      const filtered = ALL.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      )
      const start = (pageParam - 1) * pageSize
      const items = filtered.slice(start, start + pageSize)
      const nextPage = start + pageSize < filtered.length ? pageParam + 1 : null
      return { items, nextPage }
    },
  )
}

function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

const baseProps = {
  queryKey: ['items'],
  getLabel: (i: Item) => i.name,
  getValue: (i: Item) => i.id,
  preloadQueryFn: async (id: string) => ALL.find((i) => i.id === id) ?? null,
}

describe('<InfiniteCombobox>', () => {
  it('shows the placeholder when there is no value', () => {
    renderWithClient(
      <InfiniteCombobox<Item>
        {...baseProps}
        queryFn={makeQueryFn()}
        value=""
        onValueChange={vi.fn()}
        placeholder="Pick one"
      />,
    )
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one')
  })

  it('opens and loads options', async () => {
    const user = userEvent.setup()
    renderWithClient(
      <InfiniteCombobox<Item>
        {...baseProps}
        queryFn={makeQueryFn()}
        value=""
        onValueChange={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('combobox'))
    expect(await screen.findByText('Item 0')).toBeInTheDocument()
  })

  it('selecting an option fires onValueChange + onSelectItem', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onSelectItem = vi.fn()
    renderWithClient(
      <InfiniteCombobox<Item>
        {...baseProps}
        queryFn={makeQueryFn()}
        value=""
        onValueChange={onValueChange}
        onSelectItem={onSelectItem}
      />,
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByText('Item 1'))
    expect(onValueChange).toHaveBeenCalledWith('id1')
    expect(onSelectItem).toHaveBeenCalledWith(ALL[1])
  })

  it('preloads and shows the selected label for a value not yet in the list', async () => {
    renderWithClient(
      <InfiniteCombobox<Item>
        {...baseProps}
        queryFn={makeQueryFn()}
        value="id3"
        onValueChange={vi.fn()}
      />,
    )
    // Trigger stays closed; the preload query resolves the label.
    expect(await screen.findByText('Item 3')).toBeInTheDocument()
  })

  it('clear button resets the value (onValueChange("") + onSelectItem(null))', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const onSelectItem = vi.fn()
    renderWithClient(
      <InfiniteCombobox<Item>
        {...baseProps}
        queryFn={makeQueryFn()}
        value="id2"
        clearable
        onValueChange={onValueChange}
        onSelectItem={onSelectItem}
      />,
    )
    await user.click(await screen.findByLabelText('Clear selection'))
    expect(onValueChange).toHaveBeenCalledWith('')
    expect(onSelectItem).toHaveBeenCalledWith(null)
  })
})
