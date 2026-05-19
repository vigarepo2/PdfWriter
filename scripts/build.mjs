import { build } from 'esbuild';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const frontendEntry = resolve(root, 'src/frontend/app.js');
const frontendCss = resolve(root, 'src/frontend/styles.css');
const shellModule = resolve(root, 'src/server/app-shell.js');
const appBundle = resolve(dist, 'assets/app.js');
const cssBundle = resolve(dist, 'assets/app.css');
const serverBundle = resolve(dist, 'server.js');

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, 'assets'), { recursive: true });

await build({
  entryPoints: [frontendEntry],
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  platform: 'browser',
  outfile: appBundle,
  legalComments: 'none'
});

const css = await readFile(frontendCss, 'utf8');
await writeFile(cssBundle, css, 'utf8');

const { APP_HTML } = await import(pathToFileURL(shellModule).href + '?t=' + Date.now());
const appJs = await readFile(appBundle, 'utf8');
const appCss = await readFile(cssBundle, 'utf8');

const server = `const HTML = ${JSON.stringify(APP_HTML)};\nconst APP_JS = ${JSON.stringify(appJs)};\nconst APP_CSS = ${JSON.stringify(appCss)};\n\nfunction response(body, type) {\n  return new Response(body, {\n    headers: {\n      'content-type': type,\n      'cache-control': 'public, max-age=300',\n      'x-content-type-options': 'nosniff',\n      'referrer-policy': 'strict-origin-when-cross-origin'\n    }\n  });\n}\n\nexport default {\n  async fetch(request) {\n    const url = new URL(request.url);\n    if (url.pathname === '/health') return Response.json({ ok: true, app: 'PdfWriter', version: '21.0.0' });\n    if (url.pathname === '/assets/app.js') return response(APP_JS, 'application/javascript; charset=utf-8');\n    if (url.pathname === '/assets/app.css') return response(APP_CSS, 'text/css; charset=utf-8');\n    if (url.pathname === '/') return response(HTML, 'text/html; charset=utf-8');\n    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });\n  }\n};\n`;

await writeFile(serverBundle, server, 'utf8');
console.log('Built dist/server.js and bundled local assets.');
