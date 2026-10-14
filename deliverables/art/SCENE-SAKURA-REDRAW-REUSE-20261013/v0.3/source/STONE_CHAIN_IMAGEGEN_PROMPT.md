# 第15次调用：透明石柱与链条原型

输入图 1 是用户提供的 687×77 街岸栏杆样式参考，只学习灰蓝石柱、圆顶帽石、深色链节的形态与笔触；绝不复制参考像素或连同街面裁出。输入图 2 是目前无店的 3072×1024 樱夜环境，只学习整体蓝紫夜色、柔和手绘光照与大致栏杆显示尺度；不要重绘整景。

Create ONE transparent-background 2D game-art sprite sheet with TWO SEPARATE ORIGINAL HAND-PAINTED OBJECTS, widely spaced apart for clean extraction:

LEFT: one complete short blue-grey stone bollard, rounded domed cap, square tapered shaft, weathered hand-painted stone facets, dark cool shadow, slight lavender rim light. No lantern, no warm glow, no flame, no rope. It must have a natural flat stone foot to sit on an existing low canal wall. Show one subtle chain attachment ring on each side.

RIGHT: one independent blackened iron chain span, with clearly individual oval metal links, both ends at equal height and a natural downward catenary sag in the middle. No posts attached to this component. It should read cleanly when scaled to about 370px wide and 25px tall.

Use the visual style and palette of the supplied scene and reference. Clean true alpha cutout around each component; keep the objects unconnected and non-overlapping, with ample transparent margin. The post and the chain should have front-facing side-view perspective, like a railing seen across a canal, suitable for placing four identical posts along a horizontal street edge. No ground, paving, wall, plants, water, sky, trees, bridge, shops, text, border, labels or other objects. The user reference is style-only; the output must be independently newly painted, not a crop, tracing, color shift or near-copy of any supplied image.

Expected native output is preserved exactly, then crop only its *new* transparent object pixels and instance them deterministically into the signed ROI. No extra generated variants or retries.
