# React Boilerplate

A production-grade, modular, **feature-based** React + TypeScript starter. Opinionated where it
saves you time, conventional everywhere else, and runnable end-to-end with **zero backend** thanks
to built-in API mocking.

> Designed as a reusable platform: every feature is a self-contained vertical slice, cross-cutting
> concerns live in one place, and a generator stamps new features from a template.

## Stack

| Concern      | Choice                                                   |
| ------------ | -------------------------------------------------------- |
| Core         | React 19 · TypeScript · Vite (SPA)                       |
| Routing      | React Router v7 (data router, lazy routes)               |
| Server state | TanStack Query v5                                        |
| Client state | Zustand                                                  |
| HTTP         | Axios (interceptors: auth attach, 401 refresh-and-retry) |
| UI           | shadcn/ui (Radix + Tailwind CSS v4) · Lucide · Sonner    |
| Forms        | React Hook Form + Zod                                    |
| i18n         | react-i18next (namespaced per feature)                   |
| Quality      | ESLint + Prettier · Husky · lint-staged · Commitlint     |
| Testing      | Vitest + Testing Library + MSW · Playwright (e2e)        |
| Ops          | Multi-stage Docker + nginx · GitHub Actions CI           |
| Optional     | Sentry · PWA (env/flag-gated, off by default)            |

## Quick start

```bash
npm install
cp .env.example .env   # optional — sensible defaults are baked in
npm run dev            # http://localhost:3000
```

The dev server runs against **MSW mocks** (see `src/test/msw`), so it works with no backend.
Sign in with the pre-filled demo credentials (`admin@example.com` / `password`).

## Scripts

| Script                  | What it does                                |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Vite dev server (with API mocks)            |
| `npm run build`         | Type-check (`tsc -b`) then production build |
| `npm run preview`       | Serve the production build locally          |
| `npm run typecheck`     | Type-check without emitting                 |
| `npm run lint`          | ESLint                                      |
| `npm run format`        | Prettier write                              |
| `npm run test`          | Unit/integration tests (Vitest + MSW)       |
| `npm run test:coverage` | Coverage report                             |
| `npm run e2e`           | Playwright end-to-end tests                 |
| `npm run gen:feature`   | Scaffold a new feature slice                |

## Project structure

```
src/
├── app/            # composition root: providers, router, layouts
├── config/         # env (Zod-validated), app-config, constants, navigation
├── lib/            # cross-cutting infra: api, auth, i18n, monitoring, utils
├── components/     # ui/ (shadcn) + common/ (DataTable, states, guards…)
├── hooks/          # shared hooks (useAuth, usePermissions, useDebounce…)
├── features/       # ← vertical slices (auth, users, dashboard)
├── types/ styles/ test/
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design rationale, and
[`PROMPT.md`](PROMPT.md) for the senior-architect brief that generated this repo (paste it into
Claude Code to extend the platform the same way).

## The feature-slice contract

Every folder under `src/features/<name>/` follows the same anatomy, so features are portable and
predictable:

```
api/          axios calls + TanStack Query hooks (queries.ts) + query-keys.ts
components/    feature-scoped components
hooks/         feature-scoped hooks
pages/         route page containers
routes.tsx     React Router route objects (lazy-loaded)
schema.ts      Zod schemas    types.ts   feature types
index.ts       barrel = the feature's PUBLIC API (import from here elsewhere)
```

`features/users` is the fully built reference (list + search + create/edit/delete, RBAC-gated,
tested). Copy it, or generate a fresh slice:

## Adding a feature

```bash
npm run gen:feature      # prompts for a kebab-case name, e.g. "orders"
```

Then register its routes in [`src/app/router/router.tsx`](src/app/router/router.tsx):

```tsx
import { ordersRoutes } from '@/features/orders'
// …add ...ordersRoutes to the DashboardLayout children
```

## Environment

All env vars are **validated at boot** by [`src/config/env.ts`](src/config/env.ts) (Zod) — the app
fails fast with a clear message if something is missing or malformed. Only `VITE_`-prefixed vars are
exposed to the client. See [`.env.example`](.env.example).

## Testing

- **Unit/integration** — Vitest + Testing Library, with the network mocked by MSW (`src/test`).
  `renderWithProviders` (in `src/test/utils.tsx`) wraps components in Query/Router/i18n providers.
- **E2E** — Playwright drives the real app (with mocks). `npm run e2e` auto-starts the dev server.
  First run: `npx playwright install chromium`.

## Deployment

Multi-stage Docker image (build → nginx with SPA fallback + security headers):

```bash
docker build -f docker/Dockerfile --build-arg VITE_API_BASE_URL=https://api.example.com/v1 -t react-boilerplate .
docker run -p 8080:80 react-boilerplate
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs lint → typecheck → test → build,
plus a Playwright e2e job, on every push and PR.

## Conventions

- Path alias `@/*` → `src/*`.
- Import a feature only through its `index.ts` barrel; never reach into another feature's internals.
- Cross-cutting code lives in `lib/` and `components/common`; feature-specific code stays in the slice.
- Conventional Commits enforced by Commitlint (`feat:`, `fix:`, `chore:` …).
