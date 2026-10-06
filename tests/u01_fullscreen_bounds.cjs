// Exercise the real controller's transforms and verify coverage independently.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const ts = require('C:/ProgramData/cocos/editors/Creator/3.8.8/resources/app.asar.unpacked/node_modules/typescript');
const sourcePath = path.resolve('apps/client/assets/labs/menu/scene1_camera_controller.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true,
}}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject, require: () => ({
  _decorator: { ccclass: () => target => target, property: () => () => {} },
  Component: class {}, Node: class {}, UITransform: class {},
}) });
const Controller = exportsObject.Scene1CameraController;
const ratios = [0.3, 0.8, 1, 1];
let width = 720, height = 1280;
const controller = new Controller();
controller.viewport = { getComponent: () => ({ contentSize: { width, height } }) };
controller.layers = ratios.map(() => ({ isValid: true,
  setScale(x) { this.scale = x; }, setPosition(x) { this.x = x; },
}));
let checks = 0;
const rows = [];
function checkCoverage() {
  for (const layer of controller.layers) {
    const halfWidth = 2172 * layer.scale / 2;
    const halfHeight = 724 * layer.scale / 2;
    assert(layer.x - halfWidth <= -width / 2 - 2 + 1e-8);
    assert(layer.x + halfWidth >= width / 2 + 2 - 1e-8);
    assert(halfHeight >= height / 2 + 2 - 1e-8);
    checks++;
  }
  assert(controller.zoom >= 1 && controller.zoom <= 1.8);
}
for (const [phoneWidth, phoneHeight] of [[360,640],[360,720],[390,844],[360,800],[360,840]]) {
  width = 720; height = 720 * phoneHeight / phoneWidth;
  const row = { viewport: [phoneWidth,phoneHeight], designViewport: [width,height], limits: [] };
  for (const zoom of [1,1.15,1.4,1.8]) {
    for (const direction of [-1,0,1]) {
      controller.cameraX = direction * 1e6;
      controller.setZoom(zoom);
      checkCoverage();
    }
    row.limits.push({zoom,maxCameraX:Math.abs(controller.cameraX)});
  }
  // Zooming out at a zoomed-in extreme must pull the camera back into bounds.
  controller.cameraX = 1e6; controller.setZoom(1.8);
  const wideLimit = controller.cameraX;
  controller.zoomBy(0.001); checkCoverage();
  assert(controller.cameraX < wideLimit);
  controller.reset(); checkCoverage();
  assert.equal(controller.cameraX,0); assert.equal(controller.zoom,1);
  rows.push(row);
}
// Cover viewport changes while positioned at an extreme; include wider/taller portraits.
for (let i=0;i<1000;i++) {
  width = 720; height = 720 * (1.2 + i / 700);
  controller.cameraX = (i % 2 ? -1 : 1) * 1e6;
  controller.setZoom(1 + (i % 81) / 100);
  checkCoverage();
}
const report = { result:'PASS',checks,source:sourcePath,rows,
  scope:'真实Controller在无引擎节点替身中的几何/状态单元验证；不替代引擎导入、Web运行或正式QA。' };
fs.writeFileSync('deliverables/client/UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001/v0.2/evidence/geometry-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({result:report.result,checks}));
