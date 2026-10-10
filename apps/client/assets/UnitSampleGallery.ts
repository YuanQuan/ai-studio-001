import {
  _decorator, Color, Component, Director, EventMouse, EventTouch, Graphics, Input, director, input,
  JsonAsset, Label, Mask, Node, Prefab, ResolutionPolicy, Sprite, SpriteFrame, UITransform, Vec3, profiler,
  instantiate, sys, view, assetManager,
} from 'cc';
import { Scene1CameraController } from './labs/menu/scene1_camera_controller';
import { TouristAction, TouristSlot, TouristStateController } from './labs/u02/tourist_state';
import {
  ApprovedTouristAdapter, TouristAccessoryManifest, TouristFrameManifest,
  TouristMountManifest,
} from './labs/u02/tourist_adapter';
import { TouristView } from './labs/u02/tourist_view';
import { SHOP_IDS, SHOP_NAMES, SHOP_PREFAB_NAMES } from './labs/u03/shop_definitions';

const { ccclass, property } = _decorator;
const MENU_BG = new Color(10, 20, 34);
const PANEL = new Color(19, 34, 51);
const TEXT = new Color(230, 239, 247);
const MUTED = new Color(155, 178, 199);
const BLUE = new Color(108, 193, 224);
const GOLD = new Color(246, 189, 109);
const OVERVIEW_SHOP_BASELINE = [
  { x: -1079, y: -234 }, { x: -780, y: -260 }, { x: -410, y: -235 },
  { x: 350, y: -237 }, { x: 689, y: -249 }, { x: 1030, y: -249 },
];
const OVERVIEW_SHOP_BASELINE_SCALES = [0.34, 0.34, 0.34, 0.34, 0.34, 0.34];
const OVERVIEW_TOURIST_COUNT = 1;
const OVERVIEW_TOURIST_SCALE = 0.2;
const U04_MANAGERS = [
  { key: 'mt', name: '孟桃' }, { key: 'at', name: '阿棠' },
  { key: 'ac', name: '阿炭' }, { key: 'aj', name: '阿角' },
  { key: 'ad', name: '阿灯' }, { key: 'xj', name: '小锦' },
];
const U04_STAGES = [0, 2, 3];
const U04_EXPRESSIONS = [
  { key: 'happy', name: '高兴' }, { key: 'surprised', name: '惊讶' },
  { key: 'sad', name: '悲伤' }, { key: 'smile', name: '微笑' }, { key: 'angry', name: '生气' },
];
const U04_PANEL_SIZES = [
  { width: 384, height: 192 }, { width: 768, height: 256 },
  { width: 1024, height: 384 }, { width: 1280, height: 195 },
];
const U04_CROP_EXPORT_WIDTH: Record<string, number> = {
  MT_S0: 576, MT_S2: 551, MT_S3: 574, AT_S0: 503, AT_S2: 516, AT_S3: 768,
  AC_S0: 446, AC_S2: 497, AC_S3: 601, AJ_S0: 586, AJ_S2: 586, AJ_S3: 566,
  AD_S0: 549, AD_S2: 584, AD_S3: 664, XJ_S0: 613, XJ_S2: 617, XJ_S3: 633,
};
const U04_LAYOUT: Record<string, { scale: number; waist: number; x: number; y: number }> = {
  MT_S0: { scale: 0.73, waist: 0.68, x: -25, y: 210 }, MT_S2: { scale: 0.71, waist: 0.70, x: 3, y: 210 },
  MT_S3: { scale: 0.73, waist: 0.69, x: -3, y: 210 }, AT_S0: { scale: 0.73, waist: 0.68, x: 15, y: 210 },
  AT_S2: { scale: 0.71, waist: 0.70, x: 4, y: 210 }, AT_S3: { scale: 0.73, waist: 0.69, x: 2, y: 210 },
  AC_S0: { scale: 0.73, waist: 0.67, x: 22, y: 210 }, AC_S2: { scale: 0.71, waist: 0.70, x: 14, y: 210 },
  AC_S3: { scale: 0.73, waist: 0.68, x: 10, y: 210 }, AJ_S0: { scale: 0.73, waist: 0.68, x: -10, y: 210 },
  AJ_S2: { scale: 0.71, waist: 0.70, x: -7, y: 210 }, AJ_S3: { scale: 0.73, waist: 0.69, x: -4, y: 210 },
  AD_S0: { scale: 0.6893, waist: 0.735, x: -68, y: 210 }, AD_S2: { scale: 0.6893, waist: 0.735, x: -68, y: 210 },
  AD_S3: { scale: 0.6893, waist: 0.735, x: -68, y: 210 }, XJ_S0: { scale: 0.7129, waist: 0.705, x: -106, y: 210 },
  XJ_S2: { scale: 0.7129, waist: 0.705, x: -106, y: 210 }, XJ_S3: { scale: 0.7129, waist: 0.705, x: -106, y: 210 },
};

@ccclass('UnitSampleGallery')
export class UnitSampleGallery extends Component {
  @property({ type: Prefab, tooltip: 'STREET_BASE_01 共用五层背景 Prefab。' })
  public streetBasePrefab: Prefab | null = null;

  @property({ type: Prefab, tooltip: 'UG_GHOST_01 正式单游客 Prefab。' })
  public touristPrefab: Prefab | null = null;
  @property({ type: JsonAsset }) public touristFrameManifest: JsonAsset | null = null;
  @property({ type: JsonAsset }) public touristMountManifest: JsonAsset | null = null;
  @property({ type: JsonAsset }) public touristAccessoryManifest: JsonAsset | null = null;
  @property({ type: [SpriteFrame] }) public touristBodyFrames: SpriteFrame[] = [];
  @property({ type: [SpriteFrame] }) public touristAccessoryFrames: SpriteFrame[] = [];
  @property({ type: [Prefab] }) public shopPrefabs: Prefab[] = [];

  private shopStage: Node | null = null;
  private shopTitle: Node | null = null;
  private shopArtwork: Node | null = null;
  private shopIdentity: Label | null = null;
  private shopStatus: Label | null = null;
  private shopPrevious: Node | null = null;
  private shopNext: Node | null = null;
  private shopBack: Node | null = null;
  private shopRetry: Node | null = null;
  private shopErrorPanel: Node | null = null;
  private shopPanelMessage: Label | null = null;
  private presentedIndex: number | null = null;
  private desiredIndex = 0;
  private failedTarget: number | null = null;
  private shopGeneration = 0;
  private disabledControls = new Set<Node>();

  private root!: Node;
  private rootBackground: Node | null = null;
  private page!: Node;
  private menuEntries: Array<{ node: Node; open: () => void }> = [];
  private menuMouseDown: Node | null = null;
  private menuContent: Node | null = null;
  private menuTitle: Node | null = null;
  private menuCards: Node[] = [];
  private pageEpoch = 0;
  private touristState: TouristStateController | null = null;
  private touristView: TouristView | null = null;
  private touristAdapter: ApprovedTouristAdapter | null = null;
  private touristActionButtons: Partial<Record<TouristAction, Node>> = {};
  private touristSlotButtons: Partial<Record<TouristSlot, Node>> = {};
  private touristFacingButtons: Partial<Record<'left' | 'right', Node>> = {};
  private touristNavBack: Node | null = null;
  private touristNavTitle: Node | null = null;
  private touristNavReset: Node | null = null;
  private touristStage: Node | null = null;
  private touristStagePanel: Node | null = null;
  private touristStatus: Node | null = null;
  private touristAdornment: Node | null = null;
  private touristTrayViewport: Node | null = null;
  private touristTrayBackground: Node | null = null;
  private touristTrayContent: Node | null = null;
  private touristScrollOffset = 0;
  private touristMaxScroll = 0;
  private touristTouchY: number | null = null;
  private touristTouchStartY: number | null = null;
  private touristMouseY: number | null = null;
  private touristMouseStartY: number | null = null;
  private touristScrollGesture = false;
  private sceneViewport: Node | null = null;
  private sceneControls: Node | null = null;
  private sceneBack: Node | null = null;
  private overviewScene: Node | null = null;
  private overviewTourists: Array<{ root: Node; state: TouristStateController; view: TouristView; adapter: ApprovedTouristAdapter; actionElapsed: number; actionDurationMs: number; action: TouristAction; walking: boolean; bounds: [number, number] }> = [];
  private overviewShops: Node | null = null;
  private overviewShopNodes: Node[] = [];
  private overviewShopFootpoints: Array<{ x: number; y: number }> = [];
  private overviewShopSelectedIndex = 0;
  private overviewShopStep = 10;
  private overviewShopScales: number[] = [];
  private overviewTouristScales: number[] = [];
  private overviewScaleStep = 0.02;
  private overviewAdjustTarget: 'shops' | 'tourists' = 'shops';
  private overviewShopAdjustToggle: Node | null = null;
  private overviewShopAdjustPanel: Node | null = null;
  private overviewShopNameLabel: Node | null = null;
  private overviewShopXLabel: Node | null = null;
  private overviewShopYLabel: Node | null = null;
  private overviewShopScaleLabel: Node | null = null;
  private overviewShopStepLabel: Node | null = null;
  private overviewShopFeedback: Node | null = null;
  private overviewClipboardFallback: any = null;
  private overviewBackgroundLayers: Node[] = [];
  private overviewController: Scene1CameraController | null = null;
  private overviewGroupButtons: Partial<Record<'street' | 'tourists' | 'shops', Node>> = {};
  private overviewGroupVisible = { street: true, tourists: true, shops: true };
  private overviewTouristsVisible = true;
  private overviewShopsVisible = true;
  private overviewMouseTarget: Node | null = null;
  private buttonMouseActions = new Map<Node, () => void>();
  private overviewCountLabel: Node | null = null;
  private overviewCount = OVERVIEW_TOURIST_COUNT;
  private overviewRng = 94721;
  private overviewProfilerWasShowing: boolean | null = null;
  private u04Generation = 0;
  private u04Manifest: JsonAsset | null = null;
  private u04ManifestLoaded = false;
  private u04ManifestLoading = false;
  private u04ManifestWaiters: number[] = [];
  private u04LandscapeMode = false;
  private u04Manager = 0;
  private u04Stage = 0;
  private u04Expression = 3;
  private u04PageGeneration = 0;
  private u04Loaded = new Map<string, SpriteFrame>();
  private u04Bundle: any = null;
  private u04BundleLoading = false;
  private u04BundleWaiters: Array<(bundle: any | null) => void> = [];
  private u04Sweep = { active: false, checked: 0, total: 90, failed: [] as string[], elapsedMs: 0, startedAt: 0 };
  private u04Pending: Array<{ path: string; apply: (frame: SpriteFrame | null) => void; generation: number; pageGeneration: number; selection: boolean }> = [];
  private u04RefCounts = new Map<string, number>();
  private u04SelectionPaths = new Set<string>();
  private u04PagePaths = new Set<string>();
  private u04Inflight = new Map<string, { refs: number; done: boolean; frame: SpriteFrame | null; waiters: Array<(frame: SpriteFrame | null) => void> }>();
  private u04Sprites: Sprite[] = [];
  private u04Portrait: Node | null = null;
  private u04CropWidth = 430;
  private u04BaseNode: Node | null = null;
  private u04Face: Node | null = null;
  private u04Front: Node | null = null;
  private u04Name: Label | null = null;
  private u04Status: Label | null = null;
  private u04Title: Label | null = null;
  private u04Panel: Sprite | null = null;
  private u04PanelSizeIndex = 3;
  private u04Back: Node | null = null;
  private u04Controls: Node[] = [];
  private u04ResizeButtons: Node[] = [];
  private u04SweepButton: Node | null = null;

