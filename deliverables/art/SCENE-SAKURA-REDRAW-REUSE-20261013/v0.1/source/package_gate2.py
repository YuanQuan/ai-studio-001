# -*- coding: utf-8 -*-
"""Create a self-contained environment-only Gate2 handoff archive."""
import hashlib
import json
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
package_dir = root / "package"
package_dir.mkdir(exist_ok=True)
paths = [
    root / "source/scene_sakura_reuse_master.psd",
    root / "CUT_MANIFEST.json",
    root / "PSD_MANIFEST.json",
    root / "ART_VISUAL_SELF_REVIEW.md",
    root / "EDITABILITY_NOTES.md",
    root / "USER_REVIEW_PACKET.md",
    root / "review/README.md",
    root / "review/scene_environment.png",
    root / "review/reassembled_from_exports.png",
    root / "review/scene_psd_preview.png",
    root / "review/micro_motion_preview.html",
    root / "review/scene_motion_midground.png",
    root / "review/scene_sky_overscan.png",
    root / "review/scene_far_overscan.png",
    *sorted((root / "exports").glob("*.png")),
]
assert len([p for p in paths if p.parent.name == "exports"]) == 17
assert all(p.is_file() for p in paths)
assert not any("shop" in p.name.lower() for p in paths)
manifest = {
    "package": "environment-only Gate2 v0.1",
    "included": [{"path": str(p.relative_to(root)), "sha256": hashlib.sha256(p.read_bytes()).hexdigest(), "bytes": p.stat().st_size} for p in paths],
    "excluded": "reference image, shop images, superseded samples, native generation sources, game client assets",
}
manifest_path = package_dir / "PACKAGE_MANIFEST.json"
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
archive = package_dir / "SCENE_SAKURA_ENVIRONMENT_GATE2_v0.1.zip"
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for p in paths:
        z.write(p, str(p.relative_to(root)))
    z.write(manifest_path, "PACKAGE_MANIFEST.json")
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(paths) + 1
verification = {
    "archive": str(archive.relative_to(root)),
    "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
    "bytes": archive.stat().st_size,
    "entries": len(paths) + 1,
    "zip_crc_test": "PASS",
    "contains_shop_files": False,
}
(package_dir / "PACKAGE_VERIFICATION.json").write_text(json.dumps(verification, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(verification, ensure_ascii=False))
