import {
  _decorator, Color, Component, EventKeyboard, EventMouse, EventTouch, Graphics,
  Input, input, KeyCode, Label, Node, Sprite, SpriteFrame, UITransform, Vec3,
} from 'cc';

const { ccclass, property } = _decorator;
const N = 7;
const TW = 80;
const TH = 40;
const BLUE = new Color(108, 193, 224);
const TEXT = new Color(230, 239, 247);
const MUTED = new Color(155, 178, 199);
const PANEL = new Color(19, 34, 51);
const GOLD = new Color(246, 189, 109);

type UnitId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Cell = { row: number; col: number };
type Actor = { node: Node; row: number; col: number; frame: number };

const UNITS = [
  ['U01', '瓦片地图', '点击瓦片查看坐标、类型与边界'],
  ['U02', '镜头与手势', '拖动地图；滚轮或双指缩放'],
  ['U03', '建筑占格', '移动鬼客；红格不可穿过，桥面可通行'],
  ['U04', '建筑四方向', '切换方向与摊位新旧状态；方向形体是占位示意'],
  ['U05', '精灵四方向', '方向键移动；检查脚点、转向和阻挡'],
  ['U06', '层级遮挡', '移动角色，观察屋前屋后的脚点排序'],
  ['U07', '场景轻特效', '切换灯光、水波、树叶微动'],
  ['U08', 'UI 与交互', '按钮状态、修复确认和返回操作'],
  ['U09', '密度与性能', '增加角色数量，观察样本帧率'],
] as const;

// Frames are serialized in UnitSamples.scene. The art is reused from assets/demo.
// Frame 0..3: ground, road, water, shore; 4..8: bridges/palace/stalls;
// 9..18: keeper and guests; 19..20: lantern/tree.
@ccclass('UnitSampleGallery')
export class UnitSampleGallery extends Component {
  @property({ type: [SpriteFrame] })
  public frames: SpriteFrame[] = [];

  private root!: Node;
  private page!: Node;
  private stage!: Node;
  private world!: Node;
  private status!: Label;
  private unit: UnitId = 0;
  private actor: Actor | null = null;
  private facing = 0;
  private restored = false;
  private selected = 0;
  private blocked = new Set<string>();
  private effectTime = 0;
  private effectGraphics: Graphics | null = null;
  private effectTree: Node | null = null;
  private directionGraphics: Graphics | null = null;
  private sourcePreview: Node | null = null;
  private occlusionRoof: Node | null = null;
  private effects = [true, true, true];
  private perfActors: Node[] = [];
  private perfTarget = 20;
  private fpsTime = 0;
  private fpsFrames = 0;
  private fps = 0;
  private pinchDistance = 0;

