# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # eslint

pnpm db:migrate   # prisma migrate dev
pnpm db:seed      # seed full catalog
pnpm db:seed:admin  # seed admin user only
pnpm db:studio    # open Prisma Studio
```

## Next.js Version Warning

This project runs **Next.js 16.2.4** with **React 19**. APIs and conventions differ from Next.js 13/14/15. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`.

## Architecture

### Route Groups

| Group | Path prefix | Purpose |
|-------|-------------|---------|
| `(store)` | `/`, `/store`, `/men`, `/women`, `/cart`, `/checkout`, `/order/confirmation` | Public storefront |
| `(admin)` | `/admin/**` | Admin dashboard (auth-gated) |
| `(auth)` | `/auth/login` | Admin login |

API routes live in `app/api/`: `products`, `categories`, `checkout`, `checkout/verify`, `orders/complete`, `admin/upload`.

### Data Layer

- **Prisma + PostgreSQL** — schema at `prisma/schema.prisma`
- Singleton client at `lib/prisma.ts`
- Product variants: `Product → ProductColor → ProductImage + ProductStock`. Stock is tracked per color×size (`ProductStock`). Sizes per product also stored separately in `ProductSize` for UI filtering.
- `OrderItem` is fully denormalized (snapshot at purchase time) — never read live product data for order history.

### State Management

Cart is managed by **Zustand** (`lib/stores/cart.store.ts`), persisted to `localStorage` as `griple-cart`. Cart key is `productId::color::size`.

### Auth

NextAuth v5 (`next-auth@5.0.0-beta.31`) with credentials provider. Config at `auth.ts`, types extended at `types/next-auth.d.ts`. Middleware at `middleware.ts` gates `/admin/**`.

- `SUPER_ADMIN` — full access including product create/edit/delete
- `STAFF` — read-only on products (redirected away from create/edit routes)

### Server Actions

Admin mutations live in `lib/actions/admin/` (`products.ts`, `orders.ts`). All require `requireSuperAdmin()` or `requireAdmin()` from `guards.ts`. Actions accept `FormData` with a JSON `payload` field validated via Zod schemas in `lib/schemas/`.

### Checkout Flow

1. Client POSTs to `/api/checkout` → creates Stripe `PaymentIntent`, creates order record with `PENDING` status
2. Client confirms payment via Stripe Elements
3. On success, client POSTs to `/api/orders/complete` → verifies payment intent, updates order to `PROCESSING`

### Types

- `lib/types.ts` — frontend product/cart types (used by store pages and components)
- `lib/types/admin-role.ts`, `lib/types/catalog-enums.ts`, `lib/types/order-status.ts` — local TS type literals mirroring Prisma enums (import from here, not from `@prisma/client`)

### Component Organization

```
components/
  admin/      # admin dashboard UI
  auth/       # login form
  cart/       # cart drawer/page
  checkout/   # checkout form, Stripe, confirmation
  landing/    # homepage sections
  layout/     # Navbar, Footer, AnnouncementBar
  product/    # PDP components (gallery, selectors, purchase panel)
  providers/  # AppSessionProvider (NextAuth SessionProvider wrapper)
  shared/     # Breadcrumb, Container, SectionHeader
  store/      # listing page (filters, pagination, product grid)
  ui/         # primitive: Button
```

### Path Alias

`@/` maps to the project root (configured in `tsconfig.json`).
