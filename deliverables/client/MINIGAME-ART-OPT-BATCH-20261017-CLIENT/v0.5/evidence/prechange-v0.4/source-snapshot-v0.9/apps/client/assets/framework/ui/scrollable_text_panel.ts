import { Color, EventMouse, EventTouch, Graphics, Label, Mask, Node, UITransform, view } from 'cc';

type SafeBounds = { left: number; right: number; bottom: number; top: number };
type Action = { label: string; run: () => void } | null;

/** A reusable safe-area reader for long status/error/export text. */
export class ScrollableTextPanel {
  readonly root: Node;
  private readonly panel: Node;
  private readonly title: Label;
  private readonly viewport: Node;
  private readonly textNode: Node;
  private readonly text: Label;
  private readonly close: Node;
  private readonly actionButton: Node;
  private action: Action = null;
  private fullHeight = 0;
  private offset = 0;
  private startY: number | null = null;
  private lastY: number | null = null;
  private scrollGesture = false;
  private contentHeight = 0;
  private bodyHeight = 0;
  private fontSize = 16;
  private lineHeight = 24;

  constructor(parent: Node, private readonly uiScale: (logicalPixels: number) => number,
    private readonly onVisibilityChange?: (visible: boolean) => void) {
    this.root = new Node('ScrollableTextPanel'); parent.addChild(this.root);
    this.root.addComponent(UITransform).setContentSize(1, 1); this.root.active = false;
    const shade = this.root.addComponent(Graphics); shade.fillColor = new Color(4, 12, 20, 210);
    this.root.on(Node.EventType.TOUCH_START, (e: EventTouch) => { e.propagationStopped = true; });
    this.root.on(Node.EventType.TOUCH_END, (e: EventTouch) => { e.propagationStopped = true; });
    this.panel = new Node('ScrollableTextSurface'); this.root.addChild(this.panel); this.panel.addComponent(UITransform);
    const bg = this.panel.addComponent(Graphics); bg.fillColor = new Color(19, 34, 51);
    this.title = this.makeLabel(this.panel, 'ScrollableTextTitle', '', 20, new Color(246,189,109));
    this.close = this.makeButton(this.panel, '关闭', () => this.closePanel());
    this.viewport = new Node('ScrollableTextViewport'); this.panel.addChild(this.viewport); this.viewport.addComponent(UITransform);
    this.viewport.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
    this.viewport.addComponent(Graphics);
    this.viewport.on(Node.EventType.TOUCH_START, (e: EventTouch) => {
      const y = e.getUILocation().y; this.startY = this.lastY = y; this.scrollGesture = false; e.propagationStopped = true;
    });
    this.viewport.on(Node.EventType.TOUCH_MOVE, (e: EventTouch) => {
      const y = e.getUILocation().y;
      if (this.lastY !== null) {
        if (this.startY !== null && Math.abs(y - this.startY) > 8) this.scrollGesture = true;
        this.offset = Math.max(0, Math.min(this.maxOffset(), this.offset + y - this.lastY));
        this.lastY = y; this.positionText();
      }
      e.propagationStopped = true;
    });
    this.viewport.on(Node.EventType.TOUCH_END, (e: EventTouch) => {
      this.startY = this.lastY = null; e.propagationStopped = true;
    });
    this.viewport.on(Node.EventType.TOUCH_CANCEL, () => { this.startY = this.lastY = null; });
    this.viewport.on(Node.EventType.MOUSE_WHEEL, (e: EventMouse) => {
      this.offset = Math.max(0, Math.min(this.maxOffset(), this.offset - e.getScrollY() * this.uiScale(32)));
      this.positionText(); e.propagationStopped = true;
    });
    this.textNode = new Node('ScrollableTextContent'); this.viewport.addChild(this.textNode); this.textNode.addComponent(UITransform);
    this.text = this.makeLabel(this.textNode, 'Text', '', 16, new Color(230,239,247));
    this.text.horizontalAlign = Label.HorizontalAlign.LEFT; this.text.verticalAlign = Label.VerticalAlign.TOP;
    this.text.enableWrapText = true; this.text.overflow = Label.Overflow.CLAMP;
    this.actionButton = this.makeButton(this.panel, '', () => { if (this.action) this.action.run(); });
    this.actionButton.active = false;
  }

