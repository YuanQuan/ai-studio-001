"""获批十件资产的确定性 PSD→裁片生产与像素核验。仅在双预签后执行。"""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, __version__ as pillow_version


ROOT = Path(__file__).resolve().parents[4]
BASE = Path(__file__).resolve().parent
INPUT = ROOT / "deliverables/master/MINIGAME-ART-OPT-PILOT-20261017/v0.1/INPUT_CHECK.json"
TECH = ROOT / "deliverables/tech_lead/MINIGAME-ART-OPT-PILOT-20261017-TECH/v0.1/TECH_PRESIGN.json"
SKILL = Path("/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")
PLAN_SHA = "e2a2c7a74830c9929d7989964dc302537d198bafe5f5f96af4e7fde088312294"
POSITIONS = [
    (0, 0), (1024, 0),
    (0, 1024), (512, 1024), (1024, 1024), (1536, 1024),
    (0, 1536), (512, 1536), (1024, 1536),
    (2048, 1024),
]


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def assert_gate() -> None:
    assert sha(BASE / "PREPRODUCTION_PLAN.md") == PLAN_SHA, "预案 SHA 已变化"
    art = json.loads((BASE / "ART_PRESIGN.json").read_text())
    tech = json.loads(TECH.read_text())
    assert art["decision"] == tech["decision"] == "APPROVED", "双预签未批准"
    assert all(PLAN_SHA in " ".join(f["message"] for f in x["findings"]) for x in (art, tech)), "预签 SHA 不一致"
    gate1 = json.loads((ROOT / "tasks/MINIGAME-ART-OPT-20261016-ART/ARTIFACT_APPROVAL.json").read_text())
    assert gate1["status"] == "USER_APPROVED", "方案 Gate1 未批准"
    assert len(json.loads(INPUT.read_text())["samples"]) == 10


def rgba(path: Path) -> Image.Image:
    im = Image.open(path)
    assert im.mode == "RGBA" and not any(k in im.info for k in ("icc_profile", "gamma", "srgb")), str(path)
    return im.copy()


def normalize_visible(arr: np.ndarray) -> np.ndarray:
    arr = arr.copy()
    arr[arr[:, :, 3] == 0, :3] = 0
    return arr


def compare(a: Image.Image, b: Image.Image) -> dict:
    assert a.size == b.size
    aa = np.asarray(a, dtype=np.uint8)
    bb = np.asarray(b, dtype=np.uint8)
    d_alpha = np.abs(aa[:, :, 3].astype(np.int16) - bb[:, :, 3].astype(np.int16))
    vis = (aa[:, :, 3] > 0) | (bb[:, :, 3] > 0)
    d_rgb = np.abs(aa[:, :, :3].astype(np.int16) - bb[:, :, :3].astype(np.int16))
    va, vb = normalize_visible(aa), normalize_visible(bb)
    changed = np.any(va != vb, axis=2)
    return {
        "max_alpha_delta": int(d_alpha.max(initial=0)),
        "max_visible_rgb_delta": int(d_rgb[vis].max(initial=0)),
        "changed_visible_pixel_count": int(np.count_nonzero(changed)),
        "original_alpha_zero_nonzero_rgb_pixels": int(np.count_nonzero(np.any(aa[:, :, :3] != 0, axis=2) & (aa[:, :, 3] == 0))),
        "new_alpha_zero_nonzero_rgb_pixels": int(np.count_nonzero(np.any(bb[:, :, :3] != 0, axis=2) & (bb[:, :, 3] == 0))),
    }


