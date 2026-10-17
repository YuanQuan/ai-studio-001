'use strict';
const fs = require('node:fs'), path = require('node:path');
const builder = require('../../../../../apps/client/tools/asset-integration/build_staging.cjs');
const repo = path.resolve(__dirname, '../../../../../');
const overridePath = path.join(repo, 'apps/client/tools/asset-integration/approved_png_overrides.json');
const overrides = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
const base = overrides.baseStagePath;
const temp = '/private/tmp/minigame-art-opt-png-negative-probes-v01';
fs.rmSync(temp, { recursive: true, force: true }); fs.mkdirSync(temp, { recursive: true });
function isolated(name) {
  const dir = path.join(temp, name), content = path.join(dir, 'content'); fs.mkdirSync(content, { recursive: true });
  for (const rel of [overrides.sourceIdentityPath, overrides.authorizationPath,
    ...overrides.assets.flatMap(x => [x.referencePath, x.candidatePath])]) {
    const src = path.join(repo, rel), dst = path.join(content, rel); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst);
  }
  return { dir, content };
}
const results = [];
function reject(name, invoke, out) {
  let message = null, rejected = false;
  try { invoke(); } catch (error) { rejected = true; message = error.message; }
  const destinationCreated = fs.existsSync(out);
  results.push({ name, rejected, message, destinationCreated, result: rejected && !destinationCreated ? 'PASS' : 'FAIL' });
}
{
  const x = isolated('candidate-bytes'); const p = path.join(x.content, overrides.assets[0].candidatePath); const b = fs.readFileSync(p); b[100] ^= 0xff; fs.writeFileSync(p, b);
  const out = path.join(x.dir, 'out'); reject('damaged_candidate_bytes', () => builder.applyApprovedPngOverridesFromFrozenStage(base, out, overridePath, repo, x.content), out);
}
{
  const x = isolated('identity-drift'); fs.appendFileSync(path.join(x.content, overrides.sourceIdentityPath), ' ');
  const out = path.join(x.dir, 'out'); reject('FILE_IDENTITY_drift', () => builder.applyApprovedPngOverridesFromFrozenStage(base, out, overridePath, repo, x.content), out);
}
for (const [name, mutate] of [
  ['duplicate_stable_ID', data => { data.assets[1].stableAssetId = data.assets[0].stableAssetId; }],
  ['out_of_scope_ID', data => { data.assets[0].stableAssetId = 'UNAPPROVED_ID'; }],
  ['wrong_base_stage_SHA', data => { data.baseStageManifestSha256 = '0'.repeat(64); }],
]) {
  const data = JSON.parse(JSON.stringify(overrides)); mutate(data);
  const override = path.join(temp, `${name}.json`), out = path.join(temp, `${name}-out`); fs.writeFileSync(override, JSON.stringify(data));
  reject(name, () => builder.applyApprovedPngOverridesFromFrozenStage(base, out, override, repo), out);
}
const report = { scope: 'temporary negative inputs only; formal stage/output paths remain untouched', results };
const target = path.join(__dirname, 'NEGATIVE_PROBES.json'); fs.writeFileSync(target, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (results.some(x => x.result !== 'PASS')) process.exit(2);
