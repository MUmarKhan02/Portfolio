import { useCallback } from 'react';

// The theme lives on <html data-theme>. The inline script in index.html sets it before first paint
// (no flash), and CSS swaps the sun/moon icon from that attribute, so no React state is needed.
export default function useTheme() {
  return useCallback(() => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage blocked: the theme still switches for this visit */
    }
  }, []);
}
