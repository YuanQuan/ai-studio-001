import {
  _decorator, Color, Component, EventMouse, Graphics, Input, input,
  Label, Node, Prefab, ResolutionPolicy, UITransform, Vec3, instantiate, sys, view,
} from 'cc';
import { Scene1CameraController } from './labs/menu/scene1_camera_controller';

const { ccclass, property } = _decorator;
const MENU_BG = new Color(10, 20, 34);
const PANEL = new Color(19, 34, 51);
const TEXT = new Color(230, 239, 247);
const MUTED = new Color(155, 178, 199);
const BLUE = new Color(108, 193, 224);
const GOLD = new Color(246, 189, 109);

@ccclass('UnitSampleGallery')
export class UnitSampleGallery extends Component {
  @property({ type: Prefab, tooltip: 'STREET_BASE_01 共用四层背景 Prefab。' })
  public streetBasePrefab: Prefab | null = null;

  private root!: Node;
  private page!: Node;
  private menuEntry: Node | null = null;
  private menuMouseDown = false;
  private menuContent: Node | null = null;
  private sceneViewport: Node | null = null;
  private sceneControls: Node | null = null;
  private sceneBack: Node | null = null;

  protected onLoad(): void {
    // Keep the full phone viewport, including the extra height of tall phones.
    view.setDesignResolutionSize(720, 1280, ResolutionPolicy.FIXED_WIDTH);
    this.root = this.makeNode('UnitSamplesRoot', this.node, 720, 1280);
    this.drawRect(this.root, 0, 0, 720, 1280, MENU_BG);
    this.openMenu();
    input.on(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.on(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    view.on('canvas-resize', this.layoutScene, this);
    view.on('design-resolution-changed', this.layoutScene, this);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.off(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    view.off('canvas-resize', this.layoutScene, this);
    view.off('design-resolution-changed', this.layoutScene, this);
  }

  private makeNode(name: string, parent: Node, width = 1, height = 1, x = 0, y = 0): Node {
    const node = new Node(name);
    parent.addChild(node);
    node.setPosition(x, y);
    node.addComponent(UITransform).setContentSize(width, height);
    return node;
  }

  private drawRect(parent: Node, x: number, y: number, width: number, height: number,
    color: Color): void {
    const node = this.makeNode('Panel', parent, width, height, x, y);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = color;
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.fill();
    graphics.strokeColor = BLUE;
    graphics.lineWidth = 2;
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.stroke();
  }

  private label(parent: Node, value: string, x: number, y: number, size: number,
    color: Color, width = 660, height = 58): void {
    const node = this.makeNode('Text', parent, width, height, x, y);
    const label = node.addComponent(Label);
    label.string = value;
    label.fontSize = size;
    label.lineHeight = size + 8;
    label.color = color;
    label.overflow = Label.Overflow.SHRINK;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
  }

  private button(parent: Node, value: string, x: number, y: number,
    width: number, height: number, onTouch?: () => void): Node {
    const node = this.makeNode(`Button_${value}`, parent, width, height, x, y);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = PANEL;
    graphics.roundRect(-width / 2, -height / 2, width, height, 12);
    graphics.fill();
    graphics.strokeColor = BLUE;
    graphics.lineWidth = 2;
    graphics.roundRect(-width / 2, -height / 2, width, height, 12);
    graphics.stroke();
    this.label(node, value, 0, 0, Math.min(25, height * 0.38), TEXT, width - 14, height - 10);
    if (onTouch) {
      node.on(Node.EventType.TOUCH_END, (event) => {
        event.propagationStopped = true;
        onTouch();
      });
    }
    return node;
  }

  private clearPage(): void {
    if (this.page && this.page.isValid) this.page.destroy();
    this.page = this.makeNode('Page', this.root, 720, 1280);
    this.menuEntry = null;
    this.menuMouseDown = false;
    this.menuContent = null;
    this.sceneViewport = null;
    this.sceneControls = null;
    this.sceneBack = null;
  }

  private openMenu(): void {
    this.clearPage();
    this.menuContent = this.makeNode('MenuContent', this.page);
    this.label(this.menuContent, 'U01 四层场景镜头', 0, 400, 42, GOLD);
    this.label(this.menuContent, '查看四层场景视差，并拖动、缩放或重置镜头。',
      0, 320, 23, TEXT, 650, 76);
    this.menuEntry = this.button(this.menuContent, '进入 U01', 0, 170, 330, 92,
      () => this.openUnit());
    this.layoutScene();
  }

  private openUnit(): void {
    this.clearPage();
    const visible = view.getVisibleSize();
    const viewport = this.makeNode('Scene1Viewport', this.page, visible.width, visible.height);
    this.sceneViewport = viewport;
    if (!this.streetBasePrefab) {
      this.label(this.page, '四层背景暂不可用，请检查已批准资源导入。',
        0, 0, 20, MUTED, 640, 80);
      return;
    }

    const background = instantiate(this.streetBasePrefab);
    background.name = 'STREET_BASE_01';
    viewport.addChild(background);
    const layerNames = ['L01_Sky', 'L02_Mountains', 'L03_Ground', 'L04_Foreground'];
    const layers = layerNames.map(name => background.getChildByName(name))
      .filter((layer): layer is Node => !!layer);
    if (layers.length !== 4) {
      background.destroy();
      this.label(this.page, '四层背景结构异常，请检查 STREET_BASE_01。',
        0, 0, 20, MUTED, 640, 80);
      return;
    }

    const controls = this.makeNode('Scene1Controls', this.page, 470, 72);
    this.sceneControls = controls;
    this.button(controls, '−', -170, 0, 96, 64);
    this.button(controls, '重置', 0, 0, 150, 64);
    this.button(controls, '+', 170, 0, 96, 64);
    this.sceneBack = this.button(this.page, '返回菜单', 0, 0, 180, 64);
    this.layoutScene();

    const controllerNode = this.makeNode('Scene1CameraController', this.page);
    // Cocos may call onEnable as soon as the component is added. Keep the node
    // inactive until every serialized-style reference has been assigned, so
    // the controller binds its controls with the complete set of nodes.
    controllerNode.active = false;
    const controller = controllerNode.addComponent(Scene1CameraController);
    controller.layers = layers;
    controller.viewport = viewport;
    // Only buttons capture input; the transparent spaces between them remain draggable.
    controller.uiCaptureRoot = null;
    controller.zoomOutButton = controls.getChildByName('Button_−');
    controller.resetButton = controls.getChildByName('Button_重置');
    controller.zoomInButton = controls.getChildByName('Button_+');
    controller.backButton = this.sceneBack;
    controllerNode.active = true;
    controller.reset();

  }

  private layoutScene(): void {
    const visible = view.getVisibleSize();
    this.root.getComponent(UITransform)!.setContentSize(visible);
    this.page.getComponent(UITransform)!.setContentSize(visible);
    // Retain a reachable menu when the Web preview is opened in a short desktop window.
    this.menuContent?.setPosition(0, visible.height < 900 ? -290 : 0);
    if (!this.sceneViewport?.isValid) return;
    const origin = view.getVisibleOrigin();
    const safe = sys.getSafeAreaRect(false);
    this.sceneViewport.getComponent(UITransform)!.setContentSize(visible);
    this.sceneControls?.setPosition(0, -visible.height / 2 + safe.y - origin.y + 68);
    this.sceneBack?.setPosition(-visible.width / 2 + safe.x - origin.x + 114,
      -visible.height / 2 + safe.y + safe.height - origin.y - 68);
  }

  private isInside(node: Node, point: { x: number; y: number }): boolean {
    const transform = node.getComponent(UITransform);
    if (!transform || !node.activeInHierarchy) return false;
    const local = transform.convertToNodeSpaceAR(new Vec3(point.x, point.y, 0));
    const size = transform.contentSize;
    return Math.abs(local.x) <= size.width / 2 && Math.abs(local.y) <= size.height / 2;
  }

  private onMenuMouseDown(event: EventMouse): void {
    this.menuMouseDown = !!this.menuEntry && this.isInside(this.menuEntry, event.getUILocation());
  }

  private onMenuMouseUp(event: EventMouse): void {
    const clicked = this.menuMouseDown && !!this.menuEntry
      && this.isInside(this.menuEntry, event.getUILocation());
    this.menuMouseDown = false;
    if (clicked) this.openUnit();
  }
}
