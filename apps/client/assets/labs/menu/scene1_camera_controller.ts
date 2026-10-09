import {
  _decorator, Component, EventMouse, EventTouch, Input, input, Node,
  UITransform, Vec2, Vec3, director, view,
} from 'cc';

const { ccclass, property } = _decorator;
const SOURCE_WIDTH = 3072;
const SOURCE_HEIGHT = 1024;
const RATIOS = [0.3, 0.8, 1.0, 1.0, 1.0];
const EDGE_GUARD = 2;

/** Full foreground canvas stays outside every viewport edge, including a sampling guard. */
export function calculateScene1Bounds(width: number, height: number, zoom: number) {
  const coverScale = Math.max((width + EDGE_GUARD * 2) / SOURCE_WIDTH,
    (height + EDGE_GUARD * 2) / SOURCE_HEIGHT);
  const scale = coverScale * zoom;
  const maxCameraX = Math.max(0, (SOURCE_WIDTH - (width + EDGE_GUARD * 2) / scale) / 2);
  return { coverScale, scale, maxCameraX };
}

/** 示例1 Lab 专用镜头与输入控制。该组件只驱动五层背景节点，不属于共享背景 Prefab。 */
@ccclass('Scene1CameraController')
export class Scene1CameraController extends Component {
  @property({ type: [Node], tooltip: '从后到前：天空、山峦、地面、前景。' })
  public layers: Node[] = [];

  @property({ type: [Node], tooltip: '可选的1.0前景同步节点；不计入五层背景。' })
  public synchronizedNodes: Node[] = [];

  @property({ type: Node, tooltip: '背景可交互视口；Lab 控件应放在独立覆盖层。' })
  public viewport: Node | null = null;

  @property({ type: Node, tooltip: '覆盖在视口上的 Lab 控件命中根节点；其内触点由 UI 捕获。' })
  public uiCaptureRoot: Node | null = null;

  @property({ type: [Node], tooltip: '可选的受控命中列表；只捕获列出的实际控件。' })
  public uiCaptureNodes: Node[] = [];

  @property({ type: Node }) public zoomInButton: Node | null = null;
  @property({ type: Node }) public zoomOutButton: Node | null = null;
  @property({ type: Node }) public resetButton: Node | null = null;
  @property({ type: Node }) public backButton: Node | null = null;
  @property({ tooltip: '镜头复位中心；0为画布中心，运行时按视口边界约束。' })
  public resetCameraX = 0;

  private cameraX = 0;
  private zoom = 1;
  private minZoom = 1;
  private maxZoom = 1.8;
  private coverScale = 1;
  private gesture: 'none' | 'drag' | 'pinch' = 'none';
  private inputMode: 'none' | 'mouse' | 'touch' = 'none';
  private activeTouches = new Map<number, Vec2>();
  private dragStartX = 0;
  private dragCameraX = 0;
  private pinchStartDistance = 0;
  private pinchStartZoom = 1;
  private destroyed = false;
  private mouseButtonTarget: Node | null = null;
  private touchButtonHandlers = new Map<Node, (event: EventTouch) => void>();
  private buttonActions = new Map<Node, () => void>();

  protected onEnable(): void {
    this.destroyed = false;
    this.cameraX = this.resetCameraX;
    this.zoom = 1;
    this.bindTouchControls();
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    if (this.viewport) {
      this.viewport.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      this.viewport.on(Node.EventType.SIZE_CHANGED, this.onViewportChanged, this);
    }
    view.on('canvas-resize', this.onViewportChanged, this);
    view.on('design-resolution-changed', this.onViewportChanged, this);
    this.recalculate();
  }

  protected onDisable(): void {
    this.destroyed = true;
    this.clearGesture();
    input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    if (this.viewport) {
      this.viewport.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
      this.viewport.off(Node.EventType.SIZE_CHANGED, this.onViewportChanged, this);
    }
    view.off('canvas-resize', this.onViewportChanged, this);
    view.off('design-resolution-changed', this.onViewportChanged, this);
    this.unbindTouchControls();
  }

