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
assert(dialog.visibleButtons.has('下'), 'long dialog body exposes a downward scroll action');
let guard = 0;
while (dialog.visibleButtons.has('下') && guard++ < 300) {
  dialog.visibleButtons.get('下')(); drawDialog();
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
// Execute the actual proxy-timer HUD path, including its returned Label sizing.
const renderHelp = method('renderHelpAndExit', { view: { getVisibleSize: () => ({ width: 390, height: 844 }) }, remainingSeconds: () => 299 });
const renderHud = method('renderSafeHudButton', { view: { getVisibleSize: () => ({ width: 390, height: 844 }) }, UITransform: FakeTransform, Label: FakeLabel });
const hudButtons = [];
const hudLabel = new FakeLabel();
hudLabel.string = '04:59';
const hudTextNode = { getComponent(Type) { return Type === FakeLabel ? hudLabel : Type === FakeTransform ? hudTransform : null; } };
const hudTransform = new FakeTransform(); hudLabel.node = hudTextNode;
const hudHost = {
  modalActive: () => false, clockText: () => '04:59', proxyTimer: true, proxyTea: false, proxyMilk: false, proxyToppings: false, proxyFooterActions: false,
  run: {}, now: () => 1000, layoutFit: () => .5083, cssPerLocalAxes: () => ({ x: .5083, y: .5083 }),
  safeLocalRect: () => ({ x: -359.5, y: 800, width: 719, height: 1580 }),
  cssPerLocalAxes: () => ({ x: .5083, y: .5083 }),
  renderSafeHudButton(label, action, side, width, timerPrimary) {
    const x = side === 'left' ? -359.5 + 171 / 2 + 8 / .5083 : 359.5 - 171 / 2 - 8 / .5083;
    const y = 800 - 52 / .5083 / 2 - 8 / .5083;
    const visual = renderHud.call({
      hudRoot: { isValid: true }, root: {}, layoutFit: () => .5083,
      cssPerLocalAxes: () => ({ x: .5083, y: .5083 }), safeLocalRect: () => this.safeLocalRect(),
      button(parentNode, text, bx, by, bw, bh) { hudButtons.push({ text, x: bx, y: by, width: bw, height: bh, side }); return { children: [hudTextNode] }; },
    }, label, action, side, width, timerPrimary);
    assert(visual === hudLabel);
    return visual;
  },
};
renderHelp.call(hudHost, {});
assert.deepEqual(hudButtons.map(item => item.text), ['04:59', '操作'], 'proxy timer preserves both timer and operation/return entry path');
assert(hudLabel.fontSize * .5083 >= 24 && hudLabel.fontSize * .5083 >= 24, 'actual safe HUD timer label is at least 24 CSS px');
assert(hudLabel.lineHeight * .5083 >= 32, 'actual safe HUD timer line-height is at least 32 CSS px');
assert(hudTransform.height >= hudLabel.lineHeight, 'timer text node expands to contain its required line-height');
assert(hudButtons[0].side === 'left' && hudButtons[1].side === 'right', 'timer and operation entries remain on separated safe HUD sides');
const hudRenderedTargets = hudButtons.map((button, index) => ({ group: `HUD_RENDERED:${index}`, rect: {
  x: button.x * .5083 - button.width * .5083 / 2, y: button.y * .5083 - button.height * .5083 / 2,
  width: button.width * .5083, height: button.height * .5083,
} }));
assert.equal(helper.hasHitConflict(hudRenderedTargets, 8), false, 'actual rendered timer and operation hit regions retain an 8 CSS px gap');

// Execute the actual proxy classifier with numeric enum-like IDs. Unknown
// runtime IDs fail closed to a single operation-panel route instead of throwing.
const applyProxyGroups = method('applyProxyGroups', {});
const proxyFlags = { proxyTea: false, proxyMilk: false, proxyToppings: false, proxyFooterActions: false, proxyTimer: false };
applyProxyGroups.call(proxyFlags, [0, 2]);
assert.deepEqual(proxyFlags, { proxyTea: true, proxyMilk: true, proxyToppings: true, proxyFooterActions: true, proxyTimer: true },
  'numeric/mixed proxy IDs cannot throw and conservatively migrate every operation group');
const classifiedFlags = { proxyTea: false, proxyMilk: false, proxyToppings: false, proxyFooterActions: false, proxyTimer: false };
applyProxyGroups.call(classifiedFlags, ['TEA:tea-a', 'FOOTER:BTN_SERVE_BASE']);
assert(classifiedFlags.proxyTea && classifiedFlags.proxyFooterActions && !classifiedFlags.proxyMilk && !classifiedFlags.proxyToppings,
  'known string IDs still migrate only their affected groups');

// Construct a real Run from the shipped config, then execute the actual panel
// renderer during arrival/preparation and playing. The same panel selection
// action is blocked while presentation owns input and works when it releases it.
const Module = module.constructor;
function loadTsModule(id, file) {
  const tsJs = ts.transpile(fs.readFileSync(file, 'utf8'), { target: ts.ScriptTarget.ES2018, module: ts.ModuleKind.CommonJS });
  const mod = new Module(id, module); mod.filename = `${process.cwd()}/${id}.js`; mod.paths = module.paths; mod._compile(tsJs, mod.filename); return mod.exports;
}
const gameState = loadTsModule('milk_tea_state.execution', 'apps/client/assets/labs/u05/milk_tea_state.ts');
const presentationState = loadTsModule('u05_presentation.execution', 'apps/client/assets/labs/u05/u05_interaction_presentation.ts');
const config = JSON.parse(fs.readFileSync('apps/client/assets/resources/u05_milk_tea/config.json', 'utf8'));
const stage = config.difficulty_stages.find(item => item.tier_id === 'EASY' && item.stage_no === 1);
const actualRun = gameState.makeRun(config, stage, 1000, () => 0);
const actualTeaId = actualRun.optionPool.TEA[0].ingredient_id;
const renderPanel = method('renderOperationPanel', {
  view: { getVisibleSize: () => ({ width: 320, height: 568 }) },
  Color: class { constructor() {} }, TEXT: {}, GOLD: {},
  DIMENSIONS: ['TEA', 'MILK', 'TOPPING'], DIMENSION_NAMES: { TEA: '茶底', MILK: '奶类', TOPPING: '小料' },
  remainingSeconds: gameState.remainingSeconds, shouldLockInput: presentationState.shouldLockInput,
  clampScrollOffset: helper.clampScrollOffset, wrapTextByCodepoint: helper.wrapTextByCodepoint,
});
let currentPanelActions; let actualSelections = 0;
const panelController = {
  root: {}, run: actualRun, config, status: '', operationScroll: 0, tierIndex: 0, modalActions: new Set(),
  validation: { enabled: false }, proxyTea: true, proxyMilk: false, proxyToppings: false, proxyFooterActions: false,
  presentation: presentationState.createPresentationTransaction(1, 'arrival', 1000,
    { orderIndex: 0, recipeId: actualRun.orders[0].recipe_id, ingredients: {} }, 309),
  layoutFit: () => .45, cssPerLocalAxes: () => ({ x: .45, y: .45 }),
  safeLocalRect: () => ({ x: -350, y: 620, width: 700, height: 1240 }),
  renderModalScrim() {}, draw() {}, text(parentNode, value) { return value; },
  button(parentNode, label, x, y, width, height, action, enabled) {
    if (action) currentPanelActions.set(label, { action, enabled }); return {};
  },
  now: () => 1100, clockText: seconds => String(seconds),
  choose(dimension, id) { actualSelections += 1; this.run = gameState.selectIngredient(this.run, dimension, id, this.now()); },
  undo() {}, submit() {}, leave() {}, retry() {},
};
const tier = { tier_id: 'EASY', display_name: '简单', stages: [stage] };
currentPanelActions = new Map(); renderPanel.call(panelController, tier);
const teaRow = [...currentPanelActions.entries()].find(([label]) => label.startsWith('茶底：'));
assert(teaRow, 'actual preparation panel shows proxied tea options');
teaRow[1].action();
assert.equal(actualSelections, 0, 'actual arrival/preparation presentation continues to block panel selection');
assert.equal(panelController.run.selected.TEA, undefined, 'preparation leaves the real run selection unchanged');
panelController.presentation = null;
currentPanelActions = new Map(); renderPanel.call(panelController, tier);
const playingTeaRow = [...currentPanelActions.entries()].find(([label]) => label.startsWith('茶底：'));
assert(playingTeaRow, 'actual playing panel still exposes the same proxied tea action');
playingTeaRow[1].action();
assert.equal(actualSelections, 1, 'playing panel dispatches exactly one existing selection entry');
assert.equal(panelController.run.selected.TEA, actualTeaId, 'playing action updates the same real Run.selected');
assert(![...currentPanelActions.keys()].some(label => /[✓▲▼]/.test(label)), 'panel labels avoid BMFont-uncovered check/arrow glyphs');
const bitmapFontText = fs.readFileSync('apps/client/assets/resources/u05_milk_tea/u05_b/U05_ART_FONT.fnt', 'utf8');
const glyphIds = new Set(Array.from(bitmapFontText.matchAll(/char id=(\d+)/g), match => Number(match[1])));
for (const glyph of ['上', '下', '已选']) assert(Array.from(glyph).every(char => glyphIds.has(char.codePointAt(0))), `replacement label glyph ${glyph} exists in the approved bitmap font`);

console.log('PASS: actual renderSelection proxy branch, label sizing/wrapping, dialog scroll-to-tail, pointer handlers, numeric proxy IDs, real preparation/playing Run panel actions, CSS-axis geometry, 24/32 timer HUD, and bitmap glyph coverage.');
