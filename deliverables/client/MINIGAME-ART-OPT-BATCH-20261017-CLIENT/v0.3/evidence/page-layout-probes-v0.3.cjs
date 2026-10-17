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
const UITransform = {}, Graphics = {}, Label = { Overflow: { CLAMP: 1 }, HorizontalAlign: { LEFT: 1 }, VerticalAlign: { TOP: 1 } };
const Color = class { constructor(...values) { this.values = values; } };
const view = { getVisibleSize() { return { width: 720, height: 1280 }; } };
const checks = {};

function node(name = '') {
  const transform = component();
  const label = { fontSize: 0, lineHeight: 0, string: '', overflow: 0 };
  const graphics = { clear() {}, rect(x, y, width, height) { this.rectValue = { x, y, width, height }; }, roundRect() {}, fill() {}, stroke() {} };
  const result = {
    name, isValid: true, active: true, activeInHierarchy: true, children: [], position: { x: 0, y: 0 }, scale: { x: 1, y: 1 },
    getComponent(type) { if (type === UITransform) return transform; if (type === Label) return label; if (type === Graphics) return graphics; return null; },
    getChildByName(childName) { return this.children.find(child => child.name === childName) || null; },
    setContentSize(w, h) { transform.setContentSize(w, h); }, setPosition(x, y) { this.position = { x, y }; },
    setScale(x, y) { this.scale = { x, y }; }, setParent(parent) { this.parent = parent; },
    setSiblingIndex(index) { this.siblingIndex = index; if(this.parent){this.parent.children=this.parent.children.filter(child=>child!==this);this.parent.children.splice(index,0,this);} },
  };
  label.node = result;
  return result;
}

// Execute the actual U00 modal toggle and verify the overlay is raised over the
// later-created camera controls while stale background gestures are cancelled.
{
  const overlay=node('overlay'), panel=node('panel'), parent=node('ui'); parent.children=[node('buttons'),overlay,node('camera')]; overlay.parent=parent; overlay.active=false; panel.active=false;
  const obj={overviewShopAdjustPanel:panel,overviewShopAdjustOverlay:overlay,overviewMouseTarget:node('stale'),menuMouseDown:node('stale'),menuScrollY:10,menuScrollStartY:10,menuScrollGesture:true,
    overviewShopScrollY:8,overviewShopScrollStartY:8,overviewShopScrollGesture:true,overviewShopScrollOffset:0,overviewShopAdjustToggle:node('toggle'),
    setTouristButtonText(){},focusOverviewShop(){},updateOverviewShopAdjustPanel(){},layoutOverview(){}};
  const fn=run(method(galleryPath,'toggleOverviewShopAdjust'),['UITransform','Graphics','Label','Color','view'],[UITransform,Graphics,Label,Color,view]);
  fn.call(obj);
  checks.u00ModalTopLayerAndGestureCancel={overlayIndex:parent.children.indexOf(overlay),lastIndex:parent.children.length-1,panelActive:panel.active,
    staleTargetsCleared:obj.overviewMouseTarget===null&&obj.menuMouseDown===null,gesturesCleared:obj.menuScrollY===null&&obj.overviewShopScrollY===null,
    passes:parent.children.indexOf(overlay)===parent.children.length-1&&panel.active&&obj.overviewMouseTarget===null&&obj.menuMouseDown===null&&obj.menuScrollY===null&&obj.overviewShopScrollY===null};
}

// Exercise real Gallery global input entry points while a reader is active and
// confirm no menu action or overview click target is reached.
{
  let actions=0;const obj={textReader:{root:{activeInHierarchy:true}},menuMouseDown:node('stale'),overviewMouseTarget:node('stale'),menuScrollY:10,menuScrollStartY:10,
    menuScrollGesture:true,overviewShopScrollY:null,overviewShopAdjustOverlay:{activeInHierarchy:false},overviewScene:{activeInHierarchy:true},
    collectButtons(){return [node('Button_underlay')]},isInside(){return true},buttonMouseActions:new Map(),activateMenuEntry(){actions++}};
  const event={getButton(){return 0},getUILocation(){return {x:0,y:0}}};
  const down=run(method(galleryPath,'onMenuMouseDown'),['EventMouse'],[{BUTTON_LEFT:0}],['event']);
  const up=run(method(galleryPath,'onMenuMouseUp'),['EventMouse'],[{BUTTON_LEFT:0}],['event']);down.call(obj,event);up.call(obj,event);
  checks.galleryReaderBlocksBackgroundInput={actions,targetsCleared:obj.menuMouseDown===null&&obj.overviewMouseTarget===null,
    passes:actions===0&&obj.menuMouseDown===null&&obj.overviewMouseTarget===null};
}

