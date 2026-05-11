import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── Gymshark hit shape (from __NEXT_DATA__ ssrQuery.hits) ───────────────────

interface GymsharkSize {
  id: number;
  inStock: boolean;
  inventoryQuantity: number;
  price: number;
  size: string;
  sku: string;
}

interface GymsharkMedia {
  src: string;
  alt: string | null;
  id: number;
}

interface GymsharkHit {
  id: number;
  title: string;
  handle: string;
  type: string;
  gender: string[];
  price: number;
  compareAtPrice: number | null;
  discountPercentage: number;
  colour: string;
  canonicalColour: string;
  availableSizes: GymsharkSize[];
  featuredMedia: GymsharkMedia | null;
  media: GymsharkMedia[];
  inStock: boolean;
  labels: string[];
}

interface GymsharkSSRQuery {
  hits: GymsharkHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}

interface GymsharkPageProps {
  ssrQuery: GymsharkSSRQuery;
}

interface NextDataResponse {
  pageProps: GymsharkPageProps;
}

// ─── MockData types (match prisma/seed.ts expectations) ──────────────────────

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

// ─── Utilities ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const COLOR_KEYWORDS: Array<[string[], string]> = [
  [["black", "onyx", "jet", "noir", "carbon", "graphite", "core black"], "#111111"],
  [["white", "chalk", "ivory", "snow", "pearl", "off white", "offwhite", "bright white"], "#F5F5F0"],
  [["cream", "ecru", "oatmeal"], "#F5EDD6"],
  [["grey", "gray", "silver", "ash", "smoke", "slate", "charcoal", "marl", "pebble"], "#9E9E9E"],
  [["navy", "naval", "midnight", "dark blue", "indigo", "core navy"], "#1B2A4A"],
  [["blue", "cobalt", "sky", "azure", "teal", "aqua", "cyan", "sapphire", "storm blue", "heritage blue"], "#1565C0"],
  [["green", "sage", "mint", "olive", "khaki", "forest", "moss", "camo", "army", "jungle", "core green"], "#4CAF50"],
  [["pink", "rose", "blush", "salmon", "coral", "mauve", "flamingo", "dusky", "light pink", "hot pink"], "#F48FB1"],
  [["red", "cherry", "crimson", "scarlet", "brick", "wine", "burgundy", "maroon", "raspberry"], "#C62828"],
  [["orange", "amber", "rust", "copper", "terracotta", "burnt", "clay"], "#E65100"],
  [["yellow", "sunshine", "mustard", "gold", "lemon", "citrus", "butter"], "#F9A825"],
  [["purple", "lavender", "violet", "plum", "lilac", "heather", "orchid"], "#7B1FA2"],
  [["brown", "caramel", "tan", "mocha", "chocolate", "taupe", "cocoa"], "#795548"],
  [["beige", "nude", "stone", "sand", "natural"], "#F5F0E8"],
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

// ─── Gymshark Next.js Data API Fetcher ───────────────────────────────────────

const BASE_URL = "https://www.gymshark.com";

async function getBuildId(): Promise<string> {
  console.log("  Fetching build ID...");
  const res = await fetch(`${BASE_URL}/collections/last-chance/mens`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "text/html",
    },
  });

  if (!res.ok) throw new Error(`Failed to get build ID: HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/"buildId"\s*:\s*"([^"]+)"/);
  if (!m) throw new Error("Could not find buildId in Gymshark page");
  console.log(`  ✓ Build ID: ${m[1]}`);
  return m[1];
}

async function fetchPage(
  buildId: string,
  gender: "mens" | "womens",
  page: number
): Promise<GymsharkSSRQuery> {
  const url = `${BASE_URL}/_next/data/${buildId}/collections/last-chance/${gender}.json?collectionSlug=last-chance&genderSlug=${gender}&page=${page}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept": "application/json",
    },
  });

  if (!res.ok) throw new Error(`API error ${res.status} for page ${page}`);

  const data = (await res.json()) as NextDataResponse;
  return data.pageProps.ssrQuery;
}

