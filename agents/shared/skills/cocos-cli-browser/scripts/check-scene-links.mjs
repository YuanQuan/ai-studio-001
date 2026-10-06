#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const usage = 'check-scene-links.mjs --scene <file> [--keep-uuid <uuid>] [--forbid-uuid <uuid>]';
const options = { scene: null, keep: [], forbid: [] };
try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') { console.log(usage); process.exit(0); }
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (!['--scene', '--keep-uuid', '--forbid-uuid'].includes(flag)) throw new Error(`Unknown option: ${flag}`);
    const value = args[++i];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${flag}`);
    if (flag === '--scene') { if (options.scene) throw new Error('--scene provided more than once'); options.scene = value; }
    else options[flag === '--keep-uuid' ? 'keep' : 'forbid'].push(value);
  }
  if (!options.scene) throw new Error('--scene is required');
  const data = JSON.parse(await readFile(options.scene, 'utf8'));
  if (!Array.isArray(data) || data.length === 0) throw new Error('Expected a nonempty Creator serialized array');
  const errors = [];
  const uuids = new Map();
  let refs = 0;
  function visit(value, path) {
    if (value === null || typeof value !== 'object') return;
    if (Object.hasOwn(value, '__id__')) {
      refs++;
      const id = value.__id__;
      if (!Number.isInteger(id) || id < 0 || id >= data.length) errors.push(`${path}.__id__: invalid index ${JSON.stringify(id)}`);
      else if (data[id] === null || typeof data[id] !== 'object') errors.push(`${path}.__id__: target ${id} is not an object`);
    }
    if (Object.hasOwn(value, '__uuid__')) {
      if (typeof value.__uuid__ !== 'string' || !value.__uuid__) errors.push(`${path}.__uuid__: expected nonempty string`);
      else uuids.set(value.__uuid__, (uuids.get(value.__uuid__) || 0) + 1);
    }
    for (const [key, child] of Object.entries(value)) visit(child, `${path}[${JSON.stringify(key)}]`);
  }
  data.forEach((value, index) => visit(value, `$[${index}]`));
  const missingKeep = [...new Set(options.keep)].filter(uuid => !uuids.has(uuid));
  const forbiddenPresent = [...new Set(options.forbid)].filter(uuid => uuids.has(uuid));
  const ok = !errors.length && !missingKeep.length && !forbiddenPresent.length;
  console.log(JSON.stringify({
    status: ok ? 'STATIC_PASS' : 'STATIC_FAIL', scene: options.scene,
    objects: data.length, object_references: refs, structural_errors: errors,
    missing_required_uuids: missingKeep, forbidden_uuids_present: forbiddenPresent,
    seen_uuids: Object.fromEntries([...uuids].sort(([a], [b]) => a.localeCompare(b))),
    coverage: 'JSON array, reference index range/object target, exact supplied UUID presence/absence only',
    asset_resolution: 'NOT_CHECKED', engine_schema_and_relations: 'NOT_CHECKED',
    creator_import_build: 'NOT_TESTED', runtime: 'NOT_TESTED'
  }, null, 2));
  process.exitCode = ok ? 0 : 1;
} catch (error) {
  console.error(JSON.stringify({ status: 'INPUT_ERROR', message: error.message, usage }));
  process.exitCode = 2;
}
