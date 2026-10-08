"""Present the actual v0.3 and v0.4 sign regions at native 1:1 pixels."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.3/preview/light_r3_final"
NEW = ROOT / "preview/sign_polish_v04_final"
OUT = NEW / "three_signs_v03_v04_native_1x.png"
FONT = ROOT.parent / "v0.2/source/rights/ZCOOLKuaiLe-Regular.ttf"
BOXES = [
    (2, "糖画：卡通简牌", (600, 590, 900, 910)),
    (3, "现烤：同源双字", (20, 480, 280, 790)),
    (4, "理发：缩小轻巧剪梳", (300, 400, 720, 550)),
]

def read(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")

def main() -> None:
    panel = Image.new("RGBA", (960, 1000), (24, 43, 79, 255))
    draw = ImageDraw.Draw(panel)
    label_font = ImageFont.truetype(str(FONT), 21)
    caption_font = ImageFont.truetype(str(FONT), 18)
    draw.text((45, 15), "左：v0.3   |   右：v0.4    ·    原画布像素 1:1", font=label_font, fill=(255, 236, 195, 255))
    y_rows = [70, 430, 790]
    for (num, label, box), y in zip(BOXES, y_rows):
        key = f"shop_{num:02d}"
        draw.text((45, y), f"{num:02d}  {label}", font=caption_font, fill=(255, 230, 185, 255))
        old = read(OLD / f"{key}_recomposed.png").crop(box)
        new = read(NEW / f"{key}_recomposed.png").crop(box)
        left_x = 240 - old.width//2
        right_x = 720 - new.width//2
        top = y+34
        panel.alpha_composite(old, (left_x, top))
        panel.alpha_composite(new, (right_x, top))
        draw.line((480, y+34, 480, min(995, y+34+max(old.height,new.height))), fill=(128,145,171,255), width=1)
    panel.convert("RGB").save(OUT)
    print(OUT)

if __name__ == "__main__":
    main()
