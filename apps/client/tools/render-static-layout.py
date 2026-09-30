"""Render review-only camera mockups from the scene's static PNG placements.

These images are composition checks, not Cocos runtime screenshots.
"""
import json
import re
from pathlib import Path
from PIL import Image, ImageDraw

project = Path(__file__).resolve().parents[1]
assets = project / 'assets'
scene = json.loads((assets / 'DemoScene.scene').read_text(encoding='utf-8'))
tmx = (assets / 'demo/tilemaps/NightMarket.tmx').read_text(encoding='utf-8')
output = project.parents[1] / 'deliverables/client/CLIENT-CALIBRATION-DEMO-001/v0.3/screens'
output.mkdir(parents=True, exist_ok=True)

frames = {}
for meta_path in (assets / 'demo').rglob('*.png.meta'):
    meta = json.loads(meta_path.read_text(encoding='utf-8'))
    frame = meta.get('subMetas', {}).get('f9941', {}).get('uuid')
    if frame:
        frames[frame] = meta_path.with_suffix('')
prefabs = {}
for meta_path in (assets / 'demo/prefabs').glob('*.prefab.meta'):
    meta = json.loads(meta_path.read_text(encoding='utf-8'))
    prefabs[meta['uuid']] = json.loads(meta_path.with_suffix('').read_text(encoding='utf-8'))

width, height = 17 * 256, 17 * 128
cx, cy = width // 2, height // 2
canvas = Image.new('RGBA', (width, height), (0, 0, 0, 0))
tiles = ['tile_ground', 'tile_stone_road', 'tile_shore', 'tile_water']
tile_images = [Image.open(assets / 'demo/scenes' / f'{name}.png').convert('RGBA') for name in tiles]
data = re.search(r'<data encoding="csv">(.*?)</data>', tmx, re.S).group(1)
cells = [int(value) for value in data.replace('\n', '').split(',') if value.strip()]
for row in range(17):
    for col in range(17):
        tile = tile_images[cells[row * 17 + col] - 1]
        x = (col - row) * 128
        y = (16 - row - col) * 64
        canvas.alpha_composite(tile, (int(cx + x - 128), int(cy - y - 64)))

def world_transform(index):
    n = scene[index]
    if n.get('_name') == 'ScreenCanvas' or n.get('_parent') is None:
        return (0, 0, 1)
    px, py, ps = world_transform(n['_parent']['__id__'])
    return (px + n['_lpos']['x'] * ps, py + n['_lpos']['y'] * ps,
            ps * n['_lscale']['x'])

def draw_sprite(objects, n, x, y, scale):
    for component in n.get('_components', []):
        sprite = objects[component['__id__']]
        if sprite.get('__type__') != 'cc.Sprite':
            continue
        frame = sprite.get('_spriteFrame', {}).get('__uuid__')
        image_path = frames.get(frame)
        if image_path is None:
            continue
        image = Image.open(image_path).convert('RGBA')
        image = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
        transform = next((objects[c['__id__']] for c in n['_components']
                          if objects[c['__id__']].get('__type__') == 'cc.UITransform'), None)
        ax = transform['_anchorPoint']['x'] if transform else .5
        ay = transform['_anchorPoint']['y'] if transform else .5
        left = round(cx + x - ax * image.width)
        top = round(cy - y - (1 - ay) * image.height)
        canvas.alpha_composite(image, (left, top))

def draw_prefab_node(objects, index, px, py, ps):
    n = objects[index]
    if n.get('__type__') != 'cc.Node' or not n.get('_active', True):
        return
    x = px + n['_lpos']['x'] * ps
    y = py + n['_lpos']['y'] * ps
    scale = ps * n['_lscale']['x']
    draw_sprite(objects, n, x, y, scale)
    for child in n.get('_children', []):
        draw_prefab_node(objects, child['__id__'], x, y, scale)

def draw_node(index):
    n = scene[index]
    if n.get('__type__') != 'cc.Node' or not n.get('_active', True):
        return
    info_ref = n.get('_prefab')
    info = scene[info_ref['__id__']] if info_ref else None
    if info and info.get('asset', {}).get('__uuid__') in prefabs:
        objects = prefabs[info['asset']['__uuid__']]
        instance = scene[info['instance']['__id__']]
        override = next(scene[ref['__id__']] for ref in instance['propertyOverrides']
                        if scene[ref['__id__']].get('propertyPath') == ['position'])
        px, py, ps = world_transform(n['_parent']['__id__'])
        draw_prefab_node(objects, 1, px + override['value']['x'] * ps,
                         py + override['value']['y'] * ps, ps)
        return
    x, y, scale = world_transform(index)
    draw_sprite(scene, n, x, y, scale)
    for child in n.get('_children', []):
        draw_node(child['__id__'])

world_index = next(i for i, item in enumerate(scene) if item.get('_name') == 'WorldRoot')
for child in scene[world_index]['_children']:
    if scene[child['__id__']].get('_name') != 'GroundTileMap':
        draw_node(child['__id__'])

def camera_view(name, camera_height, camera_x=0, camera_y=0):
    camera_width = round(camera_height * 720 / 1280)
    left = round(cx + camera_x - camera_width / 2)
    top = round(cy - camera_y - camera_height / 2)
    crop = canvas.crop((left, top, left + camera_width, top + camera_height))
    background = Image.new('RGBA', crop.size, (11, 19, 39, 255))
    background.alpha_composite(crop)
    background.convert('RGB').resize((720, 1280), Image.Resampling.LANCZOS).save(output / f'{name}.png')

camera_view('initial-1280', 1280)
camera_view('far-1600', 1600)
camera_view('near-900', 900)
annotated = canvas.copy()
pen = ImageDraw.Draw(annotated)
path_names = ['BeforeEntry', 'Entry', 'MarketTurnA', 'MarketCenter', 'TargetFront', 'MarketTurnB', 'Exit', 'BridgeTail', 'BeyondExit']
path_points = []
for name in path_names:
    index = next(i for i, item in enumerate(scene) if item.get('_name') == name)
    x, y, _ = world_transform(index)
    path_points.append((round(cx + x), round(cy - y)))
pen.line(path_points, fill=(250, 203, 73, 255), width=8, joint='curve')
for name, (x, y) in zip(path_names, path_points):
    pen.ellipse((x - 10, y - 10, x + 10, y + 10), fill=(250, 203, 73, 255))
    pen.text((x + 14, y - 12), name, fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
target_index = next(i for i, item in enumerate(scene) if item.get('_name') == 'TargetStall')
tx, ty, _ = world_transform(target_index)
hit_left, hit_right = cx + tx - 130, cx + tx + 130
hit_top, hit_bottom = cy - (ty + 155), cy - (ty - 5)
pen.rectangle((hit_left, hit_top, hit_right, hit_bottom), outline=(255, 91, 91, 255), width=7)
annotated.thumbnail((1200, 600), Image.Resampling.LANCZOS)
annotated.save(output / 'path-and-hit-area.png')
canvas.thumbnail((1200, 600), Image.Resampling.LANCZOS)
canvas.save(output / 'map-overview.png')
print(output)
