# Architecture

This document is the design brief for the boilerplate: the principles, the stack rationale, and the
rules that keep a growing codebase coherent. If you're extending the platform, read this first.
The condensed, paste-into-an-agent version lives in [`../PROMPT.md`](../PROMPT.md).

## Principles

1. **Feature-first, not layer-first.** Code is organized by _what it does for the user_ (a feature
   slice), not by _what kind of file it is_. You should be able to delete a feature by deleting one
   folder.
2. **One home for every concern.** Cross-cutting infrastructure (HTTP, auth, i18n, monitoring) lives
   in `lib/`. Shared UI lives in `components/`. Nothing important is defined in two places.
3. **Typed boundaries.** Env, API responses, forms, and route params are all typed and validated
   (Zod at the edges). The compiler is the first test suite.
4. **Runnable in isolation.** The app boots and every flow works against MSW mocks with no backend,
   so the frontend is never blocked on API delivery.
5. **Conventional over clever.** Widely-adopted tools (React Router, shadcn/ui, ESLint/Prettier) so
   new contributors are productive on day one.

## Stack rationale

| Layer        | Choice                 | Why                                                                 |
| ------------ | ---------------------- | ------------------------------------------------------------------- |
| Build        | Vite                   | Fast HMR, first-class TS, simple config, great prod output.         |
| Routing      | React Router v7        | The conventional SPA router; data-router API with lazy route split. |
| Server state | TanStack Query         | Caching, dedupe, invalidation — don't reinvent it in Redux.         |
| Client state | Zustand                | Minimal global store for auth/UI; no boilerplate, no context hell.  |
| HTTP         | Axios                  | Interceptors give one clean place for auth + refresh + error shape. |
| UI           | shadcn/ui + Tailwind 4 | You own the components (copy-in), Radix gives accessibility.        |
| Forms        | RHF + Zod              | Performant, uncontrolled forms with one schema as source of truth.  |
| i18n         | react-i18next          | Namespaced translations that live next to features.                 |

## Layered structure

```
main.tsx → App.tsx → AppProviders → RouterProvider(router)
```

- **`app/`** — the composition root. `providers/` compose every cross-cutting provider once;
  `router/` builds the route tree and guards; `layouts/` are the page shells (root, auth, dashboard).
- **`config/`** — `env.ts` (Zod-validated `import.meta.env`), `app-config.ts` (derived static
  config), `constants.ts` (routes + permissions), `navigation.ts` (sidebar model).
- **`lib/`** — framework-agnostic infrastructure:
  - `api/` — the axios instance, request/response interceptors, the `ApiError` normalizer, and a
    typed `api.get/post/...` facade that returns response bodies.
  - `auth/` — token storage, the Zustand auth store, and `can()/hasRole()` permission helpers.
  - `i18n/` — i18next init + locale resources. `monitoring/` — Sentry init + a logging shim.
  - `utils/` — `cn()` (the shadcn class merger) and formatting helpers.
- **`components/`** — `ui/` are the shadcn primitives; `common/` are app-level building blocks
  (`DataTable`, `PageHeader`, `EmptyState`/`ErrorState`/`LoadingState`, `ConfirmDialog`,
  `ErrorBoundary`, `RoleGate`, theme/language switchers).
- **`hooks/`** — reusable hooks (`useAuth`, `usePermissions`, `useDebounce`, `useDisclosure`, …).
- **`features/`** — the vertical slices (below).

## The feature-slice contract

```
features/<name>/
├── api/          <name>-api.ts (axios calls) · queries.ts (Query hooks) · query-keys.ts
├── components/   feature-scoped components
├── hooks/        feature-scoped hooks
├── pages/        route page containers
├── routes.tsx    RouteObject[] (lazy)
├── schema.ts     Zod schemas       types.ts   feature types
└── index.ts      public API barrel
```

Rules:

- **Import across features only via the barrel** (`@/features/users`), never deep paths. This keeps
  a feature's internals free to change.
- **A feature owns its query keys** (`usersKeys`) so cache invalidation stays local and collision-free.
- **Pages are thin**; data lives in `api/queries.ts` hooks, presentation in `components/`.

`features/users` is the canonical reference: list + debounced search, create/edit via a dialog form,
delete with a confirm dialog, RBAC-gated row actions, and an MSW-backed integration test.

## Data & request lifecycle

1. A component calls a feature Query hook (`useUsers`).
2. The hook calls a typed API function (`listUsers`) → `api.get<User[]>('/users')`.
3. The axios **request interceptor** attaches the bearer token.
4. On `401`, the **response interceptor** refreshes the token once and retries; if refresh fails it
   clears the session and redirects to `/login?returnTo=…`.
