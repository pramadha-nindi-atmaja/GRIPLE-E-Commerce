# Gymshark Scraper + DB Injection — Design Spec

Date: 2026-05-11

## Goal

Scrape 100 men's and 100 women's products from gymshark.com, download images locally, and inject into the Griple PostgreSQL database — replacing all existing catalog data.

---

## Architecture

Single script: `scripts/scrape-gymshark.ts`

```
Shopify JSON API
  /collections/mens/products.json        → 100 men products
  /collections/womens/products.json      → 100 women products
        ↓
  Extract unique categories (product_type)  → data/categories.json
  Map product fields to MockProduct shape   → data/products.json
  Download images                           → public/images/products/{slug}/
        ↓
  pnpm db:seed  (existing seed.ts — handles drop + re-insert + admin)
```

The script does NOT touch the DB directly. It generates the two JSON files and calls the existing seed pipeline.

---

## Script: `scripts/scrape-gymshark.ts`

### Inputs

- Men's collection handle: `mens` (fallback: `mens-clothing`, `all-mens`)
- Women's collection handle: `womens` (fallback: `womens-clothing`, `all-womens`)
- Limit: 100 per gender

### Shopify API Endpoints

```
GET https://www.gymshark.com/collections/{handle}/products.json?limit=250&page={n}
```

Returns JSON with `{ products: [...] }`. Paginate with `page` param until 100 collected per gender.

### Execution

```bash
npx ts-node scripts/scrape-gymshark.ts
pnpm db:seed
```

Or combined: script calls `execSync('pnpm db:seed')` at the end.

---

## Data Mapping

### Product (MockProduct)

| Gymshark (Shopify) field | MockProduct field | Notes |
|---|---|---|
| `title` | `name` | As-is |
| `handle` | `slug` | As-is (already URL-safe) |
| `product_type` | `category` | Slugified (e.g. "Leggings" → "leggings") |
| `variants[0].price` (string) | `price` | Parse float |
| `variants[0].compare_at_price` | `originalPrice` | null if absent |
| `compare_at_price` exists? | `badge` | "Sale" if true, null otherwise |
| `body_html` (strip HTML tags) | `description` | Strip tags, trim |
| From collection fetched | `gender` | "men" or "women" |
| Generated | `id` | `prod_{index}` |
| Generated | `isPublished` | `true` |
| Generated | `isFeatured` | `false` |
| Generated | `isNewArrival` | `false` |
| Generated | `createdAt` | Current date |
| `published_at` (optional) | `createdAt` | Use if available |

### Colors (MockProductColor)

Shopify groups variants by options. Extract unique Color option values:

```
variants → filter unique option1 (Color) values
         → for each color: find images where variant.featured_image matches
```

Each color entry:
- `name`: color option value (e.g. "Cherry Purple")
- `hex`: mapped from name via color-name-to-hex table; fallback `#888888`
- `images`: array of image URLs downloaded locally

### Color → Hex Mapping Table

Common Gymshark colors mapped to hex. Examples:

```ts
const COLOR_HEX: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  navy: "#1B2A4A",
  blue: "#1565C0",
  red: "#C62828",
  pink: "#F48FB1",
  green: "#2E7D32",
  olive: "#6D6C00",
  purple: "#6A1B9A",
  orange: "#E65100",
  yellow: "#F9A825",
  brown: "#4E342E",
  cream: "#F5F5DC",
  beige: "#F5F0E8",
  // ... extended list
}
// Match by checking if any key appears in the lowercased color name
```

### Sizes

```
variants → extract unique option2 (Size) values → sizes[]
stock    → { [size]: 20 } for each size (fixed qty — Gymshark doesn't expose real stock)
```

### Categories (MockCategory)

Collect unique `product_type` values across all 200 products:

```ts
{
  id: `cat_{index}`,
  name: product_type,           // e.g. "Leggings"
  slug: slugify(product_type),  // e.g. "leggings"
  gender: inferGender(products_in_this_type),  // "men" | "women" | "all"
  image: `/images/categories/${slug}.jpg`      // placeholder path
}
```

Gender inference: if category only has men products → "men"; only women → "women"; both → "all".

---

## Image Download

### Storage Path

```
public/images/products/{product-slug}/{color-slug}-{index}.jpg
```

Where `color-slug` = color name lowercased, spaces replaced with `-`.

### URL in JSON

```
/images/products/{product-slug}/{color-slug}-{index}.jpg
```

### Download Logic

- Use Node.js `fetch` + `fs.createWriteStream`
- Limit concurrent downloads: 5 at a time (avoid rate limiting)
- Skip if file already exists (resumable)
- On download failure: log warning, use empty string for URL (seed will still run)
- Images from Gymshark CDN are typically `.jpg` or `.webp` — save as `.jpg` regardless

### Category Images

Category images path: `/images/categories/{slug}.jpg` — these are placeholder paths. The actual category images from Gymshark are not downloaded (categories page is separate). Admin can update via CMS later.

---

## Drop Strategy

Existing `seed.ts` already clears all tables in correct order:
```
AdminUser → OrderItem → Order → ProductStock → ProductImage →
ProductSize → ProductColor → Product → Category
```
Then re-seeds admin with same credentials:
- `admin@griple.com` / `dev-admin-change-me` (SUPER_ADMIN)
- `staff@griple.com` / `dev-staff-change-me` (STAFF)

No changes needed to `seed.ts`.

---

## Error Handling

| Scenario | Handling |
|---|---|
| Collection handle wrong | Try fallback handles; throw if all fail |
| Shopify API blocked (403/429) | Throw with message to use browser fallback |
| < 100 products in collection | Use however many are available, log warning |
| Image download fails | Log warning, skip image (product still seeded) |
| Missing `product_type` | Assign to "Other" category |
| Duplicate slug | Append `-2`, `-3` suffix |

---

## Out of Scope

- Real stock quantities (Gymshark doesn't expose this publicly)
- Category images (placeholder paths only)
- Fabric / care instructions (not in Shopify product JSON — would need detail page scrape)
- `isFeatured`, `isNewArrival` flags (all set to false; admin can update)
