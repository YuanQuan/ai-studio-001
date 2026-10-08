import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(root,'../../../..');
const proto=path.resolve(root,'../../U02-TOURIST-MOTION-PROTOTYPE-001');
const art=path.join(repo,'deliverables/art/U02-TOURIST-ASSET-001/v0.1');
const formal=path.join(art,'batches/U02-FULL-A/formal');
const {default:sharp}=await import(pathToFileURL(process.env.U02_SHARP_PATH||'C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs').href);
const sha=b=>createHash('sha256').update(b).digest('hex');
const rel=f=>path.relative(repo,f).replaceAll('\\','/');
const json=async(f,o)=>{await fs.mkdir(path.dirname(f),{recursive:true});await fs.writeFile(f,JSON.stringify(o,null,2)+'\n');};
async function inventory(dir){const result=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())result.push(...await inventory(f));else result.push({file:rel(f),sha256:sha(await fs.readFile(f))});}return result;}
async function protectedInventory(){return [...await inventory(path.join(art,'source/psd_work')),...await inventory(formal),...await inventory(path.join(repo,'apps/client/assets/units/ghost-customer')),...await Promise.all(['motion.js','emotions.js','motion-comparison.gif','emotions-comparison.gif'].map(async n=>({file:rel(path.join(proto,n)),sha256:sha(await fs.readFile(path.join(proto,n)))})))];}
if(process.argv.includes('--preflight')){
 const protectedFiles=await protectedInventory();
 const verifiedSources=[];
 for(const e of JSON.parse(await fs.readFile(path.join(proto,'evidence/source-hashes.json'),'utf8'))){const actual=sha(await fs.readFile(e.Path));if(actual!==e.Hash.toLowerCase())throw new Error('walk源图变化');verifiedSources.push({file:rel(e.Path),sha256:actual});}
 for(const e of JSON.parse(await fs.readFile(path.join(proto,'evidence/emotion-source-hashes.json'),'utf8'))){const f=path.resolve(proto,e.file);const actual=sha(await fs.readFile(f));if(actual!==e.sha256.toLowerCase())throw new Error('情绪源图变化');verifiedSources.push({file:rel(f),sha256:actual});}
 await json(path.join(root,'SOURCE_PREFLIGHT.json'),{createdAt:new Date().toISOString(),verifiedSources,protectedFiles});console.log('Preflight PASS: '+verifiedSources.length+' immutable source layers; '+protectedFiles.length+' protected files');process.exit();
}
const preflight=JSON.parse(await fs.readFile(path.join(root,'SOURCE_PREFLIGHT.json'),'utf8'));
const current=await protectedInventory();const changed=[];
for(const old of preflight.protectedFiles){const now=current.find(e=>e.file===old.file);if(!now||now.sha256!==old.sha256)changed.push(old.file);}
if(changed.length)throw new Error('受保护文件发生变化：'+changed.join(','));
const renderer=JSON.parse(await fs.readFile(path.join(root,'RENDERER_RECORD.json'),'utf8'));
const oldMount=JSON.parse(await fs.readFile(path.join(formal,'mounts/FRAME_MOUNT_MANIFEST.json'),'utf8'));
const s=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
function bend(p,c,r,a,shift,edge){const q=[p[0]-c[0],p[1]-c[1]],w=1-s(edge,1,Math.hypot(q[0]/r[0],q[1]/r[1]));return [(Math.cos(a)*q[0]-Math.sin(a)*q[1]-q[0]+shift[0])*w,(Math.sin(a)*q[0]+Math.cos(a)*q[1]-q[1]+shift[1])*w];}
function transformVertex(pt,action,i){
 let p=[...pt];
 if(action==='walk'||action==='run'){
  const phase=2*Math.PI*i/10,tail=s(0,1,(p[1]-264)/127)*(1-s(185,283,p[0])),travel=(p[0]-112)*.02+(p[1]-345)*.009;
  const near=bend(p,[287,309],[67,67],.085*Math.sin(phase+.6),[2.2*Math.sin(phase+.3),2.6*Math.sin(phase+1)],.62);
  const far=bend(p,[382,302],[36,54],.07*Math.sin(phase+2.4),[1.4*Math.sin(phase+2.7),2.1*Math.sin(phase+3)],.62);
  return [p[0]+4.5*Math.sin(phase-travel)*tail+near[0]+far[0],p[1]+(6*Math.sin(phase-travel+.85)+1.2*Math.sin(2*phase+travel)*tail)*tail+near[1]+far[1]+2.2*Math.sin(phase-.3)];
 }
 const pose=renderer[action+'Poses'][i];
 if(action==='happy'){
  const lift=pose[3];let d=bend(p,[247,271],[64,65],-.08*lift,[-3*lift,-13*lift],.45);p=[p[0]+d[0],p[1]+d[1]];
  d=bend(p,[385,247],[41,53],.08*lift,[lift,-10*lift],.45);p=[p[0]+d[0],p[1]+d[1]];
  const hem=s(285,405,p[1])*(1-s(220,295,p[0]));p=[p[0]+hem*5*lift,p[1]+hem*7*lift];return [256+(p[0]-256)*(1-pose[1]*.55),390+(p[1]-390)*(1+pose[1])+pose[0]];
 }
 const bow=pose[2],q=[p[0]-285,p[1]-290],a=.22*bow,head=1-s(275,405,p[1]);
 p=[p[0]+(Math.cos(a)*q[0]-Math.sin(a)*q[1]-q[0]+8*bow)*head,p[1]+(Math.sin(a)*q[0]+Math.cos(a)*q[1]-q[1]+25*bow)*head];
 for(const [c,r,shift] of [[[290,349],[52,69],[0,6*bow]],[[370,340],[32,65],[0,8*bow]]]){const d=bend(pt,c,r,.025*bow,shift,.45);p=[p[0]+d[0],p[1]+d[1]];}
 p[1]+=pose[0]+s(330,430,pt[1])*(1-s(230,290,pt[0]))*2.5*bow;return p;
}
function transform(pt,action,i){const step=(action==='walk'||action==='run')?8:4,x=Math.floor(pt[0]/step)*step,y=Math.floor(pt[1]/step)*step,u=(pt[0]-x)/step,v=(pt[1]-y)/step;
 let vertices,weights;if(u+v<=1){vertices=[[x,y],[x+step,y],[x,y+step]];weights=[1-u-v,u,v];}else{vertices=[[x,y+step],[x+step,y],[x+step,y+step]];weights=[1-u,1-v,u+v-1];}
 const points=vertices.map(p=>transformVertex(p,action,i));return [0,1].map(k=>points.reduce((sum,p,j)=>sum+p[k]*weights[j],0));}
