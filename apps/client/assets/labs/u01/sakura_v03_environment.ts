import { _decorator, Component, Node, resources, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { SAKURA_V03_LAYOUT } from './sakura_v03_layout';

const LAYERS = ['L01_Sky', 'L02_Mountains', 'L03_Ground', 'L04_WaterBridge', 'L05_WaterGrass'];
const { ccclass } = _decorator;
const sourceWidth = SAKURA_V03_LAYOUT.canvas.width;
const sourceHeight = SAKURA_V03_LAYOUT.canvas.height;
const frameCache = new Map<string, SpriteFrame>();
let loadPromise: Promise<Map<string, SpriteFrame>> | null = null;

function loadFrames(): Promise<Map<string, SpriteFrame>> {
  if (loadPromise) return loadPromise;
  loadPromise = Promise.all(SAKURA_V03_LAYOUT.prototypes.map(proto => new Promise<void>((resolve, reject) => {
    const path = `sakura_v03/${proto.path.replace(/\.png$/i, '')}/spriteFrame`;
    resources.load(path, SpriteFrame, (error, frame) => {
      if (error || !frame) { reject(error ?? new Error(`SpriteFrame missing: ${path}`)); return; }
      frameCache.set(proto.id, frame);
      resolve();
    });
  }))).then(() => frameCache).catch(error => {
    loadPromise = null;
    throw error;
  });
  return loadPromise;
}

/** Small, shared motion driver. Baseline node transforms remain untouched for exports. */
@ccclass('SakuraV03Motion')
export class SakuraV03Motion extends Component {
  private elapsed = 0;
  private viewport: Node | null = null;
  private sky: Node | null = null;
  private far: Node | null = null;
  private floaters: Array<{ node: Node; y: number; phase: number }> = [];
  public configure(viewport: Node, sky: Node, far: Node, floaters: Node[]): void {
    this.viewport = viewport;
    this.sky = sky;
    this.far = far;
    this.floaters = floaters.map((node, index) => ({ node, y: node.position.y, phase: index * 1.17 }));
  }
  protected update(dt: number): void {
    this.elapsed += dt;
    const wave = Math.sin(this.elapsed * Math.PI / 4);
    if (this.sky?.isValid) this.sky.setPosition(this.safeOffset(this.sky, 12 * wave), 0, 0);
    if (this.far?.isValid) this.far.setPosition(this.safeOffset(this.far, 6 * wave), 0, 0);
    for (const item of this.floaters) if (item.node.isValid)
      item.node.setPosition(item.node.position.x, item.y + 2 * Math.sin(this.elapsed * Math.PI * 2 / 3 + item.phase), item.node.position.z);
  }
  private safeOffset(content: Node, requested: number): number {
    const viewportTransform = this.viewport?.getComponent(UITransform);
    const layerTransform = content.parent?.getComponent(UITransform);
    if (!viewportTransform || !layerTransform) return 0;
    const halfWidth = viewportTransform.contentSize.width / 2;
    const leftWorld = viewportTransform.convertToWorldSpaceAR(new Vec3(-halfWidth, 0, 0));
    const rightWorld = viewportTransform.convertToWorldSpaceAR(new Vec3(halfWidth, 0, 0));
    const visibleLeft = layerTransform.convertToNodeSpaceAR(leftWorld).x;
    const visibleRight = layerTransform.convertToNodeSpaceAR(rightWorld).x;
    const minOffset = visibleRight - sourceWidth / 2;
    const maxOffset = visibleLeft + sourceWidth / 2;
    if (minOffset > maxOffset) return 0;
    return Math.max(minOffset, Math.min(maxOffset, requested));
  }
}

/** Fill the stable five-layer Prefab interface with the shared Art v0.5 environment. */
export function populateSakuraV03(root: Node, viewport: Node): void {
  void loadFrames().then(frames => {
    if (!root.isValid || root.getChildByName('SAKURA_V03_READY')) return;
    const layers = LAYERS.map(name => root.getChildByName(name));
    if (layers.some(layer => !layer)) {
      console.error('[SAKURA_V03] 共用背景缺少五层节点，未加载环境。');
      return;
    }
    const groups = layers.map((layer, index) => {
      const group = new Node(`SAKURA_V03_Content_${index + 1}`);
      group.addComponent(UITransform).setContentSize(sourceWidth, sourceHeight);
      layer!.addChild(group);
      return group;
    });
    const floaters: Node[] = [];
    for (const instance of SAKURA_V03_LAYOUT.instances) {
      const proto = SAKURA_V03_LAYOUT.prototypes.find(item => item.id === instance.assetId);
      const frame = frames.get(instance.assetId);
      const layerIndex = LAYERS.indexOf(instance.layer);
      const parent = groups[layerIndex];
      if (!proto || !frame || !parent) continue;
      const node = new Node(instance.instanceId);
      const transform = node.addComponent(UITransform);
      const sprite = node.addComponent(Sprite);
      sprite.sizeMode = Sprite.SizeMode.CUSTOM;
      sprite.trim = false;
      sprite.spriteFrame = frame;
      transform.setContentSize(instance.width, instance.height);
      const scaleX = instance.mirror ? -1 : 1;
      node.setScale(scaleX, 1, 1);
      node.setPosition(instance.x + instance.width / 2 - sourceWidth / 2,
        sourceHeight / 2 - (instance.y + instance.height / 2), 0);
      parent.addChild(node);
      if (instance.motion === 'flame_float') floaters.push(node);
    }
    const marker = new Node('SAKURA_V03_READY');
    root.addChild(marker);
    const motion = root.addComponent(SakuraV03Motion);
    motion.configure(viewport, groups[0], groups[1], floaters);
  }).catch(error => console.error('[SAKURA_V03] 环境资源加载失败：', error));
}
