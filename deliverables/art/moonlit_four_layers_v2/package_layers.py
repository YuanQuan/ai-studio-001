from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

folder = Path(__file__).resolve().parent
layers = [
    ('01_sky.png', '天空、月亮、云彩、星星'),
    ('02_mountains_buildings.png', '山峦、远方建筑'),
    ('03_ground_trees_corridor.png', '地面、树木、右侧走廊'),
    ('04_bridge_railings_foreground.png', '桥、栏杆与前景'),
]
root = ET.Element('image', w='2172', h='724', name='月夜景观四层 v2')
stack = ET.SubElement(root, 'stack')
for i in reversed(range(4)):
    ET.SubElement(stack, 'layer', name=layers[i][1], src=f'data/layer{i}.png',
                  x='0', y='0', opacity='1.0', visibility='visible',
                  attrib={'composite-op': 'svg:src-over'})
with zipfile.ZipFile(folder / 'moonlit_four_layers.ora', 'w') as z:
    z.writestr('mimetype', 'image/openraster', compress_type=zipfile.ZIP_STORED)
    z.writestr('stack.xml', ET.tostring(root, encoding='utf-8'))
    for i, (filename, _) in enumerate(layers):
        z.write(folder / filename, f'data/layer{i}.png')
    z.write(folder / 'merged_preview.png', 'mergedimage.png')
with zipfile.ZipFile(folder / 'moonlit_four_layers_v2.zip', 'w', compression=zipfile.ZIP_DEFLATED) as z:
    for filename in [x[0] for x in layers] + ['moonlit_four_layers.ora', 'merged_preview.png', 'source_original.png', 'README.md', 'validation.txt']:
        z.write(folder / filename, filename)
print('Packed four PNG layers and editable ORA.')
