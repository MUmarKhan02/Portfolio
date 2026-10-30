import { useEffect } from 'react';

// The grid (body background) tiles from the top of the page, but each shaded section starts at a
// different height, so each gets a vertical offset (--dot-y) that lands its dots exactly on the grid.
export default function useDotAlignment() {
  useEffect(() => {
    const secs = [...document.querySelectorAll('section.alt')];
    const sync = () => {
      const y = window.scrollY || window.pageYOffset;
      secs.forEach((s) => {
        const top = Math.round(s.getBoundingClientRect().top + y) + s.clientTop;
        s.style.setProperty('--dot-y', ((top % 24) + 24) % 24 + 'px');
      });
    };
    sync();
    window.addEventListener('load', sync);
    window.addEventListener('resize', sync);
    const ro = window.ResizeObserver ? new ResizeObserver(sync) : null;
    ro?.observe(document.body);
    let live = true;
    document.fonts?.ready.then(() => live && sync());
    return () => {
      live = false;
      window.removeEventListener('load', sync);
      window.removeEventListener('resize', sync);
      ro?.disconnect();
    };
  }, []);
}
