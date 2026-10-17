import { _decorator, Component, Node, resources, Sprite, SpriteFrame, UITransform, UIOpacity } from 'cc';
import { SAKURA_V03_LAYOUT } from './sakura_v03_layout';
import type { UserLayoutEntry } from './sakura_user_layout';
import { deriveWaterGroups, recaptureWaterGroupPositions, sampleWaterGroupCenter, WaterEntry } from './sakura_water_motion_math';

const LAYERS = ['L01_Sky', 'L02_Mountains', 'L03_Ground', 'L04_WaterBridge', 'L05_WaterGrass'];
const { ccclass } = _decorator;
const sourceWidth = SAKURA_V03_LAYOUT.canvas.width;
const sourceHeight = SAKURA_V03_LAYOUT.canvas.height;
const EYE_GLOW_RECT = { left: 1284, top: 250, width: 99, height: 54 };
const EYE_GLOW_MIN_ALPHA = 48;
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

interface MovingGroup {
  nodes: Node[];
  width: number;
  baseLeft: number;
  relativeX: number[];
  baseY: number[];
  direction: 1 | -1;
  appliedCenterX: number;
  baseCenterX: number;
  startElapsed: number;
}

/** Attach the approved eye patch as a child so edits, scale and mirroring follow the far layer. */
export function attachSakuraV03EyeGlow(parent: Node, frame: SpriteFrame): UIOpacity {
  const overlay = new Node('SAKURA_V03_FarLEyeGlow');
  const transform = overlay.addComponent(UITransform);
  const parentSize = parent.getComponent(UITransform)?.contentSize;
  const parentWidth = parentSize?.width ?? sourceWidth / 2;
  const parentHeight = parentSize?.height ?? 720;
  const sprite = overlay.addComponent(Sprite);
  sprite.sizeMode = Sprite.SizeMode.CUSTOM;
  sprite.trim = false;
  sprite.spriteFrame = frame;
  transform.setContentSize(EYE_GLOW_RECT.width, EYE_GLOW_RECT.height);
  overlay.setPosition(
    EYE_GLOW_RECT.left + EYE_GLOW_RECT.width / 2 - parentWidth / 2,
    parentHeight / 2 - (EYE_GLOW_RECT.top + EYE_GLOW_RECT.height / 2), 0,
  );
  parent.addChild(overlay);
  const opacity = overlay.addComponent(UIOpacity);
  opacity.opacity = 255;
  console.info(`[SAKURA_V03_EYE_GLOW_CONFIGURED] ${JSON.stringify(eyeGlowDiagnosticSnapshot(overlay, parent, sprite))}`);
  return opacity;
}

function eyeGlowDiagnosticSnapshot(overlay: Node, parent: Node, sprite: Sprite): Record<string, unknown> {
  const overlaySize = overlay.getComponent(UITransform)?.contentSize;
  const parentTransform = parent.getComponent(UITransform);
  const parentSize = parentTransform?.contentSize;
  const frame = sprite.spriteFrame;
  return {
    overlayContentSize: overlaySize ? { width: overlaySize.width, height: overlaySize.height } : null,
    overlayScale: { x: overlay.scale.x, y: overlay.scale.y, z: overlay.scale.z },
    parentContentSize: parentSize ? { width: parentSize.width, height: parentSize.height } : null,
    parentScale: { x: parent.scale.x, y: parent.scale.y, z: parent.scale.z },
    spriteFrame: frame ? {
      uuid: frame.uuid,
      rect: { x: frame.rect.x, y: frame.rect.y, width: frame.rect.width, height: frame.rect.height },
      originalSize: { width: frame.originalSize.width, height: frame.originalSize.height },
    } : null,
    spriteSizeMode: sprite.sizeMode,
    spriteTrim: sprite.trim,
  };
}

/** Shared horizontal river driver. It never changes static backgrounds or vertical coordinates. */
@ccclass('SakuraV03Motion')
export class SakuraV03Motion extends Component {
  private elapsed = 0;
  private groups: MovingGroup[] = [];
  private eyeGlows: UIOpacity[] = [];
  private eyeGlowFirstUpdateLogged = false;

