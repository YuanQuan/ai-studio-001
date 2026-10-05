import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '../../../..');
const contentType = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
const port = Number(process.env.PARALLAX_PORT || 8765);
const previewPrefix = '/deliverables/master/UNIT-MENU-PARALLAX-PREVIEW-001/v0.1/';
const imagePrefix = '/deliverables/art/moonlit_psd_20261005_v2_raw/layer_sources/';
createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const target = resolve(root, '.' + pathname);
  const allowedPreview = pathname === previewPrefix + 'index.html' || pathname === previewPrefix + 'preview.js';
  const allowedImage = pathname.startsWith(imagePrefix) && /^exec-[a-z0-9-]+\.png$/.test(pathname.slice(imagePrefix.length));
  if ((!allowedPreview && !allowedImage) || !target.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not a file');
    response.writeHead(200, { 'Content-Type': contentType[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`预览: http://127.0.0.1:${port}/deliverables/master/UNIT-MENU-PARALLAX-PREVIEW-001/v0.1/index.html`);
});
