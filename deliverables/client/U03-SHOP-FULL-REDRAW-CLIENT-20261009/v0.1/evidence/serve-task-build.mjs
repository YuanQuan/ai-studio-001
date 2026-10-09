import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root=resolve(process.argv[2]);
const port=Number(process.argv[3]||8789);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.bin':'application/octet-stream','.wasm':'application/wasm'};
createServer(async(req,res)=>{const url=new URL(req.url||'/',`http://127.0.0.1:${port}`);const target=resolve(root,`.${decodeURIComponent(url.pathname)}`);if(target!==root&&!target.startsWith(`${root}${sep}`)){res.writeHead(403).end();return;}try{const file=(await stat(target)).isDirectory()?resolve(target,'index.html'):target;const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404).end();}}).listen(port,'127.0.0.1',()=>console.log(JSON.stringify({url:`http://127.0.0.1:${port}/`,root,port,pid:process.pid})))
