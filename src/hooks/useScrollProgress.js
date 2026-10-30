import { useEffect } from 'react';

// Fills the thin bar at the top of the page as you scroll. `ref` points at the inner <i>.
export default function useScrollProgress(ref) {
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let queued = false;
    const paint = () => {
      queued = false;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, (window.scrollY || 0) / h)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    const ask = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    };
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', ask);
    window.addEventListener('load', ask);
    paint();
    return () => {
      window.removeEventListener('scroll', ask);
      window.removeEventListener('resize', ask);
      window.removeEventListener('load', ask);
    };
  }, [ref]);
}
