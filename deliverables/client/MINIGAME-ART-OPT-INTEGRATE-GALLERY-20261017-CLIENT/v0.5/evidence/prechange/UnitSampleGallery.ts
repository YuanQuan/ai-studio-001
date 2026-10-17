import {
  _decorator, Color, Component, Director, EventMouse, EventTouch, Graphics, Input, director, input,
  JsonAsset, Label, Mask, Node, Prefab, ResolutionPolicy, Sprite, SpriteFrame, UITransform, Vec3, profiler, resources,
  instantiate, sys, view,
} from 'cc';
import { Scene1CameraController } from './labs/menu/scene1_camera_controller';
import { TouristAction, TouristSlot, TouristStateController } from './labs/u02/tourist_state';
import {
  ApprovedTouristAdapter, TouristAccessoryManifest, TouristFrameManifest,
  TouristMountManifest,
} from './labs/u02/tourist_adapter';
import { TouristView } from './labs/u02/tourist_view';
import { SHOP_IDS, SHOP_NAMES, SHOP_PREFAB_NAMES } from './labs/u03/shop_definitions';
import { U01SakuraLayoutEditor } from './labs/u01/sakura_layout_editor';
import { populateSakuraV03 } from './labs/u01/sakura_v03_environment';
import { USER_LAYOUT_PROFILE } from './labs/u01/sakura_user_layout';
import { U05MilkTeaLab } from './labs/u05/milk_tea_lab';
import { ViewportAdapter, ViewportSnapshot, WebViewportAdapter, WeChatViewportAdapter,
  DouyinViewportAdapter, ViewportMapper } from './framework/viewport';
import { ModuleAssets, ModuleLease, CancellableAcquire,
  U04_MAPPING_MODULE, U04_DECORATION_MODULE, u04PortraitModuleId } from './framework/module-assets';
import { ScrollableTextPanel } from './framework/ui/scrollable_text_panel';
import { createClientAssetRuntime, CLIENT_ASSET_MODULE_MANIFEST } from './framework/asset-integration/client_asset_modules';
import { APPROVED_DERIVED_ASSET_MANIFEST } from './framework/asset-integration/approved_asset_registry';
import { GalleryAssetSession } from './framework/asset-integration/gallery_asset_session';
import { SAKURA_V03_LAYOUT } from './labs/u01/sakura_v03_layout';
import type { U01ResourceProvider } from './labs/u01/sakura_layout_editor';

const { ccclass, property } = _decorator;
const MENU_BG = new Color(10, 20, 34);
const PANEL = new Color(19, 34, 51);
const TEXT = new Color(230, 239, 247);
const MUTED = new Color(155, 178, 199);
const BLUE = new Color(108, 193, 224);
const GOLD = new Color(246, 189, 109);
type UserShopLayoutEntry = (typeof USER_LAYOUT_PROFILE.instances[number]) & {
  shopFootpoint: { groundContactLocalY: number };
};
const USER_SHOP_LAYOUT = USER_LAYOUT_PROFILE.instances
  .filter(entry => entry.instanceId.startsWith('ORIGINAL-SHOP-'))
  .slice().sort((a, b) => a.orderBottomToTop - b.orderBottomToTop) as UserShopLayoutEntry[];
