import { useEffect, useRef } from 'react';
import useCursorGlow from '../hooks/useCursorGlow';
import useScrollProgress from '../hooks/useScrollProgress';
import { createPulses } from '../lib/pulses';

export function ScrollProgress() {
  const bar = useRef(null);
  useScrollProgress(bar);
  return (
    <div className="progress" aria-hidden="true">
      <i ref={bar} />
    </div>
  );
}

export function CursorGlow() {
  const a = useRef(null);
  const b = useRef(null);
  useCursorGlow(a, b);
  return (
    <>
      <div className="cursor-glow a" ref={a} aria-hidden="true" />
      <div className="cursor-glow b" ref={b} aria-hidden="true" />
    </>
  );
}

// The fixed canvas behind the content: cursor-lit grid always, travelling streaks when `streaksOn`.
export function BackgroundPulses({ streaksOn }) {
  const canvas = useRef(null);
  const engine = useRef(null);

  useEffect(() => {
    engine.current = createPulses(canvas.current);
    return () => {
      engine.current?.destroy();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    engine.current?.setStreaks(streaksOn);
  }, [streaksOn]);

  return <canvas id="bgPulses" ref={canvas} aria-hidden="true" />;
}
