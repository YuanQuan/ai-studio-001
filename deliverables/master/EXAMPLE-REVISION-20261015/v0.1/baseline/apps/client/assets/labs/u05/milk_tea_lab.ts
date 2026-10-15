import {
  _decorator, Component, Node, UITransform, Graphics, Label, Color, view, sys, resources, JsonAsset,
  input, Input, EventMouse, Vec3, Sprite, SpriteFrame, BitmapFont, Mask, UIOpacity,
} from 'cc';
import {
  LabConfig, Progress, Run, Stage, Ingredient, Dimension, DIMENSIONS, DIMENSION_NAMES, TIER_IDS, TIER_NAMES,
  DEFAULT_PROGRESS, STORAGE_KEY, VALIDATION_KEY, normalizeProgress, stagesFor, chooseStage, makeRun,
  remainingSeconds, expireRun, selectIngredient, undoIngredient, submitCup, settleWin, reconcileUnlocks, isUnlocked,
} from './milk_tea_state';
import { U05BitmapText } from './u05_bitmap_text';
import { U05NineSlicePlate } from './u05_nine_slice_plate';
import {
  CupSnapshot, FacePose, PresentationPhase, PresentationResult, PresentationSample, PresentationTransaction,
  createPresentationTransaction, freezeCupSnapshot, interruptPresentationForTimeout, samplePresentation,
  shouldLockInput,
} from './u05_interaction_presentation';

const { ccclass } = _decorator;
const PANEL = new Color(103, 53, 31, 235); // COLOR_SYSTEM wood.deep #67351F
const TEXT = new Color(250, 242, 218);
const MUTED = new Color(179, 188, 184);
const WARM_EDGE = new Color(164, 117, 82);
const GOLD = new Color(255, 194, 93);
const DEEP_BROWN = new Color(94, 55, 33);
const ROOF_TEXT = new Color(255, 234, 198);
const ASSET_ROOT = 'u05_milk_tea/u05_b/';
const ASSET_SIZES: Record<string, [number, number]> = {
  STATIC_BARE: [1024, 1536], STATIC_BARE_PATCH04: [1024, 1536],
  ORDER_BUBBLE_EMPTY: [375, 235], ORDER_CUP_BACK: [150, 170], ORDER_CUP_FRONT: [151, 180], ORDER_STRAW: [31, 86],
  WORK_CUP_BACK: [180, 218], WORK_CUP_FRONT: [189, 238], BTN_RECIPE_BASE: [323, 105], BTN_RECIPE_ICON: [58, 58],
  BTN_UNDO_BASE: [222, 105], BTN_SERVE_BASE: [362, 105], BTN_SERVE_ICON: [50, 64],
  BTN_UNDO_ICON: [47, 52], COUNTER_FRONT: [556, 42],
  CUSTOMER_BODY: [332, 301],
  FACE_NEUTRAL: [332, 301], FACE_BLINK: [332, 301], FACE_HAPPY: [332, 301], FACE_DISAPPOINTED: [332, 301],
  FACE_SQUASH: [332, 301], FACE_EXPAND_MID: [332, 301], BTN_CONFIRM_TEXT: [236, 80],
  SELECT_TEA: [163, 183], SELECT_MILK: [142, 183], SELECT_TOP: [168, 121],
  U05_B_T01: [154, 141], U05_B_T02: [154, 141], U05_B_T03: [154, 141],
  U05_B_M01: [111, 134], U05_B_M02: [130, 131], U05_B_M03: [132, 139],
  U05_B_P01: [139, 72], U05_B_P02: [139, 69], U05_B_P03: [139, 64],
  U05_B_P04: [139, 67], U05_B_P05: [139, 62], U05_B_P06: [139, 66],
  CUP_TEA_T01: [183, 233], CUP_TEA_T02: [183, 233], CUP_TEA_T03: [183, 233],
  CUP_MILK_M01: [183, 233], CUP_MILK_M02: [183, 233], CUP_MILK_M03: [183, 233],
  CUP_TOP_P01: [183, 233], CUP_TOP_P02: [183, 233], CUP_TOP_P03: [183, 233],
  CUP_TOP_P04: [183, 233], CUP_TOP_P05: [183, 233], CUP_TOP_P06: [183, 233],
};
const LABEL_POSITIONS: Record<Dimension, Array<[number, number, number, number]>> = {
  TEA: [[129.5, 586, 131, 44], [129.5, 787.5, 131, 45], [129.5, 992.5, 131, 45]],
  MILK: [[909, 586.5, 130, 45], [909, 787.5, 130, 45], [909, 992.5, 130, 45]],
  TOPPING: [[342.5, 943.5, 123, 45], [516.5, 943.5, 123, 45], [690.5, 943.5, 123, 45],
    [342.5, 1062, 123, 44], [516.5, 1062, 123, 44], [690.5, 1062, 123, 44]],
};
const SLOT_CENTERS: Record<Dimension, [number, number]> = { TEA: [390, 1192], MILK: [512, 1192], TOPPING: [634, 1192] };
const MOVE_WINDOWS: Record<Dimension, [number, number]> = { TEA: [80, 420], MILK: [220, 540], TOPPING: [360, 650] };

function ingredientAsset(item: Ingredient): string {
  const index = item.sort_order < 10 ? `0${item.sort_order}` : String(item.sort_order);
  if (item.dimension === 'TEA') return `U05_B_T${index}`;
  if (item.dimension === 'MILK') return `U05_B_M${index}`;
  return `U05_B_P${index}`;
}
function cupContentAsset(item: Ingredient): string {
  const index = item.sort_order < 10 ? `0${item.sort_order}` : String(item.sort_order);
  if (item.dimension === 'TEA') return `CUP_TEA_T${index}`;
  if (item.dimension === 'MILK') return `CUP_MILK_M${index}`;
  return `CUP_TOP_P${index}`;
}
function idFor(recipe: Run['orders'][number], dimension: Dimension): string {
  return dimension === 'TEA' ? recipe.tea_id : dimension === 'MILK' ? recipe.milk_id : recipe.topping_id;
}
function clampRange(value: number): number { return Math.max(0, Math.min(1, value)); }

@ccclass('U05MilkTeaLab')
export class U05MilkTeaLab extends Component {
  public onExit: (() => void) | null = null;
  public setExitHandler(handler: (() => void) | null): void { this.onExit = handler; }
  private root: Node | null = null;
  private config: LabConfig | null = null;
  private configLoaded = false;
  private bitmapFont: BitmapFont | null = null;
  private fontLoadAttempted = false;
  private frameCache = new Map<string, SpriteFrame>();
  private loadingFrames = new Set<string>();
  private destroyed = false;
  private frameWaiters = new Map<string, Array<(frame: SpriteFrame) => void>>();
  private activeFramePaths = new Set<string>();
  private pendingFramePaths = new Set<string>();
  private progress: Progress = { ...DEFAULT_PROGRESS };
  private validation = { enabled: false, stage: 1 as 1 | 2, unlockGrowth: false, level: 1, soul: 0, spirit: 0 };
  private run: Run | null = null;
  private tierIndex = 0;
  private dirty = true;
  private warnedStorage = false;
  private status = '';
  private statusColor = TEXT;
  private actions = new Map<Node, () => void>();
  private modalActions = new Set<Node>();
  private down: Node | null = null;
  private lastTouchAt = 0;
  private lastClockSecond = -1;
  private timerLabel: Label | null = null;
  private recipeOpen = false;
  private exitConfirm = false;
  private toggleValidation = false;
  private sessionProgress: Progress | null = null;
  private lastXp = 0;
  private presentation: PresentationTransaction | null = null;
  private presentationEpoch = 0;
  private presentationSample: PresentationSample = {
    phase: 'complete', face: 'neutral', faceProgress: 1, phaseStartedAtMs: 0, phaseDurationMs: 0,
    progress: 1, complete: true, customerX: 309, bubbleVisible: false,
  };
  private presentationVisual: {
    customer: Node | null;
    bubble: Node | null;
    movingIngredients: Partial<Record<Dimension, Node>>;
    cupContents: Partial<Record<Dimension, Node>>;
    facePose: FacePose;
    faceProgress: number;
    phase: PresentationPhase | null;
    faces: Partial<Record<FacePose, Node>>;
  } | null = null;
  private interactionMovingIngredients: Partial<Record<Dimension, Node>> = {};
  private interactionCupContents: Partial<Record<Dimension, Node>> = {};

