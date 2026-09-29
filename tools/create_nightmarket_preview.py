from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


SOURCE = Path(
    r"C:\Users\admin\.codex\generated_images\01a0e30d-7b5a-7792-9edc-3423290f42de"
    r"\exec-da5042ce-eb66-476f-86bb-ac3f517657cd.png"
)
OUTPUT = Path("deliverables/visual-concepts/nightmarket-ambient-preview-v1.gif")
WIDTH = 480
FRAMES = 18


def blurred_glow(size: tuple[int, int], x: float, y: float, radius: float, alpha: int) -> Image.Image:
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(255, 180, 76, alpha))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.68))


def make_frame(base: Image.Image, frame_index: int) -> Image.Image:
    phase = frame_index / FRAMES * math.tau
    frame = base.copy().convert("RGBA")
    glow_strength = 50 + int(18 * (math.sin(phase) + 1) / 2)
    lanterns = [(45, 685), (120, 635), (220, 620), (330, 710), (405, 665), (458, 610)]
    for x, y in lanterns:
        drift = math.sin(phase + x * 0.02) * 1.5
        frame.alpha_composite(blurred_glow(frame.size, x, y + drift, 24, glow_strength))

        # A faint, deliberately fake reflection below each light.
        reflection = Image.new("RGBA", frame.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(reflection)
        length = 24 + int(7 * (math.sin(phase + y * 0.03) + 1))
        draw.rounded_rectangle(
            (x - 4, y + 9, x + 4, y + 9 + length),
            radius=4,
            fill=(255, 190, 105, 24),
        )
        frame.alpha_composite(reflection.filter(ImageFilter.GaussianBlur(4)))

    # Small ripples in the water around the lower docks.
    ripples = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(ripples)
    for index, (x, y) in enumerate(((372, 736), (437, 752), (78, 740))):
        radius = 5 + ((frame_index * 1.2 + index * 5) % 18)
        draw.ellipse((x - radius, y - radius * 0.32, x + radius, y + radius * 0.32), outline=(163, 214, 224, 45), width=1)
    frame.alpha_composite(ripples)

    # Sparse moving leaf flecks imply wind without animating every tree.
    leaves = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(leaves)
    for index in range(14):
        anchor_x = 60 + (index * 31) % 360
        anchor_y = 88 + (index * 47) % 250
        x = anchor_x + math.sin(phase + index) * 3.2
        y = anchor_y + math.cos(phase * 1.3 + index) * 1.6
        draw.ellipse((x, y, x + 2.4, y + 1.4), fill=(76, 104, 72, 86))
    frame.alpha_composite(leaves)
    return frame.convert("P", palette=Image.Palette.ADAPTIVE)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    height = round(source.height * WIDTH / source.width)
    base = source.resize((WIDTH, height), Image.Resampling.LANCZOS)
    frames = [make_frame(base, frame_index) for frame_index in range(FRAMES)]
    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=83,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(OUTPUT.resolve())


if __name__ == "__main__":
    main()
