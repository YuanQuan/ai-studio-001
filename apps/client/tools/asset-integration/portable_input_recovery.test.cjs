#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const { build, isPortableInputExcluded } = require('./build_staging.cjs');

const ROOT = path.resolve(__dirname, '../../../..');
const FREEZE = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RESOURCE_STAGING_INPUT_FREEZE.json';
const ADDENDUM = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RESOURCE_STAGING_INPUT_FREEZE_ADDENDUM.json';
const AUTH = 'deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs/PORTABLE_INPUT_RECOVERY_AUTHORIZATION.json';
const DEFAULT_OVERRIDES = 'deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json';
const DEFAULT_BASELINE = '/private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix';
const DEFAULT_PORTABLE_STAGE = '/private/tmp/minigame-art-opt-integration-staging-v0.8-portable';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const overridesPath = path.resolve(process.argv[2] || path.join(ROOT, DEFAULT_OVERRIDES));
const baselineStage = path.resolve(process.argv[3] || DEFAULT_BASELINE);
const portableStage = path.resolve(process.argv[4] || DEFAULT_PORTABLE_STAGE);

function copyBytes(root, rel, bytes) {
  const target = path.join(root, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
}

function payloadInventory(stageRoot) {
  const entries = [];
  const includeFile = rel => !isPortableInputExcluded(rel);
  const walk = (dir, prefix) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name), rel = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.isFile() && includeFile(rel)) {
        const bytes = fs.readFileSync(full);
        entries.push({ path: rel, bytes: bytes.length, sha256: sha(bytes) });
      }
    }
  };
  walk(path.join(stageRoot, 'assets'), 'assets');
  walk(path.join(stageRoot, 'settings'), 'settings');
  const packagePath = path.join(stageRoot, 'package.json');
  if (fs.existsSync(packagePath)) {
    const bytes = fs.readFileSync(packagePath);
    entries.push({ path: 'package.json', bytes: bytes.length, sha256: sha(bytes) });
  }
  entries.sort((a, b) => a.path.localeCompare(b.path));
  return entries;
}

function inventoryDigest(entries) {
  return sha(Buffer.from(entries.map(row => `${row.path}\t${row.bytes}\t${row.sha256}`).join('\n')));
}

