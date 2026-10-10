"""Compose review boards from intact sources, then assemble full-stage PSD layers."""

from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw


BASE = Path(__file__).resolve().parents[1]
SKILL = Path('/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py')
CANVAS = (3900, 1850)
CELL_WIDTH = 1300
BASELINE = 1600
TARGET_MAX_HEIGHT = {
    'ac': 1330,
    'aj': 1330,
}
STAGES = (0, 2, 3)


def significant_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel('A').point(lambda value: 255 if value >= 32 else 0)
    result = alpha.getbbox()
    if result is None:
        raise ValueError('no visible pixels')
    return result


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build(code: str) -> dict:
    source_files = [BASE / 'characters' / f'mgr_{code}_s{s}.png' for s in STAGES]
    if not all(p.exists() for p in source_files):
        raise FileNotFoundError(f'incomplete character {code}')
    images = [Image.open(p).convert('RGBA') for p in source_files]
    boxes = [significant_bbox(im) for im in images]
    max_h = max(box[3] - box[1] for box in boxes)
    factor = TARGET_MAX_HEIGHT[code] / max_h

    background_path = BASE / 'source_build' / 'board_background.png'
    if not background_path.exists():
        bg = Image.new('RGBA', CANVAS, (239, 238, 234, 255))
        draw = ImageDraw.Draw(bg)
        draw.line([(70, BASELINE), (CANVAS[0] - 70, BASELINE)], fill=(198, 195, 189, 255), width=2)
        bg.save(background_path)

    report = {'character': code, 'canvas': list(CANVAS), 'baseline_y': BASELINE,
              'target_max_painted_height': TARGET_MAX_HEIGHT[code],
              'single_character_scale_factor': round(factor, 8), 'stages': []}
    layers = [{'name': '中性审阅背景与统一基线', 'file': str(background_path),
               'fit': 'none', 'remove_background': 'none'}]
    for index, (stage, path, image, box) in enumerate(zip(STAGES, source_files, images, boxes)):
        width = round(image.width * factor)
        height = round(image.height * factor)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        center_x = index * CELL_WIDTH + CELL_WIDTH // 2
        x = round(center_x - (box[0] + box[2]) * factor / 2)
        y = round(BASELINE - box[3] * factor)
        layer = Image.new('RGBA', CANVAS, (0, 0, 0, 0))
        layer.alpha_composite(resized, (x, y))
        layer_path = BASE / 'source_build' / f'mgr_{code}_s{stage}_board_layer.png'
        layer.save(layer_path)
        layers.append({'name': f'{stage}魂｜完整人物图层', 'file': str(layer_path),
                       'fit': 'none', 'remove_background': 'none'})
        report['stages'].append({'stage': stage, 'source': str(path), 'source_sha256': sha256(path),
                                 'source_size': [image.width, image.height],
                                 'source_significant_bbox_alpha32': list(box),
                                 'scaled_full_size': [width, height],
                                 'placement_xy': [x, y], 'layer': str(layer_path),
                                 'layer_sha256': sha256(layer_path),
                                 'painted_bottom_y': round(y + box[3] * factor)})

    board = BASE / 'characters' / f'mgr_{code}_board_023.png'
    psd = BASE / 'psd' / f'mgr_{code}_board_023.psd'
    manifest_path = BASE / 'psd_manifests' / f'mgr_{code}_board_023.json'
    manifest = {'canvas': {'width': CANVAS[0], 'height': CANVAS[1],
                           'composite_background': '#efeeea'},
                'output': str(psd), 'preview': str(board), 'layers': layers}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    completed = subprocess.run(['python3', str(SKILL), 'assemble', '--manifest', str(manifest_path)],
                               check=True, capture_output=True, text=True)
    summary = json.loads(completed.stdout)
    if summary['layer_count'] != 4:
        raise ValueError(f'{code} layer count {summary["layer_count"]}')
    report.update({'board': str(board), 'board_sha256': sha256(board),
                   'psd': str(psd), 'psd_sha256': sha256(psd),
                   'psd_layer_count': summary['layer_count'], 'manifest': str(manifest_path)})
    return report


def main() -> None:
    import sys
    codes = sys.argv[1:] or list(TARGET_MAX_HEIGHT)
    reports_path = BASE / 'source_build' / 'board_build_report.json'
    existing = json.loads(reports_path.read_text()) if reports_path.exists() else {}
    for code in codes:
        existing[code] = build(code)
        print(f'{code}: {existing[code]["board"]} / {existing[code]["psd"]}')
    reports_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
