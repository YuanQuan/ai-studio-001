const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/app.asar.unpacked/node_modules/typescript/lib/typescript.js');
const source = fs.readFileSync('apps/client/assets/labs/u05/milk_tea_lab.ts', 'utf8');
const helperSource = fs.readFileSync('apps/client/assets/labs/u05/u05_accessibility.ts', 'utf8');
const helperJs = ts.transpileModule(helperSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const helperModule = new (module.constructor)('u05_accessibility.generated', module);
helperModule.filename = `${process.cwd()}/u05_accessibility.generated.js`; helperModule.paths = module.paths; helperModule._compile(helperJs, helperModule.filename);
const helper = helperModule.exports;
const sf = ts.createSourceFile('milk_tea_lab.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
let cls;
function findClass(node) {
  if (ts.isClassDeclaration(node) && node.name?.text === 'U05MilkTeaLab') cls = node;
  ts.forEachChild(node, findClass);
}
findClass(sf);
assert(cls, 'U05MilkTeaLab class exists');
function method(name, injections) {
  const item = cls.members.find(member => ts.isMethodDeclaration(member) && member.name?.getText(sf).replace(/['"`]/g, '') === name);
  assert(item?.body, `actual ${name} method exists`);
  const params = item.parameters.map(parameter => parameter.getText(sf)).join(', ');
  const js = ts.transpileModule(`function ${name}(${params}) ${item.body.getText(sf)}`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  return new Function(...Object.keys(injections), `${js}; return ${name};`)(...Object.values(injections));
}

// Execute the actual narrow-layout selection branch, which previously read
// render() locals that do not exist in renderSelection().
const selectionCalls = [];
const renderSelection = method('renderSelection', {
  TIER_IDS: ['EASY', 'NORMAL', 'HARD', 'EXPERT', 'MASTER'],
  TIER_NAMES: { EASY: '简单', NORMAL: '普通', HARD: '困难', EXPERT: '专家', MASTER: '大师' },
  ORDER_BUBBLE_CENTER: [620, 425], ORDER_BUBBLE_SIZE: [300, 188], DEEP_BROWN: {}, TEXT: {}, GOLD: {},
  chooseStage: () => ({ stage_no: 1, time_sec: 60, tea_options: 1, milk_options: 1, topping_options: 2 }),
  isUnlocked: () => true,
  view: { getVisibleSize: () => ({ width: 390, height: 844 }) },
});
const selection = {
  proxySelection: true, operationPanel: false, config: {}, tierIndex: 0, validation: { enabled: false, stage: null },
  toggleValidation: false, status: '', statusColor: {}, root: {},
  readSessionProgress: () => ({ xp: 0, cleared: [] }), safeLocalRect: () => ({ x: -350, y: 500, width: 700, height: 1000 }),
  layoutFit: () => .5083, cssPerLocalAxes: () => ({ x: .5083, y: .5083 }),
  text: (...args) => selectionCalls.push(['text', ...args]), sourceText: (...args) => selectionCalls.push(['sourceText', ...args]),
  button: (...args) => selectionCalls.push(['button', ...args]), renderSafeHudButton: (...args) => selectionCalls.push(['hud', ...args]),
  renderCustomerWindow: () => {}, showAsset: () => {}, renderIngredientGallery: () => {}, showCupComposition: () => {},
  sourcePos: () => ({ x: 0, y: 0 }), beginRun: () => {}, leave: () => {}, dirty: false,
};
renderSelection.call(selection, { tier_id: 'EASY', display_name: '简单', stages: [{}] });
assert.deepEqual(selectionCalls.filter(call => call[0] === 'hud').map(call => call[1]), ['返回菜单', '操作']);

// Execute the real text() method with lightweight Cocos component doubles.
class FakeTransform { setContentSize(width, height) { this.width = width; this.height = height; } }
class FakeLabel { static Overflow = { CLAMP: 1 }; static HorizontalAlign = { CENTER: 1 }; static VerticalAlign = { CENTER: 1 }; }
class FakeNode {
  constructor(name) { this.name = name; this.children = []; this.components = []; }
  addChild(child) { this.children.push(child); }
  setPosition() {}
  addComponent(Type) { const component = Type === FakeTransform ? new FakeTransform() : new FakeLabel(); component.node = this; this.components.push(component); return component; }
}
const textMethod = method('text', {
  Node: FakeNode, UITransform: FakeTransform, Label: FakeLabel,
  view: { getVisibleSize: () => ({ width: 390, height: 844 }) },
  layoutAccessibleText: helper.layoutAccessibleText,
  U05BitmapText: { bindLabel() { return { missing: [] }; } },
});
const textFake = {
  layoutFit: () => .5083, viewportSnapshot: { content: { width: 390, height: 844 } }, bitmapFont: null,
};
const parent = new FakeNode('parent');
const longId = `错误：订单 ${'LONG-ERROR-ID-'.repeat(12)} 完整尾标记 END-TAIL`;
const label = textMethod.call(textFake, parent, longId, 0, 0, 21, {}, 120, 16);
const transform = label.node.components.find(component => component instanceof FakeTransform);
assert(label.fontSize * .5083 >= 16, 'actual label method keeps the body font readable in CSS pixels');
assert(transform.height >= label.lineHeight * label.string.split('\n').length, 'actual label method expands the text box for every wrapped line');
assert(label.string.replace(/\n/g, '').includes('END-TAIL'), 'actual label method keeps the complete long ID');

// Execute the actual safe dialog flow and repeatedly invoke its real scroll
// actions until the trailing marker is rendered.
const Color = class { constructor() {} };
const dialogMethod = method('renderSafeDialog', {
  view: { getVisibleSize: () => ({ width: 390, height: 844 }) },
  Color, GOLD: {}, TEXT: {}, clampScrollOffset: helper.clampScrollOffset,
  layoutAccessibleText: helper.layoutAccessibleText,
});
const dialog = {
  root: {}, scrollOffset: 0, dirty: false, actions: new Map(), modalActions: new Set(),
  layoutFit: () => .5083, cssPerLocalAxes: () => ({ x: .5083, y: .5083 }),
  safeLocalRect: () => ({ x: -700, y: 800, width: 1400, height: 1600 }), renderModalScrim() {},
  draw() {}, text(parentNode, value) { this.visibleText.push(value); return {}; },
  button(parentNode, labelText, x, y, w, h, action) { this.visibleButtons.set(labelText, action); return {}; },
  visibleText: [], visibleButtons: new Map(),
};
const completeBody = `完整正文 ${'错误详情和长标识 '.repeat(180)} BODY-END-MARKER`;
function drawDialog() {
  dialog.visibleText = []; dialog.visibleButtons = new Map();
  dialogMethod.call(dialog, '结果说明', [{ text: completeBody }], () => {}, [{ label: '关闭', action: () => {} }]);
}
drawDialog();
assert(dialog.visibleButtons.has('▼'), 'long dialog body exposes a downward scroll action');
let guard = 0;
while (dialog.visibleButtons.has('▼') && guard++ < 300) {
  dialog.visibleButtons.get('▼')(); drawDialog();
}
assert(guard < 300, 'dialog scrolling reaches its final content item');
assert(dialog.visibleText.some(line => line.includes('BODY-END-MARKER')), 'actual dialog method renders the full trailing text');

// Exercise the actual mouse/touch handlers and shared pointer state machine.
const EventMouse = { BUTTON_LEFT: 0 };
const handlers = {};
for (const name of ['mouseDown', 'mouseMove', 'mouseUp', 'touchStart', 'touchMove', 'touchEnd', 'touchCancel', 'pointerStart', 'pointerMove', 'pointerEnd', 'pointerMoveDistance']) {
  handlers[name] = method(name, { EventMouse, view: { getVisibleSize: () => ({ width: 390, height: 844 }) } });
}
const target = {};
let activations = 0;
const pointer = {
  pointerDowns: new Map(), interactionGeneration: 4, lastTouchAt: 0,
  viewportSnapshot: { revision: 9, content: { width: 390, height: 844 } }, actions: new Map([[target, () => activations++]]),
  hit: () => target,
};
for (const name of Object.keys(handlers)) pointer[name] = (...args) => handlers[name].apply(pointer, args);
function invoke(name, ...args) { return handlers[name].apply(pointer, args); }
const mouseEvent = (x, y) => ({ getButton: () => EventMouse.BUTTON_LEFT, getUILocation: () => ({ x, y }) });
invoke('mouseDown', mouseEvent(10, 10)); invoke('mouseMove', mouseEvent(30, 10)); invoke('mouseMove', mouseEvent(10, 10)); invoke('mouseUp', mouseEvent(10, 10));
assert.equal(activations, 0, 'drag beyond 8 CSS px remains cancelled after returning to the same target');
const touch = (id, x = 10, y = 10) => ({ getID: () => id, getUILocation: () => ({ x, y }) });
invoke('touchStart', touch(1)); invoke('touchStart', touch(2)); invoke('touchEnd', touch(2)); invoke('touchEnd', touch(1));
assert.equal(activations, 0, 'a second touch cannot replace the first pointer target');
invoke('touchStart', touch(3)); invoke('touchCancel', touch(3)); invoke('touchEnd', touch(3));
assert.equal(activations, 0, 'platform touch cancellation clears the pending action');
invoke('touchStart', touch(4)); invoke('touchEnd', touch(4));
assert.equal(activations, 1, 'a same-pointer short tap still activates its original target');

// Execute the actual screen-space hit geometry methods and cross-group/HUD
// collision collector for a narrow, nonuniform CSS projection.
const geometryMethods = {};
const itemSizes = { U05_B_T01: [100, 60], U05_B_T02: [100, 60], BTN_RECIPE_BASE: [323, 105], BTN_UNDO_BASE: [222, 105], BTN_SERVE_BASE: [362, 105] };
const labels = {
  TEA: [[129.5, 586, 131, 44], [129.5, 787.5, 131, 45], [129.5, 992.5, 131, 45]],
  MILK: [[909, 586.5, 130, 45], [909, 787.5, 130, 45], [909, 992.5, 130, 45]],
  TOPPING: [[342.5, 943.5, 123, 45], [516.5, 943.5, 123, 45], [690.5, 943.5, 123, 45], [342.5, 1062, 123, 44], [516.5, 1062, 123, 44], [690.5, 1062, 123, 44]],
};
for (const name of ['dimensionHitTargets', 'footerActionHitTargets', 'safeHudHitTargets']) {
  geometryMethods[name] = method(name, {
    view: { getVisibleSize: () => ({ width: 390, height: 844 }) },
    layoutAccessibleText: helper.layoutAccessibleText,
    hasHitConflict: helper.hasHitConflict,
    LABEL_POSITIONS: labels, ASSET_SIZES: itemSizes, ingredientAsset: item => item.assetKey,
  });
}
const geometry = {
  config: { ingredients: [
    { ingredient_id: 'tea-a', dimension: 'TEA', sort_order: 1, name: '红茶', assetKey: 'U05_B_T01' },
    { ingredient_id: 'tea-b', dimension: 'TEA', sort_order: 2, name: '绿茶', assetKey: 'U05_B_T02' },
  ] },
  viewportSnapshot: { content: { width: 390, height: 844 } },
  layoutFit: () => .25, cssPerLocalAxes: () => ({ x: .3, y: .2 }), safeLocalRect: () => ({ x: -350, y: 500, width: 700, height: 1000 }),
  minTouchSize: () => ({ width: 48 / .3, height: 48 / .2 }),
};
const dimensionTargets = geometryMethods.dimensionHitTargets.call(geometry, 'TEA', 2);
const footerTargets = geometryMethods.footerActionHitTargets.call(geometry);
const hudTargets = geometryMethods.safeHudHitTargets.call(geometry, 2);
const conflicts = helper.conflictingHitGroups([...dimensionTargets, ...footerTargets, ...hudTargets]);
assert(conflicts.some(group => group.startsWith('TEA:')), 'small tea labels/hit geometry participates in cross-target proxy measurement');
assert(conflicts.some(group => group.startsWith('HUD:')), 'independent HUD geometry is checked against active hit targets');
assert(conflicts.some(group => group.startsWith('FOOTER:')), 'footer actions participate in cross-group collision checks');
console.log('PASS: actual renderSelection proxy branch, label sizing/wrapping, dialog scroll-to-tail, mouse/touch pointer handlers, and CSS-axis target/HUD geometry methods.');

const timerLabel = textMethod.call(textFake, new FakeNode("timer"), "00:59", 0, 0, 24, {}, 300, 120);
console.log(JSON.stringify({timerActualFontCss: timerLabel.fontSize * .5083, timerRequiredFontCss:24, timerActualLineCss: timerLabel.lineHeight * .5083, timerRequiredLineCss:32, scope:"actual text method used by generic HUD button at narrow contain scale"}, null, 2));
