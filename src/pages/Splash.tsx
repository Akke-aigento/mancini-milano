import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import splashClassic from '@/assets/splash-classic.jpg';
import splashStreetwear from '@/assets/splash-streetwear.jpg';

const Splash = () => {
  return (
    <>
      <SEO
        title="Mancini Milano — Two Worlds, One Vision"
        description="Step into the world of Mancini Milano. Choose between Classic — timeless Italian luxury — or Streetwear — elevated essentials with attitude."
        canonical="https://mancinimilano.com/"
      />
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex flex-col">
          {/* STREETWEAR — stacked on all viewports */}
          <Link
            to="/streetwear"
            className="group relative flex-1 min-h-[50vh] overflow-hidden flex bg-[#0a0a0a] border-b border-border/40"
            aria-label="Discover Streetwear — Mancini Milano elevated essentials"
          >
            <img
              src={splashStreetwear}
              alt="Mancini Milano Streetwear — model wearing a Mancini Milano hooded sweatshirt"
              className="absolute inset-0 w-full h-full object-cover object-[50%_15%] lg:object-[50%_10%] opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms] ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/30 group-hover:from-black/35 transition-all duration-700" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            {/* Brand header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center text-center pt-10 lg:pt-14 px-6">
              <h1 className="font-heading text-foreground text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-logo uppercase leading-none">
                Mancini
              </h1>
              <span className="mt-2 text-[10px] lg:text-xs tracking-[0.5em] uppercase text-foreground/85">
                Milano
              </span>
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center text-center px-6 pb-12 lg:pb-16">
              <h2 className="font-heading text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-none">
                Streetwear
              </h2>
              <div className="w-12 h-px bg-foreground/70 mt-6 mb-4" />
              <span className="text-[11px] lg:text-xs uppercase tracking-[0.3em] text-foreground/90 group-hover:text-foreground transition-colors">
                Discover More
              </span>
            </div>
          </Link>

          {/* CLASSIC — bottom on mobile, right on desktop */}
          <Link
            to="/classic"
            className="group relative flex-1 min-h-[50vh] overflow-hidden flex bg-[#0a0a0a]"
            aria-label="Discover Classic — Mancini Milano luxury"
          >
            <img
              src={splashClassic}
              alt="Mancini Milano Classic — model wearing a tailored blazer and polo"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1200ms] ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/35 group-hover:from-black/40 transition-all duration-700" />

            <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center text-center px-6 pb-10 lg:pb-14">
              <h2 className="font-heading text-foreground text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-none">
                Classic
              </h2>
              <div className="w-12 h-px bg-foreground/70 mt-6 mb-4" />
              <span className="text-[11px] lg:text-xs uppercase tracking-[0.3em] text-foreground/90 group-hover:text-foreground transition-colors">
                Discover More
              </span>
            </div>
          </Link>
        </main>
      </div>
    </>
  );
};

export default Splash;
