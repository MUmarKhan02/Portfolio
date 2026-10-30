import { useEffect, useState } from 'react';

// Cycles through `count` words every 2.4s. Returns the word coming in and the one going out
// (the CSS animates the swap). Stays still for reduced motion.
export default function useRotator(count, interval = 2400) {
  const [state, setState] = useState({ cur: 0, prev: -1 });

  useEffect(() => {
    if (count < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let clear;
    const id = setInterval(() => {
      setState((s) => ({ cur: (s.cur + 1) % count, prev: s.cur }));
      clearTimeout(clear);
      clear = setTimeout(() => setState((s) => ({ ...s, prev: -1 })), 600);
    }, interval);
    return () => {
      clearInterval(id);
      clearTimeout(clear);
    };
  }, [count, interval]);

  return state;
}
