import { useWorld, type World } from '@/contexts/WorldContext';

const labels: Record<World, string> = {
  streetwear: 'Streetwear',
  classic: 'Classic',
};

const WorldSwitch = () => {
  const { currentWorld, switchWorld } = useWorld();

  // Hidden on splash & world-agnostic pages (cart, checkout, account, login, etc.)
  if (!currentWorld) return null;

  const worlds: World[] = ['streetwear', 'classic'];

  return (
    <div className="w-full bg-secondary border-b border-border">
      <div className="max-w-site mx-auto flex items-center justify-center px-4 py-2">
        <div
          role="group"
          aria-label="Switch between worlds"
          className="inline-flex items-stretch border border-border"
        >
          {worlds.map((w) => {
            const active = w === currentWorld;
            return (
              <button
                key={w}
                type="button"
                onClick={() => {
                  if (!active) switchWorld();
                }}
                aria-pressed={active}
                className={[
                  'px-5 sm:px-6 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase',
                  'transition-colors duration-200 ease-out',
                  active
                    ? 'bg-accent text-foreground'
                    : 'bg-transparent text-muted-foreground hover:text-foreground',
                ].join(' ')}
                style={{ letterSpacing: '0.15em' }}
              >
                {labels[w]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldSwitch;
