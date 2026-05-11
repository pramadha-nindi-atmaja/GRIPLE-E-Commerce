# Gymshark Scraper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scrape 100 men + 100 women Gymshark products via Shopify JSON API, download images locally, write `data/products.json` + `data/categories.json`, then run existing seed to replace all DB data.

**Architecture:** Single script `scripts/scrape-gymshark.ts` fetches from Gymshark's Shopify API endpoints, maps data to `MockProduct`/`MockCategory` shape (matching `prisma/seed.ts` expectations), downloads product images to `public/images/products/`, writes JSON files, then calls `pnpm db:seed` which handles all DB operations including drop/re-insert/admin.

**Tech Stack:** Node.js fetch API, tsx (already installed), fs, child_process.execSync, Gymshark Shopify JSON API

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `scripts/scrape-gymshark.ts` | Create | Main scraper script |
| `package.json` | Modify | Add `db:scrape` script |
| `data/products.json` | Overwrite | Gymshark products (200 total) |
| `data/categories.json` | Overwrite | Categories derived from Gymshark product_type |
| `public/images/products/{slug}/` | Create dirs | Downloaded product images |

---

## Task 1: Verify Gymshark Shopify API Access

**Files:**
- No file changes — curl test only

- [ ] **Step 1: Test men's collection endpoint**

Run:
```bash
curl -s "https://www.gymshark.com/collections/mens/products.json?limit=1" | head -c 500
```

Expected: JSON with `{"products":[{"id":...,"title":...,"handle":...}]}`

If 404/403: try `mens-clothing` or `all-mens`:
```bash
curl -s "https://www.gymshark.com/collections/mens-clothing/products.json?limit=1" | head -c 500
```

- [ ] **Step 2: Test women's collection endpoint**

```bash
curl -s "https://www.gymshark.com/collections/womens/products.json?limit=1" | head -c 500
```

Expected: same JSON shape. Note the working handle — you'll use it in Task 2.

- [ ] **Step 3: Inspect one product's structure**

```bash
curl -s "https://www.gymshark.com/collections/womens/products.json?limit=1" | python -m json.tool | head -c 2000
```

Confirm these fields exist in the response:
- `products[0].title`
- `products[0].handle`
- `products[0].product_type`
- `products[0].variants[0].price`
- `products[0].variants[0].compare_at_price`
- `products[0].variants[0].option1` (Color)
- `products[0].variants[0].option2` (Size)
- `products[0].images[0].src`
- `products[0].images[0].variant_ids`

---

## Task 2: Add db:scrape to package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add script entry**

In `package.json`, add to `"scripts"`:
```json
"db:scrape": "node ./node_modules/tsx/dist/cli.mjs scripts/scrape-gymshark.ts"
```

Final scripts section:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "db:seed": "node --env-file=.env ./node_modules/tsx/dist/cli.mjs prisma/seed.ts",
  "db:seed:admin": "node --env-file=.env ./node_modules/tsx/dist/cli.mjs scripts/seed-admin-only.ts",
  "db:scrape": "node ./node_modules/tsx/dist/cli.mjs scripts/scrape-gymshark.ts",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio",
  "postinstall": "prisma generate"
}
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add db:scrape script"
```

---

## Task 3: Write Types and Utilities in scrape-gymshark.ts

**Files:**
- Create: `scripts/scrape-gymshark.ts`

- [ ] **Step 1: Create the file with imports, types, and utility functions**

Create `scripts/scrape-gymshark.ts` with this exact content:

```typescript
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── Shopify API types ───────────────────────────────────────────────────────

interface ShopifyImage {
  id: number;
  src: string;
  variant_ids: number[];
}

interface ShopifyVariant {
  id: number;
  price: string;
  compare_at_price: string | null;
  option1: string | null; // Color
  option2: string | null; // Size
  featured_image: { id: number; src: string } | null;
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  product_type: string;
  published_at: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

interface ShopifyCollectionResponse {
  products: ShopifyProduct[];
}

// ─── MockData types (must match prisma/seed.ts expectations) ─────────────────

interface MockProductColor {
  name: string;
  hex: string;
  images: string[];
}

interface MockProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  gender: "men" | "women";
  price: number;
  originalPrice: number | null;
  badge: "Best Seller" | "New" | "Sale" | null;
  description: string;
  fabric: null;
  care: null;
  colors: MockProductColor[];
  sizes: string[];
  stock: Record<string, number>;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: string;
}

