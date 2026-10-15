const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = '/private/tmp/example-revision-20261015-assertions';
const { USER_LAYOUT_PROFILE } = require(path.join(base, 'u01/sakura_user_layout.js'));
const { deriveWaterGroups, sampleWaterGroupCenter, recaptureWaterGroupPositions } = require(path.join(base, 'u01/sakura_water_motion_math.js'));
const { createPresentationTransaction, freezeCupSnapshot, samplePresentation, interruptPresentationForTimeout } = require(path.join(base, 'u05/u05_interaction_presentation.js'));
const manifest = JSON.parse(fs.readFileSync('apps/client/assets/units/ghost-customer/frames/ug_ghost_01_frame_manifest.json', 'utf8'));
const report = { assertions: [], manifestDurationsMs: {}, waterGroups: [], outcomes: {} };
function check(name, fn) { fn(); report.assertions.push({ name, result: 'PASS' }); }
function near(a, b, epsilon = 1e-8) { assert.ok(Math.abs(a - b) <= epsilon, `${a} != ${b}`); }

check('批准53实例中识别7组完整河面三件组，空中5个flame_float未入组', () => {
  const groups = deriveWaterGroups(USER_LAYOUT_PROFILE.instances);
  assert.equal(USER_LAYOUT_PROFILE.instances.length, 53);
  assert.equal(groups.length, 7);
  assert.equal(groups.flatMap(group => group.memberIds).length, 21);
  assert.deepEqual(groups[0].memberIds, ['SAK-V03-023', 'SAK-V03-024', 'SAK-V03-025']);
  assert.deepEqual(groups[6].memberIds, ['SAK-V03-041', 'SAK-V03-042', 'SAK-V03-043']);
  assert.deepEqual(groups.map(group => group.direction), [1, -1, 1, -1, 1, -1, 1]);
  assert.equal(groups.some(group => group.memberIds.some(id => ['SAK-V03-009','SAK-V03-010','SAK-V03-011','SAK-V03-012','SAK-V03-013'].includes(id))), false);
  report.waterGroups = groups.map(group => ({ memberIds: group.memberIds, direction: group.direction }));
});
check('整组成员位置差不变，组速度为24源像素/秒且纵坐标固定', () => {
  const entries = USER_LAYOUT_PROFILE.instances;
  const groups = deriveWaterGroups(entries);
  for (const group of groups) {
    const members = group.memberIds.map(id => entries.find(entry => entry.instanceId === id));
    assert.equal(new Set(members.map(entry => `${entry.left}:${entry.top}:${entry.scale}`)).size, 1);
    const first = members[0]; const width = first.sourceSize.width * first.scale;
    const baseLeft = first.left - 1536;
    const baseCenter = baseLeft + width / 2;
    near(sampleWaterGroupCenter(baseLeft, width, group.direction, 0), baseCenter);
    near(sampleWaterGroupCenter(baseLeft, width, group.direction, 1) - baseCenter, group.direction * 24);
    const travelSeconds = (3072 + width) / 24;
    near(sampleWaterGroupCenter(baseLeft, width, group.direction, travelSeconds), baseCenter);
    const sharedOffset = sampleWaterGroupCenter(baseLeft, width, group.direction, 2) - baseCenter;
    const movedXs = members.map(entry => entry.left + sharedOffset);
    assert.deepEqual(movedXs.map((x, i) => x - members[i].left), Array(3).fill(sharedOffset));
    assert.deepEqual(members.map(entry => entry.top), Array(3).fill(first.top));
  }
});
check('长运行跨越多次离场循环后同组三件仍共享唯一偏移且保持固定y', () => {
  const entries = USER_LAYOUT_PROFILE.instances;
  for (const group of deriveWaterGroups(entries)) {
    const members = group.memberIds.map(id => entries.find(entry => entry.instanceId === id));
    const first = members[0]; const width = first.sourceSize.width * first.scale;
    const baseLeft = first.left - 1536; const baseCenter = baseLeft + width / 2;
    const travelSeconds = (3072 + width) / 24;
    const elapsed = travelSeconds * 3 + 5.75;
    const center = sampleWaterGroupCenter(baseLeft, width, group.direction, elapsed);
    const offset = center - baseCenter;
    assert.ok(Number.isFinite(center));
    assert.ok(Math.abs(offset) <= 3072 + width);
    assert.deepEqual(members.map(entry => entry.top), Array(3).fill(first.top));
    assert.deepEqual(members.map(() => offset), Array(3).fill(offset));
  }
});
check('U01编辑成员后重抓基线，下一帧不会沿用旧累计偏移', () => {
  const oldBase = [-1021, -1021, -1021];
  const lastAppliedOffset = 48;
  const visuallyMoved = oldBase.map(x => x + lastAppliedOffset);
  visuallyMoved[2] = oldBase[2] + 12;
  const recaptured = recaptureWaterGroupPositions(visuallyMoved, 2, lastAppliedOffset);
  assert.deepEqual(recaptured, oldBase.map((x, i) => i === 2 ? x + 12 : x));
  const left = Math.min(...recaptured.map(x => x - 65));
  const right = Math.max(...recaptured.map(x => x + 65));
  const center = left + (right - left) / 2;
  near(sampleWaterGroupCenter(left, right - left, 1, 0), center);
});

