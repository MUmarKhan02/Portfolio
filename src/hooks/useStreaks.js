import { useCallback, useEffect, useState } from 'react';

// Streak animation on/off, remembered in the browser. Defaults to off when the OS asks for reduced motion.
// Starts "off" so server and first client render match; the saved value is applied right after mount.
export default function useStreaks() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem('streaks');
    } catch {
      /* ignore */
    }
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    setOn(saved === 'on' ? true : saved === 'off' ? false : !reduce);
  }, []);

  const toggle = useCallback(() => {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem('streaks', next ? 'on' : 'off');
    } catch {
      /* ignore */
    }
  }, [on]);

  return [on, toggle];
}