  public configureWater(groups: Array<{ nodes: Node[]; direction: 1 | -1 }>, eyeGlows: UIOpacity[] = []): void {
    this.elapsed = 0;
    this.groups = groups.map(group => this.makeGroup(group.nodes, group.direction)).filter((group): group is MovingGroup => !!group);
    this.eyeGlows = eyeGlows.filter(opacity => opacity?.isValid);
    this.eyeGlowFirstUpdateLogged = false;
  }

  /** Re-capture user-edited baseline coordinates while removing the last preview offset. */
  public captureBaseline(changedNode: Node): void {
    const group = this.groups.find(candidate => candidate.nodes.includes(changedNode));
    if (!group) return;
    const delta = group.appliedCenterX - group.baseCenterX;
    const changedIndex = group.nodes.indexOf(changedNode);
    const baselineX = recaptureWaterGroupPositions(group.nodes.map(node => node.position.x), changedIndex, delta);
    group.nodes.forEach((node, index) => {
      group.relativeX[index] = baselineX[index];
      group.baseY[index] = node.position.y;
    });
    const bounds = group.nodes.map((node, index) => {
      const width = (node.getComponent(UITransform)?.contentSize.width ?? 0) * Math.abs(node.scale.x);
      return { left: group.relativeX[index] - width / 2, right: group.relativeX[index] + width / 2 };
    });
    const left = Math.min(...bounds.map(bound => bound.left));
    const right = Math.max(...bounds.map(bound => bound.right));
    group.baseLeft = left;
    group.width = right - left;
    group.baseCenterX = left + group.width / 2;
    group.appliedCenterX = group.baseCenterX;
    group.relativeX = group.relativeX.map(x => x - group.baseCenterX);
    group.startElapsed = this.elapsed;
  }

  protected update(dt: number): void {
    if (!Number.isFinite(dt) || dt <= 0 || (!this.groups.length && !this.eyeGlows.length)) return;
    this.elapsed += dt;
    if (this.eyeGlows.length) {
      if (!this.eyeGlowFirstUpdateLogged) {
        const opacity = this.eyeGlows.find(candidate => candidate.isValid);
        const overlay = opacity?.node;
        const sprite = overlay?.getComponent(Sprite);
        const parent = overlay?.parent;
        if (overlay && sprite && parent) {
          console.info(`[SAKURA_V03_EYE_GLOW_FIRST_UPDATE] ${JSON.stringify(eyeGlowDiagnosticSnapshot(overlay, parent, sprite))}`);
          this.eyeGlowFirstUpdateLogged = true;
        }
      }
      const wave = (1 + Math.cos(this.elapsed * Math.PI / 2)) / 2;
      const alpha = Math.round(EYE_GLOW_MIN_ALPHA + (255 - EYE_GLOW_MIN_ALPHA) * wave);
      for (const opacity of this.eyeGlows) if (opacity.isValid) opacity.opacity = alpha;
    }
    for (const group of this.groups) {
      const groupElapsed = Math.max(0, this.elapsed - group.startElapsed);
      const centerX = sampleWaterGroupCenter(group.baseLeft, group.width, group.direction, groupElapsed);
      const delta = centerX - group.baseCenterX;
      group.nodes.forEach((node, index) => {
        if (node.isValid) node.setPosition(group.baseCenterX + group.relativeX[index] + delta, group.baseY[index], node.position.z);
      });
      group.appliedCenterX = centerX;
    }
  }

  protected onDestroy(): void {
    this.groups = [];
    this.eyeGlows = [];
  }

  private makeGroup(nodes: Node[], direction: 1 | -1): MovingGroup | null {
    const activeNodes = nodes.filter(node => node?.isValid);
    if (activeNodes.length !== 3) return null;
    const relativeX = activeNodes.map(node => node.position.x);
    const baseY = activeNodes.map(node => node.position.y);
    const bounds = activeNodes.map(node => {
      const width = (node.getComponent(UITransform)?.contentSize.width ?? 0) * Math.abs(node.scale.x);
      return { left: node.position.x - width / 2, right: node.position.x + width / 2 };
    });
    const baseLeft = Math.min(...bounds.map(bound => bound.left));
    const right = Math.max(...bounds.map(bound => bound.right));
    const width = right - baseLeft;
    const baseCenterX = baseLeft + width / 2;
    return {
      nodes: activeNodes, width, baseLeft,
      relativeX: relativeX.map(x => x - baseCenterX), baseY,
      direction, appliedCenterX: baseCenterX, baseCenterX, startElapsed: this.elapsed,
    };
  }
}

