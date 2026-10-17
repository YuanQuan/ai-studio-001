const fs = require('fs');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const galleryPath = 'apps/client/assets/UnitSampleGallery.ts';
const editorPath = 'apps/client/assets/labs/u01/sakura_layout_editor.ts';
const readerPath = 'apps/client/assets/framework/ui/scrollable_text_panel.ts';

function method(file, name) {
  const source = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  let found;
  function walk(node) {
    if (ts.isMethodDeclaration(node) && node.name.getText(sf) === name) found = node.body.getText(sf).slice(1, -1);
    ts.forEachChild(node, walk);
  }
  walk(sf);
  if (!found) throw new Error(`method not found: ${name}`);
  return found;
}
function run(code, names, values, args = []) {
  const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
  return Function(...names, `return function(${args.join(',')}) { ${js} }`)(...values);
}
function component(size = { width: 0, height: 0 }) {
  return { contentSize: size, setContentSize(width, height) { this.contentSize = { width, height }; this.width = width; this.height = height; } };
}
function node(name = '') {
  const transform = component();
  const label = { fontSize: 0, lineHeight: 0, string: '', overflow: 0 };
  const graphics = { clear() {}, rect(x, y, width, height) { this.rectValue = { x, y, width, height }; }, roundRect() {}, fill() {}, stroke() {} };
  return {
    name, isValid: true, active: true, activeInHierarchy: true, children: [], position: { x: 0, y: 0 }, scale: { x: 1, y: 1 },
    getComponent(type) { if (type === UITransform) return transform; if (type === Label) return label; if (type === Graphics) return graphics; return null; },
    getChildByName(childName) { return this.children.find(child => child.name === childName) || null; },
    setContentSize(w, h) { transform.setContentSize(w, h); }, setPosition(x, y) { this.position = { x, y }; },
    setScale(x, y) { this.scale = { x, y }; }, setParent(parent) { this.parent = parent; },
  };
}
const UITransform = {}, Graphics = {}, Label = { Overflow: { CLAMP: 1 }, HorizontalAlign: { LEFT: 1 }, VerticalAlign: { TOP: 1 } };
const Color = class { constructor(...values) { this.values = values; } };
const view = { getVisibleSize() { return { width: 720, height: 1280 }; } };
const checks = {};

// Exercise the actual U04 layout method through nav placement with asymmetric safe insets.
{
  let code = method(galleryPath, 'layoutDialogue');
  code = code.slice(0, code.indexOf('    const panel=this.u04Panel'));
  const controls = node('U04Controls'), back = node('Button_返回菜单'), title = node('U04Title'), people = node('Button_人物与表情');
  const stage = node('U04DialogueScene'); stage.children.push(controls);
  const obj = { u04Portrait: { isValid: true }, page: { getChildByName: () => stage }, safeUiBounds: () => ({ left: -132, right: 176, bottom: -260, top: 270 }),
    uiPixels: x => x, syncButtonDrawing() {}, u04Back: back, u04PeopleToggle: people, u04Title: { node: title } };
  const fn = run(code, ['UITransform', 'Graphics', 'Label', 'Color', 'view'], [UITransform, Graphics, Label, Color, view], ['visible']);
  fn.call(obj, { width: 320, height: 568 });
  checks.u04Navigation = { controlsY: controls.position.y, backLocalY: back.position.y, backWorldY: controls.position.y + back.position.y, expectedWorldY: 270 - 56 / 2,
    titleLocalX: title.position.x, expectedTitleLocalX: 22, passes: controls.position.y === 242 && back.position.y === 0 && title.position.x === 22 };
}

