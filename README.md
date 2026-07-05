# React Boilerplate

Production-grade, feature-based **React 19 + TypeScript + Vite** starter. Runs end-to-end with **zero backend** — the dev server serves MSW mocks.

## Stack

React 19 · Vite · React Router v7 · TanStack Query v5 · Zustand · Axios · shadcn/ui (Radix + Tailwind v4) · React Hook Form + Zod · react-i18next · Vitest + Testing Library + MSW · Playwright (e2e). ESLint · Prettier · Husky · Docker + nginx · GitHub Actions CI.

## Quick start

```bash
npm install
cp .env.example .env    # optional — sensible defaults are baked in
npm run dev             # http://localhost:3000
```

Runs against MSW mocks, so no backend is needed. Sign in with `admin@example.com` / `password`.

## Scripts

| Script | What |
|---|---|
| `npm run dev` | Dev server (with API mocks) |
| `npm run build` | Type-check + production build |
| `npm run test` | Unit/integration tests (Vitest + MSW) |
| `npm run e2e` | Playwright end-to-end tests |
| `npm run lint` / `format` | ESLint / Prettier |
| `npm run gen:feature` | Scaffold a new feature slice |

## Structure

Feature-sliced: each folder under `src/features/<name>/` is a self-contained vertical slice (api, components, hooks, pages, routes, schema, types) exposed through an `index.ts` barrel — import features only via that barrel. Current slices: `auth`, `users`, `branches`, `roles`, `policies`, `dashboard`, `onboarding` (`users` is the reference implementation). Cross-cutting code lives in `lib/`, `components/common`, and `config/` (Zod-validated env).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design, and [`PROMPT.md`](PROMPT.md) for the brief that generated this repo.

---

## Author

**Thavisouk MNLV** — thavisoukmnlv@gmail.com
GitHub: https://github.com/Thavisoukmnlv9

## License

Released under the [MIT License](./LICENSE-MIT). Free for anyone to use, copy, modify,
and distribute — including commercial and company use.

© 2026 Thavisouk MNLV
