"""Read raster layers from BGGG PSD files for U01 v0.3 validation."""
from __future__ import annotations

import io
import struct
from pathlib import Path

import numpy as np
from PIL import Image

def u(stream, fmt):
    length = struct.calcsize(">" + fmt)
    data = stream.read(length)
    if len(data) != length:
        raise ValueError("截断的 PSD")
    return struct.unpack(">" + fmt, data)

def read_raw_psd_layers(path):
    """Read raster layers written by the same BGGG PSD writer, top to bottom."""
    stream = io.BytesIO(Path(path).read_bytes())
    assert stream.read(4) == b"8BPS"
    assert u(stream, "H")[0] == 1
    stream.read(6)
    channels, h, w, depth, mode = u(stream, "HIIHH")
    assert (channels, depth, mode) == (3, 8, 3)
    for _ in range(2):
        stream.seek(u(stream, "I")[0], 1)
    mask_size = u(stream, "I")[0]
    mask_end = stream.tell() + mask_size
    info_size = u(stream, "I")[0]
    info_end = stream.tell() + info_size
    count = abs(u(stream, "h")[0])
    records = []
    for _ in range(count):
        top, left, bottom, right = u(stream, "iiii")
        nc = u(stream, "H")[0]
        channels_spec = [u(stream, "hI") for _ in range(nc)]
        assert stream.read(4) == b"8BIM"
        assert stream.read(4) == b"norm"
        opacity, clipping, flags, filler = u(stream, "BBBB")
        assert opacity == 255 and not flags & 2
        extra_size = u(stream, "I")[0]
        extra_end = stream.tell() + extra_size
        for _ in range(2):
            stream.seek(u(stream, "I")[0], 1)
        name_len = u(stream, "B")[0]
        name = stream.read(name_len).decode("macroman")
        stream.seek(-(name_len + 1) % 4, 1)
        while stream.tell() + 12 <= extra_end:
            assert stream.read(4) == b"8BIM"
            key = stream.read(4)
            n = u(stream, "I")[0]
            data = stream.read(n)
            if key == b"luni":
                letter_count = struct.unpack(">I", data[:4])[0]
                name = data[4:4 + letter_count * 2].decode("utf-16be")
            stream.seek(n % 2, 1)
        stream.seek(extra_end)
        records.append((name, (left, top, right, bottom), channels_spec))
    layers = []
    for name, (left, top, right, bottom), channel_spec in records:
        lw, lh = right - left, bottom - top
        rgba = np.zeros((lh, lw, 4), dtype=np.uint8)
        rgba[:, :, 3] = 255
        for cid, n in channel_spec:
            assert u(stream, "H")[0] == 0
            raw = stream.read(n - 2)
            assert len(raw) == lw * lh
            rgba[:, :, {-1: 3, 0: 0, 1: 1, 2: 2}[cid]] = np.frombuffer(raw, dtype=np.uint8).reshape(lh, lw)
        canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        canvas.paste(Image.fromarray(rgba, "RGBA"), (left, top))
        layers.append((name, canvas))
    assert stream.tell() <= info_end <= mask_end
    return (w, h), layers


