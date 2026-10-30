import { hero, heroWords, site, urls } from '../data/content';
import useRotator from '../hooks/useRotator';
import { PinIcon } from './icons';
import { GitHubButton, LinkedInButton } from './Social';

function LocationTags({ className }) {
  return (
    <div className={className}>
      <span className="tag">
        <PinIcon />
        {site.location}
      </span>
      <span className="tag">
        <i aria-hidden="true" />
        {site.availability}
      </span>
    </div>
  );
}

function Rotor() {
  const { cur, prev } = useRotator(heroWords.length);
  return (
    <span className="rotor" aria-hidden="true">
      {heroWords.map((w, i) => (
        <span key={w} className={i === cur ? 'w on' : i === prev ? 'w out' : 'w'}>
          {w}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <h1 aria-label={hero.ariaLabel}>
            <Rotor />
            <span className="role" aria-hidden="true">
              Engineer
            </span>
          </h1>
          <p>{hero.intro}</p>
          <p className="second">{hero.second}</p>
          <LocationTags className="loc loc-mobile" />
          <div className="actions">
            <a className="btn primary" href={urls.resumeAI}>
              <span className="dl">Download </span>
              <span className="rs">AI/ML resume</span>
            </a>
            <GitHubButton />
            <LinkedInButton />
          </div>
          <p className="note resume-alt">
            {hero.sweNote} <a href={urls.resumeSWE}>SWE resume</a>
          </p>
        </div>
        <div className="hero-photo">
          <div className="portrait">
            <img src="/static/images/photo.jpg" alt={site.name} width="701" height="800" />
          </div>
          <div className="caption">
            <strong>{site.name}</strong>
            <LocationTags className="loc" />
          </div>
        </div>
      </div>
    </header>
  );
}
