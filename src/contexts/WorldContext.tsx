import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export type World = 'streetwear' | 'classic';

interface WorldContextValue {
  currentWorld: World | null;
  getOtherWorld: () => World | null;
  isInWorld: (world: World) => boolean;
}

const WorldContext = createContext<WorldContextValue | undefined>(undefined);

function detectWorld(pathname: string): World | null {
  if (pathname === '/streetwear' || pathname.startsWith('/streetwear/')) return 'streetwear';
  if (pathname === '/classic' || pathname.startsWith('/classic/')) return 'classic';
  return null;
}

export const WorldProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  const value = useMemo<WorldContextValue>(() => {
    const currentWorld = detectWorld(pathname);
    return {
      currentWorld,
      getOtherWorld: () => {
        if (currentWorld === 'streetwear') return 'classic';
        if (currentWorld === 'classic') return 'streetwear';
        return null;
      },
      isInWorld: (world: World) => currentWorld === world,
    };
  }, [pathname]);

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>;
};

export const useWorld = () => {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error('useWorld must be used within WorldProvider');
  return ctx;
};
