// Local-only static server for a Creator Web Mobile build.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'build', 'web-mobile');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm' };

createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://127.0.0.1');
  const target = resolve(root, `.${decodeURIComponent(url.pathname)}`);
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end(); return;
  }
  try {
    const file = (await stat(target)).isDirectory() ? resolve(target, 'index.html') : target;
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(content);
  } catch {
    response.writeHead(404).end();
  }
}).listen(8765, '127.0.0.1', () => console.log(`Unit build: http://127.0.0.1:8765/`));
