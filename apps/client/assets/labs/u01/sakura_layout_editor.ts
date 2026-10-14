import { Color, Graphics, Input, input, Label, Node, Sprite, SpriteFrame, UITransform, Vec2, Vec3, view, resources } from 'cc';
import type { UnitSampleGallery } from '../../UnitSampleGallery';
import { instantiate } from 'cc';

const W = 3072, H = 1024;
const PANEL = new Color(19, 34, 51), TEXT = new Color(230, 239, 247), GOLD = new Color(246, 189, 109), BLUE = new Color(108, 193, 224);
import { SAKURA_V03_LAYOUT } from './sakura_v03_layout';
const SHOP_POSITIONS: Array<[number, number]> = [[283,440],[582,466],[952,441],[1712,443],[2051,455],[2392,455]];
const SHOP_NAMES = ['奶茶','糖画','现烤','理发','花灯','投壶'];
const PROTOTYPE_PATHS = new Map(SAKURA_V03_LAYOUT.prototypes.map(p => [p.id, `sakura_v03/${p.path.replace(/\.png$/i, '')}`]));
type Item = { instanceId: string; prototypeId: string; name: string; left: number; top: number; width: number; height: number; scale: number; mirror: boolean; motion: string; order: number; node: Node; shopIndex?: number };

/** U01-only temporary layout editor. All positions and exports remain in source-canvas pixels. */
export class U01SakuraLayoutEditor {
  private items: Item[] = [];
  private frames = new Map<string, SpriteFrame>();
  private selected: Item | null = null;
  private mode: 'edit' | 'camera' = 'edit';
  private selectionLocked = false;
  private root!: Node;
  private canvas!: Node;
  private viewport!: Node;
  private panel!: Node;
  private status!: Label;
  private listIndex = 0;
  private serial = 0;
  private dragging = false;
  private pointerActive = false;
  private dragPoint = new Vec2();
  private startTopLeft: [number, number] = [0, 0];
  private cameraStart = new Vec2();
  private canvasStart = new Vec2();
  private disposed = false;
  private generation = 0;
  private outline!: Node;
  private fallback: HTMLElement | null = null;
  private modeButton: Node | null = null;
  private variantNext: Record<string, boolean> = { flame: true, lotus: true, reflection: true };
  private variantButtons = new Map<string, Node>();
  constructor(private page: Node, private gallery: UnitSampleGallery) {}