// Exercise the actual U01 resize/layout method to catch camera resets and parent-local nav drift.
{
  const canvas = node('canvas'); canvas.scale.x = 0.6; canvas.position = { x: 73, y: 91 };
  const viewport = node('viewport'); const top = node('U01TopControls'), back = node('Button_返回菜单'), mode = node('Button_Mode'), topTitle = node('Text');
  top.children.push(back, mode, topTitle); const root = { getChildByName: () => top };
  const overlay = node('overlay'); overlay.getComponent(Graphics).rect = () => {};
  const panel = node('panel'); panel.children.push(node('Text'), node('Button_关闭'));
  const panelViewport = node('viewport2'), panelContent = node('content'), panelEntry = node('entry'), status = { node: node('status'), fontSize: 0, lineHeight: 0, overflow: 0 };
  const obj = { panelOverlay: overlay, gallery: { safeUiBounds: () => ({ left: -132, right: 176, bottom: -260, top: 270 }) }, px: x => x,
    root, panel, panelViewport, panelContent, panelEntry, status, modeButton: mode, canvas, viewport, pointerActive: true, dragging: true,
    redrawButton() {}, reflowCanvas() { this.reflowCount = (this.reflowCount || 0) + 1; }, textReader: null };
  const fn = run(method(editorPath, 'layoutControls'), ['UITransform', 'Graphics', 'Label', 'Color', 'view', 'PANEL', 'BLUE'], [UITransform, Graphics, Label, Color, view, new Color(), new Color()], ['entries']);
  fn.call(obj);
  checks.u01SafeNavigation = { parentX: 22, backLocalX: back.position.x, expectedLocalX: -110, worldX: 22 + back.position.x, expectedWorldX: -88, safeLeft: -132, backWidth: back.getComponent(UITransform).width,
    cameraScale: canvas.scale.x, cameraX: canvas.position.x, cameraY: canvas.position.y, reflowCalled: obj.reflowCount === 1,
    passes: back.position.x === -110 && 22 + back.position.x === -88 && canvas.scale.x === 0.6 && canvas.position.x === 73 && canvas.position.y === 91 };
}

// Exercise the actual camera reflow implementation at a changed viewport fit.
{
  const canvas = node('canvas'); canvas.scale.x = 0.6; canvas.position = { x: 73, y: 91 };
  const obj = { canvas, viewport: node('viewport'), cameraFitScale: 0.5, cameraFitCenter: { x: 0, y: 0 },
    calculateCanvasFit() { return { scale: 0.4, center: { x: 10, y: -5, clone() { return { x: 10, y: -5 }; } } }; } };
  const fn = run(method(editorPath, 'reflowCanvas'), ['UITransform', 'Graphics', 'Label', 'Color', 'view'], [UITransform, Graphics, Label, Color, view]);
  fn.call(obj);
  checks.u01CameraPreserved = { zoomBefore: 1.2, zoomAfter: canvas.scale.x / 0.4, offsetXBefore: 146, offsetXAfter: (canvas.position.x - 10) / 0.4,
    offsetYBefore: 182, offsetYAfter: (canvas.position.y + 5) / 0.4,
    passes: Math.abs(canvas.scale.x / 0.4 - 1.2) < 1e-9 && Math.abs((canvas.position.x - 10) / 0.4 - 146) < 1e-9 && Math.abs((canvas.position.y + 5) / 0.4 - 182) < 1e-9 };
}

// Exercise the actual U00 safe-area local coordinate block under asymmetric insets.
{
  const source = method(galleryPath, 'layoutOverview');
  const start = source.indexOf('    topControls?.getComponent(UITransform)');
  const end = source.indexOf('    const toggleWidth', start);
  const code = source.slice(start, end);
  const topControls = node('U00_TopControls'), back = node('Button_返回菜单'), title = node('Text'), toggle = node('Button_Adjust');
  const obj = { uiPixels: x => x, syncButtonDrawing() {} };
  const fn = run(code, ['UITransform', 'Graphics', 'Label', 'Color', 'view'], [UITransform, Graphics, Label, Color, view], ['visible', 'safe', 'top', 'left', 'gap', 'hit', 'navH', 'topControls', 'back', 'adjustToggle', 'title']);
  fn.call(obj, { width: 320, height: 568 }, { left: -132, right: 176, bottom: -260, top: 270 }, 270, -132, 8, 48, 56, topControls, back, toggle, title);
  checks.u00SafeNavigation = { parentX: topControls.position.x, backLocalX: back.position.x, backWorldX: topControls.position.x + back.position.x,
    expectedBackWorldX: -132 + back.getComponent(UITransform).width / 2, passes: Math.abs(topControls.position.x + back.position.x - (-132 + back.getComponent(UITransform).width / 2)) < 1e-9 };
}

