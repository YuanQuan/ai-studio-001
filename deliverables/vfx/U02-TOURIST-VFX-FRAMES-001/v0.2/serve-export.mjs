import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(root,'../../../..');
const prototype=path.resolve(root,'../../U02-TOURIST-MOTION-PROTOTYPE-001');
const source=path.join(repo,'deliverables/art/U02-TOURIST-ASSET-001/v0.1/source/psd_work');
const sha=b=>createHash('sha256').update(b).digest('hex');
const approvedFiles=new Set(['00_body_core.png','01_tail_cutout.png','02_hand_near_cutout.png','03_hand_far_cutout.png','02_hand_far_cutout.png','03_hand_near_cutout.png','04_face_cutout.png']);
async function gate(){
  const sign=JSON.parse(await fs.readFile(path.join(root,'PRODUCTION_PRESIGN.json'),'utf8'));
  if(sign.batch!=='U02-VFX-A'||sign.art!=='APPROVED'||sign.tech_lead!=='APPROVED')throw new Error('本批 Art/Tech 预签未通过');
}
const capture=[];
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');
  if(req.method==='POST'&&url.pathname==='/diagnostic/sad05-lighter'){
   const chunks=[];let size=0;for await(const b of req){size+=b.length;if(size>2000000)throw new Error('诊断帧过大');chunks.push(b);}const bytes=Buffer.concat(chunks);
   if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.readUInt32BE(16)!==512||bytes.readUInt32BE(20)!==512)throw new Error('只接受512诊断PNG');
   await fs.mkdir(path.join(root,'diagnostics'),{recursive:true});await fs.writeFile(path.join(root,'diagnostics/sad05-lighter.png'),bytes,{flag:'wx'});res.writeHead(200);return res.end('诊断保存；非正式帧');
  }
  if(req.method==='POST'&&/^\/export\/(walk|run|happy|sad)\/[0-9]$/.test(url.pathname)){
   await gate();
   const [, ,action,i]=url.pathname.split('/');const chunks=[];let size=0;
   if(!['walk/0','run/0','happy/4','sad/5'].includes(action+'/'+i)){
    const check=JSON.parse(await fs.readFile(path.join(root,'REPRESENTATIVE_CHECK.json'),'utf8'));
    if(check.batch!=='U02-VFX-A'||check.automatedResult!=='PASS'||check.visualOwnerCheck!=='PASS')throw new Error('代表实PNG尚未完成Owner核对，禁止扩批');
   }
   for await(const b of req){size+=b.length;if(size>2000000)throw new Error('超出单帧限制');chunks.push(b);}
   const bytes=Buffer.concat(chunks);
   if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.readUInt32BE(16)!==512||bytes.readUInt32BE(20)!==512)throw new Error('仅接受512透明PNG');
   await fs.mkdir(path.join(root,'frames'),{recursive:true});
   const file=`ug_ghost_01_${action}_${String(i).padStart(2,'0')}.png`;
   await fs.writeFile(path.join(root,'frames',file),bytes,{flag:'wx'});
   capture.push({file,sha256:sha(bytes),bytes:bytes.length,capturedAt:new Date().toISOString()});
   await fs.writeFile(path.join(root,'CAPTURE_LOG.json'),JSON.stringify(capture,null,2)+'\n');
   res.writeHead(200);return res.end('ok');
  }
  if(req.method==='POST'&&url.pathname==='/renderer'){
   await gate();let str='';for await(const b of req){str+=b;if(str.length>10000)throw new Error('metadata too large');}
   const meta=JSON.parse(str);await fs.writeFile(path.join(root,'RENDERER_RECORD.json'),JSON.stringify(meta,null,2)+'\n');res.writeHead(200);return res.end('ok');
  }
  let text,mime='text/javascript; charset=utf-8';
  if(url.pathname==='/'){
   text=await fs.readFile(path.join(prototype,'index.html'),'utf8');
   text=text.replace('</main>', '<button id="diagnostic-save">保存sad05修复诊断（非正式资源）</button><span id="diagnostic-status"></span><button id="formal-export">第一阶段：导出4张代表PNG</button><button id="formal-complete">第二阶段：续导其余36帧</button><p id="formal-status">等待Art/Tech预签；先核代表实图，再完成本批。</p></main>').replace('</body>','<script src="export-browser.js"></script><script src="diagnostic-browser.js"></script></body>');
   mime='text/html; charset=utf-8';
  }else if(url.pathname==='/motion.js'){
   text=await fs.readFile(path.join(prototype,'motion.js'),'utf8');
   text=text.replace("document.querySelector('#status').textContent='播放中", "window.formalWalk=()=>{const poses=[];for(let i=0;i<10;i++){drawWalk(i/10/0.75,false);const c=document.createElement('canvas');c.width=c.height=512;c.getContext('2d').drawImage(document.querySelector('#walk'),0,0);poses.push(c);}return poses;};document.querySelector('#status').textContent='播放中");
  }else if(url.pathname==='/emotions.js'){
   text=await fs.readFile(path.join(prototype,'emotions.js'),'utf8');
   text=text.replace("const hc=document.querySelector", "window.formalEmotions={happy,sad,happyPoses,sadPoses};const hc=document.querySelector");
   const original='if(rigidFaces)ctx.drawImage(rigidFaces[i],0,0);';
   if(!text.includes(original))throw new Error('sad合成注入基线不匹配');
   text=text.replace(original,"if(rigidFaces){ctx.globalCompositeOperation='lighter';ctx.drawImage(rigidFaces[i],0,0);ctx.globalCompositeOperation='source-over';}");
  }else if(url.pathname==='/export-browser.js')text=await fs.readFile(path.join(root,'export-browser.js'),'utf8');
  else if(url.pathname==='/diagnostic-browser.js')text=await fs.readFile(path.join(root,'diagnostic-browser.js'),'utf8');
  else if(url.pathname==='/style.css'){text=await fs.readFile(path.join(prototype,'style.css'),'utf8');mime='text/css; charset=utf-8';}
  else if(url.pathname==='/review.html'){text=await fs.readFile(path.join(root,'review.html'),'utf8');mime='text/html; charset=utf-8';}
  else if(url.pathname==='/review.js')text=await fs.readFile(path.join(root,'review.js'),'utf8');
  else if(/^\/frames\/ug_ghost_01_(walk|run|happy|sad)_0[0-9]\.png$/.test(url.pathname)){
   res.writeHead(200,{'Content-Type':'image/png','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(root,url.pathname.slice(1))));
  }else if(['/frames/FRAME_MANIFEST.json','/mounts/FRAME_MOUNT_MANIFEST.json'].includes(url.pathname)){
   res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(root,url.pathname.slice(1))));
  }else if(url.pathname==='/accessories/ACCESSORY_SOURCE_MANIFEST.json'){
   res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(repo,'deliverables/art/U02-TOURIST-ASSET-001/v0.1/batches/U02-FULL-A/formal/source/ACCESSORY_SOURCE_MANIFEST.json')));
  }else if(/^\/accessories\/ug_acc_(hat_01_front|glasses_01_front|wristband_01_back|wristband_01_front)\.png$/.test(url.pathname)){
   res.writeHead(200,{'Content-Type':'image/png','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(repo,'deliverables/art/U02-TOURIST-ASSET-001/v0.1/batches/U02-FULL-A/formal',url.pathname.slice(1))));
  }
  else{
   let state,file;const emotion=/^\/emotion-source\/(happy_00|sad_00)\/([^/]+)$/.exec(url.pathname);
   if(emotion){[,state,file]=emotion;}else if(url.pathname.startsWith('/source/')){state='walk_00';file=url.pathname.slice(8);}
   if(!state||!approvedFiles.has(file)){res.writeHead(404);return res.end('Not found');}
   res.writeHead(200,{'Content-Type':'image/png','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(source,state,'layer_sources',file)));
  }
  res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});res.end(text);
 }catch(e){res.writeHead(409,{'Content-Type':'text/plain; charset=utf-8'});res.end(e.message);}
}).listen(8874,'127.0.0.1',()=>console.log('U02 revision exporter http://127.0.0.1:8874/ ; formal export requires PRODUCTION_PRESIGN.json'));