  public open(): void {
    const generation=++this.generation;
    this.root = new Node('U01SakuraLayoutEditor'); this.page.addChild(this.root); this.root.addComponent(UITransform).setContentSize(720, 1280);
    this.viewport = this.node('U01Viewport', this.root, 720, 1280, 0, 0);
    this.canvas = this.node('U01SourceCanvas', this.viewport, W, H);
    this.outline=this.node('U01SelectionOutline',this.canvas,1,1); const og=this.outline.addComponent(Graphics);og.strokeColor=GOLD;og.lineWidth=4;
    this.createTopControls(); this.createPanel(); this.fitCanvas();
    this.loadFrames(generation,(missing) => { if (this.disposed||generation!==this.generation) return; if(missing.length){this.status.string=`资源加载失败：${missing.join('、')}；请检查 Creator 导入清单。`;return;} this.createInitialItems(); this.setSelected(this.items[0]); });
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this); input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this); input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this); input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this); input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this); input.on(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
    view.on('canvas-resize', this.fitCanvas, this); view.on('design-resolution-changed', this.fitCanvas, this);
  }

  private loadFrames(generation:number,done: (missing:string[]) => void): void {
    const prototypes=SAKURA_V03_LAYOUT.prototypes; let left=prototypes.length;const missing:string[]=[];
    prototypes.forEach(proto=>resources.load(`${PROTOTYPE_PATHS.get(proto.id)}/spriteFrame`,SpriteFrame,(err,frame)=>{if(this.disposed||generation!==this.generation)return;if(!err&&frame)this.frames.set(proto.id,frame);else missing.push(proto.id);left--;if(left===0)done(missing); }));
  }

  public dispose(): void {
    this.disposed = true;
    this.generation++; this.pointerActive=false; this.dragging=false;
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this); input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this); input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this); input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this); input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this); input.off(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
    view.off('canvas-resize', this.fitCanvas, this); view.off('design-resolution-changed', this.fitCanvas, this);
    this.items = []; this.frames.clear(); this.selected = null;
    if(this.fallback?.isConnected)this.fallback.remove();this.fallback=null;
  }

  private node(name: string, parent: Node, width = 1, height = 1, x = 0, y = 0): Node { const n = new Node(name); parent.addChild(n); n.setPosition(x, y); n.addComponent(UITransform).setContentSize(width, height); return n; }
  private text(parent: Node, value: string, x: number, y: number, w: number, h: number, size = 16): Label { const n = this.node('Text', parent, w, h, x, y); const l=n.addComponent(Label); l.string=value; l.fontSize=size; l.lineHeight=size+4; l.color=TEXT; l.horizontalAlign=Label.HorizontalAlign.CENTER; l.verticalAlign=Label.VerticalAlign.CENTER; l.overflow=Label.Overflow.SHRINK; return l; }
  private button(parent: Node, value: string, x: number, y: number, w: number, h: number, cb: () => void): Node { const n=this.node(`Button_${value}`,parent,w,h,x,y); const g=n.addComponent(Graphics); g.fillColor=PANEL;g.roundRect(-w/2,-h/2,w,h,8);g.fill();g.strokeColor=BLUE;g.lineWidth=1;g.roundRect(-w/2,-h/2,w,h,8);g.stroke();this.text(n,value,0,0,w-8,h-6,15);n.on(Node.EventType.TOUCH_END,(e)=>{e.propagationStopped=true;cb();});return n; }
  private createTopControls(): void {
    const top=this.node('U01TopControls',this.root,700,142,0,0); this.text(top,'U01 樱花场景布局 v0.3 · 临时调整，离开后恢复初始值',0,37,680,30,20);
    this.modeButton=this.button(top,'编辑层',-263,0,86,38,()=>{this.mode=this.mode==='edit'?'camera':'edit';this.updateStatus();});
    this.button(top,'−',-166,0,48,38,()=>this.scaleSelected(.9)); this.button(top,'+',-111,0,48,38,()=>this.scaleSelected(1.1));
    this.button(top,'镜像',-49,0,64,38,()=>this.mirrorSelected()); this.button(top,'删除',24,0,64,38,()=>this.removeSelected());
    this.button(top,'重置',99,0,64,38,()=>this.reset()); this.button(top,'导出',174,0,64,38,()=>void this.exportLayout());
    this.button(top,'返回菜单',270,0,108,38,()=>this.gallery.openMenuFromU01());
    this.button(top,'上一层',-315,-42,62,34,()=>this.selectByList(-1)); this.button(top,'下一层',-245,-42,62,34,()=>this.selectByList(1));
    this.button(top,'锁定选中',-175,-42,74,34,()=>{this.selectionLocked=!this.selectionLocked;this.updateStatus();});
    this.button(top,'X−',-95,-42,48,34,()=>this.moveSelected(-10,0)); this.button(top,'X+',-41,-42,48,34,()=>this.moveSelected(10,0));
    this.button(top,'Y−',13,-42,48,34,()=>this.moveSelected(0,-10)); this.button(top,'Y+',67,-42,48,34,()=>this.moveSelected(0,10));
    this.button(top,'树A +',125,-42,62,34,()=>this.addPrototype('tex_sakura_rr_tree_a')); this.button(top,'树B +',195,-42,62,34,()=>this.addPrototype('tex_sakura_rr_tree_b'));
    this.variantButtons.set('flame',this.button(top,'灵焰A+',265,-42,64,34,()=>this.addSpiritVariant('flame','tex_sakura_rr_spirit_a_flame','tex_sakura_rr_spirit_b_flame')));
    this.status=this.text(top,'',0,-75,680,24,13);
  }
  private createPanel(): void {
    this.panel=this.node('U01LayerPanel',this.root,680,138,0,-515); const g=this.panel.addComponent(Graphics);g.fillColor=new Color(10,20,34,110);g.rect(-340,-69,680,138);g.fill();
    this.text(this.panel,'层列表（从上到下为前景至远景），点选被遮挡层后可拖动',0,48,655,22,13);
    for(let i=0;i<6;i++) this.button(this.panel,`店${i+1}`, -280+i*112, 14, 94, 34,()=>this.selectShop(i));
    const pageSize=10, pageCount=Math.ceil(SAKURA_V03_LAYOUT.instances.length/pageSize); for(let page=0;page<pageCount;page++){const first=page*pageSize+1,last=Math.min((page+1)*pageSize,SAKURA_V03_LAYOUT.instances.length);this.button(this.panel,`实例 ${first}-${last}`, -224+page*112,-27,100,34,()=>this.selectPage(page,pageSize));}
    this.variantButtons.set('lotus',this.button(this.panel,'莲花A+',-262,-51,90,28,()=>this.addSpiritVariant('lotus','tex_sakura_rr_spirit_a_lotus','tex_sakura_rr_spirit_b_lotus'))); this.variantButtons.set('reflection',this.button(this.panel,'倒影A+',-160,-51,90,28,()=>this.addSpiritVariant('reflection','tex_sakura_rr_spirit_a_reflection','tex_sakura_rr_spirit_b_reflection')));
    this.button(this.panel,'镜头复位',-53,-51,104,28,()=>{this.fitCanvas();}); this.button(this.panel,'缩放−',68,-51,76,28,()=>this.zoomCanvas(.9)); this.button(this.panel,'缩放+',155,-51,76,28,()=>this.zoomCanvas(1.1));
  }
  private createInitialItems(): void {
    for(const entry of SAKURA_V03_LAYOUT.instances) {
      const item: Item={instanceId:entry.instanceId,prototypeId:entry.assetId,name:entry.name,left:entry.x,top:entry.y,width:entry.width,height:entry.height,scale:1,mirror:entry.mirror,motion:entry.motion,order:entry.order,node:new Node(entry.name)};
      this.makeItemNode(item); this.items.push(item);
    }
    const shops=(this.gallery as any).shopPrefabs as any[];
    for(let i=0;i<6;i++) {
      const [left,top]=SHOP_POSITIONS[i];
      const item:Item={instanceId:`ORIGINAL-SHOP-${i+1}`,prototypeId:'ORIGINAL-SHOP',name:`原店参考${String(i+1).padStart(2,'0')} ${SHOP_NAMES[i]}`,left,top,width:1024,height:1024,scale:0.34,mirror:false,motion:'static',order:16.5+i*0.001,node:new Node(`原店参考${i+1}`),shopIndex:i};
      const prefab=shops?.[i]; if(prefab){const instance=instantiate(prefab); item.node=instance; this.canvas.addChild(instance);}
      this.items.push(item);
    }
    this.items.sort((a,b)=>a.order-b.order); this.reorder();
  }
  private makeItemNode(item: Item): void { const n=new Node(item.name); const tr=n.addComponent(UITransform);const frame=this.frames.get(item.prototypeId); if(frame){const sprite=n.addComponent(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.trim=false;sprite.spriteFrame=frame;}tr.setContentSize(item.width,item.height); this.canvas.addChild(n); item.node=n; this.applyItem(item); }
  private applyItem(item: Item): void {
    const dw=item.width*item.scale, dh=item.height*item.scale;
    item.node.setScale(item.mirror?-item.scale:item.scale,item.scale,1); item.node.setPosition(item.left+dw/2-W/2,H/2-(item.top+dh/2),0);
  }
  private reorder(): void { this.items.sort((a,b)=>a.order-b.order); this.items.forEach((item,index)=>{this.applyItem(item);if(item.node.isValid)item.node.setSiblingIndex(index);});
  }
  private fitCanvas(): void { if(!this.canvas||!this.viewport)return; const v=view.getVisibleSize(); const scale=Math.max(.06,Math.min((v.width-16)/W,(v.height-280)/H)); this.canvas.setScale(scale,scale,1); this.canvas.setPosition(0,0,0); this.root.getChildByName('U01TopControls')?.setPosition(0,v.height/2-76,0); this.panel?.setPosition(0,-v.height/2+130,0); }
  private zoomCanvas(f:number): void { const s=Math.max(.06,Math.min(.8,this.canvas.scale.x*f));this.canvas.setScale(s,s,1); }
  private createStableId(proto:string): string { this.serial++; return `${proto}-added-${Date.now()}-${this.serial}`; }
  private addPrototype(protoId:string): void { const d=SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===protoId);if(!d||!this.frames.has(protoId))return;const peers=this.items.filter(i=>i.prototypeId===protoId);const base=peers.length?Math.max(...peers.map(i=>i.order)):Math.max(...this.items.map(i=>i.order))+0.1;const item:Item={instanceId:this.createStableId(protoId),prototypeId:protoId,name:`${protoId} 新增`,left:1536-d.width/2,top:512-d.height/2,width:d.width,height:d.height,scale:1,mirror:false,motion:'static',order:base+0.1,node:new Node(protoId)};this.makeItemNode(item);this.items.push(item);this.reorder();this.setSelected(item);this.updateStatus(); }
  private addSpiritVariant(family:string,aId:string,bId:string):void {const useA=this.variantNext[family];this.addPrototype(useA?aId:bId);this.variantNext[family]=!useA;const button=this.variantButtons.get(family)?.getChildByName('Text')?.getComponent(Label);if(button)button.string=`${family==='flame'?'灵焰':family==='lotus'?'莲花':'倒影'}${useA?'B':'A'}+`;}
  private environmentItems(): Item[] { return this.items.filter(i=>i.prototypeId!=='ORIGINAL-SHOP'); }
  private selectPage(page:number,pageSize:number): void { const candidates=this.environmentItems();const index=page*pageSize;if(index>=candidates.length)return;this.listIndex=index;this.setSelected(candidates[index]); }
  private selectByList(dir:number): void { const candidates=this.environmentItems();if(!candidates.length)return;this.listIndex=(this.listIndex+dir+candidates.length)%candidates.length;this.setSelected(candidates[this.listIndex]); }
  private selectShop(index:number):void {const it=this.items.find(i=>i.shopIndex===index);if(it)this.setSelected(it);}
  private setSelected(item:Item|undefined|null):void {this.selected=item??null;if(this.selected){const index=this.environmentItems().indexOf(this.selected);if(index>=0)this.listIndex=index;}if(this.outline?.isValid){if(this.selected){const i=this.selected;this.outline.active=true;this.outline.setPosition(i.left+i.width*i.scale/2-W/2,H/2-(i.top+i.height*i.scale/2),1);this.outline.setScale(i.scale,i.scale,1);const tr=this.outline.getComponent(UITransform)!;tr.setContentSize(i.width,i.height);const g=this.outline.getComponent(Graphics)!;g.clear();g.strokeColor=GOLD;g.lineWidth=4;g.rect(-i.width/2,-i.height/2,i.width,i.height);g.stroke();}else this.outline.active=false;}this.updateStatus();}
  private updateStatus():void {if(!this.status)return;const i=this.selected;const env=this.items.filter(x=>x.shopIndex===undefined);const current=i&&i.shopIndex===undefined?env.findIndex(x=>x.instanceId===i.instanceId)+1:0;this.status.string=`${this.mode==='edit'?'编辑层':'镜头'}${this.selectionLocked?' · 已锁定':''} · ${i?i.name:'未选中'} · ${i?.prototypeId??''} · 环境 ${current||'—'}/${env.length} · X ${i?Math.round(i.left):'—'} Y ${i?Math.round(i.top):'—'} 缩放 ${i?.scale.toFixed(2)??'—'}`;const label=this.modeButton?.getChildByName('Text')?.getComponent(Label);if(label)label.string=this.mode==='edit'?'切镜头':'切编辑';}
  private moveSelected(dx:number,dy:number):void {const i=this.selected;if(!i)return;i.left+=dx;i.top+=dy;this.applyItem(i);this.setSelected(i);}
  private scaleSelected(f:number):void {const i=this.selected;if(!i)return;i.scale=Math.max(.1,Math.min(4,+(i.scale*f).toFixed(3)));this.applyItem(i);this.setSelected(i);}
  private mirrorSelected():void {if(!this.selected)return;this.selected.mirror=!this.selected.mirror;this.applyItem(this.selected);this.setSelected(this.selected);}
  private removeSelected():void {const i=this.selected;if(!i)return;i.node.destroy();this.items=this.items.filter(x=>x!==i);this.reorder();this.setSelected(null);}
  private reset():void {this.dispose();this.root.destroy();this.items=[];this.frames.clear();this.disposed=false;this.open();this.status.string='已恢复 v0.3 基线；离开重入也会重新加载该基线。';}
  private sourcePoint(p:Vec2):Vec2|null {const local=this.canvas.getComponent(UITransform)?.convertToNodeSpaceAR(new Vec3(p.x,p.y,0));if(!local)return null;return new Vec2(local.x+W/2,H/2-local.y);}
  private onTouchStart(e:any):void {const screen=e.getUILocation();if(this.onUi(screen))return;this.pointerActive=true;this.cameraStart.set(screen.x,screen.y);this.canvasStart.set(this.canvas.position.x,this.canvas.position.y);const p=this.sourcePoint(screen);if(this.mode==='edit'&&p){const hit=this.selectionLocked?this.selected:this.hitTest(p);if(hit&&!this.selectionLocked)this.setSelected(hit);if(this.selected&&hit){this.dragging=true;this.dragPoint=p;this.startTopLeft=[this.selected.left,this.selected.top];}}e.propagationStopped=true;}
  private onTouchMove(e:any):void {if(!this.pointerActive)return;if(this.dragging&&this.selected){const p=this.sourcePoint(e.getUILocation());if(!p)return;this.selected.left=this.startTopLeft[0]+p.x-this.dragPoint.x;this.selected.top=this.startTopLeft[1]+p.y-this.dragPoint.y;this.applyItem(this.selected);this.setSelected(this.selected);}else if(this.mode==='camera'){const p=e.getUILocation();this.canvas.setPosition(this.canvasStart.x+p.x-this.cameraStart.x,this.canvasStart.y+p.y-this.cameraStart.y,0);}}
  private onTouchEnd():void {this.dragging=false;this.pointerActive=false;}
  private onMouseDown(e:any):void {if(e.getButton()!==0)return;const screen=e.getUILocation();if(this.onUi(screen)){this.pointerActive=false;return;}this.pointerActive=true;this.cameraStart.set(screen.x,screen.y);this.canvasStart.set(this.canvas.position.x,this.canvas.position.y);const p=this.sourcePoint(screen);if(this.mode==='edit'&&p){const hit=this.selectionLocked?this.selected:this.hitTest(p);if(hit&&!this.selectionLocked)this.setSelected(hit);if(this.selected&&hit){this.dragging=true;this.dragPoint=p;this.startTopLeft=[this.selected.left,this.selected.top];}}}
  private onMouseMove(e:any):void {if(!this.pointerActive)return;if(this.dragging&&this.selected){const p=this.sourcePoint(e.getUILocation());if(!p)return;this.selected.left=this.startTopLeft[0]+p.x-this.dragPoint.x;this.selected.top=this.startTopLeft[1]+p.y-this.dragPoint.y;this.applyItem(this.selected);this.setSelected(this.selected);}else if(this.mode==='camera'){const p=e.getUILocation();this.canvas.setPosition(this.canvasStart.x+p.x-this.cameraStart.x,this.canvasStart.y+p.y-this.cameraStart.y,0);}}
  private onMouseUp():void {this.dragging=false;this.pointerActive=false;}
  private hitTest(p:Vec2):Item|null {for(let n=this.items.length-1;n>=0;n--){const i=this.items[n],w=i.width*i.scale,h=i.height*i.scale;if(p.x>=i.left&&p.x<=i.left+w&&p.y>=i.top&&p.y<=i.top+h)return i;}return null;}
  private onWheel(e:any):void {if(this.mode==='camera'&&!this.onUi(e.getUILocation()))this.zoomCanvas(e.getScrollY()<0?1.1:.9);}
  private onUi(point:Vec2):boolean {for(const n of [this.root.getChildByName('U01TopControls'),this.root.getChildByName('U01LayerPanel')]){const t=n?.getComponent(UITransform);if(!n||!t||!n.activeInHierarchy)continue;const p=t.convertToNodeSpaceAR(new Vec3(point.x,point.y,0));if(Math.abs(p.x)<t.contentSize.width/2&&Math.abs(p.y)<t.contentSize.height/2)return true;}return false;}
  private async exportLayout():Promise<void> {const data=this.exportData();const json=JSON.stringify(data,null,2);const nav=(globalThis as any).navigator;try{if(!nav?.clipboard?.writeText)throw new Error('no clipboard');await nav.clipboard.writeText(json);this.status.string='参数已复制；同时打开只读文本供复核。';}catch{this.status.string='剪贴板不可用，请从回退文本框手动复制。';}this.openFallback(json);}
  private exportData():any {
    const prototypes=SAKURA_V03_LAYOUT.prototypes.map(proto=>{const frame=this.frames.get(proto.id);return {assetId:proto.id,artPath:proto.artPath,clientPath:`apps/client/assets/resources/sakura_v03/${proto.path}`,width:proto.width,height:proto.height,sha256:proto.sha256,imageUuid:(proto as any).imageUuid??null,textureUuid:(proto as any).textureUuid??null,spriteFrameUuid:frame?.uuid??(proto as any).spriteFrameUuid??null};});
    return {schema:'U01_SAKURA_LAYOUT_V0_3',temporaryPreview:true,sourceVersion:SAKURA_V03_LAYOUT.sourceVersion,canvas:{width:W,height:H,origin:'top-left',anchor:'left-top integer pixels',mirrorAxisX:1536,positionConversion:'cocosCenterX=left+displayWidth/2-1536; cocosCenterY=512-(top+displayHeight/2)'},prototypes,instances:this.items.map(i=>({instanceId:i.instanceId,assetId:i.prototypeId,assetUuid:i.shopIndex===undefined?this.frames.get(i.prototypeId)?.uuid??null:this.prefabUuid(i.shopIndex),imageUuid:i.shopIndex===undefined?(SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===i.prototypeId) as any)?.imageUuid??null:undefined,textureUuid:i.shopIndex===undefined?(SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===i.prototypeId) as any)?.textureUuid??null:undefined,spriteFrameUuid:i.shopIndex===undefined?this.frames.get(i.prototypeId)?.uuid??(SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===i.prototypeId) as any)?.spriteFrameUuid??null:undefined,name:i.name,sourceSize:{width:i.width,height:i.height},left:i.left,top:i.top,scale:i.scale,displayWidth:i.width*i.scale,displayHeight:i.height*i.scale,cocosCenter:{x:i.left+i.width*i.scale/2-W/2,y:H/2-(i.top+i.height*i.scale/2)},mirror:i.mirror,motion:i.motion,orderBottomToTop:i.order,shopFootpoint:i.shopIndex===undefined?undefined:this.shopFoot(i)})),counts:{environment:this.items.filter(i=>i.shopIndex===undefined).length,trees:this.items.filter(i=>i.prototypeId.includes('tree_')).length,flames:this.items.filter(i=>i.prototypeId.includes('_flame')).length,lotuses:this.items.filter(i=>i.prototypeId.includes('_lotus')).length,reflections:this.items.filter(i=>i.prototypeId.includes('_reflection')).length,shops:this.items.filter(i=>i.shopIndex!==undefined).length}};
  }
  private shopFoot(i:Item):any {const groundY=-388;return {source:'derived from current top-left box and prefab ground_contact',artReferenceTopLeft:[i.left,i.top],scale:i.scale,footX:i.left+i.width*i.scale/2-1536,footY:512-(i.top+i.height*i.scale/2-groundY*i.scale),groundContactLocalY:groundY};}
  private prefabUuid(index:number):string|null {const prefab=(this.gallery as any).shopPrefabs?.[index];return prefab?.uuid??prefab?._uuid??null;}
  private openFallback(json:string):void {const d=(globalThis as any).document;if(!d?.body)return;const o=d.createElement('div');this.fallback=o;o.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#06101eeF;display:flex;align-items:center;justify-content:center;padding:20px';const box=d.createElement('div');box.style.cssText='width:min(850px,100%);height:85vh;background:#132233;color:#fff;padding:16px;display:flex;flex-direction:column;gap:10px';const title=d.createElement('div');title.textContent='U01 完整布局 JSON · 可全选复制';const ta=d.createElement('textarea');ta.readOnly=true;ta.value=json;ta.style.cssText='flex:1;background:#091522;color:#fff;font:12px monospace';const row=d.createElement('div');const all=d.createElement('button');all.textContent='全选';all.onclick=()=>{ta.focus();ta.select();};const close=d.createElement('button');close.textContent='关闭';close.onclick=()=>{o.remove();this.fallback=null;};row.append(all,close);box.append(title,ta,row);o.append(box);d.body.append(o);ta.focus();ta.select();}
}
