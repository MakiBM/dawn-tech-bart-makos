# Order Management Dashboard

A React-based order management dashboard with full CRUD operations, real-time metric computation, and layered error handling.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| State | Zustand v5 + persist middleware |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod v4 |
| Testing | Vitest + React Testing Library |
| UI | shadcn/ui (Radix primitives) |

## Quick Start

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm test      # run test suite
pnpm build     # production build
```

## Architecture

```
src/
  app/               # App shell, router, layouts
  features/
    dashboard/       # Metric cards derived from store
    orders/          # Table, CRUD form, delete dialog
  shared/
    components/ui/   # shadcn/ui primitives
    components/layout/ # Sidebar, PageHeader
    lib/             # Utilities (cn, format, countries)
  store/             # Zustand store + derived selectors
  services/          # Async service layer (simulated API)
  schemas/           # Zod validation schemas
  types/             # TypeScript type definitions
  dev/               # Dev-only error simulation toolbar
```

## Key Design Decisions

**Derived metrics via selectors** — Dashboard stats (total orders, revenue, unique countries) are computed from `orders[]` on read, never stored independently. Uses `useShallow` for render optimization. Impossible to desync with order data.

**Price in cents (integer)** — Avoids floating-point precision bugs in aggregation. Display formatted via `Intl.NumberFormat`.

**Zod schema as single validation source** — TypeScript types inferred from schema. React Hook Form uses zodResolver. No type/validation divergence possible.

**localStorage via Zustand persist** — Only `orders[]` persisted (not loading/error). `partialize` keeps ephemeral state ephemeral.

**Async service layer** — CRUD wrapped in promises with simulated delay. Makes swapping to a real API a single-file change. Exercises loading/error states realistically.

**Layered error boundaries** — App-level (catastrophic), route-level (page isolation), component-level (table errors don't block "New Order" button). Each layer has appropriate recovery UI.

**Dev error simulation** — Floating toolbar (DEV only) with toggles to force service failures and slow network. Reviewers can verify error UX without code changes.

## Testing

30 tests covering:
- Schema validation (valid/invalid inputs)
- Store CRUD operations and error handling
- Dashboard metric selectors (empty state, computation)
- Component rendering and interaction (OrderForm, OrderTable, ErrorBoundary)
- Integration: full CRUD cycle with dashboard sync and navigation
