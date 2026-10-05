"""Render review stills and check viewport bounds without changing source artwork."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[2] / "art" / "moonlit_psd_20261005_v2_raw"
SOURCES = SOURCE / "layer_sources"
WIDTH, HEIGHT = 2172, 724
LAYERS = [
    ("sky", 0.3, "exec-94477409-2d97-4ffe-94ac-7ed6b13aa590.png"),
    ("mountains", 0.8, "exec-933386cf-d4a2-473b-a3d8-e9c943399806.png"),
    ("midground", 1.0, "exec-23db4183-120a-4142-8aea-afcbf4370303.png"),
    ("foreground", 1.0, "exec-c82fb659-2bf7-414a-a322-2e532ea7a749.png"),
]
EXPECTED_SHA = {Path(item["copy"]).name: item["sha256"].lower() for item in json.loads((SOURCE / "source_hashes.json").read_text(encoding="utf-8"))}


def geometry(view_width: int, view_height: int, zoom: float) -> dict:
    cover = max(view_width / WIDTH, view_height / HEIGHT)
    scale = cover * zoom
    visible_width = view_width / scale
    max_camera = (WIDTH - visible_width) / 2
    return {"viewport": [view_width, view_height], "zoom": zoom, "scale": scale, "visible_source_width": visible_width, "max_camera_x": max_camera}


def render(images: dict[str, Image.Image], view_width: int, view_height: int, zoom: float, camera_x: float, path: Path) -> None:
    scale = geometry(view_width, view_height, zoom)["scale"]
    result = Image.new("RGBA", (view_width, view_height), "#10172b")
    for name, ratio, _ in LAYERS:
        source = images[name]
        left = (WIDTH - view_width / scale) / 2 + camera_x * ratio
        top = (HEIGHT - view_height / scale) / 2
        layer = source.transform(
            (view_width, view_height),
            Image.Transform.AFFINE,
            (1 / scale, 0, left, 0, 1 / scale, top),
            resample=Image.Resampling.BICUBIC,
            fillcolor=(0, 0, 0, 0),
        )
        result = Image.alpha_composite(result, layer)
    path.parent.mkdir(parents=True, exist_ok=True)
    result.convert("RGB").save(path)


def main() -> None:
    images = {}
    for name, _ratio, filename in LAYERS:
        path = SOURCES / filename
        sha = hashlib.sha256(path.read_bytes()).hexdigest()
        assert sha == EXPECTED_SHA[filename], f"Source changed: {filename}"
        image = Image.open(path).convert("RGBA")
        assert image.height == HEIGHT and image.width in (WIDTH, WIDTH - 1)
        images[name] = image

    checked = []
    for view_width, view_height in ((720, 1280), (390, 844)):
        for zoom in (1.0, 1.8):
            info = geometry(view_width, view_height, zoom)
            assert info["scale"] * HEIGHT >= view_height
            for camera_x in (-info["max_camera_x"], 0, info["max_camera_x"]):
                for name, ratio, _ in LAYERS:
                    image_width = images[name].width
                    left = (WIDTH - info["visible_source_width"]) / 2 + camera_x * ratio
                    right = left + info["visible_source_width"]
                    assert left >= -0.001 and right <= image_width + 0.001, (view_width, view_height, zoom, camera_x, name, left, right)
                checked.append([view_width, view_height, zoom, round(camera_x, 3)])

    # Stills match the browser's layer order and camera formula. They omit UI controls.
    g = geometry(720, 1280, 1)
    render(images, 720, 1280, 1, 0, HERE / "stills" / "portrait_720_center.png")
    render(images, 720, 1280, 1, -g["max_camera_x"], HERE / "stills" / "portrait_720_left.png")
    render(images, 720, 1280, 1, g["max_camera_x"], HERE / "stills" / "portrait_720_right.png")
    render(images, 390, 844, 1, 0, HERE / "stills" / "portrait_390_center.png")
    report = {
        "source_canvas": [WIDTH, HEIGHT],
        "ratios_front_to_back": [1, 1, 0.8, 0.3],
        "zoom_range_relative_to_portrait_cover": [1, 1.8],
        "source_hashes_match_previous_psd_inputs": True,
        "geometry_cases_checked": checked,
        "portrait_720_fit": g,
        "portrait_390_fit": geometry(390, 844, 1),
        "note": "Checks mathematical image bounds. Visual/Creator/device review remains separate.",
    }
    (HERE / "geometry_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
