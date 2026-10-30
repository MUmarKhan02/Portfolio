import { useEffect, useState } from 'react';

// Which section the reader is in (drives the nav underline). Same rule as before:
// a section counts once its top passes 40% down the viewport; the page bottom always means "contact".
export default function useActiveSection(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const secs = ids.map((id) => document.getElementById(id)).filter(Boolean);
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
        setActive('contact');
        return;
      }
      const ref = y + window.innerHeight * 0.4;
      let id = '';
      for (const s of secs) if (s.getBoundingClientRect().top + y <= ref) id = s.id;
      setActive(id);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids]);

  return active;
}
