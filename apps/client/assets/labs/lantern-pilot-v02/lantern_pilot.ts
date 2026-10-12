import {
  _decorator, Color, Component, EffectAsset, Graphics, Label,
  Material, Node, Rect, Size, Sprite, SpriteFrame, Texture2D, UITransform, Vec2,

} from 'cc';

const { ccclass, property } = _decorator;
const SOURCE_WIDTH = 1024;
const SOURCE_HEIGHT = 1024;
const KEYS: ReadonlyArray<readonly [number, number]> = [
  [0.0, 1.0], [0.45, 0.96], [0.85, 0.9], [1.2, 0.95], [1.65, 0.92], [2.0, 1.0],
];

@ccclass('LanternLightingPilot')
export class LanternLightingPilot extends Component {
  @property({ type: SpriteFrame }) public bodyFrame: SpriteFrame | null = null;
  @property({ type: SpriteFrame }) public signFrame: SpriteFrame | null = null;
  @property({ type: Texture2D }) public lanternMask: Texture2D | null = null;
  @property({ type: EffectAsset }) public lanternEffect: EffectAsset | null = null;

  private bodySprite: Sprite | null = null;
  private bodyFrameInstance: SpriteFrame | null = null;
  private materialInstance: Material | null = null;
  private status: Label | null = null;
  private running = false;
  private elapsed = 0;
  private strength = 1;
  private readonly baseColor = new Color(255, 255, 255, 255);

  protected onLoad (): void {
    this.buildControls();
    this.buildDisplay();
    this.setStrength(1);
    if (this.bodySprite) this.updateStatus('原画静止');
  }

  protected onDisable (): void {
    this.pauseAndReset();
  }

  protected update (dt: number): void {
    if (!this.running || !this.materialInstance) return;
    this.elapsed = (this.elapsed + dt) % 2.0;
    this.setStrength(this.sampleCurve(this.elapsed));
  }

  private buildDisplay (): void {
    if (!this.bodyFrame || !this.signFrame || !this.lanternMask || !this.lanternEffect) {
      this.updateStatus('资源未加载');
      return;
    }
    const texture = this.bodyFrame.texture;
    if (!texture || texture.width !== SOURCE_WIDTH || texture.height !== SOURCE_HEIGHT) {
      this.updateStatus('原画尺寸不符，已停止');
      return;
    }

    // The independent pilot frame shares the approved texture only; it is never packed.
    const frame = new SpriteFrame();
    frame.texture = texture;
    frame.rect = new Rect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    frame.originalSize = new Size(SOURCE_WIDTH, SOURCE_HEIGHT);
    frame.offset = new Vec2(0, 0);
    frame.rotated = false;
    frame.packable = false;
    this.bodyFrameInstance = frame;

    const bodyNode = new Node('试验灯笼店体');
    bodyNode.parent = this.node;
    bodyNode.setPosition(0, 126, 0);
    bodyNode.setScale(0.56, 0.56, 1);
    const bodyTransform = bodyNode.addComponent(UITransform);
    bodyTransform.setContentSize(SOURCE_WIDTH, SOURCE_HEIGHT);
    const sprite = bodyNode.addComponent(Sprite);
    sprite.spriteFrame = frame;
    sprite.color = this.baseColor;
    this.bodySprite = sprite;

    const material = new Material();
    material.initialize({ effectAsset: this.lanternEffect });
    material.setProperty('lanternMask', this.lanternMask);
    material.setProperty('strength', 1.0);
    sprite.customMaterial = material;
    this.materialInstance = material;

    const signNode = new Node('原招牌');
    signNode.parent = this.node;
    signNode.setPosition(0, 126, -0.1);
    signNode.setScale(0.56, 0.56, 1);
    signNode.addComponent(UITransform).setContentSize(SOURCE_WIDTH, SOURCE_HEIGHT);
    const signSprite = signNode.addComponent(Sprite);
    signSprite.spriteFrame = this.signFrame;
    signSprite.color = this.baseColor;

    const uv = Array.from(frame.uv);
    this.updateStatus(`基准 1.00 · UV ${uv.map((n) => n.toFixed(3)).join(',')} · ${texture.width}×${texture.height} · packable 关`);
    console.info('[LanternPilot] runtime frame', {
      uv, rect: { x: frame.rect.x, y: frame.rect.y, width: frame.rect.width, height: frame.rect.height },
      originalSize: { width: frame.originalSize.width, height: frame.originalSize.height },
      texture: `${texture.width}x${texture.height}`, packable: frame.packable,
      mask: `${this.lanternMask.width}x${this.lanternMask.height}`,
    });
  }

  private buildControls (): void {
    this.makeButton('播放', -150, () => {
      if (!this.materialInstance || !this.bodySprite) return;
      this.elapsed = 0;
      this.running = true;
      this.setStrength(1);
      this.updateStatus('正在播放');
    });
    this.makeButton('暂停', 0, () => this.pauseAndReset());
    this.makeButton('复位', 150, () => {
      this.running = false;
      this.elapsed = 0;
      this.setStrength(1);
      this.updateStatus('已复位到原画');
    });
    const statusNode = new Node('状态');
    statusNode.parent = this.node;
    statusNode.setPosition(0, -494, 0);
    statusNode.addComponent(UITransform).setContentSize(680, 38);
    const label = statusNode.addComponent(Label);
    label.string = '';
    label.fontSize = 20;
    label.lineHeight = 26;
    label.color = new Color(235, 240, 247, 255);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    this.status = label;
  }

  private makeButton (title: string, x: number, action: () => void): void {
    const node = new Node(`${title}按钮`);
    node.parent = this.node;
    node.setPosition(x, -434, 0);
    node.addComponent(UITransform).setContentSize(132, 54);
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = new Color(37, 70, 93, 255);
    graphics.roundRect(-66, -27, 132, 54, 10);
    graphics.fill();
    const labelNode = new Node('文字');
    labelNode.parent = node;
    labelNode.addComponent(UITransform).setContentSize(126, 48);
    const label = labelNode.addComponent(Label);
    label.string = title;
    label.fontSize = 22;
    label.color = this.baseColor;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    node.on(Node.EventType.TOUCH_END, action, this);
    node.on(Node.EventType.MOUSE_UP, action, this);
  }

  private pauseAndReset (): void {
    this.running = false;
    this.elapsed = 0;
    this.setStrength(1);
    this.updateStatus('已暂停并恢复原画');
  }

  private setStrength (value: number): void {
    this.strength = Math.max(0.9, Math.min(1, value));
    this.materialInstance?.setProperty('strength', this.strength);
    if (this.running) this.updateStatus(`灯笼亮度 ${this.strength.toFixed(2)}`);
  }

  private sampleCurve (time: number): number {
    for (let i = 0; i < KEYS.length - 1; i++) {
      const [ta, va] = KEYS[i];
      const [tb, vb] = KEYS[i + 1];
      if (time <= tb) {
        const raw = Math.max(0, Math.min(1, (time - ta) / (tb - ta)));
        const eased = raw * raw * (3 - 2 * raw);
        return va + (vb - va) * eased;
      }
    }
    return 1;
  }

  private updateStatus (text: string): void {
    if (this.status) this.status.string = text;
  }
}
