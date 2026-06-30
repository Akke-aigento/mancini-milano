import { Link, useParams } from 'react-router-dom';
import SEO from '@/components/SEO';

const LABELS: Record<string, string> = {
  sport: 'Sport',
  kids: 'Kids',
};

const ComingSoon = () => {
  const { world } = useParams();
  const label = LABELS[world ?? ''] ?? 'Coming Soon';

  return (
    <>
      <SEO
        title={`${label} — Coming Soon | Mancini Milano`}
        description={`The Mancini Milano ${label} collection is launching soon.`}
      />
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-foreground/60 mb-6">
          {label}
        </span>
        <h1 className="font-heading text-foreground text-5xl sm:text-6xl lg:text-7xl leading-none">
          Coming Soon
        </h1>
        <div className="w-12 h-px bg-foreground/70 my-8" />
        <p className="text-foreground/70 max-w-md text-sm sm:text-base">
          We're crafting something special. The {label} collection will be
          available shortly.
        </p>
        <Link
          to="/"
          className="mt-10 inline-block border border-foreground/70 px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default ComingSoon;
