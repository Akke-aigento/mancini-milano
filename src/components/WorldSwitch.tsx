import { useEffect, useState } from 'react';
import { useWorld, type World } from '@/contexts/WorldContext';
import { Zap, Crown } from 'lucide-react';

const labels: Record<World, string> = {
  streetwear: 'Streetwear',
  classic: 'Classic',
};

const WorldIcon = ({ world, size }: { world: World; size: number }) =>
  world === 'classic'
    ? <Crown size={size} strokeWidth={1.75} aria-hidden="true" />
    : <Zap size={size} strokeWidth={2} fill="currentColor" aria-hidden="true" />;

type Variant = 'desktop' | 'mobile' | 'full';

interface WorldSwitchProps {
  variant?: Variant;
  className?: string;
  onSwitch?: () => void;
}

/* ----------------------------- Mobile: single swap button ----------------------------- */

const HINT_KEY = 'mancini_world_swap_hint_shown';

const MobileSwap = ({ className, onSwitch }: { className: string; onSwitch?: () => void }) => {
  const { currentWorld, switchWorld } = useWorld();
  const [showHint, setShowHint] = useState(false);

  // Flash hint once per session so users discover the swap action
  useEffect(() => {
    if (!currentWorld) return;
    try {
      if (sessionStorage.getItem(HINT_KEY)) return;
      sessionStorage.setItem(HINT_KEY, '1');
    } catch {
      return;
    }
    const showTimer = setTimeout(() => setShowHint(true), 600);
    const hideTimer = setTimeout(() => setShowHint(false), 3000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [currentWorld]);

  if (!currentWorld) return null;

  const target: World = currentWorld === 'classic' ? 'streetwear' : 'classic';
  const isClassic = currentWorld === 'classic';

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          switchWorld();
          onSwitch?.();
          setShowHint(false);
        }}
        aria-label={`Switch to ${labels[target]}`}
        className={[
          'h-9 w-9 flex items-center justify-center',
          'border transition-all duration-200',
          'rounded-full',
          isClassic
            ? 'border-classic-gold/60 text-classic-gold hover:bg-classic-gold hover:text-background'
            : 'border-accent/70 text-accent hover:bg-accent hover:text-foreground',
        ].join(' ')}
      >
        <WorldIcon world={target} size={15} />
      </button>

      {/* Discovery hint — appears once per session */}
      {showHint && (
        <div
          role="tooltip"
          className={[
            'absolute top-full right-0 mt-2 px-3 py-1.5 z-50',
            'text-[10px] uppercase tracking-[0.2em] whitespace-nowrap',
            'bg-background border pointer-events-none',
            'animate-fade-in',
            isClassic ? 'border-classic-gold/60 text-classic-gold' : 'border-accent/70 text-accent',
          ].join(' ')}
        >
          Switch to {labels[target]}
        </div>
      )}
    </div>
  );
};

/* --------------------------------- Main component --------------------------------- */

const WorldSwitch = ({ variant = 'desktop', className = '', onSwitch }: WorldSwitchProps) => {
  const { currentWorld, switchWorld } = useWorld();

  // Hidden on splash & world-agnostic pages (cart, checkout, account, login, etc.)
  if (!currentWorld) return null;

  // Mobile uses a completely different pattern — a single "swap" button
  if (variant === 'mobile') {
    return <MobileSwap className={className} onSwitch={onSwitch} />;
  }

  const worlds: World[] = ['streetwear', 'classic'];
  const isClassic = currentWorld === 'classic';

  const sizeClasses =
    variant === 'full' ? 'h-11 text-[11px] w-full' : 'h-9 text-[10px]';

  const segmentPadding =
    variant === 'full' ? 'flex-1 px-6 gap-2' : 'px-3.5 gap-2';

  const iconSize = variant === 'full' ? 16 : 14;

  return (
    <div
      role="group"
      aria-label="Switch between worlds"
      className={[
        'inline-flex items-stretch border transition-colors',
        isClassic ? 'border-classic-gold/50' : 'border-border',
        sizeClasses,
        variant === 'full' ? 'flex' : '',
        className,
      ].join(' ')}
    >
      {worlds.map((w) => {
        const active = w === currentWorld;
        return (
          <button
            key={w}
            type="button"
            onClick={() => {
              if (!active) {
                switchWorld();
                onSwitch?.();
              }
            }}
            aria-pressed={active}
            aria-label={active ? `${labels[w]} (current)` : `Switch to ${labels[w]}`}
            className={[
              segmentPadding,
              'font-medium uppercase transition-colors duration-200 ease-out flex items-center justify-center',
              active
                ? isClassic
                  ? 'bg-classic-gold text-background'
                  : 'bg-accent text-foreground'
                : isClassic
                  ? 'bg-transparent text-foreground/60 hover:text-classic-gold'
                  : 'bg-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
            style={{ letterSpacing: '0.2em' }}
          >
            <WorldIcon world={w} size={iconSize} />
            <span>{labels[w]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default WorldSwitch;
