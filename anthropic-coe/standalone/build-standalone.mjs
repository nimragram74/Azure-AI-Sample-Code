// Assembles ONE fully self-contained index.html that runs by simply opening it
// (double-click) — no npm, no build step, no web server, and no internet.
//
// Everything is vendored INTO the file:
//   • React + ReactDOM (UMD builds from node_modules)
//   • Bootstrap CSS + Bootstrap Icons CSS (icon font embedded as base64)
//   • the design-system CSS
//   • all XML configs (as <script type="text/xml"> blocks)
//   • the app, with JSX pre-compiled to plain JS via esbuild (no Babel at runtime)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { transformSync } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');
const readB64 = (p) => readFileSync(resolve(root, p)).toString('base64');

// --- vendored libraries -------------------------------------------------
const reactJs = read('node_modules/react/umd/react.production.min.js');
const reactDomJs = read('node_modules/react-dom/umd/react-dom.production.min.js');
const bootstrapCss = read('node_modules/bootstrap/dist/css/bootstrap.min.css');

// Bootstrap Icons: rewrite the @font-face to a single embedded woff2 data URI
const iconFontB64 = readB64('node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2');
let iconCss = read('node_modules/bootstrap-icons/font/bootstrap-icons.min.css');
iconCss = iconCss.replace(
  /@font-face\{[^}]*\}/,
  `@font-face{font-display:block;font-family:"bootstrap-icons";` +
    `src:url("data:font/woff2;base64,${iconFontB64}") format("woff2")}`,
);

// --- our sources --------------------------------------------------------
const css = read('src/index.css');

// Compile JSX -> plain JS so the browser needs no Babel.
const { code: appJs } = transformSync(read('standalone/app.babel.js'), {
  loader: 'jsx',
  jsx: 'transform',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  format: 'iife',
  target: 'es2018',
});

const configs = [
  ['cfg-site', 'public/config/site.xml'],
  ['cfg-training', 'public/config/training.xml'],
  ['cfg-certifications', 'public/config/certifications.xml'],
  ['cfg-updates', 'public/config/updates.xml'],
  ['cfg-bestpractices', 'public/config/bestpractices.xml'],
  ['cfg-offerings', 'public/config/offerings.xml'],
];
// NOTE: the XML prolog (<?xml ...?>) must be the very first character of the
// element's text, so trim and emit it immediately after the opening tag.
const xmlBlocks = configs
  .map(([id, path]) => `  <script type="text/xml" id="${id}">${read(path).trim()}</script>`)
  .join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anthropic COE Portal · Wipro</title>
  <meta name="description" content="Anthropic Center of Excellence (COE) Portal by Wipro — training, certifications, best practices for Claude, latest updates, and customer solutions." />
  <meta name="theme-color" content="#CC785C" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23191919'/%3E%3Cpath d='M20 44 L29 20 h6 l9 24 h-6.2 l-1.9-5.2h-8.8L25.2 44z M28.1 33.6h7.8L32 23.1z' fill='%23CC785C'/%3E%3C/svg%3E" />
  <style>${bootstrapCss}</style>
  <style>${iconCss}</style>
  <style>
${css}
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- All portal content lives here as XML — edit a value and reload. -->
${xmlBlocks}

  <!-- Vendored libraries (offline) -->
  <script>${reactJs}</script>
  <script>${reactDomJs}</script>
  <!-- App (JSX already compiled to plain JS) -->
  <script>${appJs}</script>
</body>
</html>
`;

const out = resolve(root, 'anthropic-coe-portal.html');
writeFileSync(out, html, 'utf8');
console.log('Wrote', out, `(${(html.length / 1024).toFixed(0)} KB, fully offline)`);
