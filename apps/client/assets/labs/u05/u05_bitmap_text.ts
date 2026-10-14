import { _decorator, Component, Label, BitmapFont } from 'cc';

const { ccclass } = _decorator;

@ccclass('U05BitmapText')
export class U05BitmapText extends Component {
  /** 不完整字集不覆盖系统字体，避免静默缺字。换行与制表符由 Label 布局处理。 */
  public static bindLabel(label: Label, font: BitmapFont, value: string): { applied: boolean; missing: string[] } {
    const definitions = font?.fntConfig?.fontDefDictionary as Record<string, unknown> | undefined;
    const missing = Array.from(new Set(Array.from(value).filter(char => {
      if (char === '\n' || char === '\r' || char === '\t' || char === ' ' || char === '\u3000') return false;
      const code = char.codePointAt(0);
      return code === undefined || !definitions || !(String(code) in definitions);
    })));
    if (missing.length) return { applied: false, missing };
    label.font = font;
    label.string = value;
    return { applied: true, missing: [] };
  }
  public bind(label: Label, font: BitmapFont, value: string): { applied: boolean; missing: string[] } {
    return U05BitmapText.bindLabel(label, font, value);
  }
}
