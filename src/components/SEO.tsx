import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  jsonLd?: object;
}

const SEO = ({ title, description, image, type = 'website', jsonLd }: SEOProps) => {
  const fullTitle = title
    ? `${title} — Mancini Milano`
    : 'Mancini Milano — Italian Luxury Streetwear';
  const desc = description || 'Premium Italian streetwear. Elevated essentials for those who move with authority.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
