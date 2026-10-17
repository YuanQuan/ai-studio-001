import { Color, EventMouse, EventTouch, Graphics, Label, Mask, Node, UITransform, view } from 'cc';

type SafeBounds = { left: number; right: number; bottom: number; top: number };
type Action = { label: string; run: () => void } | null;
const MAX_PANEL_EDGE = 1800;
// Keep a three-times backing-store scale below Creator's 2048px TTF canvas cap.
const MAX_LABEL_TEXTURE_EDGE = 640;

/** A reusable safe-area reader for long status/error/export text. */
export class ScrollableTextPanel {
  readonly root: Node;
  private readonly panel: Node;
  private readonly title: Label;
  private readonly viewport: Node;
  private readonly textNode: Node;
  private readonly text: Label;
  private readonly textLabels: Label[] = [];
  private readonly close: Node;
  private readonly scrollTopButton: Node;
  private readonly scrollBottomButton: Node;
  private readonly actionButton: Node;
  private action: Action = null;
  private sourceText = '';
  private wrappedLines: string[] = [];
  private visibleText = '';
  private fullHeight = 0;
  private offset = 0;
  private startY: number | null = null;
  private lastY: number | null = null;
  private scrollGesture = false;
  private contentWidth = 0;
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
    this.scrollTopButton = this.makeButton(this.panel, '顶部', () => { this.offset=0; this.positionText(); });
    this.scrollBottomButton = this.makeButton(this.panel, '底部', () => { this.offset=this.maxOffset(); this.positionText(); });
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
    this.textLabels.push(this.text);
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
    const lineHeight=Math.max(1,this.lineHeight);
    const first=Math.min(Math.max(0,this.wrappedLines.length-1),Math.floor(this.offset/lineHeight));
    const viewportLines=Math.max(1,Math.ceil(this.bodyHeight/lineHeight)+2);
    const renderWidth=Math.max(1,Math.min(MAX_LABEL_TEXTURE_EDGE,this.contentWidth));
    const maxLinesPerTexture=Math.max(1,Math.floor(MAX_LABEL_TEXTURE_EDGE/lineHeight));
    const lineCount=Math.min(viewportLines,this.wrappedLines.length-first);
    const chunkCount=Math.max(1,Math.ceil(lineCount/maxLinesPerTexture));
    while(this.textLabels.length<chunkCount){
      const label=this.makeLabel(this.textNode,`Text_${this.textLabels.length}`,'',this.fontSize,this.text.color);
      label.horizontalAlign=Label.HorizontalAlign.LEFT;label.verticalAlign=Label.VerticalAlign.TOP;
      label.enableWrapText=false;label.overflow=Label.Overflow.CLAMP;this.textLabels.push(label);
    }
    this.visibleText=this.wrappedLines.slice(first,first+lineCount).join('\n');
    this.textNode.getComponent(UITransform)?.setContentSize(renderWidth,1);
    this.textNode.setPosition(0,this.bodyHeight/2+this.offset-first*lineHeight,0);
    for(let chunk=0;chunk<this.textLabels.length;chunk++){
      const label=this.textLabels[chunk];
      if(chunk>=chunkCount){label.node.active=false;continue;}
      const chunkStart=chunk*maxLinesPerTexture;
      const count=Math.min(maxLinesPerTexture,lineCount-chunkStart);
      const height=Math.max(lineHeight,count*lineHeight);
      label.node.active=true;label.string=this.wrappedLines.slice(first+chunkStart,first+chunkStart+count).join('\n');
      label.fontSize=this.fontSize;label.lineHeight=lineHeight;label.enableWrapText=false;label.overflow=Label.Overflow.CLAMP;
      label.node.getComponent(UITransform)?.setContentSize(renderWidth,height);
      label.node.setPosition(0,-chunkStart*lineHeight-height/2,0);
    }
  }
  private wrapSourceText(contentWidth:number): void {
    const charsPerLine=Math.max(1,Math.floor(contentWidth/Math.max(1,this.fontSize)));
    const lines:string[]=[];
    for(const paragraph of this.sourceText.replace(/\r\n?/g,'\n').split('\n')){
      const chars=Array.from(paragraph);
      if(chars.length===0){lines.push('');continue;}
      for(let start=0;start<chars.length;start+=charsPerLine)lines.push(chars.slice(start,start+charsPerLine).join(''));
    }
    this.wrappedLines=lines.length?lines:[''];
    this.fullHeight=Math.max(this.bodyHeight,this.wrappedLines.length*this.lineHeight+this.uiScale(8));
  }
  setText(title: string, content: string, action: Action = null): void {
    this.title.string=title; this.sourceText=content; this.action=action;
    this.actionButton.active=!!action;
    this.actionButton.name=`Button_${action?.label??'Action'}`;
    this.actionButton.getChildByName('Text')?.getComponent(Label) && (this.actionButton.getChildByName('Text')!.getComponent(Label)!.string=action?.label??'');
    this.offset=0; this.layout(view.getVisibleSize(),{left:-view.getVisibleSize().width/2,right:view.getVisibleSize().width/2,bottom:-view.getVisibleSize().height/2,top:view.getVisibleSize().height/2});
  }
  open(title: string, content: string, action: Action = null): void { this.setText(title,content,action); this.root.active=true; this.onVisibilityChange?.(true); }
  closePanel(): void { this.root.active=false; this.startY=this.lastY=null; this.scrollGesture=false; this.onVisibilityChange?.(false); }
  layout(visible: {width:number;height:number}, safe: SafeBounds): void {
    if(!this.root?.isValid)return;
    const gap=this.uiScale(8), header=this.uiScale(56), footerHit=this.uiScale(48);
    const maxWidth=Math.min(MAX_PANEL_EDGE,this.uiScale(560)), maxHeight=Math.min(MAX_PANEL_EDGE,this.uiScale(680));
    const width=Math.max(1,Math.min(safe.right-safe.left,maxWidth));
    const height=Math.max(1,Math.min(safe.top-safe.bottom-2*gap,maxHeight));
    const footerRows=this.action&&(width-2*gap)<(3*footerHit+2*gap)?2:1;
    const footerSpace=footerRows*footerHit+(footerRows+1)*gap;
    const cx=(safe.left+safe.right)/2, cy=(safe.bottom+safe.top)/2;
    this.root.getComponent(UITransform)?.setContentSize(visible.width,visible.height);
    const shade=this.root.getComponent(Graphics);if(shade){shade.clear();shade.fillColor=new Color(4,12,20,210);shade.rect(-visible.width/2,-visible.height/2,visible.width,visible.height);shade.fill();}
    this.panel.setPosition(cx,cy);this.panel.getComponent(UITransform)?.setContentSize(width,height);
    const bg=this.panel.getComponent(Graphics);if(bg){bg.clear();bg.fillColor=new Color(19,34,51);bg.roundRect(-width/2,-height/2,width,height,10);bg.fill();bg.strokeColor=new Color(108,193,224);bg.lineWidth=2;bg.roundRect(-width/2,-height/2,width,height,10);bg.stroke();}
    const titleWidth=Math.max(1,width-this.uiScale(128));
    this.title.fontSize=this.uiScale(16);this.title.lineHeight=this.uiScale(20);this.title.enableWrapText=true;
    this.title.horizontalAlign=Label.HorizontalAlign.LEFT;this.title.overflow=Label.Overflow.CLAMP;
    this.title.node.getComponent(UITransform)?.setContentSize(titleWidth,header);
    this.title.node.setPosition(-width/2+gap+titleWidth/2,height/2-header/2);
    this.close.getChildByName('Text')?.getComponent(Label) && (this.close.getChildByName('Text')!.getComponent(Label)!.fontSize=this.uiScale(16));
    this.paintButton(this.close,this.uiScale(96),header);this.close.setPosition(width/2-this.uiScale(56),height/2-header/2);
    const bodyTop=height/2-header;
    const bodyBottomWithGap=-height/2+footerSpace;
    this.bodyHeight=Math.max(1,bodyTop-bodyBottomWithGap);const viewportWidth=width-this.uiScale(24);this.viewport.getComponent(UITransform)?.setContentSize(viewportWidth,this.bodyHeight);this.viewport.setPosition(0,(bodyTop+bodyBottomWithGap)/2);const maskG=this.viewport.getComponent(Graphics);if(maskG){maskG.clear();maskG.rect(-viewportWidth/2,-this.bodyHeight/2,viewportWidth,this.bodyHeight);maskG.fill();}
    this.fontSize=this.uiScale(16);this.lineHeight=this.uiScale(24);this.text.fontSize=this.fontSize;this.text.lineHeight=this.lineHeight;
    this.contentWidth=Math.max(1,Math.min(MAX_LABEL_TEXTURE_EDGE,width-this.uiScale(48)));this.text.enableWrapText=false;
    this.wrapSourceText(this.contentWidth);this.offset=Math.max(0,Math.min(this.offset,this.maxOffset()));this.positionText();
    const primaryRow=[this.scrollTopButton,this.scrollBottomButton];
    const rows:Node[][]=footerRows===1&&this.action?[[...primaryRow,this.actionButton]]:footerRows===2&&this.action?[primaryRow,[this.actionButton]]:[primaryRow];
    rows.forEach((row,rowIndex)=>{
      const buttonWidth=Math.max(footerHit,(width-2*gap-(row.length-1)*gap)/row.length);
      const startX=-(row.length*buttonWidth+(row.length-1)*gap)/2+buttonWidth/2;
      const y=-height/2+gap+footerHit/2+rowIndex*(footerHit+gap);
      row.forEach((button,index)=>{
        button.active=true;this.paintButton(button,buttonWidth,footerHit);button.setPosition(startX+index*(buttonWidth+gap),y);
        const label=button.getChildByName('Text')?.getComponent(Label);if(label){label.fontSize=this.uiScale(16);label.lineHeight=this.uiScale(20);label.enableWrapText=false;label.overflow=Label.Overflow.CLAMP;}
      });
    });
  }
}
