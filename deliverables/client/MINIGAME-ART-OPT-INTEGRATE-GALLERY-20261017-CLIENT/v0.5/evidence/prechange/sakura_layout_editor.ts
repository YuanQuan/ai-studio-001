import { Color, Graphics, Input, input, Label, Mask, Node, resources, Sprite, SpriteFrame, UITransform, Vec2, Vec3, view } from 'cc';
import type { UnitSampleGallery } from '../../UnitSampleGallery';
import { instantiate } from 'cc';

const W = 3072, H = 1024;
const PANEL = new Color(19, 34, 51), TEXT = new Color(230, 239, 247), GOLD = new Color(246, 189, 109), BLUE = new Color(108, 193, 224);
import { SAKURA_V03_LAYOUT } from './sakura_v03_layout';
import { attachSakuraV03EyeGlow, SakuraV03Motion } from './sakura_v03_environment';
import { deriveWaterGroups } from './sakura_water_motion_math';
import { USER_LAYOUT_PROFILE } from './sakura_user_layout';
import { ScrollableTextPanel } from '../../framework/ui/scrollable_text_panel';
export const prototypeBundlePath = (id: string): string | undefined => {
  const prototype = SAKURA_V03_LAYOUT.prototypes.find(item => item.id === id);
  return prototype ? `sakura_v03/${prototype.path.replace(/\.png$/i, '')}` : undefined;
};
export type U01ResourceProvider = {
  loadPageResource(path: string, type: unknown, callback: (error: Error | null, asset: any) => void): void;
  releasePageResource(path: string, type: unknown): void;
  /** Applies session-prepared public derived frames before the clone enters the live page. */
  bindPrefab?(root: Node, moduleId: string): void;
};
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
  private panelViewport!: Node;
  private panelContent!: Node;
  private panelOverlay!: Node;
  private panelEntry!: Node;
  private panelScrollOffset = 0;
  private panelScrollY: number | null = null;
  private panelScrollGesture = false;
  private panelMaxScroll = 0;
  private resize = ():void => this.layoutControls();
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
  private motion: SakuraV03Motion | null = null;
  private generation = 0;
  private outline!: Node;
  private textReader: ScrollableTextPanel | null = null;
  private loadingError = false;
  private cameraFitScale = 0;
  private cameraFitCenter = new Vec2();
  private modeButton: Node | null = null;
  private variantNext: Record<string, boolean> = { flame: true, lotus: true, reflection: true };
  private variantButtons = new Map<string, Node>();
  private pageResourcePaths = new Set<string>();
  private readonly pageResources: U01ResourceProvider;
  constructor(private page: Node, private gallery: UnitSampleGallery, provider?: U01ResourceProvider) {
    // The provider must be captured from this page's Gallery session. Never
    // look it up again through Gallery after an async callback, because a late
    // completion from a disposed editor could otherwise release a new page's lease.
    this.pageResources = provider ?? {
      loadPageResource: (path, type, callback) => resources.load(path, type as any, callback as any),
      releasePageResource: (path, type) => resources.release(path, type as any),
    };
  }

  protected update(): void {
    // Keep the selection frame attached to the rendered node while the river driver moves it.
    if (this.selected?.node?.isValid && this.outline?.isValid && this.outline.active) {
      const node = this.selected.node;
      this.outline.setPosition(node.position.x, node.position.y, 1);
      this.outline.setScale(Math.abs(node.scale.x), node.scale.y, 1);
    }
  }

  public open(): void {
    const generation=++this.generation;
    this.root = new Node('U01SakuraLayoutEditor'); this.page.addChild(this.root); this.root.addComponent(UITransform).setContentSize(720, 1280);
    this.viewport = this.node('U01Viewport', this.root, 720, 1280, 0, 0);
    this.canvas = this.node('U01SourceCanvas', this.viewport, W, H);
    this.outline=this.node('U01SelectionOutline',this.canvas,1,1); const og=this.outline.addComponent(Graphics);og.strokeColor=GOLD;og.lineWidth=4;
    this.createTopControls(); this.createPanel(); this.organizeControls(); this.fitCanvas();
    this.loadFrames(generation,(missing) => { if (this.disposed||generation!==this.generation) return; if(missing.length){this.loadingError=true;this.pointerActive=false;this.dragging=false;const message=`资源加载失败，共 ${missing.length} 项：\n${missing.join('\n')}\n\n缺失的资源ID已完整列出。可重新请求这些 resources 路径；仍失败时请返回菜单检查Creator导入。`;this.status.string=`资源加载失败 ${missing.length} 项 · 点此查看并重试`;this.showText('资源加载失败',message,{label:'重试资源',run:()=>this.retryFrames()});return;} this.loadingError=false; this.textReader?.closePanel(); this.createInitialItems();
      this.motion = this.canvas.addComponent(SakuraV03Motion);
      const eyeFrame=this.frames.get('tex_sakura_rr_far_l_eye_glow');
      const eyeGlows=eyeFrame?this.items.filter(item=>item.prototypeId==='tex_sakura_rr_far_l').map(item=>attachSakuraV03EyeGlow(item.node,eyeFrame)):[];
      this.motion.configureWater(deriveWaterGroups(USER_LAYOUT_PROFILE.instances).map(group => ({
        nodes: group.memberIds.map(id => this.items.find(item => item.instanceId === id)?.node).filter((node): node is Node => !!node),
        direction: group.direction,
      })),eyeGlows);
      this.setSelected(this.items[0]); });
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this); input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this); input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this); input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this); input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this); input.on(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
    view.on('canvas-resize', this.resize, this); view.on('design-resolution-changed', this.resize, this);
  }

  private loadFrames(generation:number,done: (missing:string[]) => void): void {
    const prototypes=SAKURA_V03_LAYOUT.prototypes; let left=prototypes.length;const missing:string[]=[];
    prototypes.forEach(proto=>{
      const assetPath = prototypeBundlePath(proto.id);
      const path = assetPath ? `${assetPath}/spriteFrame` : '';
      if (!path) { missing.push(proto.id); if (--left === 0) done(missing); return; }
      this.pageResources.loadPageResource(path, SpriteFrame, (err, frame) => {
        if (this.disposed || generation !== this.generation) {
          if (frame) this.pageResources.releasePageResource(path, SpriteFrame);
          return;
        }
        if (!err && frame) { this.frames.set(proto.id, frame); this.pageResourcePaths.add(path); }
        else missing.push(proto.id);
        if (--left === 0) done(missing);
      });
    });
  }

  private releasePageFrames(): void {
    if (this.root?.isValid) {
      for (const sprite of this.root.getComponentsInChildren(Sprite)) sprite.spriteFrame = null;
    }
    for (const path of this.pageResourcePaths) this.pageResources.releasePageResource(path, SpriteFrame);
    this.pageResourcePaths.clear();
    this.frames.clear();
  }

  public dispose(): void {
    this.disposed = true;
    this.generation++;
    this.releasePageFrames();
    this.pointerActive=false; this.dragging=false;
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this); input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this); input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this); input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this); input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this); input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this); input.off(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
    view.off('canvas-resize', this.resize, this); view.off('design-resolution-changed', this.resize, this);
    this.items = []; this.frames.clear(); this.selected = null;
    this.textReader?.root.destroy();this.textReader=null;
  }

  private node(name: string, parent: Node, width = 1, height = 1, x = 0, y = 0): Node { const n = new Node(name); parent.addChild(n); n.setPosition(x, y); n.addComponent(UITransform).setContentSize(width, height); return n; }
  private px(value:number):number { return (this.gallery as any).uiPixels(value,view.getVisibleSize()); }
  private text(parent: Node, value: string, x: number, y: number, w: number, h: number, size = 16): Label { const n = this.node('Text', parent, w, h, x, y); const l=n.addComponent(Label); l.string=value; l.fontSize=size; l.lineHeight=size+4; l.color=TEXT; l.horizontalAlign=Label.HorizontalAlign.CENTER; l.verticalAlign=Label.VerticalAlign.CENTER; l.overflow=Label.Overflow.CLAMP; return l; }
  private button(parent: Node, value: string, x: number, y: number, w: number, h: number, cb: () => void): Node { const n=this.node(`Button_${value}`,parent,w,h,x,y); const g=n.addComponent(Graphics); g.fillColor=PANEL;g.roundRect(-w/2,-h/2,w,h,8);g.fill();g.strokeColor=BLUE;g.lineWidth=1;g.roundRect(-w/2,-h/2,w,h,8);g.stroke();this.text(n,value,0,0,w-8,h-6,16);n.on(Node.EventType.TOUCH_START,()=>{if(this.panelScrollY===null)this.panelScrollGesture=false;});n.on(Node.EventType.TOUCH_END,(e)=>{e.propagationStopped=true;if(!this.panelScrollGesture)cb();});return n; }
  private createTopControls(): void {
    const top=this.node('U01TopControls',this.root,700,142,0,0); this.text(top,'U01 樱花场景布局 v0.5 · 临时调整，离开后恢复初始值',0,37,680,30,20);
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
    const environmentCount=USER_LAYOUT_PROFILE.instances.length-6; const pageSize=10, pageCount=Math.ceil(environmentCount/pageSize); for(let page=0;page<pageCount;page++){const first=page*pageSize+1,last=Math.min((page+1)*pageSize,environmentCount);this.button(this.panel,`实例 ${first}-${last}`, -224+page*112,-27,100,34,()=>this.selectPage(page,pageSize));}
    this.variantButtons.set('lotus',this.button(this.panel,'莲花A+',-262,-51,90,28,()=>this.addSpiritVariant('lotus','tex_sakura_rr_spirit_a_lotus','tex_sakura_rr_spirit_b_lotus'))); this.variantButtons.set('reflection',this.button(this.panel,'倒影A+',-160,-51,90,28,()=>this.addSpiritVariant('reflection','tex_sakura_rr_spirit_a_reflection','tex_sakura_rr_spirit_b_reflection')));
    this.button(this.panel,'镜头复位',-53,-51,104,28,()=>{this.fitCanvas();}); this.button(this.panel,'缩放−',68,-51,76,28,()=>this.zoomCanvas(.9)); this.button(this.panel,'缩放+',155,-51,76,28,()=>this.zoomCanvas(1.1));
  }
  private organizeControls(): void {
    const visible=view.getVisibleSize();
    this.root.getComponent(UITransform)?.setContentSize(visible.width,visible.height);this.viewport.getComponent(UITransform)?.setContentSize(visible.width,visible.height);
    const oldPanel=this.panel, top=this.root.getChildByName('U01TopControls')!;
    this.status.node.setParent(this.root);
    const shade=this.node('U01ControlShade',this.root,visible.width,visible.height); shade.active=false;
    const sg=shade.addComponent(Graphics); sg.fillColor=new Color(4,12,20,205);sg.rect(-visible.width/2,-visible.height/2,visible.width,visible.height);sg.fill();
    shade.on(Node.EventType.TOUCH_START,e=>{e.propagationStopped=true;});
    shade.on(Node.EventType.TOUCH_END,e=>{e.propagationStopped=true;});
    this.panelOverlay=shade;
    this.panel=this.node('U01ControlSurface',shade,600,700); this.panel.active=false;
    const bg=this.panel.addComponent(Graphics);bg.fillColor=PANEL;bg.rect(-300,-350,600,700);bg.fill();bg.strokeColor=BLUE;bg.lineWidth=2;bg.rect(-300,-350,600,700);bg.stroke();
    this.text(this.panel,'图层与调节',-90,0,360,52,20);
    this.button(this.panel,'关闭',238,0,104,48,()=>{this.panelOverlay.active=false;this.panel.active=false;this.panelEntry.active=true;});
    this.panelViewport=this.node('U01ControlScroll',this.panel,580,580,0,-28);this.panelViewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;this.panelViewport.addComponent(Graphics);
    this.panelViewport.on(Node.EventType.TOUCH_START,(e:any)=>{this.panelScrollY=e.getUILocation().y;this.panelScrollGesture=false;e.propagationStopped=true;});
    this.panelViewport.on(Node.EventType.TOUCH_MOVE,(e:any)=>{const y=e.getUILocation().y;if(this.panelScrollY!==null){if(Math.abs(y-this.panelScrollY)>8)this.panelScrollGesture=true;this.panelScrollOffset=Math.max(0,Math.min(this.panelMaxScroll,this.panelScrollOffset+this.panelScrollY-y));this.panelScrollY=y;this.layoutControls();}e.propagationStopped=true;});
    this.panelViewport.on(Node.EventType.TOUCH_END,(e:any)=>{this.panelScrollY=null;e.propagationStopped=true;});
    this.panelViewport.on(Node.EventType.TOUCH_CANCEL,()=>{this.panelScrollY=null;});
    this.panelContent=this.node('U01ControlScrollContent',this.panelViewport,560,1000,0,290);
    const entries:Node[]=[];
    for(const owner of [top,oldPanel]) for(const child of [...owner.children]) {
      if(!child.name.startsWith('Button_')) continue;
      if(child===this.modeButton||child.name==='Button_返回菜单') continue;
      child.setParent(this.panelContent); entries.push(child);
    }
    oldPanel.destroy();
    const back=top.children.find(n=>n.name==='Button_返回菜单');
    const title=top.children.find(n=>n.name==='Text');
    top.getComponent(UITransform)?.setContentSize(700,56);
    this.panelEntry=this.button(this.root,'图层与调节',0,0,200,48,()=>{this.panelOverlay.active=true;this.panel.active=true;this.panelEntry.active=false;this.layoutControls();});
    this.panelEntry.name='U01PanelEntry';
    this.panelOverlay.active=false;
    this.layoutControls(entries);
    this.status.node.on(Node.EventType.TOUCH_END,(e:any)=>{e.propagationStopped=true;if(this.loadingError)this.showText('资源加载失败',this.status.string,{label:'重试资源',run:()=>this.retryFrames()});else this.showText('U01 当前编辑状态',`${this.status.string}\n\n完整参数：\n${JSON.stringify(this.exportData(),null,2)}`);});
  }
  private layoutControls(entries?:Node[]): void {
    if(!this.panelOverlay?.isValid)return;
    const visible=view.getVisibleSize(), safe=(this.gallery as any).safeUiBounds(visible), gap=this.px(8), nav=this.px(56), hit=this.px(48);
    const centerX=(safe.left+safe.right)/2, width=Math.min(safe.right-safe.left,this.px(620)), height=Math.min(safe.top-safe.bottom-this.px(32),this.px(620));
    this.panelOverlay.getComponent(UITransform)?.setContentSize(visible.width,visible.height);
    const overlayG=this.panelOverlay.getComponent(Graphics);if(overlayG){overlayG.clear();overlayG.fillColor=new Color(4,12,20,205);overlayG.rect(-visible.width/2,-visible.height/2,visible.width,visible.height);overlayG.fill();}
    this.panel.setPosition(centerX,(safe.top+safe.bottom)/2);this.panel.getComponent(UITransform)?.setContentSize(width,height);
    const g=this.panel.getComponent(Graphics)!;g.clear();g.fillColor=PANEL;g.rect(-width/2,-height/2,width,height);g.fill();g.strokeColor=BLUE;g.lineWidth=2;g.rect(-width/2,-height/2,width,height);g.stroke();
    const title=this.panel.children.find(n=>n.name==='Text');title?.setPosition(0,height/2-nav/2);title?.getComponent(UITransform)?.setContentSize(width-this.px(140),nav);
    const panelTitle=title?.getComponent(Label);if(panelTitle){panelTitle.string='图层与调节';panelTitle.fontSize=this.px(16);panelTitle.lineHeight=this.px(24);panelTitle.overflow=Label.Overflow.CLAMP;panelTitle.enableWrapText=false;}
    const close=this.panel.children.find(n=>n.name==='Button_关闭');close?.getComponent(UITransform)?.setContentSize(this.px(104),nav);close?.setPosition(width/2-this.px(60),height/2-nav/2);this.redrawButton(close);
    const bodyWidth=width-this.px(16),bodyHeight=height-nav-this.px(56);
    this.panelViewport.getComponent(UITransform)?.setContentSize(bodyWidth,bodyHeight);
    this.panelViewport.setPosition(0,-nav/2+this.px(4));
    const mask=this.panelViewport.getComponent(Graphics);if(mask){mask.clear();mask.rect(-bodyWidth/2,-bodyHeight/2,bodyWidth,bodyHeight);mask.fill();}
    const nodes=entries??this.panelContent.children.filter(n=>n.name.startsWith('Button_'));
    const cols=Math.max(1,Math.floor((width-this.px(16)+gap)/(this.px(180)+gap)));
    const cellW=(width-this.px(16)-(cols-1)*gap)/cols, cellH=hit+gap, rows=Math.ceil(nodes.length/cols);
    this.panelContent.getComponent(UITransform)?.setContentSize(width-this.px(16),Math.max(this.panelViewport.getComponent(UITransform)!.height,rows*cellH));
    nodes.forEach((node,index)=>{const row=Math.floor(index/cols),col=index%cols;node.getComponent(UITransform)?.setContentSize(cellW,hit);node.setPosition(-width/2+this.px(8)+cellW/2+col*(cellW+gap),-hit/2-gap/2-row*cellH);
      this.redrawButton(node);const label=node.getChildByName('Text')?.getComponent(Label);if(label){label.fontSize=this.px(16);label.lineHeight=this.px(20);label.overflow=Label.Overflow.CLAMP;label.node.getComponent(UITransform)?.setContentSize(cellW-this.px(8),hit-this.px(6));}});
    this.panelMaxScroll=Math.max(0,rows*cellH-this.panelViewport.getComponent(UITransform)!.height);this.panelScrollOffset=Math.max(0,Math.min(this.panelMaxScroll,this.panelScrollOffset));
    this.panelContent.setPosition(0,this.panelViewport.getComponent(UITransform)!.height/2+this.panelScrollOffset);
    this.panelEntry?.getComponent(UITransform)?.setContentSize(Math.max(this.px(120),Math.min(this.px(220),safe.right-safe.left)),hit);this.redrawButton(this.panelEntry);
    this.panelEntry?.setPosition(centerX,safe.bottom+hit/2);
    this.status?.node.setPosition(centerX,safe.bottom+hit+gap+this.px(24));
    this.status?.node.getComponent(UITransform)?.setContentSize(safe.right-safe.left,this.px(48));
    if(this.status){this.status.fontSize=this.px(14);this.status.lineHeight=this.px(20);this.status.overflow=Label.Overflow.CLAMP;this.status.enableWrapText=true;}
    const top=this.root.getChildByName('U01TopControls'), back=top?.children.find(n=>n.name==='Button_返回菜单'), mode=this.modeButton;
    top?.setPosition(centerX,safe.top-nav/2);top?.getComponent(UITransform)?.setContentSize(safe.right-safe.left,nav);
    const backW=this.px(88);back?.getComponent(UITransform)?.setContentSize(backW,nav);back?.setPosition(safe.left+backW/2-centerX,0);this.redrawButton(back);
    mode?.getComponent(UITransform)?.setContentSize(this.px(96),nav);mode?.setPosition(safe.right-this.px(48)-centerX,0);this.redrawButton(mode);
    const topTitle=top?.children.find(n=>n.name==='Text');topTitle?.setPosition((safe.left+backW+safe.right-this.px(96))/2-centerX,0);topTitle?.getComponent(UITransform)?.setContentSize(Math.max(1,safe.right-safe.left-backW-this.px(96)-this.px(16)),nav);
    if(topTitle){const l=topTitle.getComponent(Label);if(l){l.string='U01 樱花布局';l.fontSize=this.px(16);l.lineHeight=this.px(24);l.overflow=Label.Overflow.CLAMP;l.enableWrapText=false;}}
    this.reflowCanvas();
    this.textReader?.layout(view.getVisibleSize(),(this.gallery as any).safeUiBounds(view.getVisibleSize()));
  }
  private redrawButton(node:Node|null|undefined):void {if(!node?.isValid)return;const tr=node.getComponent(UITransform),g=node.getComponent(Graphics);if(!tr||!g)return;const s=tr.contentSize;g.clear();g.fillColor=PANEL;g.roundRect(-s.width/2,-s.height/2,s.width,s.height,8);g.fill();g.strokeColor=BLUE;g.lineWidth=2;g.roundRect(-s.width/2,-s.height/2,s.width,s.height,8);g.stroke();const label=node.getChildByName('Text')?.getComponent(Label);if(label){label.fontSize=this.px(16);label.lineHeight=this.px(24);label.overflow=Label.Overflow.CLAMP;label.node.getComponent(UITransform)?.setContentSize(Math.max(1,s.width-this.px(8)),Math.max(1,s.height-this.px(6)));}}
  private createInitialItems(): void {
    const shops=(this.gallery as any).shopPrefabs as any[];
    for (const entry of USER_LAYOUT_PROFILE.instances) {
      const shopIndex = entry.instanceId.startsWith('ORIGINAL-SHOP-')
        ? Number(entry.instanceId.slice('ORIGINAL-SHOP-'.length)) - 1 : undefined;
      const item: Item = {
        instanceId: entry.instanceId,
        prototypeId: entry.assetId,
        name: entry.name,
        left: entry.left,
        top: entry.top,
        width: entry.sourceSize.width,
        height: entry.sourceSize.height,
        scale: entry.scale,
        mirror: entry.mirror,
        motion: entry.motion,
        order: entry.orderBottomToTop,
        node: new Node(entry.name),
        shopIndex,
      };
      if (shopIndex !== undefined) {
        const prefab=shops?.[shopIndex];
        if (prefab) {
          const instance = instantiate(prefab); instance.name = entry.name;
          this.pageResources.bindPrefab?.(instance, 'shops');
          this.canvas.addChild(instance); item.node = instance; this.applyItem(item);
        }
      } else {
        this.makeItemNode(item);
      }
      this.items.push(item);
    }
    this.items.sort((a,b)=>a.order-b.order);
    this.reorder();
  }
  private makeItemNode(item: Item): void { const n=new Node(item.name); const tr=n.addComponent(UITransform);const frame=this.frames.get(item.prototypeId); if(frame){const sprite=n.addComponent(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.trim=false;sprite.spriteFrame=frame;}tr.setContentSize(item.width,item.height); this.canvas.addChild(n); item.node=n; this.applyItem(item); }
  private applyItem(item: Item, recaptureMotion = false): void {
    const dw=item.width*item.scale, dh=item.height*item.scale;
    item.node.setScale(item.mirror?-item.scale:item.scale,item.scale,1); item.node.setPosition(item.left+dw/2-W/2,H/2-(item.top+dh/2),0);
    if (recaptureMotion) this.motion?.captureBaseline(item.node);
  }
  private reorder(): void { this.items.sort((a,b)=>a.order-b.order); this.items.forEach((item,index)=>{if(item.node.isValid)item.node.setSiblingIndex(index);});
  }
  private calculateCanvasFit(): {scale:number;center:Vec2} { const v=view.getVisibleSize(),safe=(this.gallery as any).safeUiBounds(v),nav=this.px(56),hit=this.px(48),status=this.px(24),gap=this.px(8); const top=safe.top-nav, bottom=safe.bottom+hit+status+gap; const scale=Math.max(.001,Math.min((safe.right-safe.left-this.px(16))/W,(top-bottom-this.px(16))/H)); return {scale,center:new Vec2((safe.left+safe.right)/2,(top+bottom)/2)}; }
  private fitCanvas(): void { if(!this.canvas||!this.viewport)return; const fit=this.calculateCanvasFit();this.cameraFitScale=fit.scale;this.cameraFitCenter=fit.center.clone();this.canvas.setScale(fit.scale,fit.scale,1);this.canvas.setPosition(fit.center.x,fit.center.y,0); }
  private reflowCanvas(): void { if(!this.canvas||!this.viewport)return; const fit=this.calculateCanvasFit();if(this.cameraFitScale<=0){this.fitCanvas();return;} const zoom=this.canvas.scale.x/this.cameraFitScale;const sourceOffsetX=(this.canvas.position.x-this.cameraFitCenter.x)/this.cameraFitScale;const sourceOffsetY=(this.canvas.position.y-this.cameraFitCenter.y)/this.cameraFitScale;const scale=fit.scale*zoom;this.canvas.setScale(scale,scale,1);this.canvas.setPosition(fit.center.x+sourceOffsetX*fit.scale,fit.center.y+sourceOffsetY*fit.scale,0);this.cameraFitScale=fit.scale;this.cameraFitCenter=fit.center.clone();this.viewport.getComponent(UITransform)?.setContentSize(view.getVisibleSize().width,view.getVisibleSize().height);this.pointerActive=false;this.dragging=false; }
  private showText(title:string,text:string,action:{label:string;run:()=>void}|null=null):void {if(!this.root?.isValid)return;this.pointerActive=false;this.dragging=false;if(!this.textReader)this.textReader=new ScrollableTextPanel(this.root,value=>this.px(value),()=>{this.pointerActive=false;this.dragging=false;});this.textReader.open(title,text,action);const v=view.getVisibleSize();this.textReader.layout(v,(this.gallery as any).safeUiBounds(v));}
  private retryFrames():void {if(this.disposed)return;this.textReader?.closePanel();this.releasePageFrames();this.loadingError=false;this.status.string='正在重新读取场景资源…';const generation=++this.generation;this.loadFrames(generation,missing=>{if(this.disposed||generation!==this.generation)return;if(missing.length){this.loadingError=true;this.status.string=`资源加载失败 ${missing.length} 项 · 点此查看并重试`;const message=`资源加载失败，共 ${missing.length} 项：\n${missing.join('\n')}\n\n系统已实际重新请求Bundle页面资源路径。仍失败时请返回入口检查Creator导入。`;this.showText('资源加载失败',message,{label:'重试资源',run:()=>this.retryFrames()});return;}this.loadingError=false;this.createInitialItems();this.motion=this.canvas.addComponent(SakuraV03Motion);const eye=this.frames.get('tex_sakura_rr_far_l_eye_glow');const glows=eye?this.items.filter(i=>i.prototypeId==='tex_sakura_rr_far_l').map(i=>attachSakuraV03EyeGlow(i.node,eye)):[];this.motion.configureWater(deriveWaterGroups(USER_LAYOUT_PROFILE.instances).map(group=>({nodes:group.memberIds.map(id=>this.items.find(i=>i.instanceId===id)?.node).filter((n):n is Node=>!!n),direction:group.direction})),glows);this.setSelected(this.items[0]);}); }
  private zoomCanvas(f:number): void { const s=Math.max(.06,Math.min(.8,this.canvas.scale.x*f));this.canvas.setScale(s,s,1); }
  private createStableId(proto:string): string { this.serial++; return `${proto}-added-${Date.now()}-${this.serial}`; }
  private addPrototype(protoId:string): void { const d=SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===protoId);if(!d||!this.frames.has(protoId))return;const peers=this.items.filter(i=>i.prototypeId===protoId);const base=peers.length?Math.max(...peers.map(i=>i.order)):Math.max(...this.items.map(i=>i.order))+0.1;const item:Item={instanceId:this.createStableId(protoId),prototypeId:protoId,name:`${protoId} 新增`,left:1536-d.width/2,top:512-d.height/2,width:d.width,height:d.height,scale:1,mirror:false,motion:'static',order:base+0.1,node:new Node(protoId)};this.makeItemNode(item);this.items.push(item);this.reorder();this.setSelected(item);this.updateStatus(); }
  private addSpiritVariant(family:string,aId:string,bId:string):void {const useA=this.variantNext[family];this.addPrototype(useA?aId:bId);this.variantNext[family]=!useA;const button=this.variantButtons.get(family)?.getChildByName('Text')?.getComponent(Label);if(button)button.string=`${family==='flame'?'灵焰':family==='lotus'?'莲花':'倒影'}${useA?'B':'A'}+`;}
  private environmentItems(): Item[] { return this.items.filter(i=>i.prototypeId!=='ORIGINAL-SHOP'); }
  private selectPage(page:number,pageSize:number): void { const candidates=this.environmentItems();const index=page*pageSize;if(index>=candidates.length)return;this.listIndex=index;this.setSelected(candidates[index]); }
  private selectByList(dir:number): void { const candidates=this.environmentItems();if(!candidates.length)return;this.listIndex=(this.listIndex+dir+candidates.length)%candidates.length;this.setSelected(candidates[this.listIndex]); }
  private selectShop(index:number):void {const it=this.items.find(i=>i.shopIndex===index);if(it)this.setSelected(it);}
  private setSelected(item:Item|undefined|null):void {this.selected=item??null;if(this.selected){const index=this.environmentItems().indexOf(this.selected);if(index>=0)this.listIndex=index;}if(this.outline?.isValid){if(this.selected){const i=this.selected;this.outline.active=true;this.outline.setPosition(i.node.position.x,i.node.position.y,1);this.outline.setScale(Math.abs(i.node.scale.x),i.node.scale.y,1);const tr=this.outline.getComponent(UITransform)!;tr.setContentSize(i.width,i.height);const g=this.outline.getComponent(Graphics)!;g.clear();g.strokeColor=GOLD;g.lineWidth=4;g.rect(-i.width/2,-i.height/2,i.width,i.height);g.stroke();}else this.outline.active=false;}this.updateStatus();}
  private updateStatus():void {if(!this.status)return;const i=this.selected;const env=this.items.filter(x=>x.shopIndex===undefined);const current=i&&i.shopIndex===undefined?env.findIndex(x=>x.instanceId===i.instanceId)+1:0;this.status.string=`${this.mode==='edit'?'编辑':'镜头'}${this.selectionLocked?'·锁定':''} · ${i?i.name:'未选中'} · ${current||'—'}/${env.length} · X${i?Math.round(i.left):'—'} Y${i?Math.round(i.top):'—'} 缩放${i?.scale.toFixed(2)??'—'} · 点此查看完整参数`;const label=this.modeButton?.getChildByName('Text')?.getComponent(Label);if(label)label.string=this.mode==='edit'?'切镜头':'切编辑';}
  private moveSelected(dx:number,dy:number):void {const i=this.selected;if(!i)return;i.left+=dx;i.top+=dy;this.applyItem(i,true);this.setSelected(i);}
  private scaleSelected(f:number):void {const i=this.selected;if(!i)return;i.scale=Math.max(.1,Math.min(4,+(i.scale*f).toFixed(3)));this.applyItem(i,true);this.setSelected(i);}
  private mirrorSelected():void {if(!this.selected)return;this.selected.mirror=!this.selected.mirror;this.applyItem(this.selected,true);this.setSelected(this.selected);}
  private removeSelected():void {const i=this.selected;if(!i)return;i.node.destroy();this.items=this.items.filter(x=>x!==i);this.reorder();this.setSelected(null);}
  private reset():void {this.dispose();this.root.destroy();this.items=[];this.frames.clear();this.disposed=false;this.open();this.status.string='已恢复用户冻结布局；离开重入也会重新加载该参数。';}
  private sourcePoint(p:Vec2):Vec2|null {const local=this.canvas.getComponent(UITransform)?.convertToNodeSpaceAR(new Vec3(p.x,p.y,0));if(!local)return null;return new Vec2(local.x+W/2,H/2-local.y);}
  private onTouchStart(e:any):void {if(this.loadingError)return;if(this.textReader?.root.activeInHierarchy){this.pointerActive=false;this.dragging=false;e.propagationStopped=true;return;}const screen=e.getUILocation();if(this.onUi(screen))return;this.pointerActive=true;this.cameraStart.set(screen.x,screen.y);this.canvasStart.set(this.canvas.position.x,this.canvas.position.y);const p=this.sourcePoint(screen);if(this.mode==='edit'&&p){const hit=this.selectionLocked?this.selected:this.hitTest(p);if(hit&&!this.selectionLocked)this.setSelected(hit);if(this.selected&&hit){this.dragging=true;this.dragPoint=p;this.startTopLeft=this.displayTopLeft(this.selected);}}e.propagationStopped=true;}
  private onTouchMove(e:any):void {if(this.loadingError)return;if(this.textReader?.root.activeInHierarchy){this.pointerActive=false;this.dragging=false;return;}if(!this.pointerActive)return;if(this.dragging&&this.selected){const p=this.sourcePoint(e.getUILocation());if(!p)return;this.selected.left=this.startTopLeft[0]+p.x-this.dragPoint.x;this.selected.top=this.startTopLeft[1]+p.y-this.dragPoint.y;this.applyItem(this.selected,true);this.setSelected(this.selected);}else if(this.mode==='camera'){const p=e.getUILocation();this.canvas.setPosition(this.canvasStart.x+p.x-this.cameraStart.x,this.canvasStart.y+p.y-this.cameraStart.y,0);}}
  private onTouchEnd():void {this.dragging=false;this.pointerActive=false;}
  private onMouseDown(e:any):void {if(this.loadingError)return;if(e.getButton()!==0)return;if(this.textReader?.root.activeInHierarchy){this.pointerActive=false;this.dragging=false;return;}const screen=e.getUILocation();if(this.onUi(screen)){this.pointerActive=false;return;}this.pointerActive=true;this.cameraStart.set(screen.x,screen.y);this.canvasStart.set(this.canvas.position.x,this.canvas.position.y);const p=this.sourcePoint(screen);if(this.mode==='edit'&&p){const hit=this.selectionLocked?this.selected:this.hitTest(p);if(hit&&!this.selectionLocked)this.setSelected(hit);if(this.selected&&hit){this.dragging=true;this.dragPoint=p;this.startTopLeft=this.displayTopLeft(this.selected);}}}
  private onMouseMove(e:any):void {if(this.loadingError)return;if(this.textReader?.root.activeInHierarchy){this.pointerActive=false;this.dragging=false;return;}if(!this.pointerActive)return;if(this.dragging&&this.selected){const p=this.sourcePoint(e.getUILocation());if(!p)return;this.selected.left=this.startTopLeft[0]+p.x-this.dragPoint.x;this.selected.top=this.startTopLeft[1]+p.y-this.dragPoint.y;this.applyItem(this.selected,true);this.setSelected(this.selected);}else if(this.mode==='camera'){const p=e.getUILocation();this.canvas.setPosition(this.canvasStart.x+p.x-this.cameraStart.x,this.canvasStart.y+p.y-this.cameraStart.y,0);}}
  private onMouseUp():void {this.dragging=false;this.pointerActive=false;}
  private displayTopLeft(item:Item):[number,number] {const scale=Math.abs(item.node.scale.x);return [item.node.position.x+W/2-item.width*scale/2,H/2-item.node.position.y-item.height*scale/2];}
  private hitTest(p:Vec2):Item|null {for(let n=this.items.length-1;n>=0;n--){const i=this.items[n],[left,top]=this.displayTopLeft(i),w=i.width*Math.abs(i.node.scale.x),h=i.height*Math.abs(i.node.scale.y);if(p.x>=left&&p.x<=left+w&&p.y>=top&&p.y<=top+h)return i;}return null;}
  private onWheel(e:any):void {if(this.textReader?.root.activeInHierarchy)return;if(this.panelOverlay?.activeInHierarchy){this.panelScrollOffset=Math.max(0,Math.min(this.panelMaxScroll,this.panelScrollOffset+(e.getScrollY()<0?this.px(48):-this.px(48))));this.layoutControls();return;}if(this.mode==='camera'&&!this.onUi(e.getUILocation()))this.zoomCanvas(e.getScrollY()<0?1.1:.9);}
  private onUi(point:Vec2):boolean {if(this.textReader?.root.activeInHierarchy||this.panelOverlay?.activeInHierarchy)return true;for(const n of [this.root.getChildByName('U01TopControls'),this.panelEntry]){const t=n?.getComponent(UITransform);if(!n||!t||!n.activeInHierarchy)continue;const p=t.convertToNodeSpaceAR(new Vec3(point.x,point.y,0));if(Math.abs(p.x)<t.contentSize.width/2&&Math.abs(p.y)<t.contentSize.height/2)return true;}return false;}
  private async exportLayout():Promise<void> {const json=JSON.stringify(this.exportData(),null,2);const nav=(globalThis as any).navigator;let message='';try{if(!nav?.clipboard?.writeText)throw new Error('clipboard unavailable');await nav.clipboard.writeText(json);message='平台剪贴板已确认接收。以下仍显示完整参数供复核。';}catch{message='当前平台剪贴板不可用，复制明确失败；以下滚动文本仍可完整阅读参数。';}this.status.string=message;this.showText('U01 完整布局参数',`${message}\n\n${json}`);}
  private exportData():any {
    const prototypes=SAKURA_V03_LAYOUT.prototypes.map(proto=>{const frame=this.frames.get(proto.id);return {assetId:proto.id,artPath:proto.artPath,clientPath:`apps/client/assets/resources/sakura_v03/${proto.path}`,width:proto.width,height:proto.height,sha256:proto.sha256,imageUuid:(proto as any).imageUuid??null,textureUuid:(proto as any).textureUuid??null,spriteFrameUuid:frame?.uuid??(proto as any).spriteFrameUuid??null};});
    return {schema:'U01_SAKURA_LAYOUT_V0_3',temporaryPreview:true,sourceVersion:SAKURA_V03_LAYOUT.sourceVersion,canvas:{width:W,height:H,origin:'top-left',anchor:'left-top integer pixels',mirrorAxisX:1536,positionConversion:'cocosCenterX=left+displayWidth/2-1536; cocosCenterY=512-(top+displayHeight/2)'},prototypes,instances:this.items.map(i=>({instanceId:i.instanceId,assetId:i.prototypeId,assetUuid:i.shopIndex===undefined?this.frames.get(i.prototypeId)?.uuid??null:this.prefabUuid(i.shopIndex),imageUuid:i.shopIndex===undefined?(SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===i.prototypeId) as any)?.imageUuid??null:undefined,textureUuid:i.shopIndex===undefined?(SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===i.prototypeId) as any)?.textureUuid??null:undefined,spriteFrameUuid:i.shopIndex===undefined?this.frames.get(i.prototypeId)?.uuid??(SAKURA_V03_LAYOUT.prototypes.find(p=>p.id===i.prototypeId) as any)?.spriteFrameUuid??null:undefined,name:i.name,sourceSize:{width:i.width,height:i.height},left:i.left,top:i.top,scale:i.scale,displayWidth:i.width*i.scale,displayHeight:i.height*i.scale,cocosCenter:{x:i.left+i.width*i.scale/2-W/2,y:H/2-(i.top+i.height*i.scale/2)},mirror:i.mirror,motion:i.motion,orderBottomToTop:i.order,shopFootpoint:i.shopIndex===undefined?undefined:this.shopFoot(i)})),presentationOverlays:[{instanceId:'SAK-V03-003-eye-glow',assetId:'tex_sakura_rr_far_l_eye_glow',parentInstanceId:'SAK-V03-003',sourceRect:{left:1284,top:250,width:99,height:54},animation:{type:'cosine-opacity',periodMs:4000,minAlpha:48,maxAlpha:255}}],counts:{environment:this.items.filter(i=>i.shopIndex===undefined).length,trees:this.items.filter(i=>i.prototypeId.includes('tree_')).length,flames:this.items.filter(i=>i.prototypeId.includes('_flame')).length,lotuses:this.items.filter(i=>i.prototypeId.includes('_lotus')).length,reflections:this.items.filter(i=>i.prototypeId.includes('_reflection')).length,shops:this.items.filter(i=>i.shopIndex!==undefined).length}};
  }
  private shopFoot(i:Item):any {const groundY=-388;return {source:'derived from current top-left box and prefab ground_contact',artReferenceTopLeft:[i.left,i.top],scale:i.scale,footX:i.left+i.width*i.scale/2-1536,footY:512-(i.top+i.height*i.scale/2-groundY*i.scale),groundContactLocalY:groundY};}
  private prefabUuid(index:number):string|null {const prefab=(this.gallery as any).shopPrefabs?.[index];return prefab?.uuid??prefab?._uuid??null;}

}
