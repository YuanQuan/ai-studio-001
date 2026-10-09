import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const map=json('apps/client/assets/units/ghost-customer/data/ug_ghost_01_asset_map.json');
const rows=[];const errors=[];
for(const row of map.assets){
 const metaPath=row.metaPath??`${row.clientPath}.meta`;
 const meta=json(metaPath);
 const base=`apps/client/library/${row.imageMainUuid.slice(0,2)}/${row.imageMainUuid}`;
 const png=fs.readFileSync(path.join(root,`${base}.png`));
 const sprite=json(`${base}@f9941.json`).content;
 const texture=json(`${base}@6c48a.json`);
 const w=row.canvas.width,h=row.canvas.height;
  const ok=meta.imported===true&&meta.uuid===row.imageMainUuid
  &&meta.subMetas?.['6c48a']?.uuid===row.texture2dUuid
  &&meta.subMetas?.f9941?.uuid===row.spriteFrameUuid
  &&sha(png)===row.clientSha256.toLowerCase()
  &&sprite.rect.x===0&&sprite.rect.y===0&&sprite.rect.width===w&&sprite.rect.height===h
  &&sprite.originalSize.width===w&&sprite.originalSize.height===h
  &&sprite.offset.x===0&&sprite.offset.y===0
  &&Array.isArray(texture.content?.mipmaps)&&texture.content.mipmaps.length>0;
 if(!ok)errors.push(row.stableId);
 rows.push({stableId:row.stableId,kind:row.kind,imageUuid:row.imageMainUuid,textureUuid:row.texture2dUuid,spriteFrameUuid:row.spriteFrameUuid,sourceSha256:row.clientSha256,libraryPngSha256:sha(png),fullCanvas:w===sprite.originalSize.width&&h===sprite.originalSize.height&&sprite.rect.x===0&&sprite.rect.y===0&&sprite.rect.width===w&&sprite.rect.height===h&&sprite.offset.x===0&&sprite.offset.y===0,textureLibraryRecordPresent:Array.isArray(texture.content?.mipmaps)&&texture.content.mipmaps.length>0,pass:ok});
}
const result={schema:'u02-r2-creator-import-readback/v1',checkedAt:new Date().toISOString(),creatorVersion:'3.8.8',status:errors.length?'FAIL':'PASS',checkedAssets:rows.length,bodyFrames:rows.filter(r=>r.kind==='body_frame').length,accessorySlices:rows.filter(r=>r.kind==='accessory_slice').length,errors,results:rows};
fs.writeFileSync(path.join(root,'deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261009-r2/creator-import-library-audit.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,checkedAssets:result.checkedAssets,bodyFrames:result.bodyFrames,accessorySlices:result.accessorySlices,errors},null,2));
if(errors.length)process.exit(1);
