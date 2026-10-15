"""Read-only exact comparison of the frozen U01 user export and actual IAB exports."""
import argparse, hashlib, json, pathlib, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[4]
USER=ROOT/'deliverables/master/U01-USER-LAYOUT-20261015/v0.1/USER_LAYOUT.json'
args_parser=argparse.ArgumentParser()
args_parser.add_argument('exports',nargs='+',type=pathlib.Path)
args=args_parser.parse_args()
expected=json.loads(USER.read_text())
issues=[]
if hashlib.sha256(USER.read_bytes()).hexdigest()!='f34af020733b3ad095c7845d028f8acdfcf5a00fee30ea7a01c547bfac02a364':issues.append('frozen user hash changed')
for export_path in args.exports:
 actual=json.loads(export_path.read_text())
 if actual!=expected:
  if actual.keys()!=expected.keys():issues.append(f'{export_path}: top-level keys differ')
  if actual.get('prototypes')!=expected['prototypes']:issues.append(f'{export_path}: prototypes differ')
  a=actual.get('instances',[]);e=expected['instances']
  if len(a)!=51:issues.append(f'{export_path}: instance count {len(a)}')
  for i,(want,got) in enumerate(zip(e,a)):
   if got!=want:
    fields=sorted(k for k in want.keys()|got.keys() if want.get(k)!=got.get(k))
    issues.append(f'{export_path}: instance {i} {want.get("instanceId")} fields {fields}')
  for key in ('schema','temporaryPreview','sourceVersion','canvas','counts'):
   if actual.get(key)!=expected.get(key):issues.append(f'{export_path}: {key} differs')
shared_paths=['apps/client/assets/labs/u01/sakura_v03_layout.ts','apps/client/assets/labs/u01/sakura_v03_environment.ts','apps/client/assets/UnitSampleGallery.ts']
shared=[]
for rel in shared_paths:
 path=ROOT/rel
 old=subprocess.check_output(['git','show',f'HEAD:{rel}'],cwd=ROOT)
 same=path.read_bytes()==old
 shared.append({'path':rel,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'equal_to_HEAD':same})
 if not same:issues.append(f'shared source changed {rel}')
print(json.dumps({'frozen_sha256':hashlib.sha256(USER.read_bytes()).hexdigest(),'export_count':len(args.exports),'all_exports_exact_equal_user':not any('instance ' in x or 'prototypes' in x or 'top-level' in x or any(f': {k} differs' in x for k in ('schema','temporaryPreview','sourceVersion','canvas','counts')) for x in issues),'shared_sources':shared,'result':'PASS' if not issues else 'FAIL','issues':issues},ensure_ascii=False,indent=2))
