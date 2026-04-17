import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  canonical?: string;
  noindex?: boolean;
  jsonLd?: object;
}

const SITE_URL = 'https://mancinimilano.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESC =
  'Mancini Milano crafts luxury streetwear with Italian heritage. Premium fabrics, limited drops, and uncompromising design — born in Milan, worn worldwide.';

const SEO = ({
  title,
  description,
  image,
  type = 'website',
  canonical,
  noindex = false,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title
    ? title.includes('Mancini Milano')
      ? title
      : `${title} — Mancini Milano`
    : 'Mancini Milano — Luxury Streetwear from Milan';
  const desc = description || DEFAULT_DESC;
  const ogImage = image || DEFAULT_IMAGE;
  const fullCanonical =
    canonical ||
    (typeof window !== 'undefined'
      ? `${SITE_URL}${window.location.pathname}`
      : SITE_URL);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullCanonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Mancini Milano" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
