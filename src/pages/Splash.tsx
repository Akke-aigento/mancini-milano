import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import splashClassic from '@/assets/splash-classic.jpg';
import splashStreetwear from '@/assets/splash-streetwear.jpg';
import splashSport from '@/assets/splash-sport.jpg';
import splashKids from '@/assets/splash-kids.jpg';

type Tile = {
  to: string;
  label: string;
  img: string;
  alt: string;
  objectPosition?: string;
  comingSoon?: boolean;
};

const TILES: Tile[] = [
  {
    to: '/streetwear',
    label: 'Streetwear',
    img: splashStreetwear,
    alt: 'Mancini Milano Streetwear — model wearing a Mancini Milano hooded sweatshirt',
    objectPosition: '50% 15%',
  },
  {
    to: '/classic',
    label: 'Classic',
    img: splashClassic,
    alt: 'Mancini Milano Classic — model wearing a tailored blazer and polo',
    comingSoon: true,
  },
  {
    to: '/sport',
    label: 'Sport',
    img: splashSport,
    alt: 'Mancini Milano Sport — model wearing a Mancini Milano half-zip running top',
    objectPosition: '50% 20%',
    comingSoon: true,
  },
  {
    to: '/kids',
    label: 'Kids',
    img: splashKids,
    alt: 'Mancini Milano Kids — children wearing Mancini Milano sweatshirts',
    objectPosition: '50% 25%',
    comingSoon: true,
  },
];

const Splash = () => {
  return (
    <>
      <SEO
        title="Mancini Milano — Four Worlds, One Vision"
        description="Step into the world of Mancini Milano. Choose between Streetwear, Classic, Sport or Kids."
        canonical="https://mancinimilano.com/"
      />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Brand header */}
        <header className="relative z-20 flex flex-col items-center text-center pt-8 pb-6 px-6">
          <h1 className="font-heading text-foreground text-3xl sm:text-4xl lg:text-5xl tracking-logo uppercase leading-none">
            Mancini
          </h1>
          <span className="mt-2 text-[10px] lg:text-xs tracking-[0.5em] uppercase text-foreground/85">
            Milano
          </span>
        </header>

        <main className="flex-1 grid grid-cols-2 content-center">
          {TILES.map((tile) => {
            const Wrapper = tile.comingSoon ? 'div' : Link;
            return (
              <Wrapper
                key={tile.to}
                {...(!tile.comingSoon && { to: tile.to })}
                className="group relative overflow-hidden aspect-square sm:aspect-auto sm:min-h-[50vh] bg-[#0a0a0a]"
                aria-label={tile.comingSoon ? undefined : `Discover ${tile.label} — Mancini Milano`}
              >
                <img
                  src={tile.img}
                  alt={tile.alt}
                  style={tile.objectPosition ? { objectPosition: tile.objectPosition } : undefined}
                  className={`absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-[1200ms] ease-out ${tile.comingSoon ? '' : 'group-hover:opacity-100 group-hover:scale-105'}`}
                  loading="eager"
                />
                <div className={`absolute inset-0 bgMT bg-gradient-to-t from-black/70 via-black/20 to-black/30 transition-all duration-700 ${tile.comingSoon ? '' : 'group-hover:from-black/55'}`} />

                <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center text-center px-3 sm:px-6 pb-5 sm:pb-10 lg:pb-14">
                  <h2 className="font-heading text-foreground text-2xl sm:text-5xl lg:text-6xl xl:text-7xl leading-none">
                    {tile.label}
                  </h2>
                  <div className="w-8 sm:w-10 h-px bg-foreground/70 mt-3 sm:mt-5 mb-2 sm:mb-3" />
                  <span className={`text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-foreground/90 transition-colors ${tile.comingSoon ? '' : 'group-hover:text-foreground'}`}>
                    {tile.comingSoon ? 'Coming Soon' : 'Discover More'}
                  </span>
                </div>
              </Wrapper>
            );
          })}
        </main>
      </div>
    </>
  );
};

export default Splash;