// Verify U00 and the reusable reader create actual graphics masks sized to their body viewports.
{
  const overview = fs.readFileSync(galleryPath, 'utf8'), reader = fs.readFileSync(readerPath, 'utf8'), u01 = fs.readFileSync(editorPath, 'utf8');
  checks.bodyClipping = { u00GraphicsRectMask: /bodyViewport\.addComponent\(Mask\)\.type=Mask\.Type\.GRAPHICS_RECT;bodyViewport\.addComponent\(Graphics\)/.test(overview),
    u00LayoutDrawsViewportRect: /maskG\.rect\(-\(shopPanelWidth-2\*gap\)\/2,-viewportH\/2,shopPanelWidth-2\*gap,viewportH\)/.test(overview),
    u01GraphicsRectMask: /panelViewport\.addComponent\(Mask\)\.type=Mask\.Type\.GRAPHICS_RECT;this\.panelViewport\.addComponent\(Graphics\)/.test(u01),
    reusableReaderMask: /this\.viewport\.addComponent\(Mask\)\.type = Mask\.Type\.GRAPHICS_RECT;\s*this\.viewport\.addComponent\(Graphics\)/.test(reader),
    reusableReaderSizesLabelToFullHeight: /this\.text\.node\.getComponent\(UITransform\)\?\.setContentSize\(contentW,this\.fullHeight\)/.test(reader) };
  checks.retryUsesReload = /this\.shopRetry = this\.button[\s\S]*?this\.reloadSampleScene\(\)/.test(overview) && !/this\.shopRetry = this\.button[\s\S]*?this\.requestShop\(this\.failedTarget/.test(overview);
  checks.u03FullErrorReader = /ground_contact、body\.spriteFrame、sign\.spriteFrame[\s\S]*?this\.showTextReader\('U03 完整加载状态',detail\)/.test(overview);
  checks.u02LogicalLayout = /statusLabel\.fontSize=this\.uiPixels\(16,visible\)/.test(overview) && /adornmentLabel\.fontSize=this\.uiPixels\(14,visible\)/.test(overview) && /const button=\(node:Node\|undefined,x:number,y:number,w:number\).*?setContentSize\(w,hit\)/.test(overview) && /controlTransform\.setContentSize\(trayWidth,contentH\)/.test(overview);
}

// Run the complete actual U02 layout method with a 320-CSS-pixel content viewport
// projected into the 720-unit design UI. This checks the resulting hit/label sizes.
{
  const makeHeading = name => { const item = node(name); item.getComponent(Label); return item; };
  const makeButton = name => { const item = node(name), text = node('Text'); item.children.push(text); return item; };
  const controls = node('TouristControlsContent');
  controls.children.push(makeHeading('ActionHeading'), makeHeading('AccessoryHeading'), makeHeading('FacingHeading'));
  const actions = { walk: makeButton('walk'), run: makeButton('run'), happy: makeButton('happy'), sad: makeButton('sad') };
  const slots = { hat: makeButton('hat'), glasses: makeButton('glasses'), wristband: makeButton('wristband') };
  const facing = { left: makeButton('left'), right: makeButton('right') };
  controls.children.push(...Object.values(actions), ...Object.values(slots), ...Object.values(facing));
  const status = node('status'), adornment = node('adornment'), tray = node('tray'), stage = node('stage');
  const obj = { safeUiBounds: () => ({ left: -360, right: 360, bottom: -640, top: 640 }), uiPixels: value => value * 2.25,
    touristNavBack: makeButton('back'), touristNavReset: makeButton('reset'), touristNavTitle: makeHeading('title'),
    touristStage: stage, touristView: { setStageHeight(value) { this.height = value; } }, touristStagePanel: null,
    touristStatus: status, touristAdornment: adornment, touristTrayViewport: tray, touristTrayBackground: null,
    touristTrayContent: controls, touristActionButtons: actions, touristSlotButtons: slots, touristFacingButtons: facing,
    touristScrollOffset: 0, syncButtonDrawing() {}, paintRect() {}, positionTouristTrayContent() {},
    uiScaleSnapshot: { content: 320, visible: 720 } };
  const fn = run(method(galleryPath, 'layoutTourist'), ['UITransform', 'Graphics', 'Label', 'Color', 'view'], [UITransform, Graphics, Label, Color, view], ['visible']);
  fn.call(obj, { width: 720, height: 1280 });
  const walkTransform = actions.walk.getComponent(UITransform), walkLabel = actions.walk.getChildByName('Text').getComponent(Label);
  const cssHitHeight = walkTransform.height / 2.25, cssFont = walkLabel.fontSize / 2.25;
  checks.u02ProjectedHitAndFont = { designHitHeight: walkTransform.height, projectedCssHitHeight: cssHitHeight, designFont: walkLabel.fontSize,
    projectedCssFont: cssFont, adornmentCssFont: adornment.getComponent(Label).fontSize / 2.25,
    contentScaleY: controls.scale.y, passes: cssHitHeight >= 48 && cssFont >= 16 && adornment.getComponent(Label).fontSize / 2.25 >= 14 && controls.scale.y === 1 };
}

for (const [name, result] of Object.entries(checks)) if (result.passes === false) throw new Error(`${name} failed: ${JSON.stringify(result)}`);
for (const [name, result] of Object.entries(checks)) {
  const bools = Object.values(result).filter(value => typeof value === 'boolean');
  if (bools.some(value => !value)) throw new Error(`${name} failed: ${JSON.stringify(result)}`);
}
console.log(JSON.stringify({ checks, source: { gallery: require('crypto').createHash('sha256').update(fs.readFileSync(galleryPath)).digest('hex'), u01: require('crypto').createHash('sha256').update(fs.readFileSync(editorPath)).digest('hex'), reader: require('crypto').createHash('sha256').update(fs.readFileSync(readerPath)).digest('hex') } }, null, 2));

const rp=node('readerRoot'), ps=node('panel'), vp=node('viewport'), tn=node('textNode'), close=node('close'), ab=node('action');close.children.push(node('Text'));ab.children.push(node('Text'));const title=node('title').getComponent(Label);title.node=node('titleLabelNode');const text=node('text').getComponent(Label);text.node=node('textLabelNode');text.string='LONG '.repeat(1000);
const ro={root:rp,panel:ps,viewport:vp,textNode:tn,title,text,close,actionButton:ab,action:{label:'retry'},uiScale:x=>x,paintButton(){},offset:0,maxOffset(){return Math.max(0,this.fullHeight-this.bodyHeight)},positionText(){}};
run(method(readerPath,'layout'),['UITransform','Graphics','Label','Color','view'],[UITransform,Graphics,Label,Color,view],['visible','safe']).call(ro,{width:390,height:844},{left:-183,right:183,bottom:-400,top:400});
const panelH=ps.getComponent(UITransform).height,bodyH=vp.getComponent(UITransform).height,by=vp.position.y,ay=ab.position.y;console.log(JSON.stringify({actualReaderLayout:true,panelHeight:panelH,bodyBottom:by-bodyH/2,bodyTop:by+bodyH/2,footerBottom:ay-24,footerTop:ay+24,bodyOverlapsFooter:by-bodyH/2<ay+24,bodyBelowPanel:by-bodyH/2 < -panelH/2},null,2));
const underlying=node('underlying');let actions=0;const modalGallery={overviewScene:{activeInHierarchy:true},textReader:{root:{active:true}},collectButtons(){return [underlying]},isInside(){return true},buttonMouseActions:new Map([[underlying,()=>actions++]])};
const mouse={getButton(){return 0},getUILocation(){return {x:0,y:0}}};
for(const name of ['onMenuMouseDown','onMenuMouseUp'])run(method(galleryPath,name),['EventMouse'],[{BUTTON_LEFT:0}],['event']).call(modalGallery,mouse);
const uiBlocked=run(method(editorPath,'onUi'),['UITransform'],[UITransform],['point']).call({textReader:{root:{active:true}},panelOverlay:{activeInHierarchy:false},root:{getChildByName(){return null}},panelEntry:null},{x:0,y:0});
console.log(JSON.stringify({actualGlobalMouseHandlersWithReaderOpen:true,underlyingActions:actions,u01ActualOnUiBlocksReader:uiBlocked},null,2));
