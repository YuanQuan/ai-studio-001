(async()=>{
 const load=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('图片加载失败 '+src));im.src=src;});
 try{
 const manifest=await(await fetch('/frames/FRAME_MANIFEST.json')).json(),mount=await(await fetch('/mounts/FRAME_MOUNT_MANIFEST.json')).json(),acc=await(await fetch('/accessories/ACCESSORY_SOURCE_MANIFEST.json')).json();
 const images=new Map(await Promise.all(manifest.frames.map(async f=>[f.frameId,await load('/'+f.file)])));
 const accessories=await Promise.all(acc.items.map(async item=>({...item,images:await Promise.all(item.exports.map(file=>load('/'+file)))})));
 const actions=['walk','run','happy','sad'];let elapsed=0,last=0,paused=false,fixed=null,showAcc=false;
 function drawAcc(ctx,item,im,f){const p=f.mounts[item.mountKey],m=p.localAffine;ctx.save();ctx.transform(...m,p.x-m[0]*item.pivot.x-m[2]*item.pivot.y,p.y-m[1]*item.pivot.x-m[3]*item.pivot.y);ctx.drawImage(im,0,0);ctx.restore();}
 function draw(now){if(last&&!paused)elapsed+=now-last;last=now;for(const action of actions){const frames=manifest.frames.filter(f=>f.action===action),i=fixed??Math.floor(elapsed/frames[0].durationMs)%10,f=frames[i],mf=mount.frames.find(m=>m.frameId===f.frameId),ctx=document.querySelector('#'+action).getContext('2d');ctx.clearRect(0,0,512,512);
  const wrist=accessories.find(a=>a.category==='wristband');if(showAcc)drawAcc(ctx,wrist,wrist.images[0],mf);ctx.drawImage(images.get(f.frameId),0,0);
  if(showAcc){for(const item of accessories.filter(a=>a.category!=='wristband'))drawAcc(ctx,item,item.images[0],mf);drawAcc(ctx,wrist,wrist.images[1],mf);}
  document.querySelector('#'+action+'-frame').textContent=f.frameId+' · '+i+'/9';
 }requestAnimationFrame(draw);}
 document.querySelector('#review-pause').onclick=e=>{paused=!paused;if(!paused)fixed=null;e.target.textContent=paused?'继续播放':'暂停';};
 document.querySelector('#review-reset').onclick=()=>{elapsed=0;fixed=null;};document.querySelector('#review-accessory').onchange=e=>{showAcc=e.target.checked;};document.querySelector('#review-frame').oninput=e=>{fixed=Number(e.target.value);paused=true;document.querySelector('#review-pause').textContent='继续播放';};
 document.querySelector('#review-status').textContent='实际40张PNG已加载 · 具体版本待用户审核';requestAnimationFrame(draw);
 }catch(e){document.querySelector('#review-status').textContent=e.message;}
})();
