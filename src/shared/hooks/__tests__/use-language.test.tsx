import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  retainSearchParams,
  RouterProvider,
} from '@tanstack/react-router'
import { act, render, waitFor } from '@testing-library/react'
import { z } from 'zod'
import { beforeEach, describe, expect, it } from 'vitest'

import i18n from '@/app/i18n'
import { LANGUAGE_CODES } from '@/config/languages'
import { useLanguage } from '@/shared/hooks/use-language'

// Capture the hook's return value so the test can drive it imperatively.
let api: ReturnType<typeof useLanguage> | null = null

function Probe() {
  api = useLanguage()
  return <div data-testid="active">{api.active}</div>
}

/** A minimal TanStack router that mirrors the app's root `?lang=` wiring. */
function makeRouter(initialEntry = '/') {
  const rootRoute = createRootRoute({
    validateSearch: z.object({ lang: z.enum(LANGUAGE_CODES).optional().catch(undefined) }),
    search: { middlewares: [retainSearchParams(['lang'])] },
    component: Outlet,
  })
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Probe })
  return createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  })
}

describe('useLanguage', () => {
  beforeEach(async () => {
    api = null
    await i18n.changeLanguage('en')
  })

  it('writes ?lang= to the URL, updates i18next, and syncs <html lang>', async () => {
    const router = makeRouter()
    render(<RouterProvider router={router} />)
    await waitFor(() => expect(api).not.toBeNull())

    await act(async () => {
      api!.setLanguage('lo')
    })

    await waitFor(() => expect(i18n.language).toBe('lo'))
    expect(router.state.location.search).toMatchObject({ lang: 'lo' })
    expect(document.documentElement.lang).toBe('lo')
  })

  it('reads the active language from the URL on deep-link', async () => {
    const router = makeRouter('/?lang=th')
    render(<RouterProvider router={router} />)
    await waitFor(() => expect(api?.active).toBe('th'))
  })
})