  private bindTouchControls(): void {
    this.bindButton(this.zoomInButton, () => this.setZoom(this.zoom * 1.15));
    this.bindButton(this.zoomOutButton, () => this.setZoom(this.zoom / 1.15));
    this.bindButton(this.resetButton, () => this.reset());
    this.bindButton(this.backButton, () => director.loadScene('UnitSamples'));
  }

  private unbindTouchControls(): void {
    for (const [button, handler] of this.touchButtonHandlers) button.off(Node.EventType.TOUCH_END, handler, this);
    this.touchButtonHandlers.clear();
    this.buttonActions.clear();
  }

  private bindButton(button: Node | null, action: () => void): void {
    if (!button) return;
    const handler = (event: EventTouch) => {
      event.propagationStopped = true;
      this.clearGesture();
      action();
    };
    button.on(Node.EventType.TOUCH_END, handler, this);
    this.touchButtonHandlers.set(button, handler);
    this.buttonActions.set(button, action);
  }

  public reset(): void {
    this.clearGesture();
    this.cameraX = this.resetCameraX;
    this.zoom = 1;
    this.recalculate();
  }

  public zoomBy(multiplier: number): void {
    if (!Number.isFinite(multiplier) || multiplier <= 0) return;
    this.setZoom(this.zoom * multiplier);
  }

  /** Center the source-space camera on a foreground item without changing its transform. */
  public focusOnSourceX(sourceX: number): void {
    if (!Number.isFinite(sourceX)) return;
    this.clearGesture();
    this.cameraX = sourceX;
    this.recalculate();
  }

  private onViewportChanged(): void {
    this.clearGesture();
    this.recalculate();
  }

  private onTouchStart(event: EventTouch): void {
    const screenPoint = event.getUILocation();
    const localPoint = this.toViewportPoint(screenPoint);
    if (this.isUiCaptured(screenPoint) || !localPoint) {
      this.clearGesture();
      return;
    }

    if (this.inputMode !== 'touch') this.clearGesture();
    if (this.activeTouches.has(event.getID()) || this.activeTouches.size >= 2) {
      this.clearGesture();
      return;
    }
    this.inputMode = 'touch';
    this.activeTouches.set(event.getID(), localPoint);
    if (this.activeTouches.size === 1) {
      this.gesture = 'drag';
      this.dragStartX = localPoint.x;
      this.dragCameraX = this.cameraX;
    } else if (this.activeTouches.size === 2) {
      const [a, b] = Array.from(this.activeTouches.values());
      this.gesture = 'pinch';
      this.pinchStartDistance = Vec2.distance(a, b);
      this.pinchStartZoom = this.zoom;
    }
  }

  private onTouchMove(event: EventTouch): void {
    const localPoint = this.toViewportPoint(event.getUILocation());
    if (!this.activeTouches.has(event.getID())) return;
    if (!localPoint) {
      this.clearGesture();
      return;
    }
    this.activeTouches.set(event.getID(), localPoint);
    if (this.gesture === 'drag' && this.activeTouches.size === 1) {
      this.cameraX = this.dragCameraX - (localPoint.x - this.dragStartX) / (this.coverScale * this.zoom);
      this.recalculate();
    } else if (this.gesture === 'pinch' && this.activeTouches.size === 2) {
      const [a, b] = Array.from(this.activeTouches.values());
      const distance = Vec2.distance(a, b);
      if (this.pinchStartDistance > 0) this.setZoom(this.pinchStartZoom * distance / this.pinchStartDistance);
    }
  }

  private onTouchEnd(): void {
    // 结束任一触点后清掉基准，避免从双指切回单指时相机跳变。
    this.clearGesture();
  }

  private onTouchCancel(): void { this.clearGesture(); }

