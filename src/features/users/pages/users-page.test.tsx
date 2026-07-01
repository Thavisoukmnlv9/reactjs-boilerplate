import { describe, expect, it } from 'vitest'

import { renderWithProviders, screen } from '@/test/utils'

import { UsersPage } from './users-page'

describe('UsersPage', () => {
  it('loads and renders users from the (mocked) API', async () => {
    renderWithProviders(<UsersPage />)

    expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
    expect(await screen.findByText('Alan Turing')).toBeInTheDocument()
    expect(await screen.findByText('Grace Hopper')).toBeInTheDocument()
  })
})
