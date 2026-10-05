"""Read saved raw-channel PSD layers independently and export their composite.

This reader verifies the subset emitted by the image2psd skill: RGB8, normal
blend, four raw channels per raster layer. It never reads the input layer PNGs
to produce the exported image.
"""
from pathlib import Path
import io
import json
import struct
import hashlib
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
PSD = ROOT / 'moonlit_four_layers.psd'


def unpack(stream, fmt):
    size = struct.calcsize('>' + fmt)
    data = stream.read(size)
    if len(data) != size:
        raise ValueError('Truncated PSD')
    return struct.unpack('>' + fmt, data)


def read_psd_layers(path):
    stream = io.BytesIO(path.read_bytes())
    assert stream.read(4) == b'8BPS'
    assert unpack(stream, 'H')[0] == 1
    stream.read(6)
    channels, h, w, depth, mode = unpack(stream, 'HIIHH')
    assert (channels, depth, mode) == (3, 8, 3)
    for _ in range(2):
        size = unpack(stream, 'I')[0]
        stream.seek(size, 1)
    layer_mask_size = unpack(stream, 'I')[0]
    layer_mask_end = stream.tell() + layer_mask_size
    layer_info_size = unpack(stream, 'I')[0]
    layer_info_end = stream.tell() + layer_info_size
    count = abs(unpack(stream, 'h')[0])
    assert count == 4
    records = []
    for _ in range(count):
        top, left, bottom, right = unpack(stream, 'iiii')
        count_channels = unpack(stream, 'H')[0]
        ch = [unpack(stream, 'hI') for _ in range(count_channels)]
        assert stream.read(4) == b'8BIM'
        assert stream.read(4) == b'norm'
        opacity, clipping, flags, filler = unpack(stream, 'BBBB')
        assert opacity == 255 and not flags & 2
        extra_size = unpack(stream, 'I')[0]
        extra_end = stream.tell() + extra_size
        for _ in range(2):
            stream.seek(unpack(stream, 'I')[0], 1)
        name_len = unpack(stream, 'B')[0]
        name = stream.read(name_len).decode('macroman')
        stream.seek(-(name_len + 1) % 4, 1)
        while stream.tell() + 12 <= extra_end:
            assert stream.read(4) == b'8BIM'
            key = stream.read(4)
            size = unpack(stream, 'I')[0]
            data = stream.read(size)
            if key == b'luni':
                letters = struct.unpack('>I', data[:4])[0]
                name = data[4:4 + letters * 2].decode('utf-16be')
            stream.seek(size % 2, 1)
        stream.seek(extra_end)
        records.append({'name': name, 'bounds': [left, top, right, bottom], 'channels': ch})
    layers = []
    for rec in records:
        left, top, right, bottom = rec['bounds']
        lw, lh = right - left, bottom - top
        rgba = np.zeros((lh, lw, 4), dtype=np.uint8)
        rgba[:, :, 3] = 255
        for channel_id, length in rec['channels']:
            assert unpack(stream, 'H')[0] == 0, 'Only raw channels supported'
            raw = stream.read(length - 2)
            assert len(raw) == lw * lh
            index = {-1: 3, 0: 0, 1: 1, 2: 2}[channel_id]
            rgba[:, :, index] = np.frombuffer(raw, dtype=np.uint8).reshape(lh, lw)
        canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        canvas.paste(Image.fromarray(rgba, 'RGBA'), (left, top))
        layers.append((rec, canvas))
    assert stream.tell() <= layer_info_end <= layer_mask_end
    return (w, h), layers


size, layers = read_psd_layers(PSD)
assert size == (2172, 724)
composite = Image.new('RGBA', size, (0, 0, 0, 255))
for _, im in reversed(layers):
    composite = Image.alpha_composite(composite, im)
export_path = ROOT / 'overall_from_psd.png'
composite.convert('RGB').save(export_path)

# Independently read the PSD's stored flattened image with Pillow.
stored = Image.open(PSD)
stored.load()
assert stored.format == 'PSD' and stored.size == size
exported = np.asarray(composite.convert('RGB')).astype(np.int16)
stored_diff = np.abs(exported - np.asarray(stored.convert('RGB')).astype(np.int16))
assembly = np.asarray(Image.open(ROOT / 'assembly_preview.png').convert('RGB')).astype(np.int16)
assert np.array_equal(exported, assembly)
assert stored_diff.max() == 0
source = np.asarray(Image.open(ROOT / 'original_reference.png').convert('RGB')).astype(np.int16)
source_diff = np.abs(exported - source)
manifest = json.loads((ROOT / 'manifest.json').read_text(encoding='utf-8'))
checks = []
for (rec, im), spec in zip(reversed(layers), manifest['layers']):
    incoming = Image.new('RGBA', size, (0, 0, 0, 0))
    incoming.paste(Image.open(ROOT / spec['file']).convert('RGBA'), (0, 0))
    saved, original = np.asarray(im), np.asarray(incoming)
    assert np.array_equal(saved[:, :, 3], original[:, :, 3])
    visible = saved[:, :, 3] > 0
    assert np.array_equal(saved[:, :, :3][visible], original[:, :, :3][visible])
    assert rec['name'] == spec['name']
    checks.append({'name': rec['name'], 'canvas': list(im.size), 'bounds': rec['bounds'],
                   'alpha_min': int(saved[:, :, 3].min()), 'alpha_max': int(saved[:, :, 3].max()),
                   'alpha_preserved': True, 'visible_rgb_preserved': True})
report = {
    'psd': str(PSD), 'psd_sha256': hashlib.sha256(PSD.read_bytes()).hexdigest(),
    'export': str(export_path), 'layer_count': len(layers), 'canvas': list(size),
    'export_method': 'Re-read saved PSD layer records and raw RGBA channels; composite its four layers',
    'layers_bottom_to_top': checks,
    'export_vs_psd_flattened_max_rgb_difference': int(stored_diff.max()),
    'export_vs_assembly_preview_identical': True,
    'export_vs_original_max_rgb_difference': int(source_diff.max()),
    'export_vs_original_mean_absolute_rgb_difference': float(source_diff.mean()),
    'photoshop_gui_open_test': 'Not performed',
}
(ROOT / 'validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))

