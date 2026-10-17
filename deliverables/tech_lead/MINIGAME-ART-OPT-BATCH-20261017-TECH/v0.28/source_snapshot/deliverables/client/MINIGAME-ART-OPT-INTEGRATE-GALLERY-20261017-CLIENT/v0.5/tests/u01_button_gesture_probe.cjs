const assert=require('node:assert/strict');
const Module=require('node:module');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript');
const originalLoad=Module._load;
const events={TOUCH_START:'touch-start',TOUCH_MOVE:'touch-move',TOUCH_END:'touch-end',TOUCH_CANCEL:'touch-cancel'};
class Component {}
class Color { constructor(){} }
class FakeGraphics { roundRect(){} fill(){} stroke(){} }
class FakeNode {
  constructor(name){this.name=name;this.handlers={};}
  addComponent(Type){return Type===FakeGraphics?new FakeGraphics():{};}
  on(type,handler){this.handlers[type]=handler;}
  fire(type,event={}){this.handlers[type]?.(event);}
}
class RuntimeNode extends FakeNode {}
RuntimeNode.EventType=events;
const cc={_decorator:{ccclass:()=>target=>target,property:()=>()=>{}},Color,Graphics:FakeGraphics,Input:{EventType:{}},input:{},Label:class Label{},Mask:class Mask{},Node:RuntimeNode,resources:{},Sprite:class Sprite{},SpriteFrame:class SpriteFrame{},UITransform:class UITransform{},Vec2:class Vec2{},Vec3:class Vec3{},view:{},instantiate:()=>({})};
Module._load=function(request,parent,isMain){if(request==='cc')return cc;if(!request.startsWith('.'))return originalLoad.call(this,request,parent,isMain);return {};};
require.extensions['.ts']=function(mod,filename){const source=fs.readFileSync(filename,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2019,experimentalDecorators:true}}).outputText;mod._compile(js,filename);};
const sourcePath=path.resolve(__dirname,'../../../../../apps/client/assets/labs/u01/sakura_layout_editor.ts');
const {U01SakuraLayoutEditor}=require(sourcePath);
function main(){
  const editor=Object.create(U01SakuraLayoutEditor.prototype);
  let clicks=0;
  Object.assign(editor,{panelScrollY:null,panelScrollGesture:false,node:()=>new FakeNode('button'),text:()=>({})});
  const button=editor.button({},'关闭',0,0,104,48,()=>{clicks++;});

  // A drag begins on a scroll-row button, moves, then ends there. The first
  // end is suppressed as a drag, but must clear the stale pointer coordinate.
  button.fire(events.TOUCH_START);
  editor.panelScrollY=490; editor.panelScrollGesture=false; // viewport TOUCH_START
  editor.applyPanelFingerMove(120);
  assert.equal(editor.panelScrollGesture,true,'drag crosses existing movement threshold');
  button.fire(events.TOUCH_END,{propagationStopped:false});
  assert.equal(clicks,0,'drag end never activates the underlying button');
  assert.equal(editor.panelScrollY,null,'button end clears pointer state even when viewport end is stopped');
  assert.equal(editor.panelScrollGesture,true,'drag state stays latched until next gesture start');

  // A new header tap is recognized without needing a gap touch.
  button.fire(events.TOUCH_START);
  assert.equal(editor.panelScrollGesture,false,'every new button touch begins a fresh gesture');
  button.fire(events.TOUCH_END,{propagationStopped:false});
  assert.equal(clicks,1,'close/ordinary button responds immediately after drag');

  // A cancelled press cannot activate on a trailing END; a later ordinary tap works.
  button.fire(events.TOUCH_START);
  button.fire(events.TOUCH_CANCEL);
  button.fire(events.TOUCH_END,{propagationStopped:false});
  assert.equal(clicks,1,'cancel followed by end does not invoke callback');
  assert.equal(editor.panelScrollY,null,'cancel clears stale pointer state');
  button.fire(events.TOUCH_START);
  button.fire(events.TOUCH_END,{propagationStopped:false});
  assert.equal(clicks,2,'normal tap still invokes callback after cancellation');
  console.log('PASS: actual U01 button helper sequence handles drag-end→next tap, cancel→end, and ordinary taps');
}
main();
