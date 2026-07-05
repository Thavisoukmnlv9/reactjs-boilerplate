import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

// RowActions calls useNavigate() at the top of the component; mock it so we can
// assert the navigate payload without a router. useIsMobile relies on the
// matchMedia stub in test/setup.ts (matches: false -> desktop -> inline path).
const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigateMock }))

import { RowActions } from '../row-actions'

// ---------------------------------------------------------------------------
// The action->handler mapping is the contract the `resolveActionHandler`
// extraction must preserve exactly: an `onClick` action runs its own handler;
// a `to` action navigates with to/params/search. Both inline and dropdown
// branches build the handler the same way.
// ---------------------------------------------------------------------------
describe('RowActions — action handler mapping', () => {
  it('inline: an onClick action fires its handler and does not navigate', async () => {
    const user = userEvent.setup()
    navigateMock.mockClear()
    const onClick = vi.fn()
    render(<RowActions actions={[{ label: 'Edit', onClick }]} />)
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('inline: a "to" action navigates with to/params/search and does not throw', async () => {
    const user = userEvent.setup()
    navigateMock.mockClear()
    render(
      <RowActions
        actions={[
          { label: 'View', to: '/things/$id', params: { id: '1' }, search: { q: 'x' } },
        ]}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'View' }))
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/things/$id',
      params: { id: '1' },
      search: { q: 'x' },
    })
  })

  it('inline branch renders one button per action when count <= maxInline', () => {
    render(
      <RowActions
        actions={[
          { label: 'Edit', onClick: vi.fn() },
          { label: 'Delete', onClick: vi.fn() },
        ]}
      />,
    )
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('collapses into a dropdown when actions exceed maxInline (labels hidden until opened)', () => {
    render(
      <RowActions
        maxInline={2}
        actions={[
          { label: 'A1', onClick: vi.fn() },
          { label: 'A2', onClick: vi.fn() },
          { label: 'A3', onClick: vi.fn() },
        ]}
      />,
    )
    // Dropdown branch: individual action buttons are not rendered inline...
    expect(screen.queryByRole('button', { name: 'A1' })).not.toBeInTheDocument()
    // ...only the single dropdown trigger remains.
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })
})
