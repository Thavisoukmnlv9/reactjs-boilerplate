# Senior-Architect Prompt — React Production Boilerplate

Paste this into Claude Code (or any capable coding agent) to **scaffold this platform from scratch**
or to **extend it consistently**. It encodes the same decisions the current repo already implements,
so the agent produces code that matches what's here.

---

## Role

> You are a senior frontend architect. Design and scaffold a **large, production-grade, modular,
> feature-based** React + TypeScript application. Optimize for long-term maintainability, clear
> boundaries, and day-one contributor productivity. Make decisive choices; don't enumerate options.

## Non-negotiable stack

- **React 19 + TypeScript + Vite** (SPA — not Next.js).
- **React Router v7** data router with **lazy** route objects.
- **TanStack Query v5** for server state; **Zustand** for global client state.
- **Axios** with interceptors (attach bearer token; on 401 refresh-once-and-retry; normalize errors).
- **shadcn/ui** (Radix + **Tailwind CSS v4**), Lucide icons, **Sonner** toasts, `next-themes`.
- **React Hook Form + Zod** (Zod also validates env).
- **react-i18next**, namespaced per feature.
- **ESLint + Prettier + Husky + lint-staged + Commitlint**.
- **Vitest + Testing Library + MSW** (unit/integration); **Playwright** (e2e).
- **Docker (multi-stage → nginx) + GitHub Actions CI**. Sentry/PWA/Storybook are opt-in.

## Architecture rules

- Organize by **feature slice**, not by file type. A feature is deletable as one folder.
- Cross-cutting infra → `src/lib/` (`api`, `auth`, `i18n`, `monitoring`, `utils`). Shared UI →
  `src/components/{ui,common}`. App composition → `src/app/{providers,router,layouts}`. Typed config
  → `src/config/`.
- Import a feature only through its `index.ts` barrel; never reach into its internals.
- Server data lives in TanStack Query only; never mirror it into Zustand.
- Every feature owns its query keys for local, collision-free cache invalidation.

## Folder layout to produce

```
src/
  app/{providers,router,layouts}
  config/{env,app-config,constants,navigation}
  lib/{api,auth,i18n,monitoring,utils}
  components/{ui,common}
  hooks/
  features/<name>/{api,components,hooks,pages,routes.tsx,schema.ts,types.ts,index.ts}
  types/ styles/ test/{msw,setup.ts,utils.tsx}
```

## Feature-slice contract (apply to EVERY feature)

```
api/<name>-api.ts   typed axios calls
api/queries.ts      TanStack Query hooks
api/query-keys.ts   hierarchical keys
components/          feature UI          pages/   route containers
routes.tsx          RouteObject[] (lazy) schema.ts Zod    types.ts
index.ts            public API barrel
```

## Production checklist (implement all)

- [ ] Zod-validated env that fails fast; only `VITE_` vars exposed.
- [ ] Axios auth + single-flight refresh + `ApiError` normalization.
- [ ] JWT auth: token storage abstraction, `AuthProvider` hydration from `/auth/me`,
      `ProtectedRoute`, `RoleGate`, `usePermissions`, `can()/hasRole()`.
- [ ] `ErrorBoundary` + router `errorElement` + 404; global toast on 5xx/mutation errors.
- [ ] Loading/empty/error UI states; a generic `DataTable`.
- [ ] Light/dark theming via CSS variables + `next-themes` (no FOUC).
- [ ] i18n with a language switcher; namespaced resources.
- [ ] Route-level code splitting + manual vendor chunks.
- [ ] MSW handlers powering **dev, unit tests, and e2e** from one definition.
- [ ] A fully built reference feature (a CRUD resource) + its tests.
- [ ] A **plop** generator (`gen:feature`) that stamps a new slice.
- [ ] ESLint/Prettier/Husky/lint-staged/Commitlint; GitHub Actions (lint→typecheck→test→build + e2e).
- [ ] Multi-stage Dockerfile + nginx (SPA fallback + security headers).
- [ ] `README.md` + `docs/ARCHITECTURE.md`.

## Conventions

- Path alias `@/*` → `src/*`. Barrels for public APIs. Conventional Commits.
- Pages thin; logic in hooks; presentation in components.
- Prefer composition and small files over large ones.

## Acceptance criteria (must all pass)

- `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` are all green.
- `npm run dev` boots and, with mocks on, you can sign in and complete a full CRUD round-trip on the
  reference feature with no backend.
- `npm run e2e` passes a sign-in → dashboard flow and an auth-redirect check.
- Adding a feature is: `gen:feature` → fill in the slice → register its routes. Nothing else.

## How to work

Scan any existing code first and match its conventions. Build the foundation (config → lib → app
wiring → shared components) before features. After each layer, keep the type-checker green. Deliver
the reference feature last and prove the whole thing runs.
