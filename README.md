# Muhammad Umar Khan: Portfolio

Personal portfolio site for an AI/ML and software engineer. Built with [React](https://react.dev) and [Vite](https://vite.dev), pre-rendered at build time, and deployed on [Vercel](https://vercel.com).

It is a single page with six sections: AI/ML projects, SWE projects, experience, education, skills, and contact. There are light and dark themes, a rotating headline, and an animated background grid that lights up around the cursor and carries optional light streaks.

&nbsp;

## Tech stack

| | |
|---|---|
| UI | React 19, plain JavaScript |
| Build | Vite, plus a small pre-render step (`scripts/prerender.mjs`) |
| Styling | One hand-written CSS file with custom properties for theming |
| Background effects | Canvas 2D (no animation libraries) |
| Hosting | Vercel |
| Dependencies | `react` and `react-dom` only at runtime |

&nbsp;

## Getting started

Requires [Node.js](https://nodejs.org) 20.19 or newer.

```bash
npm install
npm run dev        # dev server at http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` (client bundle, then pre-rendered HTML) |
| `npm run preview` | Serves `dist/` locally, usually at http://localhost:4173 |

&nbsp;

## Project structure

```
public/static/          resumes, report PDFs, images (served as /static/...)
src/
  data/content.js      all copy: projects, jobs, education, skills, links
  components/          Nav, Hero, Footer, page sections, effects, icons
  hooks/               theme, scroll progress, active nav link, rotating headline, ...
  lib/pulses.js        canvas engine for the grid streaks and cursor lighting
  styles.css           all styling and both themes
scripts/prerender.mjs  bakes the rendered page into dist/index.html
index.html             Vite entry: meta tags, fonts, pre-paint theme script
```

&nbsp;

## Editing content

Almost every change happens in [`src/data/content.js`](src/data/content.js). Descriptions support `**bold**`.

To add a project, copy an existing object in the right group and change the text:

```js
{
  title: 'Project name',
  where: 'One-line result or headline metric',
  desc: 'What it does, with **key details** in bold.',
  chips: ['Python', 'FastAPI'],
  links: [
    { label: 'Live demo', href: 'https://example.com', external: true },
    { label: 'Source code', href: 'https://github.com/...', external: true },
  ],
}
```

Resumes and report PDFs live in `public/static/pdfs/`. Replace a file in place and keep the filename, or update the matching path in `content.js`.

&nbsp;

## How the build works

`npm run build` runs three steps:

1. **Client build:** Vite bundles the app into `dist/` with hashed filenames, and writes sourcemaps so DevTools shows the original components.
2. **Server build:** the same app is compiled once for Node.
3. **Pre-render:** `scripts/prerender.mjs` renders the page to HTML and writes it into `dist/index.html`.

The result is a page whose text is already in the HTML. Crawlers, link previews, and browsers with JavaScript off all see the real content, and React then hydrates it in the browser. There is no server at runtime, so `dist/` is just static files.

&nbsp;

## Deployment

The site deploys on [Vercel](https://vercel.com).

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). The Vite preset is detected automatically, so leave the defaults (build command `npm run build`, output directory `dist`).
3. Deploy.

After that, every push to the main branch publishes to production, and every other branch or pull request gets its own preview URL.

For a custom domain, open the project's **Settings → Domains**, add the domain, and set the DNS record Vercel shows. HTTPS is handled for you.

&nbsp;

## Before going live

- In `index.html`, replace `yourdomain.com` in the canonical, `og:url`, and image URLs with the real domain.
- Add `public/og-image.png` (1200 x 630). The Open Graph and Twitter tags already point to it, and it is what shows in LinkedIn and Slack link previews.

&nbsp;

## Notes

- **Streak animation** is on by default and remembered in the browser. It switches off automatically for visitors who prefer reduced motion, and it is disabled on phones.
- **Theme** follows the OS setting on the first visit, then remembers the choice. An inline script in `index.html` applies it before first paint, so there is no light/dark flash.
- **Email** is not written into the page. The mailto link is assembled in the browser when someone hovers, focuses, or clicks the button, which keeps the address out of simple scrapers.
- **Fonts** (Inter and Source Serif 4) load from Google Fonts.
