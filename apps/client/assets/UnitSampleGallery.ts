import {
  _decorator, Color, Component, Director, EventMouse, EventTouch, Graphics, Input, director, input,
  JsonAsset, Label, Mask, Node, Prefab, ResolutionPolicy, Sprite, SpriteFrame, UITransform, Vec3,
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

const { ccclass, property } = _decorator;
const MENU_BG = new Color(10, 20, 34);
const PANEL = new Color(19, 34, 51);
const TEXT = new Color(230, 239, 247);
const MUTED = new Color(155, 178, 199);
const BLUE = new Color(108, 193, 224);
const GOLD = new Color(246, 189, 109);

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
    this.touristState?.detach();
    this.touristState = null;
    input.off(Input.EventType.MOUSE_DOWN, this.onMenuMouseDown, this);
    input.off(Input.EventType.MOUSE_UP, this.onMenuMouseUp, this);
    view.off('canvas-resize', this.layoutScene, this);
    view.off('design-resolution-changed', this.layoutScene, this);
  }

  protected update(deltaTime: number): void {
    this.touristState?.tick(deltaTime * 1000);
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
      if (pressFeedback) {
        node.on(Node.EventType.TOUCH_START, () => this.paintButtonState(node, 'pressed'));
        node.on(Node.EventType.TOUCH_CANCEL, () => this.paintButtonState(node, 'normal'));
      }
      node.on(Node.EventType.TOUCH_END, (event) => {
        event.propagationStopped = true;
        if (pressFeedback) this.paintButtonState(node, 'normal');
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
    this.disabledControls.clear();
    this.shopGeneration++;
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
  }

  private openMenu(): void {
    this.clearPage();
    this.menuContent = this.makeNode('MenuContent', this.page);
    this.menuTitle = this.makeNode('MenuTitle', this.menuContent, 660, 68);
    this.label(this.menuTitle, '单元示例', 0, 0, 42, GOLD);
    this.menuCards.push(this.menuCard('U01', '五层场景镜头',
      '查看五层场景视差，拖动、缩放并重置镜头。', () => this.openUnit()));
    this.menuCards.push(this.menuCard('U02', '游客动作与装扮',
      '查看游客的动作、左右朝向与独立装扮。', () => this.openTourist()));
    const shopsReady = this.shopPrefabs.length === 6 &&
      this.shopPrefabs.every((prefab, index) => this.validShopPrefab(prefab, index));
    this.menuCards.push(this.menuCard('U03', '六店店铺',
      shopsReady ? '查看六间店铺，并循环切换。' : '资源未就绪',
      () => this.openShops(), shopsReady));
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
      const cardHeight = Math.min(205, (visible.height - 190) / 3 - 18);
      this.menuCards.forEach((card, index) => {
        card.setScale(1, cardHeight / 210);
        card.setPosition(0, titleY - 105 - index * (cardHeight + 18));
      });
    }
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
    this.menuMouseDown = this.menuEntries.find(entry =>
      this.isInside(entry.node, event.getUILocation()))?.node ?? null;
  }

  private onMenuMouseUp(event: EventMouse): void {
    if (event.getButton() !== EventMouse.BUTTON_LEFT) return;
    const pressed = this.menuMouseDown;
    this.menuMouseDown = null;
    if (pressed && this.isInside(pressed, event.getUILocation())) {
      this.activateMenuEntry(pressed, this.pageEpoch);
    }
  }
}
