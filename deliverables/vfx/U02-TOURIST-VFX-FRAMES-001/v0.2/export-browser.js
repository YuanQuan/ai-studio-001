async function exportFrames(representatives){
 const status=document.querySelector('#formal-status');
 if(!window.formalWalk||!window.formalEmotions){status.textContent='源图未加载完毕';return;}
 paused=true;capturing=true;
 try{
  const walk=window.formalWalk(),sets={walk,run:walk,happy:window.formalEmotions.happy,sad:window.formalEmotions.sad};
  const gl=document.createElement('canvas').getContext('webgl');const dbg=gl.getExtension('WEBGL_debug_renderer_info');
  const renderer={createdAt:new Date().toISOString(),userAgent:navigator.userAgent,webglVersion:gl.getParameter(gl.VERSION),renderer:gl.getParameter(gl.RENDERER),unmaskedRenderer:dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):null,happyPoses:window.formalEmotions.happyPoses,sadPoses:window.formalEmotions.sadPoses,walkTimes:Array.from({length:10},(_,i)=>i/10/0.75),source:'unchanged prototype shaders; export original 512px canvases',sadFaceComposite:'lighter: complementary premultiplied coverage addition; restore source-over after face'};
  let response=await fetch('/renderer',{method:'POST',body:JSON.stringify(renderer)});if(!response.ok)throw new Error(await response.text());
  // Check the actual representative canvases before expanding the capture batch.
  for(const [action,index] of [['walk',0],['run',0],['happy',4],['sad',5]]){
   const bytes=sets[action][index].getContext('2d').getImageData(0,0,512,512).data;
   let visible=0;
   for(let y=0;y<512;y++)for(let x=0;x<512;x++){const alpha=bytes[(y*512+x)*4+3];if(alpha){visible++;if(x===0||y===0||x===511||y===511)throw new Error(action+'代表帧超出画布');}}
   if(visible===0||visible===512*512)throw new Error(action+'代表帧为空或没有透明背景');
  }
  let count=0;
  for(const [action,poses] of Object.entries(sets))for(let i=0;i<10;i++){
   const isRepresentative=['walk/0','run/0','happy/4','sad/5'].includes(action+'/'+i);
   if(isRepresentative!==representatives)continue;
   const blob=await new Promise(resolve=>poses[i].toBlob(resolve,'image/png'));
   response=await fetch(`/export/${action}/${i}`,{method:'POST',body:blob});if(!response.ok)throw new Error(await response.text());
   status.textContent=`已导出 ${++count}/${representatives?4:36} 正式透明帧；具体版本待Gate2`;
  }
  status.textContent=representatives?'4张代表实PNG已保存；等待Owner实图/挂点/边缘核对后扩批。':'40帧导出完成；等待清单核对与用户Gate2审核。';
 }catch(e){status.textContent='导出停止：'+e.message;}finally{capturing=false;}
}
document.querySelector('#formal-export').onclick=()=>exportFrames(true);
document.querySelector('#formal-complete').onclick=()=>exportFrames(false);
