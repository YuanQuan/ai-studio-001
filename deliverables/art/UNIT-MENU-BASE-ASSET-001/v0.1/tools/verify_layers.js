#!/usr/bin/env node
/* 资源静态验证：依据实际 PNG 与 manifest，不推断 Creator/设备结果。 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const p=(...x)=>path.join(root,...x);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const check=(condition,message)=>{if(!condition)throw new Error(message);};
const manifest=JSON.parse(fs.readFileSync(p('layers','LAYER_MANIFEST.json'),'utf8'));
async function data(file){return sharp(p(file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});}
function pixel(raw,x,y){const i=(y*raw.info.width+x)*4;return [...raw.data.subarray(i,i+4)];}
async function main(){
  const results=[];
  const ok=(name,evidence)=>results.push({name,status:'PASS',evidence});
  check(manifest.assetId==='STREET_BASE_01'&&manifest.textureCount===16,'ID/纹理数');
  check(manifest.worldCanvas.width===3072&&manifest.worldCanvas.height===1024,'世界画布');
  check(manifest.rgba8BaseBytes===8847360,'RGBA8 基础量');
  check(manifest.placements.length===42,'placement 数');
  ok('source-scale-count','3072×1024，16 PNG，42 placements，8,847,360 B RGBA8');
  const textureEvidence=[];
  for(const [id,t] of Object.entries(manifest.textures)){
    const bytes=fs.readFileSync(p(t.file));
    const x=await data(t.file);
    check(x.info.width===t.width&&x.info.height===t.height,`${id} 尺寸`);
    check(sha(bytes)===t.sha256,`${id} 哈希`);
    let minX=x.info.width,minY=x.info.height,maxX=-1,maxY=-1,count=0;
    for(let y=0;y<x.info.height;y++)for(let xx=0;xx<x.info.width;xx++){
      if(pixel(x,xx,y)[3]>0){minX=Math.min(minX,xx);minY=Math.min(minY,y);maxX=Math.max(maxX,xx);maxY=Math.max(maxY,y);count++;}
    }
    const box={x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1,visiblePixels:count};
    check(JSON.stringify(box)===JSON.stringify(t.alphaBBox),`${id} alphaBBox`);
    textureEvidence.push({id,width:t.width,height:t.height,alphaBBox:box,sha256:t.sha256});
  }
  ok('actual-textures-hashes-alpha','逐张实际 PNG 尺寸、SHA-256、alpha bbox 与 manifest 完全一致');
  const sky=await data('layers/sky_gradient.png');
  for(let i=3;i<sky.data.length;i+=4)check(sky.data[i]===255,'天空不透明');
  ok('sky-full-height-opaque','32×1024 底色所有 alpha=255，实例横铺整世界');
  const bridge=await data('layers/bridge_back.png');
  for(const [x,y] of [[256,260],[256,320],[256,380]])check(pixel(bridge,x,y)[3]===0,`桥洞 ${x},${y} 必须透明`);
  for(const [x,y] of [[8,300],[504,300],[256,130]])check(pixel(bridge,x,y)[3]>0,`桥体 ${x},${y} 不应空白`);
  ok('real-arch-alpha','桥后片拱洞三点真实 alpha=0，桥端/桥腹样点不透明');
  const ground=manifest.placements.filter(x=>x.id.startsWith('ground_'));
  check(ground.every(x=>x.world.x+x.world.width<=1280||x.world.x>=1792),'街面中央水口被地面覆盖');
  const branch=manifest.placements.find(x=>x.id==='water_branch');
  const river=manifest.placements.filter(x=>x.id==='water_river');
  check(branch.world.y+branch.world.height>=832&&river.some(x=>x.world.x<=1536&&x.world.x+x.world.width>=1536),'支流/前河不连通');
  ok('channel-layout','地面中央 x1280..1792 留口，支流 y640..896 与前河 y832..1024 重叠');
  const previewBytes=fs.readFileSync(p(manifest.preview.file));
  check(sha(previewBytes)===manifest.preview.sha256,'全景合成 hash');
  const preview=await data(manifest.preview.file);
  check(preview.info.width===3072&&preview.info.height===1024,'全景尺寸');
  for(let i=3;i<preview.data.length;i+=4)check(preview.data[i]===255,'全景露透明边');
  for(const c of manifest.preview.cameraSamples){
    const image=await data(`preview/${c.name}.png`);
    check(image.info.width===720&&image.info.height===1280,`${c.name} 尺寸`);
    for(let i=3;i<image.data.length;i+=4)check(image.data[i]===255,`${c.name} 露透明边`);
  }
  check(manifest.preview.cameraSamples.length===7,'镜头裁图数量');
  ok('full-scene-and-camera-alpha','3072×1024 全景与 7 张 720×1280 左/中/右/西/东镜头裁图均 alpha=255');
  function seam(x,y0,y1){let total=0;for(let y=y0;y<y1;y++){const a=pixel(preview,x-1,y),b=pixel(preview,x,y);total+=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);}return +(total/((y1-y0)*3)).toFixed(2);}
  const seams={ground:[512,1024,2048,2560].map(x=>({x,meanRgbStep:seam(x,580,745)})),bridgeEnds:[1280,1792].map(x=>({x,meanRgbStep:seam(x,480,745)})),river:[512,1024,2048,2560].map(x=>({x,meanRgbStep:seam(x,900,1000)})),bank:[512,1024,2048,2560].map(x=>({x,meanRgbStep:seam(x,798,830)}))};
  const round1=JSON.parse(fs.readFileSync(p('audit','round1','HASHES.json'),'utf8'));
  const round1ByPath=Object.fromEntries(round1.map(x=>[x.path,x.sha256]));
  const changed=[];
  for(const t of textureEvidence){if(round1ByPath[`layers/${t.id}.png`]!==t.sha256)changed.push(t.id);}
  check(JSON.stringify(changed.sort())===JSON.stringify(['bridge_back','distance_a','distance_b','distance_c'].sort()),`REV2 范围外纹理变更: ${changed}`);
  ok('revision-scope','相较 round1 仅 bridge_back 与 3 张 distance PNG 像素改变；其余 12 张纹理 SHA-256 未变');
  const report={taskId:'UNIT-MENU-BASE-ASSET-001',version:'v0.1-REV2',status:'PASS_STATIC_CHECKS_ONLY',sourceSha256:manifest.source.sha256,previewSha256:manifest.preview.sha256,checks:results,seamSamples:seams,textures:textureEvidence,notTested:['Creator 3.8.8 实际导入、画面拖拽与缩放','目标设备最大纹理边长/解码峰值/实际内存/DrawCall/帧时间','顾客在桥面移动与前后遮挡','菜单 1 与菜单 7 同一 UUID/Prefab 及对象创建后定位']};
  fs.writeFileSync(p('QA_STATIC.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,checks:results.length,changed,seamSamples:seams},null,2));
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