  protected onLoad(): void {
    // Keep the full phone viewport, including the extra height of tall phones.
    view.setDesignResolutionSize(720, 1280, ResolutionPolicy.FIXED_WIDTH);
    this.root = this.makeNode('UnitSamplesRoot', this.node, 720, 1280);
    this.rootBackground = this.drawRect(this.root, 0, 0, 720, 1280, MENU_BG);
    this.openMenu();
    input.on(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.on(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    view.on('canvas-resize', this.layoutScene, this);
    view.on('design-resolution-changed', this.layoutScene, this);
  }

  protected onDestroy(): void {
    this.restoreOverviewProfiler();
    this.releaseU04Page();
    if (this.u04ManifestLoaded) this.u04Bundle?.release('u04_layer_export_map', JsonAsset);
    this.u04ManifestLoaded = false;
    this.u04Manifest = null;
    if (this.u04LandscapeMode) { view.setDesignResolutionSize(720,1280,ResolutionPolicy.FIXED_WIDTH); this.u04LandscapeMode=false; }
    this.touristState?.detach();
    this.touristState = null;
    for (const item of this.overviewTourists) item.state.detach();
    this.overviewTourists = [];
    input.off(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.off(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    this.closeOverviewClipboardFallback();
    view.off('canvas-resize', this.layoutScene, this);
    view.off('design-resolution-changed', this.layoutScene, this);
  }

  protected update(deltaTime: number): void {
    this.touristState?.tick(deltaTime * 1000);
    if (this.overviewScene?.activeInHierarchy) this.updateOverview(deltaTime * 1000);
  }

  private makeNode(name: string, parent: Node, width = 1, height = 1, x = 0, y = 0): Node {
    const node = new Node(name);
    parent.addChild(node);
    node.setPosition(x, y);
    node.addComponent(UITransform).setContentSize(width, height);
    return node;
  }

  private drawRect(parent: Node, x: number, y: number, width: number, height: number,
    color: Color): Node {
    const node = this.makeNode('Panel', parent, width, height, x, y);
    const graphics = node.addComponent(Graphics);
    this.paintRect(node, graphics, width, height, color);
    return node;
  }

  private paintRect(node: Node, graphics: Graphics, width: number, height: number,
    color: Color): void {
    node.getComponent(UITransform)!.setContentSize(width, height);
    graphics.clear();
    graphics.fillColor = color;
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.fill();
    graphics.strokeColor = BLUE;
    graphics.lineWidth = 2;
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.stroke();
  }

  private label(parent: Node, value: string, x: number, y: number, size: number,
    color: Color, width = 660, height = 58): Label {
    const node = this.makeNode('Text', parent, width, height, x, y);
    const label = node.addComponent(Label);
    label.string = value;
    label.fontSize = size;
    label.lineHeight = size + 8;
    label.color = color;
    label.overflow = Label.Overflow.SHRINK;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    return label;
  }

  private button(parent: Node, value: string, x: number, y: number,
    width: number, height: number, onTouch?: () => void, pressFeedback = false): Node {
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
      this.buttonMouseActions.set(node, onTouch);
      if (pressFeedback) {
        node.on(Node.EventType.TOUCH_START, () => this.paintButtonState(node, 'pressed'));
        node.on(Node.EventType.TOUCH_CANCEL, () => this.paintButtonState(node, 'normal'));
      }
      node.on(Node.EventType.TOUCH_END, (event) => {
        event.propagationStopped = true;
        if (pressFeedback) this.paintButtonState(node, 'normal');
        if (this.u04Sweep.active && this.u04Controls.includes(node) && node !== this.u04Back) return;
        onTouch();
      });
    }
    return node;
  }

  private paintButtonState(node: Node, state: 'normal' | 'pressed' | 'disabled'): void {
    if (!node.isValid) return;
    if (state !== 'disabled' && this.disabledControls.has(node)) state = 'disabled';
    const graphics = node.getComponent(Graphics);
    const size = node.getComponent(UITransform)?.contentSize;
    if (!graphics || !size) return;
    graphics.clear();
    graphics.fillColor = state === 'pressed' ? BLUE : PANEL;
    graphics.roundRect(-size.width / 2, -size.height / 2, size.width, size.height, 12);
    graphics.fill();
    graphics.strokeColor = state === 'disabled' ? MUTED : BLUE;
    graphics.lineWidth = state === 'disabled' ? 1 : 2;
    graphics.roundRect(-size.width / 2, -size.height / 2, size.width, size.height, 12);
    graphics.stroke();
    const label = node.getChildByName('Text')?.getComponent(Label);
    if (label) label.color = state === 'disabled' ? MUTED : TEXT;
  }

  private setButtonEnabled(node: Node, enabled: boolean): void {
    if (enabled) this.disabledControls.delete(node);
    else this.disabledControls.add(node);
    this.paintButtonState(node, enabled ? 'normal' : 'disabled');
  }

  private disabledButton(parent: Node, value: string, x: number, y: number,
    width: number, height: number): void {
    const node = this.makeNode(`Disabled_${value}`, parent, width, height, x, y);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = PANEL;
    graphics.roundRect(-width / 2, -height / 2, width, height, 12);
    graphics.fill();
    graphics.strokeColor = MUTED;
    graphics.lineWidth = 1;
    graphics.roundRect(-width / 2, -height / 2, width, height, 12);
    graphics.stroke();
    this.label(node, value, 0, 0, Math.min(22, height * 0.4), MUTED, width - 12, height - 8);
  }

  private clearPage(): void {
    this.restoreOverviewProfiler();
    for (const item of this.overviewTourists) item.state.detach();
    this.overviewTourists = [];
    this.disabledControls.clear();
    this.buttonMouseActions.clear();
    this.shopGeneration++;
    this.releaseU04Page();
    this.shopStage = this.shopArtwork = this.shopTitle = null;
    this.shopIdentity = this.shopStatus = null;
    this.shopPrevious = this.shopNext = this.shopBack = this.shopRetry = this.shopErrorPanel = null;
    this.shopPanelMessage = null;
    this.presentedIndex = this.failedTarget = null;
    this.desiredIndex = 0;
    this.touristState?.detach();
    this.touristState = null;
    this.touristView = null;
    this.touristAdapter = null;
    this.touristActionButtons = {};
    this.touristSlotButtons = {};
    this.touristFacingButtons = {};
    if (this.page && this.page.isValid) this.page.destroy();
    this.page = this.makeNode('Page', this.root, 720, 1280);
    this.pageEpoch++;
    this.menuEntries = [];
    this.menuMouseDown = null;
    this.menuContent = null;
    this.menuTitle = null;
    this.menuCards = [];
    this.touristNavBack = null;
    this.touristNavTitle = null;
    this.touristNavReset = null;
    this.touristStage = null;
    this.touristStagePanel = null;
    this.touristStatus = null;
    this.touristAdornment = null;
    this.touristTrayViewport = null;
    this.touristTrayBackground = null;
    this.touristTrayContent = null;
    this.touristScrollOffset = 0;
    this.touristMaxScroll = 0;
    this.touristTouchY = null;
    this.touristTouchStartY = null;
    this.touristMouseY = null;
    this.touristMouseStartY = null;
    this.touristScrollGesture = false;
    this.sceneViewport = null;
    this.sceneControls = null;
    this.sceneBack = null;
    this.overviewScene = null;
    this.overviewShops = null;
    this.overviewShopNodes = [];
    this.overviewShopFootpoints = [];
    this.overviewShopSelectedIndex = 0;
    this.overviewShopStep = 10;
    this.overviewShopScales = [...OVERVIEW_SHOP_BASELINE_SCALES];
    this.overviewTouristScales = [];
    this.overviewScaleStep = 0.02;
    this.overviewAdjustTarget = 'shops';
    this.overviewShopAdjustToggle = null;
    this.overviewShopAdjustPanel = null;
    this.overviewShopNameLabel = null;
    this.overviewShopXLabel = null;
    this.overviewShopYLabel = null;
    this.overviewShopScaleLabel = null;
    this.overviewShopStepLabel = null;
    this.overviewShopFeedback = null;
    this.closeOverviewClipboardFallback();
    this.overviewBackgroundLayers = [];
    this.overviewController = null;
    this.overviewGroupButtons = {};
    this.overviewGroupVisible = { street: true, tourists: true, shops: true };
    this.overviewTouristsVisible = true;
    this.overviewShopsVisible = true;
    this.overviewCountLabel = null;
  }

  private openMenu(): void {
    if (this.u04LandscapeMode) { view.setDesignResolutionSize(720,1280,ResolutionPolicy.FIXED_WIDTH); this.u04LandscapeMode=false; }
    this.clearPage();
    this.menuContent = this.makeNode('MenuContent', this.page);
    this.menuTitle = this.makeNode('MenuTitle', this.menuContent, 660, 68);
    this.label(this.menuTitle, '单元示例', 0, 0, 42, GOLD);
    const overviewReady = !!this.streetBasePrefab && !!this.touristPrefab && this.shopPrefabs.length === 6
      && !!this.touristFrameManifest?.json && !!this.touristMountManifest?.json
      && !!this.touristAccessoryManifest?.json && this.touristBodyFrames.length === 40;
    this.menuCards.push(this.menuCard('U00', '夜市总览',
      overviewReady ? '同屏查看街景、顾客与六间店铺。' : '组合资源未就绪',
      () => this.openOverview(), overviewReady));
    this.menuCards.push(this.menuCard('U01', '五层场景镜头',
      '查看五层场景视差，拖动、缩放并重置镜头。', () => this.openUnit()));
    this.menuCards.push(this.menuCard('U02', '游客动作与装扮',
      '查看游客的动作、左右朝向与独立装扮。', () => this.openTourist()));
    const shopsReady = this.shopPrefabs.length === 6 &&
      this.shopPrefabs.every((prefab, index) => this.validShopPrefab(prefab, index));
    this.menuCards.push(this.menuCard('U03', '六店店铺',
      shopsReady ? '查看六间店铺，并循环切换。' : '资源未就绪',
      () => this.openShops(), shopsReady));
    this.menuCards.push(this.menuCard('U04', '店长对话',
      '切换店长、魂阶段与表情，查看分层对话。', () => this.openDialogue()));
    this.layoutScene();
  }

  private menuCard(id: string, name: string, purpose: string, open: () => void,
    enabled = true): Node {
    const card = this.makeNode(`MenuCard_${id}`, this.menuContent!, 610, 210);
    this.drawRect(card, 0, 0, 610, 210, PANEL);
    this.label(card, `${id} ${name}`, 0, 55, 31, GOLD, 570, 46);
    this.label(card, purpose, 0, 4, 19, TEXT, 566, 50);
    const epoch = this.pageEpoch;
    let entry!: Node;
    if (enabled) {
      entry = this.button(card, `进入 ${id}`, 0, -68, 250, 58,
        () => this.activateMenuEntry(entry, epoch));
      this.menuEntries.push({ node: entry, open });
    } else {
      this.disabledButton(card, '资源未就绪', 0, -68, 250, 58);
    }
    return card;
  }

  private activateMenuEntry(node: Node, epoch: number): void {
    if (epoch !== this.pageEpoch || !node.isValid) return;
    const entry = this.menuEntries.find(candidate => candidate.node === node);
    if (!entry) return;
    this.menuEntries = [];
    this.menuMouseDown = null;
    entry.open();
  }

  private shopLabel(index: number): string {
    return `${String(index + 1).padStart(2, '0')}/06 ${SHOP_NAMES[index]}`;
  }

  private validShopPrefab(prefab: Prefab | null | undefined, index: number): boolean {
    if (!prefab?.isValid || !prefab.data || prefab.data.name !== SHOP_PREFAB_NAMES[index]) return false;
    const body = prefab.data.getChildByName('body');
    const sign = prefab.data.getChildByName('sign');
    return !!prefab.data.getChildByName('ground_contact') &&
      !!body?.getComponent(Sprite)?.spriteFrame?.isValid &&
      !!sign?.getComponent(Sprite)?.spriteFrame?.isValid;
  }

  private openShops(): void {
    this.clearPage();
    const epoch = this.pageEpoch;
    this.shopBack = this.button(this.page, '返回菜单', -260, 0, 160, 64,
      () => { if (epoch === this.pageEpoch) this.openMenu(); }, true);
    this.shopTitle = this.label(this.page, 'U03 店铺示例', 0, 0, 33, GOLD, 360, 58).node;
    this.shopStage = this.makeNode('U03ShopStage', this.page, 620, 820);
    this.shopErrorPanel = this.drawRect(this.shopStage, 0, 0, 490, 180, PANEL);
    this.shopPanelMessage = this.label(this.shopErrorPanel, '01 奶茶店正在加载',
      0, 0, 22, TEXT, 450, 110);
    this.shopIdentity = this.label(this.page, '', 0, 0, 31, GOLD, 580, 56);
    this.shopStatus = this.label(this.page, '', 0, 0, 21, TEXT, 620, 52);
    this.shopPrevious = this.button(this.page, '上一店', -150, 0, 220, 88,
      () => this.moveShop(-1, epoch), true);
    this.shopNext = this.button(this.page, '下一店', 150, 0, 220, 88,
      () => this.moveShop(1, epoch), true);
    this.shopRetry = this.button(this.page, '重试', 0, 0, 180, 70,
      () => { if (this.failedTarget !== null) this.requestShop(this.failedTarget, epoch); }, true);
    this.shopRetry.active = false;
    this.setButtonEnabled(this.shopPrevious, false);
    this.setButtonEnabled(this.shopNext, false);
    this.presentedIndex = null;
    this.desiredIndex = 0;
    this.layoutScene();
    this.requestShop(0, epoch);
  }

  private moveShop(step: number, epoch: number): void {
    if (epoch !== this.pageEpoch || this.presentedIndex === null ||
        this.disabledControls.has(step < 0 ? this.shopPrevious! : this.shopNext!)) return;
    this.failedTarget = null;
    this.desiredIndex = (this.desiredIndex + step + 6) % 6;
    this.requestShop(this.desiredIndex, epoch);
  }

  private requestShop(target: number, epoch: number): void {
    const generation = ++this.shopGeneration;
    this.desiredIndex = target;
    this.failedTarget = null;
    if (this.shopRetry) this.shopRetry.active = false;
    if (this.shopErrorPanel) this.shopErrorPanel.active = this.presentedIndex === null;
    if (this.shopPanelMessage && this.presentedIndex === null)
      this.shopPanelMessage.string = `${this.shopLabel(target)} 正在加载`;
    if (this.presentedIndex === target) {
      if (this.shopStatus) this.shopStatus.string = '';
      return;
    }
    if (this.shopStatus) this.shopStatus.string = `正在切换至 ${this.shopLabel(target)}`;
    const requestAt = performance.now();
    console.info('U03_SHOP request', { targetId: SHOP_IDS[target], generation, requestAt });
    // Queue the commit, including strong-reference assets, behind the same
    // generation boundary used by an eventual asynchronous loader.
    Promise.resolve().then(() => {
      if (epoch !== this.pageEpoch || generation !== this.shopGeneration || !this.shopStage?.isValid) return;
      const prefab = this.shopPrefabs[target];
      if (!prefab || !prefab.isValid) {
        this.failedTarget = target;
        this.desiredIndex = this.presentedIndex ?? 0;
        this.shopStatus!.string = this.presentedIndex === null
          ? `${this.shopLabel(target)} 加载失败，请重试或返回`
          : `${this.shopLabel(target)} 暂不可用，仍显示 ${this.shopLabel(this.presentedIndex)}`;
        if (this.shopPanelMessage) this.shopPanelMessage.string = '店铺资源暂不可用，请重试或返回。';
        if (this.shopErrorPanel) this.shopErrorPanel.active = this.presentedIndex === null;
        this.shopRetry!.active = true;
        console.error('U03_SHOP missing asset', { targetId: SHOP_IDS[target], generation });
        return;
      }
      const candidate = instantiate(prefab);
      candidate.active = false;
      // Creator synchronizes serialized prefab root names with the asset file.
      // Assign the approved shop identity on the live top-level instance.
      candidate.name = SHOP_IDS[target];
      const body = candidate.getChildByName('body');
      const sign = candidate.getChildByName('sign');
      const readyAt = performance.now();
      if (candidate.name !== SHOP_IDS[target] || !body || !sign ||
          !candidate.getChildByName('ground_contact') ||
          !body.getComponent(Sprite)?.spriteFrame || !sign.getComponent(Sprite)?.spriteFrame) {
        candidate.destroy();
        this.failedTarget = target;
        this.desiredIndex = this.presentedIndex ?? 0;
        this.shopStatus!.string = this.presentedIndex === null
          ? `${this.shopLabel(target)} 结构异常，请重试或返回`
          : `${this.shopLabel(target)} 结构异常，仍显示 ${this.shopLabel(this.presentedIndex)}`;
        if (this.shopPanelMessage) this.shopPanelMessage.string = '店铺结构异常，请重试或返回。';
        if (this.shopErrorPanel) this.shopErrorPanel.active = this.presentedIndex === null;
        this.shopRetry!.active = true;
        console.error('U03_SHOP structure', { targetId: SHOP_IDS[target], generation });
        return;
      }
      const validatedAt = performance.now();
      this.shopStage!.addChild(candidate);
      const stageSize = this.shopStage!.getComponent(UITransform)!.contentSize;
      const shopScale = Math.min(stageSize.width, stageSize.height) / 1024;
      candidate.setScale(shopScale, shopScale, 1);
      const previous = this.shopArtwork;
      if (previous?.isValid) previous.active = false;
      candidate.active = true;
      this.shopArtwork = candidate;
      this.presentedIndex = target;
      this.desiredIndex = target;
      this.shopIdentity!.string = this.shopLabel(target);
      this.shopStatus!.string = '';
      if (this.shopErrorPanel) this.shopErrorPanel.active = false;
      this.setButtonEnabled(this.shopPrevious!, true);
      this.setButtonEnabled(this.shopNext!, true);
      previous?.destroy();
      const commitAt = performance.now();
      console.info('U03_SHOP commit', { targetId: SHOP_IDS[target], generation,
        requestAt, readyAt, validatedAt, commitAt });
      director.once(Director.EVENT_AFTER_DRAW, () => {
        if (epoch !== this.pageEpoch || generation !== this.shopGeneration ||
            this.presentedIndex !== target || !candidate.isValid) return;
        const presentedFrameAt = performance.now();
        console.info('U03_SHOP presented frame', { targetId: SHOP_IDS[target], generation,
          requestAt, readyAt, validatedAt, commitAt, presentedFrameAt,
          elapsedMs: presentedFrameAt - requestAt });
      });
    });
  }

  private openTourist(): void {
    this.clearPage();
    const epoch = this.pageEpoch;
    this.touristState = new TouristStateController();
    this.touristNavBack = this.button(this.page, '返回菜单', -265, 0, 150, 62,
      () => { if (epoch === this.pageEpoch) this.openMenu(); });
    this.touristNavTitle = this.label(this.page, 'U02 游客动作与装扮', 0, 0, 31, GOLD, 340, 60).node;
    this.touristNavReset = this.button(this.page, '重置', 285, 0, 110, 62,
      () => { if (epoch === this.pageEpoch) this.touristState?.reset(); });

    const stage = this.makeNode('TouristStage', this.page, 590, 520);
    this.touristStage = stage;
    this.touristStagePanel = this.drawRect(stage, 0, 0, 590, 520, PANEL);

    if (this.touristPrefab) {
      const tourist = instantiate(this.touristPrefab);
      tourist.name = 'UG_GHOST_01';
      stage.addChild(tourist);
      this.touristView = new TouristView(tourist);
    } else {
      this.label(stage, '游客预制体不可用', 0, 0, 23, TEXT, 530, 60);
    }

    const status = this.label(this.page, '', 0, 0, 19, TEXT, 660, 32);
    const adornment = this.label(this.page, '', 0, 0, 17, MUTED, 660, 32);
    this.touristStatus = status.node;
    this.touristAdornment = adornment.node;

    const tray = this.makeNode('TouristControlsViewport', this.page, 610, 510);
    this.touristTrayViewport = tray;
    tray.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
    this.touristTrayBackground = this.drawRect(tray, 0, 0, 610, 510, PANEL);
    const controls = this.makeNode('TouristControlsContent', tray, 610, 510);
    this.touristTrayContent = controls;
    this.label(controls, '动作（点击播放，可滑动）', 0, -24, 20, TEXT, 580, 36);
    const action = (key: TouristAction, name: string, x: number, y: number): void => {
      this.touristActionButtons[key] = this.button(controls, name, x, y, 270, 60,
        () => { if (!this.touristScrollGesture) this.touristState?.selectAction(key); });
    };
    action('walk', '走路', -150, -82);
    action('run', '跑步', 150, -82);
    action('happy', '原地高兴', -150, -152);
    action('sad', '原地沮丧', 150, -152);
    this.label(controls, '独立挂载（点击穿戴或卸下）', 0, -213, 20, TEXT, 580, 36);
    const slot = (key: TouristSlot, id: string, name: string, y: number): void => {
      this.touristSlotButtons[key] = this.button(controls, name, 0, y, 590, 48, () => {
        if (this.touristScrollGesture) return;
        if (!this.touristAdapter?.availableAccessory(key)) return;
        const current = this.touristState?.snapshot().slots[key];
        this.touristState?.setSlot(key, current === id ? null : id);
      });
    };
    slot('hat', 'UG_ACC_HAT_01', '帽子：无', -260);
    slot('glasses', 'UG_ACC_GLASSES_01', '眼镜：无', -316);
    slot('wristband', 'UG_ACC_WRISTBAND_01', '手环：无', -372);
    this.label(controls, '朝向', 0, -416, 19, TEXT, 580, 32);
    this.touristFacingButtons.left = this.button(controls, '向左', -150, -466, 270, 48,
      () => { if (!this.touristScrollGesture) this.touristState?.setFacing('left'); });
    this.touristFacingButtons.right = this.button(controls, '向右', 150, -466, 270, 48,
      () => { if (!this.touristScrollGesture) this.touristState?.setFacing('right'); });
    tray.on(Node.EventType.TOUCH_START, this.onTouristTouchStart, this);
    tray.on(Node.EventType.TOUCH_MOVE, this.onTouristTouchMove, this);
    tray.on(Node.EventType.TOUCH_END, this.onTouristTouchEnd, this);
    tray.on(Node.EventType.TOUCH_CANCEL, this.onTouristTouchEnd, this);
    tray.on(Node.EventType.MOUSE_DOWN, this.onTouristMouseDown, this);
    tray.on(Node.EventType.MOUSE_MOVE, this.onTouristMouseMove, this);
    tray.on(Node.EventType.MOUSE_UP, this.onTouristMouseUp, this);
    tray.on(Node.EventType.MOUSE_LEAVE, this.onTouristMouseUp, this);
    tray.on(Node.EventType.MOUSE_WHEEL, this.onTouristMouseWheel, this);
    this.touristState.onChange(state => {
      if (epoch !== this.pageEpoch) return;
      const names: Record<TouristAction, string> = {
        walk: '走路', run: '跑步', happy: '原地高兴', sad: '原地沮丧',
      };
      const phase = state.phase === 'initial' ? '静止'
        : state.phase === 'holding' ? '保持中' : '播放中';
      status.string = state.error ?? (state.ready
        ? `动作：${state.action ? names[state.action] : '未选择'} · ${phase} · 朝向：${state.facing === 'right' ? '右' : '左'} · 帧 ${state.frameIndex + 1}`
        : '正式游客资源不可用');
      adornment.string = `帽：${state.slots.hat ?? '无'}  眼镜：${state.slots.glasses ?? '无'}  手环：${state.slots.wristband ?? '无'}`;
      for (const key of ['walk', 'run', 'happy', 'sad'] as TouristAction[]) {
        this.setTouristButtonText(this.touristActionButtons[key],
          `${state.action === key ? '● ' : ''}${names[key]}`);
      }
      this.setTouristButtonText(this.touristSlotButtons.hat,
        `帽子：${this.touristAdapter?.availableAccessory('hat') ?
          (state.slots.hat ?? '无') : '不可用'}`);
      this.setTouristButtonText(this.touristSlotButtons.glasses,
        `眼镜：${this.touristAdapter?.availableAccessory('glasses') ?
          (state.slots.glasses ?? '无') : '不可用'}`);
      this.setTouristButtonText(this.touristSlotButtons.wristband,
        `手环：${this.touristAdapter?.availableAccessory('wristband') ?
          (state.slots.wristband ?? '无') : '不可用'}`);
      this.setTouristButtonText(this.touristFacingButtons.left,
        `${state.facing === 'left' ? '● ' : ''}向左`);
      this.setTouristButtonText(this.touristFacingButtons.right,
        `${state.facing === 'right' ? '● ' : ''}向右`);
    });
    if (this.touristView && this.touristFrameManifest && this.touristMountManifest
      && this.touristAccessoryManifest) {
      const adapter = new ApprovedTouristAdapter(
        this.touristView,
        this.touristFrameManifest.json as TouristFrameManifest,
        this.touristMountManifest.json as TouristMountManifest,
        this.touristAccessoryManifest.json as TouristAccessoryManifest,
        this.touristBodyFrames,
        this.touristAccessoryFrames,
      );
      this.touristAdapter = adapter;
      const attached = this.touristState.attach(adapter);
      if (!attached) console.error('[U02] initial adapter attach failed '
        + JSON.stringify({ adapter: adapter.diagnostic(), scene: {
          prefab: this.touristPrefab?.name,
          bodyArrayLength: this.touristBodyFrames.length,
          bodyNonNull: this.touristBodyFrames.filter(Boolean).length,
          accessoryArrayLength: this.touristAccessoryFrames.length,
          accessoryNonNull: this.touristAccessoryFrames.filter(Boolean).length,
          frameJson: !!this.touristFrameManifest.json,
          mountJson: !!this.touristMountManifest.json,
          accessoryJson: !!this.touristAccessoryManifest.json,
        } }));
    }
    this.layoutScene();
  }

  private setTouristButtonText(node: Node | undefined, value: string): void {
    const label = node?.getChildByName('Text')?.getComponent(Label);
    if (label) label.string = value;
  }

  private u04Key(): string {
    return `${U04_MANAGERS[this.u04Manager].key}_s${U04_STAGES[this.u04Stage]}`.toUpperCase();
  }

  private u04Path(layer: 'base' | 'front' | 'face', expression = this.u04Expression): string {
    const key = this.u04Key().toLowerCase();
    const expr = U04_EXPRESSIONS[expression].key;
    return layer === 'face'
      ? `faces/tex_u04_${key}_face_${expr}`
      : `portraits/tex_u04_${key}_${layer === 'base' ? 'base' : 'front'}`;
  }

  private ensureU04Bundle(onReady?: (bundle: any | null) => void): void {
    if (this.u04Bundle) { onReady?.(this.u04Bundle); return; }
    if (onReady) this.u04BundleWaiters.push(onReady);
    if (this.u04BundleLoading) return;
    this.u04BundleLoading = true;
    assetManager.loadBundle('dialogue', (error, bundle) => {
      this.u04BundleLoading = false;
      this.u04Bundle = !error && bundle ? bundle : null;
      const pending = this.u04Pending.splice(0);
      pending.forEach(item => {
        const current = item.pageGeneration === this.u04PageGeneration && (!item.selection || item.generation === this.u04Generation);
        if (current && this.u04Bundle) this.acquireU04(item.path, item.apply);
      });
      const waiters = this.u04BundleWaiters.splice(0);
      waiters.forEach(waiter => waiter(this.u04Bundle));
      if (!this.u04Bundle && this.u04Status?.isValid) this.u04Status.string = '对话资源包加载失败';
    });
  }

  private ensureU04Manifest(pageGeneration: number): void {
    if (this.u04Manifest) {
      if (pageGeneration === this.u04PageGeneration && this.u04Portrait?.isValid) this.refreshDialogue();
      return;
    }
    this.u04ManifestWaiters.push(pageGeneration);
    if (this.u04ManifestLoading) return;
    this.u04ManifestLoading = true;
    this.ensureU04Bundle(bundle => {
      if (!bundle) {
        this.u04ManifestLoading = false;
        const waiters = this.u04ManifestWaiters.splice(0);
        if (waiters.includes(this.u04PageGeneration) && this.u04Status?.isValid) this.u04Status.string = '映射资源包加载失败';
        return;
      }
      bundle.load('u04_layer_export_map', JsonAsset, (err: Error | null, asset: JsonAsset) => {
        this.u04ManifestLoading = false;
        const waiters = this.u04ManifestWaiters.splice(0);
        if (err || !asset) {
          if (waiters.includes(this.u04PageGeneration) && this.u04Status?.isValid) this.u04Status.string = '映射资源加载失败';
          return;
        }
        if (!this.isValid) {
          bundle.release('u04_layer_export_map', JsonAsset);
          return;
        }
        if (this.u04Manifest) {
          // Single-flight normally prevents this path; balance an unexpected
          // duplicate load while retaining the one component-lifetime ref.
          bundle.release('u04_layer_export_map', JsonAsset);
        } else {
          this.u04Manifest = asset;
          this.u04ManifestLoaded = true;
        }
        if (waiters.includes(this.u04PageGeneration) && this.u04Portrait?.isValid) this.refreshDialogue();
      });
    });
  }

  private acquireU04(path: string, apply: (frame: SpriteFrame | null) => void): void {
    const cached = this.u04Loaded.get(path);
    const inPortrait = path.startsWith('portraits/') || path.startsWith('faces/');
    (inPortrait ? this.u04SelectionPaths : this.u04PagePaths).add(path);
    if (!this.u04Bundle) {
      this.u04Pending.push({ path, apply, generation: this.u04Generation, pageGeneration: this.u04PageGeneration, selection: inPortrait });
      this.ensureU04Bundle();
      return;
    }
    this.u04RefCounts.set(path, (this.u04RefCounts.get(path) || 0) + 1);
    if (cached?.isValid) { apply(cached); return; }
    let entry = this.u04Inflight.get(path);
    if (!entry) {
      entry = { refs: 0, done: false, frame: null, waiters: [] };
      this.u04Inflight.set(path, entry);
      const request = entry;
      this.u04Bundle.load(`${path}/spriteFrame`, SpriteFrame, (error: Error | null, frame: SpriteFrame) => {
        request.done = true;
        request.frame = !error && frame?.isValid ? frame : null;
        if (request.frame) this.u04Loaded.set(path, request.frame);
        for (const waiter of request.waiters.splice(0)) waiter(request.frame);
        if (request.refs <= 0 && request.frame) this.releaseU04Asset(path);
        else if (!request.frame && request.refs <= 0) this.u04Inflight.delete(path);
      });
    }
    const request = entry;
    request.refs++;
    const generation = this.u04Generation;
    const pageGeneration = this.u04PageGeneration;
    const finish = (frame: SpriteFrame | null) => {
      if (pageGeneration !== this.u04PageGeneration || (inPortrait && generation !== this.u04Generation)) return;
      if (inPortrait && !this.u04Portrait?.isValid) return;
      if (!frame) { if (this.u04Status) this.u04Status.string = '资源加载失败，请切换后重试'; return; }
      apply(frame);
    };
    if (request.done) finish(request.frame);
    else request.waiters.push(finish);
  }

  private releaseU04Asset(path: string): void {
    const entry = this.u04Inflight.get(path);
    if (entry && !entry.done) return;
    const frame = this.u04Loaded.get(path) || entry?.frame;
    if (frame?.isValid) this.u04Bundle?.release(`${path}/spriteFrame`, SpriteFrame);
    this.u04Loaded.delete(path);
    this.u04Inflight.delete(path);
  }

  private releaseU04Ref(path: string): void {
    const count=Math.max(0,(this.u04RefCounts.get(path)||0)-1);
    if(count>0){this.u04RefCounts.set(path,count);return;}
    this.u04RefCounts.delete(path);
    const req=this.u04Inflight.get(path);
    if(req) req.refs=Math.max(0,req.refs-1);
    if(!this.u04RefCounts.has(path)) this.releaseU04Asset(path);
  }

  private releaseU04Selection(): void {
    for (const sprite of this.u04Sprites) {
      if (sprite.isValid && (sprite.node.name === 'U04BaseLayer' || sprite.node.name === 'U04Portrait' || sprite.node.name === 'U04FaceLayer' || sprite.node.name === 'U04FrontLayer')) sprite.spriteFrame = null;
    }
    const paths = Array.from(this.u04SelectionPaths);
    this.u04SelectionPaths.clear();
    for (const path of paths) this.releaseU04Ref(path);
  }

  private releaseU04Page(): void {
    this.u04Generation++;
    this.u04PageGeneration++;
    this.u04Sweep.active = false;
    this.u04Pending=this.u04Pending.filter(item=>item.pageGeneration>=this.u04PageGeneration);
    if ((globalThis as any).__U04_RUNTIME__) (globalThis as any).__U04_RUNTIME__ = { page: 'menu', generation: this.u04Generation, loaded: this.u04Loaded.size, requested: Array.from(this.u04SelectionPaths) };
    for (const sprite of this.u04Sprites) { if (sprite.isValid) sprite.spriteFrame = null; }
    this.u04Sprites = [];
    const paths = Array.from(this.u04PagePaths);
    this.u04PagePaths.clear();
    for (const path of paths) this.releaseU04Ref(path);
    this.releaseU04Selection();
    this.u04Portrait = this.u04BaseNode = this.u04Face = this.u04Front = null;
    this.u04Name = this.u04Status = null;
    this.u04Title = null;
    this.u04Panel = null;
    this.u04Back = null;
    this.u04Controls = [];
    this.u04ResizeButtons = [];
    this.u04SweepButton = null;
  }

  private openDialogue(): void {
    this.clearPage();
    view.setDesignResolutionSize(1280,720,ResolutionPolicy.FIXED_WIDTH); this.u04LandscapeMode=true;
    this.u04Manager = 0; this.u04Stage = 0; this.u04Expression = 3;
    this.u04PanelSizeIndex = 3;
    this.u04PanelWidth = 1;
    const visible = view.getVisibleSize();
    const stage = this.makeNode('U04DialogueScene', this.page, visible.width, visible.height);
    if (!this.streetBasePrefab) {
      this.label(stage, 'U00背景资源不可用', 0, 0, 22, TEXT);
      return;
    }
    const background = instantiate(this.streetBasePrefab);
    background.name = 'U00StreetBase';
    stage.addChild(background);
    const entities=this.makeNode('U04_U00ShopLayout',background,3072,1024); entities.setSiblingIndex(3);
    const shopPositions=[[-1079,-234],[-780,-260],[-410,-235],[350,-237],[689,-249],[1030,-249]];
    this.shopPrefabs.forEach((prefab,i)=>{if(!prefab)return;const shop=instantiate(prefab);shop.name=`U00Shop_${i+1}`;entities.addChild(shop);const scale=0.34;shop.setScale(scale,scale,1);const contactY=shop.getChildByName('ground_contact')?.position.y??-388;shop.setPosition(shopPositions[i][0],shopPositions[i][1]-contactY*scale,0);});
    const backgroundLayers=['L01_Sky','L02_Mountains','L03_Ground','L04_WaterBridge','L05_WaterGrass'].map(name=>background.getChildByName(name)).filter((node):node is Node=>!!node);
    const cover = this.makeNode('U04BackgroundDim', stage, visible.width, visible.height);
    const dim = cover.addComponent(Graphics); dim.fillColor = new Color(5, 10, 18, 125); dim.rect(-visible.width/2,-visible.height/2,visible.width,visible.height); dim.fill();
    this.overviewProfilerWasShowing = profiler.isShowingStats();
    profiler.hideStats();
    const controls = this.makeNode('U04Controls', stage, visible.width, 120);
    this.u04Controls = [];
    this.u04Back = this.button(controls, '返回菜单', 0, 0, 160, 56,
      () => this.openMenu(), true);
    this.u04Controls.push(this.u04Back);
    this.u04Title = this.label(controls, 'U04 店长对话', 0, 0, 28, GOLD, 300, 52);
    const sweepButton = this.button(controls, '巡检90组', 0, 0, 150, 50, () => this.startU04Sweep(), true);
    this.u04SweepButton = sweepButton;
    this.u04Controls.push(sweepButton);
    const shrinkPanel = this.button(stage, '缩小面板', 520, 168, 64, 40, () => { this.u04PanelSizeIndex=(this.u04PanelSizeIndex+U04_PANEL_SIZES.length-1)%U04_PANEL_SIZES.length; this.layoutDialogue(view.getVisibleSize()); }, true);
    const growPanel = this.button(stage, '放大面板', 590, 168, 64, 40, () => { this.u04PanelSizeIndex=(this.u04PanelSizeIndex+1)%U04_PANEL_SIZES.length; this.layoutDialogue(view.getVisibleSize()); }, true);
    this.u04Controls.push(shrinkPanel,growPanel);
    this.u04ResizeButtons = [shrinkPanel,growPanel];
    this.u04Portrait = this.makeNode('U04Portrait', stage, 1024, 1536);
    this.u04BaseNode = this.makeNode('U04BaseLayer', this.u04Portrait, 1024, 1536);
    const portraitMask = this.makeNode('U04WaistCrop', stage, 430, 500);
    const mask = portraitMask.addComponent(Mask); mask.type = Mask.Type.GRAPHICS_STENCIL;
    const graphics = portraitMask.getComponent(Graphics)!;
    graphics.fillColor = Color.WHITE; graphics.rect(-215, -250, 430, 500); graphics.fill();
    portraitMask.addChild(this.u04Portrait);
    this.u04Face = this.makeNode('U04FaceLayer', this.u04Portrait, 256, 256);
    this.u04Front = this.makeNode('U04FrontLayer', this.u04Portrait, 256, 256);
    const portraitSprite = this.u04BaseNode.addComponent(Sprite); portraitSprite.sizeMode = Sprite.SizeMode.CUSTOM; this.u04Sprites.push(portraitSprite);
    const faceSprite = this.u04Face.addComponent(Sprite); faceSprite.sizeMode = Sprite.SizeMode.CUSTOM; this.u04Sprites.push(faceSprite);
    const frontSprite = this.u04Front.addComponent(Sprite); frontSprite.sizeMode = Sprite.SizeMode.CUSTOM; this.u04Sprites.push(frontSprite);
    const panelNode = this.makeNode('U04DialoguePanel', stage, 512, 256);
    portraitMask.setSiblingIndex(panelNode.getSiblingIndex()+1);
    shrinkPanel.setSiblingIndex(panelNode.getSiblingIndex()+1);
    growPanel.setSiblingIndex(shrinkPanel.getSiblingIndex()+1);
    this.u04Panel = panelNode.addComponent(Sprite); this.u04Panel.sizeMode = Sprite.SizeMode.CUSTOM; this.u04Panel.type = Sprite.Type.SLICED;
    this.u04Sprites.push(this.u04Panel);
    this.acquireU04('ui/tex_u04_dialogue_panel_9s', (f) => {
      if (this.u04Panel?.isValid) { this.u04Panel.spriteFrame = f; if (f) { f.insetTop=48; f.insetBottom=48; f.insetLeft=48; f.insetRight=48; this.u04Panel!.type=Sprite.Type.SLICED; } }
    });
    const decoA = this.makeNode('U04CornerBottomLeft', stage, 128, 96); const sa=decoA.addComponent(Sprite); this.u04Sprites.push(sa);
    this.acquireU04('ui/tex_u04_dialogue_corner_cloud_bottom_left', f=>{if(sa.isValid)sa.spriteFrame=f;});
    const decoB = this.makeNode('U04CornerTopRight', stage, 128, 96); const sb=decoB.addComponent(Sprite); this.u04Sprites.push(sb);
    this.acquireU04('ui/tex_u04_dialogue_corner_cloud_top_right', f=>{if(sb.isValid)sb.spriteFrame=f;});
    this.u04Name = this.label(stage, '', 0, 0, 28, GOLD, 470, 46);
    this.label(stage, '这里是演示对白文本。', 0, 0, 22, TEXT, 470, 100);
    this.u04Status = this.label(stage, '正在加载店长资源…', 0, 0, 16, MUTED, 620, 34);
    const managerButtons = this.makeNode('U04ManagerControls', stage, 630, 78);
    U04_MANAGERS.forEach((m,i)=>this.u04Controls.push(this.button(managerButtons,m.name,-250+i*100,0,96,64,()=>{this.u04Manager=i;this.refreshDialogue();},true)));
    const stageButtons = this.makeNode('U04StageExpressionControls', stage, 760, 72);
    U04_STAGES.forEach((st,i)=>this.u04Controls.push(this.button(stageButtons,`${st}魂`,-340+i*96,0,88,46,()=>{this.u04Stage=i;this.refreshDialogue();},true)));
    U04_EXPRESSIONS.forEach((e,i)=>this.u04Controls.push(this.button(stageButtons,e.name,-52+i*96,0,88,46,()=>{this.u04Expression=i;this.refreshDialogue();},true)));
    const cameraNode=this.makeNode('U04_U00Camera',this.page); cameraNode.active=false;
    const camera=cameraNode.addComponent(Scene1CameraController); camera.layers=backgroundLayers;
    camera.resetCameraX=-266; camera.synchronizedNodes=[entities]; camera.viewport=stage;
    camera.uiCaptureRoot=null; camera.uiCaptureNodes=this.u04Controls; cameraNode.active=true; camera.reset();
    this.layoutDialogue(visible);
    this.refreshDialogue();
    if (this.u04Manifest) return;
    const pageGeneration = this.u04PageGeneration;
    this.ensureU04Manifest(pageGeneration);
  }

  private refreshDialogue(): void {
    if (!this.u04Portrait?.isValid) return;
    const key = this.u04Key();
    const mapping = ((this.u04Manifest?.json as any)?.stages)?.[key.toUpperCase()];
    if (!mapping) {
      this.u04Sprites.slice(0, 3).forEach(sprite => { if (sprite.isValid) sprite.spriteFrame = null; });
      if (this.u04Status) this.u04Status.string = '正在加载有效的图层映射…';
      this.publishU04Runtime();
      return;
    }
    this.releaseU04Selection();
    const generation = ++this.u04Generation;
    this.u04Name!.string = U04_MANAGERS[this.u04Manager].name + ` · ${U04_STAGES[this.u04Stage]}魂`;
    this.u04Status!.string = `${this.u04Key()} / ${U04_EXPRESSIONS[this.u04Expression].name}`;
    this.publishU04Runtime();
    const layout=U04_LAYOUT[key];
    const exportedScale = mapping?.handoff_normalized?.base_source_to_export_scale || 1;
    this.u04Portrait.setScale(layout.scale,layout.scale,1);
    const baseRect: number[] = mapping?.handoff_normalized?.base_source_rect_xyxy || mapping?.base?.source_rect_xyxy || [0,0,1024,1024];
    const baseTransform = this.u04BaseNode!.getComponent(UITransform)!;
    baseTransform.setContentSize(baseRect[2]-baseRect[0],baseRect[3]-baseRect[1]);
    this.u04BaseNode!.setPosition((baseRect[0]+baseRect[2])/2-512,768-(baseRect[1]+baseRect[3])/2,0);
    this.u04Portrait!.setPosition(0,0,0);
    const faceSourceRect: number[] = mapping?.handoff_normalized?.face_source_rect_xyxy || mapping?.face?.source_rect_xyxy || [384,640,640,896];
    const facePivot: number[] = mapping?.handoff_normalized?.face_source_pivot_xy || mapping?.face?.pivot_source_xy || [(faceSourceRect[0]+faceSourceRect[2])/2,(faceSourceRect[1]+faceSourceRect[3])/2];
    const faceSize=this.u04Face!.getComponent(UITransform)!; faceSize.setContentSize(faceSourceRect[2]-faceSourceRect[0],faceSourceRect[3]-faceSourceRect[1]);
    this.u04Face!.setPosition(facePivot[0]-512,768-facePivot[1],0);
    const frontRect: number[] = mapping?.front_hair?.source_rect_xyxy || mapping?.front_occlusion?.source_rect_xyxy || mapping?.handoff_normalized?.front_source_rect_xyxy || [384,640,640,896];
    const frontSize=this.u04Front!.getComponent(UITransform)!; frontSize.setContentSize(frontRect[2]-frontRect[0],frontRect[3]-frontRect[1]);
    this.u04Front!.setPosition((frontRect[0]+frontRect[2])/2-512,768-(frontRect[1]+frontRect[3])/2,0);
    const cropNode = this.u04Portrait.parent!;
    const cropHeight=500;
    this.u04CropWidth=(U04_CROP_EXPORT_WIDTH[key]||430)/exportedScale*layout.scale;
    cropNode.getComponent(UITransform)!.setContentSize(this.u04CropWidth,cropHeight);
    const cropGraphics=cropNode.getComponent(Graphics); if(cropGraphics){cropGraphics.clear();cropGraphics.fillColor=Color.WHITE;cropGraphics.rect(-this.u04CropWidth/2,-cropHeight/2,this.u04CropWidth,cropHeight);cropGraphics.fill();}
    const waistBottom = baseRect[1] + (baseRect[3] - baseRect[1]) * layout.waist;
    this.u04Portrait.setPosition(0, -cropHeight/2 - (768-waistBottom)*layout.scale,0);
    this.layoutDialogue(view.getVisibleSize());
    const trio: Array<SpriteFrame | null> = [null, null, null]; let ready = 0; let failed = false;
    const finish = (index: number) => (frame: SpriteFrame | null) => {
      if (generation !== this.u04Generation) return;
      if (!frame) { failed = true; this.u04Sprites.slice(0, 3).forEach(sprite => sprite.spriteFrame = null); return; }
      trio[index] = frame; ready++;
      if (ready === 3 && !failed) {
        this.u04Sprites.slice(0, 3).forEach((sprite, i) => sprite.spriteFrame = trio[i]);
        this.u04Status!.string = `${key.toUpperCase()} / ${U04_EXPRESSIONS[this.u04Expression].name} · 三层就绪`;
        this.publishU04Runtime();
      }
    };
    this.acquireU04(this.u04Path('base'), finish(0));
    this.acquireU04(this.u04Path('face'), finish(1));
    this.acquireU04(this.u04Path('front'), finish(2));
  }

  private startU04Sweep(): void {
    if (this.u04Sweep.active || !this.u04Portrait?.isValid) return;
    this.u04Sweep = { active: true, checked: 0, total: 90, failed: [], elapsedMs: 0, startedAt: Date.now() };
    this.runU04SweepStep(0);
  }

  private runU04SweepStep(index: number, waitCount = 0, expectedGeneration = -1): void {
    if (!this.u04Sweep.active || !this.u04Portrait?.isValid) return;
    if (waitCount === 0) {
      if (index >= this.u04Sweep.total) {
        this.u04Sweep.active = false;
        this.u04Sweep.elapsedMs = Date.now() - this.u04Sweep.startedAt;
        if (this.u04Status) this.u04Status.string = `巡检完成 ${this.u04Sweep.checked}/90 · ${this.u04Sweep.failed.length}失败 · ${this.u04Sweep.elapsedMs}ms`;
        this.publishU04Runtime();
        return;
      }
      this.u04Manager = Math.floor(index / 15);
      this.u04Stage = Math.floor(index / 5) % 3;
      this.u04Expression = index % 5;
      this.refreshDialogue();
      expectedGeneration = this.u04Generation;
    } else if (expectedGeneration !== this.u04Generation) {
      this.u04Sweep.failed.push(`${this.u04Key()}/${U04_EXPRESSIONS[this.u04Expression].key}:切换代次失效`);
      this.publishU04Runtime();
      this.scheduleOnce(() => this.runU04SweepStep(index + 1), 0);
      return;
    }
    const ready = this.u04Sprites.slice(0, 3).length === 3 && this.u04Sprites.slice(0, 3).every(sprite => sprite.isValid && !!sprite.spriteFrame);
    const expectedKey = this.u04Key().toUpperCase();
    if (ready && this.u04Status?.string.startsWith(`${expectedKey} /`) && this.u04Status.string.includes('三层就绪')) {
      const expectedName = U04_MANAGERS[this.u04Manager].name;
      const currentName = this.u04Name?.string || '';
      if (currentName.startsWith(expectedName)) this.u04Sweep.checked++;
      else this.u04Sweep.failed.push(`${this.u04Key()}/${U04_EXPRESSIONS[this.u04Expression].key}:姓名不一致`);
      this.publishU04Runtime();
      this.scheduleOnce(() => this.runU04SweepStep(index + 1), 0);
      return;
    }
    if (waitCount >= 120) {
      this.u04Sweep.failed.push(`${this.u04Key()}/${U04_EXPRESSIONS[this.u04Expression].key}:三层加载超时`);
      this.publishU04Runtime();
      this.scheduleOnce(() => this.runU04SweepStep(index + 1), 0);
      return;
    }
    this.scheduleOnce(() => this.runU04SweepStep(index, waitCount + 1, expectedGeneration), 0.05);
  }

  private publishU04Runtime(): void {
    (globalThis as any).__U04_RUNTIME__ = {
      page: this.u04Portrait?.isValid ? 'dialogue' : 'menu', manager: U04_MANAGERS[this.u04Manager].key,
      name: U04_MANAGERS[this.u04Manager].name, stage: U04_STAGES[this.u04Stage], expression: U04_EXPRESSIONS[this.u04Expression].key,
      generation: this.u04Generation, pageGeneration: this.u04PageGeneration, loaded: this.u04Loaded.size,
      selectedRefs: Array.from(this.u04SelectionPaths), pageRefs: Array.from(this.u04PagePaths), bundleLoaded: !!this.u04Bundle,
      ready: this.u04Sprites.slice(0, 3).length === 3 && this.u04Sprites.slice(0, 3).every(sprite => sprite.isValid && !!sprite.spriteFrame),
      sweep: { active: this.u04Sweep.active, checked: this.u04Sweep.checked, total: this.u04Sweep.total, failed: this.u04Sweep.failed.slice(), elapsedMs: this.u04Sweep.elapsedMs }
    };
  }

  private layoutDialogue(visible: { width: number; height: number }): void {
    if (!this.u04Portrait?.isValid) return;
    const stage = this.page.getChildByName('U04DialogueScene');
    stage?.getComponent(UITransform)?.setContentSize(visible.width, visible.height);
    const cover = stage?.getChildByName('U04BackgroundDim');
    const coverTransform = cover?.getComponent(UITransform);
    coverTransform?.setContentSize(visible.width, visible.height);
    const coverGraphics = cover?.getComponent(Graphics);
    if (coverGraphics) {
      coverGraphics.clear();
      coverGraphics.fillColor = new Color(5, 10, 18, 125);
      coverGraphics.rect(-visible.width / 2, -visible.height / 2, visible.width, visible.height);
      coverGraphics.fill();
    }
    const top=visible.height/2; const bottom=-visible.height/2;
    const controls=stage?.getChildByName('U04Controls');
    controls?.getComponent(UITransform)?.setContentSize(visible.width, 120);
    controls?.setPosition(0,0,0);
    this.u04Back?.setPosition(-visible.width/2+120,top-48,0);
    this.u04Title?.node.setPosition(0,top-48,0);
    this.u04SweepButton?.setPosition(visible.width/2-115,top-48,0);
    const portraitFactor=Math.min(visible.width/1280,visible.height/720);
    this.u04Portrait.parent?.setPosition(-visible.width*0.305 + (U04_LAYOUT[this.u04Key()].x+25)*portraitFactor, -100*portraitFactor,0);
    this.u04Portrait.parent?.setScale(portraitFactor,portraitFactor,1);
    this.u04Portrait.parent!.getComponent(UITransform)!.setContentSize(this.u04CropWidth,500);
    const panel=this.u04Panel?.node;
    const requestedSize=U04_PANEL_SIZES[this.u04PanelSizeIndex];
    const panelWidth=Math.min(visible.width,requestedSize.width), panelHeight=requestedSize.height;
    panel?.setPosition(0,bottom+panelHeight/2,0);
    panel?.getComponent(UITransform)?.setContentSize(panelWidth,panelHeight);
    const resizeY=bottom+panelHeight-26;
    this.u04ResizeButtons[0]?.setPosition(panelWidth/2-145,resizeY,0);
    this.u04ResizeButtons[1]?.setPosition(panelWidth/2-72,resizeY,0);
    const contentLeft=-panelWidth/2+32;
    const contentRight=panelWidth/2-32;
    const titleRight=Math.min(contentRight,panelWidth/2-145-32-12);
    const titleWidth=Math.max(96,Math.min(470,titleRight-contentLeft));
    const titleX=Math.max(contentLeft+titleWidth/2,Math.min(visible.width*0.10,titleRight-titleWidth/2));
    const name=this.u04Name?.node;
    name?.getComponent(UITransform)?.setContentSize(titleWidth,panelWidth<=400?36:46);
    name?.setPosition(titleX,bottom+panelHeight-45,0);
    if(this.u04Name)this.u04Name.fontSize=panelWidth<=400?18:panelWidth<768?22:28;
    const body=stage?.children.find(n=>n.name==='Text'&&n!==name&&n!==this.u04Status?.node);
    const dialogueWidth=Math.max(96,Math.min(620,panelWidth-64));
    const dialogueX=Math.max(contentLeft+dialogueWidth/2,Math.min(visible.width*0.10,contentRight-dialogueWidth/2));
    body?.getComponent(UITransform)?.setContentSize(dialogueWidth,panelWidth<=400?60:100);
    body?.setPosition(dialogueX,bottom+panelHeight*0.48,0);
    const statusWidth=Math.max(96,Math.min(620,panelWidth-64));
    const statusX=Math.max(contentLeft+statusWidth/2,Math.min(visible.width*0.10,contentRight-statusWidth/2));
    this.u04Status?.node.getComponent(UITransform)?.setContentSize(statusWidth,panelWidth<=400?28:34);
    this.u04Status?.node.setPosition(statusX,bottom+panelHeight*0.17,0);
    if(this.u04Status)this.u04Status.fontSize=panelWidth<=400?13:panelWidth<768?14:16;
    const b1=this.page.getChildByName('U04DialogueScene')?.getChildByName('U04CornerBottomLeft');
    const b2=this.page.getChildByName('U04DialogueScene')?.getChildByName('U04CornerTopRight');
    b1?.setPosition(-panelWidth/2+64,bottom+panelHeight*0.25);
    b2?.setPosition(panelWidth/2-64,bottom+panelHeight*0.75);
    stage?.getChildByName('U04ManagerControls')?.setPosition(visible.width*0.20,bottom+panelHeight+145,0);
    stage?.getChildByName('U04StageExpressionControls')?.setPosition(visible.width*0.20,bottom+panelHeight+75,0);
  }

  private openUnit(): void {
    this.clearPage();
    const visible = view.getVisibleSize();
    const viewport = this.makeNode('Scene1Viewport', this.page, visible.width, visible.height);
    this.sceneViewport = viewport;
    if (!this.streetBasePrefab) {
      this.label(this.page, '五层背景暂不可用，请检查已批准资源导入。',
        0, 0, 20, MUTED, 640, 80);
      return;
    }

    const background = instantiate(this.streetBasePrefab);
    background.name = 'STREET_BASE_01';
    viewport.addChild(background);
    const layerNames = ['L01_Sky', 'L02_Mountains', 'L03_Ground', 'L04_WaterBridge', 'L05_WaterGrass'];
    const layers = layerNames.map(name => background.getChildByName(name))
      .filter((layer): layer is Node => !!layer);
    if (layers.length !== 5) {
      background.destroy();
      this.label(this.page, '五层背景结构异常，请检查 STREET_BASE_01。',
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

  private openOverview(): void {
    this.clearPage();
    this.overviewProfilerWasShowing = profiler.isShowingStats();
    profiler.hideStats();
    this.overviewCount = OVERVIEW_TOURIST_COUNT;
    this.overviewRng = 94721;
    this.overviewScene = this.makeNode('U00OverviewScene', this.page, 720, 1280);
    const background = instantiate(this.streetBasePrefab!);
    background.name = 'U00StreetBase';
    this.overviewScene.addChild(background);
    const layerNames = ['L01_Sky', 'L02_Mountains', 'L03_Ground', 'L04_WaterBridge', 'L05_WaterGrass'];
    this.overviewBackgroundLayers = layerNames.map(name => background.getChildByName(name))
      .filter((layer): layer is Node => !!layer);
    if (this.overviewBackgroundLayers.length !== 5) {
      this.label(this.overviewScene, '五层背景结构异常', 0, 0, 22, TEXT);
      return;
    }

    const foreground = this.makeNode('U00_StreetEntities', background, 3072, 1024);
    foreground.setSiblingIndex(3);
    this.overviewShops = this.makeNode('U00_Shops', foreground, 3072, 1024, 0, 0);
    // Temporary shop-footpoint preview starts from the current user input baseline;
    // leaving this page discards edits and never persists preview adjustments.
    this.overviewShopFootpoints = OVERVIEW_SHOP_BASELINE.map(point => ({ ...point }));
    this.overviewShopNodes = [];
    this.overviewShopSelectedIndex = 0;
    this.overviewShopStep = 10;
    for (let i = 0; i < 6; i++) {
      const shop = instantiate(this.shopPrefabs[i]);
      shop.name = SHOP_IDS[i];
      this.overviewShops.addChild(shop);
      this.overviewShopNodes.push(shop);
      this.applyOverviewShopFootpoint(i);
    }

    const ui = this.makeNode('U00_Controls', this.overviewScene, 720, 1280);
    const top = this.makeNode('U00_TopControls', ui, 680, 86);
    this.button(top, '返回菜单', -250, 0, 150, 58, () => this.openMenu(), true);
    this.label(top, 'U00 夜市总览', 30, 0, 28, GOLD, 220, 54);
    this.overviewShopAdjustToggle = this.button(top, '调节面板', 255, 0, 144, 58,
      () => this.toggleOverviewShopAdjust(), true);
    const toggles = this.makeNode('U00_GroupToggles', ui, 690, 58);
    this.overviewGroupButtons.street = this.overviewToggle(toggles, '街景：显示', -230, 'street');
    this.overviewGroupButtons.tourists = this.overviewToggle(toggles, '顾客：显示', 0, 'tourists');
    this.overviewGroupButtons.shops = this.overviewToggle(toggles, '店铺：显示', 230, 'shops');
    const count = this.makeNode('U00_CountControls', ui, 360, 58);
    this.button(count, '−', -110, 0, 70, 54, () => this.setOverviewCount(this.overviewCount - 1), true);
    this.overviewCountLabel = this.label(count, '顾客 1 / 8', 0, 0, 21, TEXT, 110, 48).node;
    this.button(count, '+', 110, 0, 70, 54, () => this.setOverviewCount(this.overviewCount + 1), true);
    this.buildOverviewShopAdjustPanel(ui);
    const bottom = this.makeNode('U00_CameraControls', ui, 500, 64);
    const zoomOut = this.button(bottom, '−', -170, 0, 76, 58, undefined, true);
    const reset = this.button(bottom, '重置', 0, 0, 140, 58, undefined, true);
    const zoomIn = this.button(bottom, '+', 170, 0, 76, 58, undefined, true);
    this.layoutOverview();

    const controllerNode = this.makeNode('U00SceneCameraController', this.page);
    controllerNode.active = false;
    const controller = controllerNode.addComponent(Scene1CameraController);
    controller.layers = this.overviewBackgroundLayers;
    controller.resetCameraX = -1050;
    controller.synchronizedNodes = [foreground];
    controller.viewport = this.overviewScene;
    controller.uiCaptureRoot = null;
    controller.uiCaptureNodes = this.collectButtons(ui).concat(
      this.overviewShopAdjustPanel ? [this.overviewShopAdjustPanel] : []);
    controller.zoomOutButton = zoomOut;
    controller.zoomInButton = zoomIn;
    controller.resetButton = reset;
    controller.backButton = null;
    controllerNode.active = true;
    controller.reset();
    this.overviewController = controller;
    this.buildOverviewTourists(foreground);
    this.layoutScene();
  }

  private overviewToggle(parent: Node, text: string, x: number, key: 'street' | 'tourists' | 'shops'): Node {
    return this.button(parent, text, x, 0, 210, 52, () => {
      this.overviewGroupVisible[key] = !this.overviewGroupVisible[key];
      if (key === 'street') this.overviewBackgroundLayers.forEach(layer => layer.active = this.overviewGroupVisible.street);
      else if (key === 'tourists') {
        this.overviewTouristsVisible = this.overviewGroupVisible.tourists;
        this.overviewTourists.forEach(item => item.root.active = this.overviewTouristsVisible);
      } else if (this.overviewShops) {
        this.overviewShopsVisible = this.overviewGroupVisible.shops;
        this.overviewShops.active = this.overviewShopsVisible;
      }
      const name = key === 'street' ? '街景' : key === 'tourists' ? '顾客' : '店铺';
      this.setTouristButtonText(this.overviewGroupButtons[key], `${name}：${this.overviewGroupVisible[key] ? '显示' : '隐藏'}`);
    }, true);
  }

  private buildOverviewShopAdjustPanel(parent: Node): void {
    const panel = this.drawRect(parent, 0, 0, 672, 570, PANEL);
    panel.name = 'U00_ShopAdjustPanel';
    panel.active = false;
    this.overviewShopAdjustPanel = panel;
    this.label(panel, '临时调整预览 · 离开 U00 后恢复初始值', 0, 205, 19, GOLD, 630, 36);
    this.button(panel, '店铺', -90, 165, 130, 40,
      () => this.setOverviewAdjustTarget('shops'), true);
    this.button(panel, '顾客', 90, 165, 130, 40,
      () => this.setOverviewAdjustTarget('tourists'), true);
    this.button(panel, '上一项', -250, 112, 104, 44,
      () => this.selectOverviewShop(-1), true);
    this.overviewShopNameLabel = this.label(panel, '', 0, 125, 19, TEXT, 260, 42).node;
    this.button(panel, '下一项', 250, 112, 104, 44,
      () => this.selectOverviewShop(1), true);
    this.button(panel, 'X −', -250, 62, 104, 44,
      () => this.adjustOverviewShop('x', -1), true);
    this.overviewShopXLabel = this.label(panel, '', 0, 62, 20, TEXT, 260, 42).node;
    this.button(panel, 'X +', 250, 62, 104, 44,
      () => this.adjustOverviewShop('x', 1), true);
    this.button(panel, 'Y −', -250, 13, 104, 44,
      () => this.adjustOverviewShop('y', -1), true);
    this.overviewShopYLabel = this.label(panel, '', 0, 13, 20, TEXT, 260, 42).node;
    this.button(panel, 'Y +', 250, 13, 104, 44,
      () => this.adjustOverviewShop('y', 1), true);
    this.button(panel, '步长 1', -180, -25, 110, 42,
      () => this.setOverviewShopStep(1), true);
    this.button(panel, '步长 10', 0, -25, 110, 42,
      () => this.setOverviewShopStep(10), true);
    this.button(panel, '步长 50', 180, -25, 110, 42,
      () => this.setOverviewShopStep(50), true);
    this.button(panel, '缩放 −', -250, -43, 104, 42, () => this.adjustOverviewScale(-1), true);
    this.overviewShopScaleLabel = this.label(panel, '', 0, -43, 20, TEXT, 260, 42).node;
    this.button(panel, '缩放 +', 250, -43, 104, 42, () => this.adjustOverviewScale(1), true);
    this.button(panel, '恢复初始值', -160, -112, 200, 42,
      () => this.restoreOverviewAdjustments(), true);
    this.button(panel, '复制全部参数', 160, -112, 200, 42,
      () => { void this.copyOverviewShopParameters(); }, true);
    this.overviewShopStepLabel = this.label(panel, '坐标步长：10 · 缩放步长：0.02', 0, -75, 16, MUTED, 420, 30).node;
    this.overviewShopFeedback = this.label(panel, '调整只在本次页面预览；离开后恢复初始值。',
      0, -165, 15, MUTED, 640, 30).node;
    this.updateOverviewShopAdjustPanel();
  }

  private toggleOverviewShopAdjust(): void {
    if (!this.overviewShopAdjustPanel) return;
    this.overviewShopAdjustPanel.active = !this.overviewShopAdjustPanel.active;
    this.setTouristButtonText(this.overviewShopAdjustToggle,
      this.overviewShopAdjustPanel.active ? '收起面板' : '调节面板');
    if (this.overviewShopAdjustPanel.active) this.focusOverviewShop();
  }

  private selectOverviewShop(delta: number): void {
    const count = this.overviewAdjustTarget === 'tourists' ? Math.max(1, this.overviewTourists.length) : SHOP_IDS.length;
    this.overviewShopSelectedIndex = (this.overviewShopSelectedIndex + delta + count) % count;
    this.updateOverviewShopAdjustPanel();
    this.focusOverviewShop();
  }

  private setOverviewAdjustTarget(target: 'shops' | 'tourists'): void {
    this.overviewAdjustTarget = target;
    const count = target === 'tourists' ? this.overviewTourists.length : SHOP_IDS.length;
    this.overviewShopSelectedIndex = Math.min(this.overviewShopSelectedIndex, Math.max(0, count - 1));
    this.updateOverviewShopAdjustPanel();
  }

  private adjustOverviewShop(axis: 'x' | 'y', direction: number): void {
    const point = this.overviewShopFootpoints[this.overviewShopSelectedIndex] ?? this.overviewShopFootpoints[0];
    if (!point) return;
    const limit = axis === 'x' ? 1536 : 512;
    const key = axis;
    point[key] = Math.max(-limit, Math.min(limit, point[key] + direction * this.overviewShopStep));
    this.applyOverviewShopFootpoint(this.overviewShopSelectedIndex);
    this.updateOverviewShopAdjustPanel();
    if (axis === 'x') this.focusOverviewShop();
  }

  private setOverviewShopStep(step: number): void {
    if (![1, 10, 50].includes(step)) return;
    this.overviewShopStep = step;
    this.updateOverviewShopAdjustPanel();
    this.setOverviewShopFeedback(`当前调节步长：${step} 源坐标像素。`);
  }

  private adjustOverviewScale(direction: number): void {
    if (this.overviewAdjustTarget === 'shops') {
      const index = this.overviewShopSelectedIndex;
      this.overviewShopScales[index] = Math.max(0.1, Math.min(1, +(this.overviewShopScales[index] + direction * this.overviewScaleStep).toFixed(2)));
      this.applyOverviewShopFootpoint(index);
    } else {
      const index = this.overviewShopSelectedIndex;
      if (!this.overviewTourists[index]) return;
      this.overviewTouristScales[index] = Math.max(0.1, Math.min(1,
        +((this.overviewTouristScales[index] ?? OVERVIEW_TOURIST_SCALE) + direction * this.overviewScaleStep).toFixed(2)));
      this.applyOverviewTouristScale(index);
    }
    this.updateOverviewShopAdjustPanel();
  }

  private restoreOverviewAdjustments(): void {
    this.overviewShopFootpoints = OVERVIEW_SHOP_BASELINE.map(point => ({ ...point }));
    this.overviewShopScales = [...OVERVIEW_SHOP_BASELINE_SCALES];
    const foreground = this.overviewBackgroundLayers[2]?.parent?.getChildByName('U00_StreetEntities');
    this.setOverviewCount(OVERVIEW_TOURIST_COUNT, foreground ?? undefined);
    this.overviewTouristScales = this.overviewTourists.map(() => OVERVIEW_TOURIST_SCALE);
    this.overviewShopNodes.forEach((_, index) => this.applyOverviewShopFootpoint(index));
    this.overviewTourists.forEach((_, index) => this.applyOverviewTouristScale(index));
    this.updateOverviewShopAdjustPanel();
    this.setOverviewShopFeedback('店铺与顾客缩放、店铺位置已恢复初始预览值。');
  }

  private applyOverviewShopFootpoint(index: number): void {
    const shop = this.overviewShopNodes[index];
    const footpoint = this.overviewShopFootpoints[index];
    if (!shop?.isValid || !footpoint) return;
    const contactY = shop.getChildByName('ground_contact')?.position.y ?? -388;
    const scale = this.overviewShopScales[index] ?? OVERVIEW_SHOP_BASELINE_SCALES[index];
    shop.setPosition(footpoint.x, footpoint.y - contactY * scale);
    shop.setScale(scale, scale, 1);
  }

  private applyOverviewTouristScale(index: number): void {
    const instance = this.overviewTourists[index]?.view.root;
    if (!instance?.isValid) return;
    const scale = this.overviewTouristScales[index] ?? OVERVIEW_TOURIST_SCALE;
    const footOffsetY = instance.getChildByName('MirrorRoot')?.position.y ?? 0;
    instance.setScale(scale, scale, 1);
    instance.setPosition(0, footOffsetY * (OVERVIEW_TOURIST_SCALE - scale), 0);
  }

  private focusOverviewShop(): void {
    if (this.overviewAdjustTarget === 'tourists') {
      const item = this.overviewTourists[this.overviewShopSelectedIndex];
      if (item) this.overviewController?.focusOnSourceX(item.root.position.x);
      return;
    }
    const footpoint = this.overviewShopFootpoints[this.overviewShopSelectedIndex];
    if (footpoint) this.overviewController?.focusOnSourceX(footpoint.x);
  }

  private updateOverviewShopAdjustPanel(): void {
    const point = this.overviewShopFootpoints[this.overviewShopSelectedIndex] ?? this.overviewShopFootpoints[0];
    if (!point) return;
    const isTourist = this.overviewAdjustTarget === 'tourists';
    const activeIndex = isTourist ? Math.min(this.overviewShopSelectedIndex, Math.max(0, this.overviewTourists.length - 1)) : this.overviewShopSelectedIndex;
    const label = this.overviewShopNameLabel?.getComponent(Label);
    if (label) label.string = isTourist
      ? `顾客 ${this.overviewTourists.length ? activeIndex + 1 : 0}/${this.overviewTourists.length}`
      : `${String(this.overviewShopSelectedIndex + 1).padStart(2, '0')}/06 ${SHOP_NAMES[this.overviewShopSelectedIndex]}`;
    const xLabel = this.overviewShopXLabel?.getComponent(Label);
    if (xLabel) xLabel.string = isTourist ? '缩放只作用于选中的顾客' : `脚点 X：${point.x}`;
    const yLabel = this.overviewShopYLabel?.getComponent(Label);
    if (yLabel) yLabel.string = isTourist ? `新增顾客使用初始缩放 ${OVERVIEW_TOURIST_SCALE.toFixed(2)}` : `脚点 Y：${point.y}`;
    const scaleLabel = this.overviewShopScaleLabel?.getComponent(Label);
    if (scaleLabel) scaleLabel.string = `缩放：${isTourist
      ? (this.overviewTouristScales[this.overviewShopSelectedIndex] ?? OVERVIEW_TOURIST_SCALE).toFixed(2)
      : this.overviewShopScales[this.overviewShopSelectedIndex].toFixed(2)}`;
    const stepLabel = this.overviewShopStepLabel?.getComponent(Label);
    if (stepLabel) stepLabel.string = `坐标步长：${this.overviewShopStep} · 缩放步长：${this.overviewScaleStep.toFixed(2)}（0.10–1.00）`;
    const shopButtons = ['X −', 'X +', 'Y −', 'Y +'].map(name => this.overviewShopAdjustPanel?.getChildByName(`Button_${name}`));
    shopButtons.forEach(node => { if (node) node.active = !isTourist; });
    for (const [name, mode] of [['店铺', 'shops'], ['顾客', 'tourists']] as const)
      this.setTouristButtonText(this.overviewShopAdjustPanel?.getChildByName(`Button_${name}`),
        `${this.overviewAdjustTarget === mode ? '● ' : ''}${name}`);
    for (const step of [1, 10, 50]) {
      const button = this.overviewShopAdjustPanel?.getChildByName(`Button_步长 ${step}`);
      if (button) button.active = !isTourist;
      this.setTouristButtonText(
        this.overviewShopAdjustPanel?.getChildByName(`Button_步长 ${step}`),
        `${this.overviewShopStep === step ? '● ' : ''}步长 ${step}`);
    }
  }

  private setOverviewShopFeedback(message: string): void {
    const label = this.overviewShopFeedback?.getComponent(Label);
    if (label) label.string = message;
  }

  private overviewShopExportText(): string {
    return JSON.stringify({
      schema: 'U00_ENTITY_LAYOUT_FEEDBACK_V0_3',
      temporaryPreview: true,
      leavePageRestoresBaseline: true,
      tourists: this.overviewTourists.map((item, index) => ({
        id: index + 1,
        scale: this.overviewTouristScales[index] ?? OVERVIEW_TOURIST_SCALE,
      })),
      shops: SHOP_IDS.map((id, index) => ({
        id,
        name: SHOP_NAMES[index],
        footX: this.overviewShopFootpoints[index].x,
        footY: this.overviewShopFootpoints[index].y,
        scale: this.overviewShopScales[index] ?? OVERVIEW_SHOP_BASELINE_SCALES[index],
      })),
      touristCount: this.overviewTourists.length,
    }, null, 2);
  }

  private async copyOverviewShopParameters(): Promise<void> {
    const text = this.overviewShopExportText();
    const epoch = this.pageEpoch;
    const navigatorRef = (globalThis as any).navigator;
    try {
      if (!navigatorRef?.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigatorRef.clipboard.writeText(text);
      if (epoch !== this.pageEpoch || !this.overviewScene?.activeInHierarchy) return;
      this.setOverviewShopFeedback('参数已复制，也可全选下方文本发回对话。');
      this.showOverviewClipboardFallback(text, true);
    } catch {
      if (epoch !== this.pageEpoch || !this.overviewScene?.activeInHierarchy) return;
      this.setOverviewShopFeedback('剪贴板不可用，请从下方只读文本框手动复制。');
      this.showOverviewClipboardFallback(text, false);
    }
  }

  private showOverviewClipboardFallback(text: string, copied: boolean): void {
    this.closeOverviewClipboardFallback();
    const documentRef = (globalThis as any).document;
    if (!documentRef?.body) {
      this.setOverviewShopFeedback('无法打开文本框；请在支持剪贴板的浏览器中重试。');
      return;
    }
    const overlay = documentRef.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', '复制六店参数');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:rgba(4,12,20,.88);display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
    const card = documentRef.createElement('div');
    card.style.cssText = 'width:min(680px,100%);height:min(80vh,720px);background:#132233;color:#e6eff7;border:2px solid #6cc1e0;border-radius:12px;padding:16px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px;font:16px sans-serif;';
    const title = documentRef.createElement('div');
    title.textContent = copied
      ? '参数已复制；也可选择下方只读文本框，全选JSON后发回对话。'
      : '剪贴板不可用。选择下方只读文本框，全选JSON后手动复制并发回对话。';
    const textarea = documentRef.createElement('textarea');
    textarea.readOnly = true;
    textarea.value = text;
    textarea.setAttribute('aria-label', '六店位置参数JSON');
    textarea.style.cssText = 'flex:1;width:100%;resize:none;background:#0a1422;color:#e6eff7;border:1px solid #6cc1e0;padding:10px;box-sizing:border-box;font:13px monospace;';
    const buttons = documentRef.createElement('div');
    buttons.style.cssText = 'display:flex;justify-content:flex-end;gap:10px;';
    const selectButton = documentRef.createElement('button');
    selectButton.textContent = '全选文本';
    selectButton.onclick = () => { textarea.focus(); textarea.select(); };
    const closeButton = documentRef.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.onclick = () => this.closeOverviewClipboardFallback();
    for (const button of [selectButton, closeButton])
      button.style.cssText = 'padding:10px 18px;background:#132233;color:#e6eff7;border:1px solid #6cc1e0;border-radius:6px;font:16px sans-serif;';
    buttons.appendChild(selectButton);
    buttons.appendChild(closeButton);
    card.appendChild(title);
    card.appendChild(textarea);
    card.appendChild(buttons);
    overlay.appendChild(card);
    documentRef.body.appendChild(overlay);
    this.overviewClipboardFallback = overlay;
    textarea.focus();
    textarea.select();
  }

  private closeOverviewClipboardFallback(): void {
    const fallback = this.overviewClipboardFallback;
    if (fallback?.parentNode) fallback.parentNode.removeChild(fallback);
    this.overviewClipboardFallback = null;
  }

  private buildOverviewTourists(foreground: Node): void {
    this.setOverviewCount(this.overviewCount, foreground);
  }

  private setOverviewCount(count: number, foreground?: Node): void {
    const parent = foreground ?? this.overviewBackgroundLayers[2]?.parent?.getChildByName('U00_StreetEntities');
    if (!parent || !this.touristPrefab || !this.touristFrameManifest || !this.touristMountManifest || !this.touristAccessoryManifest) return;
    const target = Math.max(0, Math.min(8, Math.floor(count)));
    while (this.overviewTourists.length > target) {
      const item = this.overviewTourists.pop()!;
      item.state.detach();
      item.root.destroy();
    }
    while (this.overviewTourists.length < target) {
      const index = this.overviewTourists.length;
      const leftSide = index % 2 === 0;
      const lane = leftSide ? [-1390, -150] : [150, 1390];
      const root = this.makeNode(`U00_Tourist_${index + 1}`, parent, 1, 1,
        leftSide ? lane[0] : lane[1], -278 - (index % 3) * 17);
      root.active = this.overviewGroupVisible.tourists;
      const instance = instantiate(this.touristPrefab);
      instance.name = `UG_GHOST_01_${index + 1}`;
      root.addChild(instance);
      const scale = this.overviewTouristScales[index] ?? OVERVIEW_TOURIST_SCALE;
      instance.setScale(OVERVIEW_TOURIST_SCALE, OVERVIEW_TOURIST_SCALE, 1);
      const touristView = new TouristView(instance);
      touristView.setStageHeight(520);
      const state = new TouristStateController();
      const adapter = new ApprovedTouristAdapter(touristView,
        this.touristFrameManifest.json as TouristFrameManifest,
        this.touristMountManifest.json as TouristMountManifest,
        this.touristAccessoryManifest.json as TouristAccessoryManifest,
        this.touristBodyFrames, this.touristAccessoryFrames);
      state.attach(adapter);
      const action = this.nextOverviewAction(null);
      const bounds: [number, number] = leftSide ? [-1450, -240] : [240, 1450];
      const walking = action === 'walk' || action === 'run';
      const rank = Math.floor(index / 2);
      const start = leftSide ? bounds[0] + rank * 230 : bounds[1] - rank * 230;
      root.setPosition(start, -242 - (index % 3) * 12);
      root.active = this.overviewTouristsVisible;
      if (walking) state.setFacing(leftSide ? 'right' : 'left');
      state.selectAction(action);
      const actionDurationMs = walking ? 2000 + (this.overviewRng % 2001) : 0;
      this.overviewTourists.push({ root, state, view: touristView, adapter, actionElapsed: 0, actionDurationMs, action, walking, bounds });
      this.overviewTouristScales[index] = scale;
      this.applyOverviewTouristScale(index);
    }
    this.overviewTouristScales.length = target;
    if (this.overviewAdjustTarget === 'tourists')
      this.overviewShopSelectedIndex = Math.min(this.overviewShopSelectedIndex, Math.max(0, target - 1));
    this.overviewCount = target;
    if (this.overviewCountLabel?.isValid) this.overviewCountLabel.getComponent(Label)!.string = `顾客 ${target} / 8`;
    this.setTouristButtonText(this.overviewGroupButtons.tourists,
      `顾客：${this.overviewTouristsVisible ? '显示' : '隐藏'}`);
    this.updateOverviewShopAdjustPanel();
  }

  private nextOverviewAction(previous: TouristAction | null): TouristAction {
    const choices: TouristAction[] = ['walk', 'run', 'happy', 'sad'].filter(action => action !== previous) as TouristAction[];
    this.overviewRng = (this.overviewRng * 48271) % 2147483647;
    return choices[this.overviewRng % choices.length];
  }

  private updateOverview(deltaMs: number): void {
    const actions = (this.touristFrameManifest?.json as TouristFrameManifest | undefined)?.actions;
    if (!actions || deltaMs <= 0) return;
    for (const item of this.overviewTourists) {
      item.state.tick(deltaMs);
      item.actionElapsed += deltaMs;
      if (item.walking) {
        const speed = item.action === 'run' ? 120 : 60;
        const pos = item.root.position;
        const nextX = pos.x + (item.state.snapshot().facing === 'right' ? 1 : -1) * speed * deltaMs / 1000;
        if (nextX >= item.bounds[1]) { item.root.setPosition(item.bounds[1], pos.y); item.state.setFacing('left'); }
        else if (nextX <= item.bounds[0]) { item.root.setPosition(item.bounds[0], pos.y); item.state.setFacing('right'); }
        else item.root.setPosition(nextX, pos.y);
      }
      const cycleDuration = item.walking ? item.actionDurationMs : actions[item.action].totalDurationMs;
      if (item.actionElapsed >= cycleDuration) {
        item.actionElapsed = 0;
        item.action = this.nextOverviewAction(item.action === 'happy' || item.action === 'sad' ? item.action : null);
        item.walking = item.action === 'walk' || item.action === 'run';
        if (item.walking) {
          const facing = item.state.snapshot().facing;
          if (facing === 'right' && item.root.position.x >= item.bounds[1]) item.state.setFacing('left');
          if (facing === 'left' && item.root.position.x <= item.bounds[0]) item.state.setFacing('right');
          item.actionDurationMs = 2000 + (this.overviewRng % 2001);
        }
        item.state.selectAction(item.action);
      }
    }
  }

  private layoutOverview(): void {
    const visible = view.getVisibleSize();
    const origin = view.getVisibleOrigin();
    const safe = sys.getSafeAreaRect(false);
    this.overviewScene?.getComponent(UITransform)?.setContentSize(visible);
    const left = safe.x - origin.x - visible.width / 2;
    const bottom = safe.y - origin.y - visible.height / 2;
    const top = safe.y + safe.height - origin.y - visible.height / 2;
    const controls = this.overviewScene?.getChildByName('U00_Controls');
    const topControls = controls?.getChildByName('U00_TopControls');
    const toggles = controls?.getChildByName('U00_GroupToggles');
    const count = controls?.getChildByName('U00_CountControls');
    const camera = controls?.getChildByName('U00_CameraControls');
    const shopPanel = this.overviewShopAdjustPanel;
    topControls?.setPosition(0, top - 53);
    toggles?.setPosition(0, top - 120);
    shopPanel?.setPosition(0, top - 450);
    count?.setPosition(0, bottom + 154);
    camera?.setPosition(0, bottom + 70);
    const back = topControls?.getChildByName('Button_返回菜单');
    const adjustToggle = this.overviewShopAdjustToggle;
    const title = topControls?.getChildByName('Text');
    const compact = visible.width < 500;
    const titleWidth = compact ? 120 : Math.max(120, Math.min(190, visible.width - 440));
    title?.getComponent(UITransform)?.setContentSize(titleWidth, 54);
    if (compact) {
      back?.setPosition(left + 56, 0);
      back?.getComponent(UITransform)?.setContentSize(100, 50);
      title?.setPosition(-8, 0);
      adjustToggle?.setPosition(visible.width / 2 - 68, 0);
      adjustToggle?.getComponent(UITransform)?.setContentSize(120, 50);
      this.syncButtonDrawing(back);
      this.syncButtonDrawing(adjustToggle);
    } else {
      back?.setPosition(left + 90, 0);
      adjustToggle?.setPosition(Math.min(255, visible.width / 2 - 84), 0);
      adjustToggle?.getComponent(UITransform)?.setContentSize(Math.min(144, visible.width / 2 - 24), 58);
      title?.setPosition(24, 0);
      this.syncButtonDrawing(adjustToggle);
    }
    const shopPanelWidth = Math.min(672, visible.width - 24);
    shopPanel?.getComponent(UITransform)?.setContentSize(shopPanelWidth, 570);
    if (shopPanel) {
      this.paintRect(shopPanel, shopPanel.getComponent(Graphics)!, shopPanelWidth, 570, PANEL);
      const half = shopPanelWidth / 2;
      const at = (name: string, x: number, y: number, width: number, height: number): void => {
        const node = shopPanel.getChildByName(name);
        node?.setPosition(x, y);
        node?.getComponent(UITransform)?.setContentSize(width, height);
        this.syncButtonDrawing(node ?? null);
      };
      const textSize = (name: string, width: number): void => {
        shopPanel.getChildByName(name)?.getComponent(UITransform)?.setContentSize(width, 42);
      };
      if (compact) {
        const sideX = Math.max(128, half - 55);
        const arrowWidth = Math.max(70, Math.min(84, (shopPanelWidth - 180) / 2));
        const valueWidth = Math.max(130, shopPanelWidth - 2 * arrowWidth - 48);
        at('Button_店铺', -76, 165, 120, 38);
        at('Button_顾客', 76, 165, 120, 38);
        at('Button_上一项', -sideX, 112, arrowWidth, 42);
        at('Button_下一项', sideX, 112, arrowWidth, 42);
        at('Button_X −', -sideX, 62, arrowWidth, 42);
        at('Button_X +', sideX, 62, arrowWidth, 42);
        at('Button_Y −', -sideX, 13, arrowWidth, 42);
        at('Button_Y +', sideX, 13, arrowWidth, 42);
        textSize('Text', valueWidth);
        this.overviewShopNameLabel?.getComponent(UITransform)?.setContentSize(valueWidth, 42);
        this.overviewShopXLabel?.getComponent(UITransform)?.setContentSize(valueWidth, 42);
        this.overviewShopYLabel?.getComponent(UITransform)?.setContentSize(valueWidth, 42);
        const stepX = Math.max(68, Math.min(105, (shopPanelWidth - 42) / 3));
        const stepW = Math.max(60, Math.min(72, stepX - 8));
        at('Button_步长 1', -stepX, -25, stepW, 38);
        at('Button_步长 10', 0, -25, stepW, 38);
        at('Button_步长 50', stepX, -25, stepW, 38);
        at('Button_缩放 −', -sideX, -43, arrowWidth, 38);
        at('Button_缩放 +', sideX, -43, arrowWidth, 38);
        const actionX = Math.max(82, half - 95);
        const actionW = Math.max(140, Math.min(174, half - 28));
        at('Button_恢复初始值', -actionX, -112, actionW, 38);
        at('Button_复制全部参数', actionX, -112, actionW, 38);
        this.overviewShopScaleLabel?.getComponent(UITransform)?.setContentSize(valueWidth, 38);
        this.overviewShopStepLabel?.getComponent(UITransform)?.setContentSize(shopPanelWidth - 24, 30);
        this.overviewShopFeedback?.getComponent(UITransform)?.setContentSize(shopPanelWidth - 24, 30);
      } else {
        at('Button_店铺', -76, 165, 130, 40);
        at('Button_顾客', 76, 165, 130, 40);
        at('Button_上一项', -250, 112, 104, 42);
        at('Button_下一项', 250, 112, 104, 42);
        at('Button_X −', -250, 62, 104, 42);
        at('Button_X +', 250, 62, 104, 42);
        at('Button_Y −', -250, 13, 104, 42);
        at('Button_Y +', 250, 13, 104, 42);
        textSize('Text', 260);
        this.overviewShopNameLabel?.getComponent(UITransform)?.setContentSize(260, 42);
        this.overviewShopXLabel?.getComponent(UITransform)?.setContentSize(260, 42);
        this.overviewShopYLabel?.getComponent(UITransform)?.setContentSize(260, 42);
        at('Button_步长 1', -180, -25, 110, 38);
        at('Button_步长 10', 0, -25, 110, 38);
        at('Button_步长 50', 180, -25, 110, 38);
        at('Button_缩放 −', -250, -43, 104, 38);
        at('Button_缩放 +', 250, -43, 104, 38);
        at('Button_恢复初始值', -160, -112, 200, 38);
        at('Button_复制全部参数', 160, -112, 200, 38);
        this.overviewShopScaleLabel?.getComponent(UITransform)?.setContentSize(260, 38);
        this.overviewShopStepLabel?.getComponent(UITransform)?.setContentSize(260, 30);
        this.overviewShopFeedback?.getComponent(UITransform)?.setContentSize(640, 30);
      }
      const step = this.overviewShopStepLabel?.getComponent(UITransform);
      const rows: Array<[string[], number]> = [
        [['店铺', '顾客'], 195], [['上一项', '下一项'], 145],
        [['X −', 'X +'], 95], [['Y −', 'Y +'], 45],
        [['缩放 −', '缩放 +'], -5], [['步长 1', '步长 10', '步长 50'], -55],
        [['恢复初始值', '复制全部参数'], -145],
      ];
      for (const [names, y] of rows) for (const name of names) {
        const button = shopPanel.getChildByName(`Button_${name}`);
        if (button) button.setPosition(button.position.x, y);
      }
      shopPanel.getChildByName('Text')?.setPosition(0, 245);
      shopPanel.getChildByName('Text')?.getComponent(UITransform)?.setContentSize(shopPanelWidth - 24, 36);
      this.overviewShopNameLabel?.setPosition(0, 145);
      this.overviewShopXLabel?.setPosition(0, 95);
      this.overviewShopYLabel?.setPosition(0, 45);
      this.overviewShopScaleLabel?.setPosition(0, -5);
      step?.node.setPosition(0, -100);
      this.overviewShopFeedback?.setPosition(0, -200);
    }
    const toggleWidth = Math.max(74, Math.min(210, (visible.width - 60) / 3));
    const toggleGap = toggleWidth + 12;
    for (const [key, x] of [['street', -toggleGap], ['tourists', 0], ['shops', toggleGap]] as const) {
      const node = this.overviewGroupButtons[key];
      node?.setPosition(x, 0);
      node?.getComponent(UITransform)?.setContentSize(toggleWidth, 52);
    }
    const zoomX = Math.min(170, visible.width / 2 - 44);
    const zoomWidth = Math.min(76, Math.max(48, (visible.width - 170) / 2));
    camera?.getChildByName('Button_−')?.setPosition(-zoomX, 0);
    camera?.getChildByName('Button_+')?.setPosition(zoomX, 0);
    camera?.getChildByName('Button_−')?.getComponent(UITransform)?.setContentSize(zoomWidth, 58);
    camera?.getChildByName('Button_+')?.getComponent(UITransform)?.setContentSize(zoomWidth, 58);
    const resetWidth = Math.min(140, Math.max(96, visible.width - 2 * zoomWidth - 36));
    camera?.getChildByName('Button_重置')?.getComponent(UITransform)?.setContentSize(resetWidth, 58);
  }

  private collectButtons(root: Node): Node[] {
    const result: Node[] = [];
    const visit = (node: Node): void => {
      if (node.name.startsWith('Button_')) result.push(node);
      for (const child of node.children) visit(child);
    };
    visit(root);
    return result;
  }

  private syncButtonDrawing(node: Node | null): void {
    if (!node) return;
    const size = node.getComponent(UITransform)?.contentSize;
    const graphics = node.getComponent(Graphics);
    if (size && graphics) this.paintButtonState(node, 'normal');
    const textSize = node.getChildByName('Text')?.getComponent(UITransform);
    if (size && textSize) textSize.setContentSize(Math.max(30, size.width - 14), Math.max(30, size.height - 10));
  }

  private restoreOverviewProfiler(): void {
    if (this.overviewProfilerWasShowing === null) return;
    if (this.overviewProfilerWasShowing) profiler.showStats();
    this.overviewProfilerWasShowing = null;
  }

  private layoutScene(): void {
    const visible = view.getVisibleSize();
    this.root.getComponent(UITransform)!.setContentSize(visible);
    this.page.getComponent(UITransform)!.setContentSize(visible);
    if (this.rootBackground) {
      this.paintRect(this.rootBackground,
        this.rootBackground.getComponent(Graphics)!, visible.width, visible.height, MENU_BG);
    }
    if (this.menuContent) {
      const titleY = Math.min(480, visible.height / 2 - 80);
      this.menuTitle?.setPosition(0, titleY);
      const lowerEdge = -visible.height / 2 + 24;
      const cardHeight = Math.max(72, Math.min(205,
        (titleY - lowerEdge - 155 - 18 * (this.menuCards.length - 1)) / (this.menuCards.length - 0.5)));
      const cardScaleX = Math.min(1, (visible.width - 24) / 610);
      this.menuCards.forEach((card, index) => {
        card.setScale(cardScaleX, cardHeight / 210);
        card.setPosition(0, titleY - 155 - index * (cardHeight + 18));
      });
    }
    if (this.overviewScene?.isValid) this.layoutOverview();
    if (this.shopStage?.isValid) {
      const origin = view.getVisibleOrigin();
      const safe = sys.getSafeAreaRect(false);
      const top = Math.min(visible.height / 2, safe.y + safe.height - origin.y - visible.height / 2);
      const bottom = Math.max(-visible.height / 2, safe.y - origin.y - visible.height / 2);
      const stageTop = top - 126, stageBottom = bottom + 225;
      const stageHeight = Math.max(200, stageTop - stageBottom);
      const stageWidth = Math.min(620, visible.width - 48, stageHeight * 0.95);
      this.shopStage.getComponent(UITransform)!.setContentSize(stageWidth, stageHeight);
      this.shopStage.setPosition(0, (stageTop + stageBottom) / 2);
      const shopScale = Math.min(stageWidth, stageHeight) / 1024;
      this.shopArtwork?.setScale(shopScale, shopScale, 1);
      this.shopBack?.setPosition(-visible.width / 2 + 100, top - 55);
      this.shopTitle?.setPosition(0, top - 55);
      this.shopIdentity?.node.setPosition(0, bottom + 177);
      this.shopStatus?.node.setPosition(0, bottom + 125);
      this.shopPrevious?.setPosition(-150, bottom + 65);
      this.shopNext?.setPosition(150, bottom + 65);
      this.shopRetry?.setPosition(0, bottom + 125);
    }
    if (this.touristStage?.isValid) this.layoutTourist(visible);
    if (this.u04Portrait?.isValid) this.layoutDialogue(visible);
    if (!this.sceneViewport?.isValid) return;
    const origin = view.getVisibleOrigin();
    const safe = sys.getSafeAreaRect(false);
    this.sceneViewport.getComponent(UITransform)!.setContentSize(visible);
    this.sceneControls?.setPosition(0, -visible.height / 2 + safe.y - origin.y + 68);
    this.sceneBack?.setPosition(-visible.width / 2 + safe.x - origin.x + 114,
      -visible.height / 2 + safe.y + safe.height - origin.y - 68);
  }

  private layoutTourist(visible: { width: number; height: number }): void {
    const origin = view.getVisibleOrigin();
    const safe = sys.getSafeAreaRect(false);
    const halfHeight = visible.height / 2;
    const measuredTop = Math.min(halfHeight, safe.y + safe.height - origin.y - halfHeight);
    const measuredBottom = Math.max(-halfHeight, safe.y - origin.y - halfHeight);
    const safeTop = Number.isFinite(measuredTop) && measuredTop > measuredBottom
      ? measuredTop : halfHeight;
    const safeBottom = Number.isFinite(measuredBottom) && measuredTop > measuredBottom
      ? measuredBottom : -halfHeight;
    const safeHeight = safeTop - safeBottom;
    const navY = safeTop - 54;
    const measuredLeft = Math.max(-visible.width / 2, safe.x - origin.x - visible.width / 2);
    const measuredRight = Math.min(visible.width / 2,
      safe.x + safe.width - origin.x - visible.width / 2);
    const safeLeft = Number.isFinite(measuredLeft) && measuredLeft < measuredRight
      ? measuredLeft : -visible.width / 2;
    const safeRight = Number.isFinite(measuredRight) && measuredLeft < measuredRight
      ? measuredRight : visible.width / 2;
    const backX = safeLeft + 95;
    const resetX = safeRight - 75;
    this.touristNavBack?.setPosition(backX, navY);
    this.touristNavTitle?.setPosition(0, navY);
    const titleHalfLimit = Math.min(-(backX + 75), resetX - 55);
    this.touristNavTitle?.getComponent(UITransform)!.setContentSize(
      Math.max(1, Math.min(340, 2 * (titleHalfLimit - 16))), 60);
    this.touristNavReset?.setPosition(resetX, navY);

    const stageTop = navY - 50;
    const trayBottom = safeBottom + 18;
    const stageLimit = stageTop - trayBottom - 90 - 240;
    const stageHeight = Math.max(240, Math.min(520, safeHeight * 0.42, stageLimit));
    const stageBottom = stageTop - stageHeight;
    this.touristStage!.getComponent(UITransform)!.setContentSize(590, stageHeight);
    this.touristStage!.setPosition(0, stageTop - stageHeight / 2);
    this.touristView?.setStageHeight(stageHeight);
    if (this.touristStagePanel) {
      this.paintRect(this.touristStagePanel,
        this.touristStagePanel.getComponent(Graphics)!, 590, stageHeight, PANEL);
    }
    this.touristStatus?.setPosition(0, stageBottom - 25);
    this.touristAdornment?.setPosition(0, stageBottom - 61);

    const trayTop = stageBottom - 90;
    const trayHeight = Math.max(1, trayTop - trayBottom);
    this.touristTrayViewport!.getComponent(UITransform)!.setContentSize(610, trayHeight);
    this.touristTrayViewport!.setPosition(0, (trayTop + trayBottom) / 2);
    if (this.touristTrayBackground) {
      this.paintRect(this.touristTrayBackground,
        this.touristTrayBackground.getComponent(Graphics)!, 610, trayHeight, PANEL);
    }
    this.touristMaxScroll = Math.max(0, 506 - trayHeight);
    this.touristScrollOffset = Math.min(this.touristScrollOffset, this.touristMaxScroll);
    this.positionTouristTrayContent();
  }

  private positionTouristTrayContent(): void {
    const tray = this.touristTrayViewport;
    if (!tray?.isValid || !this.touristTrayContent?.isValid) return;
    const height = tray.getComponent(UITransform)!.height;
    this.touristTrayContent.setPosition(0, height / 2 + this.touristScrollOffset);
  }

  private scrollTouristTray(delta: number): void {
    if (!Number.isFinite(delta) || this.touristMaxScroll <= 0) return;
    this.touristScrollOffset = Math.max(0,
      Math.min(this.touristMaxScroll, this.touristScrollOffset + delta));
    this.positionTouristTrayContent();
  }

  private onTouristTouchStart(event: EventTouch): void {
    this.touristTouchY = event.getUILocation().y;
    this.touristTouchStartY = this.touristTouchY;
    this.touristScrollGesture = false;
    event.propagationStopped = true;
  }

  private onTouristTouchMove(event: EventTouch): void {
    const currentY = event.getUILocation().y;
    if (this.touristTouchY !== null) {
      if (this.touristTouchStartY !== null
        && Math.abs(this.touristTouchStartY - currentY) > 8) this.touristScrollGesture = true;
      this.scrollTouristTray(this.touristTouchY - currentY);
    }
    this.touristTouchY = currentY;
    event.propagationStopped = true;
  }

  private onTouristTouchEnd(event: EventTouch): void {
    this.touristTouchY = null;
    this.touristTouchStartY = null;
    // Keep the drag flag through TOUCH_END; a child button may dispatch its
    // click callback after this parent handler. The next start resets it.
    event.propagationStopped = true;
  }

  private onTouristMouseDown(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
    this.touristMouseY = event.getUILocation().y;
    this.touristMouseStartY = this.touristMouseY;
    this.touristScrollGesture = false;
    event.propagationStopped = true;
  }

  private onTouristMouseMove(event: EventMouse): void {
    if (this.touristMouseY === null) return;
    const currentY = event.getUILocation().y;
    if (this.touristMouseStartY !== null
      && Math.abs(this.touristMouseStartY - currentY) > 8) this.touristScrollGesture = true;
    this.scrollTouristTray(this.touristMouseY - currentY);
    this.touristMouseY = currentY;
    event.propagationStopped = true;
  }

  private onTouristMouseUp(event: EventMouse): void {
    this.touristMouseY = null;
    this.touristMouseStartY = null;
    event.propagationStopped = true;
  }

  private onTouristMouseWheel(event: EventMouse): void {
    this.scrollTouristTray(-event.getScrollY() * 0.4);
    event.propagationStopped = true;
  }

  private isInside(node: Node, point: { x: number; y: number }): boolean {
    const transform = node.getComponent(UITransform);
    if (!transform || !node.activeInHierarchy) return false;
    const local = transform.convertToNodeSpaceAR(new Vec3(point.x, point.y, 0));
    const size = transform.contentSize;
    return Math.abs(local.x) <= size.width / 2 && Math.abs(local.y) <= size.height / 2;
  }

  private onMenuMouseDown(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
    if (this.overviewScene?.activeInHierarchy) {
      this.overviewMouseTarget = this.collectButtons(this.overviewScene)
        .find(node => this.isInside(node, event.getUILocation())) ?? null;
      return;
    }
    this.menuMouseDown = this.menuEntries.find(entry =>
      this.isInside(entry.node, event.getUILocation()))?.node ?? null;
  }

  private onMenuMouseUp(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
    if (this.overviewScene?.activeInHierarchy) {
      const target = this.overviewMouseTarget;
      this.overviewMouseTarget = null;
      if (target && target.isValid && this.isInside(target, event.getUILocation()))
        this.buttonMouseActions.get(target)?.();
      return;
    }
    const pressed = this.menuMouseDown;
    this.menuMouseDown = null;
    if (pressed && this.isInside(pressed, event.getUILocation())) {
      this.activateMenuEntry(pressed, this.pageEpoch);
    }
  }
}