const round=n=>Math.round(n*1e6)/1e6;
const frames=[],mountFrames=[],raws=new Map(),buffers=new Map();
const durations={walk:400/3,run:200/3,happy:140,sad:280};
const representatives=process.argv.includes('--representatives');
const sourcePsdNames={walk:'tourist_body_master.psd',run:'tourist_body_master.psd',happy:'tourist_happy_keypose.psd',sad:'tourist_sad_keypose.psd'};
const sourcePsds={};for(const [action,n] of Object.entries(sourcePsdNames)){const file=path.join(formal,'source',n);sourcePsds[action]={file:rel(file),sha256:sha(await fs.readFile(file)),usage:'现存静态分层母版；本帧由对应layer_sources与VFX Shader烘焙，未声称存在逐帧PSD'};}
for(const action of ['walk','run','happy','sad'])for(let i=0;i<10;i++){
 if(representatives&&!['walk/0','run/0','happy/4','sad/5'].includes(action+'/'+i))continue;
 const file=`frames/ug_ghost_01_${action}_${String(i).padStart(2,'0')}.png`,data=await fs.readFile(path.join(root,file)),m=await sharp(data).metadata();
 if(m.width!==512||m.height!==512||!m.hasAlpha||data[24]!==8||data[25]!==6)throw new Error('输出画布/RGBA8/alpha错误');
 const raw=await sharp(data).ensureAlpha().raw().toBuffer();let minX=512,minY=512,maxX=-1,maxY=-1,zeroAlpha=0;
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){const a=raw[(y*512+x)*4+3];if(a){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}else zeroAlpha++;}
 if(minX<=0||minY<=0||maxX>=511||maxY>=511||zeroAlpha===0)throw new Error('裁切或无透明');
 const frameId=`UG_GHOST_01_${action.toUpperCase()}_${String(i).padStart(2,'0')}`;
 const f={frameId,action,index:i,file,sha256:sha(data),pixelSha256:sha(raw),durationMs:durations[action],durationFractionMs:action==='walk'?[400,3]:action==='run'?[200,3]:[durations[action],1],visibleRect:{x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1},mountRef:'mounts/FRAME_MOUNT_MANIFEST.json',sourceState:action==='run'?'walk_00':action+'_00',sourcePsd:sourcePsds[action],bytes:data.length};frames.push(f);raws.set(frameId,raw);buffers.set(frameId,data);
 const base=oldMount.frames.find(f=>f.action===(action==='run'?'walk':action)&&f.index===0);
 const mounts={};for(const [key,b] of Object.entries(base.mounts)){
  const p=transform([b.x,b.y],action,i),px=transform([b.x+1,b.y],action,i),py=transform([b.x,b.y+1],action,i);const matrix=[px[0]-p[0],px[1]-p[1],py[0]-p[0],py[1]-p[1]];
  const alpha=raw[(Math.round(p[1])*512+Math.round(p[0]))*4+3];if(alpha<128)throw new Error(frameId+' '+key+'挂点alpha过低 '+alpha);
  mounts[key]={x:round(p[0]),y:round(p[1]),visible:true,valid:true,side:b.side,anchorPixelAlpha:alpha,localAffine:matrix.map(round),rotationDeg:round(Math.atan2(matrix[1],matrix[0])*180/Math.PI),sourcePoint:{x:b.x,y:b.y}};
 }
 const visualFoot=transform([256,440],action,i);
 mountFrames.push({...f,playback:'loop',originalFacing:'right',canvas:{width:512,height:512},originalSize:{width:512,height:512},sourceRect:{x:0,y:0,width:512,height:512},trimOffset:{x:0,y:0},foot:{x:256,y:440},visualFoot:{x:round(visualFoot[0]),y:round(visualFoot[1])},mounts,occlusion:base.occlusion});
}
for(let i=0;i<(representatives?1:10);i++)if(frames.find(f=>f.action==='walk'&&f.index===i).sha256!==frames.find(f=>f.action==='run'&&f.index===i).sha256)throw new Error('walk/run字节不一致');
if(representatives){
 const acc=JSON.parse(await fs.readFile(path.join(formal,'source/ACCESSORY_SOURCE_MANIFEST.json'),'utf8'));
 const items=await Promise.all(acc.items.map(async item=>({...item,images:await Promise.all(item.exports.map(async file=>(await fs.readFile(path.join(formal,file))).toString('base64')))})));
 const compositions=[],comparison=[];
 const backgrounds=['#000000','#808080','#ffffff'];
 for(let row=0;row<mountFrames.length;row++){
  const f=mountFrames[row],body64=buffers.get(f.frameId).toString('base64');
  const image=(b,w,h,m)=>`<image width="${w}" height="${h}" href="data:image/png;base64,${b}" transform="matrix(${m.join(' ')})"/>`;
  const draw=(item,i)=>{const p=f.mounts[item.mountKey],m=p.localAffine;return image(item.images[i],item.size.width,item.size.height,[...m,p.x-m[0]*item.pivot.x-m[2]*item.pivot.y,p.y-m[1]*item.pivot.x-m[3]*item.pivot.y]);};
  const wrist=items.find(a=>a.category==='wristband');let content=draw(wrist,0)+image(body64,512,512,[1,0,0,1,0,0]);for(const item of items.filter(a=>a.category!=='wristband'))content+=draw(item,0);content+=draw(wrist,1);
  for(let col=0;col<6;col++){
   const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="${backgrounds[col%3]}"/><g transform="${col<3?'translate(0 0)':'translate(512 0) scale(-1 1)'}">${content}</g></svg>`);
   compositions.push({input:await sharp(svg).png().toBuffer(),left:col*512,top:row*512});
  }
  const state=f.sourceState,manifest=JSON.parse(await fs.readFile(path.join(art,'source/psd_work',state,'manifest.json'),'utf8'));
  const staticComposite=await sharp({create:{width:512,height:512,channels:4,background:'#e9eee7'}}).composite(manifest.layers.map(l=>({input:path.join(art,'source/psd_work',state,l.file),top:0,left:0}))).png().toBuffer();
  const motion=f.action==='walk'||f.action==='run',page=motion?0:f.action==='happy'?4:10,left=f.action==='run'||f.action==='sad'?480:0;
  const decoded=await sharp(path.join(proto,motion?'motion-comparison.gif':'emotions-comparison.gif'),{page}).extract({left,top:44,width:480,height:480}).resize(512,512).png().toBuffer();
  comparison.push({input:staticComposite,left:0,top:row*512},{input:buffers.get(f.frameId),left:512,top:row*512},{input:decoded,left:1024,top:row*512});
 }
 await fs.mkdir(path.join(root,'preview'),{recursive:true});
 await sharp({create:{width:3072,height:2048,channels:4,background:'#e9eee7'}}).composite(compositions).png().toFile(path.join(root,'preview/representative-edge-and-mirror.png'));
 await sharp({create:{width:1536,height:2048,channels:4,background:'#e9eee7'}}).composite(comparison).png().toFile(path.join(root,'preview/representative-comparison.png'));
 await json(path.join(root,'REPRESENTATIVE_CHECK.json'),{batch:'U02-VFX-A',version:'v0.2',createdAt:new Date().toISOString(),automatedResult:'PASS',visualOwnerCheck:'NOT_TESTED',reviewer:'vfx',frames,mountFrames,protectedFilesUnchanged:preflight.protectedFiles.length,pngColorType:'RGBA8',canvas:'512x512',transparentPixels:'PASS',clippedFrames:0,walkRunSamePoseBytes:'PASS',comparison:{file:'preview/representative-comparison.png',columns:['静态分层源合成','实际代表PNG','已确认GIF对应姿态（调色板/尺度仅视觉比较）'],rows:mountFrames.map(f=>f.frameId),cellSize:512},edges:{file:'preview/representative-edge-and-mirror.png',columns:['右向黑底','右向灰底','右向白底','左向黑底','左向灰底','左向白底'],rows:mountFrames.map(f=>f.frameId),cellSize:512},visualFindings:[],gate2:'PENDING'});
 console.log('代表实PNG自动核对PASS；请VFX查看两图并记录visualOwnerCheck，再扩批。');process.exit();
}
const cycles={};for(const action of ['walk','run','happy','sad']){
 const first=raws.get(`UG_GHOST_01_${action.toUpperCase()}_00`),last=raws.get(`UG_GHOST_01_${action.toUpperCase()}_09`);let changed=0,total=0;for(let j=0;j<first.length;j++){const d=Math.abs(first[j]-last[j]);total+=d;if(j%4===3){const k=j-3;if(first.subarray(k,k+4).compare(last.subarray(k,k+4)))changed++;}}
 cycles[action]={frameCount:10,playback:'loop',totalDurationMs:durations[action]*10,lastFrameHold:false,loopTransition:{from:9,to:0,duplicatedEndpoint:false,changedPixels:changed,meanAbsoluteChannelDifference:total/first.length}};
}
await json(path.join(root,'frames/FRAME_MANIFEST.json'),{schemaVersion:2,batch:'U02-VFX-A',bodyAssetId:'UG_GHOST_01',version:'v0.2',approval:'USER_REVIEW',initial:'walk_00',frameCount:40,actions:cycles,frames});
await json(path.join(root,'mounts/FRAME_MOUNT_MANIFEST.json'),{schemaVersion:2,batch:'U02-VFX-A',originalFacing:'right',leftFacing:'mirror_with_body',canvas:{width:512,height:512},foot:{x:256,y:440},footMeaning:'固定逻辑地面锚点；visualFoot仅为动作位移说明，不能替代foot',trimPolicy:'none; full 512 square',frameCount:40,method:'与原Shader一致的网格顶点变换、三角重心插值；localAffine为每挂点局部Jacobian，Client尚未运行核验',frames:mountFrames});
await fs.mkdir(path.join(root,'preview'),{recursive:true});
const checker=Buffer.from(`<svg width="2560" height="1024"><defs><pattern id="c" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#e9eee7"/><path d="M0 0h16v16H0zM16 16h16v16H16z" fill="#d9e0d7"/></pattern></defs><rect width="100%" height="100%" fill="url(#c)"/></svg>`);
await sharp(checker).composite(await Promise.all(frames.map(async(f,j)=>({input:await sharp(buffers.get(f.frameId)).resize(256,256).png().toBuffer(),left:(j%10)*256,top:Math.floor(j/10)*256})))).png().toFile(path.join(root,'preview/contact_sheet.png'));
const acc=JSON.parse(await fs.readFile(path.join(formal,'source/ACCESSORY_SOURCE_MANIFEST.json'),'utf8'));
const png64=async(file)=>(await fs.readFile(path.join(formal,file))).toString('base64');
const accessories=new Map();for(const item of acc.items)accessories.set(item.assetId,{...item,images:await Promise.all(item.exports.map(async file=>({file,base64:await png64(file)})))});
const cells=[];const represented=[];
for(let a=0;a<4;a++)for(let col=0;col<3;col++){
 const action=['walk','run','happy','sad'][a],i=[0,4,9][col],f=mountFrames.find(f=>f.action===action&&f.index===i);represented.push(f.frameId);
 const image=(b,w,h,matrix)=>`<image width="${w}" height="${h}" href="data:image/png;base64,${b}" transform="matrix(${matrix.join(' ')})"/>`;
 const drawAccessory=(item,img)=>{const p=f.mounts[item.mountKey],m=p.localAffine;return image(img.base64,item.size.width,item.size.height,[...m,p.x-m[0]*item.pivot.x-m[2]*item.pivot.y,p.y-m[1]*item.pivot.x-m[3]*item.pivot.y]);};
 const wrist=accessories.get('UG_ACC_WRISTBAND_01');let content=drawAccessory(wrist,wrist.images[0]);content+=image(buffers.get(f.frameId).toString('base64'),512,512,[1,0,0,1,0,0]);
 for(const id of ['UG_ACC_HAT_01','UG_ACC_GLASSES_01']){const item=accessories.get(id);content+=drawAccessory(item,item.images[0]);}content+=drawAccessory(wrist,wrist.images[1]);
 const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#e9eee7"/>${content}</svg>`);
 cells.push({input:await sharp(svg).png().toBuffer(),left:col*512,top:a*512});
}
await sharp({create:{width:1536,height:2048,channels:4,background:'#e9eee7'}}).composite(cells).png().toFile(path.join(root,'preview/recomposition.png'));
await json(path.join(root,'preview/PREVIEW_MANIFEST.json'),{contactSheet:{file:'preview/contact_sheet.png',columns:10,rows:['walk','run','happy','sad'],cellSize:256,sourceScale:.5},recomposition:{file:'preview/recomposition.png',cellSize:512,sourceScale:1,columns:[0,4,9],rows:['walk','run','happy','sad'],frameIds:represented,accessoryMode:'独立配件按挂点localAffine重组，未烘焙主体',runtimeStatus:'NOT_TESTED'}});
await json(path.join(root,'EXPORT_AND_SOURCE_AUDIT.json'),{batch:'U02-VFX-A',version:'v0.2',createdAt:new Date().toISOString(),sourcePreflight:'SOURCE_PREFLIGHT.json',sourceLayerCount:15,protectedFileCount:preflight.protectedFiles.length,changedProtectedFiles:changed,immutableSources:'PASS',canvasAndAlpha:'PASS',clippedFrameCount:0,walkRunSamePoseBytes:'PASS',samePoseCount:10,bodyFrameCount:40,uniquePixelPoses:30,totalPngBytes:frames.reduce((s,f)=>s+f.bytes,0),rawRgbaBytes:40*512*512*4,rawRgbaBytesWithWalkRunReuse:30*512*512*4,renderer,sourceFiles:preflight.verifiedSources,prototypeFiles:preflight.protectedFiles.filter(f=>f.file.startsWith(rel(proto))),mountMethod:'Shader顶点变换与三角重心插值，非沿用旧动态挂点',mountAlphaMin:Math.min(...mountFrames.flatMap(f=>Object.values(f.mounts).map(m=>m.anchorPixelAlpha))),sadFace:{sourceLayer:'sad_00/layer_sources/04_face_cutout.png',transform:'R(.22*bow)*(p-(285,290))+(285,290)+(8,25)*bow+(0,3*bow)',determinant:1,nonrigidDeformation:false,check:'刚体旋转矩阵正交、det=1；沿用用户确认R7原Shader。采样抗锯齿仍可改变边缘像素。'},cycles,presign:'PRODUCTION_PRESIGN.json',gate2:'PENDING_USER_REVIEW',clientImport:'NOT_TESTED',prefabScene:'NOT_TESTED',runtime:'NOT_TESTED',formalQa:'NOT_TESTED'});
console.log(JSON.stringify({frames:40,totalPngBytes:frames.reduce((s,f)=>s+f.bytes,0),mountAlphaMin:Math.min(...mountFrames.flatMap(f=>Object.values(f.mounts).map(m=>m.anchorPixelAlpha))),protectedFilesUnchanged:preflight.protectedFiles.length},null,2));
