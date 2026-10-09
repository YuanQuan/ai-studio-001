"""Copy unchanged 花灯/投壶 PSDs and cut PNGs into the v0.3 batch."""
from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT.parent / "v0.2"
MANIFEST = json.loads((OLD / "CUT_MANIFEST_V02.json").read_text(encoding="utf-8"))["shops"]
PSD = ROOT / "psd"
EXP = ROOT / "exports/light_r3_final"
PRE = ROOT / "preview/light_r3_final"


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def main() -> None:
    for directory in (PSD, EXP, PRE):
        directory.mkdir(parents=True, exist_ok=True)
    result = {}
    for num in (5, 6):
        key = f"shop_{num:02d}"
        old = MANIFEST[key]
        destinations = {
            "psd": PSD / f"{key}_visual_fidelity_v03.psd",
            "body": EXP / f"tex_u03_{key}_body_visual_fidelity_v03.png",
            "sign": EXP / f"tex_u03_{key}_sign_visual_fidelity_v03.png",
        }
        for kind, destination in destinations.items():
            source = OLD / old[kind]["path"]
            assert sha(source) == old[kind]["sha256"], (key, kind)
            shutil.copy2(source, destination)
            assert sha(destination) == sha(source)
        body = Image.open(destinations["body"]).convert("RGBA")
        sign = Image.open(destinations["sign"]).convert("RGBA")
        rec = body.copy()
        rec.alpha_composite(sign)
        original_rec = Image.open(OLD / old["recomposition"]["path"]).convert("RGBA")
        assert np.array_equal(np.asarray(rec), np.asarray(original_rec)), key
        destination_rec = PRE / f"{key}_recomposed.png"
        rec.save(destination_rec)
        result[key] = {kind: {"path": str(path.relative_to(ROOT)), "sha256": sha(path),
                               "source_v02_sha256": old[kind]["sha256"], "inherited_exact_bytes": True}
                       for kind, path in destinations.items()}
        result[key]["recomposition"] = {"path": str(destination_rec.relative_to(ROOT)), "sha256": sha(destination_rec), "pixel_identical_to_v02": True}
        result[key]["body_alpha_bbox"] = list(body.getchannel("A").getbbox())
        result[key]["sign_alpha_bbox"] = list(sign.getchannel("A").getbbox())
    report = {"batch_id": "U03-SHOP-FAITHFUL-REDRAW-V03", "shops": result,
              "note": "05/06 原 PSD 与 body/sign 完整字节继承 v0.2；未重新渲字或重绘。"}
    (ROOT / "INHERITED_05_06_REPORT_LIGHT_R3.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