// Execute U01 global touch/mouse handlers with a live reader; source/camera
// routines must not be called and any in-flight gesture must be dropped.
{
  let worldCalls=0;const obj={loadingError:false,textReader:{root:{activeInHierarchy:true}},pointerActive:true,dragging:true,
    sourcePoint(){worldCalls++;return {x:1,y:1}},canvas:{position:{x:4,y:5}},mode:'camera'};
  const event={getUILocation(){return {x:20,y:30}},getButton(){return 0},propagationStopped:false};
  for(const name of ['onTouchStart','onTouchMove','onMouseDown','onMouseMove']){
    const fn=run(method(editorPath,name),['UITransform','Graphics','Label','Color','view'],[UITransform,Graphics,Label,Color,view],['e']);fn.call(obj,event);
  }
  checks.u01ReaderBlocksWorldInput={worldCalls,pointerCleared:!obj.pointerActive,draggingCleared:!obj.dragging,
    passes:worldCalls===0&&!obj.pointerActive&&!obj.dragging};
}

// Exercise actual responsive generic button drawing with a narrow CSS viewport.
{
  const button=node('Button_nav'), text=node('Text');button.children.push(text);const label=text.getComponent(Label),textTransform=text.getComponent(UITransform);
  const obj={uiPixels:value=>value,paintButtonState(){}};
  const fn=run(method(galleryPath,'syncButtonDrawing'),['UITransform','Graphics','Label','Color','view'],[UITransform,Graphics,Label,Color,view],['node']);
  fn.call(obj,button);
  checks.galleryButtonLogicalFont={fontSize:label.fontSize,lineHeight:label.lineHeight,overflow:label.overflow,textWidth:textTransform.width,
    passes:label.fontSize===16&&label.lineHeight===24&&label.overflow===Label.Overflow.CLAMP};
}

// Exercise U01 independent button drawing at logical pixel sizes.
{
  const button=node('Button_nav'),text=node('Text');button.children.push(text);const label=text.getComponent(Label);
  const obj={px:value=>value};const fn=run(method(editorPath,'redrawButton'),['UITransform','Graphics','Label','Color','view','PANEL','BLUE'],[UITransform,Graphics,Label,Color,view,new Color(),new Color()],['node']);
  fn.call(obj,button);
  checks.u01ButtonLogicalFont={fontSize:label.fontSize,lineHeight:label.lineHeight,passes:label.fontSize===16&&label.lineHeight===24};
}

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
    cameraScale: canvas.scale.x, cameraX: canvas.position.x, cameraY: canvas.position.y, panelTitleFont: panel.children[0].getComponent(Label).fontSize, statusHeight: status.node.getComponent(UITransform).height, reflowCalled: obj.reflowCount === 1,
    passes: back.position.x === -110 && 22 + back.position.x === -88 && canvas.scale.x === 0.6 && canvas.position.x === 73 && canvas.position.y === 91 && panel.children[0].getComponent(Label).fontSize === 16 && status.node.getComponent(UITransform).height === 48 };
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

// Run Gallery's actual U00 layout method with a 320 CSS px viewport mapped into
// 720 design units. This catches the migrated-body lookup regression and measures
// rendered CSS hit sizes and label sizes after layout.
{
  const panel=node('U00_ShopAdjustPanel'), title=node('Text'), close=makeReaderButton('Button_关闭'), restore=makeReaderButton('Button_恢复初始值'), copy=makeReaderButton('Button_复制全部参数');
  panel.children.push(title,close,restore,copy);
  const bodyViewport=node('bodyViewport'), bodyContent=node('bodyContent'); panel.children.push(bodyViewport); bodyViewport.children.push(bodyContent);
  const actionNames=['店铺','顾客','上一项','下一项','X −','X +','Y −','Y +','缩放 −','缩放 +','步长 1','步长 10','步长 50'];
  for(const name of actionNames) bodyContent.children.push(makeReaderButton(`Button_${name}`));
  const values={name:node('name'),x:node('x'),y:node('y'),scale:node('scale'),step:node('step'),feedback:node('feedback')};
  const groupButtons={street:makeReaderButton('street'),tourists:makeReaderButton('tourists'),shops:makeReaderButton('shops')};
  const obj={viewportSnapshot:{height:568},safeUiBounds:()=>({left:-360,right:360,bottom:-640,top:640}),uiPixels:value=>value*2.25,
    overviewScene:null,overviewShopAdjustPanel:panel,overviewShopBodyViewport:bodyViewport,overviewShopBodyContent:bodyContent,
    overviewShopAdjustToggle:null,overviewGroupToggleContainer:null,overviewCountContainer:null,overviewGroupButtons:groupButtons,
    overviewCountLabel:null,overviewShopNameLabel:values.name,overviewShopXLabel:values.x,overviewShopYLabel:values.y,overviewShopScaleLabel:values.scale,
    overviewShopStepLabel:values.step,overviewShopFeedback:values.feedback,overviewShopScrollOffset:0,paintRect(){},syncButtonDrawing(){},
    touristStage:null,u04Portrait:null,textReader:null,sceneViewport:null};
  const fn=run(method(galleryPath,'layoutOverview'),['UITransform','Graphics','Label','Color','view','Mask','PANEL'],[UITransform,Graphics,Label,Color,view,{Type:{GRAPHICS_RECT:1}},new Color()]);
  fn.call(obj);
  const px=node=>node.getComponent(UITransform).height/2.25, font=node=>node.getComponent(Label).fontSize/2.25;
  const measured=actionNames.map(name=>{const item=bodyContent.children.find(child=>child.name===`Button_${name}`);return {name,width:item.getComponent(UITransform).width/2.25,height:px(item),font:font(item.getChildByName('Text'))};});
  const allTargetsLaidOut=actionNames.every(name=>{const item=bodyContent.children.find(child=>child.name===`Button_${name}`);return item.position.y!==0 || name==='店铺' || name==='顾客';});
  checks.u00PanelProjectedLayout={measured,titleFont:font(title),bodyViewportHeight:bodyViewport.getComponent(UITransform).height/2.25,
    targetsPositioned:bodyContent.children.find(n=>n.name==='Button_店铺').position.x!==0&&bodyContent.children.find(n=>n.name==='Button_顾客').position.x!==0,
    passes:measured.every(item=>item.height>=48&&item.font>=16)&&font(title)>=16&&allTargetsLaidOut};
}