const actualHappy = manifest.frames.filter(frame => frame.action === 'happy').reduce((sum, frame) => sum + frame.durationMs, 0);
const actualSad = manifest.frames.filter(frame => frame.action === 'sad').reduce((sum, frame) => sum + frame.durationMs, 0);
report.manifestDurationsMs = { happy: actualHappy, sad: actualSad };
assert.equal(actualHappy, 1400); assert.equal(actualSad, 2800);
const snapshot = freezeCupSnapshot(0, 'recipe_1', {});
const duration = { happyMs: actualHappy, sadMs: actualSad };
const transaction = (result, at = 0, x = 309) => createPresentationTransaction(1, result, at, snapshot, x);
check('happy完整播放1.4秒，再按原时序离场', () => {
  assert.equal(samplePresentation(transaction('correct'), 649, undefined, duration).phase, 'synthesis');
  assert.equal(samplePresentation(transaction('correct'), 650, undefined, duration).phase, 'happy');
  assert.equal(samplePresentation(transaction('correct'), 2049, undefined, duration).phase, 'happy');
  assert.equal(samplePresentation(transaction('correct'), 2050, undefined, duration).phase, 'depart');
  assert.equal(samplePresentation(transaction('correct'), 2500, undefined, duration).phase, 'arrive');
  assert.equal(samplePresentation(transaction('won'), 2500, undefined, duration).complete, true);
});
check('sad完整播放2.8秒，错误后恢复、超时后离场', () => {
  assert.equal(samplePresentation(transaction('wrong'), 650, undefined, duration).phase, 'disappointed');
  assert.equal(samplePresentation(transaction('wrong'), 3449, undefined, duration).phase, 'disappointed');
  assert.equal(samplePresentation(transaction('wrong'), 3450, undefined, duration).complete, true);
  assert.equal(samplePresentation(transaction('expired'), 2799, undefined, duration).phase, 'disappointed');
  assert.equal(samplePresentation(transaction('expired'), 2800, undefined, duration).phase, 'depart');
  assert.equal(samplePresentation(transaction('expired'), 3250, undefined, duration).complete, true);
});
check('超时可使中途表现事务失效并从超时观察时刻开始sad', () => {
  const active = transaction('correct');
  const now = 900;
  const currentX = samplePresentation(active, now, undefined, duration).customerX;
  const expired = interruptPresentationForTimeout(active, 2, now, currentX);
  assert.notEqual(expired.epoch, active.epoch);
  assert.equal(samplePresentation(expired, now, undefined, duration).phase, 'disappointed');
  assert.equal(samplePresentation(expired, now + 2800, undefined, duration).phase, 'depart');
  assert.equal(active.result, 'correct');
});
check('退出表现仅离场，动画采样不拥有结算或奖励副作用', () => {
  const exited = transaction('exited');
  assert.equal(samplePresentation(exited, 449, undefined, duration).phase, 'depart');
  assert.equal(samplePresentation(exited, 450, undefined, duration).complete, true);
  assert.equal(Object.isFrozen(exited), true);
});
check('won在提交时唯一结算，表现完成回调无结算调用', () => {
  const labSource = fs.readFileSync('apps/client/assets/labs/u05/milk_tea_lab.ts', 'utf8');
  const finishStart = labSource.indexOf('private finishPresentation(): void {');
  const finishEnd = labSource.indexOf('\n  private renderCategoryLabels', finishStart);
  assert.ok(finishStart >= 0 && finishEnd > finishStart);
  const finishBody = labSource.slice(finishStart, finishEnd);
  assert.equal((labSource.match(/settleWin\(this\.config!/g) ?? []).length, 1);
  assert.equal(finishBody.includes('settleWin('), false);
  assert.equal(finishBody.includes('lastXp'), false);
  assert.equal(samplePresentation(transaction('won'), 2500, undefined, duration).complete, true);
});
report.outcomes = { result: 'PASS', note: '纯逻辑及结算路径源码断言通过；Creator与IAB运行另行记录。' };
process.stdout.write(JSON.stringify(report, null, 2));