interface MockCategory {
  id: string;
  name: string;
  slug: string;
  gender: "men" | "women" | "all";
  image: string;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const COLOR_KEYWORDS: Array<[string[], string]> = [
  [["black", "onyx", "jet", "noir", "carbon", "graphite"], "#111111"],
  [["white", "chalk", "ivory", "snow", "pearl", "cream", "off white", "offwhite"], "#F5F5F0"],
  [["grey", "gray", "silver", "ash", "smoke", "slate", "charcoal", "marl"], "#9E9E9E"],
  [["navy", "naval", "midnight", "dark blue", "indigo"], "#1B2A4A"],
  [["blue", "cobalt", "sky", "azure", "teal", "aqua", "cyan", "sapphire"], "#1565C0"],
  [["green", "sage", "mint", "olive", "khaki", "forest", "moss", "camo", "army", "jungle"], "#4CAF50"],
  [["pink", "rose", "blush", "salmon", "coral", "mauve", "flamingo", "berry pink"], "#F48FB1"],
  [["red", "cherry", "crimson", "scarlet", "brick", "wine", "burgundy", "maroon"], "#C62828"],
  [["orange", "amber", "rust", "copper", "terracotta", "burnt"], "#E65100"],
  [["yellow", "sunshine", "mustard", "gold", "lemon", "citrus"], "#F9A825"],
  [["purple", "lavender", "violet", "plum", "lilac", "heather"], "#7B1FA2"],
  [["brown", "caramel", "tan", "sand", "mocha", "chocolate", "taupe", "khaki brown"], "#795548"],
  [["beige", "nude", "stone", "oat", "natural", "ecru"], "#F5F0E8"],
];

function colorToHex(colorName: string): string {
  const lower = colorName.toLowerCase();
  for (const [keywords, hex] of COLOR_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return hex;
  }
  return "#888888";
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/scrape-gymshark.ts
git commit -m "feat: add scraper types and utilities"
```

---

## Task 4: Write Shopify API Fetcher

**Files:**
- Modify: `scripts/scrape-gymshark.ts` (append after utilities)

- [ ] **Step 1: Append the fetcher function**

Append to `scripts/scrape-gymshark.ts`:

```typescript
// ─── Shopify API Fetcher ─────────────────────────────────────────────────────

const COLLECTION_HANDLES = {
  men: ["mens", "mens-clothing", "all-mens"],
  women: ["womens", "womens-clothing", "all-womens"],
} as const;

async function fetchProducts(
  gender: "men" | "women",
  limit: number
): Promise<ShopifyProduct[]> {
  const handles = COLLECTION_HANDLES[gender];
  let workingHandle: string | null = null;

  // Find a working collection handle
  for (const handle of handles) {
    const url = `https://www.gymshark.com/collections/${handle}/products.json?limit=1`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as ShopifyCollectionResponse;
        if (data.products && data.products.length > 0) {
          workingHandle = handle;
          console.log(`  ✓ Using collection handle: ${handle}`);
          break;
        }
      }
    } catch {
      // try next handle
    }
  }

  if (!workingHandle) {
    throw new Error(
      `No working collection handle found for ${gender}. Tried: ${handles.join(", ")}`
    );
  }

  const products: ShopifyProduct[] = [];
  let page = 1;
  const pageSize = 250; // Shopify max