/** Populate approved v0.5 source instances; river motion is a transient runtime transform. */
export function populateSakuraV03(root: Node, _viewport: Node, profile?: readonly UserLayoutEntry[],
  preloadedFrames?: ReadonlyMap<string, SpriteFrame>): void {
  // Production pages pass a page-owned map so this function neither reaches into
  // the global resources cache nor extends those frames beyond that page lease.
  const framesPromise = preloadedFrames ? Promise.resolve(preloadedFrames) : loadFrames();
  void framesPromise.then(frames => {
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
    const instances = profile
      ? profile.filter(instance => !instance.instanceId.startsWith('ORIGINAL-SHOP-')).map(instance => ({
        instanceId: instance.instanceId, assetId: instance.assetId, layer: instance.layer,
        width: instance.sourceSize.width, height: instance.sourceSize.height,
        left: instance.left, top: instance.top, scale: instance.scale,
        mirror: instance.mirror, motion: instance.motion, order: instance.orderBottomToTop,
      })).sort((a, b) => a.order - b.order)
      : SAKURA_V03_LAYOUT.instances.map((instance, order) => ({
        instanceId: instance.instanceId, assetId: instance.assetId, layer: instance.layer,
        width: instance.width, height: instance.height,
        left: instance.x, top: instance.y, scale: 1,
        mirror: instance.mirror, motion: instance.motion, order: instance.order ?? order,
      })).sort((a, b) => a.order - b.order);
    const layerOrder = new Map<string, number>();
    const nodesById = new Map<string, Node>();
    for (const instance of instances) {
      const frame = frames.get(instance.assetId);
      const layerIndex = LAYERS.indexOf(instance.layer);
      const parent = groups[layerIndex];
      if (!frame || !parent) continue;
      const node = new Node(instance.instanceId);
      const transform = node.addComponent(UITransform);
      const sprite = node.addComponent(Sprite);
      sprite.sizeMode = Sprite.SizeMode.CUSTOM;
      sprite.trim = false;
      sprite.spriteFrame = frame;
      transform.setContentSize(instance.width, instance.height);
      const scaleX = instance.mirror ? -instance.scale : instance.scale;
      node.setScale(scaleX, instance.scale, 1);
      node.setPosition(instance.left + instance.width * instance.scale / 2 - sourceWidth / 2,
        sourceHeight / 2 - (instance.top + instance.height * instance.scale / 2), 0);
      parent.addChild(node);
      const sibling = layerOrder.get(instance.layer) ?? 0;
      node.setSiblingIndex(sibling);
      layerOrder.set(instance.layer, sibling + 1);
      nodesById.set(instance.instanceId, node);
    }
    const definitions = deriveWaterGroups(instances as WaterEntry[]);
    const waterGroups = definitions.map(definition => ({
      nodes: definition.memberIds.map(id => nodesById.get(id)).filter((node): node is Node => !!node),
      direction: definition.direction,
    }));
    const eyeFrame = frames.get('tex_sakura_rr_far_l_eye_glow');
    const farLayerInstances = instances as Array<{ instanceId: string; assetId: string }>;
    const eyeGlows = eyeFrame ? farLayerInstances
      .filter(instance => instance.assetId === 'tex_sakura_rr_far_l')
      .map(instance => nodesById.get(instance.instanceId))
      .filter((node): node is Node => !!node)
      .map(node => attachSakuraV03EyeGlow(node, eyeFrame)) : [];
    const marker = new Node('SAKURA_V03_READY');
    root.addChild(marker);
    const motion = root.addComponent(SakuraV03Motion);
    motion.configureWater(waterGroups, eyeGlows);
  }).catch(error => console.error('[SAKURA_V03] 环境资源加载失败：', error));
}