  protected onLoad(): void {
    this.destroyed = false;
    this.readProgress();
    this.readValidation();
    this.root = new Node('U05MilkTeaLab');
    this.node.addChild(this.root);
    view.on('canvas-resize', this.resize, this);
    input.on(Input.EventType.MOUSE_DOWN, this.mouseDown, this);
    input.on(Input.EventType.MOUSE_UP, this.mouseUp, this);
    input.on(Input.EventType.TOUCH_START, this.touchStart, this);
    input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
    this.loadConfig();
    this.render();
  }
  private resize = (): void => { this.dirty = true; };
  private loadConfig(): void {
    if (this.status.startsWith('损坏')) this.status = '';
    resources.load('u05_milk_tea/config', JsonAsset, (error, asset) => {
      if (!this.isValid) { if (asset) resources.release('u05_milk_tea/config', JsonAsset); return; }
      if (error || !asset?.json) { this.status = '配置加载失败，请检查资源后重试'; this.statusColor = GOLD; this.dirty = true; return; }
      const config = asset.json as LabConfig;
      if (config.schema_version !== '2.0' || config.config_version !== 'v0.1' || config.recipes?.length !== 174 ||
          config.ingredients?.length !== 12 || config.difficulty_stages?.length !== 10 ||
          config.dimensions?.join(',') !== 'TEA,MILK,TOPPING') {
        resources.release('u05_milk_tea/config', JsonAsset);
        this.status = '配置版本或三类数据不一致，已停止加载'; this.statusColor = GOLD; this.dirty = true; return;
      }
      this.config = config; this.configLoaded = true;
      this.loadApprovedFont();
      this.reconcileProgress(); this.dirty = true;
    });
  }
  private loadApprovedFont(): void {
    if (this.fontLoadAttempted) return;
    this.fontLoadAttempted = true;
    resources.load('u05_milk_tea/u05_b/U05_ART_FONT', BitmapFont, (error, font) => {
      if (!this.isValid) { if (font) resources.release('u05_milk_tea/u05_b/U05_ART_FONT', BitmapFont); return; }
      if (error || !font) { this.status = '字体资源加载失败，保留系统字体'; this.statusColor = GOLD; this.dirty = true; return; }
      this.bitmapFont = font; this.dirty = true;
    });
  }
  protected update(): void {
    const nowMs = this.now();
    if (this.run?.status === 'playing') {
      const previous = this.run;
      const next = expireRun(previous, nowMs);
      if (next !== previous) {
        this.run = next; this.recipeOpen = false; this.exitConfirm = false; this.status = '时间到，本局失败'; this.statusColor = GOLD;
        if (this.presentation && this.presentation.result !== 'won' && this.presentation.result !== 'exited') {
          const interruptedCustomerX = samplePresentation(this.presentation, nowMs, this.presentationSample).customerX;
          this.presentationEpoch += 1;
          this.presentation = interruptPresentationForTimeout(this.presentation, this.presentationEpoch, nowMs, interruptedCustomerX);
        } else if (!this.presentation) {
          const order = previous.orders[Math.min(previous.orderIndex, previous.orders.length - 1)];
          const snapshot = freezeCupSnapshot(previous.orderIndex, order?.recipe_id ?? '', previous.selected);
          this.startPresentation('expired', snapshot, nowMs);
        }
        this.dirty = true;
      }
      const second = remainingSeconds(this.run, nowMs);
      if (second !== this.lastClockSecond) { this.lastClockSecond = second ?? -1; if (this.timerLabel) this.timerLabel.string = this.clockText(second); }
    }
    if (this.presentation) {
      if (this.presentation.epoch !== this.presentationEpoch || this.destroyed) this.cancelPresentation();
      else {
        const sample = samplePresentation(this.presentation, nowMs, this.presentationSample);
        this.applyPresentationSample(sample, nowMs);
        if (sample.complete) this.finishPresentation();
      }
    }
    if (this.dirty) this.render();
  }
  protected onDestroy(): void {
    this.destroyed = true;
    this.presentationEpoch += 1; this.presentation = null; this.presentationVisual = null;
    view.off('canvas-resize', this.resize, this);
    input.off(Input.EventType.MOUSE_DOWN, this.mouseDown, this);
    input.off(Input.EventType.MOUSE_UP, this.mouseUp, this);
    input.off(Input.EventType.TOUCH_START, this.touchStart, this);
    input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
    this.actions.clear(); this.modalActions.clear(); this.down = null;
    if (this.configLoaded) resources.release('u05_milk_tea/config', JsonAsset);
    if (this.bitmapFont) resources.release('u05_milk_tea/u05_b/U05_ART_FONT', BitmapFont);
    this.activeFramePaths.forEach(path => { if (!this.pendingFramePaths.has(path)) resources.release(path, SpriteFrame); });
    this.activeFramePaths.clear(); this.pendingFramePaths.clear(); this.frameCache.clear(); this.loadingFrames.clear(); this.frameWaiters.clear();
    this.configLoaded = false; this.bitmapFont = null; this.root = null; this.run = null;
  }
  private now(): number { return typeof performance !== 'undefined' ? performance.now() : Date.now(); }
  private readProgress(): void {
    try { const value = sys.localStorage?.getItem(STORAGE_KEY); this.progress = value ? normalizeProgress(JSON.parse(value)) : { ...DEFAULT_PROGRESS }; }
    catch { this.progress = { ...DEFAULT_PROGRESS }; this.status = '损坏：隔离示例存档已恢复默认进度'; this.statusColor = GOLD; }
  }
  private readValidation(): void {
    try {
      const raw = sys.localStorage?.getItem(VALIDATION_KEY);
      if (raw) { const value = JSON.parse(raw); this.validation = { enabled: !!value.enabled, stage: value.stage === 2 ? 2 : 1,
        unlockGrowth: !!value.unlockGrowth, level: Number(value.level) || 1, soul: Number(value.soul) || 0, spirit: Number(value.spirit) || 0 }; }
    } catch { this.validation = { enabled: false, stage: 1, unlockGrowth: false, level: 1, soul: 0, spirit: 0 }; }
  }
  private writeProgress(): void {
    try { sys.localStorage?.setItem(STORAGE_KEY, JSON.stringify(this.progress)); }
    catch { this.warnedStorage = true; }
  }
  private writeValidation(): void {
    try { sys.localStorage?.setItem(VALIDATION_KEY, JSON.stringify(this.validation)); } catch { /* 当前验证设置只影响会话 */ }
  }
  private sourcePos(x: number, y: number): { x: number; y: number } {
    const scale = 720 / 1024;
    return { x: (x - 512) * scale, y: (768 - y) * scale };
  }
  private showAsset(parent: Node, id: string, source: { x: number; y: number }, size?: [number, number], scale = 720 / 1024): Node {
    const node = new Node(`Art_${id}`); parent.addChild(node);
    node.setPosition(source.x, source.y);
    const [width, height] = size ?? ASSET_SIZES[id] ?? [120, 100];
    const transform = node.addComponent(UITransform); transform.setContentSize(width * scale, height * scale);
    const sprite = node.addComponent(Sprite); sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    if (id.startsWith('CUP_') || id.startsWith('FACE_') || id === 'CUSTOMER_BODY') sprite.trim = false;
    this.loadFrame(id, frame => { if (node.isValid) sprite.spriteFrame = frame; });
    return node;
  }
  private slicePlate(parent: Node, name: string, x: number, y: number, width: number, height: number): Node {
    const node = new Node(name); parent.addChild(node); node.setPosition(x, y);
    const transform = node.addComponent(UITransform); transform.setContentSize(width, height);
    node.setScale(720 / 1024, 720 / 1024, 1);
    const plate = node.addComponent(U05NineSlicePlate);
    this.loadFrame('LABEL_PLATE_9SLICE', frame => { if (node.isValid) plate.bind(frame, width, height); });
    return node;
  }
  private loadFrame(id: string, done: (frame: SpriteFrame) => void): void {
    const path = `${ASSET_ROOT}${id}/spriteFrame`;
    if (this.destroyed || !this.isValid) return;
    const cached = this.frameCache.get(id);
    if (cached) { done(cached); return; }
    if (this.loadingFrames.has(id)) {
      const waiters = this.frameWaiters.get(id) ?? [];
      waiters.push(done); this.frameWaiters.set(id, waiters); return;
    }
    this.loadingFrames.add(id); this.activeFramePaths.add(path); this.pendingFramePaths.add(path);
    resources.load(path, SpriteFrame, (error, frame) => {
      this.loadingFrames.delete(id); this.pendingFramePaths.delete(path);
      if (this.destroyed || !this.isValid) { if (frame) resources.release(path, SpriteFrame); return; }
      const waiters = this.frameWaiters.get(id) ?? []; this.frameWaiters.delete(id);
      if (error || !frame) { this.activeFramePaths.delete(path); this.status = '图片资源加载失败'; this.statusColor = GOLD; this.dirty = true; return; }
      this.frameCache.set(id, frame); done(frame); waiters.forEach(waiter => waiter(frame));
    });
  }
  private draw(parent: Node, name: string, x: number, y: number, w: number, h: number, color = PANEL): Node {
    const node = new Node(name); parent.addChild(node); node.setPosition(x, y);
    node.addComponent(UITransform).setContentSize(w, h);
    const g = node.addComponent(Graphics); g.fillColor = color; g.roundRect(-w/2, -h/2, w, h, 12); g.fill();
    g.strokeColor = WARM_EDGE; g.lineWidth = 2; g.roundRect(-w/2, -h/2, w, h, 12); g.stroke();
    return node;
  }
  private text(parent: Node, value: string, x: number, y: number, size: number, color = TEXT, w = 650, h = 44): Label {
    const node = new Node('Text'); parent.addChild(node); node.setPosition(x, y);
    node.addComponent(UITransform).setContentSize(w, h);
    const label = node.addComponent(Label); label.string = value; label.fontSize = size; label.lineHeight = size + 5;
    label.color = color; label.overflow = Label.Overflow.CLAMP; label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    if (this.bitmapFont) {
      const fontResult = U05BitmapText.bindLabel(label, this.bitmapFont, value);
      if (fontResult.missing.length) console.warn(`[U05 BMFont] 未覆盖字形：${fontResult.missing.join('')}`);
    }
    return label;
  }
  private sourceText(value: string, sourceX: number, sourceY: number, sourceSize: number, color: Color,
    sourceWidth: number, sourceHeight: number): Label {
    const scale = 720 / 1024; const pos = this.sourcePos(sourceX, sourceY);
    return this.text(this.root!, value, pos.x, pos.y, sourceSize * scale, color, sourceWidth * scale, sourceHeight * scale);
  }
  private clockText(seconds: number | null): string {
    if (seconds === null) return '不限时';
    const minutes = Math.floor(seconds / 60); const remainder = seconds % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${remainder < 10 ? `0${remainder}` : remainder}`;
  }
  private minTouchSize(): number {
    const visible = view.getVisibleSize();
    const fit = Math.min((visible.width - 16) / 720, (visible.height - 16) / 1080, 1);
    const cssWidth = document.querySelector('canvas')?.getBoundingClientRect().width || window.innerWidth;
    const cssPerLocalUnit = cssWidth * fit / visible.width;
    return cssPerLocalUnit > 0 ? 48 / cssPerLocalUnit : 48;
  }
  private button(parent: Node, value: string, x: number, y: number, w: number, h: number, action: () => void, enabled = true): Node {
    const node = this.draw(parent, `Button_${value}`, x, y, w, h, enabled ? PANEL : new Color(75, 59, 52, 220));
    this.text(node, value, 0, 0, Math.min(24, h * 0.48), enabled ? TEXT : MUTED, w - 12, h - 8);
    if (enabled) { this.actions.set(node, action); if (this.modalActive()) this.modalActions.add(node); }
    return node;
  }
  private imageButton(parent: Node, asset: string, label: string, sourceCenter: [number, number], icon: string,
    iconCenter: [number, number], action: () => void, enabled = true): Node {
    const pos = this.sourcePos(sourceCenter[0], sourceCenter[1]);
    const size = ASSET_SIZES[asset];
    const node = this.showAsset(parent, asset, pos, size);
    const [w, h] = size;
    const transform = node.getComponent(UITransform)!; transform.setContentSize(w * 720 / 1024, h * 720 / 1024);
    const iconPos = this.sourcePos(iconCenter[0], iconCenter[1]);
    const iconNode = this.showAsset(node, icon, { x: iconPos.x - pos.x, y: iconPos.y - pos.y });
    iconNode.setScale(1, 1, 1);
    if (asset === 'BTN_SERVE_BASE') {
      const confirmText = this.showAsset(node, 'BTN_CONFIRM_TEXT', {
        x: (sourceCenter[0] - iconCenter[0]) * 720 / 1024 / 2, y: 0,
      }, ASSET_SIZES.BTN_CONFIRM_TEXT);
      if (!enabled) {
        const textSprite = confirmText.getComponent(Sprite); if (textSprite) textSprite.color = new Color(188, 188, 188);
      }
    } else {
      const labelColor = enabled ? DEEP_BROWN : new Color(136, 112, 90);
      const text = this.text(node, label, 26, 0, 26, labelColor, w * .9, h * .74);
      text.node.setPosition((sourceCenter[0] - iconCenter[0]) * 720 / 1024 / 2, 0);
    }
    if (enabled) {
      const hit = new Node(`ButtonHit_${label}`); parent.addChild(hit);
      hit.setPosition(pos.x, pos.y + Math.max(0, this.minTouchSize() - h * 720 / 1024) / 2);
      hit.addComponent(UITransform).setContentSize(w * 720 / 1024, Math.max(h * 720 / 1024, this.minTouchSize()));
      this.actions.set(hit, action); if (this.modalActive()) this.modalActions.add(hit);
    }
    else { const base = node.getComponent(Sprite); if (base) base.color = new Color(188, 188, 188); }
    return node;
  }
  private paintSelected(node: Node, dimension: Dimension): void {
    const asset = dimension === 'TEA' ? 'SELECT_TEA' : dimension === 'MILK' ? 'SELECT_MILK' : 'SELECT_TOP';
    const frameNode = new Node(`Selected_${dimension}`); node.addChild(frameNode);
    const [width, height] = ASSET_SIZES[asset];
    frameNode.addComponent(UITransform).setContentSize(width * 720 / 1024, height * 720 / 1024);
    const sprite = frameNode.addComponent(Sprite); sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    this.loadFrame(asset, frame => { if (frameNode.isValid) sprite.spriteFrame = frame; });
  }
  private mouseDown(event: EventMouse): void { if (event.getButton() !== EventMouse.BUTTON_LEFT || Date.now() - this.lastTouchAt < 500) return; this.down = this.hit(event.getUILocation()); }
  private mouseUp(event: EventMouse): void { if (event.getButton() !== EventMouse.BUTTON_LEFT || Date.now() - this.lastTouchAt < 500) return; const target = this.hit(event.getUILocation()); if (target && target === this.down) this.actions.get(target)?.(); this.down = null; }
  private touchStart(event: any): void { this.lastTouchAt = Date.now(); this.down = this.hit(event.getUILocation()); }
  private touchEnd(event: any): void { this.lastTouchAt = Date.now(); const target = this.hit(event.getUILocation()); if (target && target === this.down) this.actions.get(target)?.(); this.down = null; }
  private modalActive(): boolean {
    return this.toggleValidation || this.exitConfirm || (!this.presentation && !!this.run && ['won', 'failed', 'exited'].includes(this.run.status));
  }
  private hit(point: { x: number; y: number }): Node | null {
    if (this.presentation && (this.presentation.result === 'expired' || this.presentation.result === 'exited')) return null;
    const candidates = this.modalActive() ? this.modalActions : this.actions.keys();
    let nearestIngredient: Node | null = null; let nearestDistance = Number.POSITIVE_INFINITY;
    for (const node of candidates) {
      if (!node.isValid || !node.activeInHierarchy) continue;
      const transform = node.getComponent(UITransform); if (!transform) continue;
      const local = transform.convertToNodeSpaceAR(new Vec3(point.x, point.y, 0)); const size = transform.contentSize;
      if (Math.abs(local.x) <= size.width / 2 && Math.abs(local.y) <= size.height / 2) {
        if (node.name.startsWith('Hit_')) {
          const distance = local.x * local.x + local.y * local.y;
          if (distance < nearestDistance) { nearestIngredient = node; nearestDistance = distance; }
        } else return node;
      }
    }
    return nearestIngredient;
  }
  private render(): void {
    if (!this.root?.isValid) return;
    this.dirty = false; this.actions.clear(); this.modalActions.clear(); this.root.destroyAllChildren(); this.timerLabel = null;
    this.presentationVisual = null;
    const size = view.getVisibleSize();
    const fit = Math.min((size.width - 16) / 720, (size.height - 16) / 1080, 1);
    this.root.setScale(fit, fit, 1);
    this.showAsset(this.root, 'STATIC_BARE_PATCH04', { x: 0, y: 0 }, [1024, 1536], 720 / 1024);
    if (!this.config) {
      this.text(this.root, this.status || '正在载入奶茶配置…', 0, 0, 21, this.statusColor, 620, 90);
      if (this.status.startsWith('配置加载失败')) this.button(this.root, '重试加载', 0, -80, 170, 48, () => this.loadConfig());
      this.button(this.root, '返回菜单', 0, -142, 170, 48, () => this.leave());
      return;
    }
    if (this.warnedStorage) this.status = '浏览器不支持写入：进度只保留在当前页面';
    const tierId = TIER_IDS[this.tierIndex];
    const stages = stagesFor(this.config, tierId);
    const tier = { tier_id: tierId, display_name: TIER_NAMES[tierId], stages, recipe_dims: 3 };
    if (!this.run) this.renderSelection(tier);
    else this.renderGame(tier);
    if (this.presentation) {
      const sampleNow = this.now(); this.applyPresentationSample(samplePresentation(this.presentation, sampleNow, this.presentationSample), sampleNow);
    }
  }
  private renderSelection(tier: { tier_id: string; display_name: string; stages: Stage[] }): void {
    // Approved empty bubble covers the background's discarded ghost-bubble tail on the selection page.
    this.showAsset(this.root!, 'ORDER_BUBBLE_EMPTY', this.sourcePos(654.5, 405.5), [375, 235]);
    const normal = this.readSessionProgress();
    this.text(this.root!, `熟练度 ${normal.xp} 已通关 ${normal.cleared.length}/5 档`, 0, 474, 16, TEXT, 660, 32);
    this.text(this.root!, `选择难度　${tier.display_name}`, 0, 427, 22, GOLD, 620, 38);
    const width = 118, gap = 7, left = -((width + gap) * 4) / 2;
    TIER_IDS.forEach((id, index) => {
      const unlocked = this.validation.enabled || isUnlocked(this.config!, normal, id,
        { level: this.validation.level, soul: this.validation.soul, spirit: this.validation.spirit, growthEnabled: this.validation.unlockGrowth }, false);
      this.button(this.root!, unlocked ? TIER_NAMES[id] : `锁 ${TIER_NAMES[id]}`, left + index * (width + gap), 374, width, 46,
        () => { this.tierIndex = index; this.status = ''; this.dirty = true; }, unlocked);
    });
    const progress = this.readSessionProgress();
    const stage = chooseStage(this.config!, tier.tier_id, progress.xp, this.validation.enabled ? this.validation.stage : null);
    this.sourceText(`阶段 ${stage.stage_no}/2  每局 3 杯  ${stage.time_sec === null ? '不限时' : `${stage.time_sec} 秒`}`,
      654.5, 376, 27, DEEP_BROWN, 340, 42);
    this.sourceText(`茶 ${stage.tea_options}/3  奶 ${stage.milk_options}/3  小料 ${stage.topping_options}/6`,
      654.5, 435, 27, DEEP_BROWN, 340, 42);
    this.renderCustomerWindow(309, 'neutral');
    this.showAsset(this.root!, 'COUNTER_FRONT', this.sourcePos(512, 798), [556, 42]);
    this.renderIngredientGallery(stage);
    this.showCupComposition(this.root!, this.sourcePos(509.5, 1209), 1, null, false);
    this.button(this.root!, '开始制作', 0, -410, 260, 54, () => this.beginRun(tier), !!tier.stages.length);
    this.button(this.root!, '返回菜单', 0, -466, 220, 38, () => this.leave());
    this.button(this.root!, this.toggleValidation ? '关闭验证设置' : '示例验证设置', 0, -514, 210, 34,
      () => { this.toggleValidation = !this.toggleValidation; this.dirty = true; });
    if (this.toggleValidation) this.renderValidation();
    if (this.status) this.text(this.root!, this.status, 0, 248, 14, this.statusColor, 660, 24);
  }
  private renderIngredientGallery(stage: Stage, drawToppingCategory = true, allowInput = true): void {
    if (!this.config) return;
    this.renderCategoryLabels(drawToppingCategory);
    const positions: Record<Dimension, Array<[number, number]>> = {
      TEA: [[127, 496], [132, 700], [132, 904]],
      MILK: [[913, 502], [915, 702], [916, 906]],
      TOPPING: [[342, 892], [516, 894], [690, 896], [342, 1008], [516, 1012], [690, 1010]],
    };
    const counts: Record<Dimension, number> = { TEA: stage.tea_options, MILK: stage.milk_options, TOPPING: stage.topping_options };
    DIMENSIONS.forEach(dimension => {
      this.config!.ingredients.filter(item => item.dimension === dimension).sort((a, b) => a.sort_order - b.sort_order).forEach(item => {
        const source = positions[dimension][item.sort_order - 1]; if (!source) return;
        const pos = this.sourcePos(source[0], source[1]);
        const asset = ingredientAsset(item); const [assetW, assetH] = ASSET_SIZES[asset] ?? [128, 128];
        const available = item.sort_order <= counts[dimension];
        const node = this.showAsset(this.root!, asset, pos, [assetW, assetH]);
        const selected = this.run?.selected[dimension] === item.ingredient_id;
        if (selected) this.paintSelected(node, dimension);
        if (!available) node.setScale(.55, .55, 1);
        const [labelX, labelY, labelW, labelH] = LABEL_POSITIONS[dimension][item.sort_order - 1];
        const labelPos = this.sourcePos(labelX, labelY); const displayW = labelW * 720 / 1024; const displayH = labelH * 720 / 1024;
        this.slicePlate(this.root!, `LabelPlate_${item.ingredient_id}`, labelPos.x, labelPos.y, labelW, labelH);
        this.text(this.root!, available ? item.name : '未开放', labelPos.x, labelPos.y, 30 * 720 / 1024,
          available ? DEEP_BROWN : new Color(136, 112, 90), displayW - 8, displayH - 4);
        const left = Math.min(source[0] - assetW / 2, labelX - labelW / 2);
        const right = Math.max(source[0] + assetW / 2, labelX + labelW / 2);
        const top = Math.min(source[1] - assetH / 2, labelY - labelH / 2);
        const bottom = Math.max(source[1] + assetH / 2, labelY + labelH / 2);
        const hitPos = this.sourcePos((left + right) / 2, (top + bottom) / 2);
        const hit = new Node(`Hit_${item.ingredient_id}`); this.root!.addChild(hit); hit.setPosition(hitPos.x, hitPos.y);
        const hitScale = 720 / 1024;
        hit.addComponent(UITransform).setContentSize(Math.max((right - left) * hitScale, this.minTouchSize()),
          Math.max((bottom - top) * hitScale, this.minTouchSize()));
        if (available && this.run && allowInput) this.actions.set(hit, () => this.choose(dimension, item.ingredient_id));
      });
    });
  }
  private renderGame(tier: { tier_id: string; display_name: string; stages: Stage[] }): void {
    const run = this.run!; const nowMs = this.now(); const locked = shouldLockInput(this.presentation);
    const sample = this.presentation ? samplePresentation(this.presentation, nowMs) : null;
    const visualOrderIndex = this.presentation?.snapshot.orderIndex ?? Math.min(run.orderIndex, run.orders.length - 1);
    const order = run.orders[visualOrderIndex] ?? run.orders[run.orders.length - 1];
    this.renderSourceHeader(run, remainingSeconds(run, nowMs), visualOrderIndex);
    this.renderIngredientGallery(run.stage, false, !locked);
    const customerX = sample?.customerX ?? (run.status === 'won' || run.status === 'failed' ? -72 : 309);
    const customerRig = this.renderCustomerWindow(customerX, sample?.face ?? 'neutral');
    this.interactionMovingIngredients = {}; this.interactionCupContents = {};
    this.showAsset(this.root!, 'COUNTER_FRONT', this.sourcePos(512, 798), [556, 42]);
    this.renderToppingCategoryLabel();
    const bubble = this.renderTargetCup(order, sample?.bubbleVisible ?? (run.status === 'playing'));
    if (!locked) this.renderPreparationSlots();
    if (this.presentation && this.presentation.result !== 'expired' && this.presentation.result !== 'exited') {
      this.renderInteractionWorkCup(this.presentation.snapshot);
    }
    this.presentationVisual = {
      customer: customerRig.customer, faces: customerRig.faces, bubble, movingIngredients: this.interactionMovingIngredients,
      cupContents: this.interactionCupContents, facePose: sample?.face ?? 'neutral',
      faceProgress: sample?.faceProgress ?? 1, phase: sample?.phase ?? null,
    };
    this.imageButton(this.root!, 'BTN_UNDO_BASE', '撤销一项', [518, 1490], 'BTN_UNDO_ICON', [464.5, 1480],
      () => this.undo(), !locked && DIMENSIONS.some(dim => !!run.selected[dim]));
    this.imageButton(this.root!, 'BTN_RECIPE_BASE', this.recipeOpen ? '收起配方' : '查看配方', [191, 1490], 'BTN_RECIPE_ICON', [112, 1483],
      () => { this.recipeOpen = !this.recipeOpen; this.dirty = true; });
    const complete = DIMENSIONS.every(dim => !!run.selected[dim]);
    this.imageButton(this.root!, 'BTN_SERVE_BASE', '确认', [813, 1490], 'BTN_SERVE_ICON', [718, 1482],
      () => this.submit(), !locked && complete && run.status === 'playing');
    this.renderRecipePanel(order);
    this.renderHelpAndExit(order);
    if (this.exitConfirm) this.renderExitConfirm();
    if (!locked && (run.status === 'won' || run.status === 'failed' || run.status === 'exited')) this.renderResult();
    if (this.status) this.sourceText(this.status, 512, 1380, 28, DEEP_BROWN, 720, 46);
  }
  private renderSourceHeader(run: Run, seconds: number | null, shownOrderIndex = run.orderIndex): void {
    this.sourceText(`当前订单 ${Math.min(shownOrderIndex + 1, run.orders.length)}/${run.orders.length}`,
      233, 96, 34, ROOF_TEXT, 214, 50);
    this.timerLabel = this.sourceText(this.clockText(seconds), 881, 96, 34,
      seconds !== null && seconds < 20 ? GOLD : ROOF_TEXT, 124, 50);
  }
  private renderCustomerWindow(left: number, initialFace: FacePose = 'neutral'): { customer: Node; faces: Partial<Record<FacePose, Node>> } {
    const sourceScale = 720 / 1024;
    const centerX = 505; const centerY = 530.5;
    const window = new Node('CustomerWindow'); this.root!.addChild(window);
    window.setPosition(this.sourcePos(centerX, centerY).x, this.sourcePos(centerX, centerY).y);
    window.addComponent(UITransform).setContentSize(490 * sourceScale, 505 * sourceScale);
    const mask = window.addComponent(Mask); mask.type = Mask.Type.GRAPHICS_RECT;
    const customer = new Node('CustomerRig'); window.addChild(customer);
    customer.setPosition(((left + 166) - centerX) * sourceScale, (centerY - 634.5) * sourceScale);
    this.showAsset(customer, 'CUSTOMER_BODY', { x: 0, y: 0 }, [332, 301]);
    const faces: Partial<Record<FacePose, Node>> = {};
    const faceAssets: Record<FacePose, string> = {
      neutral: 'FACE_NEUTRAL', squash: 'FACE_SQUASH', blink: 'FACE_BLINK', expand_mid: 'FACE_EXPAND_MID',
      happy: 'FACE_HAPPY', disappointed: 'FACE_DISAPPOINTED',
    };
    (Object.keys(faceAssets) as FacePose[]).forEach(pose => {
      const face = this.showAsset(customer, faceAssets[pose], { x: 0, y: 0 }, [332, 301]);
      face.active = pose === initialFace; faces[pose] = face;
    });
    return { customer, faces };
  }
  private renderTargetCup(recipe: Run['orders'][number], bubbleVisible: boolean): Node {
    const group = new Node('OrderPresentation'); this.root!.addChild(group); group.active = bubbleVisible;
    this.showAsset(group, 'ORDER_BUBBLE_EMPTY', this.sourcePos(654.5, 405.5), [375, 235]);
    const centerX = 653; const centerY = 416; const unit = 720 / 1024;
    const cup = new Node('OrderCupGroup'); group.addChild(cup); cup.setPosition(this.sourcePos(centerX, centerY).x, this.sourcePos(centerX, centerY).y);
    cup.setScale(.78, .78, 1);
    const relative = (id: string, x: number, y: number, size: [number, number]): Node => {
      const node = this.showAsset(cup, id, { x: (x - centerX) * unit, y: (centerY - y) * unit }, size);
      return node;
    };
    relative('ORDER_CUP_BACK', 653, 421, [150, 170]);
    DIMENSIONS.forEach(dimension => {
      const item = this.config!.ingredients.find(row => row.ingredient_id === idFor(recipe, dimension));
      if (item) relative(cupContentAsset(item), centerX, centerY, [183, 233]);
    });
    relative('ORDER_CUP_FRONT', 652.5, 416, [151, 180]);
    relative('ORDER_STRAW', 698.5, 344, [31, 86]);
    return group;
  }
  private renderPreparationSlots(): void {
    if (!this.run || !this.config) return;
    DIMENSIONS.forEach(dimension => {
      const id = this.run!.selected[dimension]; if (!id) return;
      const item = this.config!.ingredients.find(row => row.ingredient_id === id); if (!item) return;
      const asset = ingredientAsset(item); const [w, h] = ASSET_SIZES[asset];
      const contain = Math.min(90 / w, 84 / h, 1);
      const slot = this.showAsset(this.root!, asset, this.sourcePos(...SLOT_CENTERS[dimension]), [w * contain, h * contain]);
      slot.name = `Slot_${dimension}_${id}`;
    });
  }
  private relativeAsset(parent: Node, id: string, x: number, y: number, size: [number, number]): Node {
    const [w, h] = size; const node = new Node(`Interaction_${id}`); parent.addChild(node);
    node.setPosition(x * 720 / 1024, -y * 720 / 1024);
    node.addComponent(UITransform).setContentSize(w * 720 / 1024, h * 720 / 1024);
    const sprite = node.addComponent(Sprite); sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    if (id.startsWith('CUP_')) sprite.trim = false;
    this.loadFrame(id, frame => { if (node.isValid) sprite.spriteFrame = frame; });
    node.addComponent(UIOpacity).opacity = 0;
    return node;
  }
  private renderInteractionWorkCup(snapshot: CupSnapshot): void {
    const centerX = 509.5; const centerY = 1209.5;
    const cup = new Node('InteractionWorkCup'); this.root!.addChild(cup);
    cup.setPosition(this.sourcePos(centerX, centerY).x, this.sourcePos(centerX, centerY).y);
    const relative = (id: string, x: number, y: number, size: [number, number]): Node =>
      this.relativeAsset(cup, id, x - centerX, y - centerY, size);
    const back = relative('WORK_CUP_BACK', 510, 1217, [180, 218]); this.setOpacity(back, 255);
    DIMENSIONS.forEach(dimension => {
      const id = snapshot.ingredients[dimension]; if (!id) return;
      const item = this.config!.ingredients.find(row => row.ingredient_id === id); if (!item) return;
      const asset = ingredientAsset(item); const [w, h] = ASSET_SIZES[asset];
      const contain = Math.min(90 / w, 84 / h, 1);
      this.interactionMovingIngredients[dimension] = relative(asset, SLOT_CENTERS[dimension][0], SLOT_CENTERS[dimension][1], [w * contain, h * contain]);
      this.interactionCupContents[dimension] = relative(cupContentAsset(item), centerX, centerY, [183, 233]);
    });
    const front = relative('WORK_CUP_FRONT', 509.5, 1209, [189, 238]); this.setOpacity(front, 255);
  }
  private applyPresentationSample(sample: PresentationSample, nowMs: number): void {
    const visual = this.presentationVisual;
    if (!visual || !this.presentation) return;
    if (visual.facePose !== sample.face) {
      (Object.keys(visual.faces) as FacePose[]).forEach(pose => {
        const face = visual.faces[pose]; if (face?.isValid) face.active = pose === sample.face;
      });
      visual.facePose = sample.face;
    }
    visual.faceProgress = sample.faceProgress; visual.phase = sample.phase;
    if (visual.bubble?.isValid) visual.bubble.active = sample.bubbleVisible;
    const customer = visual.customer;
    if (customer?.isValid && customer.parent?.isValid) {
      const sourceScale = 720 / 1024; const windowCenterX = 505; const windowCenterY = 530.5;
      customer.setPosition(((sample.customerX + 166) - windowCenterX) * sourceScale,
        (windowCenterY - 634.5) * sourceScale);
    }
    const elapsed = Math.max(0, nowMs - this.presentation.submittedAtMs);
    if (sample.phase === 'synthesis') {
      for (const dimension of DIMENSIONS) {
        const moving = visual.movingIngredients[dimension]; const content = visual.cupContents[dimension];
        const [start, end] = MOVE_WINDOWS[dimension]; const p = clampRange((elapsed - start) / (end - start));
        if (moving?.isValid) {
          moving.active = elapsed < end;
          const slot = SLOT_CENTERS[dimension];
          const x0 = (slot[0] - 509.5) * 720 / 1024; const y0 = (1209.5 - slot[1]) * 720 / 1024;
          moving.setPosition(x0 * (1 - p), y0 * (1 - p));
          this.setOpacity(moving, Math.round(255 * (1 - p)));
        }
        if (content?.isValid) {
          content.active = elapsed >= start;
          this.setOpacity(content, Math.round(255 * p));
        }
      }
      return;
    }
    const keepCup = this.presentation.result === 'correct' || this.presentation.result === 'won' || this.presentation.result === 'wrong';
    for (const dimension of DIMENSIONS) {
      const moving = visual.movingIngredients[dimension]; const content = visual.cupContents[dimension];
      if (moving?.isValid) moving.active = false;
      if (content?.isValid) { content.active = keepCup; this.setOpacity(content, 255); }
    }
  }
  private setOpacity(node: Node, opacity: number): void {
    const component = node.getComponent(UIOpacity) ?? node.addComponent(UIOpacity);
    component.opacity = Math.max(0, Math.min(255, opacity));
  }
  private snapshotRun(run: Run): CupSnapshot {
    const order = run.orders[Math.min(run.orderIndex, run.orders.length - 1)];
    return freezeCupSnapshot(run.orderIndex, order?.recipe_id ?? '', run.selected);
  }
  private startPresentation(result: PresentationResult, snapshot: CupSnapshot, nowMs: number, customerStartX = 309): void {
    this.presentationEpoch += 1;
    this.presentation = createPresentationTransaction(this.presentationEpoch, result, nowMs, snapshot, customerStartX);
    this.actions.clear(); this.modalActions.clear(); this.down = null;
  }
  private cancelPresentation(): void {
    this.presentationEpoch += 1; this.presentation = null; this.presentationVisual = null;
    this.interactionMovingIngredients = {}; this.interactionCupContents = {};
  }
  private finishPresentation(): void {
    const transaction = this.presentation; if (!transaction) return;
    this.cancelPresentation();
    if (transaction.result === 'correct' || transaction.result === 'wrong') {
      this.status = ''; this.statusColor = TEXT;
    }
    if (transaction.result === 'exited') {
      this.run = null; this.exitConfirm = false; this.recipeOpen = false; this.status = ''; this.dirty = true; return;
    }
    this.dirty = true;
  }
  private renderCategoryLabels(drawTopping: boolean): void {
    this.sourceText('茶', 137, 366, 36, DEEP_BROWN, 56, 54);
    this.sourceText('奶', 935, 367, 36, DEEP_BROWN, 54, 54);
    if (drawTopping) this.renderToppingCategoryLabel();
  }
  private renderToppingCategoryLabel(): void {
    this.sourceText('小料', 536, 823, 34, DEEP_BROWN, 82, 48);
  }
  private showCupComposition(parent: Node, center: { x: number; y: number }, scale: number, recipe: Run['orders'][number] | null,
    target: boolean, selected?: Partial<Record<Dimension, string>>): void {
    const contentSize: [number, number] = [183, 233];
    const layers: Array<[string, [number, number], [number, number]]> = target
      ? [['ORDER_BUBBLE_EMPTY', [654.5, 405.5], [375, 235]], ['ORDER_CUP_BACK', [653, 421], [150, 170]]]
      : [['WORK_CUP_BACK', [510, 1217], [180, 218]]];
    layers.forEach(([asset, pos, size]) => this.showAsset(parent, asset, this.sourcePos(pos[0], pos[1]), size, 720 / 1024 * scale));
    DIMENSIONS.forEach(dimension => {
      const ingredientId = target && recipe ? idFor(recipe, dimension) : selected?.[dimension];
      if (!ingredientId) return;
      const item = this.config?.ingredients.find(row => row.ingredient_id === ingredientId);
      if (!item) return;
      this.showAsset(parent, cupContentAsset(item), center, contentSize, 720 / 1024 * scale);
    });
    if (target) {
      this.showAsset(parent, 'ORDER_CUP_FRONT', this.sourcePos(652.5, 416), [151, 180], 720 / 1024 * scale);
      this.showAsset(parent, 'ORDER_STRAW', this.sourcePos(698.5, 344), [31, 86], 720 / 1024 * scale);
    } else {
      this.showAsset(parent, 'WORK_CUP_FRONT', this.sourcePos(509.5, 1209), [189, 238], 720 / 1024 * scale);
    }
  }
  private renderRecipePanel(recipe: Run['orders'][number]): void {
    if (!this.recipeOpen) return;
    const margin = this.topMarginLocal();
    const ids = { TEA: recipe.tea_id, MILK: recipe.milk_id, TOPPING: recipe.topping_id };
    const lines = DIMENSIONS.map(dimension => {
      const item = this.config!.ingredients.find(row => row.ingredient_id === ids[dimension]);
      return `${DIMENSION_NAMES[dimension]} ${item?.name ?? '—'}`;
    });
    if (margin >= 96) {
      const visible = view.getVisibleSize(); const fit = Math.min((visible.width - 16) / 720, (visible.height - 16) / 1080, 1);
      const width = (visible.width - 136) / fit;
      const cssPerLocalUnit = this.cssPerLocalUnit(visible, fit);
      const availableTopCss = this.topMarginLocal() * cssPerLocalUnit;
      const panelHeight = Math.min(52, availableTopCss - 4) / cssPerLocalUnit;
      const centerX = -56 / fit;
      const centerY = (visible.height / 2 / fit) - (4 / cssPerLocalUnit) - panelHeight / 2;
      this.draw(this.root!, 'RecipeHelpHostPanel', centerX, centerY, width, panelHeight, new Color(25, 39, 49, 238));
      const leftX = centerX - width / 2; const colWidth = (width - 24) / 3;
      const headerSize = 12 / cssPerLocalUnit; const bodySize = 14 / cssPerLocalUnit;
      this.text(this.root!, '当前配方', leftX + width / 2, centerY + panelHeight * .27, headerSize, GOLD, width - 20, headerSize * 1.4);
      DIMENSIONS.forEach((dimension, index) => this.text(this.root!, lines[index], leftX + 12 + colWidth * (index + .5),
        centerY - panelHeight * .17, bodySize, TEXT, colWidth, bodySize * 1.4));
    } else {
      const panel = this.sourcePos(347, 390);
      this.draw(this.root!, 'RecipeHelpFallbackPanel', panel.x, panel.y, 214 * 720 / 1024, 166 * 720 / 1024,
        new Color(25, 39, 49, 242));
      [383, 419, 455].forEach((sourceY, index) => {
        const position = this.sourcePos(347, sourceY);
        this.text(this.root!, lines[index], position.x, position.y, 34 * 720 / 1024, TEXT,
          198 * 720 / 1024, 34 * 720 / 1024);
      });
    }
  }
  private cssPerLocalUnit(visible: { width: number; height: number }, fit: number): number {
    const canvasWidth = document.querySelector('canvas')?.getBoundingClientRect().width || window.innerWidth;
    return canvasWidth * fit / visible.width;
  }
  private topMarginLocal(): number {
    const visible = view.getVisibleSize(); const fit = Math.min((visible.width - 16) / 720, (visible.height - 16) / 1080, 1);
    return (visible.height - 1080 * fit) / 2 / fit;
  }
  private renderHelpAndExit(_recipe: Run['orders'][number]): void {
    const visible = view.getVisibleSize(); const fit = Math.min((visible.width - 16) / 720, (visible.height - 16) / 1080, 1);
    if (this.topMarginLocal() >= 96) {
      const exitX = (visible.width / 2 - 62) / fit; const exitY = (visible.height / 2 - 50) / fit;
      this.button(this.root!, '退出', exitX, exitY, 100 / fit, 52 / fit,
        () => { this.exitConfirm = true; this.dirty = true; });
      return;
    }
    const shown = this.sourcePos(418, 337);
    const displayScale = 720 / 1024 * fit;
    const hitW = Math.max(68, 48 / displayScale); const hitH = Math.max(56, 48 / displayScale);
    const hitCenter = this.sourcePos(452 - hitW / 2, 365 - hitH / 2);
    const hit = this.draw(this.root!, 'ExitHelpHitArea', hitCenter.x, hitCenter.y, hitW * 720 / 1024, hitH * 720 / 1024,
      new Color(0, 0, 0, 0));
    const label = this.text(hit, '退出', shown.x - hitCenter.x, shown.y - hitCenter.y,
      34 * 720 / 1024, TEXT, 68 * 720 / 1024, 56 * 720 / 1024);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    this.actions.set(hit, () => { this.exitConfirm = true; this.dirty = true; });
  }
  private renderExitConfirm(): void {
    this.modalActions.clear(); this.draw(this.root!, 'ExitPanel', 0, 70, 420, 180, new Color(25, 39, 49, 248));
    this.text(this.root!, '离开后本局不计熟练度', 0, 117, 18, TEXT, 380, 32);
    this.button(this.root!, '继续制作', -95, 38, 150, 44, () => { this.exitConfirm = false; this.dirty = true; });
    this.button(this.root!, '退出本局', 95, 38, 150, 44, () => { this.exitConfirm = false; this.confirmExit(); });
  }
  private renderValidation(): void {
    this.modalActions.clear(); this.draw(this.root!, 'ValidationPanel', 0, 0, 560, 390, new Color(13, 26, 40, 250));
    this.text(this.root!, '示例验证设置', 0, 148, 21, GOLD, 510, 36);
    this.text(this.root!, '仅影响当前示例会话，不会写入正常进度', 0, 112, 14, MUTED, 520, 30);
    this.button(this.root!, this.validation.enabled ? '验证模式：开' : '验证模式：关', -125, 53, 190, 42, () => {
      this.validation.enabled = !this.validation.enabled; this.writeValidation(); this.sessionProgress = null; this.dirty = true;
    });
    this.button(this.root!, `阶段 ${this.validation.stage}`, 125, 53, 160, 42, () => {
      this.validation.stage = this.validation.stage === 1 ? 2 : 1; this.writeValidation(); this.dirty = true;
    });
    this.button(this.root!, '重置隔离存档', 0, 0, 190, 42, () => {
      this.progress = { ...DEFAULT_PROGRESS }; this.sessionProgress = null; this.writeProgress(); this.status = '示例进度已重置'; this.dirty = true;
    });
    this.button(this.root!, `等级 ${this.validation.level}`, -170, -54, 120, 38, () => {
      this.validation.level = this.validation.level >= 3 ? 1 : this.validation.level + 1; this.writeValidation(); this.reconcileProgress(); this.dirty = true;
    });
    this.button(this.root!, `魂 ${this.validation.soul}`, 0, -54, 100, 38, () => {
      this.validation.soul = (this.validation.soul + 1) % 4; this.writeValidation(); this.reconcileProgress(); this.dirty = true;
    });
    this.button(this.root!, `魄 ${this.validation.spirit}`, 170, -54, 100, 38, () => {
      this.validation.spirit = (this.validation.spirit + 1) % 8; this.writeValidation(); this.reconcileProgress(); this.dirty = true;
    });
    this.button(this.root!, '完成设置', 0, -126, 160, 42, () => { this.toggleValidation = false; this.dirty = true; });
  }
  private renderResult(): void {
    this.modalActions.clear(); const won = this.run?.status === 'won';
    this.draw(this.root!, 'ResultPanel', 0, 30, 440, 260, new Color(13, 26, 40, 250));
    const title = won ? '三杯完成!' : this.run?.status === 'failed' ? '时间到，本局失败' : '本局结束';
    this.text(this.root!, title, 0, 117, 25, GOLD, 400, 40);
    if (won) {
      this.text(this.root!, `本地示例熟练度 +${this.lastXp}`, 0, 72, 16, TEXT, 390, 30);
      this.button(this.root!, '再玩一局', 0, 0, 170, 46, () => this.retry());
      this.button(this.root!, '返回菜单', 0, -61, 170, 42, () => this.leave());
    } else {
      this.button(this.root!, '重试本档', -98, -17, 156, 44, () => this.retry());
      this.button(this.root!, '返回菜单', 98, -17, 156, 44, () => this.leave());
    }
  }
  private readSessionProgress(): Progress {
    return this.validation.enabled ? (this.sessionProgress ?? reconcileUnlocks(this.config!, this.progress, this.growthInputs(), true)) : this.progress;
  }
  private growthInputs() { return { level: this.validation.level, soul: this.validation.soul, spirit: this.validation.spirit, growthEnabled: this.validation.unlockGrowth }; }
  private reconcileProgress(): void {
    if (!this.config) return;
    if (this.validation.enabled) { this.sessionProgress = reconcileUnlocks(this.config, this.readSessionProgress(), this.growthInputs(), true); return; }
    this.progress = reconcileUnlocks(this.config, this.progress, this.growthInputs(), false); this.writeProgress();
  }
  private beginRun(tier: { tier_id: string; stages: Stage[] }): void {
    if (this.run) return;
    this.cancelPresentation();
    const progress = this.readSessionProgress();
    if (!this.validation.enabled && !isUnlocked(this.config!, progress, tier.tier_id, this.growthInputs(), false)) {
      this.status = '此难度尚未解锁'; this.statusColor = GOLD; this.dirty = true; return;
    }
    const stage = chooseStage(this.config!, tier.tier_id, progress.xp, this.validation.enabled ? this.validation.stage : null);
    const startedAtMs = this.now();
    this.run = makeRun(this.config!, stage, startedAtMs); this.startPresentation('arrival', this.snapshotRun(this.run), startedAtMs);
    this.status = ''; this.statusColor = TEXT;
    this.recipeOpen = tier.tier_id === 'EASY'; this.exitConfirm = false; this.lastClockSecond = -1; this.dirty = true;
  }
  private choose(dimension: Dimension, id: string): void {
    if (!this.run || shouldLockInput(this.presentation)) return;
    this.run = selectIngredient(this.run, dimension, id, this.now());
    if (this.run.status === 'failed') { this.recipeOpen = false; this.exitConfirm = false; this.status = '时间到，本局失败'; this.statusColor = GOLD; }
    this.dirty = true;
  }
  private undo(): void {
    if (!this.run || shouldLockInput(this.presentation)) return;
    const dimension = [...this.run.selectionOrder].reverse().find(key => !!this.run?.selected[key]);
    if (dimension) this.run = undoIngredient(this.run, dimension, this.now());
    this.dirty = true;
  }
  private submit(): void {
    if (!this.run || shouldLockInput(this.presentation) || this.run.status !== 'playing') return;
    const nowMs = this.now();
    const snapshot = this.snapshotRun(this.run);
    const result = submitCup(this.run, nowMs); this.run = result.run;
    this.statusColor = result.result === 'wrong' || result.result === 'expired' ? GOLD : TEXT;
    this.status = result.result === 'incomplete' ? '请先选齐三类原料' : result.result === 'wrong' ? '配方不对，请重做当前这杯' :
      result.result === 'expired' ? '时间到，本局失败' : result.result === 'won' ? '正确!本局完成' : '正确，下一杯!';
    if (result.result === 'won') {
      const settled = settleWin(this.config!, this.readSessionProgress(), this.run, this.growthInputs(), this.validation.enabled);
      this.run = settled.run; this.lastXp = settled.xpAdded;
      const progress = reconcileUnlocks(this.config!, settled.progress, this.growthInputs(), false);
      if (this.validation.enabled) this.sessionProgress = progress; else { this.progress = progress; this.writeProgress(); }
      this.recipeOpen = false; this.exitConfirm = false;
    }
    if (result.result === 'correct' || result.result === 'wrong' || result.result === 'won' || result.result === 'expired') {
      const presentationResult: PresentationResult = result.result === 'correct' ? 'correct' : result.result === 'won' ? 'won' :
        result.result === 'wrong' ? 'wrong' : 'expired';
      this.startPresentation(presentationResult, snapshot, nowMs);
    }
    this.dirty = true;
  }
  private confirmExit(): void {
    if (!this.run || this.presentation?.result === 'exited' || this.run.status === 'exited') return;
    const snapshot = this.presentation?.snapshot ?? this.snapshotRun(this.run);
    const nowMs = this.now();
    const customerStartX = this.presentation ? samplePresentation(this.presentation, nowMs, this.presentationSample).customerX : 309;
    this.recipeOpen = false; this.exitConfirm = false; this.run = { ...this.run, status: 'exited' };
    this.status = '离开后本局不计熟练度'; this.statusColor = GOLD;
    this.startPresentation('exited', snapshot, nowMs, customerStartX); this.dirty = true;
  }
  private retry(): void {
    if (this.presentation || this.run?.status === 'playing') return;
    const tierId = TIER_IDS[this.tierIndex]; this.cancelPresentation(); this.run = null;
    this.beginRun({ tier_id: tierId, stages: stagesFor(this.config!, tierId) });
  }
  private leave(): void { this.cancelPresentation(); this.run = null; this.recipeOpen = false; this.exitConfirm = false; this.toggleValidation = false; this.status = ''; this.actions.clear(); this.modalActions.clear(); this.onExit?.(); }
}
