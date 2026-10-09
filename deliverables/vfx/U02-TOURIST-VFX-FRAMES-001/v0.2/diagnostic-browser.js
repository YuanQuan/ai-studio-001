document.querySelector('#diagnostic-save').onclick=async()=>{
 const status=document.querySelector('#diagnostic-status');
 try{if(!window.formalEmotions)throw new Error('源尚未加载');const blob=await new Promise(resolve=>window.formalEmotions.sad[5].toBlob(resolve,'image/png'));const r=await fetch('/diagnostic/sad05-lighter',{method:'POST',body:blob});if(!r.ok)throw new Error(await r.text());status.textContent='修复诊断已保存；非正式PNG，不可Client接入。';}
 catch(e){status.textContent='诊断保存失败：'+e.message;}
};
