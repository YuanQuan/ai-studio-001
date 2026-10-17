const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const originalLoad = Module._load;
class Component {}
class Color { constructor() {} }
class Prefab {}
const cc = {
  _decorator: { ccclass: () => target => target, property: () => () => {} },
  Component, Color, Prefab, Node: class Node {}, EventMouse: class EventMouse {},
  Vec2: class Vec2 {}, Vec3: class Vec3 {}, SpriteFrame: class SpriteFrame {},
  Graphics: class Graphics {}, Label: class Label {}, Mask: class Mask {},
  UITransform: class UITransform {}, Sprite: class Sprite {}, Input: class Input {},
  input: {}, view: {}, resources: {}, instantiate: () => ({}),
};
cc.EventMouse.BUTTON_LEFT = 0;
Module._load = function(request, parent, isMain) {
  if (request === 'cc') return cc;
  if (!request.startsWith('.')) return originalLoad.call(this, request, parent, isMain);
  if (request.includes('sakura_user_layout')) return { USER_LAYOUT_PROFILE: { instances: [] } };
  if (request.includes('shop_definitions')) return { SHOP_IDS: [], SHOP_NAMES: [], SHOP_PREFAB_NAMES: [] };
  if (request.includes('sakura_v03_layout')) return { SAKURA_V03_LAYOUT: { prototypes: [], sourceVersion: 'test' } };
  if (request.includes('module-assets')) return { U04_MAPPING_MODULE: 'mapping', U04_DECORATION_MODULE: 'decoration', u04PortraitModuleId: () => '' };
  return {};
};
require.extensions['.ts'] = function(mod, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019, experimentalDecorators: true } }).outputText;
  mod._compile(js, filename);
};
const root = path.resolve(__dirname, '../../../../../apps/client/assets');
const { UnitSampleGallery } = require(path.join(root, 'UnitSampleGallery.ts'));
const { U01SakuraLayoutEditor } = require(path.join(root, 'labs/u01/sakura_layout_editor.ts'));

function main() {
  const gallery = Object.create(UnitSampleGallery.prototype);
  assert.equal(gallery.fingerScrollOffset(0, 500, 120, 490), 370, 'finger moving upward advances list');
  assert.equal(gallery.fingerScrollOffset(370, 500, 490, 120), 0, 'finger moving downward returns toward top');
  assert.equal(gallery.fingerScrollOffset(480, 500, 120, 490), 500, 'scroll clamps at bottom');
  assert.equal(gallery.fingerScrollOffset(20, 500, 490, 120), 0, 'scroll clamps at top');

  let layouts = 0;
  Object.assign(gallery, {
    menuScrollY: 120, menuScrollStartY: 120, menuScrollGesture: false,
    menuScrollOffset: 0, menuMaxScroll: 500, menuContent: { activeInHierarchy: true },
    textReader: { root: { activeInHierarchy: false } }, overviewShopAdjustOverlay: { activeInHierarchy: false },
    layoutScene() { layouts++; }, pageEpoch: 3,
  });
  gallery.onMenuMouseMove({ getUILocation: () => ({ y: 490 }) });
  assert.equal(gallery.menuScrollOffset, 370, 'mouse/trackpad drag upward advances menu');
  assert.equal(gallery.menuScrollGesture, true, 'drag threshold suppresses click');
  assert.equal(layouts, 1);
  let opened = 0;
  const target = { isValid: true };
  Object.assign(gallery, {
    menuEntries: [{ node: target, open: () => { opened++; } }], menuMouseDown: target,
    isInside: () => true,
  });
  gallery.onMenuMouseUp({ getButton: () => 0, getUILocation: () => ({ x: 10, y: 10 }) });
  assert.equal(opened, 0, 'drag release does not activate an entry');
  gallery.activateMenuEntry(target, 3);
  assert.equal(opened, 1, 'after drag suppression clears, normal activation still works');

  let touristDelta = 0;
  Object.assign(gallery, {
    touristTouchY: 120, touristTouchStartY: 120, touristScrollGesture: false,
    scrollTouristTray(delta) { touristDelta = delta; },
  });
  const touch = { getUILocation: () => ({ y: 490 }), propagationStopped: false };
  gallery.onTouristTouchMove(touch);
  assert.equal(touristDelta, 370, 'tourist touch drag upward advances tray');
  assert.equal(gallery.touristScrollGesture, true);
  assert.equal(touch.propagationStopped, true);
  gallery.touristMouseY = 490; gallery.touristMouseStartY = 490;
  gallery.onTouristMouseMove({ getUILocation: () => ({ y: 120 }), propagationStopped: false });
  assert.equal(touristDelta, -370, 'tourist mouse drag downward returns toward top');

  const editor = Object.create(U01SakuraLayoutEditor.prototype);
  let panelLayouts = 0;
  Object.assign(editor, {
    panelScrollY: 120, panelScrollOffset: 0, panelMaxScroll: 500, panelScrollGesture: false,
    layoutControls() { panelLayouts++; },
  });
  editor.applyPanelFingerMove(490);
  assert.equal(editor.panelScrollOffset, 370, 'U01 panel touch drag upward advances contents');
  assert.equal(editor.panelScrollGesture, true, 'U01 drag threshold remains active');
  editor.applyPanelFingerMove(120);
  assert.equal(editor.panelScrollOffset, 0, 'U01 downward drag returns toward top');
  assert.equal(panelLayouts, 2);

  const gallerySource = fs.readFileSync(path.join(root, 'UnitSampleGallery.ts'), 'utf8');
  const u01Source = fs.readFileSync(path.join(root, 'labs/u01/sakura_layout_editor.ts'), 'utf8');
  assert.match(gallerySource, /overviewShopScrollOffset=this\.fingerScrollOffset\(this\.overviewShopScrollOffset,this\.overviewShopMaxScroll,this\.overviewShopScrollY,y\)/, 'U00 panel uses the tested finger-direction helper');
  assert.match(gallerySource, /u04ReadOffset = this\.fingerScrollOffset\(this\.u04ReadOffset, this\.u04ReadMaxScroll, this\.u04ReadPointerY, y\)/, 'U04 reader uses the tested finger-direction helper');
  assert.match(gallerySource, /scrollTouristTray\(currentY - this\.touristTouchY\)/, 'tourist touch uses current minus previous');
  assert.match(gallerySource, /Node\.EventType\.MOUSE_WHEEL[\s\S]*menuScrollOffset - event\.getScrollY\(\) \* 0\.4/, 'menu wheel scroll is wired in conventional direction');
  assert.match(gallerySource, /overviewShopScrollGesture \|\| !this\.isInside\(this\.overviewShopBodyViewport!/, 'U00 panel retains drag/crop click isolation');
  assert.match(u01Source, /private applyPanelFingerMove\(currentY:number\)[\s\S]*panelScrollOffset\+currentY-this\.panelScrollY/, 'U01 panel callback uses current minus previous');
  assert.match(u01Source, /if\(!this\.panelScrollGesture\)cb\(\)/, 'U01 panel drag still suppresses button activation');
  console.log('PASS: actual Gallery/U01 scroll methods advance on upward drags, clamp both ends, preserve drag click isolation, and wire menu wheel');
}
main();
