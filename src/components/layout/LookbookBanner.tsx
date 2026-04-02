import lookbookBanner from '@/assets/lookbook-banner.jpg';

const LookbookBanner = () => (
  <div className="relative w-full h-[60px] md:h-[80px] overflow-hidden">
    <img
      src={lookbookBanner}
      alt="Mancini Milano Collection"
      className="w-full h-full object-cover object-top"
    />
    {/* Left vignette */}
    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
    {/* Right vignette */}
    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
  </div>
);

export default LookbookBanner;