def on_bg(im: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    a = np.asarray(im, dtype=np.uint16)
    bg = np.array(rgb, dtype=np.uint16).reshape(1, 1, 3)
    alpha = a[:, :, 3:4]
    out = (a[:, :, :3] * alpha + bg * (255 - alpha) + 127) // 255
    return Image.fromarray(out.astype(np.uint8), "RGB")


def extract_layer(psd: Path, frame: int, width: int, height: int) -> Image.Image:
    raw = subprocess.check_output(["magick", f"{psd}[{frame}]", "-alpha", "on", "-depth", "8", "RGBA:-"])
    assert len(raw) == width * height * 4, f"PSD层读取长度异常: {frame}"
    return Image.frombytes("RGBA", (width, height), raw)


def main() -> None:
    assert_gate()
    started_wall = time.monotonic()
    started_at = datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    specs = json.loads(INPUT.read_text())["samples"]
    source_dir = BASE / "source/originals"
    export_dir = BASE / "exports"
    recon_dir = BASE / "review/recompositions"
    bg_dir = BASE / "review/background_comparisons"
    for p in (source_dir, export_dir, recon_dir, bg_dir):
        p.mkdir(parents=True, exist_ok=True)

    manifest = {"canvas": {"width": 3072, "height": 2048, "composite_background": "#808080"}, "layers": []}
    prep = []
    for spec, (x, y) in zip(specs, POSITIONS):
        src = ROOT / spec["client_path"]
        assert sha(src) == spec["sha256"], f"源 SHA 漂移: {src}"
        local = source_dir / f"{spec['inventory_key']}.png"
        shutil.copyfile(src, local)
        assert sha(local) == spec["sha256"]
        im = rgba(local)
        assert list(im.size) == spec["original_size"]
        alpha_bbox = im.getchannel("A").getbbox()
        assert list(alpha_bbox) == spec["alpha_bbox"]
        l, t, r, b = spec["crop_rect"]
        assert [max(0, alpha_bbox[0]-2), max(0, alpha_bbox[1]-2), min(im.width, alpha_bbox[2]+2), min(im.height, alpha_bbox[3]+2)] == [l,t,r,b]
        assert [r-l,b-t] == spec["crop_size"]
        assert [(l+r-im.width)/2,(im.height-t-b)/2] == spec["offset"]
        manifest["layers"].append({"name": spec["stable_asset_id"], "file": str(local.relative_to(BASE / "source")), "x": x, "y": y, "fit": "none", "remove_background": "none"})
        prep.append((spec, im, x, y))

    # manifest 位于 source/；只调用 skill 自带 assemble，禁止生成或改变原图。
    manifest_path = BASE / "source/psd_manifest.json"
    save_json(manifest_path, manifest)
    psd = BASE / "source/optimization_pilot_master.psd"
    preview = BASE / "review/psd_library_preview.png"
    cmd = [sys.executable, str(SKILL), "assemble", "--manifest", str(manifest_path), "--output", str(psd), "--preview", str(preview), "--save-layers", str(BASE / "source/psd_full_canvas_layers")]
    assembled = subprocess.run(cmd, check=True, capture_output=True, text=True)
    skill_summary = json.loads(assembled.stdout)
    assert skill_summary["layer_count"] == 10
    assert [x["name"] for x in skill_summary["layers"]] == [s["stable_asset_id"] for s in specs]
    assert (skill_summary["width"], skill_summary["height"]) == (3072, 2048)
    assembled_seconds = time.monotonic() - started_wall
    assert assembled_seconds <= 60 * 60, "制作超时"

    comparisons = []
    entries = []
    emitted = []
    for i, (spec, original, x, y) in enumerate(prep):
        summary = skill_summary["layers"][i]
        frame = len(specs) - i  # PSD首帧为合成，随后按顶→底真实层
        layer = extract_layer(psd, frame, summary["width"], summary["height"])
        original_canvas = Image.new("RGBA", original.size, (0,0,0,0))
        dx, dy = summary["left"]-x, summary["top"]-y
        assert dx >= 0 and dy >= 0 and dx + layer.width <= original.width and dy + layer.height <= original.height
        original_canvas.paste(layer, (dx,dy))
        psd_cmp = compare(original, original_canvas)
        assert psd_cmp["max_alpha_delta"] == psd_cmp["max_visible_rgb_delta"] == psd_cmp["changed_visible_pixel_count"] == 0, f"PSD真实层不等于源: {spec['stable_asset_id']}"
        l,t,r,b = spec["crop_rect"]
        cut = original_canvas.crop((l,t,r,b))
        output = export_dir / f"{spec['inventory_key']}.png"
        cut.save(output)
        restored = Image.new("RGBA", original.size, (0,0,0,0))
        restored.paste(cut, (l,t))
        recon = recon_dir / f"{spec['inventory_key']}.png"
        restored.save(recon)
        cmp = compare(original, restored)
        assert cmp["max_alpha_delta"] == cmp["max_visible_rgb_delta"] == cmp["changed_visible_pixel_count"] == 0, f"裁片不能还原: {spec['stable_asset_id']}"
        assert cut.getchannel("A").getbbox() == (2,2,cut.width-2,cut.height-2), f"2px边界异常: {spec['stable_asset_id']}"

        bg_metrics = {}
        panel = Image.new("RGB", (original.width*2, original.height*3))
        for j,(name,color) in enumerate((("黑",(0,0,0)),("灰",(128,128,128)),("白",(255,255,255)))):
            a,b = on_bg(original,color),on_bg(restored,color)
            d=np.abs(np.asarray(a,dtype=np.int16)-np.asarray(b,dtype=np.int16))
            bg_metrics[name]={"max_rgb_delta":int(d.max(initial=0)),"changed_pixel_count":int(np.count_nonzero(np.any(d!=0,axis=2)))}
            assert bg_metrics[name]["max_rgb_delta"] == bg_metrics[name]["changed_pixel_count"] == 0
            panel.paste(a,(0,j*original.height));panel.paste(b,(original.width,j*original.height))
        bg_file=bg_dir/f"{spec['inventory_key']}_原图_vs_重组.png"
        panel.save(bg_file)
        emitted.extend([str(output.relative_to(ROOT)),str(recon.relative_to(ROOT)),str(bg_file.relative_to(ROOT))])
        comparisons.append({"stable_asset_id":spec["stable_asset_id"],"inventory_key":spec["inventory_key"],"source_sha256":spec["sha256"],"psd_layer_frame":frame,"psd_layer_bbox_on_library":[summary["left"],summary["top"],summary["left"]+summary["width"],summary["top"]+summary["height"]],"library_position":[x,y],"psd_to_source":psd_cmp,"crop_to_source":cmp,"backgrounds":bg_metrics,"export_sha256":sha(output),"recomposition_sha256":sha(recon)})
        entries.append({"stable_asset_id":spec["stable_asset_id"],"inventory_key":spec["inventory_key"],"source_path":str((source_dir/f"{spec['inventory_key']}.png").relative_to(ROOT)),"source_sha256":spec["sha256"],"original_size":spec["original_size"],"alpha_bbox":spec["alpha_bbox"],"crop_rect":spec["crop_rect"],"crop_size":spec["crop_size"],"offset":spec["offset"],"pivot":spec["pivot"],"psd_layer_name":spec["stable_asset_id"],"psd_layer_frame":frame,"library_position":[x,y],"output_path":str(output.relative_to(ROOT)),"output_sha256":sha(output),"recomposition_path":str(recon.relative_to(ROOT)),"recomposition_sha256":sha(recon),"planned_client_path":spec["planned_client_path"],"new_import_status":"PLANNED_NOT_IMPORTED","new_uuid":"NOT_TESTED_MAY_REUSE_CURRENT_UUID"})
    verified_seconds = time.monotonic() - started_wall - assembled_seconds
    assert verified_seconds <= 30 * 60 and time.monotonic()-started_wall <= 90*60, "静态核验预算超限"

    save_json(BASE/"CUT_MANIFEST.json",{"version":"v0.1","preproduction_plan_sha256":PLAN_SHA,"source_input_check":str(INPUT.relative_to(ROOT)),"psd_path":str(psd.relative_to(ROOT)),"psd_sha256":sha(psd),"assets":entries})
    save_json(BASE/"review/COMPARISON_REPORT.json",{"version":"cmp-v1","tool":"Pillow","pillow_version":pillow_version,"imagemagick":" ".join(subprocess.check_output(["magick","-version"],text=True).splitlines()[0].split()[:4]),"config":{"rgba":"RGBA8","alpha_bbox":"alpha>0","transparent_rgb":"alpha=0归零后比较；原始非零值另计","backgrounds":["#000000","#808080","#FFFFFF"],"composite_rounding":"round-half-up (numerator+127)//255","resize":False,"icc_conversion":False},"psd_sha256":sha(psd),"items":comparisons,"result":"PASS"})
    ended_at=datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds")
    save_json(BASE/"PRODUCTION_LEDGER.json",{"batch":"10件无损代表","started_at":started_at,"ended_at":ended_at,"production_seconds":round(assembled_seconds,3),"verification_seconds":round(verified_seconds,3),"elapsed_seconds":round(time.monotonic()-started_wall,3),"production_budget_seconds":3600,"verification_budget_seconds":1800,"total_budget_seconds":5400,"generation_calls":0,"initial_attempts_per_item":1,"correction_rounds":0,"failures":[],"inputs":{"preproduction_plan_sha256":PLAN_SHA,"input_check_sha256":sha(INPUT),"art_presign_sha256":sha(BASE/"ART_PRESIGN.json"),"tech_presign_sha256":sha(TECH)},"outputs":{"psd":str(psd.relative_to(ROOT)),"psd_sha256":sha(psd),"exports":[{"path":e["output_path"],"sha256":e["output_sha256"]} for e in entries]},"result":"PASS"})
    print(json.dumps({"result":"PASS","psd":str(psd.relative_to(ROOT)),"psd_sha256":sha(psd),"count":len(entries),"production_seconds":round(assembled_seconds,3),"verification_seconds":round(verified_seconds,3)},ensure_ascii=False))


if __name__ == "__main__":
    main()
