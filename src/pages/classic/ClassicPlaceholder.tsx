import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ClassicNewsletter from '@/components/classic/ClassicNewsletter';

interface Props {
  kind: 'collection' | 'product';
}

function humanizeSlug(slug?: string) {
  if (!slug) return '';
  return slug
    .split('-')
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

const ClassicPlaceholder = ({ kind }: Props) => {
  const { slug } = useParams();
  const heading = kind === 'collection' ? humanizeSlug(slug) || 'Collection' : 'Coming Soon';
  const title = kind === 'collection' ? `${heading} — Classic` : `${heading} — Classic`;

  return (
    <Layout>
      <SEO
        title={title}
        description="Part of the upcoming Mancini Milano Classic collection. Refined Italian essentials, launching soon."
        noindex
      />
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-24 lg:py-32">
        <div className="max-w-2xl w-full text-center">
          <p className="font-classic text-foreground font-light tracking-[0.3em] text-xl md:text-2xl mb-8">
            MANCINI MILANO
          </p>
          <span aria-hidden className="block w-16 h-px bg-classic-gold mx-auto mb-10" />
          <h1 className="font-classic font-light text-foreground text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {heading}
          </h1>
          <p className="text-base text-muted-foreground mb-12 max-w-md mx-auto">
            This piece is part of an upcoming collection.
          </p>
          <ClassicNewsletter className="mb-14" />
          <Link
            to="/classic"
            className="inline-block text-[11px] uppercase tracking-[0.25em] text-muted-foreground hover:text-classic-gold transition-colors"
          >
            ← Back to Classic
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ClassicPlaceholder;
