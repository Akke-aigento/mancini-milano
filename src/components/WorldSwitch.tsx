import { useWorld, type World } from '@/contexts/WorldContext';
import { TieIcon, SneakerIcon } from '@/components/icons/WorldIcons';

const labels: Record<World, string> = {
  streetwear: 'Streetwear',
  classic: 'Classic',
};

const WorldIcon = ({ world, size }: { world: World; size: number }) =>
  world === 'classic' ? <TieIcon size={size} /> : <SneakerIcon size={size} />;

type Variant = 'desktop' | 'mobile' | 'full';

interface WorldSwitchProps {
  variant?: Variant;
  className?: string;
  onSwitch?: () => void;
}

const WorldSwitch = ({ variant = 'desktop', className = '', onSwitch }: WorldSwitchProps) => {
  const { currentWorld, switchWorld } = useWorld();

  // Hidden on splash & world-agnostic pages (cart, checkout, account, login, etc.)
  if (!currentWorld) return null;

  const worlds: World[] = ['streetwear', 'classic'];
  const isClassic = currentWorld === 'classic';

  const sizeClasses =
    variant === 'mobile'
      ? 'h-7 text-[10px]'
      : variant === 'full'
        ? 'h-11 text-[11px] w-full'
        : 'h-9 text-[10px]';

  const segmentPadding =
    variant === 'mobile'
      ? 'px-3.5'
      : variant === 'full'
        ? 'flex-1 px-6 gap-2'
        : 'px-3.5 gap-2';

  const iconSize = variant === 'mobile' ? 14 : variant === 'full' ? 16 : 14;

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
            {variant !== 'mobile' && <span>{labels[w]}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default WorldSwitch;
