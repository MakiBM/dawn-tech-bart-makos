# Order Management Dashboard

A React-based order management dashboard with full CRUD operations, real-time metric computation, and layered error handling.

## Tech Stack

Framework: React 19 + TypeScript
Build: Vite 7
State: Zustand v5 + persist middleware
Routing: React Router v7
Styling: Tailwind CSS v4
Forms: React Hook Form + Zod v4
Testing: Vitest + React Testing Library
UI: shadcn/ui (Base UI primitives)

## Quick Start

```
pnpm install
pnpm dev       # http://localhost:5173
pnpm test      # run test suite
pnpm build     # production build
```

## Architecture

```
src/
  app/                          # App shell, router, layouts
  features/
    dashboard/
    orders/
  shared/
    components/ui/              # shadcn/ui primitives
    components/layout/
    lib/
  store/index.ts                # Composes slices, applies persist middleware, exports hooks
  services/                     # Async service layer (simulated API)
  types/api.ts                  # API contract types (simulates codegen output)
  dev/                          # Dev-only tooling
```

Three-layer architecture:

- API types (`types/api.ts`) - explicit request/response types with all fields spelled out, no utility type
  derivations. Simulates codegen output from OpenAPI/tRPC so the contract is obvious at a glance.

- Feature-owned slices — each feature owns its store slice (`StateCreator`) and colocated tests. The app-level
  `store/index.ts` composes slices and applies cross-cutting middleware (persist). Features never import each other's
  slices directly — they go through the composed store hook.

- Colocated selectors — derived state lives in the feature that consumes it (`dashboard/selectors.ts`), not in the
  store layer. Keeps the store focused on state + mutations.

## Key Design Decisions

- Derived metrics via colocated selectors
  Dashboard stats (total orders, revenue, unique countries) are computed from `orders[]` on read, never stored
  independently. Uses `useShallow` for render optimization. Impossible to desync with order data. Selector lives
  in `features/dashboard/` — the feature that owns the derived view, not in the store layer.

- Price in cents (integer)
  Avoids floating-point precision bugs in aggregation. Display formatted via `Intl.NumberFormat`.

- Zod schema as single validation source
  TypeScript types inferred from schema. React Hook Form uses zodResolver. No type/validation divergence possible.

- localStorage via Zustand persist
  Only `orders[]` persisted (not loading/error). `partialize` keeps ephemeral state ephemeral. Persist is applied
  at the store composition level (`store/index.ts`), not inside individual slices — slices stay middleware-agnostic.

- Async service layer
  CRUD wrapped in promises with simulated delay. Makes swapping to a real API a single-file change.
  Exercises loading/error states realistically.

- Optimistic UI with rollback
  Create and update apply changes to the store immediately (before the service responds), so the UI feels instant.
  On failure, the store rolls back to a snapshot taken before the optimistic write. Delete is pessimistic — the row
  stays visible with a pending spinner until the service confirms — because restoring a deleted item mid-animation
  would feel jarring. `pendingIds` guards against concurrent mutations on the same order.

- Layered error boundaries
  App-level (catastrophic), route-level (page isolation), component-level (table errors don't block "New Order" button).
  Each layer has appropriate recovery UI.

## Production considerations

- React Router vs Next.js - This is a pure client-side SPA so React Router migth be better solution. Picked router
  for simplicity. Next.js woul dbe good option for more batteries included, Tanstack Start worth checking too
  (however I have no experience with it yet)

- Zustand vs Redux Toolkit - I would probably like to have some discussion about team preferences. Zustand is agile,
  Redux is more powerful and has more mature ecosystem. However Redux FEELS out of date to me and I noticed similar
  pattern in Vue ecosystem that they moved on from Vuex to Pinia. I locked in Zustand for this demo as a personal
  preference but I'm not married to it.

- Zustand vs ZeroSync - ZeroSync shines in local first movement. Reminds me good times with Meteor.js. If ZeroSync is
  integrated then a lot of state sync frontend-to-backend is abstracted away into nice reactive queries. App feels instant
  (like Linear), gets real time updates from backend and handle caching without extra work. It was definietely too much
  for this scope but it is a great choice for many types of apps.

## Testing

Floating toolbar (DEV only) with toggles to force service failures and slow network. Reviewers can verify error UX
without code changes.

Tests are colocated with the code they exercise — slice tests live in `features/orders/store/__tests__/`,
selector tests in `features/dashboard/__tests__/`, component tests in their feature's `__tests__/`.

Tests covering:

- Schema validation (valid/invalid inputs)
- Store slice CRUD operations and error handling
- Dashboard metric selectors (empty state, computation)
- Component rendering and interaction (OrderForm, OrderTable, ErrorBoundary)
- Integration: full CRUD cycle with dashboard sync and navigation

## Shortcuts taken

- config files copy pasted from other project
- dev/ utils copy pasted from other project
- AI
  - ui design (source file in .materials/)
  - copilot inline hints,
  - copilot chat for larger boilerplate
  - tests
