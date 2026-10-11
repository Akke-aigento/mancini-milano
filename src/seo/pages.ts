// Eén bron voor de statische <head> per pagina. Gebruikt door seo-pages-plugin.ts, die bij de
// build per route een eigen route/index.html schrijft met titel, beschrijving, canonical en og.
// Zo ziet een crawler of deelplatform zonder JavaScript per pagina juiste gegevens; na het laden
// neemt <SEO> (react-helmet-async) het over. Titels volgen wat <SEO> op de pagina zelf zet.

export const SITE_URL = "https://mancinimilano.com";

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "product";
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
};

const T = (t: string) => (t.includes("Mancini Milano") ? t : `${t} — Mancini Milano`);

export const PAGES: PageMeta[] = [
  {
    path: "/streetwear",
    title: "Mancini Milano — Luxury Streetwear from Milan",
    description:
      "Luxury streetwear inspired by Italian craftsmanship. Premium hoodies, tracksuits, t-shirts and jackets in exclusive limited drops.",
    changefreq: "daily",
    priority: 1,
  },
  {
    path: "/classic",
    title: T("Classic — Refined Italian Essentials"),
    description:
      "Mancini Milano Classic. Refined essentials crafted in Italy. Timeless design, premium materials, and uncompromising craftsmanship.",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/about",
    title: T("About"),
    description:
      "The story behind Mancini Milano. Italian craftsmanship, Milanese heritage, and the pursuit of uncompromising luxury streetwear design.",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/contact",
    title: T("Contact"),
    description: "Get in touch with Mancini Milano. For wholesale inquiries, press, or customer support.",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/faq",
    title: T("FAQ"),
    description: "Frequently asked questions about Mancini Milano: shipping, returns, sizing, and orders.",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/size-guide",
    title: T("Size Guide"),
    description: "Find your perfect fit. Detailed measurements for all Mancini Milano luxury streetwear pieces.",
    changefreq: "monthly",
    priority: 0.5,
  },
  {
    path: "/privacy-policy",
    title: T("Privacy Policy"),
    description: "How Mancini Milano handles your personal data in accordance with GDPR.",
    changefreq: "yearly",
    priority: 0.3,
  },
];

/** Streetwear-collecties die in de sitemap staan; titel komt bij de build uit SellQo. */
export const COLLECTIONS = [
  "men",
  "women",
  "jackets",
  "hoodies",
  "t-shirts",
  "pants",
  "tracksuits",
  "bags",
  "accessories",
  "fragrances",
];

export const collectionMeta = (slug: string, name: string): PageMeta => ({
  path: `/streetwear/collections/${slug}`,
  title: T(name),
  description: `Shop ${name} at Mancini Milano. Premium Italian luxury streetwear.`,
  changefreq: "daily",
  priority: 0.9,
});

/** HTML → platte tekst van max. `max` tekens, afgekapt op een woordgrens. */
export function plainExcerpt(html: string | null | undefined, max = 155): string {
  const text = (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\u{FE0F}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 60)).replace(/[\s,;:–—-]+$/, "")}…`;
}

export const productTitle = T;
