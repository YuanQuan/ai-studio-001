"""Set the original-reference PSD layer invisible after image2psd assemble.

The skill writer creates three visible raster layers. Its manifest `visible: false`
omits a layer entirely, so this small post-process sets the standard PSD
invisibility flag on the bottom reference layer without touching pixel data.
"""

from pathlib import Path
import json
import struct
import subprocess
import sys


PSD = Path(__file__).with_name("corner_cloud_layers.psd")
TOOL = Path("/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py")


def u32(data: bytearray, pos: int) -> int:
    return struct.unpack_from(">I", data, pos)[0]


def composite_offset(data: bytes) -> int:
    pos = 26
    for _ in range(3):  # color mode, image resources, layer/mask section
        pos += 4 + struct.unpack_from(">I", data, pos)[0]
    return pos


def main() -> None:
    # Create the merged image of exactly the two visible corner layers. The
    # full reference remains preserved as an independently toggleable PSD layer.
    manifest = json.loads(PSD.with_name("manifest.json").read_text())
    manifest["layers"] = manifest["layers"][1:]
    temp_manifest = PSD.with_name("two_corner_manifest.tmp.json")
    temp_psd = PSD.with_name("two_corner_composite.tmp.psd")
    temp_manifest.write_text(json.dumps(manifest, indent=2) + "\n")
    preview = PSD.parents[1] / "preview/corner_cloud_layers_preview.png"
    subprocess.run(
        [sys.executable, str(TOOL), "assemble", "--manifest", str(temp_manifest),
         "--output", str(temp_psd), "--preview", str(preview)],
        check=True, capture_output=True,
    )
    data = bytearray(PSD.read_bytes())
    assert data[:4] == b"8BPS" and data[4:6] == b"\x00\x01"
    pos = 26
    for _ in range(2):  # color-mode and image-resource sections
        size = u32(data, pos)
        pos += 4 + size
    layer_mask_size = u32(data, pos)
    assert layer_mask_size > 0
    pos += 4
    layer_info_size = u32(data, pos)
    assert layer_info_size > 0
    pos += 4
    count = struct.unpack_from(">h", data, pos)[0]
    assert count == 3, count
    pos += 2
    flag_positions = []
    for _ in range(count):
        pos += 16  # bounds
        channel_count = struct.unpack_from(">H", data, pos)[0]
        pos += 2 + channel_count * 6
        assert data[pos : pos + 4] == b"8BIM"
        pos += 8  # signature and blend mode
        flag_positions.append(pos + 2)  # opacity, clipping, flags, filler
        pos += 4
        extra_size = u32(data, pos)
        pos += 4 + extra_size
    # PSD records are top to bottom: top-right, bottom-left, full reference.
    assert [data[p] for p in flag_positions] in ([0, 0, 0], [0, 0, 2])
    data[flag_positions[-1]] = 2
    data[composite_offset(data) :] = temp_psd.read_bytes()[composite_offset(temp_psd.read_bytes()) :]
    PSD.write_bytes(data)
    temp_manifest.unlink()
    temp_psd.unlink()
    print("layer flags top-to-bottom:", [data[p] for p in flag_positions])


if __name__ == "__main__":
    main()
