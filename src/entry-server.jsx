import { renderToString } from 'react-dom/server';
import App from './App';

// Used only at build time by scripts/prerender.mjs.
export function render() {
  return renderToString(<App />);
}
