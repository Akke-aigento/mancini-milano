import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type World = 'streetwear' | 'classic';

interface WorldContextValue {
  currentWorld: World | null;
  lastActiveWorld: World | null;
  homeHref: string;
  getOtherWorld: () => World | null;
  isInWorld: (world: World) => boolean;
  switchWorld: () => void;
}

const WorldContext = createContext<WorldContextValue | undefined>(undefined);

function detectWorld(pathname: string): World | null {
  if (pathname === '/streetwear' || pathname.startsWith('/streetwear/')) return 'streetwear';
  if (pathname === '/classic' || pathname.startsWith('/classic/')) return 'classic';
  return null;
}

const storageKey = (world: World) => `lastPath:${world}`;

export const WorldProvider = ({ children }: { children: ReactNode }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const currentWorld = detectWorld(pathname);

  // Reflect current world on <html> for CSS theming
  useEffect(() => {
    document.documentElement.dataset.world = currentWorld ?? '';
  }, [currentWorld]);

  // Remember the last path visited inside each world for switchWorld()
  useEffect(() => {
    if (currentWorld) {
      try {
        sessionStorage.setItem(storageKey(currentWorld), pathname + search);
      } catch {
        /* ignore storage errors */
      }
    }
  }, [currentWorld, pathname, search]);

  const value = useMemo<WorldContextValue>(() => {
    const getOtherWorld = (): World | null => {
      if (currentWorld === 'streetwear') return 'classic';
      if (currentWorld === 'classic') return 'streetwear';
      return null;
    };

    return {
      currentWorld,
      getOtherWorld,
      isInWorld: (world: World) => currentWorld === world,
      switchWorld: () => {
        const other = getOtherWorld();
        if (!other) return;
        let target = `/${other}`;
        try {
          const remembered = sessionStorage.getItem(storageKey(other));
          if (remembered) target = remembered;
        } catch {
          /* ignore */
        }
        navigate(target);
      },
    };
  }, [currentWorld, navigate]);

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
};

export const useWorld = () => {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error('useWorld must be used within WorldProvider');
  return ctx;
};
