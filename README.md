# Griple (MVP) — Storefront

## Getting Started

### Requirements

- Node.js 20+
- pnpm

### Run (dev)

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first tokens via `@theme` in `app/globals.css`)
- Zustand (cart state, persisted)
- react-hook-form + zod (checkout validation; phase berikutnya)

## Project structure

- `app/` — routes + root layout shell (AnnouncementBar + Navbar + Footer)
- `components/` — UI building blocks
- `data/` — mock JSON data (MVP: no DB/API)
- `lib/mock/` — data-access helpers (swap to Prisma later)
- `lib/stores/` — Zustand stores
- `public/images/` — local images (products/categories/hero/ugc)

## Mock data notes

Design PRD sempat mencampur JSON + TypeScript. File mock yang dipakai app adalah:

- `data/products.json`
- `data/categories.json`

Image paths sudah dinormalisasi ke struktur lokal `public/images/...`.

### Known image gaps (fallback to _pool)

Sebagian color variant di PRD belum punya foto lokal. Saat ini memakai fallback dari:

- `public/images/products/_pool/*`

List produk yang menggunakan fallback:

- `essential-fleece-hoodie`: Stone Grey
- `oversized-training-tee`: Washed Brown
- `high-waist-sculpt-legging`: Dusty Mauve
- `seamless-sports-bra`: Dusty Mauve
- `everyday-crew-sweatshirt`: Washed Brown

## Design source of truth

HTML reference ada di `docs/stitch_griple_fitness_apparel_store/*/code.html` dan token di:

- `docs/stitch_griple_fitness_apparel_store/premium_athletic_editorial/DESIGN.md`

