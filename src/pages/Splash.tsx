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
        {/* Two halves */}
        <main className="flex-1 flex flex-col lg:flex-row">
          {/* CLASSIC */}
          <Link
            to="/classic"
            className="group relative flex-1 min-h-[50vh] lg:min-h-screen overflow-hidden flex items-center justify-center bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-border/40"
            aria-label="Discover Classic — Mancini Milano luxury"
          >
            <img
              src={splashClassic}
              alt="Mancini Milano Classic — timeless Italian luxury tailoring in black and white"
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[1200ms] ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25 group-hover:from-black/45 transition-all duration-700" />
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
              <span className="text-[10px] lg:text-xs uppercase tracking-[0.4em] text-primary/80 mb-5 lg:mb-7">
                The House of
              </span>
              <h2 className="font-heading text-primary text-5xl lg:text-7xl xl:text-8xl tracking-logo uppercase leading-[0.95] mb-4 lg:mb-6">
                Mancini<br />Milano
              </h2>
              <p className="text-xs lg:text-sm text-foreground/70 tracking-wide uppercase mb-8 lg:mb-12">
                Classic
              </p>
              <span className="inline-block border border-primary text-primary px-8 lg:px-10 py-3 lg:py-4 text-[11px] uppercase tracking-button font-medium group-hover:bg-primary group-hover:text-background transition-colors duration-500">
                Discover Classic
              </span>
            </div>
          </Link>

          {/* STREETWEAR */}
          <Link
            to="/streetwear"
            className="group relative flex-1 min-h-[50vh] lg:min-h-screen overflow-hidden flex items-center justify-center bg-[#0a0a0a]"
            aria-label="Discover Streetwear — Mancini Milano elevated essentials"
          >
            <img
              src={splashStreetwear}
              alt="Mancini Milano Streetwear — elevated essentials with luxury attitude"
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-105 transition-all duration-[1200ms] ease-out"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/65 transition-all duration-700" />
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
              <span className="text-[10px] lg:text-xs uppercase tracking-[0.4em] text-foreground/70 mb-5 lg:mb-7">
                The Movement
              </span>
              <h2 className="font-heading text-foreground text-5xl lg:text-7xl xl:text-8xl tracking-logo uppercase leading-[0.95] mb-4 lg:mb-6">
                Mancini<br />Milano
              </h2>
              <p className="text-xs lg:text-sm text-foreground/70 tracking-wide uppercase mb-8 lg:mb-12">
                Streetwear
              </p>
              <span className="inline-block border border-foreground text-foreground px-8 lg:px-10 py-3 lg:py-4 text-[11px] uppercase tracking-button font-medium group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                Discover Streetwear
              </span>
            </div>
          </Link>
        </main>
      </div>
    </>
  );
};

export default Splash;
