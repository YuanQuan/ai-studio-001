from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from collections import deque

ROOT = Path(__file__).resolve().parents[5]
BATCH = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'apps/client/assets/resources/sakura_v03'
CANDIDATES = BATCH / 'source/candidates'
EXPORTS = BATCH / 'exports'
MASKS = BATCH / 'source/masks'
REVIEW = BATCH / 'review'
for folder in (EXPORTS, MASKS, REVIEW):
    folder.mkdir(parents=True, exist_ok=True)

left_candidate = np.array(Image.open(CANDIDATES / 'front_l_imagegen_candidate.png').getchannel('A').resize((225, 177), Image.Resampling.LANCZOS))
right_candidate = np.array(Image.open(CANDIDATES / 'front_r_imagegen_candidate.png').getchannel('A').resize((225, 177), Image.Resampling.LANCZOS))
# One deterministic correction: the right candidate retained a blue diagonal band.
# Its alpha in this 47x42 region follows the mirrored left candidate boundary.
right_candidate[40:82, 66:113] = np.minimum(right_candidate[40:82, 66:113], left_candidate[:, ::-1][40:82, 66:113])

images = []
for side, candidate in [('l', left_candidate), ('r', right_candidate)]:
    filename = f'tex_sakura_rr_bridge_front_{side}.png'
    original = np.array(Image.open(SOURCE / filename).convert('RGBA'))
    revised = original.copy()
    old_alpha = original[:126, :, 3].astype(np.int16)
    new_alpha = candidate[:126, :].astype(np.int16)
    changed = new_alpha < old_alpha - 16
    revised[:126, :, 3][changed] = new_alpha[changed].astype(np.uint8)
    # Restore connected original warm material, especially the gold rail edge.
    # Isolated warm-colored flecks in the removed blue background stay removed.
    rgb = original[:, :, :3].astype(np.int16)
    warm = ((rgb[:, :, 0] > 120) &
            (rgb[:, :, 0] > rgb[:, :, 1] * 1.1) &
            (rgb[:, :, 0] > rgb[:, :, 2] * 1.45) &
            (original[:, :, 3] > 0))
    seen = np.zeros((177, 225), dtype=bool)
    for sy in range(126):
        for sx in range(225):
            if not warm[sy, sx] or seen[sy, sx]:
                continue
            queue = deque([(sy, sx)])
            seen[sy, sx] = True
            component = []
            touches_preserved = False
            while queue:
                y, x = queue.popleft()
                component.append((y, x))
                if revised[y, x, 3] == original[y, x, 3]:
                    touches_preserved = True
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        ny, nx = y + dy, x + dx
                        if (0 <= ny < 177 and 0 <= nx < 225 and
                                warm[ny, nx] and not seen[ny, nx]):
                            seen[ny, nx] = True
                            queue.append((ny, nx))
            if touches_preserved:
                for y, x in component:
                    revised[y, x, 3] = original[y, x, 3]
    assert np.array_equal(revised[:, :, :3], original[:, :, :3])
    assert np.all(revised[:, :, 3] <= original[:, :, 3])
    assert np.array_equal(revised[126:, :, :], original[126:, :, :])
    original_image = Image.fromarray(original, 'RGBA')
    revised_image = Image.fromarray(revised, 'RGBA')
    revised_image.save(EXPORTS / filename)
    Image.fromarray(revised[:, :, 3], 'L').save(MASKS / f'front_{side}_result_alpha.png')
    Image.fromarray(original[:, :, 3] - revised[:, :, 3], 'L').save(MASKS / f'front_{side}_removed_alpha.png')
    images.append((side, original_image, revised_image))
    print(side, 'changed_alpha_pixels', int(np.count_nonzero(original[:, :, 3] != revised[:, :, 3])))

font = ImageFont.truetype('/System/Library/Fonts/STHeiti Medium.ttc', 26)
board = Image.new('RGB', (1500, 1210), (246, 247, 250))
d = ImageDraw.Draw(board)
for row, (side, old, new) in enumerate(images):
    y = 45 + row * 580
    for col, (label, item) in enumerate([('原图 / BEFORE', old), ('去边 / AFTER', new)]):
        x = 35 + col * 730
        d.text((x, y - 32), f'{"左栏杆" if side == "l" else "右栏杆"}  {label}  225×177 / 灰底 3×', font=font, fill=(31, 36, 49))
        bg = Image.new('RGBA', (225, 177), (128, 128, 128, 255))
        bg.alpha_composite(item)
        board.paste(bg.convert('RGB').resize((675, 531), Image.Resampling.NEAREST), (x, y))
board.save(REVIEW / 'BEFORE_AFTER.png')
