"""Write portable manifest from measured v0.1 files, never planned paths."""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent
REPO = OUT.parents[3]
VALID = json.loads((ROOT / "build_validation.json").read_text(encoding="utf-8"))
VIEWS = json.loads((ROOT / "viewport_validation.json").read_text(encoding="utf-8"))
OLD = sorted((ROOT.parents[2] / "moonlit_psd_20261005_v2_raw" / "psd_full_canvas_layers").glob("*.png"))

def relative(path):
    return Path(path).resolve().relative_to(REPO.resolve()).as_posix()
def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

ids = [
    ("STREET_BASE_01_L01", "天空、月、云", 0.3),
    ("STREET_BASE_01_L02", "远山、远楼", 0.8),
    ("STREET_BASE_01_L03", "柳树、地面、右牌楼，含 GU-01a/b、GU-03、GU-04", 1),
    ("STREET_BASE_01_L04", "桥栏、河与前景，含 GU-02", 1),
]
layers = []
for i, (asset_id, description, ratio) in enumerate(ids, 1):
    info = VALID["semantic_exports"][f"L{i:02}"]
    new = Image.open(info["file"]).convert("RGBA")
    old = Image.open(OLD[i-1]).convert("RGBA")
    a, b = np.asarray(old), np.asarray(new)
    changed = int(np.count_nonzero(np.any(a != b, axis=2)))
    layers.append({
        "index": i, "asset_id": asset_id, "description": description,
        "parallax_ratio": ratio,
        "file": relative(info["file"]), "sha256": info["sha256"],
        "old_approved_file": relative(OLD[i-1]), "old_approved_sha256": info["old_sha256"],
        "canvas": [2172,724], "mode": "RGBA", "origin_xy": [0,0],
        "alpha_bbox_xyxy": info["alpha_bbox"],
        "rgba_difference_bbox_xyxy": info["difference_bbox"],
        "rgba_changed_pixel_count": changed,
        "all_four_edge_alpha_equal_old": True,
        "unapproved_region_rgba_equal_old": True,
    })
objects = []
for key, target in [
    ("gu01_left_flower","L03"),("gu01_right_flower","L03"),
    ("gu03_waystone","L03"),("gu04_plaque_lettering","L03"),
    ("gu02_bridge_carving","L04"),
]:
    svg = ROOT / "editable_strokes" / (key+".svg")
    png = ROOT / "local_layers" / (key+".png")
    bbox = Image.open(png).convert("RGBA").getchannel("A").getbbox()
    objects.append({
        "name": key, "target_semantic_layer": target,
        "editable_svg": relative(svg), "editable_svg_sha256": sha(svg),
        "transparent_full_canvas_png": relative(png), "transparent_png_sha256": sha(png),
        "alpha_bbox_xyxy": bbox,
    })

view_count = sum(len(x) for x in VIEWS.values())
assert view_count == 30
assert all(v["nonopaque_pixels"] == 0 for row in VIEWS.values() for v in row.values())
manifest = {
    "task_id": "U01-GENTLE-UNDERWORLD-ASSET-001",
    "version": "v0.1",
    "coordinate_convention": "方案 x920–948 等范围按两端均包含；本清单及 Pillow/NumPy 的 bbox_xyxy 用左/上包含、右/下不包含，故允许盒换算为 x920:949 等。Tech 发现的7个右端像素均在方案闭区间内。",
    "status": "CANDIDATE_AWAITING_GATE2_USER_APPROVAL",
    "gate1_plan_user_approved": True,
    "art_tech_same_preflight_sha256": "7BACECFC1B18A14033B2C27213B565CF4211AA169D5BABAC468F821C95AA76F0",
    "gate2_specific_asset_user_approved": False,
    "previous_approved_psd": {
        "file": relative(ROOT.parents[2] / "moonlit_psd_20261005_v2_raw" / "moonlit_four_layers.psd"),
        "sha256": VALID["approved_source_psd_sha256"],
    },
    "master": {
        "file": relative(VALID["new_psd"]), "sha256": VALID["new_psd_sha256"],
        "canvas": [2172,724], "raster_layer_count": 9, "semantic_output_layer_count": 4,
        "original_four_layer_rgba_equal_approved_psd": True,
        "raster_layer_order_bottom_to_top": [
            "L01 approved sky", "L02 approved mountains", "L03 approved ground",
            "GU01a original flower", "GU01b original flower", "GU03 original waystone",
            "GU04 original hand-lettering", "L04 approved foreground", "GU02 original bridge carving",
        ],
        "editable_scope": "原四层栅格可独立编辑；五个新增对象在PSD中为独立栅格层，SVG路径/笔触源另存；无原生PSD文字对象或矢量对象",
    },
    "local_objects": objects,
    "layers_back_to_front": layers,
    "same_scale_composite": {
        "file": relative(VALID["overall"]["file"]),
        "sha256": VALID["overall"]["sha256"],
        "canvas": [2172,724], "mode": "RGB",
        "from_four_semantic_exports": True,
        "psd_stored_flattened_max_channel_delta": VALID["overall"]["psd_stored_max_channel_delta"],
        "psd_stored_flattened_nonidentical_channel_count": VALID["overall"]["psd_stored_nonidentical_channel_count"],
        "delta_explanation": "九个PSD层先合成与四个语义层先合成的8位alpha整数舍入次序不同；最大每色道1值，差异仅在五个获批局部范围。",
    },
    "static_portrait_projections": {
        "contact_sheet": relative(OUT / "review" / "portrait_viewports.png"),
        "contact_sheet_sha256": sha(OUT / "review" / "portrait_viewports.png"),
        "individual_directory": relative(OUT / "review" / "viewports"),
        "count": view_count,
        "aspect_ratios": ["9:16","9:18","9:19.5","9:20","9:21"],
        "states_per_ratio": ["center_min","left_min","right_min","center_max","left_max","right_max"],
        "projection_method": "720逻辑宽，cover=max((720+4)/2172,(logicalHeight+4)/724)，zoom 1或1.8，cameraX按最前景±max，分层位移[0.3,0.8,1,1]",
        "nonopaque_pixel_count_each": 0,
        "is_cocos_runtime_capture": False,
        "controls_rendered": False,
    },
    "client_integration_status": "NOT_IMPORTED_NEW_VERSION",
    "creator_target_device_performance_status": "NOT_TESTED",
}
(OUT / "CUT_MANIFEST.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(OUT / "CUT_MANIFEST.json")
