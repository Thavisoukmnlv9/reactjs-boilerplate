import * as React from 'react'
import {
  Link as RRLink,
  useLocation,
  useNavigate as rrUseNavigate,
  useSearchParams,
  type LinkProps as RRLinkProps,
} from 'react-router-dom'

/**
 * Minimal compatibility shim mapping the subset of `@tanstack/react-router`
 * that the vendored `src/shared` components use onto `react-router-dom`.
 * Aliased via tsconfig `paths` + vite `resolve.alias`, so the vendored files
 * import `@tanstack/react-router` unchanged.
 */

type SearchRecord = Record<string, unknown>
type SearchArg = SearchRecord | ((prev: SearchRecord) => SearchRecord)

interface NavigateOptions {
  to?: string
  params?: Record<string, unknown>
  search?: SearchArg
  replace?: boolean
  hash?: string
}

function buildPath(
  to: string,
  params?: Record<string, unknown>,
  search?: SearchArg,
  current?: SearchRecord,
): string {
  let path = to || '.'
  if (params) for (const [k, v] of Object.entries(params)) path = path.replace(`$${k}`, String(v))
  if (search) {
    const next = typeof search === 'function' ? search(current ?? {}) : search
    const entries = Object.entries(next)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, String(v)] as [string, string])
    const qs = new URLSearchParams(Object.fromEntries(entries)).toString()
    if (qs) path += (path.includes('?') ? '&' : '?') + qs
  }
  return path
}

export type LinkProps = Omit<RRLinkProps, 'to'> & {
  to?: string
  params?: Record<string, unknown>
  search?: SearchRecord
  activeProps?: unknown
  activeOptions?: unknown
  preload?: unknown
  from?: unknown
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to = '.', params, search, activeProps, activeOptions, preload, from, ...rest },
  ref,
) {
  void activeProps
  void activeOptions
  void preload
  void from
  return <RRLink ref={ref} to={buildPath(to, params, search)} {...rest} />
})

export function useNavigate() {
  const navigate = rrUseNavigate()
  const [params] = useSearchParams()
  return (opts: string | NavigateOptions) => {
    if (typeof opts === 'string') return navigate(opts)
    const current = Object.fromEntries(params.entries()) as SearchRecord
    const path = buildPath(opts.to ?? '.', opts.params, opts.search, current)
    navigate(opts.hash ? `${path}#${opts.hash}` : path, { replace: opts.replace })
  }
}

export function useSearch<T = SearchRecord>(_opts?: unknown): T {
  const [params] = useSearchParams()
  return Object.fromEntries(params.entries()) as T
}

type RouterState = { location: { pathname: string; search: string; href: string } }

export function useRouterState<T = RouterState>(opts?: { select?: (state: RouterState) => T }): T {
  const location = useLocation()
  const state: RouterState = {
    location: {
      pathname: location.pathname,
      search: location.search,
      href: location.pathname + location.search,
    },
  }
  return (opts?.select ? opts.select(state) : (state as unknown as T)) as T
}