  while (products.length < limit) {
    const url = `https://www.gymshark.com/collections/${workingHandle}/products.json?limit=${pageSize}&page=${page}`;
    console.log(`  Fetching page ${page}...`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status} for ${url}`);

    const data = (await res.json()) as ShopifyCollectionResponse;
    if (!data.products || data.products.length === 0) break;

    products.push(...data.products);
    if (data.products.length < pageSize) break; // last page
    page++;
  }

  return products.slice(0, limit);
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/scrape-gymshark.ts
git commit -m "feat: add Shopify collection fetcher"
```

---

## Task 5: Write Image Downloader

**Files:**
- Modify: `scripts/scrape-gymshark.ts` (append after fetcher)

- [ ] **Step 1: Append the image downloader**

Append to `scripts/scrape-gymshark.ts`:

```typescript
// ─── Image Downloader ────────────────────────────────────────────────────────

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CONCURRENCY = 5;

async function downloadImage(
  remoteUrl: string,
  localPath: string
): Promise<string> {
  // Skip if already downloaded
  if (fs.existsSync(localPath)) return localPath;

  try {
    const res = await fetch(remoteUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    ensureDir(path.dirname(localPath));
    fs.writeFileSync(localPath, buffer);
    return localPath;
  } catch (err) {
    console.warn(`    ⚠ Failed to download ${remoteUrl}: ${(err as Error).message}`);
    return "";
  }
}

async function downloadBatch(
  tasks: Array<{ remoteUrl: string; localPath: string }>
): Promise<void> {
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const chunk = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map((t) => downloadImage(t.remoteUrl, t.localPath)));
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/scrape-gymshark.ts
git commit -m "feat: add image downloader with concurrency"
```

---

## Task 6: Write Data Mapper

**Files:**
- Modify: `scripts/scrape-gymshark.ts` (append after downloader)

- [ ] **Step 1: Append the data mapper**

Append to `scripts/scrape-gymshark.ts`:

```typescript
// ─── Data Mapper ─────────────────────────────────────────────────────────────

function extractColors(
  product: ShopifyProduct,
  productSlug: string
): Array<{ colorName: string; imageUrls: string[]; localPaths: string[] }> {
  const colorMap = new Map<string, number[]>();

  // Group variant image IDs by color (option1)
  for (const variant of product.variants) {
    const color = variant.option1 || "Default";
    if (!colorMap.has(color)) colorMap.set(color, []);
    if (variant.featured_image) {
      const ids = colorMap.get(color)!;
      if (!ids.includes(variant.featured_image.id)) {
        ids.push(variant.featured_image.id);
      }
    }
  }

  const results: Array<{
    colorName: string;
    imageUrls: string[];
    localPaths: string[];
  }> = [];

  let colorIdx = 0;
  for (const [colorName, variantImageIds] of colorMap.entries()) {
    const colorSlug = slugify(colorName);

    // Find images for this color
    let colorImages = product.images.filter((img) =>
      variantImageIds.some((id) => img.variant_ids.includes(id))
    );

    // If no variant-specific images found, use the first 2 product images for first color
    if (colorImages.length === 0 && colorIdx === 0) {
      colorImages = product.images.slice(0, 2);
    }

    const imageUrls = colorImages.slice(0, 3).map((img) => {
      // Remove Shopify CDN query params, ensure .jpg
      return img.src.split("?")[0];
    });

    const localPaths = imageUrls.map((_, n) => {
      const relativePath = `images/products/${productSlug}/${colorSlug}-${n + 1}.jpg`;
      return path.join(PUBLIC_DIR, relativePath);
    });

    results.push({ colorName, imageUrls, localPaths });
    colorIdx++;
  }

  return results;
}

function extractSizes(product: ShopifyProduct): string[] {
  const sizeSet = new Set<string>();
  for (const variant of product.variants) {
    const size = variant.option2;
    if (size && size !== "Default Title") sizeSet.add(size);
  }
  return Array.from(sizeSet);
}

function mapProduct(
  shopifyProduct: ShopifyProduct,
  gender: "men" | "women",
  index: number,
  colorData: Array<{ colorName: string; localPaths: string[] }>
): MockProduct {
  const sizes = extractSizes(shopifyProduct);
  const stock: Record<string, number> = {};
  for (const size of sizes) stock[size] = 20;
  // If no sizes found, add a default
  if (sizes.length === 0) {
    sizes.push("S", "M", "L", "XL");
    for (const s of sizes) stock[s] = 20;
  }

  const firstVariant = shopifyProduct.variants[0];
  const price = parseFloat(firstVariant?.price ?? "0");
  const compareAt = firstVariant?.compare_at_price
    ? parseFloat(firstVariant.compare_at_price)
    : null;
  const hasDiscount = compareAt !== null && compareAt > price;

  const categorySlug = shopifyProduct.product_type
    ? slugify(shopifyProduct.product_type)
    : "other";

  const colors: MockProductColor[] = colorData.map(({ colorName, localPaths }) => ({
    name: colorName,
    hex: colorToHex(colorName),
    images: localPaths.map((lp) => {
      // Convert absolute local path back to public URL
      const rel = path.relative(PUBLIC_DIR, lp).replace(/\\/g, "/");
      return `/${rel}`;
    }),
  }));

  return {
    id: `prod_gs_${index.toString().padStart(3, "0")}`,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    category: categorySlug,
    gender,
    price,
    originalPrice: hasDiscount ? compareAt : null,
    badge: hasDiscount ? "Sale" : null,
    description: stripHtml(shopifyProduct.body_html) || shopifyProduct.title,
    fabric: null,
    care: null,
    colors,
    sizes,
    stock,
    isPublished: true,
    isFeatured: false,
    isNewArrival: false,
    createdAt: shopifyProduct.published_at
      ? shopifyProduct.published_at.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  };
}

function buildCategories(products: MockProduct[]): MockCategory[] {
  // Group products by category slug
  const catMap = new Map<string, { name: string; genders: Set<string> }>();

  for (const p of products) {
    if (!catMap.has(p.category)) {
      // Reconstruct display name from slug
      const name = p.category
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      catMap.set(p.category, { name, genders: new Set() });
    }
    catMap.get(p.category)!.genders.add(p.gender);
  }

  const categories: MockCategory[] = [];
  let idx = 1;
  for (const [slug, { name, genders }] of catMap.entries()) {
    const gender: "men" | "women" | "all" =
      genders.has("men") && genders.has("women")
        ? "all"
        : genders.has("men")
        ? "men"
        : "women";

    categories.push({
      id: `cat_gs_${idx.toString().padStart(3, "0")}`,
      name,
      slug,
      gender,
      image: `/images/categories/${slug}.jpg`,
    });
    idx++;
  }

  return categories;
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/scrape-gymshark.ts
git commit -m "feat: add data mapper for Shopify → MockProduct"
```

---

## Task 7: Write main() and Wire Everything Together

**Files:**
- Modify: `scripts/scrape-gymshark.ts` (append at end)

- [ ] **Step 1: Append main function**

Append to `scripts/scrape-gymshark.ts`:

```typescript
// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🕷️  Gymshark scraper starting...\n");

  const LIMIT = 100;

  // 1. Fetch from Shopify API
  console.log("📦 Fetching men's products...");
  const menShopify = await fetchProducts("men", LIMIT);
  console.log(`  ✓ Got ${menShopify.length} men's products\n`);

  console.log("📦 Fetching women's products...");
  const womenShopify = await fetchProducts("women", LIMIT);
  console.log(`  ✓ Got ${womenShopify.length} women's products\n`);

  // 2. Extract color/image data and build download tasks
  console.log("🖼️  Preparing image downloads...");
  const downloadTasks: Array<{ remoteUrl: string; localPath: string }> = [];

  type WithColorData = {
    shopifyProduct: ShopifyProduct;
    gender: "men" | "women";
    colorData: Array<{ colorName: string; imageUrls: string[]; localPaths: string[] }>;
  };

  const allWithColorData: WithColorData[] = [];

  const sources: Array<{ products: ShopifyProduct[]; gender: "men" | "women" }> = [
    { products: menShopify, gender: "men" },
    { products: womenShopify, gender: "women" },
  ];

  for (const { products: shopifyProducts, gender } of sources) {
    for (const sp of shopifyProducts) {
      const colorData = extractColors(sp, sp.handle);
      allWithColorData.push({ shopifyProduct: sp, gender, colorData });

      for (const { imageUrls, localPaths } of colorData) {
        for (let i = 0; i < imageUrls.length; i++) {
          if (imageUrls[i]) {
            downloadTasks.push({ remoteUrl: imageUrls[i], localPath: localPaths[i] });
          }
        }
      }
    }
  }

  console.log(`  Downloading ${downloadTasks.length} images (${CONCURRENCY} concurrent)...`);
  await downloadBatch(downloadTasks);
  console.log("  ✓ Images downloaded\n");

  // 3. Map to MockProduct shape (dedup by slug — Gymshark may show same product in multiple collections)
  console.log("🔄 Mapping products...");
  const allMockProducts: MockProduct[] = [];
  const seenSlugs = new Set<string>();
  let productIdx = 1;

  for (const { shopifyProduct, gender, colorData } of allWithColorData) {
    if (seenSlugs.has(shopifyProduct.handle)) continue;
    seenSlugs.add(shopifyProduct.handle);
    const mapped = mapProduct(shopifyProduct, gender, productIdx, colorData);
    allMockProducts.push(mapped);
    productIdx++;
  }

  console.log(`  ✓ Mapped ${allMockProducts.length} products\n`);

  // 4. Build categories
  const categories = buildCategories(allMockProducts);
  console.log(`📂 Extracted ${categories.length} categories\n`);

  // 5. Write JSON files
  const dataDir = path.join(process.cwd(), "data");
  ensureDir(dataDir);

  fs.writeFileSync(
    path.join(dataDir, "products.json"),
    JSON.stringify(allMockProducts, null, 2)
  );
  fs.writeFileSync(
    path.join(dataDir, "categories.json"),
    JSON.stringify(categories, null, 2)
  );
  console.log("✅ Wrote data/products.json and data/categories.json\n");

  // 6. Run seed
  console.log("🌱 Running pnpm db:seed...\n");
  execSync("pnpm db:seed", { stdio: "inherit" });

  console.log("\n🎉 Done! Gymshark data loaded into DB.");
}

main().catch((err) => {
  console.error("❌ Scraper failed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Commit**

```bash
git add scripts/scrape-gymshark.ts
git commit -m "feat: add scraper main() and orchestration"
```

---

## Task 8: Run the Scraper

**Files:**
- Output: `data/products.json`, `data/categories.json`, `public/images/products/**`

- [ ] **Step 1: Run the scraper**

```bash
pnpm db:scrape
```

Expected output:
```
🕷️  Gymshark scraper starting...

📦 Fetching men's products...
  ✓ Using collection handle: mens
  Fetching page 1...
  ✓ Got 100 men's products

📦 Fetching women's products...
  ✓ Using collection handle: womens
  ...
  ✓ Got 100 women's products

🖼️  Preparing image downloads...
  Downloading NNN images (5 concurrent)...
  ✓ Images downloaded

🔄 Mapping products...
  ✓ Mapped 200 products

📂 Extracted N categories

✅ Wrote data/products.json and data/categories.json

🌱 Running pnpm db:seed...

🌱 Starting seed...
🗑️  Clearing existing data...
✓ Data cleared
📦 Seeding N categories...
📦 Seeding 200 products with variants...
👤 Seeding admin users...
✅ Seed completed successfully!

🎉 Done! Gymshark data loaded into DB.
```

- [ ] **Step 2: If API blocked (403/429 response)**

If the scraper throws `API error 403` or similar, it means Gymshark blocks the Shopify public API. Fall back to manual: check which collection URL works in a browser, then update `COLLECTION_HANDLES` in the script with the correct handle. Try also adding a User-Agent header to the fetch call:

In `fetchProducts()`, change the fetch calls to:
```typescript
const res = await fetch(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
  },
});
```

- [ ] **Step 3: Verify JSON output**

```bash
node -e "const p = require('./data/products.json'); console.log('Products:', p.length); console.log('Sample:', JSON.stringify(p[0], null, 2).slice(0, 600))"
```

Expected: 200 products, first product has `name`, `slug`, `colors` with `images` arrays, `sizes`, `stock`.

```bash
node -e "const c = require('./data/categories.json'); console.log('Categories:', c.length, c.map(x => x.name))"
```

Expected: list of Gymshark category names (Leggings, Shorts, T-Shirts, etc.)

- [ ] **Step 4: Verify images downloaded**

```bash
ls public/images/products/ | head -20
```

Expected: directories named after Gymshark product slugs.

- [ ] **Step 5: Commit generated files**

```bash
git add data/products.json data/categories.json
git commit -m "chore: add gymshark product data (200 products)"
```

Note: Do NOT commit `public/images/products/` to git — too large. Add to `.gitignore` if needed.

---

## Task 9: Verify Database

**Files:**
- No code changes — verification only

- [ ] **Step 1: Open Prisma Studio and verify**

```bash
pnpm db:studio
```

Open browser at `http://localhost:5555`. Check:
- `Category` table: N rows with Gymshark categories
- `Product` table: 200 rows, mix of gender MEN and WOMEN
- `ProductColor` table: multiple rows per product
- `ProductImage` table: images with `/images/products/...` URLs
- `ProductStock` table: qty 20 per color×size
- `AdminUser` table: 2 rows (admin@griple.com + staff@griple.com) preserved

- [ ] **Step 2: Start dev server and visually verify**

```bash
pnpm dev
```

Open `http://localhost:3000`. Check:
- Men's page shows products with images
- Women's page shows products with images
- Product detail pages load correctly

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: seed DB with real Gymshark product data"
```

---

## Troubleshooting

### "Category not found for product" in seed output

Means a product's `category` slug doesn't match any category slug in `categories.json`. The `buildCategories()` function derives categories from actual product data, so this shouldn't happen. If it does, check: does `mapProduct()` use the same `slugify()` output as `buildCategories()`? Both use `p.category` which comes from `slugify(product_type)`.

### Images not showing in browser

Check that `url` in `ProductImage` matches an actual file in `public/`. The path format is `/images/products/{slug}/{color}-{n}.jpg`. If the image download failed (file doesn't exist), the `<img>` will 404. Check the download warnings in scraper output.

### Shopify API returns empty products array

The collection handle might be wrong or paginated differently. Add debug logging:
```typescript
console.log("Response status:", res.status);
console.log("Product count:", data.products?.length);
```
Then try the URL directly in browser to see the real response.

### Duplicate slug error in DB seed

Two Gymshark products with the same handle. The seed has no dedup logic. Fix: in `main()`, before writing JSON, dedup by slug:
```typescript
const seen = new Set<string>();
const deduped = allMockProducts.filter(p => {
  if (seen.has(p.slug)) return false;
  seen.add(p.slug);
  return true;
});
```
Then write `deduped` instead of `allMockProducts`.
