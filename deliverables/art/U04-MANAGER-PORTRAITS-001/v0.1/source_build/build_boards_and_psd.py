"""Assemble reviewed whole-stage PNGs into six aligned boards and layered PSDs."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
IDS = ("mt", "at", "ac", "aj", "ad", "xj")
STAGES = (0, 2, 3)
CANVAS = (3584, 1792)
SLOT_X = (128, 1280, 2432)
GROUND_Y = 1650
PSD_TOOL = Path("/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")


def main() -> None:
    (ROOT / "psd_manifests").mkdir(exist_ok=True)
    (ROOT / "psd").mkdir(exist_ok=True)
    (ROOT / "characters").mkdir(exist_ok=True)

    background = Image.new("RGBA", CANVAS, "#ecebe8")
    draw = ImageDraw.Draw(background)
    draw.line((80, GROUND_Y, CANVAS[0] - 80, GROUND_Y), fill="#bdb8ad", width=2)
    bg_path = ROOT / "source_build" / "board_background.png"
    background.save(bg_path)

    results = []
    for ident in IDS:
        layers = [{"name": "中性背景与统一地线", "file": str(bg_path), "fit": "none", "remove_background": "none"}]
        stage_positions = []
        for x, stage in zip(SLOT_X, STAGES):
            source = ROOT / "characters" / f"mgr_{ident}_s{stage}.png"
            with Image.open(source) as opened:
                image = opened.convert("RGBA")
            if image.size != (1024, 1536):
                raise ValueError(f"unexpected stage dimensions: {source}: {image.size}")
            significant = image.getchannel("A").point(lambda v: 255 if v >= 32 else 0).getbbox()
            if significant is None:
                raise ValueError(f"no visible subject: {source}")
            y = GROUND_Y - significant[3]
            if y < 0 or y + image.height > CANVAS[1]:
                raise ValueError(f"unsafe position: {source}: y={y}")
            layers.append({"name": f"{stage}魂｜完整人物图层", "file": str(source), "x": x, "y": y, "fit": "none", "remove_background": "none"})
            stage_positions.append({"stage": stage, "x": x, "y": y, "significant_alpha_bbox": significant})

        psd = ROOT / "psd" / f"mgr_{ident}_board_023.psd"
        preview = ROOT / "characters" / f"mgr_{ident}_board_023.png"
        manifest = {
            "canvas": {"width": CANVAS[0], "height": CANVAS[1], "composite_background": "#ecebe8"},
            "output": str(psd),
            "preview": str(preview),
            "layers": layers,
        }
        manifest_path = ROOT / "psd_manifests" / f"mgr_{ident}_board_023.json"
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        command = [sys.executable, str(PSD_TOOL), "assemble", "--manifest", str(manifest_path)]
        completed = subprocess.run(command, check=True, text=True, capture_output=True)
        results.append({"id": ident, "psd": str(psd), "preview": str(preview), "positions": stage_positions, "tool_result": completed.stdout.strip()})
        print(f"{ident}: {psd.name} / {preview.name}", flush=True)

    (ROOT / "source_build" / "board_build_report.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