  private makeLabel(parent: Node, name: string, value: string, size: number, color: Color): Label {
    const n = new Node(name); parent.addChild(n); const t = n.addComponent(UITransform); t.setContentSize(1, 1);
    const label = n.addComponent(Label); label.string = value; label.fontSize = size; label.lineHeight = size + 4; label.color = color;
    label.overflow = Label.Overflow.CLAMP; return label;
  }
  private makeButton(parent: Node, value: string, onClick: () => void): Node {
    const n = new Node(`Button_${value || 'Action'}`); parent.addChild(n); n.addComponent(UITransform);
    const g = n.addComponent(Graphics); g.fillColor = new Color(19, 34, 51); g.strokeColor = new Color(108,193,224); g.lineWidth = 2;
    const l = this.makeLabel(n, 'Text', value, 16, new Color(230,239,247)); l.horizontalAlign = Label.HorizontalAlign.CENTER; l.verticalAlign = Label.VerticalAlign.CENTER;
    n.on(Node.EventType.TOUCH_END, (e: EventTouch) => { e.propagationStopped = true; onClick(); });
    return n;
  }
  private paintButton(node: Node, width: number, height: number): void {
    node.getComponent(UITransform)?.setContentSize(width,height);
    const g=node.getComponent(Graphics); if(g){g.clear();g.fillColor=new Color(19,34,51);g.roundRect(-width/2,-height/2,width,height,8);g.fill();g.strokeColor=new Color(108,193,224);g.lineWidth=2;g.roundRect(-width/2,-height/2,width,height,8);g.stroke();}
    const label=node.getChildByName('Text'); label?.getComponent(UITransform)?.setContentSize(width-this.uiScale(8),height-this.uiScale(6));
  }
  private maxOffset(): number { return Math.max(0, this.fullHeight - this.bodyHeight); }
  private positionText(): void {
    this.offset=Math.max(0,Math.min(this.maxOffset(),this.offset));
    this.textNode.getComponent(UITransform)?.setContentSize(this.contentHeight,this.fullHeight);
    this.textNode.setPosition(0,this.bodyHeight/2-this.fullHeight/2+this.offset,0);
  }
  setText(title: string, content: string, action: Action = null): void {
    this.title.string=title; this.text.string=content; this.action=action;
    this.actionButton.active=!!action;
    this.actionButton.name=`Button_${action?.label??'Action'}`;
    this.actionButton.getChildByName('Text')?.getComponent(Label) && (this.actionButton.getChildByName('Text')!.getComponent(Label)!.string=action?.label??'');
    this.offset=0; this.layout(view.getVisibleSize(),{left:-view.getVisibleSize().width/2,right:view.getVisibleSize().width/2,bottom:-view.getVisibleSize().height/2,top:view.getVisibleSize().height/2});
  }
  open(title: string, content: string, action: Action = null): void { this.setText(title,content,action); this.root.active=true; this.onVisibilityChange?.(true); }
  closePanel(): void { this.root.active=false; this.startY=this.lastY=null; this.scrollGesture=false; this.onVisibilityChange?.(false); }
  layout(visible: {width:number;height:number}, safe: SafeBounds): void {
    if(!this.root?.isValid)return;
    const gap=this.uiScale(8), header=this.uiScale(56), footer=this.action?this.uiScale(48):this.uiScale(16);
    const maxWidth=this.uiScale(560), maxHeight=this.uiScale(680);
    const width=Math.max(1,Math.min(safe.right-safe.left,maxWidth));
    const height=Math.max(1,Math.min(safe.top-safe.bottom-2*gap,maxHeight));
    const cx=(safe.left+safe.right)/2, cy=(safe.bottom+safe.top)/2;
    this.root.getComponent(UITransform)?.setContentSize(visible.width,visible.height);
    const shade=this.root.getComponent(Graphics);if(shade){shade.clear();shade.fillColor=new Color(4,12,20,210);shade.rect(-visible.width/2,-visible.height/2,visible.width,visible.height);shade.fill();}
    this.panel.setPosition(cx,cy);this.panel.getComponent(UITransform)?.setContentSize(width,height);
    const bg=this.panel.getComponent(Graphics);if(bg){bg.clear();bg.fillColor=new Color(19,34,51);bg.roundRect(-width/2,-height/2,width,height,10);bg.fill();bg.strokeColor=new Color(108,193,224);bg.lineWidth=2;bg.roundRect(-width/2,-height/2,width,height,10);bg.stroke();}
    this.title.fontSize=this.uiScale(20);this.title.lineHeight=this.uiScale(28);this.title.node.getComponent(UITransform)?.setContentSize(width-this.uiScale(128),header);this.title.node.setPosition(-this.uiScale(8),height/2-header/2);
    this.close.getChildByName('Text')?.getComponent(Label) && (this.close.getChildByName('Text')!.getComponent(Label)!.fontSize=this.uiScale(16));
    this.paintButton(this.close,this.uiScale(96),header);this.close.setPosition(width/2-this.uiScale(56),height/2-header/2);
    const footH=this.action?this.uiScale(48):0, bodyTop=height/2-header;
    const bodyBottomWithGap=-height/2+footer+gap;
    this.bodyHeight=Math.max(1,bodyTop-bodyBottomWithGap);const viewportWidth=width-this.uiScale(24);this.viewport.getComponent(UITransform)?.setContentSize(viewportWidth,this.bodyHeight);this.viewport.setPosition(0,(bodyTop+bodyBottomWithGap)/2);const maskG=this.viewport.getComponent(Graphics);if(maskG){maskG.clear();maskG.rect(-viewportWidth/2,-this.bodyHeight/2,viewportWidth,this.bodyHeight);maskG.fill();}
    this.fontSize=this.uiScale(16);this.lineHeight=this.uiScale(24);this.text.fontSize=this.fontSize;this.text.lineHeight=this.lineHeight;
    const contentW=width-this.uiScale(48);this.contentHeight=contentW;this.textNode.getComponent(UITransform)?.setContentSize(contentW,1);
    const cols=Math.max(1,Math.floor(contentW/Math.max(1,this.fontSize)));
    this.fullHeight=0;for(const line of this.text.string.split('\n'))this.fullHeight+=Math.max(1,Math.ceil(Array.from(line).length/cols))*this.lineHeight;
    this.fullHeight=Math.max(this.bodyHeight,this.fullHeight+this.uiScale(8));this.text.node.getComponent(UITransform)?.setContentSize(contentW,this.fullHeight);this.text.node.setPosition(0,0,0);this.offset=Math.max(0,Math.min(this.offset,this.maxOffset()));this.positionText();
    this.actionButton.active=!!this.action;if(this.action){this.paintButton(this.actionButton,width-this.uiScale(24),footH);this.actionButton.setPosition(0,-height/2+footer/2);const label=this.actionButton.getChildByName('Text')?.getComponent(Label);if(label){label.fontSize=this.uiScale(16);label.lineHeight=this.uiScale(20);}}
  }
}
