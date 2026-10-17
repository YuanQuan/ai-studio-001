const fs=require('fs'),ts=require('/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/editor-native-scene/node_modules/typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {ViewportMapper:M}=require(process.cwd()+'/apps/client/assets/framework/viewport/viewport_mapper.ts');
const {WeChatViewportAdapter:W,WebViewportAdapter:Web}=require(process.cwd()+'/apps/client/assets/framework/viewport/viewport_adapter.ts');
const {ModuleAssets:A}=require(process.cwd()+'/apps/client/assets/framework/module-assets/module_assets.ts');
(async()=>{
 const s={revision:1,width:400,height:800,dpr:1,safe:{x:0,y:300,width:400,height:100},content:{x:0,y:0,width:400,height:800},capsule:{x:200,y:330,width:80,height:30},orientation:'portrait',diagnostics:[]};
 const safe=M.safeWithCapsule(s);const c={top:322,bottom:368};
 const out={capsule:{result:safe,overlapsProtectedCapsule:safe.y<c.bottom&&safe.y+safe.height>c.top},logicalSize:{ui48:M.logicalPixelsToUI(48,{...s,content:{x:40,y:20,width:320,height:760}},{width:720,height:1280})}};
 out.logicalSize.actualLogicalWidth=out.logicalSize.ui48/(720/320);
 const wx=new W({getWindowInfo(){throw Error('primary unavailable')},getSystemInfoSync(){return {windowWidth:390,windowHeight:844,pixelRatio:3}}});out.wxException=wx.read();wx.dispose();
 const a=new A({dep:{bundle:'b',assets:{d:{path:'dep',type:'t'}}},root:{bundle:'b',dependencies:['dep'],assets:{r:{path:'root',type:'t'}}}},{async load(b,p){return p},release(b,p){if(p==='root')throw Error('release failure')}});
 const l=await a.acquire('root',1);try{l.release()}catch(e){out.releaseError=e.message};out.refsAfterReleaseError={dep:a.getRefCount('b','dep','t'),root:a.getRefCount('b','root','t')};l.release();out.refsAfterRepeat=a.getRefCount('b','dep','t');
 global.window={innerWidth:300,innerHeight:600,devicePixelRatio:1,addEventListener(){},removeEventListener(){}};global.document={documentElement:null,querySelector(){return {getBoundingClientRect(){return {left:-50,top:0,width:400,height:600}}}}};
 const web=new Web(()=>({visibleSize:{width:400,height:600},canvasRect:{x:-50,y:0,width:400,height:600},viewportRect:{x:0,y:0,width:400,height:600},backbufferWidth:400,backbufferHeight:600}));const ws=web.read();out.offscreenContent={content:ws.content,mappedWindowLeft:M.mapWindowPointToUI({x:0,y:300},ws.content,{width:400,height:600}),expectedX:-150};web.dispose();delete global.window;delete global.document;
 console.log(JSON.stringify(out,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