// Execute the real U00 panel-state updater after controls have moved into the
// scroll body. Verify mode switches affect those actual controls and do not alter
// stored coordinate precision.
{
  const body=node('body'),panel=node('panel');
  const names=['X −','X +','Y −','Y +','店铺','顾客','步长 1','步长 10','步长 50'];
  for(const name of names)body.children.push(makeReaderButton(`Button_${name}`));
  const labels={name:node('name'),x:node('x'),y:node('y'),scale:node('scale'),step:node('step')};
  const obj={overviewShopFootpoints:[{x:12.34567890123,y:-98.76543210987}],overviewShopSelectedIndex:0,overviewAdjustTarget:'shops',
    overviewTourists:[],overviewTouristScales:[],overviewShopScales:[0.875],overviewShopStep:10,overviewScaleStep:0.02,
    overviewShopNameLabel:labels.name,overviewShopXLabel:labels.x,overviewShopYLabel:labels.y,overviewShopScaleLabel:labels.scale,
    overviewShopStepLabel:labels.step,overviewShopBodyContent:body,overviewShopAdjustPanel:panel,
    setTouristButtonText(target,text){if(target)target.getChildByName('Text').getComponent(Label).string=text;}};
  const fn=run(method(galleryPath,'updateOverviewShopAdjustPanel'),['UITransform','Graphics','Label','Color','view','SHOP_NAMES','SHOP_IDS','OVERVIEW_TOURIST_SCALE'],
    [UITransform,Graphics,Label,Color,view,['店名'],['S1'],0.85]);
  fn.call(obj);
  const xExact=obj.overviewShopFootpoints[0].x,yExact=obj.overviewShopFootpoints[0].y;
  const shopRows=names.slice(0,4).map(name=>body.children.find(n=>n.name===`Button_${name}`).active);
  obj.overviewAdjustTarget='tourists';obj.overviewTourists=[{}];obj.overviewTouristScales=[0.9];fn.call(obj);
  const touristRows=names.slice(0,4).map(name=>body.children.find(n=>n.name===`Button_${name}`).active);
  checks.u00MovedControlsStateAndExactValues={shopRows,touristRows,xDisplay:labels.x.getComponent(Label).string,yDisplay:labels.y.getComponent(Label).string,
    storedX:xExact,storedY:yExact,precisionUnchanged:obj.overviewShopFootpoints[0].x===xExact&&obj.overviewShopFootpoints[0].y===yExact,
    modeSwitchHidesShopOnlyRows:shopRows.every(Boolean)&&touristRows.every(value=>!value),passes:shopRows.every(Boolean)&&touristRows.every(value=>!value)&&xExact===12.34567890123&&yExact===-98.76543210987};
}