function main() {
  if (!fs.existsSync(baselineStage)) throw new Error(`v0.7 baseline staging is missing: ${baselineStage}`);
  if (!fs.existsSync(portableStage)) throw new Error(`v0.8 portable staging is missing: ${portableStage}`);
  const freeze = readJson(FREEZE), addendum = readJson(ADDENDUM), auth = readJson(AUTH);
  const ownerOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
  const recoveryByPath = new Map(auth.recoveries.map(item => [item.original_path, item]));
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'minigame-portable-cleanlike-'));
  const sourceRoot = path.join(tempRoot, 'source'), candidateStage = path.join(tempRoot, 'staging');
  const baselineHashes = new Map(freeze.files.map(item => [item.path, item.sha256]));
  for (const item of addendum.overrides ?? []) baselineHashes.set(item.path, item.sha256);
  for (const item of ownerOverrides.overrides ?? []) baselineHashes.set(item.path, item.sha256);
  const excluded = freeze.files.filter(item => isPortableInputExcluded(item.path));
  const dsCount = excluded.filter(item => item.path === '.DS_Store' || item.path.endsWith('/.DS_Store')).length;
  const profileCount = excluded.filter(item => item.path.startsWith('apps/client/profiles/')).length;
  const headInputs = [];

  try {
    if (dsCount !== 9 || profileCount !== 13 || excluded.length !== 22) {
      throw new Error(`frozen exclusions changed: .DS_Store=${dsCount}, profiles=${profileCount}, total=${excluded.length}`);
    }
    for (const entry of freeze.files) {
      if (isPortableInputExcluded(entry.path)) continue;
      const recovery = recoveryByPath.get(entry.path);
      let bytes;
      if (recovery) {
        bytes = execFileSync('git', ['show', `HEAD:${entry.path}`], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
        const actual = sha(bytes);
        if (actual !== recovery.HEAD_sha256) throw new Error(`HEAD fixture hash mismatch for ${entry.path}: ${actual}`);
        headInputs.push({ path: entry.path, headSha256: actual, authorizedFrozenSha256: recovery.expected_sha256 });
      } else {
        const sourcePath = path.join(ROOT, entry.path);
        if (!fs.existsSync(sourcePath)) throw new Error(`clean-like source input missing: ${entry.path}`);
        bytes = fs.readFileSync(sourcePath);
        const expected = baselineHashes.get(entry.path) ?? entry.sha256;
        if (sha(bytes) !== expected) throw new Error(`clean-like non-recovery input drift: ${entry.path}`);
      }
      copyBytes(sourceRoot, entry.path, bytes);
    }
    for (const addition of ownerOverrides.additions ?? []) {
      const sourcePath = path.join(ROOT, addition.path), bytes = fs.readFileSync(sourcePath);
      if (sha(bytes) !== addition.sha256) throw new Error(`owner addition hash mismatch: ${addition.path}`);
      copyBytes(sourceRoot, addition.path, bytes);
    }
    const excludedStillPresent = excluded.filter(item => fs.existsSync(path.join(sourceRoot, item.path)));
    if (excludedStillPresent.length) throw new Error(`excluded paths exist in clean-like tree: ${excludedStillPresent.map(x => x.path).join(', ')}`);

    const stageManifest = build(candidateStage, overridesPath, sourceRoot);
    if (stageManifest.excludedFrozenInputCount !== 22 || stageManifest.includedFrozenInputCount !== 689
      || stageManifest.portableRecoverySources.length !== 4
      || stageManifest.frozenInputRecoveries.length !== 4) {
      throw new Error('portable stage did not record the authorized 22 exclusions and four snapshot recoveries');
    }
    if (stageManifest.portableRecoverySources.some(item => item.sourceKind !== 'AUTHORIZED_FROZEN_SNAPSHOT'
      || item.liveSha256 !== headInputs.find(head => head.path === item.path)?.headSha256)) {
      throw new Error('portable stage did not recover exactly from the authorized snapshots after clean HEAD inputs');
    }
    const baseline = payloadInventory(baselineStage), candidate = payloadInventory(candidateStage), portable = payloadInventory(portableStage);
    const comparePayloads = (left, right, label) => {
      const leftByPath = new Map(left.map(item => [item.path, item]));
      const rightByPath = new Map(right.map(item => [item.path, item]));
      const mismatch = [];
      for (const [rel, item] of leftByPath) {
        const actual = rightByPath.get(rel);
        if (!actual || actual.bytes !== item.bytes || actual.sha256 !== item.sha256) mismatch.push({ path: rel, left: item, right: actual ?? null });
      }
      for (const [rel, item] of rightByPath) if (!leftByPath.has(rel)) mismatch.push({ path: rel, left: null, right: item });
      if (mismatch.length) throw new Error(`${label} payload mismatch (${mismatch.length} paths): ${JSON.stringify(mismatch.slice(0, 8))}`);
      return { equal: true, comparedFileCount: left.length, mismatchCount: 0 };
    };
    const baselineToCleanLike = comparePayloads(baseline, candidate, 'v0.7 vs clean-like');
    const baselineToPortable = comparePayloads(baseline, portable, 'v0.7 vs v0.8 portable');
    const strictGuardPath = 'apps/client/assets/resources/sakura_v03/tex_sakura_rr_far_l.png';
    const strictGuardBytes = fs.readFileSync(path.join(sourceRoot, strictGuardPath));
    copyBytes(sourceRoot, strictGuardPath, Buffer.concat([strictGuardBytes, Buffer.from([0]) ]));
    let strictGuardError = '';
    try { build(path.join(tempRoot, 'unauthorized-drift-stage'), overridesPath, sourceRoot); }
    catch (error) { strictGuardError = String(error.message || error); }
    assert.match(strictGuardError, /冻结输入漂移/);
    const report = { result: 'PASS', authorizationPath: AUTH, sourceRootKind: 'TEMPORARY_NON_GIT_CLEAN_LIKE_INPUT_TREE',
      sourceRoot: sourceRoot.replace(tempRoot, '<temporary>'), excluded: { dsStore: dsCount, editorProfiles: profileCount, total: excluded.length },
      recoveries: stageManifest.portableRecoverySources, baselineStage: baselineStage, portableStage,
      baselinePayload: { files: baseline.length, bytes: baseline.reduce((n, item) => n + item.bytes, 0), inventorySha256: inventoryDigest(baseline) },
      cleanLikePayload: { files: candidate.length, bytes: candidate.reduce((n, item) => n + item.bytes, 0), inventorySha256: inventoryDigest(candidate) },
      portablePayload: { files: portable.length, bytes: portable.reduce((n, item) => n + item.bytes, 0), inventorySha256: inventoryDigest(portable) },
      payloadComparisons: { v07EqualsCleanLike: baselineToCleanLike, v07EqualsPortable: baselineToPortable },
      unauthorizedNonRecoveryDriftRejected: { path: strictGuardPath, result: 'PASS', diagnostic: strictGuardError },
      excludedFromComparison: ['**/.DS_Store', 'apps/client/profiles/**', 'build-configs/**', 'generated evidence and STAGING_INPUT_MANIFEST.json'] };
    console.log(JSON.stringify(report, null, 2));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

try { main(); } catch (error) { console.error(`portable clean-like staging test failed: ${error.stack || error}`); process.exitCode = 1; }
