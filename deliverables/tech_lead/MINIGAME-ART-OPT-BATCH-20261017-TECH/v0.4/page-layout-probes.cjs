const fs=require('fs'),ts=require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/editor-native-scene/node_modules/typescript');
function body(path,name){const sf=ts.createSourceFile(path,fs.readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true);let found;function walk(n){if(ts.isMethodDeclaration(n)&&n.name.getText(sf)===name)found=n.body.getText(sf).slice(1,-1);ts.forEachChild(n,walk)}walk(sf);if(!found)throw Error(name);return found}
function compile(code,args=['visible']){return Function('UITransform','Graphics','Label','Color','view','W','H',`return function(${args.join(',')}){${ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2020}}).outputText}}`)({}, {}, {Overflow:{CLAMP:1},HorizontalAlign:{LEFT:1}}, class{}, {getVisibleSize(){return {width:720,height:1280}}},3072,1024)}
const make=(name)=>({name,isValid:true,position:{x:0,y:0},setPosition(x,y){this.position={x,y}},getComponent(){return {setContentSize(){},fontSize:0,lineHeight:0}},getChildByName(){return null}});
const gallery='apps/client/assets/UnitSampleGallery.ts',editor='apps/client/assets/labs/u01/sakura_layout_editor.ts';
let code=body(gallery,'layoutDialogue');code=code.slice(0,code.indexOf('const panel=this.u04Panel'));
const controls=make('controls'),back=make('back'),toggle=make('toggle'),title=make('title');const stage={getChildByName(n){return n==='U04Controls'?controls:null},getComponent(){return {setContentSize(){}}}};
const obj={u04Portrait:{isValid:true},page:{getChildByName(){return stage}},safeUiBounds(){return {left:-148,right:148,bottom:-276,top:276}},uiPixels(v){return v},syncButtonDrawing(){},u04Back:back,u04PeopleToggle:toggle,u04Title:{node:title}};
compile(code).call(obj,{width:320,height:568});const out={u04Navigation:{parentY:controls.position.y,childBackY:back.position.y,actualBackWorldY:controls.position.y+back.position.y,safeTop:276}};
const canvas={scale:{x:.6},position:{x:73,y:91},setScale(x,y){this.scale={x,y}},setPosition(x,y){this.position={x,y}}};const editorObj={canvas,viewport:{},gallery:{safeUiBounds(){return {left:-148,right:148,bottom:-276,top:276}}},px(v){return v}};
compile(body(editor,'fitCanvas'),[]).call(editorObj);out.u01RelayoutCamera={before:{scale:.6,x:73,y:91},after:{scale:canvas.scale.x,...canvas.position}};
out.u02Labels={originalButtonFont:25,cssProjectionX:320/720,projectedFontWidth:25*320/720,requiredLogical:16,contentScaleY:720/320};
out.u03LongError={statusFixedLogicalHeight:96,lineHeight:24,maxLines:4,errorTextCanExceedLines:true,scrollContainerAbsent:true};
console.log(JSON.stringify(out,null,2));
