// Vite-plugin (alleen bij `vite build`): schrijft per vaste pagina, per streetwear-collectie en
// per product een eigen route/index.html (+ route.html) met unieke titel, beschrijving,
// canonical en og-tags, plus dist/sitemap.xml mét producten.
//
// Waarom route/index.html: de Lovable-hosting serveert voor /about de map-index; about.html
// alleen bij letterlijk opvragen (gemeten 11-10-2026 op studioakke.com).
//
// Collectienamen en producten komen bij de build uit de sellqo-proxy. Lukt dat niet (geen
// netwerk, time-out), dan bouwt de site verder met de vaste pagina's.
//
// index.html blijft de SPA-terugval voor elke onbekende route en krijgt daarom GEEN canonical:
// anders meldt elke pagina zich bij Google als kopie van de homepage. <SEO> zet de canonical
// na het laden alsnog per pagina.
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import {
  COLLECTIONS,
  PAGES,
  SITE_URL,
  collectionMeta,
  plainExcerpt,
  productTitle,
  type PageMeta,
} from "./src/seo/pages";

const TENANT = "2606c5b9-caf8-4a42-94cd-80e3f3f31988";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html: string, attr: "name" | "property", key: string, value: string): string {
  const re = new RegExp(`<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`, "i");
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

export function applyHead(html: string, page: PageMeta): string {
  const url = `${SITE_URL}${page.path}`;
  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(page.title)}</title>`);
  out = setMeta(out, "name", "description", page.description);
  out = setMeta(out, "property", "og:title", page.title);
  out = setMeta(out, "property", "og:description", page.description);
  out = setMeta(out, "property", "og:type", page.type ?? "website");
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "name", "twitter:title", page.title);
  out = setMeta(out, "name", "twitter:description", page.description);
  if (page.image) {
    out = setMeta(out, "property", "og:image", page.image);
    out = setMeta(out, "name", "twitter:image", page.image);
  }
  return out.replace("</head>", `    <link rel="canonical" href="${url}" />\n  </head>`);
}

export function sitemapXml(pages: PageMeta[], lastmod: string): string {
  const all = [{ path: "/", changefreq: "monthly", priority: 1 } as PageMeta, ...pages];
  const urls = all.map((p) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${p.path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      p.changefreq ? `    <changefreq>${p.changefreq}</changefreq>` : null,
      `    <priority>${(p.priority ?? 0.5).toFixed(1)}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

type ApiProduct = {
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  featured_image?: string | null;
  images?: (string | { url?: string })[];
};
type ApiCategory = { slug?: string; name?: string };

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "X-Tenant-ID": TENANT, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const firstImage = (p: ApiProduct) => {
  if (p.featured_image) return p.featured_image;
  const i = p.images?.[0];
  return typeof i === "string" ? i : i?.url;
};

const titleCase = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");

async function dynamicPages(supabaseUrl: string | undefined): Promise<PageMeta[]> {
  const api = supabaseUrl ? `${supabaseUrl.replace(/\/+$/, "")}/functions/v1/sellqo-proxy` : null;
  const [prod, cats] = api
    ? await Promise.all([
        getJson<{ data?: { products?: ApiProduct[] } }>(`${api}/products?per_page=100`),
        getJson<{ data?: ApiCategory[] | { categories?: ApiCategory[] } }>(`${api}/categories`),
      ])
    : [null, null];

  const catList = Array.isArray(cats?.data) ? cats.data : (cats?.data?.categories ?? []);
  const names = new Map(catList.filter((c) => c.slug && c.name).map((c) => [c.slug!, c.name!]));
  const out: PageMeta[] = COLLECTIONS.map((slug) => collectionMeta(slug, names.get(slug) ?? titleCase(slug)));

  for (const p of prod?.data?.products ?? []) {
    const name = (p.title ?? p.name ?? "").trim();
    if (!p.slug || !name) continue;
    const excerpt = plainExcerpt(p.description);
    out.push({
      path: `/streetwear/products/${p.slug}`,
      title: productTitle(name),
      // Productnaam vooraan: varianten delen vaak dezelfde omschrijving.
      description: excerpt.startsWith(name)
        ? excerpt
        : plainExcerpt(`${name}. ${p.description ?? ""}`) ||
          `${name} — Mancini Milano luxury streetwear from Milan.`,
      image: firstImage(p),
      type: "product",
      changefreq: "weekly",
      priority: 0.8,
    });
  }
  console.log(
    `[seo-pages] ${out.length - COLLECTIONS.length} producten uit SellQo${prod ? "" : " (niet opgehaald)"}`,
  );
  return out;
}

export function seoPages(): Plugin {
  let outDir = "dist";
  let supabaseUrl: string | undefined;
  return {
    name: "mancini-seo-pages",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      supabaseUrl = config.env["VITE_SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
    },
    async closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const base = fs.readFileSync(indexPath, "utf8");
      const pages = [...PAGES, ...(await dynamicPages(supabaseUrl))];
      for (const page of pages) {
        const html = applyHead(base, page);
        for (const file of [
          path.join(outDir, `${page.path.slice(1)}.html`),
          path.join(outDir, page.path.slice(1), "index.html"),
        ]) {
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, html);
        }
      }
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapXml(pages, new Date().toISOString().slice(0, 10)));
    },
  };
}