const OVERVIEW_SHOP_BASELINE = USER_SHOP_LAYOUT.map(entry => ({
  x: entry.left + entry.sourceSize.width * entry.scale / 2 - USER_LAYOUT_PROFILE.canvas.width / 2,
  y: USER_LAYOUT_PROFILE.canvas.height / 2 - (entry.top + entry.sourceSize.height * entry.scale / 2
    - entry.shopFootpoint!.groundContactLocalY * entry.scale),
}));
const OVERVIEW_SHOP_BASELINE_SCALES = USER_SHOP_LAYOUT.map(entry => entry.scale);
const OVERVIEW_SHOP_MIRRORS = USER_SHOP_LAYOUT.map(entry => entry.mirror);
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
  @property public useOptimizedBundles = false;
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
  private menuScrollOffset = 0;
  private menuMaxScroll = 0;
  private menuScrollY: number | null = null;
  private menuScrollGesture = false;
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
  private overviewShopAdjustOverlay: Node | null = null;
  private overviewShopActionButtons: Record<string, Node> = {};
  private overviewShopScrollOffset = 0;
  private overviewShopMaxScroll = 0;
  private overviewShopScrollY: number | null = null;
  private overviewShopScrollGesture = false;
  private overviewShopNameLabel: Node | null = null;
  private overviewShopXLabel: Node | null = null;
  private overviewShopYLabel: Node | null = null;
  private overviewShopScaleLabel: Node | null = null;
  private overviewShopStepLabel: Node | null = null;
  private overviewShopFeedback: Node | null = null;
  private overviewClipboardFallback: any = null;
  private overviewBackgroundLayers: Node[] = [];
  private overviewController: Scene1CameraController | null = null;
  private u01Editor: U01SakuraLayoutEditor | null = null;
  private u05Lab: U05MilkTeaLab | null = null;
  private u05ProfilerWasShowing: boolean | null = null;
  private overviewGroupButtons: Partial<Record<'street' | 'tourists' | 'shops', Node>> = {};
  private overviewGroupToggleContainer: Node | null = null;
  private overviewCountContainer: Node | null = null;
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
  private u04LandscapeMode = false;
  private u04Manager = 0;
  private u04Stage = 0;
  private u04Expression = 3;
  private u04PageGeneration = 0;
  private u04Sweep = { active: false, checked: 0, total: 90, failed: [] as string[], elapsedMs: 0, startedAt: 0 };
  private u04Assets: ModuleAssets | null = null;
  private assetModules: ModuleAssets | null = null;
  private derivedResolver: ReturnType<typeof createClientAssetRuntime>['derived'] | null = null;
  private pageAssetSession: GalleryAssetSession | null = null;
  private preserveAssetSessionOnClear = false;
  private optimizedSakuraFrames: ReadonlyMap<string, SpriteFrame> | null = null;
  private assetSessionSerial = 0;
  private u04MappingLease: ModuleLease | null = null;
  private u04DecorationLease: ModuleLease | null = null;
  private u04SelectionLease: ModuleLease | null = null;
  private u04SelectionPending: CancellableAcquire | null = null;
  private u04MappingPending: CancellableAcquire | null = null;
  private u04DecorationPending: CancellableAcquire | null = null;
  private u04CommittedKey = '';
  private u04CommittedExpression = '';
  private viewportAdapter!: ViewportAdapter;
  private viewportSnapshot!: ViewportSnapshot;
  private buttonPointerRevision = new Map<Node, number>();
  private u04Sprites: Sprite[] = [];
  private u04Portrait: Node | null = null;
  private u04CropWidth = 430;
  private u04BaseNode: Node | null = null;
  private u04Face: Node | null = null;
  private u04Front: Node | null = null;
  private u04Name: Label | null = null;
  private u04Dialogue: Label | null = null;
  private u04Status: Label | null = null;
  private u04Title: Label | null = null;
  private u04Panel: Sprite | null = null;
  private u04PanelSizeIndex = 3;
  private u04Back: Node | null = null;
  private u04Controls: Node[] = [];
  private u04ResizeButtons: Node[] = [];
  private u04SweepButton: Node | null = null;
  private u04PeopleToggle: Node | null = null;
  private u04ControlsOverlay: Node | null = null;
  private u04ControlSurface: Node | null = null;
  private u04OverlayClose: Node | null = null;
  private u04OverlayTitle: Label | null = null;
  private u04CornerSprites: Sprite[] = [];
  private u04ReadOverlay: Node | null = null;
  private u04ReadSurface: Node | null = null;
  private u04ReadViewport: Node | null = null;
  private u04ReadText: Label | null = null;
  private u04ReadOffset = 0;
  private u04ReadMaxScroll = 0;
  private u04ReadPointerY: number | null = null;
  private textReader: ScrollableTextPanel | null = null;
  private overviewShopBodyViewport: Node | null = null;
  private overviewShopBodyContent: Node | null = null;
  private overviewShopScrollStartY: number | null = null;
  private menuScrollStartY: number | null = null;
  private touristStatusText = '';
  private touristAdornmentText = '';

  protected onLoad(): void {
    // Keep the full phone viewport, including the extra height of tall phones.
    view.setDesignResolutionSize(720, 1280, ResolutionPolicy.FIXED_WIDTH);
    this.viewportAdapter = this.createViewportAdapter();
    this.viewportSnapshot = this.viewportAdapter.read();
    const assetRuntime = createClientAssetRuntime();
    this.assetModules = assetRuntime.modules;
    this.derivedResolver = assetRuntime.derived;
    this.u04Assets = assetRuntime.modules;
    if (this.useOptimizedBundles) this.clearOptimizedAssetReferences();
    this.root = this.makeNode('UnitSamplesRoot', this.node, 720, 1280);
    this.rootBackground = this.drawRect(this.root, 0, 0, 720, 1280, MENU_BG);
    this.openMenu();
    this.viewportAdapter.subscribe(snapshot => {
      if (snapshot.revision === this.viewportSnapshot.revision) return;
      this.viewportSnapshot = snapshot;
      this.buttonPointerRevision.clear();
      this.menuMouseDown = null;
      if (this.u04Portrait?.isValid) {
        const landscape = snapshot.orientation === 'landscape';
        if (landscape !== this.u04LandscapeMode) {
          this.u04LandscapeMode = landscape;
          view.setDesignResolutionSize(landscape ? 1280 : 720, landscape ? 720 : 1280, ResolutionPolicy.FIXED_WIDTH);
        }
      }
      this.layoutScene();
    });
    input.on(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.on(Input.EventType.MOUSE_MOVE, this.onMenuMouseMove, this);
    input.on(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    view.on('canvas-resize', this.layoutScene, this);
    view.on('design-resolution-changed', this.layoutScene, this);
  }

  protected onDestroy(): void {
    this.restoreOverviewProfiler();
    if (this.u05ProfilerWasShowing !== null) { if(this.u05ProfilerWasShowing) profiler.showStats(); this.u05ProfilerWasShowing=null; }
    this.releaseU04Page();
    if (this.pageAssetSession) {
      const session = this.pageAssetSession;
      this.pageAssetSession = null;
      this.clearOptimizedAssetReferences();
      session.dispose();
      this.logSessionDisposal(session, 'gallery-destroy');
    }
    this.u04MappingPending?.cancel(); this.u04MappingPending = null;
    this.u04DecorationPending?.cancel(); this.u04DecorationPending = null;
    this.u04MappingLease?.release(); this.u04MappingLease = null;
    this.u04DecorationLease?.release(); this.u04DecorationLease = null;
    this.u04Manifest = null;
    if (this.u04LandscapeMode) { view.setDesignResolutionSize(720,1280,ResolutionPolicy.FIXED_WIDTH); this.u04LandscapeMode=false; }
    this.touristState?.detach();
    this.touristState = null;
    for (const item of this.overviewTourists) item.state.detach();
    this.overviewTourists = [];
    input.off(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.off(Input.EventType.MOUSE_MOVE, this.onMenuMouseMove, this);
    input.off(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    this.closeOverviewClipboardFallback();
    view.off('canvas-resize', this.layoutScene, this);
    view.off('design-resolution-changed', this.layoutScene, this);
    this.viewportAdapter?.dispose();
  }

  private createViewportAdapter(): ViewportAdapter {
    const platform: any = (sys as any).platform;
    const platforms: any = (sys as any).Platform ?? {};
    if (platform === platforms.WECHAT_GAME) return new WeChatViewportAdapter();
    if (platform === platforms.BYTEDANCE_MINI_GAME || platform === platforms.BYTEDANCE_MINI_PROGRAM) return new DouyinViewportAdapter();
    return new WebViewportAdapter(() => {
      const canvas = (globalThis as any).document?.querySelector('canvas') as HTMLCanvasElement | null;
      const box = canvas?.getBoundingClientRect();
      const rect: any = (view as any).getViewportRect?.();
      if (!canvas || !box || !rect) return null;
      return { visibleSize: view.getVisibleSize(), canvasRect: { x: box.left, y: box.top, width: box.width, height: box.height },
        viewportRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        backbufferWidth: canvas.width, backbufferHeight: canvas.height };
    });
  }

  private showTextReader(title: string, text: string, action: { label: string; run: () => void } | null = null): void {
    if (!this.page?.isValid) return;
    if (!this.textReader?.root.isValid) this.textReader = new ScrollableTextPanel(this.page, value => this.uiPixels(value), () => {
      this.menuMouseDown = null; this.overviewMouseTarget = null;
      this.menuScrollY = this.menuScrollStartY = null; this.menuScrollGesture = false;
      this.overviewShopScrollY = this.overviewShopScrollStartY = null; this.overviewShopScrollGesture = false;
    });
    this.textReader.open(title, text, action);
    this.textReader.layout(view.getVisibleSize(), this.safeUiBounds());
  }

  private isDescendantOf(node: Node, ancestor: Node | null): boolean {
    if (!ancestor?.isValid) return false;
    for (let current: Node | null = node; current; current = current.parent) if (current === ancestor) return true;
    return false;
  }

  private safeUiBounds(visible: { width: number; height: number } = view.getVisibleSize()): { left: number; right: number; bottom: number; top: number } {
    const mapped = ViewportMapper.safeUiRect(this.viewportSnapshot, visible);
    if (!mapped || mapped.width <= 0 || mapped.height <= 0) return {
      left: -visible.width / 2 + 12, right: visible.width / 2 - 12,
      bottom: -visible.height / 2 + 8, top: visible.height / 2 - 8,
    };
    return { left: mapped.x, right: mapped.x + mapped.width,
      bottom: mapped.y, top: mapped.y + mapped.height };
  }

  private uiPixels(value: number, visible: { width: number; height: number } = view.getVisibleSize()): number {
    return ViewportMapper.logicalPixelsToUI(value, this.viewportSnapshot, visible);
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
      node.on(Node.EventType.TOUCH_START, () => this.buttonPointerRevision.set(node, this.viewportSnapshot?.revision ?? 0));
      if (pressFeedback) {
        node.on(Node.EventType.TOUCH_START, () => this.paintButtonState(node, 'pressed'));
      }
      node.on(Node.EventType.TOUCH_CANCEL, () => { this.buttonPointerRevision.delete(node); if (pressFeedback) this.paintButtonState(node, 'normal'); });
      node.on(Node.EventType.TOUCH_END, (event) => {
        event.propagationStopped = true;
        const startRevision = this.buttonPointerRevision.get(node);
        this.buttonPointerRevision.delete(node);
        if (pressFeedback) this.paintButtonState(node, 'normal');
        if (startRevision !== undefined && startRevision !== this.viewportSnapshot?.revision) return;
        if (this.isDescendantOf(node, this.overviewShopBodyContent) &&
            (this.overviewShopScrollGesture || !this.isInside(this.overviewShopBodyViewport!, event.getUILocation()))) return;
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
    const retiringSession = !this.preserveAssetSessionOnClear ? this.pageAssetSession : null;
    if (retiringSession) {
      this.pageAssetSession = null;
      this.clearOptimizedAssetReferences();
    }
    this.u01Editor?.dispose();
    this.u01Editor = null;
    this.u05Lab = null;
    this.restoreOverviewProfiler();
    for (const item of this.overviewTourists) item.state.detach();
    this.overviewTourists = [];
    this.disabledControls.clear();
    this.buttonPointerRevision.clear();
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
    this.overviewShopAdjustPanel = this.overviewShopAdjustOverlay = null;
    this.overviewShopBodyViewport = this.overviewShopBodyContent = null;
    this.textReader?.root.destroy(); this.textReader = null;
    this.overviewShopScrollOffset = this.overviewShopMaxScroll = 0;
    this.overviewShopScrollY = null; this.overviewShopScrollGesture = false;
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
    this.overviewGroupToggleContainer = this.overviewCountContainer = null;
    this.overviewGroupVisible = { street: true, tourists: true, shops: true };
    this.overviewTouristsVisible = true;
    this.overviewShopsVisible = true;
    this.overviewCountLabel = null;
    if (retiringSession) {
      director.once(Director.EVENT_AFTER_DRAW, () => {
        const before = retiringSession.diagnostics();
        try { retiringSession.dispose(); }
        catch (error) { console.error('[GalleryAssetSession] page release failed', error); }
        this.logSessionDisposal(retiringSession, 'page-exit', before);
      });
    }
  }

  private clearOptimizedAssetReferences(): void {
    this.streetBasePrefab = null;
    this.touristPrefab = null;
    this.touristFrameManifest = null;
    this.touristMountManifest = null;
    this.touristAccessoryManifest = null;
    this.touristBodyFrames = [];
    this.touristAccessoryFrames = [];
    this.shopPrefabs = [];
    this.optimizedSakuraFrames = null;
  }

  private logSessionDisposal(session: GalleryAssetSession, reason: string,
    before = session.diagnostics()): void {
    console.info('[GalleryAssetSession] disposed', JSON.stringify({
      reason, ...before, after: session.diagnostics(),
      moduleInflight: this.assetModules?.getInFlightCount() ?? null,
      derivedLive: this.derivedResolver?.getLiveDerivedCount() ?? null,
      pageBindingsCleared: true,
      listenerCleanupCount: 'NOT_TESTED',
    }));
  }

  private createPageResourceProvider(session: GalleryAssetSession): U01ResourceProvider & {
    bindPrefab(root: Node, moduleId: string): number;
  } {
    return {
      loadPageResource: (path, type, callback) => session.loadPageResource(path, type, callback),
      releasePageResource: (path, type) => session.releasePageResource(path, type),
      bindPrefab: (root, moduleId) => session.applyDerivedFramesInTree(root, moduleId),
    };
  }

  public loadPageResource(path: string, type: unknown,
    callback: (error: Error | null, asset?: unknown) => void): void {
    if (!this.useOptimizedBundles) {
      resources.load(path, type as any, callback as any);
      return;
    }
    if (!this.pageAssetSession) {
      Promise.resolve().then(() => callback(new Error(`当前页面没有资源会话：${path}`)));
      return;
    }
    this.pageAssetSession.loadPageResource(path, type, callback);
  }

  public releasePageResource(path: string, type: unknown): void {
    if (!this.useOptimizedBundles) { resources.release(path, type as any); return; }
    this.pageAssetSession?.releasePageResource(path, type);
  }

  private hasModuleAssets(moduleId: string, assetIds: readonly string[]): boolean {
    const module = CLIENT_ASSET_MODULE_MANIFEST[moduleId];
    return !!module && assetIds.every(assetId => !!module.assets[assetId]);
  }

  private enterPage(pageId: string, moduleIds: readonly string[], build: () => void): void {
    if (!this.useOptimizedBundles) { build(); return; }
    this.clearPage();
    const generation = ++this.assetSessionSerial;
    const token = `gallery-page-${generation}`;
    const session = new GalleryAssetSession(this.assetModules!, this.derivedResolver!,
      CLIENT_ASSET_MODULE_MANIFEST, APPROVED_DERIVED_ASSET_MANIFEST.assets,
      token, generation, () => this.pageAssetSession === session);
    this.pageAssetSession = session;
    const status = this.label(this.page, `${pageId} 正在加载页面资源…`, 0, 44, 21, TEXT, 620, 110);
    status.node.name = `${pageId}ResourceStatus`;
    this.button(this.page, '返回菜单', -150, -60, 180, 56, () => this.openMenu(), true);
    const retry = this.button(this.page, '重试', 150, -60, 150, 56, () => {
      if (this.pageAssetSession === session) this.enterPage(pageId, moduleIds, build);
    }, true);
    retry.active = false;
    void this.loadOptimizedPage(pageId, moduleIds, build, session, status, retry);
  }

  private async loadOptimizedPage(pageId: string, moduleIds: readonly string[], build: () => void,
    session: GalleryAssetSession, status: { node: Node }, retry: Node): Promise<void> {
    try {
      await session.acquireModules(moduleIds);
      await this.prepareOptimizedPageAssets(pageId, session);
      if (this.pageAssetSession !== session) return;
      this.preserveAssetSessionOnClear = true;
      try { build(); }
      finally { this.preserveAssetSessionOnClear = false; }
    } catch (error) {
      if (this.pageAssetSession !== session || !status.node.isValid) return;
      status.node.getComponent(Label)!.string = `${pageId} 资源加载失败：${error instanceof Error ? error.message : String(error)}`;
      retry.active = true;
      console.error('[GalleryAssetSession] page load failed', { pageId, generation: this.assetSessionSerial, error });
    }
  }

  private async prepareOptimizedPageAssets(pageId: string, session: GalleryAssetSession): Promise<void> {
    const get = <T>(module: string, asset: string): T => session.get<T>(module, asset);
    const prepareTourist = async (): Promise<void> => {
      this.touristPrefab = get<Prefab>('tourist', 'touristPrefab');
      this.touristFrameManifest = get<JsonAsset>('tourist', 'touristFrameManifest');
      this.touristMountManifest = get<JsonAsset>('tourist', 'touristMountManifest');
      this.touristAccessoryManifest = get<JsonAsset>('tourist', 'touristAccessoryManifest');
      const frameManifest = this.touristFrameManifest.json as TouristFrameManifest;
      const accessoryManifest = this.touristAccessoryManifest.json as TouristAccessoryManifest;
      if (!Array.isArray(frameManifest.frames) || frameManifest.frames.length !== 40)
        throw new Error(`游客帧清单数量异常：${frameManifest.frames?.length ?? 0}/40`);
      this.touristBodyFrames = await Promise.all(frameManifest.frames.map(item =>
        session.getDerivedFrame('tourist', item.frameId)));
      const exports = accessoryManifest.items.reduce((all: string[], item) => all.concat(item.exports), []);
      if (exports.length !== 4) throw new Error(`游客配件导出数量异常：${exports.length}/4`);
      this.touristAccessoryFrames = await Promise.all(exports.map(path =>
        session.getExportedSpriteFrame('tourist', path)));
      await session.prepareDerivedFrames('tourist');
    };
    const prepareShops = async (): Promise<void> => {
      this.shopPrefabs = [1, 2, 3, 4, 5, 6].map(index => get<Prefab>('shops', `shopPrefab0${index}`));
      await session.prepareDerivedFrames('shops');
    };
    const prepareWorld = async (): Promise<void> => {
      this.streetBasePrefab = get<Prefab>('world', 'streetBasePrefab');
      await session.prepareDerivedFrames('world');
      this.optimizedSakuraFrames = await session.getPrototypeFrames(SAKURA_V03_LAYOUT.prototypes);
    };
    switch (pageId) {
      case 'U00':
        await prepareWorld(); await prepareShops(); await prepareTourist(); break;
      case 'U01':
        await prepareWorld(); await prepareShops(); break;
      case 'U02':
        await prepareTourist(); break;
      case 'U03':
        await prepareShops(); break;
      case 'U04':
        await prepareWorld(); await prepareShops(); break;
      case 'U05':
        await prepareTourist(); await session.prepareDerivedFrames('milk-tea'); break;
      default:
        throw new Error(`未配置页面资源依赖：${pageId}`);
    }
  }

  private openPageFromU01(): (U01ResourceProvider & { bindPrefab(root: Node, moduleId: string): number }) | undefined {
    if (!this.useOptimizedBundles) return undefined;
    const session = this.pageAssetSession;
    if (!session) throw new Error('U01打开时没有捕获页面资源会话');
    return this.createPageResourceProvider(session);
  }

  private openMenu(): void {
    if (this.u04LandscapeMode) { view.setDesignResolutionSize(720,1280,ResolutionPolicy.FIXED_WIDTH); this.u04LandscapeMode=false; }
    this.clearPage();
    this.menuTitle = this.makeNode('MenuTitle', this.page, 660, 68);
    this.label(this.menuTitle, '单元示例', 0, 0, 42, GOLD);
    this.menuContent = this.makeNode('MenuContent', this.page, 660, 1000);
    this.menuContent.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
    this.menuContent.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
      this.menuScrollY = event.getUILocation().y; this.menuScrollStartY=this.menuScrollY; this.menuScrollGesture = false;
    });
    this.menuContent.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
      const y = event.getUILocation().y;
      if (this.menuScrollY !== null) {
        if (this.menuScrollStartY!==null&&Math.abs(y-this.menuScrollStartY)>8) this.menuScrollGesture = true;
        this.menuScrollOffset = this.fingerScrollOffset(this.menuScrollOffset, this.menuMaxScroll, this.menuScrollY, y);
        this.menuScrollY = y; this.layoutScene();
      }
    });
    this.menuContent.on(Node.EventType.TOUCH_END, () => { this.menuScrollY=this.menuScrollStartY=null; });
    this.menuContent.on(Node.EventType.TOUCH_CANCEL, () => { this.menuScrollY=this.menuScrollStartY=null; });
    this.menuContent.on(Node.EventType.MOUSE_WHEEL, (event: EventMouse) => {
      this.menuScrollOffset = Math.max(0, Math.min(this.menuMaxScroll, this.menuScrollOffset - event.getScrollY() * 0.4));
      this.layoutScene();
      event.propagationStopped = true;
    });
    const legacyOverviewReady = !this.useOptimizedBundles && !!this.streetBasePrefab && !!this.touristPrefab && this.shopPrefabs.length === 6
      && !!this.touristFrameManifest?.json && !!this.touristMountManifest?.json
      && !!this.touristAccessoryManifest?.json && this.touristBodyFrames.length === 40;
    const optimizedOverviewReady = this.hasModuleAssets('world', ['streetBasePrefab'])
      && this.hasModuleAssets('shops', ['shopPrefab01','shopPrefab02','shopPrefab03','shopPrefab04','shopPrefab05','shopPrefab06'])
      && this.hasModuleAssets('tourist', ['touristPrefab','touristFrameManifest','touristMountManifest','touristAccessoryManifest']);
    const overviewReady = this.useOptimizedBundles ? optimizedOverviewReady : legacyOverviewReady;
    const overviewFailure = this.useOptimizedBundles ? (optimizedOverviewReady ? '' : '模块资源定义不完整')
      : [!this.streetBasePrefab?'缺少街景 Prefab':null,!this.touristPrefab?'缺少游客 Prefab':null,this.shopPrefabs.length!==6?`店铺 Prefab 数量 ${this.shopPrefabs.length}/6`:null,!this.touristFrameManifest?.json?'游客帧清单缺失':null,!this.touristMountManifest?.json?'挂点清单缺失':null,!this.touristAccessoryManifest?.json?'配饰清单缺失':null,this.touristBodyFrames.length!==40?`游客帧数 ${this.touristBodyFrames.length}/40`:null].filter(Boolean).join('；');
    this.menuCards.push(this.menuCard('U00', '夜市总览',
      overviewReady ? '同屏查看街景、顾客与六间店铺。' : overviewFailure,
      () => this.enterPage('U00', ['world','shops','tourist'], () => this.openOverview()),
      this.useOptimizedBundles || overviewReady));
    this.menuCards.push(this.menuCard('U01', '樱花场景布局',
      '樱花场景布局编辑：选层、移动缩放、调整樱树与灵焰、莲花和倒影。',
      () => this.enterPage('U01', ['world','shops'], () => this.openUnit())));
    this.menuCards.push(this.menuCard('U02', '游客动作与装扮',
      '查看游客的动作、左右朝向与独立装扮。',
      () => this.enterPage('U02', ['tourist'], () => this.openTourist())));
    const legacyShopsReady = !this.useOptimizedBundles && this.shopPrefabs.length === 6 &&
      this.shopPrefabs.every((prefab, index) => this.validShopPrefab(prefab, index));
    const optimizedShopsReady = this.hasModuleAssets('shops', ['shopPrefab01','shopPrefab02','shopPrefab03','shopPrefab04','shopPrefab05','shopPrefab06']);
    const shopsReady = this.useOptimizedBundles ? optimizedShopsReady : legacyShopsReady;
    const shopFailure=this.useOptimizedBundles ? (optimizedShopsReady ? '' : '店铺模块资源定义不完整') : this.shopPrefabs.length!==6?`店铺 Prefab 数量 ${this.shopPrefabs.length}/6`:
      this.shopPrefabs.map((p,i)=>this.validShopPrefab(p,i)?null:`${SHOP_IDS[i]} Prefab/部件缺失`).filter(Boolean).join('；');
    this.menuCards.push(this.menuCard('U03', '六店店铺',
      shopsReady ? '查看六间店铺，并循环切换。' : shopFailure,
      () => this.enterPage('U03', ['shops'], () => this.openShops()),
      this.useOptimizedBundles || shopsReady));
    this.menuCards.push(this.menuCard('U04', '店长对话',
      '切换店长、魂阶段与表情，查看分层对话。',
      () => this.enterPage('U04', ['world','shops',U04_MAPPING_MODULE,U04_DECORATION_MODULE], () => this.openDialogue())));
    this.menuCards.push(this.menuCard('U05', '奶茶小游戏',
      '按订单选料、制作饮品，完成三杯挑战。糖画／炭烤／理发／花灯／投壶：待讨论。',
      () => this.enterPage('U05', ['milk-tea','tourist'], () => this.openU05())));
    this.layoutScene();
  }

  private estimatedLines(text:string,width:number,fontSize:number):number {const columns=Math.max(1,Math.floor(width/Math.max(1,fontSize)));return text.split('\n').reduce((sum,line)=>sum+Math.max(1,Math.ceil(Array.from(line).length/columns)),0);}
  private reloadSampleScene():void {const scene=director.getScene();if(!scene?.name){this.showTextReader('资源重载失败','当前场景身份不可用，无法重新读取序列化资源。请返回场景入口后重试。');return;}director.loadScene(scene.name,error=>{if(error)console.error('[UnitSamples] 场景资源重载失败',error);});}

  private menuCard(id: string, name: string, purpose: string, open: () => void,
    enabled = true): Node {
    const card = this.makeNode(`MenuCard_${id}`, this.menuContent!, 610, 210);
    this.drawRect(card, 0, 0, 610, 210, PANEL);
    this.label(card, `${id} ${name}`, 0, 55, 31, GOLD, 570, 46);
    this.label(card, purpose, 0, 4, 19, TEXT, 566, 50);
    const epoch = this.pageEpoch;
    let entry!: Node;
    entry = this.button(card, enabled ? `进入 ${id}` : '重载示例资源', 0, -68, 250, 48,
      () => this.activateMenuEntry(entry, epoch));
    this.menuEntries.push({ node: entry, open: enabled ? open : () => this.reloadSampleScene() });
    return card;
  }

  private activateMenuEntry(node: Node, epoch: number): void {
    if (epoch !== this.pageEpoch || !node.isValid) return;
    if (this.menuScrollGesture) { this.menuScrollGesture = false; return; }
    const entry = this.menuEntries.find(candidate => candidate.node === node);
    if (!entry) return;
    this.menuEntries = [];
    this.menuMouseDown = null;
    entry.open();
  }

  private openU05(): void {
    this.clearPage();
    this.u05ProfilerWasShowing=profiler.isShowingStats();
    profiler.hideStats();
    const host = this.makeNode('U05LabHost', this.page, 720, 1280);
    host.active = false;
    this.u05Lab = host.addComponent(U05MilkTeaLab);
    this.u05Lab.configureViewportAdapter(this.viewportAdapter);
    const resourceProvider = this.useOptimizedBundles && this.pageAssetSession
      ? this.createPageResourceProvider(this.pageAssetSession) : null;
    const providerAdapter = this.u05Lab as unknown as { configureResourceProvider?: (provider: U01ResourceProvider | null) => void };
    providerAdapter.configureResourceProvider?.(resourceProvider);
    if (this.touristPrefab && this.touristFrameManifest?.json && this.touristMountManifest?.json && this.touristAccessoryManifest?.json) {
      this.u05Lab.configureApprovedCustomer({
        prefab: this.touristPrefab,
        frameManifest: this.touristFrameManifest.json as TouristFrameManifest,
        mountManifest: this.touristMountManifest.json as TouristMountManifest,
        accessoryManifest: this.touristAccessoryManifest.json as TouristAccessoryManifest,
        bodyFrames: this.touristBodyFrames,
        accessoryFrames: this.touristAccessoryFrames,
      });
    }
    host.active = true;
    const epoch = this.pageEpoch;
    const exitAdapter = this.u05Lab as unknown as { setExitHandler?: (handler: () => void) => void; onExit?: (() => void) | null };
    const returnToMenu = () => { if (epoch === this.pageEpoch) { if(this.u05ProfilerWasShowing)profiler.showStats();this.u05ProfilerWasShowing=null;this.openMenu(); } };
    if (exitAdapter.setExitHandler) exitAdapter.setExitHandler(returnToMenu);
    else exitAdapter.onExit = returnToMenu;
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
    this.shopTitle = this.label(this.page, 'U03 六店', 0, 0, 16, GOLD, 240, 56).node;
    this.shopStage = this.makeNode('U03ShopStage', this.page, 620, 820);
    this.shopErrorPanel = this.drawRect(this.shopStage, 0, 0, 490, 180, PANEL);
    this.shopPanelMessage = this.label(this.shopErrorPanel, '01 奶茶店正在加载',
      0, 0, 22, TEXT, 450, 110);
    this.shopIdentity = this.label(this.page, '', 0, 0, 31, GOLD, 580, 56);
    this.shopStatus = this.label(this.page, '', 0, 0, 21, TEXT, 620, 52);
    this.shopStatus.node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;const target=this.failedTarget;const detail=target===null?(this.shopStatus?.string??''): `${this.shopStatus?.string??''}\n\n失败店铺：${SHOP_IDS[target]}（${SHOP_NAMES[target]}）\n当前Prefab数量：${this.shopPrefabs.length}/6\n当前Prefab身份：${this.shopPrefabs[target]?.data?.name??'缺失'}\nPrefab所需名称：${SHOP_PREFAB_NAMES[target]}\n需要部件：ground_contact、body.spriteFrame、sign.spriteFrame。\n重试会重新加载当前序列化场景资源；仍失败时请返回入口检查Creator导入。`;this.showTextReader('U03 完整加载状态',detail);});
    this.shopPrevious = this.button(this.page, '上一店', -150, 0, 220, 88,
      () => this.moveShop(-1, epoch), true);
    this.shopNext = this.button(this.page, '下一店', 150, 0, 220, 88,
      () => this.moveShop(1, epoch), true);
    this.shopRetry = this.button(this.page, '重试', 0, 0, 180, 70,
      () => { if (epoch===this.pageEpoch&&this.failedTarget!==null) this.reloadSampleScene(); }, true);
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
      if (this.useOptimizedBundles) this.pageAssetSession?.applyDerivedFramesInTree(candidate, 'shops');
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
    this.touristNavTitle = this.label(this.page, 'U02 游客装扮', 0, 0, 16, GOLD, 260, 56).node;
    this.touristNavReset = this.button(this.page, '重置', 285, 0, 110, 62,
      () => { if (epoch === this.pageEpoch) this.touristState?.reset(); });

    const stage = this.makeNode('TouristStage', this.page, 590, 520);
    this.touristStage = stage;
    this.touristStagePanel = this.drawRect(stage, 0, 0, 590, 520, PANEL);

    if (this.touristPrefab) {
      const tourist = instantiate(this.touristPrefab);
      tourist.name = 'UG_GHOST_01';
      if (this.useOptimizedBundles) this.pageAssetSession?.applyDerivedFramesInTree(tourist, 'tourist');
      stage.addChild(tourist);
      this.touristView = new TouristView(tourist);
    } else {
      this.label(stage, '游客预制体不可用', 0, 0, 23, TEXT, 530, 60);
    }

    const status = this.label(this.page, '', 0, 0, 19, TEXT, 660, 32);
    const adornment = this.label(this.page, '', 0, 0, 17, MUTED, 660, 32);
    this.touristStatus = status.node;
    this.touristAdornment = adornment.node;
    for(const node of [status.node,adornment.node])node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;const label=node.getComponent(Label);this.showTextReader(node===status.node?'U02 完整状态':'U02 完整装扮说明',label?.string??'');});

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

  private ensureU04Manifest(pageGeneration: number): void {
    if (pageGeneration !== this.u04PageGeneration || this.u04Manifest) return;
    if (this.u04MappingLease || this.u04MappingPending) return;
    const request = this.u04Assets!.acquire(U04_MAPPING_MODULE,
      { token: `u04-mapping-${pageGeneration}`, generation: pageGeneration });
    this.u04MappingPending = request;
    void request.then(lease => {
      if (!this.isValid || pageGeneration !== this.u04PageGeneration || !this.u04Portrait?.isValid) {
        lease.release(); return;
      }
      let manifest: JsonAsset;
      try { manifest = lease.get<JsonAsset>('mapping'); }
      catch (error) { lease.release(); throw error; }
      this.u04MappingPending = null;
      this.u04MappingLease = lease;
      this.u04Manifest = manifest;
      this.refreshDialogue();
    }).catch(error => {
      if (pageGeneration !== this.u04PageGeneration || this.u04MappingPending !== request) return;
      this.u04MappingPending = null;
      if (this.u04Status?.isValid) this.u04Status.string = '映射资源加载失败，请返回后重试';
      console.error('[ModuleAssets] U04映射加载失败 ' + JSON.stringify({
        pageGeneration, error: this.u04ErrorMessage(error),
      }));
    });
  }

  private ensureU04Decoration(pageGeneration: number): void {
    if (pageGeneration !== this.u04PageGeneration || !this.u04Portrait?.isValid) return;
    if (this.u04DecorationLease || this.u04DecorationPending) return;
    const request = this.u04Assets!.acquire(U04_DECORATION_MODULE,
      { token: `u04-decoration-${pageGeneration}`, generation: pageGeneration });
    this.u04DecorationPending = request;
    void request.then(lease => {
      if (pageGeneration !== this.u04PageGeneration || !this.u04Portrait?.isValid) { lease.release(); return; }
      let panel: SpriteFrame, bottomLeft: SpriteFrame, topRight: SpriteFrame;
      try {
        panel = lease.get<SpriteFrame>('panel');
        bottomLeft = lease.get<SpriteFrame>('cornerBottomLeft');
        topRight = lease.get<SpriteFrame>('cornerTopRight');
      } catch (error) { lease.release(); throw error; }
      this.u04DecorationPending = null;
      this.u04DecorationLease = lease;
      if (this.u04Panel?.isValid) {
        this.u04Panel.spriteFrame = panel;
        panel.insetTop = panel.insetBottom = panel.insetLeft = panel.insetRight = 48;
        this.u04Panel.type = Sprite.Type.SLICED;
      }
      const a = this.u04CornerSprites[0], b = this.u04CornerSprites[1];
      if (a?.isValid) a.spriteFrame = bottomLeft;
      if (b?.isValid) b.spriteFrame = topRight;
    }).catch(error => {
      if (pageGeneration !== this.u04PageGeneration || this.u04DecorationPending !== request) return;
      this.u04DecorationPending = null;
      if (this.u04Status?.isValid) this.u04Status.string = '对话界面装饰资源加载失败';
      console.error('[ModuleAssets] U04装饰加载失败 ' + JSON.stringify({
        pageGeneration, error: this.u04ErrorMessage(error),
      }));
    });
  }

  private u04ErrorMessage(error: unknown): string {
    const value = error as { name?: unknown; message?: unknown } | null;
    if (value && typeof value === 'object') {
      const name = typeof value.name === 'string' ? value.name : 'Error';
      const message = typeof value.message === 'string' ? value.message : String(error);
      return `${name}: ${message}`;
    }
    return String(error);
  }

  private releaseU04Page(): void {
    this.u04Generation++;
    this.u04PageGeneration++;
    this.u04Sweep.active = false;
    this.u04SelectionPending?.cancel(); this.u04SelectionPending = null;
    this.u04MappingPending?.cancel(); this.u04MappingPending = null;
    this.u04DecorationPending?.cancel(); this.u04DecorationPending = null;
    for (const sprite of this.u04Sprites) { if (sprite.isValid) sprite.spriteFrame = null; }
    this.u04SelectionLease?.release(); this.u04SelectionLease = null;
    this.u04MappingLease?.release(); this.u04MappingLease = null;
    this.u04Manifest = null;
    this.u04DecorationLease?.release(); this.u04DecorationLease = null;
    this.u04CommittedKey = ''; this.u04CommittedExpression = '';
    if ((globalThis as any).__U04_RUNTIME__) (globalThis as any).__U04_RUNTIME__ = {
      page: 'menu', generation: this.u04Generation, loaded: 0, selectedRefs: [], pageRefs: [], bundleLoaded: false,
    };
    this.u04Sprites = [];
    this.u04Portrait = this.u04BaseNode = this.u04Face = this.u04Front = null;
    this.u04Name = this.u04Status = null;
    this.u04Dialogue = null;
    this.u04Title = null;
    this.u04Panel = null;
    this.u04Back = null;
    this.u04Controls = [];
    this.u04ResizeButtons = [];
    this.u04SweepButton = null;
    this.u04PeopleToggle = null;
    this.u04ControlsOverlay = null;
    this.u04ControlSurface = null;
    this.u04OverlayClose = null;
    this.u04OverlayTitle = null;
    this.u04ReadOverlay = this.u04ReadSurface = this.u04ReadViewport = null;
    this.u04ReadText = null; this.u04ReadOffset = this.u04ReadMaxScroll = 0; this.u04ReadPointerY = null;
    this.u04CornerSprites = [];
  }

  private openDialogue(): void {
    this.clearPage();
    this.u04LandscapeMode = this.viewportSnapshot.orientation === 'landscape';
    view.setDesignResolutionSize(this.u04LandscapeMode ? 1280 : 720,
      this.u04LandscapeMode ? 720 : 1280, ResolutionPolicy.FIXED_WIDTH);
    this.u04Manager = 0; this.u04Stage = 0; this.u04Expression = 3;
    this.u04PanelSizeIndex = 3;
    const visible = view.getVisibleSize();
    const stage = this.makeNode('U04DialogueScene', this.page, visible.width, visible.height);
    if (!this.streetBasePrefab) {
      this.label(stage, 'U00背景资源不可用', 0, 0, 22, TEXT);
      return;
    }
    const background = instantiate(this.streetBasePrefab);
    background.name = 'U00StreetBase';
    if (this.useOptimizedBundles) this.pageAssetSession?.applyDerivedFramesInTree(background, 'world');
    stage.addChild(background);
    populateSakuraV03(background, stage, undefined,
      this.useOptimizedBundles ? this.optimizedSakuraFrames ?? undefined : undefined);
    const entities=this.makeNode('U04_U00ShopLayout',background,3072,1024); entities.setSiblingIndex(3);
    const shopPositions=[[-1079,-234],[-780,-260],[-410,-235],[350,-237],[689,-249],[1030,-249]];
    this.shopPrefabs.forEach((prefab,i)=>{if(!prefab)return;const shop=instantiate(prefab);shop.name=`U00Shop_${i+1}`;if(this.useOptimizedBundles)this.pageAssetSession?.applyDerivedFramesInTree(shop,'shops');entities.addChild(shop);const scale=0.34;shop.setScale(scale,scale,1);const contactY=shop.getChildByName('ground_contact')?.position.y??-388;shop.setPosition(shopPositions[i][0],shopPositions[i][1]-contactY*scale,0);});
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
    this.u04Title = this.label(controls, 'U04 店长对话', 0, 0, 16, GOLD, 300, 52);
    const sweepButton = this.button(controls, '巡检90组', 0, 0, 150, 50, () => this.startU04Sweep(), true);
    this.u04SweepButton = sweepButton;
    this.u04Controls.push(sweepButton);
    const peopleToggle = this.button(controls, '人物与表情', 0, 0, 156, 52,
      () => { if (this.u04ControlsOverlay) this.u04ControlsOverlay.active = true; this.layoutDialogue(view.getVisibleSize()); }, true);
    this.u04PeopleToggle = peopleToggle;
    this.u04Controls.push(peopleToggle);
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
    const decoA = this.makeNode('U04CornerBottomLeft', stage, 128, 96); const sa=decoA.addComponent(Sprite); sa.sizeMode=Sprite.SizeMode.CUSTOM; this.u04Sprites.push(sa);
    const decoB = this.makeNode('U04CornerTopRight', stage, 128, 96); const sb=decoB.addComponent(Sprite); sb.sizeMode=Sprite.SizeMode.CUSTOM; this.u04Sprites.push(sb);
    this.u04CornerSprites = [sa, sb];
    this.u04Name = this.label(stage, '', 0, 0, 28, GOLD, 470, 46);
    this.u04Dialogue = this.label(stage, '这里是演示对白文本。', 0, 0, 22, TEXT, 470, 100);
    this.u04Dialogue.horizontalAlign = Label.HorizontalAlign.LEFT;
    this.u04Name!.horizontalAlign = Label.HorizontalAlign.LEFT;
    this.u04Dialogue.node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
      event.propagationStopped = true;
      if (this.u04ReadOverlay) { this.u04ReadOverlay.active = true; this.layoutDialogue(view.getVisibleSize()); }
    });
    this.u04Status = this.label(stage, '正在加载店长资源…', 0, 0, 16, MUTED, 620, 34);
    const overlay = this.makeNode('U04PeopleOverlay', stage, visible.width, visible.height);
    overlay.active = false;
    overlay.on(Node.EventType.TOUCH_START, (event: any) => { event.propagationStopped = true; });
    overlay.on(Node.EventType.TOUCH_END, (event: any) => { event.propagationStopped = true; });
    this.u04ControlsOverlay = overlay;
    const shade = this.drawRect(overlay, 0, 0, visible.width, visible.height, new Color(4, 12, 20, 190));
    shade.name = 'U04OverlayShade';
    const controlSurface = this.drawRect(overlay, 0, 0, Math.max(264, visible.width - 24), Math.max(360, Math.min(520, visible.height - 32)), PANEL);
    controlSurface.name = 'U04ControlSurface';
    this.u04ControlSurface = controlSurface;
    this.u04OverlayTitle = this.label(controlSurface, '人物与表情', 0, 0, 20, GOLD, 280, 48);
    this.u04OverlayClose = this.button(controlSurface, '关闭', 0, 0, 100, 48, () => {
      if (this.u04ControlsOverlay) this.u04ControlsOverlay.active = false;
      this.layoutDialogue(view.getVisibleSize());
    }, true);
    const managerButtons = this.makeNode('U04ManagerControls', controlSurface, 630, 112);
    U04_MANAGERS.forEach((m,i)=>this.u04Controls.push(this.button(managerButtons,m.name,-250+i*100,0,96,64,()=>{this.u04Manager=i;this.refreshDialogue();},true)));
    const stageButtons = this.makeNode('U04StageExpressionControls', controlSurface, 760, 208);
    U04_STAGES.forEach((st,i)=>this.u04Controls.push(this.button(stageButtons,`${st}魂`,-340+i*96,0,88,46,()=>{this.u04Stage=i;this.refreshDialogue();},true)));
    U04_EXPRESSIONS.forEach((e,i)=>this.u04Controls.push(this.button(stageButtons,e.name,-52+i*96,0,88,46,()=>{this.u04Expression=i;this.refreshDialogue();},true)));
    // Make the complete composed portrait a child of the panel; stage-level
    // corners and labels remain above it in the scene draw order.
    portraitMask.setParent(panelNode);
    shrinkPanel.setParent(controlSurface); growPanel.setParent(controlSurface);
    this.u04OverlayClose.setSiblingIndex(controlSurface.children.length - 1);
    this.u04OverlayClose.active = true;
    this.u04Controls.push(...controlSurface.children.filter(node => node.name.startsWith('Button_')));
    sweepButton.setParent(controlSurface);
    const readOverlay = this.makeNode('U04DialogueReader', stage, visible.width, visible.height);
    readOverlay.active = false;
    readOverlay.setSiblingIndex(stage.children.length - 1);
    readOverlay.on(Node.EventType.TOUCH_START, (event: EventTouch) => { event.propagationStopped = true; });
    this.u04ReadOverlay = readOverlay;
    const readShade = this.drawRect(readOverlay, 0, 0, visible.width, visible.height, new Color(4, 12, 20, 205));
    readShade.name = 'U04ReaderShade';
    const readSurface = this.drawRect(readOverlay, 0, 0, 420, 600, PANEL);
    readSurface.name = 'U04ReaderSurface'; this.u04ReadSurface = readSurface;
    const readTitle = this.label(readSurface, '对白阅读', 0, 0, 20, GOLD, 280, 48);
    readTitle.node.name = 'U04ReaderTitle';
    this.button(readSurface, '关闭', 0, 0, 100, 48, () => {
      if (this.u04ReadOverlay) this.u04ReadOverlay.active = false;
    }, true).name = 'Button_U04ReaderClose';
    const readViewport = this.makeNode('U04ReaderViewport', readSurface, 380, 500);
    readViewport.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
    readViewport.addComponent(Graphics);
    readViewport.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
      this.u04ReadPointerY = event.getUILocation().y; event.propagationStopped = true;
    });
    readViewport.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
      const y = event.getUILocation().y;
      if (this.u04ReadPointerY !== null) {
        this.u04ReadOffset = this.fingerScrollOffset(this.u04ReadOffset, this.u04ReadMaxScroll, this.u04ReadPointerY, y);
        this.u04ReadPointerY = y; this.layoutDialogue(view.getVisibleSize());
      }
      event.propagationStopped = true;
    });
    readViewport.on(Node.EventType.TOUCH_END, () => { this.u04ReadPointerY = null; });
    readViewport.on(Node.EventType.TOUCH_CANCEL, () => { this.u04ReadPointerY = null; });
    this.u04ReadViewport = readViewport;
    this.u04ReadText = this.label(readViewport, '', 0, 0, 16, TEXT, 360, 500);
    this.u04ReadText.horizontalAlign = Label.HorizontalAlign.LEFT;
    this.u04ReadText.verticalAlign = Label.VerticalAlign.TOP;
    this.u04ReadText.overflow = Label.Overflow.CLAMP;
    this.u04ReadText.enableWrapText = true;
    const cameraNode=this.makeNode('U04_U00Camera',this.page); cameraNode.active=false;
    const camera=cameraNode.addComponent(Scene1CameraController); camera.layers=backgroundLayers;
    camera.resetCameraX=-266; camera.synchronizedNodes=[entities]; camera.viewport=stage;
    camera.uiCaptureRoot=overlay; camera.uiCaptureNodes=this.u04Controls; cameraNode.active=true; camera.reset();
    this.layoutDialogue(visible);
    this.refreshDialogue();
    const pageGeneration = this.u04PageGeneration;
    this.ensureU04Manifest(pageGeneration);
    this.ensureU04Decoration(pageGeneration);
  }

  private refreshDialogue(): void {
    if (!this.u04Portrait?.isValid) return;
    const key = this.u04Key();
    const mapping = ((this.u04Manifest?.json as any)?.stages)?.[key.toUpperCase()];
    if (!mapping) {
      if (this.u04Status) this.u04Status.string = '正在加载有效的图层映射…';
      this.publishU04Runtime();
      return;
    }
    this.u04SelectionPending?.cancel();
    const generation = ++this.u04Generation;
    const pageGeneration = this.u04PageGeneration;
    const expression = U04_EXPRESSIONS[this.u04Expression].key;
    this.u04Status!.string = `正在载入 ${key} / ${U04_EXPRESSIONS[this.u04Expression].name}…`;
    this.publishU04Runtime();
    const request = this.u04Assets!.acquire(u04PortraitModuleId(key, expression),
      { token: `u04-selection-${pageGeneration}-${generation}`, generation });
    this.u04SelectionPending = request;
    void request.then(lease => {
      if (pageGeneration !== this.u04PageGeneration || generation !== this.u04Generation || !this.u04Portrait?.isValid) {
        lease.release(); return;
      }
      let frames: SpriteFrame[];
      try { frames = [lease.get<SpriteFrame>('base'), lease.get<SpriteFrame>('face'), lease.get<SpriteFrame>('front')]; }
      catch (error) { lease.release(); throw error; }
      const oldLease = this.u04SelectionLease;
      this.u04Sprites.slice(0, 3).forEach((sprite, index) => { if (sprite.isValid) sprite.spriteFrame = frames[index]; });
      this.applyU04Geometry(key, mapping);
      this.u04SelectionLease = lease;
      this.u04SelectionPending = null;
      this.u04CommittedKey = key;
      this.u04CommittedExpression = expression;
      this.u04Name!.string = U04_MANAGERS[this.u04Manager].name + ` · ${U04_STAGES[this.u04Stage]}魂`;
      this.u04Status!.string = `${key} / ${U04_EXPRESSIONS[this.u04Expression].name} · 三层就绪`;
      oldLease?.release();
      this.publishU04Runtime();
    }).catch(error => {
      if (pageGeneration !== this.u04PageGeneration || generation !== this.u04Generation
        || this.u04SelectionPending !== request) return;
      this.u04SelectionPending = null;
      if (this.u04Status?.isValid)
        this.u04Status.string = `目标 ${key} 加载失败，保留当前画面；可重新选择或返回`;
      console.error('[ModuleAssets] U04人物三层加载失败 ' + JSON.stringify({
        key, expression, pageGeneration, generation, error: this.u04ErrorMessage(error),
      }));
      this.publishU04Runtime();
    });
  }

  private applyU04Geometry(key: string, mapping: any): void {
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
      generation: this.u04Generation, pageGeneration: this.u04PageGeneration,
      selectedKey: this.u04CommittedKey, selectedExpression: this.u04CommittedExpression,
      selectedOwner: this.u04SelectionLease?.owner.token ?? null,
      selectedRefs: this.u04SelectionLease ? 3 : 0, decorationRefs: this.u04DecorationLease ? 3 : 0,
      mappingRefs: this.u04MappingLease ? 1 : 0, bundleLoaded: !!this.u04Assets,
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
    const safe = this.safeUiBounds(visible);
    const logical = (value: number): number => this.uiPixels(value, visible);
    const safeWidth = Math.max(1, safe.right - safe.left), safeHeight = Math.max(1, safe.top - safe.bottom);
    const centerX = (safe.left + safe.right) / 2;
    const top = safe.top, bottom = safe.bottom;
    const navHeight = logical(56), inset = logical(8), gap = logical(8);
    const controls=stage?.getChildByName('U04Controls');
    controls?.getComponent(UITransform)?.setContentSize(visible.width, navHeight);
    controls?.setPosition(0, top - navHeight / 2, 0);
    const buttonSize = (node: Node | null, width: number, height: number, font = 16): void => {
      if (!node?.isValid) return;
      node.getComponent(UITransform)?.setContentSize(width, height);
      this.syncButtonDrawing(node);
      const label = node.getChildByName('Text')?.getComponent(Label);
      if (label) { label.fontSize = logical(font); label.lineHeight = logical(font + 4); label.overflow = Label.Overflow.CLAMP; }
    };
    const navButtonH = Math.max(navHeight, logical(48));
    const backW = logical(84), toggleW = logical(112);
    buttonSize(this.u04Back, backW, navButtonH);
    buttonSize(this.u04PeopleToggle, toggleW, navButtonH);
    this.u04Back?.setPosition(safe.left + backW / 2, 0, 0);
    this.u04Title?.node.setPosition(centerX, 0, 0);
    this.u04Title?.node.getComponent(UITransform)?.setContentSize(Math.max(1, safeWidth - backW - toggleW - 4 * gap), navHeight);
    if (this.u04Title) { this.u04Title.fontSize = logical(16); this.u04Title.lineHeight = logical(24); this.u04Title.overflow = Label.Overflow.CLAMP; this.u04Title.enableWrapText = false; }
    this.u04PeopleToggle?.setPosition(safe.right - toggleW / 2, 0, 0);
    const panel=this.u04Panel?.node;
    const requestedSize=U04_PANEL_SIZES[this.u04PanelSizeIndex];
    const portraitPanelHeight=Math.min(logical(156),safeHeight*.34);
    const landscapeFit=Math.min(1,safeWidth/Math.max(1,requestedSize.width),safeHeight/Math.max(1,requestedSize.height));
    const panelWidth=this.u04LandscapeMode?requestedSize.width*landscapeFit:safeWidth;
    const panelHeight=this.u04LandscapeMode?requestedSize.height*landscapeFit:portraitPanelHeight;
    const panelX = centerX, panelY = bottom + panelHeight / 2;
    panel?.setPosition(panelX, panelY, 0);
    panel?.getComponent(UITransform)?.setContentSize(panelWidth,panelHeight);
    const portraitFactor = this.u04LandscapeMode
      ? Math.min(visible.width / 1280, visible.height / 720)
      : Math.min(1, Math.max(0, (top - navHeight - (panelY + panelHeight / 2) - gap) / 500));
    const portraitScale = this.u04LandscapeMode
      ? Math.min(portraitFactor, portraitFactor * Math.max(96, panelWidth * 0.38) / Math.max(1, this.u04CropWidth))
      : Math.min(portraitFactor, Math.max(0, (safeWidth - 2 * inset) / Math.max(1, this.u04CropWidth)));
    const portraitWidth=this.u04CropWidth*portraitScale;
    const portraitHeight=500*portraitScale;
    const portraitMask=this.u04Portrait.parent;
    portraitMask?.setScale(portraitScale,portraitScale,1);
    portraitMask?.getComponent(UITransform)?.setContentSize(this.u04CropWidth,500);
    if (this.u04LandscapeMode) {
      portraitMask?.setPosition(panelX - panelWidth / 2 + portraitWidth / 2 + inset,
        -panelHeight / 2 + inset + portraitHeight / 2, 0);
    } else {
      portraitMask?.setPosition(0, panelHeight / 2 + portraitHeight / 2 - gap, 0);
    }
    const contentLeft = panelX - panelWidth / 2 + inset;
    const contentRight = panelX + panelWidth / 2 - inset;
    const portraitRight = this.u04LandscapeMode ? panelX - panelWidth / 2 + portraitWidth + 2 * inset : contentLeft;
    const textLeft = this.u04LandscapeMode ? Math.max(contentLeft, portraitRight) : contentLeft;
    const textWidth = Math.max(logical(96), contentRight - textLeft);
    const nameHeight = logical(28);
    const name=this.u04Name?.node;
    name?.getComponent(UITransform)?.setContentSize(textWidth, nameHeight);
    name?.setPosition(textLeft + textWidth / 2, panelY + panelHeight * 0.76, 0);
    if(this.u04Name) { this.u04Name.fontSize=logical(18); this.u04Name.lineHeight=logical(26); this.u04Name.overflow=Label.Overflow.CLAMP; }
    this.u04Dialogue?.node.getComponent(UITransform)?.setContentSize(textWidth, Math.max(logical(48), panelHeight * 0.43));
    this.u04Dialogue?.node.setPosition(textLeft + textWidth / 2, panelY + panelHeight * 0.37, 0);
    if(this.u04Dialogue) { this.u04Dialogue.fontSize=logical(16); this.u04Dialogue.lineHeight=logical(24); this.u04Dialogue.overflow=Label.Overflow.CLAMP; }
    this.u04Status?.node.getComponent(UITransform)?.setContentSize(textWidth, logical(20));
    this.u04Status?.node.setPosition(textLeft + textWidth / 2, panelY + panelHeight * 0.12, 0);
    if(this.u04Status) { this.u04Status.fontSize=logical(14); this.u04Status.lineHeight=logical(20); this.u04Status.overflow=Label.Overflow.CLAMP; }
    this.u04CornerSprites[0]?.node.setPosition(panelX-panelWidth/2+logical(32),bottom+logical(24),0);
    this.u04CornerSprites[1]?.node.setPosition(panelX+panelWidth/2-logical(32),bottom+panelHeight-logical(24),0);

    const overlay = this.u04ControlsOverlay;
    overlay?.getComponent(UITransform)?.setContentSize(visible.width, visible.height);
    overlay?.setPosition(0, 0, 0);
    const shade = overlay?.getChildByName('U04OverlayShade');
    if (shade) { shade.getComponent(UITransform)?.setContentSize(visible.width, visible.height);
      this.paintRect(shade, shade.getComponent(Graphics)!, visible.width, visible.height, new Color(4,12,20,190)); }
    const managerControls = this.u04ControlSurface?.getChildByName('U04ManagerControls');
    const otherControls = this.u04ControlSurface?.getChildByName('U04StageExpressionControls');
    const surfaceWidth = Math.min(safeWidth, logical(420));
    const surfaceHeight = Math.min(safeHeight - 2 * inset, logical(432));
    const surfaceX = centerX, surfaceY = (safe.top + safe.bottom) / 2;
    this.u04ControlSurface?.getComponent(UITransform)?.setContentSize(surfaceWidth, surfaceHeight);
    this.u04ControlSurface?.setPosition(surfaceX, surfaceY, 0);
    if (this.u04ControlSurface) this.paintRect(this.u04ControlSurface, this.u04ControlSurface.getComponent(Graphics)!, surfaceWidth, surfaceHeight, PANEL);
    const rowHeight = logical(48), rowGap = gap, colGap = gap;
    const rowTop = surfaceHeight / 2 - inset - logical(64);
    const colWidth = (surfaceWidth - 2 * inset - 2 * colGap) / 3;
    const allManager = managerControls?.children ?? [];
    allManager.forEach((button, index) => {
      const row = Math.floor(index / 3), col = index % 3;
      buttonSize(button, colWidth, rowHeight, 16);
      button.setPosition(-surfaceWidth/2 + inset + colWidth/2 + col*(colWidth+colGap), rowTop - row*(rowHeight+rowGap), 0);
    });
    const allOther = otherControls?.children ?? [];
    allOther.forEach((button, index) => {
      const row = index < 3 ? 2 : 3 + Math.floor((index - 3) / 3);
      const col = index < 3 ? index : (index - 3) % 3;
      buttonSize(button, colWidth, rowHeight, 16);
      button.setPosition(-surfaceWidth/2 + inset + colWidth/2 + col*(colWidth+colGap), rowTop - row*(rowHeight+rowGap), 0);
    });
    const close = this.u04OverlayClose;
    buttonSize(close, colWidth, rowHeight, 16);
    close?.setPosition(surfaceWidth/2 - inset - colWidth/2, surfaceHeight/2 - inset - rowHeight/2, 0);
    if (this.u04OverlayTitle) {
      const titleWidth = Math.max(1, surfaceWidth - colWidth - 3 * inset);
      this.u04OverlayTitle.node.getComponent(UITransform)?.setContentSize(titleWidth, rowHeight);
      this.u04OverlayTitle.node.setPosition(-surfaceWidth / 2 + inset + titleWidth / 2,
        surfaceHeight / 2 - inset - rowHeight / 2, 0);
      this.u04OverlayTitle.fontSize = logical(20);
      this.u04OverlayTitle.lineHeight = logical(28);
      this.u04OverlayTitle.overflow = Label.Overflow.CLAMP;
      this.u04OverlayTitle.horizontalAlign = Label.HorizontalAlign.LEFT;
    }
    this.u04ResizeButtons.forEach((button, index) => {
      buttonSize(button, colWidth, rowHeight, 14);
      const column=index===0?0:2;
      button.setPosition(-surfaceWidth/2 + inset + colWidth/2 + column*(colWidth+colGap),
        -surfaceHeight/2 + inset + rowHeight/2, 0);
    });
    buttonSize(this.u04SweepButton,colWidth,rowHeight,14);
    this.u04SweepButton?.setPosition(0,-surfaceHeight/2+inset+rowHeight/2,0);
    if (this.u04PeopleToggle) this.u04PeopleToggle.active = true;

    const reader = this.u04ReadOverlay;
    reader?.getComponent(UITransform)?.setContentSize(visible.width, visible.height);
    reader?.setPosition(0, 0, 0);
    const readerShade = reader?.getChildByName('U04ReaderShade');
    if (readerShade) { readerShade.getComponent(UITransform)?.setContentSize(visible.width, visible.height);
      this.paintRect(readerShade, readerShade.getComponent(Graphics)!, visible.width, visible.height, new Color(4,12,20,205)); }
    const readerWidth = Math.min(safeWidth, logical(420));
    const readerHeight = Math.min(safeHeight - 2 * inset, logical(600));
    this.u04ReadSurface?.getComponent(UITransform)?.setContentSize(readerWidth, readerHeight);
    this.u04ReadSurface?.setPosition(centerX, (top + bottom) / 2, 0);
    if (this.u04ReadSurface) this.paintRect(this.u04ReadSurface, this.u04ReadSurface.getComponent(Graphics)!, readerWidth, readerHeight, PANEL);
    const readerHeader = logical(56), readerInset = logical(12);
    const readerTitle = this.u04ReadSurface?.getChildByName('U04ReaderTitle');
    readerTitle?.getComponent(UITransform)?.setContentSize(readerWidth - logical(120), readerHeader);
    readerTitle?.setPosition(-readerWidth / 2 + (readerWidth - logical(120)) / 2 + readerInset, readerHeight/2-readerHeader/2, 0);
    const readerClose = this.u04ReadSurface?.getChildByName('Button_U04ReaderClose');
    buttonSize(readerClose ?? null, logical(96), readerHeader, 16);
    readerClose?.setPosition(readerWidth/2-logical(60), readerHeight/2-readerHeader/2, 0);
    const readerBodyHeight = Math.max(1, readerHeight-readerHeader-readerInset);
    const readerViewportWidth=readerWidth-2*readerInset;
    this.u04ReadViewport?.getComponent(UITransform)?.setContentSize(readerViewportWidth,readerBodyHeight);
    this.u04ReadViewport?.setPosition(0,-readerHeader/2,0);
    const readerMask=this.u04ReadViewport?.getComponent(Graphics);if(readerMask){readerMask.clear();readerMask.rect(-readerViewportWidth/2,-readerBodyHeight/2,readerViewportWidth,readerBodyHeight);readerMask.fill();}
    const readerText = this.u04ReadText;
    if (readerText) {
      const textWidth = readerWidth-2*readerInset-logical(16), font = logical(16), line = logical(24);
      const fullText = `${this.u04Name?.string ?? ''}\n\n${this.u04Dialogue?.string ?? ''}\n\n${this.u04Status?.string ?? ''}`;
      readerText.string = fullText; readerText.fontSize = font; readerText.lineHeight = line;
      readerText.enableWrapText = true; readerText.overflow = Label.Overflow.CLAMP;
      readerText.horizontalAlign = Label.HorizontalAlign.LEFT; readerText.verticalAlign = Label.VerticalAlign.TOP;
      const columns = Math.max(1, Math.floor(textWidth / Math.max(1,font)));
      const lines = fullText.split('\n').reduce((sum, part) => sum + Math.max(1, Math.ceil(part.length / columns)), 0);
      const fullHeight = Math.max(readerBodyHeight, lines*line+readerInset);
      readerText.node.getComponent(UITransform)?.setContentSize(textWidth,fullHeight);
      this.u04ReadMaxScroll = Math.max(0,fullHeight-readerBodyHeight);
      this.u04ReadOffset = Math.max(0,Math.min(this.u04ReadOffset,this.u04ReadMaxScroll));
      readerText.node.setPosition(0,readerBodyHeight/2-fullHeight/2+this.u04ReadOffset,0);
    }
  }

  private openUnit(): void {
    this.clearPage();
    this.overviewProfilerWasShowing = profiler.isShowingStats();
    profiler.hideStats();
    this.u01Editor = new U01SakuraLayoutEditor(this.page, this, this.openPageFromU01());
    this.u01Editor.open();
    this.layoutScene();
  }

  /** U01-only exit hook; clearing the page also removes its pointer and resize bindings. */
  public openMenuFromU01(): void {
    this.u01Editor?.dispose();
    this.u01Editor = null;
    this.openMenu();
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
    if (this.useOptimizedBundles) this.pageAssetSession?.applyDerivedFramesInTree(background, 'world');
    this.overviewScene.addChild(background);
    populateSakuraV03(background, this.overviewScene, USER_LAYOUT_PROFILE.instances,
      this.useOptimizedBundles ? this.optimizedSakuraFrames ?? undefined : undefined);
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
      if (this.useOptimizedBundles) this.pageAssetSession?.applyDerivedFramesInTree(shop, 'shops');
      this.overviewShops.addChild(shop);
      this.overviewShopNodes.push(shop);
      shop.setSiblingIndex(i);
      this.applyOverviewShopFootpoint(i);
    }

    const ui = this.makeNode('U00_Controls', this.overviewScene, 720, 1280);
    const top = this.makeNode('U00_TopControls', ui, 680, 86);
    this.button(top, '返回菜单', -250, 0, 150, 58, () => this.openMenu(), true);
    this.label(top, 'U00 夜市总览', 30, 0, 28, GOLD, 220, 54);
    this.overviewShopAdjustToggle = this.button(top, '调节面板', 255, 0, 144, 58,
      () => this.toggleOverviewShopAdjust(), true);
    const toggles = this.makeNode('U00_GroupToggles', ui, 690, 58);
    this.overviewGroupToggleContainer = toggles;
    this.overviewGroupButtons.street = this.overviewToggle(toggles, '街景：显示', -230, 'street');
    this.overviewGroupButtons.tourists = this.overviewToggle(toggles, '顾客：显示', 0, 'tourists');
    this.overviewGroupButtons.shops = this.overviewToggle(toggles, '店铺：显示', 230, 'shops');
    const count = this.makeNode('U00_CountControls', ui, 360, 58);
    this.overviewCountContainer = count;
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
      this.overviewShopAdjustOverlay ? [this.overviewShopAdjustOverlay] : []);
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
    this.overviewShopActionButtons = {};
    const overlay = this.makeNode('U00_ShopAdjustOverlay', parent, 720, 1280);
    overlay.active = false;
    const shade = overlay.addComponent(Graphics); shade.fillColor = new Color(4,12,20,190);
    shade.rect(-360,-640,720,1280); shade.fill();
    overlay.on(Node.EventType.TOUCH_START, (event: EventTouch) => { this.overviewShopScrollY=event.getUILocation().y; this.overviewShopScrollStartY=this.overviewShopScrollY; this.overviewShopScrollGesture=false; event.propagationStopped=true; });
    overlay.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
      const y=event.getUILocation().y;
      if(this.overviewShopScrollY!==null){if(this.overviewShopScrollStartY!==null&&Math.abs(this.overviewShopScrollStartY-y)>8)this.overviewShopScrollGesture=true;
        this.overviewShopScrollOffset=this.fingerScrollOffset(this.overviewShopScrollOffset,this.overviewShopMaxScroll,this.overviewShopScrollY,y);
        this.overviewShopScrollY=y;this.layoutOverview();}
      event.propagationStopped=true;
    });
    overlay.on(Node.EventType.TOUCH_END,()=>{this.overviewShopScrollY=this.overviewShopScrollStartY=null;});
    overlay.on(Node.EventType.TOUCH_CANCEL,()=>{this.overviewShopScrollY=this.overviewShopScrollStartY=null;});
    overlay.on(Node.EventType.MOUSE_WHEEL,(event:EventMouse)=>{this.overviewShopScrollOffset=Math.max(0,Math.min(this.overviewShopMaxScroll,this.overviewShopScrollOffset-event.getScrollY()*0.4));this.layoutOverview();event.propagationStopped=true;});
    this.overviewShopAdjustOverlay=overlay;
    const panel = this.drawRect(overlay, 0, 0, 672, 570, PANEL);
    panel.name = 'U00_ShopAdjustPanel';
    panel.active = false;
    this.overviewShopAdjustPanel = panel;
    this.label(panel, '临时调整预览 · 离开 U00 后恢复初始值', 0, 205, 19, GOLD, 630, 36);
    const action=(name:string,x:number,y:number,w:number,h:number,onTouch:()=>void):Node=>{
      const node=this.button(panel,name,x,y,w,h,onTouch,true);this.overviewShopActionButtons[name]=node;return node;
    };
    action('关闭',0,0,104,48,()=>this.toggleOverviewShopAdjust()).name='Button_关闭';
    action('店铺',-90,165,130,40,()=>this.setOverviewAdjustTarget('shops'));
    action('顾客',90,165,130,40,()=>this.setOverviewAdjustTarget('tourists'));
    action('上一项',-250,112,104,44,()=>this.selectOverviewShop(-1));
    this.overviewShopNameLabel = this.label(panel, '', 0, 125, 19, TEXT, 260, 42).node;
    this.overviewShopNameLabel.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;this.showTextReader('U00 当前对象完整信息',this.overviewShopFullDetail());});
    action('下一项',250,112,104,44,()=>this.selectOverviewShop(1));
    action('X −',-250,62,104,44,()=>this.adjustOverviewShop('x',-1));
    this.overviewShopXLabel = this.label(panel, '', 0, 62, 20, TEXT, 260, 42).node;
    this.overviewShopXLabel.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;this.showTextReader('U00 脚点 X 精确值',this.overviewShopFullDetail());});
    action('X +',250,62,104,44,()=>this.adjustOverviewShop('x',1));
    action('Y −',-250,13,104,44,()=>this.adjustOverviewShop('y',-1));
    this.overviewShopYLabel = this.label(panel, '', 0, 13, 20, TEXT, 260, 42).node;
    this.overviewShopYLabel.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;this.showTextReader('U00 脚点 Y 精确值',this.overviewShopFullDetail());});
    action('Y +',250,13,104,44,()=>this.adjustOverviewShop('y',1));
    action('步长 1',-180,-25,110,42,()=>this.setOverviewShopStep(1)).name='OverviewShopStep_1';
    action('步长 10',0,-25,110,42,()=>this.setOverviewShopStep(10)).name='OverviewShopStep_10';
    action('步长 50',180,-25,110,42,()=>this.setOverviewShopStep(50)).name='OverviewShopStep_50';
    action('缩放 −',-250,-43,104,42,()=>this.adjustOverviewScale(-1));
    this.overviewShopScaleLabel = this.label(panel, '', 0, -43, 20, TEXT, 260, 42).node;
    this.overviewShopScaleLabel.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;this.showTextReader('U00 缩放精确值',this.overviewShopFullDetail());});
    action('缩放 +',250,-43,104,42,()=>this.adjustOverviewScale(1));
    action('恢复初始值',-160,-112,200,42,()=>this.restoreOverviewAdjustments());
    action('复制全部参数',160,-112,200,42,()=>{void this.copyOverviewShopParameters();});
    this.overviewShopStepLabel = this.label(panel, '坐标步长：10 · 缩放步长：0.02', 0, -75, 16, MUTED, 420, 30).node;
    this.overviewShopFeedback = this.label(panel, '调整只在本次页面预览；离开后恢复初始值。',
      0, -165, 15, MUTED, 640, 30).node;
    this.overviewShopFeedback.on(Node.EventType.TOUCH_END,(event:EventTouch)=>{event.propagationStopped=true;this.showTextReader('U00 完整反馈',this.overviewShopFeedback?.getComponent(Label)?.string??'');});
    const bodyViewport=new Node('U00_ShopBodyViewport');panel.addChild(bodyViewport);bodyViewport.addComponent(UITransform);bodyViewport.addComponent(Mask).type=Mask.Type.GRAPHICS_RECT;bodyViewport.addComponent(Graphics);this.overviewShopBodyViewport=bodyViewport;
    const bodyContent=new Node('U00_ShopBodyContent');bodyViewport.addChild(bodyContent);bodyContent.addComponent(UITransform);this.overviewShopBodyContent=bodyContent;
    const fixed=new Set<Node>([panel.getChildByName('Panel')!,panel.getChildByName('Text')!,panel.getChildByName('Button_关闭')!,panel.getChildByName('Button_恢复初始值')!,panel.getChildByName('Button_复制全部参数')!,bodyViewport]);
    for(const child of [...panel.children])if(!fixed.has(child))child.setParent(bodyContent);
    this.updateOverviewShopAdjustPanel();
  }

  private toggleOverviewShopAdjust(): void {
    if (!this.overviewShopAdjustPanel) return;
    if(this.overviewShopAdjustOverlay)this.overviewShopAdjustOverlay.active=!this.overviewShopAdjustOverlay.active;
    this.overviewShopAdjustPanel.active = this.overviewShopAdjustOverlay?.active ?? !this.overviewShopAdjustPanel.active;
    this.overviewMouseTarget=null;this.menuMouseDown=null;this.menuScrollY=this.menuScrollStartY=null;this.menuScrollGesture=false;
    this.overviewShopScrollY=this.overviewShopScrollStartY=null;this.overviewShopScrollGesture=false;
    if (this.overviewShopAdjustPanel.active && this.overviewShopAdjustOverlay?.parent)
      this.overviewShopAdjustOverlay.setSiblingIndex(this.overviewShopAdjustOverlay.parent.children.length - 1);
    this.overviewShopScrollOffset=0;
    this.setTouristButtonText(this.overviewShopAdjustToggle,
      this.overviewShopAdjustPanel.active ? '收起面板' : '调节面板');
    this.updateOverviewShopAdjustPanel();
    this.layoutOverview();
    if (this.overviewShopAdjustPanel.active) this.focusOverviewShop();
  }

  private overviewShopFullDetail(): string {
    const index=this.overviewShopSelectedIndex;
    const target=this.overviewAdjustTarget==='tourists'?'顾客':'店铺';
    const footpoint=this.overviewShopFootpoints[index];
    const lines=[`当前调整目标：${target}`,`选中项：${index+1}/${target==='顾客'?this.overviewTourists.length:SHOP_IDS.length}`];
    if(target==='店铺'&&footpoint)lines.push(`店铺 ID：${SHOP_IDS[index]}`,`店铺名称：${SHOP_NAMES[index]}`,`脚点 X 精确值：${String(footpoint.x)}`,`脚点 Y 精确值：${String(footpoint.y)}`,`缩放精确值：${String(this.overviewShopScales[index])}`);
    else lines.push(`顾客缩放精确值：${String(this.overviewTouristScales[index]??OVERVIEW_TOURIST_SCALE)}`,`初始顾客缩放：${OVERVIEW_TOURIST_SCALE.toFixed(2)}`);
    lines.push(`坐标步长：${this.overviewShopStep}`,`缩放步长：${this.overviewScaleStep.toFixed(2)}`);
    return lines.join('\n');
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
    const scaleX = OVERVIEW_SHOP_MIRRORS[index] ? -scale : scale;
    shop.setScale(scaleX, scale, 1);
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
    if (xLabel) xLabel.string = isTourist ? '顾客缩放见下行' : `X：${Number.isInteger(point.x)?String(point.x):point.x.toFixed(2)}`;
    const yLabel = this.overviewShopYLabel?.getComponent(Label);
    if (yLabel) yLabel.string = isTourist ? `新增默认缩放 ${OVERVIEW_TOURIST_SCALE.toFixed(2)}` : `Y：${Number.isInteger(point.y)?String(point.y):point.y.toFixed(2)}`;
    const scaleLabel = this.overviewShopScaleLabel?.getComponent(Label);
    if (scaleLabel) scaleLabel.string = `比例：${isTourist
      ? (this.overviewTouristScales[this.overviewShopSelectedIndex] ?? OVERVIEW_TOURIST_SCALE).toFixed(2)
      : this.overviewShopScales[this.overviewShopSelectedIndex].toFixed(2)}`;
    const stepLabel = this.overviewShopStepLabel?.getComponent(Label);
    if (stepLabel) stepLabel.string = `坐标步长：${this.overviewShopStep} · 缩放步长：${this.overviewScaleStep.toFixed(2)}（0.10–1.00）`;
    const buttonNode=(name:string):Node|null=>this.overviewShopActionButtons?.[name]??this.overviewShopBodyContent?.getChildByName(`Button_${name}`)??this.overviewShopAdjustPanel?.getChildByName(`Button_${name}`)??null;
    const shopButtons = ['X −', 'X +', 'Y −', 'Y +'].map(name => buttonNode(name));
    shopButtons.forEach(node => { if (node) node.active = !isTourist; });
    for (const [name, mode] of [['店铺', 'shops'], ['顾客', 'tourists']] as const)
      this.setTouristButtonText(buttonNode(name),
        `${this.overviewAdjustTarget === mode ? '● ' : ''}${name}`);
    for (const step of [1, 10, 50]) {
      const button = buttonNode(`步长 ${step}`);
      if (button) button.active = !isTourist;
      this.setTouristButtonText(
        buttonNode(`步长 ${step}`),
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
        mirror: OVERVIEW_SHOP_MIRRORS[index],
        orderBottomToTop: USER_SHOP_LAYOUT[index].orderBottomToTop,
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
    const safe = this.safeUiBounds(visible);
    this.overviewScene?.getComponent(UITransform)?.setContentSize(visible);
    const left = safe.left, bottom = safe.bottom, top = safe.top;
    const controls = this.overviewScene?.getChildByName('U00_Controls');
    const topControls = controls?.getChildByName('U00_TopControls');
    const toggles = this.overviewGroupToggleContainer;
    const count = this.overviewCountContainer;
    const camera = controls?.getChildByName('U00_CameraControls');
    const shopPanel = this.overviewShopAdjustPanel;
    const shortScreen=(this.viewportSnapshot?.height??visible.height)<600;
    const requiredParent=shortScreen?this.overviewShopBodyContent:controls;
    if(requiredParent){
      if(toggles&&toggles.parent!==requiredParent)toggles.setParent(requiredParent);
      if(count&&count.parent!==requiredParent)count.setParent(requiredParent);
    }
    const back = topControls?.getChildByName('Button_返回菜单');
    const adjustToggle = this.overviewShopAdjustToggle;
    const title = topControls?.getChildByName('Text');
    const shopPanelWidth = Math.min(safe.right-safe.left, this.uiPixels(672,visible));
    const navH=this.uiPixels(56,visible), hit=this.uiPixels(48,visible), gap=this.uiPixels(8,visible);
    const panelH=Math.min(safe.top-safe.bottom-2*gap,this.uiPixels(560,visible));
    shopPanel?.getComponent(UITransform)?.setContentSize(shopPanelWidth,panelH);
    shopPanel?.setPosition((safe.left+safe.right)/2,(safe.top+safe.bottom)/2);
    if(shopPanel){
      this.paintRect(shopPanel,shopPanel.getComponent(Graphics)!,shopPanelWidth,panelH,PANEL);
      const titleNode=shopPanel.getChildByName('Text');
      const closePanel=shopPanel.getChildByName('Button_关闭');
      closePanel?.getComponent(UITransform)?.setContentSize(hit,navH);closePanel?.setPosition(shopPanelWidth/2-gap-hit/2,panelH/2-navH/2);this.syncButtonDrawing(closePanel);
      const titleWidth=shopPanelWidth-hit-3*gap;
      titleNode?.setPosition(-shopPanelWidth/2+gap+titleWidth/2,panelH/2-navH/2);
      titleNode?.getComponent(UITransform)?.setContentSize(titleWidth,navH);
      const titleLabel=titleNode?.getComponent(Label);if(titleLabel){titleLabel.fontSize=this.uiPixels(16,visible);titleLabel.lineHeight=this.uiPixels(24,visible);titleLabel.overflow=Label.Overflow.CLAMP;}
      const footerY=-panelH/2+gap+hit/2, mid=shopPanelWidth/2;
      const footerW=(shopPanelWidth-3*gap)/2;
      const at=(name:string,x:number,y:number,w:number,h:number):Node|null=>{
        const node=this.overviewShopActionButtons?.[name]??this.overviewShopBodyContent?.getChildByName(`Button_${name}`)??shopPanel!.getChildByName(`Button_${name}`)??null;node?.setPosition(x,y);node?.getComponent(UITransform)?.setContentSize(w,h);this.syncButtonDrawing(node);
        const label=node?.getChildByName('Text')?.getComponent(Label);if(label){label.fontSize=this.uiPixels(16,visible);label.lineHeight=this.uiPixels(24,visible);label.overflow=Label.Overflow.CLAMP;label.enableWrapText=false;label.node.getComponent(UITransform)?.setContentSize(Math.max(1,w-this.uiPixels(8,visible)),Math.max(1,h-this.uiPixels(6,visible)));}
        return node??null;
      };
      at('恢复初始值',-footerW/2-gap/2,footerY,footerW,hit);at('复制全部参数',footerW/2+gap/2,footerY,footerW,hit);
      const bodyTop=panelH/2-navH-gap, bodyBottom=-panelH/2+2*gap+hit;
      const viewportH=Math.max(0,bodyTop-bodyBottom), rowH=hit+gap, rows=7;
      const foldRows=shortScreen?2:0;
      const lastRow=rows+foldRows;
      const contentH=(lastRow+1)*rowH+this.uiPixels(28,visible);
      this.overviewShopMaxScroll=Math.max(0,contentH-viewportH);
      this.overviewShopScrollOffset=Math.max(0,Math.min(this.overviewShopScrollOffset,this.overviewShopMaxScroll));
      this.overviewShopBodyViewport?.getComponent(UITransform)?.setContentSize(shopPanelWidth-2*gap,viewportH);
      const maskG=this.overviewShopBodyViewport?.getComponent(Graphics);if(maskG){maskG.clear();maskG.rect(-(shopPanelWidth-2*gap)/2,-viewportH/2,shopPanelWidth-2*gap,viewportH);maskG.fill();}
      const bodyCenter=(bodyTop+bodyBottom)/2;this.overviewShopBodyViewport?.setPosition(0,bodyCenter);
      this.overviewShopBodyContent?.getComponent(UITransform)?.setContentSize(shopPanelWidth-2*gap,contentH);
      this.overviewShopBodyContent?.setPosition(0,-bodyCenter+this.overviewShopScrollOffset);
      const rowY=(row:number)=>bodyTop-hit/2-row*rowH;
      const colGap=gap, col=(shopPanelWidth-2*gap-2*colGap)/3;
      const full=shopPanelWidth-2*gap;
      const placeLabel=(node:Node|null,x:number,y:number,w:number,h:number,font=16):void=>{
        if(!node)return;node.setPosition(x,y);node.getComponent(UITransform)?.setContentSize(w,h);
        const label=node.getComponent(Label);if(label){label.fontSize=this.uiPixels(font,visible);label.lineHeight=this.uiPixels(font+4,visible);label.overflow=Label.Overflow.CLAMP;label.enableWrapText=false;}
      };
      if(shortScreen){
        const foldedWidth=(shopPanelWidth-2*gap)/3;
        toggles?.setPosition(0,rowY(1));toggles?.getComponent(UITransform)?.setContentSize(shopPanelWidth-2*gap,hit);
        (['street','tourists','shops'] as const).forEach((key,index)=>{
          const node=this.overviewGroupButtons[key];node?.setPosition(-foldedWidth-gap+index*(foldedWidth+gap),0);
          node?.getComponent(UITransform)?.setContentSize(foldedWidth,hit);this.syncButtonDrawing(node??null);
          const l=node?.getChildByName('Text')?.getComponent(Label);if(l){l.fontSize=this.uiPixels(16,visible);l.lineHeight=this.uiPixels(24,visible);l.overflow=Label.Overflow.CLAMP;l.enableWrapText=false;}
        });
        const countButtons=count?.children.filter(n=>n.name.startsWith('Button_'))??[];
        count?.setPosition(0,rowY(2));count?.getComponent(UITransform)?.setContentSize(shopPanelWidth-2*gap,hit);
        const countCol=(shopPanelWidth-2*gap-2*gap)/3;
        countButtons[0]?.getComponent(UITransform)?.setContentSize(countCol,hit);countButtons[0]?.setPosition(-countCol-gap,0);
        this.overviewCountLabel?.getComponent(UITransform)?.setContentSize(countCol,hit);this.overviewCountLabel?.setPosition(0,0);
        const countLabel=this.overviewCountLabel?.getComponent(Label);if(countLabel){countLabel.fontSize=this.uiPixels(16,visible);countLabel.lineHeight=this.uiPixels(24,visible);countLabel.overflow=Label.Overflow.CLAMP;countLabel.enableWrapText=false;}
        countButtons[1]?.getComponent(UITransform)?.setContentSize(countCol,hit);countButtons[1]?.setPosition(countCol+gap,0);
        countButtons.forEach(node=>this.syncButtonDrawing(node));
      }
      const shift=foldRows;
      const buttonY=[rowY(0),rowY(1+shift),rowY(2+shift),rowY(3+shift),rowY(4+shift),rowY(5+shift)];
      at('店铺',-full/4,buttonY[0],full/2-gap/2,hit);at('顾客',full/4,buttonY[0],full/2-gap/2,hit);
      const itemButtonW=Math.min(this.uiPixels(72,visible),(full-2*gap-this.uiPixels(80,visible))/2);
      const itemSide=full/2-gap-itemButtonW/2;
      at('上一项',-itemSide,buttonY[1],itemButtonW,hit);at('下一项',itemSide,buttonY[1],itemButtonW,hit);
      placeLabel(this.overviewShopNameLabel,0,buttonY[1],full-2*itemButtonW-2*gap,hit);
      const axisButtonW=Math.min(this.uiPixels(72,visible),(full-2*gap-this.uiPixels(64,visible))/2);
      const sideX=full/2-gap-axisButtonW/2, axisValueW=full-2*axisButtonW-2*gap;
      at('X −',-sideX,buttonY[2],axisButtonW,hit);at('X +',sideX,buttonY[2],axisButtonW,hit);placeLabel(this.overviewShopXLabel,0,buttonY[2],axisValueW,hit);
      at('Y −',-sideX,buttonY[3],axisButtonW,hit);at('Y +',sideX,buttonY[3],axisButtonW,hit);placeLabel(this.overviewShopYLabel,0,buttonY[3],axisValueW,hit);
      at('缩放 −',-sideX,buttonY[4],axisButtonW,hit);at('缩放 +',sideX,buttonY[4],axisButtonW,hit);placeLabel(this.overviewShopScaleLabel,0,buttonY[4],axisValueW,hit);
      const stepW=(full-2*gap)/3;
      at('步长 1',-stepW-gap,buttonY[5],stepW,hit);at('步长 10',0,buttonY[5],stepW,hit);at('步长 50',stepW+gap,buttonY[5],stepW,hit);
      placeLabel(this.overviewShopStepLabel,0,rowY(6+shift),full,hit,14);
      placeLabel(this.overviewShopFeedback,0,rowY(7+shift),full,hit,14);
    }
    topControls?.getComponent(UITransform)?.setContentSize(safe.right-safe.left,navH);
    topControls?.setPosition((safe.left+safe.right)/2,top-navH/2);
    const backW=Math.min(this.uiPixels(92,visible),(safe.right-safe.left)/3);
    back?.getComponent(UITransform)?.setContentSize(backW,hit);back?.setPosition(left+backW/2-(safe.left+safe.right)/2,0);this.syncButtonDrawing(back);
    const navToggleW=Math.min(this.uiPixels(104,visible),(safe.right-safe.left)/3);
    adjustToggle?.getComponent(UITransform)?.setContentSize(navToggleW,hit);
    adjustToggle?.setPosition(safe.right-navToggleW/2-(safe.left+safe.right)/2,0);this.syncButtonDrawing(adjustToggle);
    title?.getComponent(UITransform)?.setContentSize(Math.max(1,safe.right-safe.left-backW-navToggleW-2*gap),navH);
    title?.setPosition(left+backW+gap+(safe.right-safe.left-backW-navToggleW-2*gap)/2-(safe.left+safe.right)/2,0);
      const navLabel=title?.getComponent(Label);if(navLabel){navLabel.fontSize=this.uiPixels(16,visible);navLabel.lineHeight=this.uiPixels(24,visible);navLabel.overflow=Label.Overflow.CLAMP;navLabel.enableWrapText=false;}
    const toggleWidth = Math.max(1, (safe.right-safe.left-2*gap)/3);
    const toggleY=top-navH-gap-hit/2;
    const toggleGap = toggleWidth + gap;
    if(!shortScreen)for (const [key, x] of [['street', -toggleGap], ['tourists', 0], ['shops', toggleGap]] as const) {
      const node = this.overviewGroupButtons[key];node?.setPosition((safe.left+safe.right)/2+x,toggleY);
      node?.getComponent(UITransform)?.setContentSize(toggleWidth,hit);this.syncButtonDrawing(node??null);
      const label=node?.getChildByName('Text')?.getComponent(Label);if(label){label.fontSize=this.uiPixels(16,visible);label.lineHeight=this.uiPixels(20,visible);label.overflow=Label.Overflow.CLAMP;}
    }
    const cameraY=bottom+gap+hit/2,countY=cameraY+hit+gap+hit/2;
    camera?.setPosition((safe.left+safe.right)/2,cameraY);
    if(!shortScreen){
      count?.setPosition((safe.left+safe.right)/2,countY);
      const colWidth=(safe.right-safe.left-2*gap)/3;
      const countButtons=count?.children.filter(n=>n.name.startsWith('Button_'))??[];
      countButtons[0]?.getComponent(UITransform)?.setContentSize(colWidth,hit);countButtons[0]?.setPosition(-colWidth-gap,0);
      this.overviewCountLabel?.getComponent(UITransform)?.setContentSize(colWidth,hit);this.overviewCountLabel?.setPosition(0,0);
      countButtons[1]?.getComponent(UITransform)?.setContentSize(colWidth,hit);countButtons[1]?.setPosition(colWidth+gap,0);
      countButtons.forEach(node=>this.syncButtonDrawing(node));
    }
    const cameraColWidth=(safe.right-safe.left-2*gap)/3;
    const cameraButtons=['Button_−','Button_重置','Button_+'].map(name=>camera?.getChildByName(name)??null);
    cameraButtons.forEach((node,i)=>{node?.getComponent(UITransform)?.setContentSize(cameraColWidth,hit);node?.setPosition((i-1)*(cameraColWidth+gap),0);this.syncButtonDrawing(node);const l=node?.getChildByName('Text')?.getComponent(Label);if(l){l.fontSize=this.uiPixels(16,visible);l.lineHeight=this.uiPixels(20,visible);l.overflow=Label.Overflow.CLAMP;}});
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
    const label = node.getChildByName('Text')?.getComponent(Label);
    if (label) { label.fontSize = this.uiPixels(16); label.lineHeight = this.uiPixels(24); label.overflow = Label.Overflow.CLAMP; }
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
    const currentViewport = this.viewportAdapter?.read();
    if (currentViewport && currentViewport.revision !== this.viewportSnapshot?.revision) {
      this.viewportSnapshot = currentViewport;
      this.buttonPointerRevision.clear(); this.menuMouseDown = null;
      if (this.u04Portrait?.isValid) {
        const landscape = currentViewport.orientation === 'landscape';
        if (landscape !== this.u04LandscapeMode) {
          this.u04LandscapeMode = landscape;
          view.setDesignResolutionSize(landscape ? 1280 : 720, landscape ? 720 : 1280, ResolutionPolicy.FIXED_WIDTH);
        }
      }
    }
    this.root.getComponent(UITransform)!.setContentSize(visible);
    this.page.getComponent(UITransform)!.setContentSize(visible);
    if (this.rootBackground) {
      this.paintRect(this.rootBackground,
        this.rootBackground.getComponent(Graphics)!, visible.width, visible.height, MENU_BG);
    }
    if (this.menuContent) {
      const safe = this.safeUiBounds(visible), safeWidth = safe.right - safe.left;
      const navHeight = this.uiPixels(56, visible), inset = this.uiPixels(8, visible);
      this.menuTitle?.getComponent(UITransform)?.setContentSize(Math.min(safeWidth, this.uiPixels(660, visible)), navHeight);
      this.menuTitle?.setPosition((safe.left + safe.right) / 2, safe.top - navHeight / 2);
      const viewportTop = safe.top - navHeight - inset;
      const viewportBottom = safe.bottom + inset;
      const viewportHeight = Math.max(1, viewportTop - viewportBottom);
      const width = Math.min(safeWidth, this.uiPixels(610, visible));
      const gap=this.uiPixels(12,visible),titleH=this.uiPixels(32,visible),lineH=this.uiPixels(24,visible),buttonH=this.uiPixels(48,visible),cardInset=this.uiPixels(8,visible);
      const bodyFont=this.uiPixels(16,visible);
      const cardHeights=this.menuCards.map(card=>{const label=card.children.filter(child=>child.getComponent(Label))[1]?.getComponent(Label);const lines=this.estimatedLines(label?.string??'',Math.max(1,width-this.uiPixels(24,visible)),bodyFont);return Math.max(this.uiPixels(144,visible),2*cardInset+titleH+this.uiPixels(4,visible)+lines*lineH+this.uiPixels(8,visible)+buttonH);});
      this.menuContent.getComponent(UITransform)?.setContentSize(width, viewportHeight);
      this.menuContent.setPosition((safe.left + safe.right) / 2, (viewportTop + viewportBottom) / 2);
      const totalHeight=cardHeights.reduce((sum,h)=>sum+h,0)+Math.max(0,this.menuCards.length-1)*gap;
      this.menuMaxScroll=Math.max(0,totalHeight-viewportHeight);
      this.menuScrollOffset=Math.max(0,Math.min(this.menuMaxScroll,this.menuScrollOffset));
      let cardTop=viewportHeight/2;
      this.menuCards.forEach((card, index) => {
        const cardHeight=cardHeights[index];
        card.getComponent(UITransform)?.setContentSize(width, cardHeight);
        card.setPosition(0, cardTop-cardHeight/2+this.menuScrollOffset);cardTop-=cardHeight+gap;
        const background = card.getChildByName('Panel');
        if (background) {
          background.getComponent(UITransform)?.setContentSize(width, cardHeight);
          this.paintRect(background, background.getComponent(Graphics)!, width, cardHeight, PANEL);
        }
        const labels = card.children.filter(child => child.getComponent(Label));
        const titleNode = labels[0], purposeNode = labels[1];
        if (titleNode) { titleNode.getComponent(UITransform)?.setContentSize(width-this.uiPixels(24,visible), titleH); titleNode.setPosition(0, cardHeight/2-cardInset-titleH/2);
          const label=titleNode.getComponent(Label);if(label){label.fontSize=this.uiPixels(28,visible);label.lineHeight=titleH;label.overflow=Label.Overflow.CLAMP;} }
        if (purposeNode) { const label=purposeNode.getComponent(Label)!;const lines=this.estimatedLines(label.string,Math.max(1,width-this.uiPixels(24,visible)),this.uiPixels(16,visible));const purposeH=lines*this.uiPixels(24,visible);purposeNode.getComponent(UITransform)?.setContentSize(width-this.uiPixels(24,visible),purposeH);purposeNode.setPosition(0,cardHeight/2-cardInset-titleH-this.uiPixels(4,visible)-purposeH/2);label.fontSize=this.uiPixels(16,visible);label.lineHeight=this.uiPixels(24,visible);label.overflow=Label.Overflow.CLAMP; }
        const enter = card.children.find(child => child.name.startsWith('Button_') || child.name.startsWith('Disabled_'));
        if (enter) {
          const height = buttonH;
          enter.getComponent(UITransform)?.setContentSize(width-this.uiPixels(24,visible), height);
          enter.setPosition(0, -cardHeight/2 + cardInset + height/2);
          this.syncButtonDrawing(enter);
          const label=enter.getChildByName('Text')?.getComponent(Label);
          if(label){label.fontSize=this.uiPixels(16,visible);label.lineHeight=this.uiPixels(20,visible);label.overflow=Label.Overflow.CLAMP;}
        }
      });
    }
    if (this.overviewScene?.isValid) this.layoutOverview();
    if (this.shopStage?.isValid) {
      const safe = this.safeUiBounds(visible), safeWidth = Math.max(48, safe.right-safe.left);
      const top = safe.top, bottom = safe.bottom, nav = this.uiPixels(56, visible), gap = this.uiPixels(8, visible);
      const buttonH = this.uiPixels(48, visible);
      const retryVisible = !!this.shopRetry?.active;
      const identityH = this.uiPixels(26, visible), infoGap = this.uiPixels(8, visible);
      const statusH = this.uiPixels(retryVisible ? 96 : 24, visible);
      const retryH = retryVisible ? buttonH + infoGap : 0;
      const stageTop = top - nav - gap;
      const infoBottom = bottom + buttonH + infoGap;
      const stageBottom = infoBottom + identityH + infoGap + statusH + retryH + gap;
      const stageHeight = Math.max(0, stageTop-stageBottom);
      const stageWidth = Math.min(safeWidth, stageHeight, this.uiPixels(620, visible));
      this.shopStage.getComponent(UITransform)!.setContentSize(stageWidth, stageHeight);
      this.shopStage.setPosition((safe.left+safe.right)/2, (stageTop + stageBottom) / 2);
      const shopScale = Math.min(stageWidth, stageHeight) / 1024;
      this.shopArtwork?.setScale(shopScale, shopScale, 1);
      const backW=this.uiPixels(88,visible), navY=top-nav/2;
      this.shopBack?.getComponent(UITransform)?.setContentSize(backW,nav);
      this.syncButtonDrawing(this.shopBack);
      this.shopBack?.setPosition(safe.left+backW/2,navY);
      this.shopTitle?.getComponent(UITransform)?.setContentSize(Math.max(1,safeWidth-backW-this.uiPixels(16,visible)),nav);
      this.shopTitle?.setPosition(safe.left+backW+this.uiPixels(8,visible)+(safeWidth-backW-this.uiPixels(16,visible))/2,navY);
      const titleLabel=this.shopTitle?.getComponent(Label);
      if(titleLabel){titleLabel.string='U03 六店';titleLabel.fontSize=this.uiPixels(16,visible);titleLabel.lineHeight=this.uiPixels(24,visible);titleLabel.overflow=Label.Overflow.CLAMP;titleLabel.enableWrapText=false;}
      this.shopIdentity?.node.getComponent(UITransform)?.setContentSize(safeWidth,identityH);
      this.shopIdentity?.node.setPosition((safe.left+safe.right)/2,infoBottom+identityH/2);
      if(this.shopIdentity){this.shopIdentity.fontSize=this.uiPixels(18,visible);this.shopIdentity.lineHeight=this.uiPixels(26,visible);this.shopIdentity.overflow=Label.Overflow.CLAMP;}
      this.shopStatus?.node.getComponent(UITransform)?.setContentSize(safeWidth,statusH);
      this.shopStatus?.node.setPosition((safe.left+safe.right)/2,infoBottom+identityH+infoGap+statusH/2);
        if(this.shopStatus){this.shopStatus.fontSize=this.uiPixels(16,visible);this.shopStatus.lineHeight=this.uiPixels(24,visible);this.shopStatus.overflow=Label.Overflow.CLAMP;}
      const col=(safeWidth-this.uiPixels(8,visible))/2, footerY=bottom+buttonH/2;
      [this.shopPrevious,this.shopNext].forEach((button,index)=>{
        button?.getComponent(UITransform)?.setContentSize(col,buttonH); this.syncButtonDrawing(button);
        button?.setPosition(safe.left+col/2+index*(col+this.uiPixels(8,visible)),footerY);
      });
      this.shopRetry?.getComponent(UITransform)?.setContentSize(Math.min(this.uiPixels(180,visible),safeWidth),buttonH);
      this.syncButtonDrawing(this.shopRetry);
      this.shopRetry?.setPosition((safe.left+safe.right)/2,infoBottom+identityH+infoGap+statusH+infoGap+buttonH/2);
      [this.shopBack,this.shopPrevious,this.shopNext,this.shopRetry].forEach(button=>{
        const label=button?.getChildByName('Text')?.getComponent(Label);
        if(label){label.fontSize=this.uiPixels(16,visible);label.lineHeight=this.uiPixels(20,visible);label.overflow=Label.Overflow.CLAMP;}
      });
    }
    if (this.touristStage?.isValid) this.layoutTourist(visible);
    if (this.u04Portrait?.isValid) this.layoutDialogue(visible);
    if (this.textReader?.root.active) this.textReader.layout(visible, this.safeUiBounds(visible));
    if (!this.sceneViewport?.isValid) return;
    const safe = this.safeUiBounds(visible);
    this.sceneViewport.getComponent(UITransform)!.setContentSize(visible);
    this.sceneControls?.setPosition((safe.left+safe.right)/2,safe.bottom+this.uiPixels(68,visible));
    this.sceneBack?.setPosition(safe.left+this.uiPixels(114,visible),safe.top-this.uiPixels(68,visible));
  }

  private layoutTourist(visible: { width: number; height: number }): void {
    const safe = this.safeUiBounds(visible), safeLeft=safe.left, safeRight=safe.right;
    const safeTop=safe.top, safeBottom=safe.bottom, safeHeight=safeTop-safeBottom;
    const navHeight=this.uiPixels(56,visible), gap=this.uiPixels(8,visible);
    const navY = safeTop - navHeight/2;
    const navHit=Math.max(this.uiPixels(48,visible),navHeight), navBackWidth=Math.max(this.uiPixels(80,visible),this.uiPixels(84,visible));
    const navResetWidth=Math.max(this.uiPixels(80,visible),this.uiPixels(84,visible));
    const backX = safeLeft + navBackWidth/2;
    const resetX = safeRight - navResetWidth/2;
    this.touristNavBack?.getComponent(UITransform)?.setContentSize(navBackWidth,navHit);
    this.touristNavReset?.getComponent(UITransform)?.setContentSize(navResetWidth,navHit);
    this.syncButtonDrawing(this.touristNavBack); this.syncButtonDrawing(this.touristNavReset);
    this.touristNavBack?.setPosition(backX, navY);
    this.touristNavTitle?.setPosition((safeLeft+safeRight)/2, navY);
    const titleHalfLimit = Math.min(-(backX + navBackWidth/2), resetX - navResetWidth/2);
    this.touristNavTitle?.getComponent(UITransform)!.setContentSize(
      Math.max(1, Math.min(this.uiPixels(340,visible), 2 * (titleHalfLimit - this.uiPixels(16,visible)))), navHeight);
    const navTitleLabel=this.touristNavTitle?.getComponent(Label);
    if(navTitleLabel){navTitleLabel.string='U02 游客装扮';navTitleLabel.fontSize=this.uiPixels(16,visible);navTitleLabel.lineHeight=this.uiPixels(24,visible);navTitleLabel.overflow=Label.Overflow.CLAMP;navTitleLabel.enableWrapText=false;}
    this.touristNavReset?.setPosition(resetX, navY);

    const trayBottom = safeBottom + gap;
    const stageTop = navY - navHeight/2 - gap;
    const regionHeight=Math.max(0,stageTop-trayBottom);
    const desiredTray=Math.max(this.uiPixels(168,visible),Math.min(this.uiPixels(336,visible),safeHeight*.45));
    const trayHeight=Math.max(this.uiPixels(120,visible),Math.min(desiredTray,regionHeight-this.uiPixels(120,visible)-this.uiPixels(64,visible)-2*gap));
    const trayTop=trayBottom+trayHeight;
    const stageBottom=trayTop+this.uiPixels(64,visible)+gap;
    const stageHeight=Math.max(0,stageTop-stageBottom);
    const stageWidth=Math.max(1,Math.min(this.uiPixels(590,visible),safeRight-safeLeft));
    this.touristStage!.getComponent(UITransform)!.setContentSize(stageWidth, stageHeight);
    this.touristStage!.setPosition((safeLeft+safeRight)/2, stageTop - stageHeight / 2);
    this.touristView?.setStageHeight(stageHeight);
    if (this.touristStagePanel) {
      this.paintRect(this.touristStagePanel,
        this.touristStagePanel.getComponent(Graphics)!, stageWidth, stageHeight, PANEL);
    }
    this.touristStatus?.setPosition((safeLeft+safeRight)/2,trayTop+this.uiPixels(44,visible));
    this.touristAdornment?.setPosition((safeLeft+safeRight)/2,trayTop+this.uiPixels(18,visible));
    const statusLabel=this.touristStatus?.getComponent(Label), adornmentLabel=this.touristAdornment?.getComponent(Label);
    if(statusLabel){statusLabel.fontSize=this.uiPixels(16,visible);statusLabel.lineHeight=this.uiPixels(24,visible);statusLabel.overflow=Label.Overflow.CLAMP;}
    if(adornmentLabel){adornmentLabel.fontSize=this.uiPixels(14,visible);adornmentLabel.lineHeight=this.uiPixels(20,visible);adornmentLabel.overflow=Label.Overflow.CLAMP;}

    this.touristTrayViewport!.getComponent(UITransform)!.setContentSize(610, trayHeight);
    this.touristTrayViewport!.setPosition(0, (trayTop + trayBottom) / 2);
    if (this.touristTrayBackground) {
      this.paintRect(this.touristTrayBackground,
        this.touristTrayBackground.getComponent(Graphics)!, 610, trayHeight, PANEL);
    }
    const trayWidth=Math.max(1,Math.min(this.uiPixels(610,visible),safeRight-safeLeft));
    this.touristTrayViewport!.getComponent(UITransform)!.setContentSize(trayWidth,trayHeight);
    this.touristTrayViewport!.setPosition((safeLeft+safeRight)/2,(trayTop+trayBottom)/2);
    if(this.touristTrayBackground)this.paintRect(this.touristTrayBackground,this.touristTrayBackground.getComponent(Graphics)!,trayWidth,trayHeight,PANEL);
    const controls=this.touristTrayContent!, controlTransform=controls.getComponent(UITransform)!;
    controls.setScale(1,1,1);controlTransform.setContentSize(trayWidth,1);
    const controlGap=this.uiPixels(8,visible), hit=this.uiPixels(48,visible), headingH=this.uiPixels(24,visible);
    const headings=controls.children.filter(node=>!!node.getComponent(Label));
    const label=(node:Node|undefined,x:number,y:number,w:number,h:number,font:number):void=>{if(!node)return;node.setPosition(x,y);node.getComponent(UITransform)?.setContentSize(w,h);const l=node.getComponent(Label);if(l){l.fontSize=this.uiPixels(font,visible);l.lineHeight=this.uiPixels(font+4,visible);l.overflow=Label.Overflow.CLAMP;}};
    const button=(node:Node|undefined,x:number,y:number,w:number):void=>{if(!node)return;node.setPosition(x,y);node.getComponent(UITransform)?.setContentSize(w,hit);this.syncButtonDrawing(node);const l=node.getChildByName('Text')?.getComponent(Label);if(l){l.fontSize=this.uiPixels(16,visible);l.lineHeight=this.uiPixels(20,visible);l.overflow=Label.Overflow.CLAMP;}};
    let cursor=controlGap;
    label(headings[0],0,-cursor-headingH/2,trayWidth-controlGap*2,headingH,16);cursor+=headingH+controlGap;
    const colW=(trayWidth-3*controlGap)/2;
    for(let row=0;row<2;row++){const y=-cursor-hit/2;const keys=(row===0?['walk','run']:['happy','sad']) as TouristAction[];button(this.touristActionButtons[keys[0]],-colW/2-controlGap/2,y,colW);button(this.touristActionButtons[keys[1]],colW/2+controlGap/2,y,colW);cursor+=hit+controlGap;}
    label(headings[1],0,-cursor-headingH/2,trayWidth-2*controlGap,headingH,16);cursor+=headingH+controlGap;
    for(const key of ['hat','glasses','wristband'] as TouristSlot[]){button(this.touristSlotButtons[key],0,-cursor-hit/2,trayWidth-2*controlGap);cursor+=hit+controlGap;}
    label(headings[2],0,-cursor-headingH/2,trayWidth-2*controlGap,headingH,16);cursor+=headingH+controlGap;
    button(this.touristFacingButtons.left,-colW/2-controlGap/2,-cursor-hit/2,colW);button(this.touristFacingButtons.right,colW/2+controlGap/2,-cursor-hit/2,colW);cursor+=hit+controlGap;
    const contentH=cursor+controlGap;controlTransform.setContentSize(trayWidth,contentH);
    this.touristMaxScroll=Math.max(0,contentH-trayHeight);this.touristScrollOffset=Math.max(0,Math.min(this.touristScrollOffset,this.touristMaxScroll));
    const statusWidth=safeRight-safeLeft;this.touristStatus?.getComponent(UITransform)?.setContentSize(statusWidth,this.uiPixels(24,visible));this.touristAdornment?.getComponent(UITransform)?.setContentSize(statusWidth,this.uiPixels(20,visible));
    this.touristTrayViewport!.getComponent(UITransform)!.setContentSize(trayWidth,trayHeight);this.positionTouristTrayContent();
  }

  private fingerScrollOffset(offset: number, maxScroll: number, previousY: number, currentY: number): number {
    return Math.max(0, Math.min(maxScroll, offset + currentY - previousY));
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
      this.scrollTouristTray(currentY - this.touristTouchY);
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
    this.scrollTouristTray(currentY - this.touristMouseY);
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
    if (this.textReader?.root.activeInHierarchy || this.overviewShopAdjustOverlay?.activeInHierarchy) { this.menuMouseDown = null; this.overviewMouseTarget = null; this.menuScrollY = this.menuScrollStartY = null; return; }
    if (this.overviewScene?.activeInHierarchy) {
      this.overviewMouseTarget = this.collectButtons(this.overviewScene)
        .find(node => this.isInside(node, event.getUILocation())) ?? null;
      return;
    }
    const point = event.getUILocation();
    if (this.menuContent && this.isInside(this.menuContent, point)) {
      this.menuScrollY = this.menuScrollStartY = point.y; this.menuScrollGesture = false; this.menuMouseDown = null; return;
    }
    this.menuScrollY=this.menuScrollStartY=null;
    this.menuMouseDown = this.menuEntries.find(entry =>
      this.isInside(entry.node, event.getUILocation()))?.node ?? null;
  }

  private onMenuMouseMove(event: EventMouse): void {
    if (this.textReader?.root.activeInHierarchy || this.overviewShopAdjustOverlay?.activeInHierarchy) { this.menuScrollY = this.menuScrollStartY = null; return; }
    if (this.menuScrollY === null || !this.menuContent?.activeInHierarchy) return;
    const y = event.getUILocation().y;
    if (this.menuScrollStartY!==null&&Math.abs(y-this.menuScrollStartY)>8) this.menuScrollGesture = true;
    const delta = y - this.menuScrollY;
    this.menuScrollOffset = this.fingerScrollOffset(this.menuScrollOffset, this.menuMaxScroll, this.menuScrollY, y);
    this.menuScrollY = y;
    this.layoutScene();
  }

  private onMenuMouseUp(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
    if (this.textReader?.root.activeInHierarchy || this.overviewShopAdjustOverlay?.activeInHierarchy) { this.menuMouseDown = null; this.overviewMouseTarget = null; this.menuScrollY = this.menuScrollStartY = null; return; }
    if (this.overviewScene?.activeInHierarchy) {
      const target = this.overviewMouseTarget;
      this.overviewMouseTarget = null;
      if (target && target.isValid && this.isInside(target, event.getUILocation()))
        this.buttonMouseActions.get(target)?.();
      return;
    }
    this.menuScrollY=this.menuScrollStartY=null;
    if (this.menuScrollGesture) { this.menuScrollGesture = false; this.menuMouseDown = null; return; }
    const pressed = this.menuMouseDown;
    this.menuMouseDown = null;
    if (pressed && this.isInside(pressed, event.getUILocation())) {
      this.activateMenuEntry(pressed, this.pageEpoch);
    }
  }
}
