"""本批已签预案的确定性图片编码与全RGBA诊断；只写当前样本目录。"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image


REPO = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
PLAN_PATH = REPO / "deliverables/art/MINIGAME-ART-OPT-NEXT-20261017-ART-PRESIGN/v0.1/BATCH_PLAN.json"
ART_SIGN = REPO / "deliverables/art/MINIGAME-ART-OPT-NEXT-20261017-ART-PRESIGN/v0.1/ART_PRESIGN.json"
TECH_SIGN = REPO / "deliverables/tech_lead/MINIGAME-ART-OPT-NEXT-20261017-TECH/v0.1/TECH_PRESIGN.json"
AUTH = REPO / "deliverables/master/MINIGAME-ART-OPT-NEXT-20261017/v0.1/FIRST_SAMPLE_AUTHORIZATION.json"
REMAINING_AUTH = REPO / "deliverables/master/MINIGAME-ART-OPT-NEXT-20261017/v0.1/REMAINING_SAMPLE_AUTHORIZATION.json"
SIGNED_SHA = "a6bc70139a292edfa241235a3cf28666fc2174e3d7e7a08e8e475f83b9c1ef23"
FIRST = ("tex_sakura_rr_sky_r", "tex_u03_shop_05_sign", "UG_GHOST_01_HAPPY_00")
REMAINING = ("tex_u04_at_s3_base", "tex_u03_shop_05_body", "U05_ART_FONT")


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def chunks(path: Path) -> list[str]:
    data = path.read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    at = 8
    found = []
    while at < len(data):
        length = int.from_bytes(data[at : at + 4], "big")
        kind = data[at + 4 : at + 8].decode("ascii")
        found.append(kind)
        at += 12 + length
    assert at == len(data)
    return found


def rgba(path: Path) -> Image.Image:
    with Image.open(path) as image:
        assert image.mode == "RGBA", (path, image.mode)
        return image.copy()


def pam_rgba(path: Path) -> tuple[tuple[int, int], bytes]:
    data = path.read_bytes()
    marker = b"ENDHDR\n"
    end = data.index(marker) + len(marker)
    header = data[:end].decode("ascii")
    fields = {}
    for line in header.splitlines()[1:]:
        bits = line.split(maxsplit=1)
        if len(bits) == 2:
            fields[bits[0]] = bits[1]
    assert fields["DEPTH"] == "4" and fields["MAXVAL"] == "255" and fields["TUPLTYPE"] == "RGB_ALPHA"
    size = (int(fields["WIDTH"]), int(fields["HEIGHT"]))
    pixels = data[end:]
    assert len(pixels) == size[0] * size[1] * 4
    return size, pixels


def metrics(source: Image.Image, candidate: Image.Image) -> dict:
    assert candidate.mode == "RGBA"
    assert source.size == candidate.size
    first = np.asarray(source, dtype=np.int16)
    second = np.asarray(candidate, dtype=np.int16)
    change = np.abs(first - second)
    pixel_changed = np.any(change != 0, axis=2)
    transparent = first[:, :, 3] == 0
    return {
        "source_rgba_sha256": hashlib.sha256(source.tobytes()).hexdigest(),
        "candidate_rgba_sha256": hashlib.sha256(candidate.tobytes()).hexdigest(),
        "dimensions": list(source.size),
        "changed_pixels": int(np.count_nonzero(pixel_changed)),
        "changed_channels": int(np.count_nonzero(change)),
        "max_channel_difference": int(np.max(change)),
        "source_alpha_zero_pixels": int(np.count_nonzero(transparent)),
        "hidden_rgb_changed_pixels": int(np.count_nonzero(np.any(change[:, :, :3] != 0, axis=2) & transparent)),
        "alpha_changed_pixels": int(np.count_nonzero(change[:, :, 3])),
    }


def pictures(source: Image.Image, candidate: Image.Image, folder: Path, label: str) -> dict:
    folder.mkdir(parents=True, exist_ok=True)
    a = np.asarray(source, dtype=np.int16)
    b = np.asarray(candidate, dtype=np.int16)
    diff = np.max(np.abs(a - b), axis=2).astype(np.uint8)
    diff_path = folder / f"{label}_diff_rgba.png"
    Image.fromarray(diff, mode="L").save(diff_path, optimize=True, compress_level=9)
    gray = Image.new("RGBA", source.size, (211, 211, 211, 255))
    left = Image.alpha_composite(gray, source).convert("RGB")
    right = Image.alpha_composite(gray, candidate).convert("RGB")
    pair = Image.new("RGB", (source.width * 2, source.height))
    pair.paste(left, (0, 0))
    pair.paste(right, (source.width, 0))
    pair_path = folder / f"{label}_side_by_side_1to1.png"
    pair.save(pair_path, optimize=True, compress_level=9)
    backgrounds = Image.new("RGB", (source.width * 2, source.height * 2))
    for row, rgb in enumerate(((211, 211, 211, 255), (32, 32, 32, 255))):
        ground = Image.new("RGBA", source.size, rgb)
        backgrounds.paste(Image.alpha_composite(ground, source).convert("RGB"), (0, row * source.height))
        backgrounds.paste(Image.alpha_composite(ground, candidate).convert("RGB"), (source.width, row * source.height))
    bg_path = folder / f"{label}_light_dark_1to1.png"
    backgrounds.save(bg_path, optimize=True, compress_level=9)
    return {"difference": str(diff_path.relative_to(REPO)), "side_by_side": str(pair_path.relative_to(REPO)), "light_dark": str(bg_path.relative_to(REPO))}


def verify_authority(ids: tuple[str, ...]) -> dict:
    plan = json.loads(PLAN_PATH.read_text())
    art = json.loads(ART_SIGN.read_text())
    tech = json.loads(TECH_SIGN.read_text())
    auth = json.loads(AUTH.read_text())
    actual = sha(PLAN_PATH)
    assert actual == SIGNED_SHA == art["batch_plan_sha256"] == auth["batch_plan"]["sha256"]
    assert SIGNED_SHA in json.dumps(tech, ensure_ascii=False)
    assert auth["decision"] == "AUTHORIZE_FIRST_THREE_LOSSLESS_TECHNICAL_SAMPLES"
    assert set(auth["scope"]) == set(FIRST)
    if ids == REMAINING:
        extension = json.loads(REMAINING_AUTH.read_text())
        assert extension["decision"] == "AUTHORIZE_REMAINING_THREE_SAME_BATCH"
        assert extension["batch_plan_sha256"] == SIGNED_SHA
        assert set(extension["scope"]) == set(REMAINING)
        checkpoint = extension["technical_checkpoint"]
        assert sha(REPO / checkpoint["path"]) == checkpoint["sha256"]
    else:
        assert ids == FIRST, "仅可执行已授权的首批或余三件"
    assert "-metadata icc" in plan["pipeline"]["WebP"]
    assert "-exact" in plan["pipeline"]["WebP"]
    return plan


def run(ids: tuple[str, ...]) -> None:
    plan = verify_authority(ids)
    output_tag = "FIRST_THREE" if ids == FIRST else "REMAINING_THREE"
    source_by_id = {item["id"]: item for item in plan["assets"]}
    ledger = {"task": "MINIGAME-ART-OPT-NEXT-20261017-ART-SAMPLES", "batch_plan_sha256": SIGNED_SHA,
              "scope": list(ids), "started_at": stamp(), "finished_at": None,
              "candidate_limit": 18, "reference_limit": 6, "generated_calls": 0, "external_paid_cost": 0,
              "runtime": "NOT_TESTED", "events": []}
    verification = {"decoder": "Pillow 11.3.0 RGBA8; WebP另经dwebp 1.5.0 -pam RGBA8",
                    "icc_interpretation": "六源未标记ICC/gAMA/sRGB；不注入profile/不转换，固定按sRGB解释",
                    "items": []}
    for asset_id in ids:
        item = source_by_id[asset_id]
        source_path = REPO / item["source"]
        assert sha(source_path) == item["sha256"] and source_path.stat().st_size == item["bytes"]
        assert set(chunks(source_path)) == {"IHDR", "IDAT", "IEND"}
        source = rgba(source_path)
        assert list(source.size) == item["dimensions"] and hashlib.sha256(source.tobytes()).hexdigest() == item["decoded_rgba_sha256"]
        asset_folder = OUT / "samples" / asset_id
        asset_folder.mkdir(parents=True, exist_ok=True)
        evidence = asset_folder / "evidence"
        ref_path = asset_folder / "reference.png"
        t0 = time.monotonic()
        event = {"asset_id": asset_id, "source": item["source"], "source_sha256": item["sha256"],
                 "source_bytes": item["bytes"], "started_at": stamp(), "reference": None, "candidates": []}
        shutil.copyfile(source_path, ref_path)
        assert sha(ref_path) == item["sha256"]
        event["reference"] = {"path": str(ref_path.relative_to(REPO)), "sha256": sha(ref_path), "bytes": ref_path.stat().st_size}
        for kind in ("png_lossless", "webp_lossless"):
            start = stamp()
            timer = time.monotonic()
            if kind == "png_lossless":
                candidate_path = asset_folder / "png_lossless.png"
                source.save(candidate_path, format="PNG", optimize=True, compress_level=9)
                candidate = rgba(candidate_path)
                params = "Pillow 11.3.0 RGBA8; PNG optimize=True compress_level=9"
                second = None
                metadata = chunks(candidate_path)
                assert set(metadata) == {"IHDR", "IDAT", "IEND"}
            else:
                candidate_path = asset_folder / "webp_lossless.webp"
                cmd = ["/opt/homebrew/bin/cwebp", "-lossless", "-exact", "-q", "100", "-m", "6", "-metadata", "icc", str(source_path), "-o", str(candidate_path)]
                process = subprocess.run(cmd, capture_output=True, text=True)
                assert process.returncode == 0, process.stderr
                with Image.open(candidate_path) as webp:
                    assert webp.size == source.size
                    assert "icc_profile" not in webp.info
                    candidate = webp.convert("RGBA")
                with tempfile.TemporaryDirectory(dir=asset_folder) as temp:
                    pam_path = Path(temp) / "decoded.pam"
                    decode = subprocess.run(["/opt/homebrew/bin/dwebp", str(candidate_path), "-pam", "-o", str(pam_path)], capture_output=True, text=True)
                    assert decode.returncode == 0, decode.stderr
                    pam_size, pam_pixels = pam_rgba(pam_path)
                assert pam_size == source.size
                second = {"decoder": "dwebp 1.5.0 -pam", "candidate_rgba_sha256": hashlib.sha256(pam_pixels).hexdigest(),
                          "source_rgba_exact": pam_pixels == source.tobytes(), "pillow_rgba_exact": pam_pixels == candidate.tobytes()}
                params = "cwebp 1.5.0 -lossless -exact -q 100 -m 6 -metadata icc; dwebp 1.5.0 -pam"
                metadata = {"icc_bytes": 0, "source_png_chunks": chunks(source_path)}
            result = metrics(source, candidate)
            result["second_decoder"] = second
            picture_paths = pictures(source, candidate, evidence, kind)
            result["evidence"] = picture_paths
            result["source_alpha_bbox"] = list(source.getchannel("A").getbbox() or (0, 0, 0, 0))
            result["candidate_alpha_bbox"] = list(candidate.getchannel("A").getbbox() or (0, 0, 0, 0))
            result["metadata"] = metadata
            exact = result["changed_pixels"] == 0 and (second is None or second["source_rgba_exact"])
            cand_bytes = candidate_path.stat().st_size
            candidate_event = {"kind": kind, "path": str(candidate_path.relative_to(REPO)),
                               "sha256": sha(candidate_path), "bytes": cand_bytes,
                               "saved_bytes": item["bytes"] - cand_bytes,
                               "saved_percent": round((item["bytes"] - cand_bytes) * 100 / item["bytes"], 4),
                               "parameters": params, "started_at": start, "finished_at": stamp(),
                               "elapsed_seconds": round(time.monotonic() - timer, 3),
                               "pixel_result": "PASS" if exact else "REVISE",
                               "benefit_result": "PASS" if cand_bytes < item["bytes"] else "NO_BENEFIT"}
            event["candidates"].append(candidate_event)
            verification["items"].append({"asset_id": asset_id, "kind": kind, "result": result})
            # 每次候选结束即持久化事实；失败候选也保留，不以换工具清零。
            ledger["events"].append({**event, "finished_at": stamp(), "elapsed_seconds": round(time.monotonic() - t0, 3)})
            (OUT / f"{output_tag}_EXECUTION.json").write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n")
            (OUT / f"{output_tag}_PIXEL_VERIFICATION.json").write_text(json.dumps(verification, ensure_ascii=False, indent=2) + "\n")
        # 上述逐候选快照会重复本件事件；最终重建一件一条。
        ledger["events"] = [e for e in ledger["events"] if e["asset_id"] != asset_id]
        event["finished_at"] = stamp()
        event["elapsed_seconds"] = round(time.monotonic() - t0, 3)
        ledger["events"].append(event)
        (OUT / f"{output_tag}_EXECUTION.json").write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n")
        print(asset_id, [(c["kind"], c["bytes"], c["saved_bytes"], c["pixel_result"]) for c in event["candidates"]], flush=True)
    ledger["finished_at"] = stamp()
    (OUT / f"{output_tag}_EXECUTION.json").write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n")
    (OUT / f"{output_tag}_PIXEL_VERIFICATION.json").write_text(json.dumps(verification, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("ids", nargs="*", default=list(FIRST))
    args = parser.parse_args()
    run(tuple(args.ids))
