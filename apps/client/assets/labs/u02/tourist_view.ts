import { Node, Sprite, SpriteFrame, UITransform } from 'cc';
import { TouristFacing, TouristSlot } from './tourist_state';
import {
  TouristAccessory, TouristMountFrame, TouristPoint,
} from './tourist_adapter';

const SLOT_ORDER: TouristSlot[] = ['hat', 'glasses', 'wristband'];

/** One prefab instance. The five draw nodes remain separate from every body PNG. */
export class TouristView {
  private readonly mirrorRoot: Node;
  private readonly body: Sprite;
  private readonly front = new Map<TouristSlot, Sprite>();
  private readonly back = new Map<TouristSlot, Sprite>();

  constructor(public readonly root: Node) {
    this.mirrorRoot = this.node('MirrorRoot', root);
    const backRoot = this.node('AccessoryBack', this.mirrorRoot);
    this.body = this.sprite('BodySprite', this.mirrorRoot);
    const frontRoot = this.node('AccessoryFront', this.mirrorRoot);
    for (const slot of SLOT_ORDER) {
      this.back.set(slot, this.sprite(`Back_${slot}`, backRoot));
      this.front.set(slot, this.sprite(`Front_${slot}`, frontRoot));
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
    const placements: Array<{ sprite: Sprite; image: SpriteFrame; x: number; y: number;
      width: number; height: number }> = [];
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
      const anchor = this.placement(data.foot, mount, accessory.pivot, accessory.size);
      const parts = accessory.exports;
      for (let i = 0; i < parts.length; i++) {
        const image = resources.get(parts[i]);
        const sprite = parts.length === 2 && i === 0
          ? this.back.get(slot) : this.front.get(slot);
        if (!image || !sprite) return false;
        placements.push({ sprite, image, ...anchor,
          width: accessory.size.width, height: accessory.size.height });
      }
    }

    // All referenced slices are checked before the visible state is changed.
    this.clear();
    this.body.spriteFrame = frame;
    this.body.node.getComponent(UITransform)!.setContentSize(512, 512);
    this.body.node.setPosition(256 - data.foot.x, data.foot.y - 256);
    this.body.node.active = true;
    for (const item of placements) {
      item.sprite.spriteFrame = item.image;
      item.sprite.node.getComponent(UITransform)!.setContentSize(item.width, item.height);
      item.sprite.node.setPosition(item.x, item.y);
      item.sprite.node.active = true;
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
      back.spriteFrame = null;
      front.spriteFrame = null;
      back.node.active = false;
      front.node.active = false;
    }
  }

  private placement(
    foot: TouristPoint, mount: TouristPoint, pivot: TouristPoint,
    size: { width: number; height: number },
  ): { x: number; y: number } {
    return {
      x: mount.x - foot.x + size.width / 2 - pivot.x,
      y: foot.y - mount.y + pivot.y - size.height / 2,
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
}
