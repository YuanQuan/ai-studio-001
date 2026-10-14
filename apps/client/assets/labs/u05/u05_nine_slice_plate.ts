import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform } from 'cc';

const { ccclass } = _decorator;

@ccclass('U05NineSlicePlate')
export class U05NineSlicePlate extends Component {
  /** 使用获批的源图像素 inset，对源尺寸 SLICED 后由节点统一缩放。 */
  public bind(frame: SpriteFrame, width: number, height: number): boolean {
    if (!frame || width < 37 || height < 25) return false;
    frame.insetLeft = 18;
    frame.insetRight = 18;
    frame.insetTop = 12;
    frame.insetBottom = 12;
    const transform = this.getComponent(UITransform) ?? this.addComponent(UITransform);
    transform.setContentSize(width, height);
    const sprite = this.getComponent(Sprite) ?? this.addComponent(Sprite);
    sprite.type = Sprite.Type.SLICED;
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = frame;
    return true;
  }
}