  private onMouseDown(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT || !this.viewport) return;
    const point = event.getUILocation();
    const control = this.findControl(point);
    if (this.isUiCaptured(point)) {
      this.clearGesture();
      this.mouseButtonTarget = control;
      return;
    }
    this.mouseButtonTarget = null;
    const localPoint = this.toViewportPoint(point);
    if (!localPoint) { this.clearGesture(); return; }
    this.clearGesture();
    this.gesture = 'drag';
    this.inputMode = 'mouse';
    this.dragStartX = localPoint.x;
    this.dragCameraX = this.cameraX;
  }

  private onMouseMove(event: EventMouse): void {
    if (this.gesture !== 'drag' || this.inputMode !== 'mouse') return;
    const localPoint = this.toViewportPoint(event.getUILocation());
    if (!localPoint) { this.clearGesture(); return; }
    this.cameraX = this.dragCameraX - (localPoint.x - this.dragStartX) / (this.coverScale * this.zoom);
    this.recalculate();
  }

  private onMouseUp(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
    const target = this.mouseButtonTarget;
    this.mouseButtonTarget = null;
    if (target && target.isValid && this.isInsideNode(target, event.getUILocation())) {
      const action = this.buttonActions.get(target);
      if (action) action();
    }
    this.clearGesture();
  }

  private onMouseLeave(): void { this.clearGesture(); this.mouseButtonTarget = null; }

  private onMouseWheel(event: EventMouse): void {
    const point = event.getUILocation();
    if (!this.viewport || this.isUiCaptured(point) || !this.toViewportPoint(point)) return;
    this.setZoom(this.zoom * (event.getScrollY() < 0 ? 1.1 : 1 / 1.1));
  }

  private toViewportPoint(point: Vec2): Vec2 | null {
    if (!this.viewport || !this.isInsideNode(this.viewport, point)) return null;
    const transform = this.viewport.getComponent(UITransform);
    if (!transform) return null;
    const local = transform.convertToNodeSpaceAR(new Vec3(point.x, point.y, 0));
    return new Vec2(local.x, local.y);
  }

  private isUiCaptured(point: Vec2): boolean {
    return !!(this.uiCaptureRoot && this.uiCaptureRoot.activeInHierarchy
      && this.isInsideNode(this.uiCaptureRoot, point)) || !!this.findControl(point);
  }

  private findControl(point: Vec2): Node | null {
    for (const control of this.uiCaptureNodes) {
      if (control && control.activeInHierarchy && this.isInsideNode(control, point)) return control;
    }
    for (const control of [this.zoomInButton, this.zoomOutButton, this.resetButton, this.backButton]) {
      if (control && control.activeInHierarchy && this.isInsideNode(control, point)) return control;
    }
    return null;
  }

  private isInsideNode(node: Node, point: Vec2): boolean {
    const transform = node.getComponent(UITransform);
    if (!transform) return false;
    const local = transform.convertToNodeSpaceAR(new Vec3(point.x, point.y, 0));
    const size = transform.contentSize;
    return Math.abs(local.x) <= size.width / 2 && Math.abs(local.y) <= size.height / 2;
  }

  private setZoom(value: number): void {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, value));
    this.recalculate();
  }

  private clearGesture(): void {
    this.gesture = 'none';
    this.inputMode = 'none';
    this.activeTouches.clear();
    this.pinchStartDistance = 0;
    this.mouseButtonTarget = null;
  }

  private recalculate(): void {
    if (this.destroyed || !this.layers || this.layers.length !== 5) return;
    const viewportTransform = this.viewport?.getComponent(UITransform);
    if (!viewportTransform) return;
    const visible = viewportTransform.contentSize;
    if (visible.width <= 0 || visible.height <= 0) return;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    const { coverScale, scale, maxCameraX } = calculateScene1Bounds(visible.width, visible.height, this.zoom);
    this.coverScale = coverScale;
    this.cameraX = Math.max(-maxCameraX, Math.min(maxCameraX, this.cameraX));
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (!layer || !layer.isValid) continue;
      layer.setScale(scale, scale, 1);
      layer.setPosition(-this.cameraX * scale * RATIOS[i], 0, 0);
    }
    for (const node of this.synchronizedNodes) {
      if (!node || !node.isValid) continue;
      node.setScale(scale, scale, 1);
      node.setPosition(-this.cameraX * scale, 0, 0);
    }
  }
}