5. Any error is normalized to `ApiError` (`{ message, status, code }`) so UI code has one shape.
6. Mutations invalidate the relevant query keys and surface a Sonner toast.

## Auth & RBAC

- **Token** is the source of truth (localStorage here; swap `lib/auth/token-storage.ts` for
  httpOnly cookies in production — it's the only file that touches storage).
- On load, `AuthProvider` re-fetches `/auth/me` (never persists the user snapshot) and hydrates the
  Zustand store.
- **Route protection:** `ProtectedRoute` gates the authenticated layout.
- **UI/permission gating:** `<RoleGate permission="users:write">` and the `usePermissions()` hook.

## Error handling

- **Render errors** → `ErrorBoundary` (app-level) + React Router `errorElement` (route-level).
- **Query/mutation errors** → component-level state first; server (5xx) and all mutation errors also
  raise a global toast via the Query `QueryCache`/`MutationCache`.
- **Not found** → a dedicated 404 route element.

## State boundaries

- **Server data** → TanStack Query (never mirror it into Zustand).
- **Global client state** (auth, theme) → Zustand + `next-themes`.
- **Local UI state** → component state / `useDisclosure`.

## i18n, styling, theming

- **5 languages** (en is the default, plus lo/th/vi/zh). Language definitions live in
  `config/languages.ts` (single source of truth). The active language is carried in the URL as
  `?lang=` (retained across navigation via `retainSearchParams`) and cached to localStorage; the
  precedence is URL > server prefs > localStorage > navigator > `en`.
- **One namespace per feature.** `common` lives in `lib/i18n/locales`; each feature owns its strings
  under `features/<f>/i18n/` (five locale files + an `index.ts` bundle descriptor). `lib/i18n` stays
  generic (a factory); the app layer composes every bundle in `app/i18n`. Add a feature via
  `npm run gen:feature`, then register its bundle in `app/i18n/index.ts` + `app/i18n/i18next.d.ts`.
- `t()` keys, namespaces, and `{{interpolation}}` are type-checked against the English source
  (`app/i18n/i18next.d.ts`). Reference across namespaces with `t('common:actions.cancel')`. Missing
  keys fall back to English; `npm run check:i18n` guards key/placeholder parity across all languages.
- Tailwind v4 with CSS-variable design tokens (`styles/globals.css`); light/dark via `.dark` class
  driven by `next-themes`, with an inline no-flash script in `index.html`.

## Testing strategy

- **Unit** — pure logic (`permissions`, `format`, hooks) with Vitest.
- **Integration** — render a page with `renderWithProviders`, let MSW serve the API, assert on the
  rendered result (see `features/users/pages/users-page.test.tsx`).
- **E2E** — Playwright drives the real build (sign-in → dashboard, auth redirect).
- The **same MSW handlers** power dev, unit tests, and e2e — one mock definition, three consumers.

## Performance

- Route-level code splitting via `RouteObject.lazy`.
- Manual vendor chunking (react / router / query / forms) in `vite.config.ts`.
- MSW is dynamically imported behind `import.meta.env.DEV`, so it is tree-shaken out of production.

## Security

- Strict env validation; only `VITE_`-prefixed values reach the client.
- nginx serves with `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Token refresh is single-flight; failed refresh hard-redirects to login.

## Opt-in add-ons (off by default)

- **Sentry** — set `VITE_ENABLE_SENTRY=true` + `VITE_SENTRY_DSN`; wired in `lib/monitoring/sentry.ts`.
- **PWA** — `vite-plugin-pwa` is installed; add it to `vite.config.ts` plugins to enable offline SW.
- **Storybook** — add when you want isolated component docs.

## Key decisions

- **SPA, not Next.js.** This is a client-rendered admin starter; React Router keeps it simple. Reach
  for a meta-framework only when you need SSR/SEO.
- **shadcn/ui over a component library.** You own the components, so they bend to your design system
  instead of fighting a vendor's theme.
- **Axios over fetch-wrapper.** One interceptor pipeline for auth/refresh/error is worth the dep.
- **MSW as a first-class citizen.** Frontend velocity shouldn't depend on backend readiness.

## Extending

1. `npm run gen:feature` → new slice from the template.
2. Build out `api/`, `schema.ts`, `pages/`, `components/`.
3. Register `routes.tsx` in `app/router/router.tsx`; add a `navigation.ts` entry if it needs a nav item.
4. Add MSW handlers for its endpoints; write a slice test.
