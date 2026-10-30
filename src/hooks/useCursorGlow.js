import { useEffect } from 'react';

// Two soft lights that trail the mouse (fast one + slow one). Off on touch screens and for reduced motion.
export default function useCursorGlow(aRef, bRef) {
  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b || matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, ty = 0, ax = 0, ay = 0, bx = 0, by = 0, running = false, started = false, raf = 0;

    const loop = () => {
      ax += (tx - ax) * 0.2; ay += (ty - ay) * 0.2;
      bx += (tx - bx) * 0.07; by += (ty - by) * 0.07;
      a.style.transform = 'translate3d(' + ax + 'px,' + ay + 'px,0)';
      b.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0)';
      // settled on the pointer: stop looping until it moves again
      if (Math.abs(tx - ax) < 0.15 && Math.abs(ty - ay) < 0.15 && Math.abs(tx - bx) < 0.15 && Math.abs(ty - by) < 0.15) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!started) { started = true; ax = bx = tx; ay = by = ty; }
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
      a.classList.add('on'); b.classList.add('on');
    };
    const leave = () => { a.classList.remove('on'); b.classList.remove('on'); };

    document.addEventListener('mousemove', move, { passive: true });
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, [aRef, bRef]);
}
