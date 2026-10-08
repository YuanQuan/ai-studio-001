"""Independent file/SHA/alpha/recomposition check of the Gate2 art package."""
from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.2"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def validate_ref(item: dict) -> Path:
    path = ROOT / item["path"]
    assert path.is_file(), path
    assert sha(path) == item["sha256"], path
    return path


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def main() -> None:
    m = json.loads((ROOT / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
    old = json.loads((OLD / "CUT_MANIFEST_V02.json").read_text(encoding="utf-8"))["shops"]
    diffs = json.loads((ROOT / "DIFF_AND_RECOMPOSITION_REPORT.json").read_text(encoding="utf-8"))["shops"]
    assert m["status"] == "GATE2_USER_REVIEW_CANDIDATE"
    assert m["canvas_px"] == [1024, 1024] and m["foot_px"] == [512, 900]
    assert sorted(m["shops"]) == [f"shop_{n:02d}" for n in range(1, 7)]
    assert Image.open(validate_ref(m["same_scale_overview"])).size == (1536, 1024)
    assert Image.open(validate_ref(m["twelve_slices_checker_sheet"])).size == (512, 1536)
    checked = 0
    for key, item in m["shops"].items():
        psd, body, sign, rec = (validate_ref(item[k]) for k in ("psd", "body", "sign", "recomposition"))
        with Image.open(psd) as im:
            assert im.size == (1024, 1024)
        bi, si, ri = rgba(body), rgba(sign), rgba(rec)
        assert bi.size == si.size == ri.size == (1024, 1024)
        merged = bi.copy()
        merged.alpha_composite(si)
        assert np.array_equal(np.asarray(merged), np.asarray(ri)), key
        assert list(bi.getchannel("A").getbbox()) == item["body"]["alpha_bbox_xyxy"]
        assert list(si.getchannel("A").getbbox()) == item["sign"]["alpha_bbox_xyxy"]
        assert sha(body) == old[key]["body"]["sha256"]
        if key in ("shop_05", "shop_06"):
            assert sha(psd) == old[key]["psd"]["sha256"]
            assert sha(sign) == old[key]["sign"]["sha256"]
        assert diffs[key]["changed_outside_old_or_new_sign_pixels"] == 0
        for view in item["views"]:
            path = validate_ref(view)
            assert Image.open(path).size == tuple(view["canvas_px"])
        checked += 1
    packet = (ROOT / "USER_REVIEW_PACKET.md").read_text(encoding="utf-8")
    for link in re.findall(r"\]\(([^)]+)\)", packet):
        assert (ROOT / link).is_file(), link
    deliverable = json.loads((ROOT / "DELIVERABLE.json").read_text(encoding="utf-8"))
    review = json.loads((ROOT / "ART_REVIEW.json").read_text(encoding="utf-8"))
    assert deliverable["status"] == "READY_FOR_REVIEW" and review["decision"] == "APPROVED"
    try:
        import jsonschema
    except ImportError:
        d_required = {"task_id", "owner", "summary", "artifacts", "acceptance_results", "risks", "status"}
        d_allowed = d_required | {"assumptions"}
        r_required = {"task_id", "reviewer", "decision", "findings", "next_action"}
        assert d_required <= deliverable.keys() <= d_allowed
        assert r_required == review.keys()
        assert deliverable["owner"] == "art" and deliverable["status"] == "READY_FOR_REVIEW"
        assert review["reviewer"] == "art" and review["decision"] == "APPROVED"
        assert isinstance(deliverable["artifacts"], list) and all(isinstance(x, str) for x in deliverable["artifacts"])
        assert isinstance(deliverable["risks"], list)
        for artifact in deliverable["artifacts"]:
            assert Path(artifact).is_file(), artifact
        for item in deliverable["acceptance_results"]:
            assert set(item) == {"criterion", "result", "evidence"}
            assert item["result"] in {"PASS", "FAIL", "NOT_TESTED"}
        for item in review["findings"]:
            assert set(item) == {"severity", "message"}
            assert item["severity"] in {"INFO", "MINOR", "MAJOR", "CRITICAL"}
        schema_result = "manual_schema_shape_and_required_values_pass"
    else:
        schema_root = Path("schemas")
        jsonschema.validate(deliverable, json.loads((schema_root / "deliverable.schema.json").read_text(encoding="utf-8")))
        jsonschema.validate(review, json.loads((schema_root / "review.schema.json").read_text(encoding="utf-8")))
        schema_result = "jsonschema_pass"
    report = {"batch_id": m["batch_id"], "result": "PASS", "shops": checked, "psd_count": checked,
              "slice_png_count": checked * 2, "recomposition_count": checked, "static_view_count": checked * 2,
              "all_manifest_sha256_match": True, "all_body_sign_recompositions_pixel_equal": True,
              "all_body_bytes_inherited_v02": True, "shops_05_06_psd_and_sign_bytes_inherited_v02": True,
              "all_changed_outside_sign_pixels": 0, "all_review_packet_links_exist": True,
              "schema_validation": schema_result,
              "not_tested": ["Creator import", "Web runtime", "target devices", "resident memory", "DrawCall"]}
    (ROOT / "FINAL_PACKAGE_VALIDATION.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
