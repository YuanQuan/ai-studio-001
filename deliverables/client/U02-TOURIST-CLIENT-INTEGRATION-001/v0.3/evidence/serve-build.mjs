import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve(process.argv[2]);
const port=Number(process.argv[3]??8774);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.wasm':'application/wasm','.bin':'application/octet-stream','.mp3':'audio/mpeg','.ogg':'audio/ogg','.ttf':'font/ttf','.woff':'font/woff','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 try{
  const urlPath=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const relative=urlPath==='/'?'index.html':path.normalize(urlPath.replace(/^[/\\]+/,''));
  const file=path.resolve(base,relative||'index.html');
  if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]??'application/octet-stream','Cache-Control':'no-store'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(400);res.end('Bad request');}
});
server.listen(port,'127.0.0.1',()=>console.log(JSON.stringify({status:'LISTENING',host:'127.0.0.1',port,root:base,pid:process.pid,started:new Date().toISOString()})));
server.on('error',e=>{console.error(JSON.stringify({status:'ERROR',message:e.message}));process.exitCode=1;});
