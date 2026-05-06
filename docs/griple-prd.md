# Griple — Product Requirements Document (PRD)

**Version:** 1.1  
**Last Updated:** May 2025  
**Owner:** Pramadha N  
**Status:** In Progress — MVP Phase  
**Design Files:** `docs/stitch_griple_fitness_apparel_store`  

> **Scope Note (v1.1):** MVP focuses on customer-facing storefront only. Backend, admin panel, payment, and AI are deferred to post-MVP phases. All data served from local JSON files — no database or API calls in MVP.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Tech Stack](#3-tech-stack)
4. [Information Architecture](#4-information-architecture)
5. [Design System](#5-design-system)
6. [Mock Data — JSON Files](#6-mock-data--json-files)
7. [Phase 1 — Static UI with Mock Data](#7-phase-1--static-ui-with-mock-data) ⬅ MVP
8. [Phase 2 — Client-Side Interactivity](#8-phase-2--client-side-interactivity) ⬅ MVP
9. [Phase 3 — Admin Panel](#9-phase-3--admin-panel) — post-MVP
10. [Phase 4 — Backend Integration](#10-phase-4--backend-integration) — post-MVP
11. [Phase 5 — Payment & AI Integration](#11-phase-5--payment--ai-integration) — post-MVP
12. [Phase Final — Production & Launch](#12-phase-final--production--launch) — post-MVP
13. [Out of Scope](#13-out-of-scope)
14. [Open Questions](#14-open-questions)

---

## 1. Project Overview

**Griple** is a premium D2C gym & exercise apparel brand built as a full-stack portfolio project targeting Upwork clients looking for mid-scale custom e-commerce solutions.

| | |
|---|---|
| **Brand** | Griple |
| **Niche** | Premium gym & exercise apparel (D2C) |
| **Model** | Direct-to-Consumer, single-brand store |
| **Reference** | Gymshark (aesthetic), Razer Store (structure) |
| **Aesthetic** | Clean, minimal, editorial — cream/off-white base, black accents |

**Primary Purpose:** Portfolio project demonstrating full-stack e-commerce capability: modern UI, cart/checkout flow, admin panel, payment integration, and AI feature.

---

## 2. Goals & Success Metrics

### Portfolio Goals
- Demonstrate production-quality UI/UX matching premium brand standards
- Show complete e-commerce flow: browse → cart → checkout → confirmation
- Showcase AI integration (product copywriter in admin)
- Present clean, scalable Next.js architecture

### MVP Definition
> A fully functional, visually complete customer-facing storefront powered by local JSON mock data. Cart and all filtering/sorting interactions work client-side. No backend, no database, no payment, no admin panel in MVP scope.

### Success Metrics (MVP)
| Metric | Target |
|---|---|
| Page load (LCP) | < 2.5s |
| Mobile responsiveness | 100% pages |
| Cart flow | Add → view cart → checkout form (UI complete) |
| Filter & sort | All working client-side on JSON data |
| Zero broken routes | All pages navigable |

---

## 3. Tech Stack

| Layer | Technology | MVP? |
|---|---|---|
| Framework | Next.js 14 (App Router) | Yes |
| Language | TypeScript | Yes |
| Styling | Tailwind CSS + shadcn/ui | Yes |
| State (client) | Zustand | Yes |
| Mock Data | Local JSON files (`/data/*.json`) | Yes |
| ORM | Prisma | Post-MVP |
| Database | PostgreSQL (Neon or Supabase) | Post-MVP |
| Auth (admin) | NextAuth.js v5 (credentials) | Post-MVP |
| Payment | Stripe (sandbox) | Post-MVP |
| AI | Vercel AI SDK + OpenAI or Anthropic | Post-MVP |
| Image storage | Cloudinary or Supabase Storage | Post-MVP |
| Deployment | Vercel | Post-MVP |

### MVP Architecture
```
app/
├── (store)/          → All customer-facing pages
data/
├── products.json
├── categories.json
└── orders.json       → placeholder, used post-MVP
lib/
├── mock/             → Data access helpers (reads JSON)
└── stores/           → Zustand cart store
```

---

## 4. Information Architecture

### Routes

**MVP (customer-facing only)**

| Route | Page |
|---|---|
| `/` | Landing page |
| `/men` | Men's entry page |
| `/women` | Women's entry page |
| `/store` | All products catalog |
| `/store/[slug]` | Product detail page |
| `/cart` | Cart page |
| `/checkout` | Guest checkout (form UI only — no real payment) |
| `/order/confirmation` | Static order confirmation page |

**Post-MVP (deferred)**

| Route | Page | Phase |
|---|---|---|
| `/admin/*` | Admin dashboard | Phase 3 |
| `/auth/login` | Admin login | Phase 3 |
| `/order/[id]` | Real order confirmation from DB | Phase 4 |

### Navigation Structure

**Navbar (Customer)**
```
[Griple]   Men   Women   Collections   Sale   [Search] [Cart(n)]
```

**Mega Menu — Men**
- New Arrivals
- Tops: T-Shirts, Hoodies, Zip Jackets, Base Layers, Tank Tops
- Bottoms: Joggers, Shorts, Pants
- Accessories: Socks, Caps

**Mega Menu — Women**
- New Arrivals
- Tops: T-Shirts, Hoodies, Crop Tops, Base Layers
- Bottoms: Leggings, Joggers, Shorts
- Accessories: Socks, Caps

---

## 5. Design System

> Extracted from `docs/stitch_griple_fitness_apparel_store/premium_athletic_editorial/DESIGN.md` and verified against the component HTML files. These are the ground-truth values to implement in Tailwind config.

---

### Brand Aesthetic

High-end editorial minimalism that balances performance athletics with luxury fashion sensibilities. **Confidence-driven**, whitespace-forward, monochromatic. A warm cream base distinguishes the brand from technical/cold competitors. Depth is communicated through tonal layering and structural borders — no shadows, no gradients.

---

### Color Palette

Sourced directly from `DESIGN.md` color tokens:

| Token | Hex | Usage |
|---|---|---|
| `background` | `#fbf9f8` | Page background (warm cream) |
| `surface` | `#ffffff` | Cards, navbar, elevated containers |
| `surface-container-low` | `#f5f3f3` | Subtle container bg |
| `surface-container` | `#efeded` | Input backgrounds, hover states |
| `surface-container-high` | `#e9e8e7` | Image placeholders, disabled states |
| `surface-container-highest` | `#e4e2e2` | Strongest container |
| `on-surface` | `#1b1c1c` | Primary text |
| `on-surface-variant` | `#444748` | Secondary text, descriptions |
| `outline` | `#747878` | Medium borders, placeholder text |
| `outline-variant` | `#c4c7c7` | Subtle borders, dividers |
| `primary` | `#000000` | CTA buttons, selected states |
| `on-primary` | `#ffffff` | Text on dark buttons |
| `inverse-surface` | `#303031` | Dark sections (footer, brand statement) |
| `inverse-on-surface` | `#f2f0f0` | Text on dark sections |
| `secondary` | `#5d5f5d` | Supporting text |
| `error` | `#ba1a1a` | Form validation errors |

**Tailwind config mapping:**
```javascript
// tailwind.config.ts
colors: {
  background:                '#fbf9f8',
  surface:                   '#ffffff',
  'surface-container-low':   '#f5f3f3',
  'surface-container':       '#efeded',
  'surface-container-high':  '#e9e8e7',
  'on-surface':              '#1b1c1c',
  'on-surface-variant':      '#444748',
  outline:                   '#747878',
  'outline-variant':         '#c4c7c7',
  primary:                   '#000000',
  'on-primary':              '#ffffff',
  'inverse-surface':         '#303031',
  'inverse-on-surface':      '#f2f0f0',
  error:                     '#ba1a1a',
}
```

---

### Typography

Font: **Inter** — used exclusively across all touchpoints.

| Token | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `display` | 64px | 900 | 1.1 | -0.02em |
| `headline-lg` | 32px | 800 | 1.2 | -0.02em |
| `headline-md` | 24px | 700 | 1.3 | -0.01em |
| `body-lg` | 18px | 400 | 1.6 | 0 |
| `body-md` | 16px | 400 | 1.6 | 0 |
| `label-caps` | 12px | 600 | 1 | 0.08em + uppercase |

**Tailwind config mapping:**
```javascript
// tailwind.config.ts
fontSize: {
  display:      ['64px', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '900' }],
  'headline-lg':['32px', { lineHeight: '1.2',  letterSpacing: '-0.02em', fontWeight: '800' }],
  'headline-md':['24px', { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '700' }],
  'body-lg':    ['18px', { lineHeight: '1.6',  letterSpacing: '0',       fontWeight: '400' }],
  'body-md':    ['16px', { lineHeight: '1.6',  letterSpacing: '0',       fontWeight: '400' }],
  'label-caps': ['12px', { lineHeight: '1',    letterSpacing: '0.08em',  fontWeight: '600' }],
}
```

Usage in class names: `font-display`, `font-headline-lg`, `font-label-caps`, etc.

---

### Spacing

Based on 8px base unit:

| Token | Value | Usage |
|---|---|---|
| `base` | 8px | Base unit for all spacing |
| `gutter` | 24px | Column gap in grids |
| `margin-edge` | 48px | Horizontal page margin |
| `section-gap` | 120px | Vertical gap between page sections |
| `container-max` | 1440px | Max content width |

```javascript
// tailwind.config.ts
spacing: {
  'margin-edge': '48px',
  'section-gap': '120px',
  'gutter':      '24px',
},
maxWidth: {
  container: '1440px',
}
```

---

### Border Radius

> Note: `DESIGN.md` originally specified sharp (0px) corners. The actual built components use rounded values as agreed during design review. The HTML files are the ground truth.

| Element | Class | Value |
|---|---|---|
| CTA buttons | `rounded-full` | Pill |
| Size selector pills | `rounded-full` | Pill |
| Color swatch circles | `rounded-full` | Circle |
| Quantity selector | `rounded-full` | Pill |
| Product cards | `rounded-2xl` | 16px |
| Image containers | `rounded-2xl` | 16px |
| Thumbnail images | `rounded-2xl` | 16px |
| Accordion panels | `rounded-xl` | 12px |
| Input fields | `rounded-xl` | 12px |

---

### Elevation & Depth

No drop shadows. Depth achieved via tonal layering:

1. **Background → Surface lift:** `#fbf9f8` (page) → `#ffffff` (cards) creates visible layer without shadow
2. **Structural borders:** `1px solid #c4c7c7` (`outline-variant`) defines component boundaries
3. **Container fills:** `surface-container-high` (`#e9e8e7`) used for image placeholders and disabled states

```
No box-shadow anywhere.
No backdrop-filter blur except navbar (backdrop-blur-md at 95% opacity).
```

---

### Components

**Buttons**
```
Primary:   bg-primary (#000000) text-on-primary (#ffffff) rounded-full font-label-caps uppercase
           hover: bg-inverse-surface (#303031) transition-colors

Secondary: border border-outline text-on-surface rounded-full font-label-caps uppercase
           hover: bg-surface-container transition-colors
```

**Input Fields**
```
Default:  border border-outline-variant rounded-xl bg-white px-6 py-4
          focus: border-primary ring-1 ring-primary
          placeholder: text-outline (color)
Label:    font-label-caps uppercase, always above the input
```

**Size Selector Pills**
```
Default:  border border-outline-variant text-on-surface rounded-full font-label-caps
          hover: border-primary
Selected: border-2 border-primary bg-primary text-on-primary rounded-full
Disabled: text-outline bg-surface-container-low cursor-not-allowed rounded-full
```

**Color Swatches**
```
Default:  w-8 h-8 rounded-full border border-outline-variant
Selected: border-2 border-primary
```

**Product Cards**
```
Container:  rounded-2xl overflow-hidden border border-outline-variant bg-surface
Image area: aspect-[3/4] bg-surface-container-high
Name:       font-label-caps uppercase text-on-surface
Price:      font-body-md text-on-surface-variant
No shadow.
```

**Navbar**
```
Sticky, z-50
bg-surface/95 backdrop-blur-md border-b border-outline-variant
Logo: font-headline-lg font-black tracking-tighter text-primary
Links: font-label-caps text-on-surface-variant hover:text-primary
```

**Accordions (PDP)**
```
details element: border-b border-outline-variant rounded-xl
summary: font-label-caps uppercase py-4
body:    font-body-md text-on-surface-variant
```

---

## 6. Mock Data — JSON Files

All MVP data is stored as static JSON files under `/data`. No database, no API calls. Data is imported directly into components or read via small helper functions in `lib/mock/`.

```
data/
├── products.json       → 12 products with full variant data
├── categories.json     → 8 categories
└── orders.json         → placeholder (used in Phase 3+)
```

### Data Access Pattern

```typescript
// lib/mock/products.ts
import products from '@/data/products.json'

export function getAllProducts() {
  return products
}

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug) ?? null
}

export function getFeaturedProducts() {
  return products.filter(p => p.isFeatured && p.isPublished)
}

export function getNewArrivals() {
  return products.filter(p => p.isNewArrival && p.isPublished)
}

export function getProductsByGender(gender: 'men' | 'women') {
  return products.filter(p => p.gender === gender || p.gender === 'unisex')
}
```

> When Phase 4 backend is implemented, only the functions in `lib/mock/` need to be replaced with Prisma queries. All components stay untouched.

---

### products.json

```json
[
  {
    "id": "prod_001",
    "name": "Essential Fleece Hoodie",
    "slug": "essential-fleece-hoodie",
    "category": "hoodies",
    "gender": "men",
    "price": 79.99,
    "originalPrice": null,
    "badge": "Best Seller",
    "description": "Designed for post-workout comfort and everyday wear. Crafted from heavyweight French terry fabric with a relaxed silhouette.",
    "fabric": "80% Cotton, 20% Polyester",
    "care": "Machine wash cold, tumble dry low",
    "colors": [
      { "name": "Midnight Black", "hex": "#1A1A1A", "images": ["/images/products/hoodie-black-1.jpg", "/images/products/hoodie-black-2.jpg"] },
      { "name": "Stone Grey",     "hex": "#9E9E9E", "images": ["/images/products/hoodie-grey-1.jpg",  "/images/products/hoodie-grey-2.jpg"] },
      { "name": "Off White",      "hex": "#F5F5F0", "images": ["/images/products/hoodie-white-1.jpg", "/images/products/hoodie-white-2.jpg"] }
    ],
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "stock": { "XS": 10, "S": 25, "M": 30, "L": 20, "XL": 15, "XXL": 8 },
    "isPublished": true,
    "isFeatured": true,
    "isNewArrival": false,
    "createdAt": "2025-01-15"
  }
  {
    id: "prod_002",
    name: "Tapered Training Jogger",
    slug: "tapered-training-jogger",
    category: "joggers",
    gender: "men",
    price: 64.99,
    originalPrice: null,
    badge: "Best Seller",
    description: "Technical fabric, tapered fit. Built for training sessions and commutes alike.",
    fabric: "92% Polyester, 8% Elastane",
    care: "Machine wash cold",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/jogger-black-1.jpg", "/mock/jogger-black-2.jpg"] },
      { name: "Olive",          hex: "#6B7B4A", images: ["/mock/jogger-olive-1.jpg", "/mock/jogger-olive-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: { XS: 5, S: 20, M: 35, L: 25, XL: 10, XXL: 5 },
    isPublished: true,
    isFeatured: true,
    isNewArrival: false,
    createdAt: "2025-01-20",
  },
  {
    id: "prod_003",
    name: "Compression Base Layer Top",
    slug: "compression-base-layer-top",
    category: "base-layers",
    gender: "men",
    price: 49.99,
    originalPrice: null,
    badge: "New",
    description: "4-way stretch compression fabric for maximum performance. Moisture-wicking, odour-resistant.",
    fabric: "88% Nylon, 12% Spandex",
    care: "Machine wash cold",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/base-black-1.jpg", "/mock/base-black-2.jpg"] },
      { name: "Navy",           hex: "#1B2A4A", images: ["/mock/base-navy-1.jpg",  "/mock/base-navy-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: { XS: 15, S: 30, M: 40, L: 30, XL: 20, XXL: 10 },
    isPublished: true,
    isFeatured: false,
    isNewArrival: true,
    createdAt: "2025-03-01",
  },
  {
    id: "prod_004",
    name: "Oversized Training Tee",
    slug: "oversized-training-tee",
    category: "t-shirts",
    gender: "men",
    price: 39.99,
    originalPrice: null,
    badge: null,
    description: "Drop-shoulder silhouette with garment-washed finish. Relaxed enough for rest days, breathable enough for training.",
    fabric: "100% Heavyweight Cotton",
    care: "Machine wash cold, line dry",
    colors: [
      { name: "Washed White",   hex: "#F0EDE8", images: ["/mock/tee-white-1.jpg", "/mock/tee-white-2.jpg"] },
      { name: "Washed Black",   hex: "#2A2A2A", images: ["/mock/tee-black-1.jpg", "/mock/tee-black-2.jpg"] },
      { name: "Washed Brown",   hex: "#7A5C4A", images: ["/mock/tee-brown-1.jpg", "/mock/tee-brown-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: { XS: 20, S: 35, M: 45, L: 35, XL: 20, XXL: 10 },
    isPublished: true,
    isFeatured: false,
    isNewArrival: true,
    createdAt: "2025-03-10",
  },
  {
    id: "prod_005",
    name: "Zip Training Jacket",
    slug: "zip-training-jacket",
    category: "jackets",
    gender: "men",
    price: 99.99,
    originalPrice: 119.99,
    badge: "Sale",
    description: "Lightweight full-zip training jacket. Moisture-wicking shell with stretch panels under the arms.",
    fabric: "95% Polyester, 5% Elastane",
    care: "Machine wash cold",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/jacket-black-1.jpg", "/mock/jacket-black-2.jpg"] },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: { S: 10, M: 20, L: 15, XL: 10, XXL: 5 },
    isPublished: true,
    isFeatured: true,
    isNewArrival: false,
    createdAt: "2025-02-01",
  },
  {
    id: "prod_006",
    name: "Training Short 7\"",
    slug: "training-short-7in",
    category: "shorts",
    gender: "men",
    price: 44.99,
    originalPrice: null,
    badge: null,
    description: "7-inch inseam training short with built-in liner and side pockets. Built for high-rep training.",
    fabric: "90% Polyester, 10% Spandex",
    care: "Machine wash cold",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/short-black-1.jpg", "/mock/short-black-2.jpg"] },
      { name: "Stone Grey",     hex: "#9E9E9E", images: ["/mock/short-grey-1.jpg",  "/mock/short-grey-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: { XS: 12, S: 25, M: 30, L: 22, XL: 12, XXL: 5 },
    isPublished: true,
    isFeatured: false,
    isNewArrival: false,
    createdAt: "2025-01-25",
  },
  {
    id: "prod_007",
    name: "High-Waist Sculpt Legging",
    slug: "high-waist-sculpt-legging",
    category: "leggings",
    gender: "women",
    price: 69.99,
    originalPrice: null,
    badge: "Best Seller",
    description: "High-waist legging with sculpting waistband and seamless construction. 4-way stretch for unrestricted movement.",
    fabric: "72% Nylon, 28% Elastane",
    care: "Machine wash cold, do not tumble dry",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/legging-black-1.jpg", "/mock/legging-black-2.jpg"] },
      { name: "Dusty Mauve",    hex: "#C4A89A", images: ["/mock/legging-mauve-1.jpg", "/mock/legging-mauve-2.jpg"] },
      { name: "Slate Blue",     hex: "#7A8FA6", images: ["/mock/legging-blue-1.jpg",  "/mock/legging-blue-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 20, S: 35, M: 40, L: 25, XL: 15 },
    isPublished: true,
    isFeatured: true,
    isNewArrival: false,
    createdAt: "2025-01-15",
  },
  {
    id: "prod_008",
    name: "Crop Training Hoodie",
    slug: "crop-training-hoodie",
    category: "hoodies",
    gender: "women",
    price: 69.99,
    originalPrice: null,
    badge: "New",
    description: "Cropped silhouette hoodie in heavyweight French terry. Designed for the gym, made for everywhere else.",
    fabric: "80% Cotton, 20% Polyester",
    care: "Machine wash cold",
    colors: [
      { name: "Off White",   hex: "#F5F5F0", images: ["/mock/crop-hoodie-white-1.jpg", "/mock/crop-hoodie-white-2.jpg"] },
      { name: "Dusty Rose",  hex: "#D4A5A5", images: ["/mock/crop-hoodie-rose-1.jpg",  "/mock/crop-hoodie-rose-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 18, S: 30, M: 35, L: 20, XL: 10 },
    isPublished: true,
    isFeatured: true,
    isNewArrival: true,
    createdAt: "2025-03-15",
  },
  {
    id: "prod_009",
    name: "Seamless Sports Bra",
    slug: "seamless-sports-bra",
    category: "tops",
    gender: "women",
    price: 44.99,
    originalPrice: null,
    badge: null,
    description: "Medium-support seamless sports bra with removable pads. Minimal seams for maximum comfort.",
    fabric: "76% Nylon, 24% Spandex",
    care: "Machine wash cold",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/bra-black-1.jpg", "/mock/bra-black-2.jpg"] },
      { name: "Sage Green",     hex: "#8FA88A", images: ["/mock/bra-sage-1.jpg",  "/mock/bra-sage-2.jpg"] },
      { name: "Dusty Mauve",    hex: "#C4A89A", images: ["/mock/bra-mauve-1.jpg", "/mock/bra-mauve-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 25, S: 40, M: 35, L: 20, XL: 10 },
    isPublished: true,
    isFeatured: false,
    isNewArrival: true,
    createdAt: "2025-03-20",
  },
  {
    id: "prod_010",
    name: "Flare Training Pant",
    slug: "flare-training-pant",
    category: "pants",
    gender: "women",
    price: 59.99,
    originalPrice: null,
    badge: "New",
    description: "Wide-leg flare silhouette in buttery-soft fabric. Studio-to-street style with a high-rise waistband.",
    fabric: "80% Nylon, 20% Spandex",
    care: "Machine wash cold",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/flare-black-1.jpg", "/mock/flare-black-2.jpg"] },
      { name: "Slate Blue",     hex: "#7A8FA6", images: ["/mock/flare-blue-1.jpg",  "/mock/flare-blue-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { XS: 15, S: 28, M: 32, L: 18, XL: 8 },
    isPublished: true,
    isFeatured: false,
    isNewArrival: true,
    createdAt: "2025-03-25",
  },
  {
    id: "prod_011",
    name: "Lightweight Windbreaker",
    slug: "lightweight-windbreaker",
    category: "jackets",
    gender: "unisex",
    price: 89.99,
    originalPrice: null,
    badge: null,
    description: "Packable windbreaker with DWR coating. Blocks wind and light rain without sacrificing breathability.",
    fabric: "100% Recycled Nylon with DWR coating",
    care: "Machine wash cold, do not iron",
    colors: [
      { name: "Midnight Black", hex: "#1A1A1A", images: ["/mock/wind-black-1.jpg", "/mock/wind-black-2.jpg"] },
      { name: "Olive",          hex: "#6B7B4A", images: ["/mock/wind-olive-1.jpg", "/mock/wind-olive-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: { XS: 10, S: 20, M: 25, L: 20, XL: 12, XXL: 6 },
    isPublished: true,
    isFeatured: false,
    isNewArrival: false,
    createdAt: "2025-02-10",
  },
  {
    id: "prod_012",
    name: "Everyday Crew Sweatshirt",
    slug: "everyday-crew-sweatshirt",
    category: "hoodies",
    gender: "unisex",
    price: 69.99,
    originalPrice: 84.99,
    badge: "Sale",
    description: "Classic crewneck sweatshirt in garment-dyed heavyweight fleece. A wardrobe essential.",
    fabric: "100% Heavyweight Cotton Fleece",
    care: "Machine wash cold, tumble dry low",
    colors: [
      { name: "Washed Cream",   hex: "#E8E2D8", images: ["/mock/crew-cream-1.jpg", "/mock/crew-cream-2.jpg"] },
      { name: "Washed Brown",   hex: "#7A5C4A", images: ["/mock/crew-brown-1.jpg", "/mock/crew-brown-2.jpg"] },
      { name: "Washed Black",   hex: "#2A2A2A", images: ["/mock/crew-black-1.jpg", "/mock/crew-black-2.jpg"] },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: { XS: 12, S: 25, M: 35, L: 30, XL: 18, XXL: 8 },
    "isPublished": true,
    "isFeatured": false,
    "isNewArrival": false,
    "createdAt": "2025-02-15"
  }
]
```

### Categories

### categories.json

```json
[
  { "id": "cat_001", "name": "Hoodies",     "slug": "hoodies",      "gender": "all",   "image": "/images/categories/hoodies.jpg" },
  { "id": "cat_002", "name": "Joggers",     "slug": "joggers",      "gender": "all",   "image": "/images/categories/joggers.jpg" },
  { "id": "cat_003", "name": "Base Layers", "slug": "base-layers",  "gender": "all",   "image": "/images/categories/base-layers.jpg" },
  { "id": "cat_004", "name": "New In",      "slug": "new-arrivals", "gender": "all",   "image": "/images/categories/new-in.jpg" },
  { "id": "cat_005", "name": "T-Shirts",    "slug": "t-shirts",     "gender": "all",   "image": "/images/categories/t-shirts.jpg" },
  { "id": "cat_006", "name": "Leggings",    "slug": "leggings",     "gender": "women", "image": "/images/categories/leggings.jpg" },
  { "id": "cat_007", "name": "Shorts",      "slug": "shorts",       "gender": "men",   "image": "/images/categories/shorts.jpg" },
  { "id": "cat_008", "name": "Jackets",     "slug": "jackets",      "gender": "all",   "image": "/images/categories/jackets.jpg" }
]
```

> `orders.json` and admin user data are deferred to Phase 3+. Not needed for MVP.

---

## 7. Phase 1 — Static UI with Mock Data

**Goal:** All customer-facing pages built and pixel-perfect using mock data. Zero backend, zero interactivity.

**Duration estimate:** 3–5 days

### Deliverables

| Page | Status | Notes |
|---|---|---|
| Landing page `/` | — | All 13 sections |
| Men entry `/men` | — | Hero + category grid + products |
| Women entry `/women` | — | Hero + category grid + products |
| Store catalog `/store` | — | Grid + filter sidebar (UI only) |
| Product detail `/store/[slug]` | — | Gallery + info + related |
| Cart page `/cart` | — | Static cart with mock items |
| Checkout page `/checkout` | — | Form UI only, no real payment |
| Order confirmation `/order/confirmation` | — | Static thank you page |

### Component Checklist

**Layout**
- [ ] `Navbar` — sticky, transparent-to-white on scroll, mega menu, mobile drawer
- [ ] `AnnouncementBar` — rotating messages, dismissible
- [ ] `Footer` — 4-column, dark bg

**Shared**
- [ ] `ProductCard` — image hover, badge, color swatches, quick add overlay
- [ ] `CategoryCard` — image, name overlay, hover scale
- [ ] `SectionHeader` — eyebrow label + title + optional link

**Store**
- [ ] `FilterSidebar` — accordion sections, all filter types (UI only)
- [ ] `SortBar` — product count + sort dropdown
- [ ] `ProductGrid` — responsive columns
- [ ] `Pagination`

**PDP**
- [ ] `ImageGallery` — main image + thumbnail strip
- [ ] `ColorSelector` — swatches with selected ring
- [ ] `SizeSelector` — pills with selected state
- [ ] `QuantitySelector` — minus/number/plus
- [ ] `ProductAccordion` — description, fabric, shipping

**Cart**
- [ ] `CartItem` — image, name, variant, qty controls, remove
- [ ] `OrderSummary` — subtotal, shipping, total
- [ ] `EmptyCartState`

**Checkout**
- [ ] `CheckoutForm` — all fields, labels above inputs
- [ ] `StripeCardPlaceholder` — bordered box (Phase 5 becomes real)

### Page Sections Reference

**Landing Page (/)** — 13 sections:
1. AnnouncementBar
2. Navbar
3. Hero — full-height, split layout, 2 CTAs
4. Featured Categories — 4 cards
5. Best Sellers — 4 product cards
6. Social Proof Strip — 4 stats
7. Brand Statement — dark section, 50/50 split
8. Collection Spotlight — full-width editorial, 70vh
9. New Arrivals — 4 product cards
10. How It's Made — 3 feature cards
11. UGC / Community Grid — 3x2 grid
12. Newsletter Signup — centered, email capture
13. Footer

---

## 8. Phase 2 — Client-Side Interactivity

**Goal:** All UI interactions functional. Cart state working. Filters applied. Forms validated. No backend yet.

**Duration estimate:** 2–3 days

### Cart (Zustand)

```typescript
// stores/cart.store.ts

interface CartItem {
  productId: string
  name: string
  slug: string
  color: string
  colorHex: string
  size: string
  price: number
  image: string
  qty: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string, size: string) => void
  updateQty: (productId: string, color: string, size: string, qty: number) => void
  clear: () => void
  total: () => number
  itemCount: () => number
}
```

Persist to `localStorage` with `zustand/middleware/persist`.

### Store Filters (Client-Side on Mock Data)

Filtering logic applied in-memory on `MOCK_PRODUCTS`:

| Filter | Type | Logic |
|---|---|---|
| Gender | checkbox | `product.gender === selected OR "unisex"` |
| Category | checkbox | `product.category === selected` |
| Size | pill toggle | `product.sizes.includes(selected)` |
| Color | swatch | `product.colors.some(c => c.name === selected)` |
| Price | range slider | `product.price >= min AND product.price <= max` |
| Sort | dropdown | Sort array by field |
| Badge filter | quick | New Arrivals, Best Sellers, Sale |

### Form Validation (Checkout)

Client-side validation using `react-hook-form` + `zod`:

```typescript
const checkoutSchema = z.object({
  fullName:    z.string().min(2, "Name required"),
  email:       z.string().email("Invalid email"),
  address:     z.string().min(5, "Address required"),
  city:        z.string().min(2, "City required"),
  state:       z.string().min(2, "State required"),
  postalCode:  z.string().min(3, "Postal code required"),
  country:     z.string().min(2, "Country required"),
})
```

### Interactivity Checklist

- [ ] Add to Cart from PDP
- [ ] Add to Cart from Quick Add on product card
- [ ] Cart item count badge updates in navbar
- [ ] Cart page: qty controls update totals live
- [ ] Cart page: remove item
- [ ] Empty cart state when all items removed
- [ ] Filter sidebar: filters update product grid live
- [ ] Filter sidebar: active filter count badge
- [ ] Clear all filters
- [ ] Sort dropdown changes product order
- [ ] PDP: color selector switches images
- [ ] PDP: size selector highlights selected
- [ ] PDP: out-of-stock sizes disabled
- [ ] Checkout form: inline validation on blur
- [ ] Checkout form: submit disabled until valid
- [ ] Announcement bar: auto-rotate + dismiss
- [ ] Navbar: transparent-to-white on scroll
- [ ] Mega menu: open/close on hover
- [ ] Mobile menu drawer: open/close

---

## 9. Phase 3 — Admin Panel *(Post-MVP)*

> Deferred. Will be started after MVP is complete and deployed.

**Duration estimate:** 2–3 days

### Pages

| Page | Role | Features |
|---|---|---|
| `/auth/login` | Public | Email + password form |
| `/admin/dashboard` | Admin | Stats overview, recent orders |
| `/admin/products` | Admin | Product table, search, filter |
| `/admin/products/new` | Super Admin | Create form + AI copywriter |
| `/admin/products/[id]` | Super Admin | Edit form |
| `/admin/orders` | Admin | Order table, status filter |
| `/admin/orders/[id]` | Admin | Order detail + status update |

### Admin Layout
- Sidebar navigation (collapsible on mobile)
- Top bar: current user name + role badge + logout
- Breadcrumb per page

### Dashboard Stats (mock)
```typescript
{
  totalRevenue:  "$12,450",
  totalOrders:   48,
  pendingOrders: 3,
  totalProducts: 12,
  recentOrders: MOCK_ORDERS.slice(0, 5)
}
```

### Product Form Fields
| Field | Type | Notes |
|---|---|---|
| Name | text | Required |
| Slug | text | Auto-generated from name, editable |
| Category | select | From MOCK_CATEGORIES |
| Gender | select | Men, Women, Unisex |
| Price | number | Decimal |
| Original Price | number | Optional, for sale badge |
| Description | textarea | + AI Copywriter button |
| Fabric & Care | textarea | |
| Colors | repeater | Name + hex + image upload slots |
| Sizes | multi-select | XS S M L XL XXL |
| Stock per size | number per size | |
| Published | toggle | |
| Featured | toggle | |
| New Arrival | toggle | |

### AI Copywriter (Phase 3 — UI only)
- Button "Generate with AI" next to description field
- Opens modal with prompt input: "Describe your product briefly..."
- Shows loading state
- Populates description field on success
- Actual AI call wired in Phase 5

### RBAC (Mock — Phase 4 replaces with real auth)
```typescript
// Simulated session for Phase 3 UI development
const MOCK_SESSION = {
  user: { id: "admin_001", name: "Super Admin", role: "SUPER_ADMIN" }
}
```

UI-level role checks:
- STAFF cannot access `/admin/products/new` or `/admin/products/[id]`
- STAFF can view orders but cannot delete
- SUPER_ADMIN has full access

---

## 10. Phase 4 — Backend Integration *(Post-MVP)*

> Deferred. JSON mock data in `lib/mock/` will be swapped for Prisma queries — components stay untouched.

### Prisma Schema

```prisma
model Product {
  id            String      @id @default(cuid())
  name          String
  slug          String      @unique
  category      String
  gender        String      @default("all")
  price         Decimal     @db.Decimal(10, 2)
  originalPrice Decimal?    @db.Decimal(10, 2)
  description   String
  fabric        String?
  care          String?
  badge         String?
  isPublished   Boolean     @default(false)
  isFeatured    Boolean     @default(false)
  isNewArrival  Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  colors        ProductColor[]
  orderItems    OrderItem[]
}

model ProductColor {
  id        String         @id @default(cuid())
  productId String
  name      String
  hex       String
  product   Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  images    ProductImage[]
  stocks    ProductStock[]
}

model ProductImage {
  id       String       @id @default(cuid())
  colorId  String
  url      String
  position Int          @default(0)
  color    ProductColor @relation(fields: [colorId], references: [id], onDelete: Cascade)
}

model ProductStock {
  id       String       @id @default(cuid())
  colorId  String
  size     String
  qty      Int          @default(0)
  color    ProductColor @relation(fields: [colorId], references: [id], onDelete: Cascade)
}

model Order {
  id              String      @id @default(cuid())
  status          OrderStatus @default(PENDING)
  customerName    String
  customerEmail   String
  shippingAddress Json
  subtotal        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  paymentIntentId String?     @unique
  paidAt          DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  colorName String
  size      String
  qty       Int
  unitPrice Decimal @db.Decimal(10, 2)
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

model AdminUser {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String
  role      AdminRole @default(STAFF)
  createdAt DateTime  @default(now())
}

enum OrderStatus { PENDING PROCESSING SHIPPED DELIVERED CANCELLED }
enum AdminRole   { SUPER_ADMIN STAFF }
```

### Server Actions to Implement

```
actions/
├── products.ts
│   ├── getProducts(filters)
│   ├── getProductBySlug(slug)
│   ├── getFeaturedProducts()
│   ├── createProduct(data)        → Super Admin only
│   ├── updateProduct(id, data)    → Super Admin only
│   └── deleteProduct(id)          → Super Admin only
├── orders.ts
│   ├── createOrder(cartItems, customerData)
│   ├── getOrders(filters)
│   ├── getOrderById(id)
│   └── updateOrderStatus(id, status)
└── admin.ts
    └── getAdminStats()
```

### Seed Script
Migrate `MOCK_PRODUCTS`, `MOCK_CATEGORIES`, and `MOCK_ADMIN_USERS` to DB via `prisma/seed.ts`.

---

## 11. Phase 5 — Payment & AI Integration *(Post-MVP)*

> Deferred. Requires Phase 4 backend to be complete first.

### Stripe Integration

**Flow:**
```
createOrder() Server Action
  → validate cart vs DB prices
  → create Order record (PENDING)
  → create Stripe PaymentIntent
  → return clientSecret

Frontend: Stripe Elements confirm payment
  → success → /order/[id]

Webhook: /api/webhooks/stripe
  → payment_intent.succeeded
  → update Order status → PROCESSING
  → (future: send confirmation email)
```

**Environment variables:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### AI Copywriter

```typescript
// app/api/ai/copywriter/route.ts

POST body: { prompt: string }

System prompt:
  "You are an expert e-commerce copywriter for a premium gym apparel brand called Griple.
   Write product descriptions that are benefit-focused, SEO-friendly, 
   150–200 words, with a hook, key benefits, and a call to action.
   Tone: confident, clean, minimal. No fluff. Output plain text only."

Response: streamed text → populates admin description field
```

Use `useCompletion` from `ai/react` on the frontend for streaming display.

---

## 12. Phase Final — Production & Launch *(Post-MVP)*

> Deferred. Full production checklist after all phases are complete.

### Checklist

**Performance**
- [ ] `next/image` on all product images (proper sizes + formats)
- [ ] Lazy loading on below-fold sections
- [ ] Route prefetching on navigation links
- [ ] LCP < 2.5s verified via Vercel Speed Insights

**SEO**
- [ ] `generateMetadata()` on all pages
- [ ] OG image for landing page
- [ ] Sitemap via `app/sitemap.ts`
- [ ] robots.txt

**Error Handling**
- [ ] 404 page (`not-found.tsx`)
- [ ] Error boundary (`error.tsx`)
- [ ] Loading states (`loading.tsx`) per route

**Security**
- [ ] Admin routes protected by middleware
- [ ] Stripe webhook signature verification
- [ ] Server Action input validation (zod)
- [ ] Rate limiting on AI route

**Demo Readiness**
- [ ] Seed realistic demo data (from mock data spec above)
- [ ] Demo admin credentials in README
- [ ] Demo Stripe test card noted in checkout UI
- [ ] Mobile tested on real device

**Deployment**
- [ ] Vercel project configured
- [ ] Environment variables set in Vercel dashboard
- [ ] PostgreSQL (Neon) provisioned and connected
- [ ] Custom domain (optional): griple.pramadhanindi.my.id

---

## 13. Out of Scope

The following features are explicitly excluded from all phases:

| Feature | Reason |
|---|---|
| Customer accounts / login | Adds complexity, not needed for portfolio signal |
| Wishlist | Post-launch feature |
| Product reviews | Requires customer accounts first |
| Promo / discount codes | Payment complexity, Phase Final+ |
| Email notifications | Requires email service setup |
| Multi-currency | Out of scope for D2C MVP |
| Size guide modal content | Placeholder only |
| Inventory alerts | Admin nice-to-have, not MVP |
| Refund processing | Manual for now |

---

## 14. Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Image hosting — Cloudinary vs Supabase Storage? | Pram | Open |
| 2 | Payment gateway — Stripe (USD) or Midtrans (IDR)? | Pram | Open |
| 3 | AI provider — OpenAI or Anthropic for copywriter? | Pram | Open |
| 4 | Deploy domain — use existing pramadhanindi.my.id subdomain? | Pram | Open |
| 5 | Men/Women entry pages — unique hero per gender or same layout? | Pram | Open |

---

*Document maintained by Pramadha N — pramadhanindi.my.id*