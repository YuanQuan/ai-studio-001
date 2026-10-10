from pathlib import Path
import hashlib,json,shutil,sys
ROOT=Path.cwd();MAIN=ROOT/'deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1';TASK=sys.argv[1]
if TASK not in ('ACAJ','ADXJ'):raise SystemExit('batch name')
SRC=ROOT/f'deliverables/art/U04-DIALOGUE-{TASK}-BATCH-001/v0.1'
if not (SRC/'DELIVERABLE.json').exists():raise SystemExit('support DELIVERABLE absent')
log=[]
for folder in ['source','exports']:
 for p in sorted((SRC/folder).rglob('*')):
  if not p.is_file():continue
  rel=p.relative_to(SRC);dest=MAIN/rel;src_hash=hashlib.sha256(p.read_bytes()).hexdigest()
  if dest.exists():
   old=hashlib.sha256(dest.read_bytes()).hexdigest()
   if old!=src_hash:raise SystemExit(f'COLLISION {rel} {old} {src_hash}')
   copied=False
  else:
   dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest);copied=True
  dst_hash=hashlib.sha256(dest.read_bytes()).hexdigest()
  if dst_hash!=src_hash:raise SystemExit(f'COPY HASH FAIL {rel}')
  log.append({'support_path':str(p.relative_to(ROOT)),'main_path':str(dest.relative_to(ROOT)),'sha256':src_hash,'byte_equal':True,'copied_now':copied})
manifest={'support_task':f'U04-DIALOGUE-{TASK}-BATCH-001','support_deliverable_sha256':hashlib.sha256((SRC/'DELIVERABLE.json').read_bytes()).hexdigest(),'source_document_paths':{name:str((SRC/name).relative_to(ROOT)) for name in ['ASSET_MANIFEST.json','LAYER_EXPORT_MAP.json','PSD_VALIDATION.json','COMBINATION_CHECK.json','DELIVERABLE.json']},'copy_count':len(log),'copies':log,'status':'HASH_VERIFIED_COPY_ONLY'}
out=MAIN/'source'/f'integration_{TASK.lower()}_copy_log.json';out.write_text(json.dumps(manifest,ensure_ascii=False,indent=2));print(TASK,'copied',sum(x['copied_now'] for x in log),'verified',len(log),'log',out.relative_to(ROOT))