// Exact editor data remains available in the full reader while compact values
// fit the one-line layout.
{
  const obj={overviewShopSelectedIndex:0,overviewAdjustTarget:'shops',overviewShopFootpoints:[{x:12.34567890123,y:-98.76543210987}],
    overviewTourists:[],overviewShopScales:[0.875],overviewTouristScales:[],overviewShopStep:10,overviewScaleStep:0.02};
  const fn=run(method(galleryPath,'overviewShopFullDetail'),['SHOP_IDS','SHOP_NAMES','OVERVIEW_TOURIST_SCALE'],[['S1'],['店名'],0.85]);
  const detail=fn.call(obj);checks.u00ExactValuesInReader={detail,passes:detail.includes(String(obj.overviewShopFootpoints[0].x))&&detail.includes(String(obj.overviewShopFootpoints[0].y))};
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
  checks.compactPageTitles = /this\.touristNavTitle = this\.label\(this\.page, 'U02 游客装扮',[\s\S]*?navTitleLabel\.enableWrapText=false/.test(overview) && /titleLabel\.string='U03 六店'[\s\S]*?titleLabel\.enableWrapText=false/.test(overview) && /u04Title\.fontSize = logical\(16\)[\s\S]*?u04Title\.enableWrapText = false/.test(overview);
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

// Execute the reusable reader's actual layout against a long body and fixed action footer.
{
  const root = node('root'), panel = node('panel'), titleNode = node('title'), close = makeReaderButton('close'), viewport = node('viewport'), textNode = node('textNode'), textLabelNode = node('textLabel');
  panel.children.push(titleNode, close, viewport);
  viewport.children.push(textNode); textNode.children.push(textLabelNode);
  const title = { node: titleNode, string: '', fontSize: 0, lineHeight: 0 };
  const text = { node: textLabelNode, string: Array.from({ length: 120 }, (_, i) => `line ${i} with a moderately long passage for wrapped full reading`).join('\n'),
    fontSize: 0, lineHeight: 0, enableWrapText: false, overflow: 0, horizontalAlign: 0, verticalAlign: 0 };
  const actionButton = makeReaderButton('action');
  root.children.push(panel); const obj = { root, panel, title, close, viewport, textNode, text, actionButton, action: { label: '重试', run() {} },
    fullHeight: 0, bodyHeight: 0, contentHeight: 0, offset: 0, uiScale: value => value,
    paintButton: (button, width, height) => button.getComponent(UITransform).setContentSize(width, height), maxOffset() { return Math.max(0, this.fullHeight - this.bodyHeight); },
    positionText: null };
  const positionText = run(method(readerPath, 'positionText'), ['UITransform', 'Graphics', 'Label', 'Color', 'view'], [UITransform, Graphics, Label, Color, view]);
  obj.positionText = function() { positionText.call(this); };
  const fn = run(method(readerPath, 'layout'), ['UITransform', 'Graphics', 'Label', 'Color', 'view'], [UITransform, Graphics, Label, Color, view], ['visible', 'safe']);
  fn.call(obj, { width: 720, height: 1280 }, { left: -360, right: 360, bottom: -308, top: 308 });
  const body = viewport.getComponent(UITransform), actionSize = actionButton.getComponent(UITransform);
  const bodyBottom = viewport.position.y - body.height / 2, actionTop = actionButton.position.y + actionSize.height / 2;
  obj.offset = obj.maxOffset(); obj.positionText();
  const textBottomAtEnd = textNode.position.y - obj.fullHeight / 2;
  checks.reusableReaderFooterAndScroll = { panelHeight: panel.getComponent(UITransform).height, viewportBounds: [bodyBottom, viewport.position.y + body.height / 2],
    actionBounds: [actionButton.position.y - actionSize.height / 2, actionTop], gap: bodyBottom - actionTop, fullHeight: obj.fullHeight, bodyHeight: obj.bodyHeight, maxOffset: obj.maxOffset(),
    textBottomAtEnd, expectedTextBottom: -obj.bodyHeight / 2,
    passes: bodyBottom - actionTop >= 8 && obj.maxOffset() > 0 && Math.abs(textBottomAtEnd + obj.bodyHeight / 2) < 1e-9 };
}

function makeReaderButton(name) {
  const button = node(name), text = node('Text'); button.children.push(text); return button;
}

for (const [name, result] of Object.entries(checks)) if (result.passes === false) throw new Error(`${name} failed: ${JSON.stringify(result)}`);
for (const [name, result] of Object.entries(checks)) {
  const bools = Object.values(result).filter(value => typeof value === 'boolean');
  if (bools.some(value => !value)) throw new Error(`${name} failed: ${JSON.stringify(result)}`);
}
console.log(JSON.stringify({ checks, source: { gallery: require('crypto').createHash('sha256').update(fs.readFileSync(galleryPath)).digest('hex'), u01: require('crypto').createHash('sha256').update(fs.readFileSync(editorPath)).digest('hex'), reader: require('crypto').createHash('sha256').update(fs.readFileSync(readerPath)).digest('hex') } }, null, 2));
