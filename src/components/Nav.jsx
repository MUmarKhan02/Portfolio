import { useEffect, useRef, useState } from 'react';
import { navLinks, site } from '../data/content';
import useActiveSection from '../hooks/useActiveSection';
import { MoonIcon, StreakIcon, SunIcon } from './icons';

const ids = navLinks.map((l) => l.id);

export default function Nav({ onToggleTheme, streaksOn, onToggleStreaks }) {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const active = useActiveSection(ids);

  // Mobile menu: closes on outside click, Escape, or growing past the phone/tablet breakpoint.
  useEffect(() => {
    const onDoc = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 980 && setOpen(false);
    document.addEventListener('click', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('click', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const fxProps = {
    type: 'button',
    'aria-pressed': streaksOn ? 'true' : 'false',
    'aria-label': 'Streak animation',
    title: 'Streak animation: ' + (streaksOn ? 'on' : 'off'),
    onClick: onToggleStreaks,
  };

  return (
    <nav ref={navRef} className={open ? 'open' : undefined}>
      <div className="wrap">
        <div className="navleft">
          <a className="brand" href="#top">
            <span className="full">{site.name}</span>
            <span className="short">{site.shortName}</span>
          </a>
          <button className="theme" id="theme" type="button" aria-label="Switch color theme" onClick={onToggleTheme}>
            <SunIcon />
            <MoonIcon />
          </button>
          <button className="fx" {...fxProps}>
            <StreakIcon />
          </button>
        </div>

        <a className="logo" href="#top" aria-label="Back to top" style={{ overflow: 'hidden', borderRadius: '50%' }}>
          <img
            src="/static/images/logo.png"
            alt={site.name}
            width="44"
            height="44"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.6)', transformOrigin: 'center' }}
          />
        </a>

        <ul id="navlinks">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={'#' + l.id}
                className={active === l.id ? 'active' : undefined}
                aria-current={active === l.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="fxli">
            <button className="fx row" {...fxProps}>
              <StreakIcon />
              <span className="fx-label">Streak animation</span>
              <span className="fx-state">{streaksOn ? 'On' : 'Off'}</span>
            </button>
          </li>
        </ul>

        <button
          className="menu"
          id="menu"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open ? 'true' : 'false'}
          aria-controls="navlinks"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
