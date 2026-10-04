import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import logoDoberman from '@/assets/logo-doberman.png';
import { useWorld } from '@/contexts/WorldContext';

const SplashScreen = () => {
  const { currentWorld } = useWorld();
  const isClassic = currentWorld === 'classic';

  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in');

  useEffect(() => {
    const shown = sessionStorage.getItem('splash_shown');
    if (shown) {
      setPhase('done');
      return;
    }
    sessionStorage.setItem('splash_shown', '1');

    const inTimer = setTimeout(() => setPhase((p) => (p === 'in' ? 'hold' : p)), 500);
    const outTimer = setTimeout(() => setPhase((p) => (p === 'hold' ? 'out' : p)), 2500);

    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, []);

  // Fallback: transitionend does not always fire, which would leave the overlay blocking clicks.
  useEffect(() => {
    if (phase !== 'out') return;
    const doneTimer = setTimeout(() => setPhase('done'), 1200);
    return () => clearTimeout(doneTimer);
  }, [phase]);

  const handleClose = () => {
    setPhase(phase === 'in' ? 'done' : 'out');
  };

  const handleTransitionEnd = () => {
    if (phase === 'out') {
      setPhase('done');
    }
  };

  if (phase === 'done') return null;

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-1000 ease-out${phase !== 'hold' ? ' pointer-events-none' : ''}`}
      style={{ opacity: phase === 'in' ? 0 : phase === 'out' ? 0 : 1 }}
    >
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 text-foreground/60 hover:text-foreground transition-colors z-10"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
      {isClassic ? (
        <div
          className="font-classic text-foreground uppercase text-3xl md:text-5xl transition-all duration-1000 ease-out"
          style={{
            letterSpacing: '0.32em',
            transform: phase === 'in' ? 'scale(0.96)' : phase === 'out' ? 'scale(0.98)' : 'scale(1)',
            opacity: phase === 'in' ? 0 : phase === 'out' ? 0 : 1,
          }}
        >
          Mancini Milano
        </div>
      ) : (
        <img
          src={logoDoberman}
          alt="Mancini Milano"
          className="h-32 md:h-48 w-auto transition-all duration-1000 ease-out"
          style={{
            transform: phase === 'in' ? 'scale(0.95)' : phase === 'out' ? 'scale(0.97)' : 'scale(1)',
            opacity: phase === 'in' ? 0 : phase === 'out' ? 0 : 1,
          }}
        />
      )}
    </div>
  );
};

export default SplashScreen;
