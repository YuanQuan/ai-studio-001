const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/editor-native-scene/node_modules/typescript/lib/typescript.js');
const source = fs.readFileSync('apps/client/assets/labs/u05/u05_accessibility.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const Module = module.constructor; const mod = new Module('u05_accessibility.generated', module);
mod.filename = process.cwd() + '/u05_accessibility.generated.js'; mod.paths = module.paths; mod._compile(js, mod.filename);
const { hitBox, hasHitConflict, needsProxy, clampScrollOffset, minimumFontLocalAxes, minimumHitLocalAxes, resolveHitCandidates, containInSafe, wrapTextByCodepoint } = mod.exports;
assert.deepEqual(hitBox(30, 20), { x: 0, y: 0, width: 48, height: 48 });
assert.equal(minimumFontLocalAxes(12, .5, .4, 16), 40, 'body font uses the stricter axis and reaches 16 CSS px in both axes');
assert.equal(minimumFontLocalAxes(10, .5, .4, 14), 35, 'helper font reaches 14 CSS px in both axes');
const nonuniformHit = minimumHitLocalAxes(35.93, 20, 1, 48 / 35.93);
assert.equal(nonuniformHit.width, 48, 'nonuniform CSS projection expands the physical width to 48px');
assert.equal(nonuniformHit.height, 48 / (48 / 35.93), 'height is independently calibrated against its CSS axis');
assert(nonuniformHit.width * 1 >= 48 && nonuniformHit.height * (48 / 35.93) >= 48, 'both projected hit axes reach 48 CSS px');
const asymmetricR = { x: -180, y: -420, width: 360, height: 780 };
const fit = containInSafe(asymmetricR, 720, 1080);
assert.equal(fit.centerX, 0); assert.equal(fit.centerY, -30); assert.equal(fit.scale, .5);
assert(fit.centerY - 1080 * fit.scale / 2 >= asymmetricR.y, 'art bottom stays inside asymmetric safe R');
assert(fit.centerY + 1080 * fit.scale / 2 <= asymmetricR.y + asymmetricR.height, 'art top stays below safe/capsule cut');
assert.equal(hasHitConflict([
  { group: 'a', rect: { x: 0, y: 0, width: 48, height: 48 } },
  { group: 'b', rect: { x: 56, y: 0, width: 48, height: 48 } },
]), false, 'targets with an 8 CSS px gap remain in place');
assert.equal(needsProxy([
  { group: 'top-a', rect: { x: 0, y: 0, width: 48, height: 48 } },
  { group: 'top-b', rect: { x: 0, y: 40, width: 48, height: 48 } },
]), true, 'the overlapping small-screen topping targets migrate as a group');
const toppingTargets = (count, cssScale) => {
  const points = [[342,892],[516,894],[690,896],[342,1008],[516,1012],[690,1010]];
  const labels = [[342.5,943.5,123,45],[516.5,943.5,123,45],[690.5,943.5,123,45],[342.5,1062,123,44],[516.5,1062,123,44],[690.5,1062,123,44]];
  return points.slice(0,count).map(([x,y], i) => {
    const [lx,ly,lw,lh]=labels[i], aw=139, ah=[72,69,64,67,62,66][i];
    const left=Math.min(x-aw/2,lx-lw/2), right=Math.max(x+aw/2,lx+lw/2);
    const top=Math.min(y-ah/2,ly-lh/2), bottom=Math.max(y+ah/2,ly+lh/2);
    const box=hitBox((right-left)*720/1024*cssScale,(bottom-top)*720/1024*cssScale);
    const cx=(left+right)/2*720/1024*cssScale, cy=-(top+bottom)/2*720/1024*cssScale;
    return {group:`p${i}`,rect:{x:cx-box.width/2,y:cy-box.height/2,width:box.width,height:box.height}};
  });
};
assert.equal(needsProxy(toppingTargets(3, .5)), false, 'three top-row toppings remain in place');
assert.equal(needsProxy(toppingTargets(4, .5)), true, 'fourth topping creates a real cross-row overlap');
assert.equal(needsProxy([
  { group: 'tea', rect: { x: 0, y: 0, width: 48, height: 48 } },
  { group: 'milk', rect: { x: 100, y: 0, width: 48, height: 48 } },
]), false, 'separated ingredient columns stay at their approved positions');
assert.equal(clampScrollOffset(99, 11, 4), 7);
assert.equal(clampScrollOffset(3, 2, 5), 0, 'resize clamps scroll when all rows fit');
assert.deepEqual(wrapTextByCodepoint('状态：等待中 ABC', 6), ['状态：等待中', ' ABC']);
const background = { id: 'underlay' }, overlay = { id: 'dialog' };
assert.deepEqual([...resolveHitCandidates(true, [background, overlay], [overlay])], [overlay], 'modal input cannot fall through to underlying controls');
assert.deepEqual([...resolveHitCandidates(false, [background, overlay], [overlay])], [background, overlay]);
console.log('PASS: CSS hit sizing, 8px separation, topping proxy collision, preserved independent groups, scroll clamp, font floor, complete status wrapping, asymmetric safe/capsule contain, and modal hit isolation.');
