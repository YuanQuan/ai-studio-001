# U01 v0.3 图像生成记录

## S03 下中原生分区样张

- 首图前同版预签：Art `ART_PREFLIGHT.json` 与 Tech `TECH_PREFLIGHT.json` 均 `APPROVED`，绑定 `PREFLIGHT_PLAN.md` SHA-256 `f0294b3baff0be1ce78deda97e61e76ac0f0b1a32637579179557055f84d9d05`。
- 工具：内置 `image_gen` 编辑参考，`transparent_background=false`；未用 CLI/API/自写图像编辑脚本。
- 输入角色：已批旧四层 `deliverables/art/moonlit_psd_20261005_v2_raw/overall_from_psd.png`，仅提供视觉身份和风格；调用前已实看，不是直接放大旧像素。
- 分区目标：全画布下中 x=834–3006、y=300–1024，目标原生 2172×724、放置时 1:1。
- 工具原始输出：`/Users/yuanquan/.codex/generated_images/01a11aa8-0923-7162-8297-9cfe19f56268/exec-221f75d5-0979-42bf-8f94-96cbcd60beb4.png`；逐字节复制到 `source/sample_lower_center_s03.png`，未覆盖原始输出。
- 实测：PNG 2172×724、RGB、不透明；SHA-256 `ad4a29a91264ee8db2763ee45bec78b32387ac38fba12d4023e17ae150dce84d`。本方法预设的分区几何达成；**完整3840×1024全景仍不存在**。
- 原始提示词：

```text
Use case: production sample, one local image window for a larger 3840×1024 five-layer mobile game panorama.

The attached approved old composite is only a visual identity and style reference. Paint ONE LOWER-CENTER WINDOW of the NEW panorama, not a miniature overview of the entire old image. This window will occupy global x=834–3006, y=300–1024 on a 3840×1024 final canvas. Seek a native output of 2172×724 pixels so it can be placed 1:1 without scaling. Its left and right edges are continuation edges for later newly painted street/bank/tree windows; do not frame them as finished ends.

Composition inside this lower-center window: keep the full central Chinese stone arch bridge and its lantern posts safely within the middle of the window, with the same believable bridge arch, railings, stone material, and path perspective leading onto and across the bridge. A visibly BROADER foreground cobbled street should occupy more of the lower scene and spread horizontally toward both side continuation edges; show real paving seams and stone detail. The river must remain present with a few small warm glowing lamp boats, but take LESS visible area than in the reference. The bridge and the road's approach to it must retain depth; do not flatten or stretch either. The upper part of this window may show willow foliage and misty mountains from the same world, leaving the taller sky and warm round moon mainly for the upper panorama windows. Keep the right-side gateway's overall identity for the full panorama, but do not pull the whole gateway into this central crop.

Art direction: calm friendly Chinese fantasy moonlit street, smooth non-pixel painterly game illustration, deep midnight blue atmosphere with restrained warm amber lantern light. Give the near bridge stones, cobbles, railing, willow leaves and water edge newly painted detail readable at a normal phone full-screen scale. Preserve spatial continuity for future neighboring windows: road, railing, riverbank, mountains and light direction must be able to continue beyond both side edges. Do not copy or enlarge old pixels.

Do not include characters, text, signs, banners, the unapproved Fengdu lettering, new bridge plaque, spirit banners, logos or watermark. Output one complete opaque local scene window, not separated layers or a collage. Do not introduce a second bridge or move the bridge to an edge.
```

## S04 下左窗口及两块接缝试验

- 工具：内置 `image_gen` 编辑参考，`transparent_background=false`；仅本次一张，没有重复同指令重试。
- 输入：指定 `bggg-creator-image2psd` 将S03原图左1338像素按原生1:1放于2172×724参考画布 x=834–2172，左834像素保留透明，文件为 `source_build/s04_reference/input_rgba.png`（SHA-256 `a8daa6bc902da56789ebe90e504b5d344f7cb271d5cc9a14c02d50af475bbf4d`）。调用前已实看；此单层参考不是正式PSD/切片。
- 原始输出：`/Users/yuanquan/.codex/generated_images/01a11aa8-0923-7162-8297-9cfe19f56268/exec-68bb948e-2934-4889-81a1-e3f14013cbee.png`；逐字节复制到 `source/sample_lower_left_s04.png`。实测2172×724 RGB，SHA-256 `f1e9fe1204eb79a37c0f7eb288e4554b008905509d05a252ffafa9064be3f48d`。
- 两块临时试拼：`source_build/s03_s04_seam/manifest.json` 将S04置于(0,300)，S03置于(834,300)，均 `fit:none`，后者在上；`trial.preview.png` 为3840×1024，SHA-256 `ba9f241adeb4a7f6cc784baca91cb6fff5944f89210ee1ef5f268ef098ca6164`；`trial.psd` 仅有两张区域试验层，SHA-256 `235f16315c77c9593154912a8a34f8eecc72b4ac3011803d08392b1168a37cee`，不是正式五层母版，空白区域未生产。
- 视觉结果：x=834出现明确硬接缝与重复近景草/柳树，远山、岸线、栏杆和石路不连续，按预案 `REVISE` 并停全景扩批。详见 `S04_SEAM_VISUAL_CHECK.md`。
- 原始提示词：

```text
Use case: precise outpaint for one LOWER-LEFT window of a five-panel mobile game panorama. The attached 2172×724 RGBA image is an EDIT TARGET. Its left 834 pixels are transparent. Its right 1338 pixels contain the LEFTMOST 1338 pixels of the approved new S03 lower-center sample. The complete output must remain a single opaque 2172×724 local window and will be placed at global x=0–2172, y=300–1024 on a 3840×1024 panorama. The lower-center S03 will later overlay this image starting at global x=834, so the visible stitch is at global x=834 = this image's pixel x=834 = S03's pixel x=0.

Primary task: PAINT ONLY THE MISSING LEFT 834 PIXELS with genuine new illustration detail, extending the exact visible stone street, riverbank, chain railing, willow forest, blue mountains, and night lighting from the existing right region. Keep the right 1338 pixels visually unchanged as much as possible so the transition at x=834 is continuous in geometry, texture, lighting and color. The street must remain broad and readable, run horizontally out to the left edge with perspective consistent with the existing foreground cobbles. Continue the railing posts and chain at their existing spacing and height. Continue the narrow river strip and bank, not a larger foreground river. Continue willow trunks/foliage and misty mountains with matching detail. The central stone bridge is off to the RIGHT outside the visible left extension; do not paint a second bridge. Do not treat this as a standalone complete scene or recenter the bridge.

Style: smooth non-pixel Chinese fantasy mobile-game illustration, calm friendly blue night, tiny amber lantern highlights. Native one-to-one fresh details in the new left region, no mirrored/repeated/stretched strip, no blur. Do not introduce characters, labels, plaques, spirit banners, text, logos, watermarks, or new focal objects. Do not turn the transparent area black. Produce an opaque completed local window.
```
