// Runs after the client + SSR builds: renders <App/> to HTML and bakes it into dist/index.html,
// so the page's text is in the HTML itself (search engines, link scrapers, no-JS) and React then hydrates it.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const file = path.join(root, 'dist/index.html');
const template = readFileSync(file, 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: <div id="root"></div> not found in dist/index.html');

writeFileSync(file, template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('prerendered dist/index.html');