  protected onLoad(): void {
    const oldWorld = this.node.getChildByName('WorldRoot');
    if (oldWorld) oldWorld.active = false;
    this.root = this.makeNode('UnitSamplesRoot', this.node, 720, 1280);
    this.drawRect(this.root, 0, 0, 720, 1280, new Color(10, 20, 34));
    this.openMenu();
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.MOUSE_WHEEL, this.onWheel, this);
  }

  private makeNode(name: string, parent: Node, width = 1, height = 1, x = 0, y = 0): Node {
    const node = new Node(name);
    parent.addChild(node);
    node.setPosition(x, y);
    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, height);
    return node;
  }

  private drawRect(parent: Node, x: number, y: number, width: number, height: number, color: Color): Graphics {
    const node = this.makeNode('Rect', parent, width, height, x, y);
    const g = node.addComponent(Graphics);
    g.fillColor = color;
    g.rect(-width / 2, -height / 2, width, height);
    g.fill();
    return g;
  }

  private label(parent: Node, value: string, x: number, y: number, size = 25,
    color = TEXT, width = 650, height = 50): Label {
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
    width: number, height: number, callback: () => void, color = PANEL): Node {
    const node = this.makeNode(`Button_${value}`, parent, width, height, x, y);
    const g = node.addComponent(Graphics);
    const paint = (pressed: boolean) => {
      g.clear();
      g.fillColor = pressed ? new Color(Math.min(color.r + 28, 255),
        Math.min(color.g + 31, 255), Math.min(color.b + 33, 255)) : color;
      g.roundRect(-width / 2, -height / 2, width, height, 12);
      g.fill();
      g.strokeColor = BLUE;
      g.lineWidth = 2;
      g.roundRect(-width / 2, -height / 2, width, height, 12);
      g.stroke();
    };
    paint(false);
    this.label(node, value, 0, 0, Math.min(24, height * 0.31), TEXT, width - 12, height - 10);
    node.on(Node.EventType.TOUCH_START, () => paint(true));
    node.on(Node.EventType.TOUCH_CANCEL, () => paint(false));
    node.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
      event.propagationStopped = true;
      paint(false);
      callback();
    });
    return node;
  }

  private sprite(parent: Node, frame: number, x: number, y: number,
    width: number, height: number, anchorY = 0): Node {
    const node = this.makeNode(`Art_${frame}`, parent, width, height, x, y);
    node.getComponent(UITransform)!.setAnchorPoint(0.5, anchorY);
    const image = node.addComponent(Sprite);
    image.sizeMode = Sprite.SizeMode.CUSTOM;
    image.spriteFrame = this.frames[frame] || null;
    node.getComponent(UITransform)!.setContentSize(width, height);
    return node;
  }

  private clearPage(): void {
    if (this.page && this.page.isValid) this.page.destroy();
    this.page = this.makeNode('Page', this.root, 720, 1280);
    this.actor = null;
    this.effectGraphics = null;
    this.effectTree = null;
    this.directionGraphics = null;
    this.sourcePreview = null;
    this.occlusionRoof = null;
    this.perfActors = [];
    this.pinchDistance = 0;
  }

  private openMenu(): void {
    this.unit = 0;
    this.clearPage();
    this.label(this.page, '百鬼夜市 · 单元样例', 0, 545, 42, GOLD);
    this.label(this.page, '每个入口只验证一组独立能力', 0, 490, 23, MUTED);
    for (let i = 0; i < UNITS.length; i++) {
      const [id, title] = UNITS[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      this.button(this.page, `${id}  ${title}`, col ? 171 : -171, 370 - row * 168,
        314, 132, () => this.openUnit((i + 1) as UnitId));
    }
    this.label(this.page, '四方向与特效目前采用机制占位，正式资产需补做', 0, -555, 19, MUTED);
  }

  private openUnit(id: UnitId): void {
    this.unit = id;
    this.clearPage();
    const [number, name, detail] = UNITS[id - 1];
    this.label(this.page, `${number}  ${name}`, 0, 556, 37, GOLD);
    this.label(this.page, detail, 0, 503, 21, TEXT);
    this.button(this.page, '返回菜单', -245, -565, 190, 70, () => this.openMenu());
    this.button(this.page, '重置', 245, -565, 155, 70, () => this.openUnit(id));
    this.stage = this.makeNode('Stage', this.page, 660, 860, 0, -15);
    this.drawRect(this.stage, 0, 0, 660, 860, PANEL);
    this.world = this.makeNode('World', this.stage, 600, 730);
    this.status = this.label(this.page, '', 0, -482, 19, MUTED, 650, 63);
    switch (id) {
      case 1: this.sampleTiles(); break;
      case 2: this.sampleCamera(); break;
      case 3: this.sampleOccupation(); break;
      case 4: this.sampleBuildings(); break;
      case 5: this.sampleSprites(); break;
      case 6: this.sampleOcclusion(); break;
      case 7: this.sampleEffects(); break;
      case 8: this.sampleUi(); break;
      case 9: this.sampleDensity(); break;
    }
  }

  private tilePosition(row: number, col: number): Vec3 {
    return new Vec3((col - row) * TW / 2, (N - 1 - row - col) * TH / 2);
  }

  private cellAt(x: number, y: number): Cell {
    const difference = x / (TW / 2);
    const sum = N - 1 - y / (TH / 2);
    return { row: Math.round((sum - difference) / 2), col: Math.round((sum + difference) / 2) };
  }

  private valid(cell: Cell): boolean {
    return cell.row >= 0 && cell.row < N && cell.col >= 0 && cell.col < N;
  }

  private key(cell: Cell): string { return `${cell.row},${cell.col}`; }

  private drawMap(): void {
    const ground = this.makeNode('Ground', this.world);
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        const p = this.tilePosition(row, col);
        const water = row === 0 || col === 0 || row === N - 1 || col === N - 1;
        const shore = row === 1 || col === 1 || row === N - 2 || col === N - 2;
        const road = row === col || col === 3;
        this.sprite(ground, water ? 2 : shore ? 3 : road ? 1 : 0, p.x, p.y, TW, TH, 0.5);
      }
    }
  }

  private drawGridOverlay(showBlocked = false): void {
    const node = this.makeNode('GridOverlay', this.world);
    const g = node.addComponent(Graphics);
    g.lineWidth = 1.5;
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        const p = this.tilePosition(row, col);
        g.strokeColor = new Color(115, 191, 217, 160);
        g.moveTo(p.x, p.y + TH / 2);
        g.lineTo(p.x + TW / 2, p.y);
        g.lineTo(p.x, p.y - TH / 2);
        g.lineTo(p.x - TW / 2, p.y);
        g.close();
        g.stroke();
        if (showBlocked && this.blocked.has(this.key({ row, col }))) {
          g.fillColor = new Color(220, 80, 92, 128);
          g.moveTo(p.x, p.y + TH / 2);
          g.lineTo(p.x + TW / 2, p.y);
          g.lineTo(p.x, p.y - TH / 2);
          g.lineTo(p.x - TW / 2, p.y);
          g.close();
          g.fill();
        }
      }
    }
  }

  private attachMapTouch(handler: (x: number, y: number, event: EventTouch) => void): void {
    this.stage.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
      const loc = event.getUILocation();
      const local = this.world.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(loc.x, loc.y));
      handler(local.x, local.y, event);
    });
  }

  private sampleTiles(): void {
    this.drawMap();
    this.drawGridOverlay();
    this.status.string = '7×7 小地图 · 点击瓦片读取坐标和类型';
    this.attachMapTouch((x, y) => {
      const cell = this.cellAt(x, y);
      if (!this.valid(cell)) { this.status.string = '地图边界外'; return; }
      const edge = cell.row === 0 || cell.col === 0 || cell.row === 6 || cell.col === 6;
      this.status.string = `格子 (${cell.row}, ${cell.col}) · ${edge ? '水面边界' : '可用地表'}`;
    });
  }

  private sampleCamera(): void {
    this.drawMap();
    this.drawGridOverlay();
    this.sprite(this.world, 7, -95, 10, 105, 76);
    this.sprite(this.world, 8, 125, -10, 105, 76);
    this.status.string = '拖动地图；滚轮/双指缩放。倍率 1.00×';
    this.stage.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
      const touches = event.getTouches();
      if (touches.length >= 2) {
        const a = touches[0].getUILocation();
        const b = touches[1].getUILocation();
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (this.pinchDistance) this.zoom(distance / this.pinchDistance);
        this.pinchDistance = distance;
      } else {
        this.pinchDistance = 0;
        const delta = event.getUIDelta();
        this.world.setPosition(this.clampPan(this.world.position.x + delta.x,
          this.world.position.y + delta.y));
      }
    });
    this.stage.on(Node.EventType.TOUCH_END, () => { this.pinchDistance = 0; });
    this.button(this.page, '−', -70, -405, 92, 70, () => this.zoom(0.85));
    this.button(this.page, '+', 70, -405, 92, 70, () => this.zoom(1.15));
  }

  private clampPan(x: number, y: number): Vec3 {
    const limit = 145 * this.world.scale.x;
    return new Vec3(Math.max(-limit, Math.min(limit, x)),
      Math.max(-limit, Math.min(limit, y)));
  }

  private zoom(multiplier: number): void {
    if (this.unit !== 2) return;
    const scale = Math.max(0.7, Math.min(2, this.world.scale.x * multiplier));
    this.world.setScale(scale, scale, 1);
    this.world.setPosition(this.clampPan(this.world.position.x, this.world.position.y));
    this.status.string = `拖动地图；滚轮/双指缩放。倍率 ${scale.toFixed(2)}×`;
  }

  private onWheel(event: EventMouse): void {
    if (this.unit === 2) this.zoom(event.getScrollY() > 0 ? 1.08 : 0.92);
  }

  private addBuilding(frame: number, row: number, col: number, width = 116, height = 92): Node {
    const p = this.tilePosition(row, col);
    return this.sprite(this.world, frame, p.x, p.y, width, height);
  }

  private spawnActor(row: number, col: number, frame = 10): Actor {
    const p = this.tilePosition(row, col);
    const actor = { node: this.sprite(this.world, frame, p.x, p.y, 48, 55), row, col, frame };
    this.actor = actor;
    return actor;
  }

  private movementButtons(): void {
    const arrows: Array<[string, number, number, number, number]> = [
      ['↑', 0, -340, -1, 0], ['←', -115, -397, 0, -1],
      ['↓', 0, -397, 1, 0], ['→', 115, -397, 0, 1],
    ];
    for (const [name, x, y, dr, dc] of arrows) {
      this.button(this.page, name, x, y, 88, 50, () => this.moveActor(dr, dc));
    }
  }

  private moveActor(dr: number, dc: number): void {
    if (!this.actor) return;
    const next = { row: this.actor.row + dr, col: this.actor.col + dc };
    this.facing = dr < 0 ? 0 : dc > 0 ? 1 : dr > 0 ? 2 : 3;
    if (this.unit === 5) this.paintActorDirection();
    if (!this.valid(next) || this.blocked.has(this.key(next))) {
      this.status.string = `方向 ${['北', '东', '南', '西'][this.facing]}：阻挡格，无法通过`;
      return;
    }
    this.actor.row = next.row;
    this.actor.col = next.col;
    const p = this.tilePosition(next.row, next.col);
    this.actor.node.setPosition(p);
    if (this.unit === 5) {
      const image = this.actor.node.getComponent(Sprite)!;
      const walkStart = [9, 11, 14, 17][this.selected];
      image.spriteFrame = this.frames[walkStart + (this.selected === 0 ? 0 : (next.row + next.col) % 2)];
      this.paintActorDirection();
    }
    if (this.unit === 6) this.sortOcclusion();
    this.status.string = `方向 ${['北', '东', '南', '西'][this.facing]} · 脚点 (${next.row}, ${next.col})`;
  }

  private sampleOccupation(): void {
    this.drawMap();
    this.blocked = new Set([
      '0,2', '0,4', '6,2', '6,4', // Entry/exit bridge rails; decks stay walkable.
      '2,2', '2,3', '3,2',       // Ruined stall.
      '2,5', '3,5',              // Restored stall.
      '4,4', '4,5', '5,4',       // Palace.
    ]);
    this.addBuilding(7, 2, 2);
    this.addBuilding(6, 4, 4, 132, 105);
    this.addBuilding(4, 0, 3, 125, 78);
    this.addBuilding(8, 2, 5);
    this.addBuilding(5, 6, 3, 125, 78);
    this.drawGridOverlay(true);
    this.spawnActor(5, 3);
    this.movementButtons();
    this.status.string = '五类建筑已摆放：红格阻挡；两座桥的中央桥面可走';
  }

  private directionGlyph(parent: Node, x: number, y: number, direction: number, size = 80): void {
    const node = this.makeNode('DirectionPlaceholder', parent, size, size, x, y);
    const g = node.addComponent(Graphics);
    const s = size / 100;
    g.fillColor = new Color(51, 79, 111);
    g.moveTo(-36 * s, -25 * s); g.lineTo(0, -41 * s);
    g.lineTo(36 * s, -25 * s); g.lineTo(36 * s, 12 * s);
    g.lineTo(0, -4 * s); g.lineTo(-36 * s, 12 * s); g.close(); g.fill();
    g.fillColor = new Color(96, 73, 151);
    g.moveTo(-42 * s, 12 * s); g.lineTo(0, 39 * s);
    g.lineTo(42 * s, 12 * s); g.lineTo(0, -7 * s); g.close(); g.fill();
    g.fillColor = GOLD;
    // Door/window changes wall in each view; the tile footpoint stays fixed.
    if (direction === 0) g.rect(-8 * s, 9 * s, 16 * s, 14 * s);
    if (direction === 1) g.rect(15 * s, -23 * s, 12 * s, 22 * s);
    if (direction === 2) g.rect(-7 * s, -32 * s, 14 * s, 25 * s);
    if (direction === 3) g.rect(-27 * s, -23 * s, 12 * s, 22 * s);
    g.fill();
  }

  private paintActorDirection(): void {
    if (!this.directionGraphics) return;
    const g = this.directionGraphics;
    g.clear();
    g.fillColor = [
      new Color(116, 98, 190), new Color(95, 166, 213),
      new Color(186, 122, 96), new Color(199, 174, 102),
    ][this.selected];
    g.ellipse(0, 13, 18, 18); g.fill();
    g.fillColor = new Color(232, 236, 255);
    g.circle(0, 37, 18); g.fill();
    g.fillColor = new Color(48, 41, 80);
    if (this.facing === 0) {
      g.ellipse(0, 44, 16, 12); g.fill(); // back of head
      g.circle(0, 57, 6); g.fill();
    } else if (this.facing === 2) {
      g.circle(-7, 38, 3); g.circle(7, 38, 3); g.fill();
    } else {
      g.circle(this.facing === 1 ? 8 : -8, 38, 4); g.fill();
      g.ellipse(this.facing === 1 ? -8 : 8, 44, 8, 13); g.fill();
    }
    g.fillColor = GOLD;
    const dx = this.facing === 1 ? 19 : this.facing === 3 ? -19 : 0;
    const dy = this.facing === 0 ? 21 : this.facing === 2 ? 5 : 13;
    g.circle(dx, dy, 4); g.fill();
  }

  private sampleBuildings(): void {
    this.drawMap();
    const frames = [7, 4, 6, 19, 20];
    const names = ['摊位', '桥', '阎罗殿', '灯笼', '岸树'];
    this.selected = 0;
    this.facing = 0;
    this.restored = false;
    const display = this.makeNode('BuildingPreview', this.stage, 620, 390, 0, 104);
    const repaint = () => {
      display.removeAllChildren();
      this.drawRect(display, 0, 0, 570, 338, new Color(25, 46, 66, 230));
      const frame = this.selected === 0 && this.restored ? 8 : frames[this.selected];
      this.sprite(display, frame, -125, -96, 190, 155);
      this.directionGlyph(display, 140, -68, this.facing, 115);
      this.label(display, `${names[this.selected]} · ${['北', '东', '南', '西'][this.facing]}`, 0, 104, 28, GOLD);
      this.label(display, '右侧为四方向占位形体；美术仅有单向源图', 0, 57, 18, MUTED, 550);
      this.status.string = `${names[this.selected]} / ${['北', '东', '南', '西'][this.facing]} · 锚点固定；正式方向图待制作`;
    };
    this.button(this.page, '切换建筑', -185, -340, 170, 66, () => { this.selected = (this.selected + 1) % 5; repaint(); });
    this.button(this.page, '切换方向', 0, -340, 170, 66, () => { this.facing = (this.facing + 1) % 4; repaint(); });
    this.button(this.page, '破败/修复', 185, -340, 170, 66, () => { this.restored = !this.restored; repaint(); });
    repaint();
  }

  private sampleSprites(): void {
    this.drawMap();
    this.selected = 0;
    this.blocked = new Set(['3,3', '3,4', '4,3']);
    this.addBuilding(7, 3, 3);
    this.drawGridOverlay(true);
    this.spawnActor(5, 3, 10);
    this.actor!.node.getComponent(Sprite)!.enabled = false;
    this.sourcePreview = this.sprite(this.world, 9, -220, 120, 60, 75);
    this.label(this.world, '源图', -220, 145, 17, MUTED, 70, 30);
    const actorGraphic = this.makeNode('FourDirectionActor', this.actor!.node, 58, 66);
    this.directionGraphics = actorGraphic.addComponent(Graphics);
    this.facing = 2;
    this.paintActorDirection();
    this.movementButtons();
    this.button(this.page, '切换角色', 0, -260, 170, 54, () => {
      this.selected = (this.selected + 1) % 4;
      this.sourcePreview!.getComponent(Sprite)!.spriteFrame = this.frames[[9, 10, 13, 16][this.selected]];
      this.paintActorDirection();
      this.status.string = `${['店长', '飘浮顾客', '角兽顾客', '符纸顾客'][this.selected]} · 四方向形体占位`;
    });
    this.label(this.page, '四方向形体为程序占位；原图只提供单向帧', 0, -212, 18, MUTED);
    this.status.string = '方向键或按钮移动；四方向脸部与脚点随朝向变化';
  }

  private sampleOcclusion(): void {
    this.drawMap();
    this.blocked = new Set(['3,3']);
    this.addBuilding(7, 3, 3, 160, 120);
    this.spawnActor(4, 3, 16);
    const roof = this.makeNode('OcclusionRoof', this.world, 180, 80, 0, 60);
    const g = roof.addComponent(Graphics);
    g.fillColor = new Color(89, 71, 141, 215);
    g.moveTo(-74, -13); g.lineTo(0, 31); g.lineTo(74, -13);
    g.lineTo(0, -45); g.close(); g.fill();
    g.strokeColor = GOLD; g.lineWidth = 2;
    g.moveTo(-74, -13); g.lineTo(0, 31); g.lineTo(74, -13); g.stroke();
    this.occlusionRoof = roof;
    this.sortOcclusion();
    this.movementButtons();
    this.status.string = '按脚点 Y 排序；紫色屋檐是独立的前景占位层';
  }

  private sortOcclusion(): void {
    if (!this.actor) return;
    const nodes = this.world.children.filter(node => node.name.startsWith('Art_') && node !== this.actor!.node);
    const building = nodes.find(node => node.name === 'Art_7');
    if (!building) return;
    if (this.actor.node.position.y < building.position.y) {
      building.setSiblingIndex(this.world.children.length - 1);
      if (this.occlusionRoof) this.occlusionRoof.setSiblingIndex(this.world.children.length - 1);
      this.actor.node.setSiblingIndex(this.world.children.length - 1);
    } else {
      this.actor.node.setSiblingIndex(building.getSiblingIndex());
      if (this.occlusionRoof) this.occlusionRoof.setSiblingIndex(this.world.children.length - 1);
    }
  }

  private sampleEffects(): void {
    this.drawMap();
    this.sprite(this.world, 19, -108, 20, 54, 96);
    this.effectTree = this.sprite(this.world, 20, 138, -35, 126, 134);
    const fxNode = this.makeNode('Vfx', this.world, 600, 730);
    this.effectGraphics = fxNode.addComponent(Graphics);
    const labels = ['灯光', '水波', '树叶'];
    for (let i = 0; i < 3; i++) {
      this.button(this.page, labels[i], (i - 1) * 180, -385, 155, 65, () => {
        this.effects[i] = !this.effects[i];
        this.status.string = `${labels[i]}：${this.effects[i] ? '开启' : '关闭'} · 程序示意特效`;
      });
    }
    this.status.string = '程序示意：低成本光晕、水纹、树摆；需手机实测';
  }

  private sampleUi(): void {
    this.drawMap();
    this.addBuilding(7, 3, 3, 170, 126);
    const card = this.makeNode('ConfirmCard', this.stage, 560, 310, 0, 28);
    const repaint = () => {
      card.removeAllChildren();
      this.drawRect(card, 0, 0, 550, 294, new Color(38, 56, 76, 248));
      this.label(card, this.restored ? '摊位已修复' : '修复这间破败摊位？', 0, 88, 30, GOLD);
      this.label(card, '本单元只演示交互状态，不扣资源', 0, 25, 20, MUTED);
      this.button(card, '取消', -115, -83, 170, 70, () => { card.active = false; this.status.string = '取消修复'; });
      this.button(card, '确认修复', 115, -83, 170, 70, () => {
        this.restored = true; card.active = false;
        this.status.string = '确认完成 · 按钮与弹窗状态已变化';
        this.world.removeAllChildren(); this.drawMap(); this.addBuilding(8, 3, 3, 170, 126);
      }, new Color(70, 116, 105));
    };
    this.restored = false;
    repaint();
    this.button(this.page, '打开修复卡', 0, -370, 220, 67, () => { repaint(); card.active = true; });
    this.status.string = '点击确认或取消；界面限制在 720×1280 安全区域';
  }

  private sampleDensity(): void {
    this.drawMap();
    this.perfTarget = 20;
    this.populateActors();
    this.button(this.page, '− 20', -95, -385, 150, 65,
      () => { this.perfTarget = Math.max(0, this.perfTarget - 20); this.populateActors(); });
    this.button(this.page, '+ 20', 95, -385, 150, 65,
      () => { this.perfTarget = Math.min(200, this.perfTarget + 20); this.populateActors(); });
    this.status.string = '样本帧率统计中；真实结论需在目标手机测量';
  }

  private populateActors(): void {
    this.perfActors.forEach(node => node.destroy());
    this.perfActors = [];
    for (let i = 0; i < this.perfTarget; i++) {
      const row = 1 + (i * 13 % 5);
      const col = 1 + (i * 7 % 5);
      const p = this.tilePosition(row, col);
      const node = this.sprite(this.world, [10, 13, 16, 9][i % 4],
        p.x + ((i % 7) - 3) * 9, p.y + Math.floor(i / 7) * 5, 37, 43);
      this.perfActors.push(node);
    }
  }

  private onKeyDown(event: EventKeyboard): void {
    if (event.keyCode === KeyCode.ESCAPE) { this.openMenu(); return; }
    if (this.unit !== 3 && this.unit !== 5 && this.unit !== 6) return;
    if (event.keyCode === KeyCode.ARROW_UP || event.keyCode === KeyCode.KEY_W) this.moveActor(-1, 0);
    if (event.keyCode === KeyCode.ARROW_RIGHT || event.keyCode === KeyCode.KEY_D) this.moveActor(0, 1);
    if (event.keyCode === KeyCode.ARROW_DOWN || event.keyCode === KeyCode.KEY_S) this.moveActor(1, 0);
    if (event.keyCode === KeyCode.ARROW_LEFT || event.keyCode === KeyCode.KEY_A) this.moveActor(0, -1);
  }

  protected update(dt: number): void {
    if (this.unit === 7 && this.effectGraphics) {
      this.effectTime += dt;
      const g = this.effectGraphics;
      g.clear();
      if (this.effects[0]) {
        g.fillColor = new Color(255, 194, 93, 42 + Math.round(20 * Math.sin(this.effectTime * 2)));
        g.circle(-108, 65, 55 + 4 * Math.sin(this.effectTime * 2)); g.fill();
        g.fillColor = new Color(255, 194, 93, 28 + Math.round(10 * Math.sin(this.effectTime * 2)));
        g.ellipse(-108, -10, 42, 12); g.fill();
      }
      if (this.effects[1]) {
        g.strokeColor = new Color(114, 221, 255, 145);
        g.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const radius = 22 + ((this.effectTime * 25 + i * 27) % 82);
          g.ellipse(-200, -20, radius, radius * 0.28); g.stroke();
        }
      }
      if (this.effectTree) this.effectTree.angle = this.effects[2]
        ? Math.sin(this.effectTime * 1.5) * 2.2 : 0;
    }
    if (this.unit === 9) {
      this.fpsTime += dt; this.fpsFrames++;
      if (this.fpsTime >= 0.8) {
        this.fps = Math.round(this.fpsFrames / this.fpsTime);
        this.fpsTime = 0; this.fpsFrames = 0;
        this.status.string = `${this.perfTarget} 角色 · 样本 ${this.fps} FPS · 请在目标手机重复测试`;
      }
    }
  }
}
