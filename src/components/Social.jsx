import { urls } from '../data/content';
import { GitHubIcon, LinkedInIcon } from './icons';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

export function GitHubButton() {
  return (
    <a className="btn social" href={urls.github} {...ext}>
      <GitHubIcon />
      <span>GitHub</span>
    </a>
  );
}

export function LinkedInButton() {
  return (
    <a className="btn social" href={urls.linkedin} {...ext}>
      <LinkedInIcon />
      <span>LinkedIn</span>
    </a>
  );
}
