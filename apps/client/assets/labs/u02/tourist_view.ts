import { Node, Sprite, SpriteFrame, UITransform, UISkew, Vec2 } from 'cc';
import { TouristFacing, TouristSlot } from './tourist_state';
import {
  TouristAccessory, TouristMount, TouristMountFrame, TouristPoint,
} from './tourist_adapter';

const SLOT_ORDER: TouristSlot[] = ['hat', 'glasses', 'wristband'];

interface AccessoryLayer {
  node: Node;
  skew: UISkew;
  sprite: Sprite;
}

interface Placement {
  layer: AccessoryLayer;
  image: SpriteFrame;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotationDeg: number;
  skewXDeg: number;
}

/** One prefab instance with independent back/body/front draw layers. */
export class TouristView {
  private readonly mirrorRoot: Node;
  private readonly body: Sprite;
  private readonly front = new Map<TouristSlot, AccessoryLayer>();
  private readonly back = new Map<TouristSlot, AccessoryLayer>();

  constructor(public readonly root: Node) {
    this.mirrorRoot = this.node('MirrorRoot', root);
    const backRoot = this.node('AccessoryBack', this.mirrorRoot);
    this.body = this.sprite('BodySprite', this.mirrorRoot);
    const frontRoot = this.node('AccessoryFront', this.mirrorRoot);
    for (const slot of SLOT_ORDER) {
      this.back.set(slot, this.accessoryLayer(`Back_${slot}`, backRoot));
      this.front.set(slot, this.accessoryLayer(`Front_${slot}`, frontRoot));
    }
    this.clear();
  }

  public setStageHeight(height: number): void {
    const scale = Math.min(0.9, Math.max(0.4, (height - 60) / 356));
    this.mirrorRoot.setScale(scale * (this.mirrorRoot.scale.x < 0 ? -1 : 1), scale, 1);
    this.mirrorRoot.setPosition(0, -192 * scale);
  }

  public apply(
    frame: SpriteFrame,
    data: TouristMountFrame,
    selected: Partial<Record<TouristSlot, TouristAccessory>>,
    resources: Map<string, SpriteFrame>,
    facing: TouristFacing,
  ): boolean {
    if (!frame || !data.mounts || !data.foot) return false;
    const placements: Placement[] = [];
    for (const slot of SLOT_ORDER) {
      const accessory = selected[slot];
      if (!accessory) continue;
      if (accessory.mirrorPolicy !== 'mirror_with_body') return false;
      const mount = data.mounts[accessory.mountKey];
      if (!mount) return false;
      if (!mount.valid || !mount.visible) continue;
      const mode = data.occlusion[slot];
      if (slot === 'wristband' && mode !== 'back_and_front') return false;
      if (slot !== 'wristband' && mode !== 'front') return false;
      const transform = this.affinePlacement(data.foot, mount, accessory.pivot, accessory.size);
      const parts = accessory.exports;
      for (let i = 0; i < parts.length; i++) {
        const image = resources.get(parts[i]);
        const layer = parts.length === 2 && i === 0
          ? this.back.get(slot) : this.front.get(slot);
        if (!image || !layer) return false;
        placements.push({ layer, image, ...transform,
          width: accessory.size.width, height: accessory.size.height });
      }
    }

    // Validate the whole frame before changing its visible state.
    this.clear();
    this.body.spriteFrame = frame;
    this.body.node.getComponent(UITransform)!.setContentSize(512, 512);
    this.body.node.setPosition(256 - data.foot.x, data.foot.y - 256);
    this.body.node.active = true;
    for (const item of placements) {
      item.layer.sprite.spriteFrame = item.image;
      item.layer.sprite.node.getComponent(UITransform)!.setContentSize(item.width, item.height);
      item.layer.sprite.node.setPosition(0, 0);
      item.layer.node.setPosition(item.x, item.y);
      item.layer.node.setRotationFromEuler(0, 0, item.rotationDeg);
      item.layer.node.setScale(item.scaleX, item.scaleY, 1);
      item.layer.skew.rotational = false;
      item.layer.skew.setSkew(new Vec2(item.skewXDeg, 0));
      item.layer.node.active = true;
    }
    const scale = Math.abs(this.mirrorRoot.scale.x) || 1;
    this.mirrorRoot.setScale(facing === 'left' ? -scale : scale, scale, 1);
    return true;
  }

  public clear(): void {
    this.body.spriteFrame = null;
    this.body.node.active = false;
    for (const slot of SLOT_ORDER) {
      const back = this.back.get(slot)!;
      const front = this.front.get(slot)!;
      back.sprite.spriteFrame = null;
      front.sprite.spriteFrame = null;
      back.node.active = false;
      front.node.active = false;
    }
  }

  /**
   * VFX stores affine matrices in top-down canvas coordinates. Convert that
   * matrix to Cocos' y-up space, then decompose it into rotation, scale and
   * horizontal UISkew so the saved localAffine shear is retained.
   */
  private affinePlacement(
    foot: TouristPoint, mount: TouristMount, pivot: TouristPoint,
    size: { width: number; height: number },
  ): Omit<Placement, 'layer' | 'image' | 'width' | 'height'> {
    const [a, bDown, c, d] = mount.localAffine;
    const b = -bDown;
    const cUp = -c;
    const determinant = a * d - cUp * b;
    const scaleX = Math.hypot(a, b);
    const rotation = Math.atan2(b, a);
    const scaleY = determinant / scaleX;
    const shearX = (a * cUp + b * d) / (scaleX * scaleX);
    const skewXDeg = Math.atan(shearX) * 180 / Math.PI;
    const offsetX = size.width / 2 - pivot.x;
    const offsetY = size.height / 2 - pivot.y;
    const centerX = mount.x + a * offsetX + c * offsetY;
    const centerYDown = mount.y + bDown * offsetX + d * offsetY;
    return {
      x: centerX - foot.x,
      y: foot.y - centerYDown,
      scaleX,
      scaleY,
      rotationDeg: rotation * 180 / Math.PI,
      skewXDeg,
    };
  }

  private node(name: string, parent: Node): Node {
    const node = new Node(name);
    parent.addChild(node);
    node.addComponent(UITransform).setContentSize(1, 1);
    return node;
  }

  private sprite(name: string, parent: Node): Sprite {
    const node = this.node(name, parent);
    const sprite = node.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    return sprite;
  }

  private accessoryLayer(name: string, parent: Node): AccessoryLayer {
    const node = this.node(name, parent);
    const skew = node.addComponent(UISkew);
    const spriteNode = this.node('Sprite', node);
    const sprite = spriteNode.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    return { node, skew, sprite };
  }
}
