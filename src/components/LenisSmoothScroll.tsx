import * as React from 'react';
import Lenis from '@studio-freight/lenis';
import { useIsMobile } from '@/hooks/use-mobile';

const LenisSmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = React.useRef<Lenis | null>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
        if (lenisRef.current) {
            lenisRef.current.destroy();
            lenisRef.current = null;
        }
        return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.8,
      gestureOrientation: 'vertical',
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isMobile]);

  return <>{children}</>;
};

export default LenisSmoothScroll;