async function fetchAllHits(
  buildId: string,
  gender: "mens" | "womens"
): Promise<GymsharkHit[]> {
  // Fetch page 0 first to get total pages
  const firstPage = await fetchPage(buildId, gender, 0);
  const allHits: GymsharkHit[] = [...firstPage.hits];
  const totalPages = firstPage.nbPages;

  console.log(`  Total pages: ${totalPages}, nbHits: ${firstPage.nbHits}`);

  // Fetch remaining pages with small delay to be polite
  for (let page = 1; page < totalPages; page++) {
    console.log(`  Fetching page ${page + 1}/${totalPages}...`);
    await new Promise((r) => setTimeout(r, 300)); // 300ms delay between requests
    const pageData = await fetchPage(buildId, gender, page);
    allHits.push(...pageData.hits);
  }

  return allHits;
}

// ─── Image Downloader ─────────────────────────────────────────────────────────

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CONCURRENCY = 5;

async function downloadImage(remoteUrl: string, localPath: string): Promise<void> {
  if (fs.existsSync(localPath)) return; // skip if already downloaded

  try {
    const res = await fetch(remoteUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    ensureDir(path.dirname(localPath));
    fs.writeFileSync(localPath, buffer);
  } catch (err) {
    console.warn(`    ⚠ Failed to download ${remoteUrl}: ${(err as Error).message}`);
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

// ─── Data Mapper ──────────────────────────────────────────────────────────────

interface ProductGroup {
  productId: number;
  title: string;
  type: string;
  gender: "men" | "women";
  hits: GymsharkHit[];
}

function groupHitsByProduct(
  hits: GymsharkHit[],
  gender: "men" | "women"
): ProductGroup[] {
  const map = new Map<number, ProductGroup>();

  for (const hit of hits) {
    if (!map.has(hit.id)) {
      map.set(hit.id, {
        productId: hit.id,
        title: hit.title,
        type: hit.type || "Other",
        gender,
        hits: [],
      });
    }
    map.get(hit.id)!.hits.push(hit);
  }

  return Array.from(map.values());
}

interface ImageTask {
  remoteUrl: string;
  localPath: string;
  publicUrl: string;
}

function buildImageTasks(
  productSlug: string,
  colorSlug: string,
  mediaItems: GymsharkMedia[]
): ImageTask[] {
  return mediaItems.slice(0, 3).map((media, n) => {
    // Strip Shopify CDN params and ensure .jpg extension
    const remoteUrl = media.src.split("?")[0];
    const relativePath = `images/products/${productSlug}/${colorSlug}-${n + 1}.jpg`;
    return {
      remoteUrl,
      localPath: path.join(PUBLIC_DIR, relativePath),
      publicUrl: `/${relativePath}`,
    };
  });
}

function mapProductGroup(
  group: ProductGroup,
  index: number,
  slugsSeen: Set<string>
): { product: MockProduct; imageTasks: ImageTask[] } {
  const firstHit = group.hits[0];

  // Price from first hit
  const price = firstHit.price;
  const compareAt = firstHit.compareAtPrice;
  const hasDiscount = compareAt !== null && compareAt > price;

  // Category slug from product type
  const categorySlug = slugify(group.type) || "other";

  // Sizes & stock from first hit's availableSizes (product-level, not color-level)
  const sizeOrder = ["xs", "s", "m", "l", "xl", "xxl", "one size", "1 size"];
  const sizesRaw = firstHit.availableSizes
    .sort((a, b) => {
      const ia = sizeOrder.indexOf(a.size.toLowerCase());
      const ib = sizeOrder.indexOf(b.size.toLowerCase());
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  const sizes = sizesRaw.map((s) => s.size.toUpperCase());
  const stock: Record<string, number> = {};
  for (const s of sizesRaw) {
    stock[s.size.toUpperCase()] = s.inventoryQuantity > 0 ? s.inventoryQuantity : 0;
  }

  if (sizes.length === 0) {
    for (const s of ["S", "M", "L", "XL"]) { sizes.push(s); stock[s] = 20; }
  }

  // Unique slug from title
  let baseSlug = slugify(group.title);
  let slug = baseSlug;
  let suffix = 2;
  while (slugsSeen.has(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }
  slugsSeen.add(slug);

  // Build colors + image tasks
  const colors: MockProductColor[] = [];
  const imageTasks: ImageTask[] = [];
  const colorsSeen = new Set<string>();

  for (const hit of group.hits) {
    if (colorsSeen.has(hit.colour)) continue;
    colorsSeen.add(hit.colour);

    const colorSlug = slugify(hit.colour);

    // Get images: prefer hit.media, fallback to featuredMedia
    const mediaItems: GymsharkMedia[] =
      hit.media && hit.media.length > 0
        ? hit.media
        : hit.featuredMedia
        ? [hit.featuredMedia]
        : [];

    const tasks = buildImageTasks(slug, colorSlug, mediaItems);
    imageTasks.push(...tasks);

    colors.push({
      name: hit.colour,
      hex: colorToHex(hit.colour),
      images: tasks.map((t) => t.publicUrl),
    });
  }

  const description = `${group.title} — premium gymwear from Gymshark. Designed for performance and style.`;

  return {
    product: {
      id: `prod_gs_${index.toString().padStart(3, "0")}`,
      name: group.title,
      slug,
      category: categorySlug,
      gender: group.gender,
      price,
      originalPrice: hasDiscount ? compareAt : null,
      badge: hasDiscount ? "Sale" : null,
      description,
      fabric: null,
      care: null,
      colors,
      sizes,
      stock,
      isPublished: true,
      isFeatured: false,
      isNewArrival: firstHit.labels?.includes("new") ?? false,
      createdAt: new Date().toISOString().slice(0, 10),
    },
    imageTasks,
  };
}

function buildCategories(products: MockProduct[]): MockCategory[] {
  const catMap = new Map<string, { name: string; genders: Set<string> }>();

  for (const p of products) {
    if (!catMap.has(p.category)) {
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🕷️  Gymshark scraper starting...\n");

  const LIMIT = 100;

  // 1. Get build ID
  const buildId = await getBuildId();

  // 2. Fetch all hits for men and women
  console.log("\n📦 Fetching men's products (last-chance/mens)...");
  const menHits = await fetchAllHits(buildId, "mens");
  console.log(`  ✓ Total men's color hits: ${menHits.length}`);

  console.log("\n📦 Fetching women's products (last-chance/womens)...");
  const womenHits = await fetchAllHits(buildId, "womens");
  console.log(`  ✓ Total women's color hits: ${womenHits.length}`);

  // 3. Group by product ID → unique products
  const menGroups = groupHitsByProduct(menHits, "men").slice(0, LIMIT);
  const womenGroups = groupHitsByProduct(womenHits, "women").slice(0, LIMIT);

  console.log(`\n  Unique men's products: ${menGroups.length}`);
  console.log(`  Unique women's products: ${womenGroups.length}`);

  // 4. Map to MockProduct + collect image tasks
  console.log("\n🔄 Mapping products...");
  const slugsSeen = new Set<string>();
  const allProducts: MockProduct[] = [];
  const allImageTasks: ImageTask[] = [];
  let idx = 1;

  for (const group of [...menGroups, ...womenGroups]) {
    const { product, imageTasks } = mapProductGroup(group, idx++, slugsSeen);
    allProducts.push(product);
    allImageTasks.push(...imageTasks);
  }

  console.log(`  ✓ Mapped ${allProducts.length} products`);
  console.log(`  Total images to download: ${allImageTasks.length}`);

  // 5. Download images
  console.log(`\n🖼️  Downloading images (${CONCURRENCY} concurrent)...`);
  await downloadBatch(allImageTasks);
  console.log("  ✓ Images downloaded");

  // 6. Build categories
  const categories = buildCategories(allProducts);
  console.log(`\n📂 Extracted ${categories.length} categories:`);
  for (const c of categories) {
    console.log(`  - ${c.name} (${c.gender})`);
  }

  // 7. Write JSON files
  const dataDir = path.join(process.cwd(), "data");
  ensureDir(dataDir);

  fs.writeFileSync(
    path.join(dataDir, "products.json"),
    JSON.stringify(allProducts, null, 2)
  );
  fs.writeFileSync(
    path.join(dataDir, "categories.json"),
    JSON.stringify(categories, null, 2)
  );
  console.log("\n✅ Wrote data/products.json and data/categories.json");

  // 8. Run seed
  console.log("\n🌱 Running pnpm db:seed...\n");
  execSync("pnpm db:seed", { stdio: "inherit" });

  console.log("\n🎉 Done! Gymshark data loaded into DB.");
}

main().catch((err) => {
  console.error("❌ Scraper failed:", err);
  process.exit(1);
});
