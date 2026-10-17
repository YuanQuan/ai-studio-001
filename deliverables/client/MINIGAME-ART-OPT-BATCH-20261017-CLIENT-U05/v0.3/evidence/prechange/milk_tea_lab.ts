import {
  _decorator, Component, Node, UITransform, Graphics, Label, Color, view, sys, resources, JsonAsset,
  input, Input, EventMouse, Vec3, Sprite, SpriteFrame, BitmapFont, Mask, UIOpacity, Prefab, instantiate,
} from 'cc';
import {
  LabConfig, Progress, Run, Stage, Ingredient, Dimension, DIMENSIONS, DIMENSION_NAMES, TIER_IDS, TIER_NAMES,
  DEFAULT_PROGRESS, STORAGE_KEY, VALIDATION_KEY, normalizeProgress, stagesFor, chooseStage, makeRun,
  remainingSeconds, expireRun, selectIngredient, undoIngredient, submitCup, settleWin, reconcileUnlocks, isUnlocked,
} from './milk_tea_state';
import { U05BitmapText } from './u05_bitmap_text';
import { ViewportAdapter } from '../../framework/viewport';
import { ViewportMapper } from '../../framework/viewport';
import { U05NineSlicePlate } from './u05_nine_slice_plate';
import { clampScrollOffset, containInSafe, hasHitConflict, minimumFontLocalAxes, minimumHitLocalAxes, resolveHitCandidates, U05HitTarget, wrapTextByCodepoint } from './u05_accessibility';
import { TouristAction, TouristFacing } from '../u02/tourist_state';
import { ApprovedTouristAdapter, TouristAccessoryManifest, TouristFrameManifest, TouristMountManifest } from '../u02/tourist_adapter';
import { TouristView } from '../u02/tourist_view';
import {
  CupSnapshot, FacePose, PresentationPhase, PresentationResult, PresentationSample, PresentationTransaction,
  createPresentationTransaction, DEFAULT_PRESENTATION_DURATIONS, freezeCupSnapshot, interruptPresentationForTimeout, PresentationDurations, samplePresentation,
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
const CUSTOMER_SOURCE_CENTER_Y = 669.5;
const ORDER_BUBBLE_CENTER: [number, number] = [620.5, 425.5];
const ORDER_BUBBLE_SIZE: [number, number] = [300, 188];
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

type ApprovedCustomerAssets = {
  prefab: Prefab;
  frameManifest: TouristFrameManifest;
  mountManifest: TouristMountManifest;
  accessoryManifest: TouristAccessoryManifest;
  bodyFrames: SpriteFrame[];
  accessoryFrames: SpriteFrame[];
};

@ccclass('U05MilkTeaLab')
export class U05MilkTeaLab extends Component {
  public onExit: (() => void) | null = null;
  public setExitHandler(handler: (() => void) | null): void { this.onExit = handler; }
  public configureApprovedCustomer(assets: ApprovedCustomerAssets): void {
    this.customerAssets = assets;
    this.customerActionFrames.clear();
    for (const action of ['walk', 'happy', 'sad'] as TouristAction[]) {
      this.customerActionFrames.set(action, assets.frameManifest.frames
        .filter(item => item.action === action).map(item => ({ index: item.index, durationMs: item.durationMs }))
        .sort((a, b) => a.index - b.index));
    }
    this.presentationDurationCache = null;
  }
  private root: Node | null = null;
  private hudRoot: Node | null = null;
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
  private customerAssets: ApprovedCustomerAssets | null = null;
  private customerAction: TouristAction | null = null;
  private customerActionElapsedMs = 0;
  private customerFrameIndex = -1;
  private customerFacing: TouristFacing = 'right';
  private customerCommittedFacing: TouristFacing | null = null;
  private customerActionFrames = new Map<TouristAction, Array<{ index: number; durationMs: number }>>();
  private presentationDurationCache: PresentationDurations | null = null;
  private presentationSample: PresentationSample = {
    phase: 'complete', face: 'neutral', faceProgress: 1, phaseStartedAtMs: 0, phaseDurationMs: 0,
    progress: 1, complete: true, customerX: 309, bubbleVisible: false,
  };
  private presentationVisual: {
    customer: Node | null;
    touristView: TouristView;
    touristAdapter: ApprovedTouristAdapter;
    bubble: Node | null;
    movingIngredients: Partial<Record<Dimension, Node>>;
    cupContents: Partial<Record<Dimension, Node>>;
    facePose: FacePose;
    faceProgress: number;
    phase: PresentationPhase | null;
    action: TouristAction | null;
    faces: Partial<Record<FacePose, Node>>;
  } | null = null;
  private interactionMovingIngredients: Partial<Record<Dimension, Node>> = {};
  private interactionCupContents: Partial<Record<Dimension, Node>> = {};
  private viewportAdapter: ViewportAdapter | null = null;
  private viewportSnapshot = null as ReturnType<ViewportAdapter['read']> | null;
  private operationPanel = false;
  private operationScroll = 0;
  private scrollOffset = 0;
  private proxyToppings = false;
  private proxyTea = false;
  private proxyMilk = false;
  private proxyFooterActions = false;
  private proxySelection = false;
  private proxyTimer = false;
  private safeTimerLabel: Label | null = null;

  public configureViewportAdapter(adapter: ViewportAdapter | null): void {
    this.viewportAdapter = adapter;
    this.viewportSnapshot = adapter?.read() ?? null;
  }

  protected onLoad(): void {
    this.destroyed = false;
    this.readProgress();
    this.readValidation();
    this.root = new Node('U05MilkTeaLab');
    this.node.addChild(this.root);
    this.hudRoot = new Node('U05SafeHud');
    this.node.addChild(this.hudRoot);
    view.on('canvas-resize', this.resize, this);
    input.on(Input.EventType.MOUSE_DOWN, this.mouseDown, this);
    input.on(Input.EventType.MOUSE_UP, this.mouseUp, this);
    input.on(Input.EventType.TOUCH_START, this.touchStart, this);
    input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
    this.loadConfig();
    this.render();
  }
  private resize = (): void => {
    // A resize only rebuilds presentation nodes. Keep the same Run, presentation
    // transaction, selected ingredients and timer clock.
    this.down = null; this.actions.clear(); this.modalActions.clear();
    this.viewportSnapshot = this.viewportAdapter?.read() ?? null;
    this.dirty = true;
  };
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
  protected update(dt: number): void {
    const nowMs = this.now();
    if (this.run?.status === 'playing') {
      const previous = this.run;
      const next = expireRun(previous, nowMs);
      if (next !== previous) {
        this.run = next; this.recipeOpen = false; this.exitConfirm = false; this.status = '时间到，本局失败'; this.statusColor = GOLD;
        if (this.presentation && this.presentation.result !== 'won' && this.presentation.result !== 'exited') {
          const interruptedCustomerX = samplePresentation(this.presentation, nowMs, this.presentationSample, this.presentationDurations()).customerX;
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
      if (second !== this.lastClockSecond) { this.lastClockSecond = second ?? -1; if (this.timerLabel) this.timerLabel.string = this.clockText(second); if (this.safeTimerLabel && this.proxyTimer) this.safeTimerLabel.string = this.clockText(second); }
    }
    if (this.presentation) {
      if (this.presentation.epoch !== this.presentationEpoch || this.destroyed) this.cancelPresentation();
      else {
        const sample = samplePresentation(this.presentation, nowMs, this.presentationSample, this.presentationDurations());
        this.applyPresentationSample(sample, nowMs);
        if (sample.complete) this.finishPresentation();
      }
    }
    if (this.dirty) this.render();
  }
  protected onDestroy(): void {
    this.destroyed = true;
    this.presentationEpoch += 1; this.presentation = null; this.presentationVisual = null;
    this.customerAction = null; this.customerActionElapsedMs = 0; this.customerFrameIndex = -1; this.customerFacing = 'right'; this.customerCommittedFacing = null;
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
    const visible = view.getVisibleSize();
    const fit = this.layoutFit(visible);
    const contentWidth = this.viewportSnapshot?.content.width ?? visible.width;
    const contentHeight = this.viewportSnapshot?.content.height ?? visible.height;
    const cssPerLocalX = contentWidth / visible.width * fit;
    const cssPerLocalY = contentHeight / visible.height * fit;
    const minCssSize = size >= 16 ? 16 : 14;
    const effectiveSize = minimumFontLocalAxes(size, cssPerLocalX, cssPerLocalY, minCssSize);
    const label = node.addComponent(Label); label.string = value; label.fontSize = effectiveSize; label.lineHeight = effectiveSize + 5;
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
  private minTouchSize(): { width: number; height: number } {
    const visible = view.getVisibleSize();
    const fit = this.layoutFit(visible);
    const snapshot = this.viewportSnapshot ?? this.viewportAdapter?.read();
    const cssPerUiX = snapshot?.content.width ? snapshot.content.width / visible.width : 1;
    const cssPerUiY = snapshot?.content.height ? snapshot.content.height / visible.height : 1;
    return minimumHitLocalAxes(0, 0, cssPerUiX * fit, cssPerUiY * fit);
  }
  private button(parent: Node, value: string, x: number, y: number, w: number, h: number, action: () => void, enabled = true): Node {
    const node = this.draw(parent, `Button_${value}`, x, y, w, h, enabled ? PANEL : new Color(75, 59, 52, 220));
    this.text(node, value, 0, 0, Math.min(24, h * 0.48), enabled ? TEXT : MUTED, w - 12, h - 8);
    if (enabled) {
      const hit = new Node(`ButtonHit_${value}`); parent.addChild(hit); hit.setPosition(x, y);
      const min = this.minTouchSize();
      hit.addComponent(UITransform).setContentSize(Math.max(w, min.width), Math.max(h, min.height));
      this.actions.set(hit, action); if (this.modalActive()) this.modalActions.add(hit);
    }
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
      const min = this.minTouchSize();
      hit.setPosition(pos.x, pos.y + Math.max(0, min.height - h * 720 / 1024) / 2);
      hit.addComponent(UITransform).setContentSize(Math.max(w * 720 / 1024, min.width), Math.max(h * 720 / 1024, min.height));
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
    return this.operationPanel || this.recipeOpen || this.toggleValidation || this.exitConfirm ||
      (!this.presentation && !!this.run && ['won', 'failed', 'exited'].includes(this.run.status));
  }
  private hit(point: { x: number; y: number }): Node | null {
    if (this.presentation && (this.presentation.result === 'expired' || this.presentation.result === 'exited')) return null;
    const candidates = resolveHitCandidates(this.modalActive(), this.actions.keys(), this.modalActions);
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
    this.dirty = false; this.actions.clear(); this.modalActions.clear(); this.root.destroyAllChildren(); this.hudRoot?.destroyAllChildren(); this.timerLabel = null; this.safeTimerLabel = null;
    this.presentationVisual = null;
    const size = view.getVisibleSize();
    this.viewportSnapshot = this.viewportAdapter?.read() ?? this.viewportSnapshot;
    const safe = this.safeUiBounds(size);
    const layout = containInSafe(safe, 720, 1080); const fit = layout.scale;
    this.root.setScale(fit, fit, 1); this.root.setPosition(layout.centerX, layout.centerY, 0);
    this.hudRoot?.setScale(fit, fit, 1); this.hudRoot?.setPosition(layout.centerX, layout.centerY, 0);
    const cssAxes = this.cssPerLocalAxes(size, fit);
    const cssScale = Math.min(cssAxes.x, cssAxes.y);
    this.proxySelection = 118 * cssScale < 56 || 46 * cssScale < 48 || 7 * cssScale < 8;
    this.proxyTea = this.run ? this.measureDimensionProxy('TEA', this.run.stage.tea_options) : false;
    this.proxyMilk = this.run ? this.measureDimensionProxy('MILK', this.run.stage.milk_options) : false;
    this.proxyToppings = this.run ? this.measureDimensionProxy('TOPPING', this.run.stage.topping_options) : false;
    this.proxyFooterActions = this.run ? this.measureFooterActionProxy() : false;
    this.proxyTimer = 34 * 720 / 1024 * cssScale < 24;
    this.showAsset(this.root, 'STATIC_BARE_PATCH04', { x: 0, y: 0 }, [1024, 1536], 720 / 1024);
    if (!this.config) {
      this.text(this.root, this.status || '正在载入奶茶配置…', 0, 0, 21, this.statusColor, 620, 90);
      if (this.status.startsWith('配置加载失败')) this.button(this.root, '重试加载', 0, -80, 170, 48, () => this.loadConfig());
      this.button(this.root, '返回菜单', 0, -142, 170, 48, () => this.leave());
      return;
    }
    if (this.warnedStorage) this.status = '浏览器不支持写入：进度只保留在当前页面';
    if (!this.customerAssets) {
      this.text(this.root, '顾客资源尚未注入，已停止加载本页', 0, 0, 21, GOLD, 620, 90);
      this.button(this.root, '返回菜单', 0, -80, 170, 48, () => this.leave());
      return;
    }
    const tierId = TIER_IDS[this.tierIndex];
    const stages = stagesFor(this.config, tierId);
    const tier = { tier_id: tierId, display_name: TIER_NAMES[tierId], stages, recipe_dims: 3 };
    if (!this.run) this.renderSelection(tier);
    else this.renderGame(tier);
    if (this.operationPanel) this.renderOperationPanel(tier);
    if (this.presentation) {
      const sampleNow = this.now(); this.applyPresentationSample(samplePresentation(this.presentation, sampleNow, this.presentationSample, this.presentationDurations()), sampleNow);
    }
  }
  private renderSelection(tier: { tier_id: string; display_name: string; stages: Stage[] }): void {
    // Approved empty bubble covers the background's discarded ghost-bubble tail on the selection page.
    this.showAsset(this.root!, 'ORDER_BUBBLE_EMPTY', this.sourcePos(...ORDER_BUBBLE_CENTER), ORDER_BUBBLE_SIZE);
    const normal = this.readSessionProgress();
    this.text(this.root!, `熟练度 ${normal.xp} 已通关 ${normal.cleared.length}/5 档`, 0, 474, 16, TEXT, 660, 32);
    this.text(this.root!, `选择难度　${tier.display_name}`, 0, 427, 22, GOLD, 620, 38);
    const width = 118, gap = 7, left = -((width + gap) * 4) / 2;
    if (!this.proxySelection && !this.operationPanel) TIER_IDS.forEach((id, index) => {
      const unlocked = this.validation.enabled || isUnlocked(this.config!, normal, id,
        { level: this.validation.level, soul: this.validation.soul, spirit: this.validation.spirit, growthEnabled: this.validation.unlockGrowth }, false);
      this.button(this.root!, unlocked ? TIER_NAMES[id] : `锁 ${TIER_NAMES[id]}`, left + index * (width + gap), 374, width, 46,
        () => { this.tierIndex = index; this.status = ''; this.dirty = true; }, unlocked);
    });
    const progress = this.readSessionProgress();
    const stage = chooseStage(this.config!, tier.tier_id, progress.xp, this.validation.enabled ? this.validation.stage : null);
    this.sourceText(`阶段 ${stage.stage_no}/2  每局 3 杯  ${stage.time_sec === null ? '不限时' : `${stage.time_sec} 秒`}`,
      ORDER_BUBBLE_CENTER[0], 396, 24, DEEP_BROWN, 280, 40);
    this.sourceText(`茶 ${stage.tea_options}/3  奶 ${stage.milk_options}/3  小料 ${stage.topping_options}/6`,
      ORDER_BUBBLE_CENTER[0], 455, 24, DEEP_BROWN, 280, 40);
    this.renderCustomerWindow(309);
    this.showAsset(this.root!, 'COUNTER_FRONT', this.sourcePos(512, 798), [556, 42]);
    this.renderIngredientGallery(stage);
    this.showCupComposition(this.root!, this.sourcePos(509.5, 1209), 1, null, false);
    if (!this.operationPanel) {
      if (!this.proxySelection) this.button(this.root!, '开始制作', 0, -410, 260, 54, () => this.beginRun(tier), !!tier.stages.length);
      if (this.proxySelection) {
        const axes = this.cssPerLocalAxes(size, fit); const pairWidth = Math.min(190, (safe.width * Math.min(axes.x, axes.y) - 24) / 2);
        this.renderSafeHudButton('返回菜单', () => this.leave(), 'left', pairWidth);
        this.renderSafeHudButton('操作', () => { this.operationPanel = true; this.dirty = true; }, 'right', pairWidth);
      }
      else this.renderSafeHudButton('返回菜单', () => this.leave(), 'left');
    }
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
        const min = this.minTouchSize();
        hit.addComponent(UITransform).setContentSize(Math.max((right - left) * hitScale, min.width),
          Math.max((bottom - top) * hitScale, min.height));
        const proxied = dimension === 'TEA' ? this.proxyTea : dimension === 'MILK' ? this.proxyMilk : this.proxyToppings;
        if (available && this.run && allowInput && !proxied)
          this.actions.set(hit, () => this.choose(dimension, item.ingredient_id));
      });
    });
  }
  private renderGame(tier: { tier_id: string; display_name: string; stages: Stage[] }): void {
    const run = this.run!; const nowMs = this.now(); const locked = shouldLockInput(this.presentation);
    const sample = this.presentation ? samplePresentation(this.presentation, nowMs, undefined, this.presentationDurations()) : null;
    const visualOrderIndex = this.presentation?.snapshot.orderIndex ?? Math.min(run.orderIndex, run.orders.length - 1);
    const order = run.orders[visualOrderIndex] ?? run.orders[run.orders.length - 1];
    this.renderSourceHeader(run, remainingSeconds(run, nowMs), visualOrderIndex);
    this.renderIngredientGallery(run.stage, false, !locked);
    const customerX = sample?.customerX ?? (run.status === 'won' || run.status === 'failed' ? -72 : 309);
    const customerRig = this.renderCustomerWindow(customerX);
    this.interactionMovingIngredients = {}; this.interactionCupContents = {};
    this.showAsset(this.root!, 'COUNTER_FRONT', this.sourcePos(512, 798), [556, 42]);
    this.renderToppingCategoryLabel();
    const bubble = this.renderTargetCup(order, sample?.bubbleVisible ?? (run.status === 'playing'));
    if (!locked) this.renderPreparationSlots();
    if (this.presentation && this.presentation.result !== 'expired' && this.presentation.result !== 'exited') {
      this.renderInteractionWorkCup(this.presentation.snapshot);
    }
    this.presentationVisual = {
      customer: customerRig.customer, touristView: customerRig.view, touristAdapter: customerRig.adapter, faces: {}, bubble, movingIngredients: this.interactionMovingIngredients,
      cupContents: this.interactionCupContents, facePose: sample?.face ?? 'neutral',
      faceProgress: sample?.faceProgress ?? 1, phase: sample?.phase ?? null, action: this.customerAction,
    };
    if (!this.operationPanel && !this.proxyFooterActions) {
      this.imageButton(this.root!, 'BTN_UNDO_BASE', '撤销一项', [518, 1490], 'BTN_UNDO_ICON', [464.5, 1480],
        () => this.undo(), !locked && DIMENSIONS.some(dim => !!run.selected[dim]));
      this.imageButton(this.root!, 'BTN_RECIPE_BASE', '查看配方', [191, 1490], 'BTN_RECIPE_ICON', [112, 1483],
        () => { this.recipeOpen = true; this.dirty = true; });
    }
    const complete = DIMENSIONS.every(dim => !!run.selected[dim]);
    if (!this.operationPanel && !this.proxyFooterActions) this.imageButton(this.root!, 'BTN_SERVE_BASE', '确认', [813, 1490], 'BTN_SERVE_ICON', [718, 1482],
      () => this.submit(), !locked && complete && run.status === 'playing');
    if (this.recipeOpen) this.renderRecipePanel(order);
    if (!this.operationPanel) this.renderHelpAndExit(order);
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
  private renderCustomerWindow(left: number): { customer: Node; view: TouristView; adapter: ApprovedTouristAdapter } {
    const assets = this.customerAssets;
    if (!assets) throw new Error('U05 缺少 Gallery 注入的已批准游客资源');
    const sourceScale = 720 / 1024;
    const centerX = 505; const centerY = 530.5;
    const window = new Node('CustomerWindow'); this.root!.addChild(window);
    window.setPosition(this.sourcePos(centerX, centerY).x, this.sourcePos(centerX, centerY).y);
    window.addComponent(UITransform).setContentSize(490 * sourceScale, 505 * sourceScale);
    window.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
    const customer = instantiate(assets.prefab); customer.name = 'UG_GHOST_01_Customer'; window.addChild(customer);
    customer.setPosition(((left + 166) - centerX) * sourceScale,
      (centerY - CUSTOMER_SOURCE_CENTER_Y) * sourceScale + 25, 0);
    const view = new TouristView(customer);
    view.setStageHeight(270);
    const adapter = new ApprovedTouristAdapter(view, assets.frameManifest, assets.mountManifest,
      assets.accessoryManifest, assets.bodyFrames, assets.accessoryFrames);
    if (!adapter.valid) throw new Error(`UG_GHOST_01 资源或挂点清单无效：${adapter.diagnostic()}`);
    this.commitCustomerFrame(adapter, this.customerAction, this.customerActionElapsedMs, true);
    return { customer, view, adapter };
  }
  private renderTargetCup(recipe: Run['orders'][number], bubbleVisible: boolean): Node {
    const group = new Node('OrderPresentation'); this.root!.addChild(group); group.active = bubbleVisible;
    this.showAsset(group, 'ORDER_BUBBLE_EMPTY', this.sourcePos(...ORDER_BUBBLE_CENTER), ORDER_BUBBLE_SIZE);
    const centerX = 653; const centerY = 416; const unit = 720 / 1024;
    const cup = new Node('OrderCupGroup'); group.addChild(cup);
    cup.setPosition(this.sourcePos(ORDER_BUBBLE_CENTER[0], ORDER_BUBBLE_CENTER[1]).x,
      this.sourcePos(ORDER_BUBBLE_CENTER[0], ORDER_BUBBLE_CENTER[1]).y);
    cup.setScale(.55, .55, 1);
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
  private presentationDurations(): PresentationDurations {
    if (this.presentationDurationCache) return this.presentationDurationCache;
    const sum = (action: TouristAction): number => (this.customerActionFrames.get(action) ?? [])
      .reduce((total, frame) => total + frame.durationMs, 0);
    const happyMs = sum('happy'); const sadMs = sum('sad');
    this.presentationDurationCache = happyMs > 0 && sadMs > 0 ? { happyMs, sadMs } : DEFAULT_PRESENTATION_DURATIONS;
    return this.presentationDurationCache;
  }

  private commitCustomerFrame(adapter?: ApprovedTouristAdapter, action = this.customerAction,
    elapsedMs = this.customerActionElapsedMs, force = false): void {
    const target = adapter ?? this.presentationVisual?.touristAdapter;
    const manifest = this.customerAssets?.frameManifest;
    if (!target || !manifest || !target.valid) return;
    let frameAction: TouristAction = action ?? 'walk';
    const actionItems = this.customerActionFrames.get(frameAction) ?? [];
    if (!actionItems.length) return;
    let frameIndex = 0;
    if (action === null) {
      const initialId = manifest.initial;
      const initial = manifest.frames.find(item => item.frameId === initialId);
      frameAction = initial?.action ?? 'walk'; frameIndex = initial?.index ?? 0;
    } else {
      const total = actionItems.reduce((sum, item) => sum + item.durationMs, 0);
      let elapsed = Math.max(0, elapsedMs);
      if (action === 'walk') elapsed = total > 0 ? elapsed % total : 0;
      else elapsed = Math.min(elapsed, Math.max(0, total - 0.001));
      for (const item of actionItems) {
        if (elapsed < item.durationMs) { frameIndex = item.index; break; }
        elapsed -= item.durationMs;
        frameIndex = item.index;
      }
    }
    if (!force && action === this.customerAction && frameIndex === this.customerFrameIndex
      && this.customerCommittedFacing === this.customerFacing) return;
    const frame = target.frame(frameAction, frameIndex);
    if (!frame) return;
    const packet = {
      frame, action: frameAction, frameIndex,
      phase: action === null ? 'initial' as const : 'playing' as const,
      facing: this.customerFacing,
      slots: { hat: null, glasses: null, wristband: null }, generation: 0,
    };
    if (target.commit(packet)) { this.customerFrameIndex = frameIndex; this.customerCommittedFacing = this.customerFacing; }
  }

  private applyPresentationSample(sample: PresentationSample, nowMs: number): void {
    const visual = this.presentationVisual;
    if (!visual || !this.presentation) return;
    visual.facePose = sample.face;
    visual.faceProgress = sample.faceProgress; visual.phase = sample.phase;
    this.customerFacing = sample.phase === 'depart' ? 'left' : 'right';
    const action: TouristAction | null = sample.phase === 'happy' ? 'happy'
      : sample.phase === 'disappointed' ? 'sad'
        : sample.phase === 'depart' || sample.phase === 'arrive' ? 'walk' : null;
    if (action !== this.customerAction) {
      this.customerAction = action;
      this.customerFrameIndex = -1;
    }
    this.customerActionElapsedMs = action === null ? 0 : Math.max(0, nowMs - sample.phaseStartedAtMs);
    visual.action = this.customerAction;
    this.commitCustomerFrame(visual.touristAdapter);
    if (visual.bubble?.isValid) visual.bubble.active = sample.bubbleVisible;
    const customer = visual.customer;
    if (customer?.isValid && customer.parent?.isValid) {
      const sourceScale = 720 / 1024; const windowCenterX = 505; const windowCenterY = 530.5;
      customer.setPosition(((sample.customerX + 166) - windowCenterX) * sourceScale,
        (windowCenterY - CUSTOMER_SOURCE_CENTER_Y) * sourceScale + 25, 0);
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
    this.customerAction = null; this.customerActionElapsedMs = 0; this.customerFrameIndex = -1;
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
    const ids = { TEA: recipe.tea_id, MILK: recipe.milk_id, TOPPING: recipe.topping_id };
    const lines = DIMENSIONS.map(dimension => {
      const item = this.config!.ingredients.find(row => row.ingredient_id === ids[dimension]);
      return `${DIMENSION_NAMES[dimension]} ${item?.name ?? '—'}`;
    });
    this.renderSafeDialog('当前配方', lines.map(line => ({ text: line })), () => { this.recipeOpen = false; this.dirty = true; });
  }
  private cssPerLocalAxes(visible: { width: number; height: number }, fit: number): { x: number; y: number } {
    const content = this.viewportSnapshot?.content;
    return {
      x: visible.width > 0 ? (content?.width ?? visible.width) * fit / visible.width : fit,
      y: visible.height > 0 ? (content?.height ?? visible.height) * fit / visible.height : fit,
    };
  }
  private topMarginLocal(): number {
    const visible = view.getVisibleSize(); const fit = this.layoutFit(visible);
    return (visible.height - 1080 * fit) / 2 / fit;
  }
  private renderHelpAndExit(_recipe: Run['orders'][number]): void {
    if (this.modalActive()) return;
    if (this.proxyToppings || this.proxyTea || this.proxyMilk || this.proxyFooterActions || this.proxyTimer) {
      const axes = this.cssPerLocalAxes(view.getVisibleSize(), this.layoutFit(view.getVisibleSize()));
      const safe = this.safeLocalRect(); const pairWidth = Math.min(190, (safe.width * Math.min(axes.x, axes.y) - 24) / 2);
      const seconds = remainingSeconds(this.run, this.now());
      const label = this.proxyTimer ? this.clockText(seconds) : '返回';
      this.safeTimerLabel = this.renderSafeHudButton(label, () => { this.exitConfirm = true; this.dirty = true; }, 'left', pairWidth);
      this.renderSafeHudButton('操作', () => { this.operationPanel = true; this.dirty = true; }, 'right', pairWidth);
    } else this.renderSafeHudButton('返回', () => { this.exitConfirm = true; this.dirty = true; }, 'left');
  }
  private renderExitConfirm(): void {
    this.renderSafeDialog('确认退出', [{ text: '离开后本局不计熟练度' }], () => { this.exitConfirm = false; this.dirty = true; }, [
      { label: '继续制作', action: () => { this.exitConfirm = false; this.dirty = true; } },
      { label: '退出本局', action: () => { this.exitConfirm = false; this.confirmExit(); } },
    ]);
  }
  private renderValidation(): void {
    this.renderSafeDialog('示例验证设置（仅当前会话）', [
      { text: this.validation.enabled ? '验证模式：开 / 点击切换' : '验证模式：关 / 点击切换', action: () => { this.validation.enabled = !this.validation.enabled; this.writeValidation(); this.sessionProgress = null; this.dirty = true; } },
      { text: `阶段 ${this.validation.stage} / 点击切换`, action: () => { this.validation.stage = this.validation.stage === 1 ? 2 : 1; this.writeValidation(); this.dirty = true; } },
      { text: '重置隔离存档', action: () => { this.progress = { ...DEFAULT_PROGRESS }; this.sessionProgress = null; this.writeProgress(); this.status = '示例进度已重置'; this.dirty = true; } },
      { text: `等级 ${this.validation.level} / 点击循环`, action: () => { this.validation.level = this.validation.level >= 3 ? 1 : this.validation.level + 1; this.writeValidation(); this.reconcileProgress(); this.dirty = true; } },
      { text: `魂 ${this.validation.soul} / 点击循环`, action: () => { this.validation.soul = (this.validation.soul + 1) % 4; this.writeValidation(); this.reconcileProgress(); this.dirty = true; } },
      { text: `魄 ${this.validation.spirit} / 点击循环`, action: () => { this.validation.spirit = (this.validation.spirit + 1) % 8; this.writeValidation(); this.reconcileProgress(); this.dirty = true; } },
    ], () => { this.toggleValidation = false; this.dirty = true; });
  }
  private renderResult(): void {
    this.modalActions.clear(); const won = this.run?.status === 'won';
    const title = won ? '三杯完成！' : this.run?.status === 'failed' ? '时间到，本局失败' : '本局结束';
    const rows = won ? [{ text: `本地示例熟练度 +${this.lastXp}` }] : [{ text: this.status || title }];
    const footer = won ? [
      { label: '再玩一局', action: () => this.retry() }, { label: '返回菜单', action: () => this.leave() },
    ] : [
      { label: '重试本档', action: () => this.retry() }, { label: '返回菜单', action: () => this.leave() },
    ];
    this.renderSafeDialog(title, rows, () => this.leave(), footer);
  }
  private measureDimensionProxy(dimension: Dimension, availableCount: number): boolean {
    const targets: U05HitTarget[] = [];
    const available = this.config?.ingredients.filter(item => item.dimension === dimension && item.sort_order <= availableCount) ?? [];
    const positions: Record<Dimension, Array<[number, number]>> = {
      TEA: [[127, 496], [132, 700], [132, 904]],
      MILK: [[913, 502], [915, 702], [916, 906]],
      TOPPING: [[342, 892], [516, 894], [690, 896], [342, 1008], [516, 1012], [690, 1010]],
    };
    for (const item of available) {
      const index = item.sort_order - 1; const [sx, sy] = positions[dimension][index];
      const [lx, ly, lw, lh] = LABEL_POSITIONS[dimension][index]; const [aw, ah] = ASSET_SIZES[ingredientAsset(item)];
      const left = Math.min(sx - aw / 2, lx - lw / 2), right = Math.max(sx + aw / 2, lx + lw / 2);
      const top = Math.min(sy - ah / 2, ly - lh / 2), bottom = Math.max(sy + ah / 2, ly + lh / 2);
      const visible = view.getVisibleSize();
      const axes = this.cssPerLocalAxes(visible, this.layoutFit(visible));
      const scaleX = 720 / 1024 * axes.x, scaleY = 720 / 1024 * axes.y;
      const widthCss = (right - left) * scaleX, heightCss = (bottom - top) * scaleY;
      const centerX = ((left + right) / 2 - 512) * scaleX;
      const centerY = (768 - (top + bottom) / 2) * scaleY;
      const box = { width: Math.max(widthCss, 48), height: Math.max(heightCss, 48) };
      targets.push({ group: item.ingredient_id, rect: { x: centerX - box.width / 2, y: centerY - box.height / 2, width: box.width, height: box.height } });
    }
    return hasHitConflict(targets, 8);
  }
  private measureFooterActionProxy(): boolean {
    const visible = view.getVisibleSize(); const axes = this.cssPerLocalAxes(visible, this.layoutFit(visible));
    const scaleX = 720 / 1024 * axes.x, scaleY = 720 / 1024 * axes.y;
    const controls: Array<{ id: string; center: [number, number] }> = [
      { id: 'BTN_RECIPE_BASE', center: [191, 1490] },
      { id: 'BTN_UNDO_BASE', center: [518, 1490] },
      { id: 'BTN_SERVE_BASE', center: [813, 1490] },
    ];
    const targets: U05HitTarget[] = controls.map(control => {
      const [sourceWidth, sourceHeight] = ASSET_SIZES[control.id]; const min = this.minTouchSize();
      const width = Math.max(sourceWidth * 720 / 1024, min.width);
      const height = Math.max(sourceHeight * 720 / 1024, min.height);
      const x = (control.center[0] - 512) * scaleX;
      const y = (768 - control.center[1]) * scaleY + Math.max(0, min.height - sourceHeight * 720 / 1024) / 2 * axes.y;
      return { group: control.id, rect: {
        x: x - width * axes.x / 2, y: y - height * axes.y / 2,
        width: width * axes.x, height: height * axes.y,
      } };
    });
    return hasHitConflict(targets, 8);
  }
  private safeUiBounds(visible: { width: number; height: number }): { x: number; y: number; width: number; height: number } {
    const snapshot = this.viewportSnapshot ?? this.viewportAdapter?.read();
    const mapped = snapshot ? ViewportMapper.safeUiRect(snapshot, visible) : null;
    if (mapped && mapped.width > 0 && mapped.height > 0) return mapped;
    return { x: -visible.width / 2 + 12, y: -visible.height / 2 + 8,
      width: Math.max(0, visible.width - 24), height: Math.max(0, visible.height - 16) };
  }
  private layoutFit(visible: { width: number; height: number }): number {
    return containInSafe(this.safeUiBounds(visible), 720, 1080).scale;
  }
  private safeLocalRect(): { x: number; y: number; width: number; height: number } {
    const visible = view.getVisibleSize(); const safe = this.safeUiBounds(visible); const fit = this.layoutFit(visible);
    if (fit <= 0) return { x: -350, y: -520, width: 700, height: 1040 };
    // safeUiBounds is bottom-left based; the top edge is y + height, including asymmetric insets/capsule cuts.
    return { x: -safe.width / 2 / fit, y: safe.height / 2 / fit,
      width: safe.width / fit, height: safe.height / fit };
  }
  private renderModalScrim(): void {
    const safe = this.safeLocalRect();
    this.draw(this.root!, 'ModalScrim', safe.x + safe.width / 2, safe.y - safe.height / 2,
      safe.width, safe.height, new Color(8, 13, 18, 178));
  }
  private renderSafeHudButton(label: string, action: () => void, side: 'left' | 'right' = 'right', requestedCssWidth = 190): Label | null {
    const parent = this.hudRoot?.isValid ? this.hudRoot : this.root!;
    const visible = view.getVisibleSize(); const fit = this.layoutFit(visible);
    const axes = this.cssPerLocalAxes(visible, fit); const unit = 1 / Math.max(Math.min(axes.x, axes.y), .0001);
    const safe = this.safeLocalRect(); const width = Math.max(48 * unit, Math.min(requestedCssWidth * unit, safe.width - 16 * unit)); const height = 52 * unit;
    const x = side === 'left' ? safe.x + width / 2 + 8 * unit : safe.x + safe.width - width / 2 - 8 * unit; const y = safe.y - height / 2 - 8 * unit;
    const visual = this.button(parent, label, x, y, width, height, action);
    return visual.children[0]?.getComponent(Label) ?? null;
  }
  private renderSafeDialog(title: string, rows: Array<{ text: string; action?: () => void; enabled?: boolean }>, close: () => void,
    footer?: Array<{ label: string; action: () => void }>): void {
    const visible = view.getVisibleSize(); const fit = this.layoutFit(visible);
    const axes = this.cssPerLocalAxes(visible, fit); const unit = 1 / Math.max(Math.min(axes.x, axes.y), .0001);
    const safe = this.safeLocalRect(); this.renderModalScrim(); this.modalActions.clear();
    const width = Math.min(560 * unit, safe.width - 16 * unit); const height = Math.min(620 * unit, safe.height - 16 * unit);
    const cx = safe.x + safe.width / 2; const cy = safe.y - safe.height / 2;
    this.draw(this.root!, 'SafeDialog', cx, cy, width, height, new Color(25, 39, 49, 250));
    this.text(this.root!, title, cx, cy + height / 2 - 30 * unit, 20, GOLD, width - 40 * unit, 56 * unit);
    const footerRows = footer?.length ? footer : [{ label: '完成', action: close }];
    const footerY = cy - height / 2 + 32 * unit; const footerGap = 8 * unit;
    const footerW = Math.min(190 * unit, (width - 24 * unit - footerGap * (footerRows.length - 1)) / footerRows.length);
    footerRows.forEach((item, index) => this.button(this.root!, item.label,
      cx - (footerW * footerRows.length + footerGap * (footerRows.length - 1)) / 2 + footerW * (index + .5) + footerGap * index,
      footerY, footerW, 48 * unit, item.action));
    const bodyTop = cy + height / 2 - 72 * unit; const bodyBottom = footerY + 100 * unit; const bodyH = Math.max(48 * unit, bodyTop - bodyBottom);
    const rowH = 56 * unit; const visibleRows = Math.max(1, Math.floor(bodyH / rowH));
    const maxScroll = Math.max(0, rows.length - visibleRows); this.scrollOffset = clampScrollOffset(this.scrollOffset, rows.length, visibleRows);
    rows.slice(this.scrollOffset, this.scrollOffset + visibleRows).forEach((row, index) => {
      const yy = bodyTop - (index + .5) * rowH;
      if (row.action) this.button(this.root!, row.text, cx, yy, width - 28 * unit, 48 * unit, row.action, row.enabled !== false);
      else this.text(this.root!, row.text, cx, yy, 16, TEXT, width - 28 * unit, 48 * unit);
    });
    if (maxScroll > 0) {
      this.button(this.root!, '▲', cx - 30 * unit, footerY + 58 * unit, 48 * unit, 48 * unit,
        () => { this.scrollOffset = Math.max(0, this.scrollOffset - 1); this.dirty = true; });
      this.button(this.root!, '▼', cx + 30 * unit, footerY + 58 * unit, 48 * unit, 48 * unit,
        () => { this.scrollOffset = Math.min(maxScroll, this.scrollOffset + 1); this.dirty = true; });
    }
  }
  private renderOperationPanel(tier: { tier_id: string; display_name: string; stages: Stage[] }): void {
    const visible = view.getVisibleSize(); const fit = this.layoutFit(visible);
    const axes = this.cssPerLocalAxes(visible, fit); const unit = 1 / Math.max(Math.min(axes.x, axes.y), .0001);
    const run = this.run; const safe = this.safeLocalRect(); this.renderModalScrim(); this.modalActions.clear();
    const width = Math.min(560 * unit, safe.width - 16 * unit); const height = Math.min(700 * unit, safe.height - 16 * unit);
    const cx = safe.x + safe.width / 2; const cy = safe.y - safe.height / 2;
    this.draw(this.root!, 'OperationPanel', cx, cy, width, height, new Color(25, 39, 49, 250));
    this.text(this.root!, '操作 / 配方', cx, cy + height / 2 - 30 * unit, 20, GOLD, width - 110 * unit, 56 * unit);
    this.button(this.root!, '关闭', cx + width / 2 - 42 * unit, cy + height / 2 - 30 * unit, 72 * unit, 48 * unit,
      () => { this.operationPanel = false; this.dirty = true; });
    const rows: Array<{ label: string; action?: () => void; enabled?: boolean }> = [];
    if (!run) {
      TIER_IDS.forEach((id, index) => {
        const unlocked = this.validation.enabled || isUnlocked(this.config!, this.readSessionProgress(), id, this.growthInputs(), false);
        rows.push({ label: `${index === this.tierIndex ? '✓ ' : ''}难度：${TIER_NAMES[id]}`, action: () => { this.tierIndex = index; this.dirty = true; }, enabled: unlocked });
      });
      const startStage = chooseStage(this.config!, tier.tier_id, this.readSessionProgress().xp, this.validation.enabled ? this.validation.stage : null);
      rows.push({ label: `阶段 ${startStage.stage_no}/2；每局3杯；${startStage.time_sec === null ? '不限时' : `${startStage.time_sec}秒`}` });
      rows.push({ label: '开始制作', action: () => this.beginRun(tier), enabled: !!tier.stages.length });
      rows.push({ label: this.toggleValidation ? '验证设置：关闭' : '示例验证设置', action: () => { this.toggleValidation = !this.toggleValidation; this.operationPanel = false; this.dirty = true; } });
      rows.push({ label: '返回菜单', action: () => this.leave() });
    } else {
      const stage = run.stage;
      const proxiedDimensions = DIMENSIONS.filter(value => value === 'TEA' ? this.proxyTea : value === 'MILK' ? this.proxyMilk : this.proxyToppings);
      for (const dimension of proxiedDimensions) {
        const dimensionItems = this.config!.ingredients.filter(item => item.dimension === dimension)
          .sort((a, b) => a.sort_order - b.sort_order).slice(0,
            dimension === 'TEA' ? stage.tea_options : dimension === 'MILK' ? stage.milk_options : stage.topping_options);
        dimensionItems.forEach(item => rows.push({
          label: `${DIMENSION_NAMES[dimension]}：${item.name}${run.selected[dimension] === item.ingredient_id ? ' ✓' : ''}`,
          action: () => { if (!this.presentation && run.status === 'playing') this.choose(dimension, item.ingredient_id); },
          enabled: !shouldLockInput(this.presentation) && run.status === 'playing',
        }));
      }
      if (this.proxyFooterActions) {
        rows.push({ label: '撤销一项', action: () => this.undo(), enabled: !shouldLockInput(this.presentation) && DIMENSIONS.some(dim => !!run.selected[dim]) });
        rows.push({ label: '查看配方', action: () => { this.operationPanel = false; this.recipeOpen = true; this.dirty = true; } });
        rows.push({ label: '确认提交', action: () => this.submit(), enabled: !shouldLockInput(this.presentation) && DIMENSIONS.every(dim => !!run.selected[dim]) && run.status === 'playing' });
      }
      rows.push({ label: '退出本局', action: () => { this.operationPanel = false; this.exitConfirm = true; this.dirty = true; } });
      if (proxiedDimensions.length) rows.unshift({ label: `${proxiedDimensions.map(value => DIMENSION_NAMES[value]).join(' / ')}选项` });
      const seconds = remainingSeconds(run, this.now());
      rows.unshift({ label: `订单 ${Math.min(run.orderIndex + 1, run.orders.length)}/${run.orders.length}　剩余 ${this.clockText(seconds)}` });
      const state = `状态：${this.status || (run.status === 'playing' ? '制作中' : run.status)}`;
      const charsPerLine = Math.max(8, Math.floor((width - 24 * unit) * Math.min(axes.x, axes.y) / 16));
      wrapTextByCodepoint(state, charsPerLine).reverse().forEach(line => rows.unshift({ label: line }));
    }
    const rowH = 56 * unit; const top = cy + height / 2 - 76 * unit; const bottom = cy - height / 2 + 96 * unit;
    const visibleRows = Math.max(1, Math.floor((top - bottom) / rowH)); const maxScroll = Math.max(0, rows.length - visibleRows);
    this.operationScroll = clampScrollOffset(this.operationScroll, rows.length, visibleRows);
    rows.slice(this.operationScroll, this.operationScroll + visibleRows).forEach((row, i) => {
      const yy = top - (i + .5) * rowH;
      if (row.action) this.button(this.root!, row.label, cx, yy, width - 24 * unit, 48 * unit, row.action, row.enabled !== false);
      else this.text(this.root!, row.label, cx, yy, 16, TEXT, width - 24 * unit, 48 * unit);
    });
    if (maxScroll > 0) {
      this.button(this.root!, '▲', cx - 30 * unit, cy - height / 2 + 42 * unit, 48 * unit, 48 * unit,
        () => { this.operationScroll = Math.max(0, this.operationScroll - 1); this.dirty = true; });
      this.button(this.root!, '▼', cx + 30 * unit, cy - height / 2 + 42 * unit, 48 * unit, 48 * unit,
        () => { this.operationScroll = Math.min(maxScroll, this.operationScroll + 1); this.dirty = true; });
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
    this.operationPanel = false; this.recipeOpen = tier.tier_id === 'EASY'; this.exitConfirm = false; this.lastClockSecond = -1; this.dirty = true;
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
    const customerStartX = this.presentation ? samplePresentation(this.presentation, nowMs, this.presentationSample, this.presentationDurations()).customerX : 309;
    this.recipeOpen = false; this.exitConfirm = false; this.run = { ...this.run, status: 'exited' };
    this.status = '离开后本局不计熟练度'; this.statusColor = GOLD;
    this.startPresentation('exited', snapshot, nowMs, customerStartX); this.dirty = true;
  }
  private retry(): void {
    if (this.presentation || this.run?.status === 'playing') return;
    this.operationPanel = false;
    const tierId = TIER_IDS[this.tierIndex]; this.cancelPresentation(); this.run = null;
    this.beginRun({ tier_id: tierId, stages: stagesFor(this.config!, tierId) });
  }
  private leave(): void { this.operationPanel = false; this.cancelPresentation(); this.customerAction = null; this.customerActionElapsedMs = 0; this.customerFrameIndex = -1; this.customerFacing = 'right'; this.customerCommittedFacing = null; this.run = null; this.recipeOpen = false; this.exitConfirm = false; this.toggleValidation = false; this.status = ''; this.actions.clear(); this.modalActions.clear(); this.onExit?.(); }
}
