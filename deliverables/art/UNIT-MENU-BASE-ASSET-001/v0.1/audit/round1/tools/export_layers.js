#!/usr/bin/env node
/* STREET_BASE_01: 独立 SVG symbol 导出 + 同一纹理 placement 合成预览。
 * 必须先有本批 Art/Tech PREFLIGHT APPROVED。Node v22.12.0, sharp v0.35.4。
 */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const p=(...x)=>path.join(root,...x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>fs.readFileSync(p(f));
const WORLD={width:3072,height:1024};
const modules=[
  ['sky_gradient','UB_SKY',32,1024,0],['moon','UB_SKY',128,128,1],['cloud_a','UB_SKY',512,192,2],['cloud_b','UB_SKY',512,192,2],
  ['distance_a','UB_DISTANCE',1024,320,3],['distance_b','UB_DISTANCE',1024,320,3],['distance_c','UB_DISTANCE',1024,320,3],
  ['water_river','UB_WATER',512,192,4],['water_branch','UB_WATER',384,256,5],['bank','UB_BANK',512,96,6],
  ['ground_full','UB_GROUND',512,320,7],['ground_half','UB_GROUND',256,320,7],
  ['bridge_back','UB_BRIDGE_BACK',512,384,8],['rail_back','UB_RAIL_BACK',512,96,9],
  ['bridge_front','UB_BRIDGE_FRONT',512,384,10],['rail_front','UB_RAIL_FRONT',512,96,11]
].map(([id,layer,width,height,order])=>({id,layer,width,height,order}));
function gate(){for(const role of ['ART','TECH']){for(const suffix of ['', '_REV1']){const x=JSON.parse(read(`${role}_PREFLIGHT${suffix}.json`));if(x.task_id!=='UNIT-MENU-BASE-ASSET-001'||x.decision!=='APPROVED')throw new Error(`${role}_PREFLIGHT${suffix} 未签认本批`);}}}
function buildIsolated(master,id,w,h){
  const match=master.match(/<defs>[\s\S]*?<\/defs>/);
  if(!match||!match[0].includes(`id="${id}"`))throw new Error(`SVG 无 symbol ${id}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${match[0]}<use xlink:href="#${id}" x="0" y="0" width="${w}" height="${h}"/></svg>`;
}
async function alphaBbox(file){const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let x0=info.width,y0=info.height,x1=-1,y1=-1,visible=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){if(data[(y*info.width+x)*4+3]>0){visible++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}return x1<0?null:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1,visiblePixels:visible};}
function put(out,id,x,y,w,h,sourceRect=null){out.push({id,world:{x,y,width:w,height:h},sourceRect,anchor:{x:0,y:0}});}
function placements(){
  const a=[];
  put(a,'sky_gradient',0,0,3072,1024);
  put(a,'moon',1472,65,128,128);
  for(const [id,x,y] of [['cloud_a',120,90],['cloud_b',610,160],['cloud_a',1880,105],['cloud_b',2430,170]])put(a,id,x,y,512,192);
  for(const [id,x] of [['distance_a',0],['distance_b',1024],['distance_c',2048]])put(a,id,x,225,1024,320);
  for(let x=0;x<3072;x+=512)put(a,'water_river',x,832,512,192);
  put(a,'water_branch',1344,640,384,256);
  for(const x of [0,512,1792,2304])put(a,'bank',x,790,512,96);
  for(const x of [1024,2816])put(a,'bank',x,790,256,96,{x:0,y:0,width:256,height:96});
  for(const x of [0,512,1792,2304])put(a,'ground_full',x,470,512,320);
  for(const x of [1024,2816])put(a,'ground_half',x,470,256,320);
  put(a,'bridge_back',1280,410,512,384);
  for(const x of [0,512,1792,2304])put(a,'rail_back',x,470,512,96);
  for(const x of [1024,2816])put(a,'rail_back',x,470,256,96,{x:0,y:0,width:256,height:96});
  put(a,'bridge_front',1280,410,512,384);
  for(const x of [0,512,1792,2304])put(a,'rail_front',x,756,512,96);
  for(const x of [1024,2816])put(a,'rail_front',x,756,256,96,{x:0,y:0,width:256,height:96});
  return a.sort((u,v)=>modules.find(m=>m.id===u.id).order-modules.find(m=>m.id===v.id).order);
}
async function makePreview(files,placements){
  const layers=[];
  for(const item of placements){
    const m=modules.find(x=>x.id===item.id), buf=files[item.id];
    let input=buf;
    if(item.sourceRect)input=await sharp(buf).extract({left:item.sourceRect.x,top:item.sourceRect.y,width:item.sourceRect.width,height:item.sourceRect.height}).png().toBuffer();
    if(item.world.width!== (item.sourceRect?item.sourceRect.width:m.width) || item.world.height!== (item.sourceRect?item.sourceRect.height:m.height))
      input=await sharp(input).resize(item.world.width,item.world.height,{fit:'fill'}).png().toBuffer();
    layers.push({input,left:item.world.x,top:item.world.y});
  }
  const composed=await sharp({create:{width:WORLD.width,height:WORLD.height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toBuffer();
  fs.writeFileSync(p('preview','empty_scene.png'),composed);
  const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="3072" height="1024"><path d="M1280 410H1792V794H1280Z" fill="none" stroke="#e3ae72" stroke-width="12" opacity=".8"/><path d="M1280 470H1792" stroke="#e7d2a4" stroke-width="8" opacity=".8"/><path d="M0 756H1280 M1792 756H3072" stroke="#d17f86" stroke-width="9" opacity=".7"/><path d="M0 470H1280 M1792 470H3072" stroke="#86b6c0" stroke-width="9" opacity=".7"/><path d="M1344 640V896 M1728 640V896" stroke="#6cc4d4" stroke-width="8" opacity=".75"/></svg>`);
  await sharp(composed).composite([{input:overlay,left:0,top:0}]).png().toFile(p('preview','layer_occlusion.png'));
  const samples=[['viewport_min_left',1.25,288],['viewport_min_center',1.25,1536],['viewport_min_right',1.25,2784],['viewport_init_center',1.35,1536],['viewport_init_west',1.35,620],['viewport_init_east',1.35,2452],['viewport_max_center',1.8,1536]];
  const report=[];
  for(const [name,scale,cx] of samples){
    const cropW=Math.floor(720/scale),cropH=Math.floor(1280/scale),left=Math.max(0,Math.min(WORLD.width-cropW,Math.round(cx-cropW/2))),top=Math.max(0,Math.min(WORLD.height-cropH,Math.round(512-cropH/2)));
    await sharp(composed).extract({left,top,width:cropW,height:cropH}).resize(720,1280,{fit:'fill'}).png().toFile(p('preview',`${name}.png`));
    report.push({name,scale,cameraCenter:{x:cx,y:512},sourceRect:{x:left,y:top,width:cropW,height:cropH},screen:{width:720,height:1280}});
  }
  return {hash:sha(composed),cameraSamples:report};
}
async function main(){
  gate();fs.mkdirSync(p('layers'),{recursive:true});fs.mkdirSync(p('preview'),{recursive:true});
  const master=read('source/street_base_master.svg').toString('utf8');
  const files={},infos={};
  for(const m of modules){
    const png=await sharp(Buffer.from(buildIsolated(master,m.id,m.width,m.height))).png().toBuffer();
    fs.writeFileSync(p('layers',`${m.id}.png`),png);files[m.id]=png;
    const bbox=await alphaBbox(png);if(!bbox)throw new Error(`空白纹理 ${m.id}`);
    infos[m.id]={assetId:`STREET_BASE_01/${m.id}`,semanticLayer:m.layer,renderOrder:m.order,file:`layers/${m.id}.png`,width:m.width,height:m.height,alphaBBox:bbox,rgba8Bytes:m.width*m.height*4,sha256:sha(png)};
  }
  const placementsData=placements();
  for(const item of placementsData){const m=modules.find(x=>x.id===item.id);if(item.world.x<0||item.world.y<0||item.world.x+item.world.width>WORLD.width||item.world.y+item.world.height>WORLD.height)throw new Error(`世界边界越界 ${item.id}`);if(item.sourceRect&&(item.sourceRect.x+item.sourceRect.width>m.width||item.sourceRect.y+item.sourceRect.height>m.height))throw new Error(`sourceRect 越界 ${item.id}`);}
  const preview=await makePreview(files,placementsData);
  const memory=Object.values(infos).reduce((n,x)=>n+x.rgba8Bytes,0);
  if(modules.length!==16||memory!==8847360)throw new Error(`签认的 16 张/8.4375 MiB 不符: ${modules.length}/${memory}`);
  const manifest={taskId:'UNIT-MENU-BASE-ASSET-001',version:'v0.1',assetId:'STREET_BASE_01',worldCanvas:WORLD,source:{file:'source/street_base_master.svg',sha256:sha(read('source/street_base_master.svg')),exportScript:'tools/export_layers.js',exportScriptSha256:sha(read('tools/export_layers.js'))},tool:{node:process.version,sharp:sharp.versions.sharp,libvips:sharp.versions.vips},textureCount:modules.length,rgba8BaseBytes:memory,textures:infos,placements:placementsData,preview:{file:'preview/empty_scene.png',sha256:preview.hash,cameraSamples:preview.cameraSamples},runtimeWarnings:['preview/empty_scene.png is an audit composition, not a runtime texture','one texture or one atlas does not imply one DrawCall','Creator/target-device/dual-entry UUID still NOT_TESTED']};
  fs.writeFileSync(p('layers','LAYER_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({textures:modules.length,placements:placementsData.length,rgba8BaseBytes:memory,previewSha256:preview.hash,sourceSha256:manifest.source.sha256,bridgeCenterOpaque:((await sharp(files.bridge_back).extract({left:256,top:320,width:1,height:1}).ensureAlpha().raw().toBuffer())[3]>0),cameraSamples:preview.cameraSamples},null,2));
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
