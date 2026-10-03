#!/usr/bin/env node
/*
 * UG_GHOST_01 / BENCH_01 原创矢量源的确定性导出。
 * 依赖 Node v22.12.0 和 sharp v0.35.4；运行前须有本批 ART/TECH_PREFLIGHT APPROVED。
 * NODE_PATH 可指向已安装 sharp 的 node_modules；不依赖任何旧 Demo 或参考位图。
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const p = (...parts) => path.join(root, ...parts);
const CW = 160, CH = 192, ATLAS_W = 1024, ATLAS_H = 512, PAD = 4;
const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');
const read = (file) => fs.readFileSync(p(file));
const saveJson = (file, obj) => fs.writeFileSync(p(file), JSON.stringify(obj, null, 2) + '\n');
function ensureGate() {
  for (const file of ['ART_PREFLIGHT.json', 'TECH_PREFLIGHT.json', 'ART_PREFLIGHT_REV1.json', 'TECH_PREFLIGHT_REV1.json', 'ART_PREFLIGHT_REV2.json', 'TECH_PREFLIGHT_REV2.json']) {
    const item = JSON.parse(read(file));
    if (item.task_id !== 'UNIT-MENU-GHOST-ASSET-001' || item.decision !== 'APPROVED') {
      throw new Error(`${file} 未对本任务批准，禁止出图`);
    }
  }
}
function setAttr(svg, id, attr, value) {
  const pattern = new RegExp(`(<(?:g|path) id="${id}"[^>]*?\\b${attr}=")[^"]*(")`);
  if (!pattern.test(svg)) throw new Error(`源 SVG 缺少可编辑属性 ${id}.${attr}`);
  const changed = svg.replace(pattern, (_, a, b) => `${a}${value}${b}`);
  return changed;
}
function bodyPath(wave) {
  const a = 152 + wave, b = 158 - wave * 0.45, c = 153 - wave;
  return `M 82 26 C 102 26 114 39 116 57 C 118 69 116 78 120 90 C 125 105 126 120 120 131 C 116 145 109 151 104 ${a} C 99 ${a} 96 145 92 147 C 88 150 85 ${b} 80 ${b} C 74 ${b} 72 149 67 147 C 62 145 61 155 55 ${c} C 48 151 42 141 41 130 C 39 117 42 105 47 90 C 51 78 47 69 50 57 C 53 39 64 26 82 26 Z`;
}
const pose = (state, index) => {
  if (state === 'move') {
    const bob = [1, -1, -3, -2, 0, 2][index];
    const wave = [0, 2, 3, 1, -2, -1][index];
    return { x:[0,1,0,-1,0,0][index], y:bob, sx:[1,1.015,1.03,1.01,.99,1][index], sy:[1,.99,.98,.99,1.01,1][index], rot:[-1,0,1,1,0,-1][index], left:[-9,-2,9,12,3,-8][index], right:[9,2,-9,-12,-3,8][index], tuft:[-3,0,3,4,0,-3][index], wave, expr:'neutral' };
  }
  if (state === 'run') {
    return { x:[0,1,2,0,-1,-1][index], y:[0,-5,-2,-6,-1,2][index], sx:[1.06,1.09,1.08,1.1,1.07,1.05][index], sy:[.98,.95,.99,.94,.99,1][index], rot:[6,9,11,8,6,5][index], left:[-20,12,28,6,-18,-25][index], right:[20,-12,-28,-6,18,25][index], tuft:[-5,2,7,4,-2,-6][index], wave:[-3,2,5,-2,-4,0][index], expr:'neutral' };
  }
  if (state === 'happy') {
    return [
      {x:0,y:0,sx:1,sy:1,rot:0,left:10,right:-10,tuft:0,wave:0,expr:'neutral'},
      {x:0,y:-4,sx:1.035,sy:1.025,rot:-2,left:31,right:-32,tuft:5,wave:3,expr:'happy'},
      {x:0,y:-7,sx:1.05,sy:1.035,rot:2,left:43,right:-42,tuft:8,wave:5,expr:'happy'}
    ][index];
  }
  if (state === 'sad') {
    return [
      {x:0,y:0,sx:1,sy:1,rot:0,left:0,right:0,tuft:0,wave:0,expr:'neutral'},
      {x:0,y:3,sx:.97,sy:.94,rot:-2,left:-12,right:12,tuft:-5,wave:-2,expr:'sad'},
      {x:0,y:6,sx:.94,sy:.9,rot:-4,left:-20,right:20,tuft:-9,wave:-4,expr:'sad'}
    ][index];
  }
  return [
    {x:2,y:0,sx:1,sy:1,rot:1,left:3,right:-3,tuft:1,wave:0,expr:'neutral'},
    {x:0,y:2,sx:1.05,sy:.91,rot:2,left:10,right:-10,tuft:2,wave:1,expr:'neutral'},
    {x:0,y:-5,sx:1.1,sy:.84,rot:0,left:18,right:-18,tuft:1,wave:2,expr:'neutral'},
    {x:0,y:-11,sx:1.12,sy:.78,rot:0,left:21,right:-21,tuft:0,wave:1,expr:'happy'},
    {x:0,y:-3,sx:1.025,sy:.94,rot:-1,left:5,right:-5,tuft:-2,wave:-1,expr:'neutral'}
  ][index];
};
const specs = [
  {state:'move', count:6, durations:[125,125,125,125,125,125], playback:'loop'},
  {state:'run', count:6, durations:[84,83,84,83,83,83], playback:'loop'},
  {state:'happy', count:3, durations:[100,120,null], playback:'once_then_hold'},
  {state:'sad', count:3, durations:[120,140,null], playback:'once_then_hold'},
  {state:'sit', count:5, durations:[140,160,180,null,180], playback:'enter_hold_leave_on_command'}
];
function frameSvg(master, config) {
  const {x,y,sx,sy,rot,left,right,tuft,wave,expr} = config;
  let s = master;
  s = setAttr(s, 'ghost', 'transform', `translate(${x} ${y}) translate(80 155) rotate(${rot}) scale(${sx} ${sy}) translate(-80 -155)`);
  s = setAttr(s, 'body', 'd', bodyPath(wave));
  s = setAttr(s, 'arm-left', 'transform', `rotate(${left} 49 101)`);
  s = setAttr(s, 'arm-right', 'transform', `rotate(${right} 111 102)`);
  s = setAttr(s, 'tuft', 'd', `M 75 28 C ${71+tuft*.2} 22 ${75+tuft*.4} 15 ${82+tuft} 15 C ${86+tuft} 15 ${89+tuft} 19 ${86+tuft} 23 C ${83+tuft} 25 ${80+tuft} 23 ${81+tuft} 20`);
  if (expr === 'happy') {
    s = setAttr(s, 'brow-left', 'd', 'M 69 68 Q 73 62 77 68');
    s = setAttr(s, 'brow-right', 'd', 'M 93 68 Q 99 62 104 68');
    s = setAttr(s, 'mouth', 'd', 'M 84 90 Q 92 103 101 90 Q 92 98 84 90 Z');
  } else if (expr === 'sad') {
    s = setAttr(s, 'brow-left', 'd', 'M 69 65 Q 73 70 77 69');
    s = setAttr(s, 'brow-right', 'd', 'M 93 69 Q 99 70 104 65');
    s = setAttr(s, 'mouth', 'd', 'M 85 98 Q 92 91 99 97');
  }
  return s;
}
async function alphaBbox(png) {
  const {data,info} = await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let x0=info.width,y0=info.height,x1=-1,y1=-1, visible=0;
  for (let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const a=data[(y*info.width+x)*4+3];
    if (a > 0) { visible++; x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y); }
  }
  if(x1<0) throw new Error('空白帧');
  return {x:x0,y:y0,width:x1-x0+1,height:y1-y0+1,visiblePixels:visible};
}
function pack(frames) {
  let x=PAD,y=PAD,rowH=0;
  for(const frame of frames) {
    const w=frame.bbox.width+PAD*2,h=frame.bbox.height+PAD*2;
    if(x+w+PAD>ATLAS_W){x=PAD;y+=rowH;rowH=0;}
    if(y+h+PAD>ATLAS_H) throw new Error('图集超出 REV2 签认的 1024×512；请停止并重新双签');
    frame.paddedRect={x,y,width:w,height:h};
    frame.atlasRect={x:x+PAD,y:y+PAD,width:frame.bbox.width,height:frame.bbox.height};
    x+=w;rowH=Math.max(rowH,h);
  }
}
async function exportBench(master) {
  const mark=(id)=>new RegExp(`<g id="${id}"[\\s\\S]*?<\\/g>`);
  if(!mark('bench-back').test(master)||!mark('bench-front').test(master)) throw new Error('板凳分片缺失');
  const back=master.replace(mark('bench-front'),'');
  const front=master.replace(mark('bench-back'),'');
  const outputs=[['sprites/bench.png',master],['sprites/bench_back.png',back],['sprites/bench_front.png',front]];
  const result={};
  for(const [file,svg] of outputs) {
    const bytes=await sharp(Buffer.from(svg)).png().toBuffer(); fs.writeFileSync(p(file),bytes);
    result[file]={width:256,height:128,sha256:hash(bytes)};
  }
  return result;
}
async function preview(frames, bench) {
  const sheetCols=6, sheetRows=4, cellW=160, cellH=192;
  const checker=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="192"><rect width="160" height="192" fill="#1f3559"/><path d="M0 168H160" stroke="#c09d66" stroke-opacity=".65" stroke-width="2"/></svg>`);
  const panel=await sharp(checker).png().toBuffer();
  const sheetLayers=[];
  frames.forEach((f,i)=>{let left=(i%sheetCols)*cellW, top=Math.floor(i/sheetCols)*cellH;sheetLayers.push({input:panel,left,top},{input:f.png,left,top});});
  await sharp({create:{width:sheetCols*cellW,height:sheetRows*cellH,channels:4,background:'#1f3559'}}).composite(sheetLayers).png().toFile(p('preview/frame_sheet.png'));
  const contactW=640, contactH=5*220, layers=[];
  const picks=['move_03','run_03','happy_02','sad_02','sit_03'];
  const color=['#7295b8','#a7b8cf','#e5b978','#a98496','#b3936e'];
  for(let row=0;row<5;row++) for(let col=0;col<2;col++) {
    const cellX=col*320, cellY=row*220;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="320" height="220" fill="#1d3154"/><rect width="320" height="8" fill="${color[row]}"/><path d="M0 192H320" stroke="#9d8a72" stroke-width="2"/></svg>`;
    layers.push({input:Buffer.from(svg),left:cellX,top:cellY});
    const f=frames.find(z=>z.id===picks[row]);
    const ghost=col===0?await sharp(f.png).flop().png().toBuffer():f.png;
    if(row===4){
      layers.push({input:bench.back,left:cellX+32,top:cellY+92});
      const seatX=col===0?180:76;
      layers.push({input:ghost,left:cellX+32+seatX-80,top:cellY+92+56-146});
      layers.push({input:bench.front,left:cellX+32,top:cellY+92});
    } else layers.push({input:ghost,left:cellX+80,top:cellY+18});
  }
  await sharp({create:{width:contactW,height:contactH,channels:4,background:'#1d3154'}}).composite(layers).png().toFile(p('preview/contact_sheet.png'));
  // GIF 原画左右同步展示；一段包含五态，每个状态的帧顺序与 FRAME_MANIFEST 相同。
  const gifW=320,gifH=192, gifLayers=[]; const delays=[];
  for(let i=0;i<frames.length;i++){
    const f=frames[i]; const flipped=await sharp(f.png).flop().png().toBuffer();
    const top=i*gifH;
    gifLayers.push({input:panel,left:0,top},{input:panel,left:160,top},{input:flipped,left:0,top},{input:f.png,left:160,top});
    delays.push(f.durationMs===null?350:f.durationMs);
  }
  await sharp({create:{width:gifW,height:gifH*frames.length,pageHeight:gifH,channels:4,background:'#1f3559'}}).composite(gifLayers).gif({loop:0,delay:delays,dither:0}).toFile(p('preview/loop_preview.gif'));
}
async function main() {
  ensureGate();
  for(const dir of ['source','tools','frames','sprites','preview']) fs.mkdirSync(p(dir),{recursive:true});
  const master=read('source/ghost_master.svg').toString('utf8');
  const benchMaster=read('source/bench_master.svg').toString('utf8');
  const frames=[];
  for(const spec of specs) for(let i=0;i<spec.count;i++) {
    const id=`${spec.state}_${String(i).padStart(2,'0')}`;
    const svg=frameSvg(master,pose(spec.state,i));
    const png=await sharp(Buffer.from(svg)).png().toBuffer();
    const file=`frames/${id}.png`; fs.writeFileSync(p(file),png);
    const bbox=await alphaBbox(png);
    frames.push({id,state:spec.state,index:i,originalDirection:'right',durationMs:spec.durations[i],playback:spec.playback,canvas:{width:CW,height:CH},ghostFoot:{x:80,y:168},seatContact:spec.state==='sit'?{x:80,y:146}:null,bbox,sha256:hash(png),file,png});
  }
  if(new Set(frames.map(f=>f.sha256)).size!==23) throw new Error('逐帧像素重复，停止交付');
  pack(frames);
  const atlasParts=[];
  for(const f of frames){const crop=await sharp(f.png).extract({left:f.bbox.x,top:f.bbox.y,width:f.bbox.width,height:f.bbox.height}).png().toBuffer();atlasParts.push({input:crop,left:f.atlasRect.x,top:f.atlasRect.y});}
  const atlasBytes=await sharp({create:{width:ATLAS_W,height:ATLAS_H,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(atlasParts).png().toBuffer();
  fs.writeFileSync(p('sprites/ghost_atlas.png'),atlasBytes);
  const benchInfo=await exportBench(benchMaster);
  const publicFrames=frames.map(({png,...f})=>f);
  const atlasMeta={assetId:'UG_GHOST_01',version:'v0.1',texture:'ghost_atlas.png',width:ATLAS_W,height:ATLAS_H,padding:PAD,format:'RGBA8 source PNG',sha256:hash(atlasBytes),frameCount:frames.length,frames:Object.fromEntries(publicFrames.map(f=>[f.id,{rect:f.atlasRect,paddedRect:f.paddedRect,sourceSize:f.canvas,trimOffset:{x:f.bbox.x,y:f.bbox.y},ghostFoot:f.ghostFoot,seatContact:f.seatContact}]))};
  saveJson('sprites/ghost_atlas.json',atlasMeta);
  const manifest={taskId:'UNIT-MENU-GHOST-ASSET-001',version:'v0.1',assetId:'UG_GHOST_01',originalDirection:'right',mirrorDirection:'left',logicCanvas:{width:CW,height:CH},source:{ghostMasterSha256:hash(read('source/ghost_master.svg')),benchMasterSha256:hash(read('source/bench_master.svg')),exportScriptSha256:hash(read('tools/export_assets.js'))},atlas:{file:'sprites/ghost_atlas.png',sha256:hash(atlasBytes),pageCount:1,width:ATLAS_W,height:ATLAS_H,rgba8Bytes:ATLAS_W*ATLAS_H*4,padding:PAD},bench:{assetId:'BENCH_01',benchFoot:{x:128,y:114},seatRight:{x:76,y:56},seatLeft:{x:180,y:56},layers:benchInfo},states:specs,frames:publicFrames};
  saveJson('frames/FRAME_MANIFEST.json',manifest);
  await preview(frames,{back:read('sprites/bench_back.png'),front:read('sprites/bench_front.png')});
  const fileHashes={};
  for(const f of ['sprites/ghost_atlas.png','sprites/ghost_atlas.json','sprites/bench.png','sprites/bench_back.png','sprites/bench_front.png','preview/contact_sheet.png','preview/frame_sheet.png','preview/loop_preview.gif']) fileHashes[f]=hash(read(f));
  console.log(JSON.stringify({tool:{node:process.version,sharp:sharp.versions.sharp,libvips:sharp.versions.vips},frames:frames.length,uniqueFrameHashes:new Set(frames.map(f=>f.sha256)).size,atlasPages:1,atlasBytes:atlasBytes.length,atlasRgba8Bytes:ATLAS_W*ATLAS_H*4,maxBbox:{width:Math.max(...frames.map(f=>f.bbox.width)),height:Math.max(...frames.map(f=>f.bbox.height))},fileHashes},null,2));
}
main().catch(err=>{console.error(err.stack||err);process.exitCode=1;});
