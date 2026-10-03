#!/usr/bin/env node
// 对实际导出文件做独立读取与像素核验；不修改任何源或图片。
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.resolve(__dirname,'..');
const p=x=>path.join(root,x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const get=x=>fs.readFileSync(p(x));
const assert=(x,m)=>{if(!x)throw new Error(m);};
async function raw(file){return (await sharp(get(file)).ensureAlpha().raw().toBuffer({resolveWithObject:true})).data;}
function pixelDelta(a,b){let sum=0;for(let i=0;i<a.length;i+=4){sum+=Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2])+Math.abs(a[i+3]-b[i+3]);}return sum/(a.length/4*4*255);}
async function main(){
  const m=JSON.parse(get('frames/FRAME_MANIFEST.json'));
  const atlas=JSON.parse(get('sprites/ghost_atlas.json'));
  const tex=await sharp(get('sprites/ghost_atlas.png')).metadata();
  const gif=await sharp(get('preview/loop_preview.gif'),{animated:true}).metadata();
  assert(m.frames.length===23,'帧数不为 23');
  assert(atlas.frameCount===23,'图集索引帧数不为 23');
  assert(tex.width===atlas.width&&tex.height===atlas.height,'PNG 与 JSON 图集尺寸不同');
  assert(sha(get('sprites/ghost_atlas.png'))===m.atlas.sha256,'图集 hash 不符');
  assert(gif.pages===23&&gif.pageHeight===192,'GIF 未含 23 个独立画面');
  const hashes=new Set(),rects=[],frameRaw={};let maxRight=0,maxBottom=0,totalBbox=0,visible=0;
  for(const f of m.frames){
    const bytes=get(f.file);assert(sha(bytes)===f.sha256,`帧 hash 不符 ${f.id}`);hashes.add(f.sha256);
    const meta=await sharp(bytes).metadata();assert(meta.width===160&&meta.height===192,`逻辑画布错误 ${f.id}`);
    const b=f.bbox,r=f.atlasRect,q=f.paddedRect;
    assert(r.x>=q.x+4&&r.y>=q.y+4&&r.x+r.width<=q.x+q.width-4&&r.y+r.height<=q.y+q.height-4,`4px padding 不足 ${f.id}`);
    assert(q.x>=0&&q.y>=0&&q.x+q.width<=tex.width&&q.y+q.height<=tex.height,`图集越界 ${f.id}`);
    assert(r.width===b.width&&r.height===b.height,`裁切 bbox 不符 ${f.id}`);
    for(const other of rects)assert(q.x+q.width<=other.x||other.x+other.width<=q.x||q.y+q.height<=other.y||other.y+other.height<=q.y,`padding 区交叠 ${f.id}`);
    rects.push(q);maxRight=Math.max(maxRight,q.x+q.width);maxBottom=Math.max(maxBottom,q.y+q.height);totalBbox+=b.width*b.height;visible+=b.visiblePixels;
    frameRaw[f.id]=await raw(f.file);
  }
  assert(hashes.size===23,'存在同像素重复帧');
  const loop={};
  for(const state of ['move','run']){
    const arr=m.frames.filter(f=>f.state===state);
    const diffs=[];for(let i=0;i<arr.length;i++)diffs.push(pixelDelta(frameRaw[arr[i].id],frameRaw[arr[(i+1)%arr.length].id]));
    loop[state]={adjacentNormalizedDelta:diffs.map(n=>Number(n.toFixed(5))),closingToMedianRatio:Number((diffs.at(-1)/[...diffs].sort((a,b)=>a-b)[Math.floor(diffs.length/2)]).toFixed(3))};
  }
  console.log(JSON.stringify({status:'PASS_STATIC_EXPORT_CHECKS',atlas:{width:tex.width,height:tex.height,pages:1,rgba8Bytes:tex.width*tex.height*4,maxRight,maxBottom,totalBboxPixels:totalBbox,visibleAlphaPixels:visible},frames:{count:m.frames.length,uniqueHashes:hashes.size,logicCanvas:'160x192'},gif:{pages:gif.pages,pageHeight:gif.pageHeight,loop:gif.loop},loopMetrics:loop,notTested:['Creator 3.8.8 import','target-device legibility and performance','runtime DrawCall and alpha filtering','actual in-game left/right 10-cell QA']},null,2));
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1});
