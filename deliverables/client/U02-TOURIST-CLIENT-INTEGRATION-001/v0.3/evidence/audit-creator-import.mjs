import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), errors=[];
const read=p=>fs.readFileSync(path.join(root,p));
const json=p=>JSON.parse(read(p).toString('utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const mapPath='apps/client/assets/units/ghost-customer/data/ug_ghost_01_asset_map.json';
const auditPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/RESOURCE_AND_FRAME_AUDIT.json';
const map=json(mapPath), audit=json(auditPath), libraryResults=[];
for(const row of map.assets){
 const imageMeta=json(row.metaPath??`${row.clientPath}.meta`), base=`apps/client/library/${row.imageMainUuid.slice(0,2)}/${row.imageMainUuid}`;
 const imagePng=read(`${base}.png`), frameMeta=json(`${base}@f9941.json`), textureMeta=json(`${base}@6c48a.json`);
 const expectedW=row.canvas.width, expectedH=row.canvas.height;
 const frame=frameMeta.content, rect=frame.rect, original=frame.originalSize, offset=frame.offset;
 const result={stableId:row.stableId,kind:row.kind,imageUuid:row.imageMainUuid,textureUuid:row.texture2dUuid,spriteFrameUuid:row.spriteFrameUuid,
  imported:imageMeta.imported===true,imageUuidMatches:imageMeta.uuid===row.imageMainUuid,
  textureUuidMatches:imageMeta.subMetas?.['6c48a']?.uuid===row.texture2dUuid,
  spriteUuidMatches:imageMeta.subMetas?.f9941?.uuid===row.spriteFrameUuid,
  sourceSha256:row.clientSha256,libraryPngSha256:sha(imagePng),
  fullCanvas:rect.x===0&&rect.y===0&&rect.width===expectedW&&rect.height===expectedH&&original.width===expectedW&&original.height===expectedH&&offset.x===0&&offset.y===0,
  textureLibraryRecordPresent:Array.isArray(textureMeta.content?.mipmaps)&&textureMeta.content.mipmaps.length>0,
  librarySpriteJsonPath:`${base}@f9941.json`,librarySpriteJsonSha256:sha(read(`${base}@f9941.json`)),
  libraryImagePngPath:`${base}.png`,libraryImagePngBytes:imagePng.length};
 if(!result.imported||!result.imageUuidMatches||!result.textureUuidMatches||!result.spriteUuidMatches||result.sourceSha256.toLowerCase()!==result.libraryPngSha256||!result.fullCanvas||!result.textureLibraryRecordPresent)errors.push(`${row.stableId} failed imported Library identity/full-canvas check`);
 if(row.kind==='body_frame')row.creatorStatus='IMPORTED_LIBRARY_UUID_FULL_CANVAS_VERIFIED';
 libraryResults.push(result);
}
const bodyById=new Map(map.assets.filter(x=>x.kind==='body_frame').map(x=>[x.stableId,x]));
for(const body of audit.bodyResults){const row=bodyById.get(body.frameId);if(row)body.creatorImportStatus=row.creatorStatus;}
map.creatorImportAudit={status:errors.length?'FAIL':'PASS',checkedAt:new Date().toISOString(),creatorVersion:'3.8.8',checkedAssets:libraryResults.length,bodyFrameCount:map.assets.filter(x=>x.kind==='body_frame').length,accessorySliceCount:map.assets.filter(x=>x.kind==='accessory_slice').length,errors,results:libraryResults};
audit.creatorImport=errors.length?'IMPORT_AUDIT_FAILED':'IMPORTED_LIBRARY_VERIFIED';
audit.staticAudit.creatorImport=errors.length?'FAIL':'IMPORTED_LIBRARY_VERIFIED';
audit.staticAudit.creatorImportAudit={status:map.creatorImportAudit.status,checkedAssets:libraryResults.length,bodyFrames:map.creatorImportAudit.bodyFrameCount,accessorySlices:map.creatorImportAudit.accessorySliceCount,errors};
fs.writeFileSync(path.join(root,mapPath),JSON.stringify(map,null,2)+'\n');
fs.writeFileSync(path.join(root,auditPath),JSON.stringify(audit,null,2)+'\n');
const out={status:errors.length?'FAIL':'PASS',checkedAssets:libraryResults.length,bodyFrames:map.creatorImportAudit.bodyFrameCount,accessorySlices:map.creatorImportAudit.accessorySliceCount,errors,summary:libraryResults.slice(0,3)};
fs.writeFileSync(path.join(root,'deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/creator-import-library-audit.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));if(errors.length)process.exit(1);
