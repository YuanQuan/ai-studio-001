# U01 v0.5 生图与来源记录

唯一图像输入：本项目 `v0.4/source/sample_complete_s05r.png`（2172×724 RGB；SHA-256 `d90bcd922de7a043e892a30beebf0591d0e72d0ff942e98a7f97e1483c8a8511`）。S05R 是参照与定向编辑目标，空间方向通过旧版 Art/Tech/Master 检查；不是五层切片的用户批准。旧四层资源保留。无外部素材/字体，未调用 CLI/API。

## L05 中心水前草首图

- 方法：内置 `image_gen` 编辑，`transparent_background=true`；输入 S05R。
- 原始默认输出：`/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-17f512a3-d774-4b11-8e88-5fecff3c65c1.png`。
- 项目保留副本：`source/raw/l05_water_grass_center.png`，2172×724 RGBA，SHA-256 `e0208dc713d61ff515d577245c7499a70b4bdc61ba2cc248b4a0e7a9c491a5bf`。
- 实际完整提示词：

> Edit the provided landscape image as an exact-position extraction for a layered mobile game background. Output ONLY the dark foreground aquatic reeds, broad leaves, rocks and grass tufts that are IN FRONT OF the river along the bottom left and bottom right corners. Keep their original shapes, scale, orientation, lighting, and precise positions within the full 3:1 frame. Everything else—including sky, mountains, willows, street, bridge, railing, river, boats, lanterns, gateway—must be genuinely transparent, alpha 0. Do not create any new grass, repeat or mirror elements, and do not change the composition. Preserve delicate leaf edges with clean true alpha, no dark matte, no colored background. The center-bottom area should stay transparent. Use the input as the edit target, not merely style inspiration. This is layer L05 for assembly into the same scene.

## L04 中心河水与桥首图

- 方法：内置 `image_gen` 编辑，`transparent_background=true`；输入依次为 S05R 和上述 L05（第二张仅作应移出的近草指示）。
- 原始默认输出：`/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-82e1861a-d04f-409e-be31-03dbdcd27738.png`。
- 项目保留副本：`source/raw/l04_water_bridge_center.png`，2172×724 RGBA，SHA-256 `ccade5666a3d9fd6c278fb11d3249ac7e1238e08331d67dab870feeb3502f917`。
- 实际完整提示词：

> Create L04 of a layered 2D mobile game scene by editing Image 1. Image 1 is the exact target composition, 3:1 landscape. Keep ONLY the entire foreground river, all blue water and ripples, floating warm candle boats and reflections, near-bank stone retaining wall/chain railing, and central arched stone bridge with its four lamps. These elements must remain at the same original coordinates, scale, visual style and left-right connection; the bridge deck crosses the horizontal street on the far bank, and its side arch faces the foreground river. The river occupies the lower narrow band. Remove the dark foreground aquatic grass and rocks at both bottom corners that appear in Image 2; naturally paint the continuous water and riverbank behind those removed plants, without ghost silhouettes or holes. Everything above or behind the bridge/railing/water—including sky, mountains, far-bank willow trees, bushes, broad far-bank street and right gateway—must have genuine alpha transparency. Do not add or move any subject, widen the river, change the bridge perspective, or draw a road into the arch. Output full-frame transparent PNG with this single semantic layer L04 only; preserve natural soft alpha on edges.

两图用本地已安装的 `bggg-creator-image2psd` 脚本及 `source/assembly/l04_l05_center_manifest.json` 组装一张透明背景试叠图 `source/assembly/l04_l05_center_trial.png` 和临时双层 PSD。该试叠只验证分层与水草交界；缺少 L01-L03 时背景会显示为透明/查看器白底，不代表完整场景通过。L05 有实际 alpha 0–255；非零 alpha 的中位为 253/255，保留原边缘，不阈值化。

## L03 中心后岸树与街

- 内置 `image_gen`，`transparent_background=true`；输入 S05R、L04。原始默认输出 `/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-82216f1c-7b38-4b4a-bf83-8ec3cc39dde2.png`；副本 `source/raw/l03_ground_center.png`，2172×724 RGBA，SHA `0423cc463d3f4fad06fa96fb34b84df7c53b6aa51f023df688866094635275a2`。
- 实际完整提示词：

> Extract and cleanly redraw ONLY layer L03 from Image 1, the same 3:1 horizontal mobile game background and exact same composition. L03 contains the far-bank horizontal stone-paved STREET in a wide but shallow band behind the river, the willow trees and shrubs rising behind the street, and the Chinese tiled gateway with warm lanterns at the right. Keep all their positions, sizes, blue-night painting style, and detailed stone/leaf texture matching Image 1. The street runs continuously from left to right, including across the top/deck of the central bridge, but must NOT run into the bridge side arch or toward the bottom of the image. At the precise central arch opening behind the bridge, leave a narrow deep-blue water-channel/river underlay, not stone paving or shrubs, so the opening reads as water when L04 overlays it. Everything belonging to foreground L04—bridge structure, chain railing/stone posts, foreground river, candle boats, reflections—and L05 near aquatic grass must be completely transparent in this layer. Sky and far mountains/buildings also transparent so L01/L02 can show through gaps in trees. Preserve a full-frame transparent canvas and all soft foliage alpha edges. No new signs, writing, banners, figures or props. This is an aligned semantic extraction/edit of Image 1, not a new scene.

## L02 中心远山

- 内置 `image_gen`，`transparent_background=true`；输入 S05R、L03。原始默认输出 `/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-6151d715-87c9-4a38-a754-a1c8193d2173.png`；副本 `source/raw/l02_mountains_center.png`，2172×724 RGBA，SHA `fbd0e12a5a124fb4c69eb666866eef93a9cacdfd75d5b65cbd4ab2448dbbe431`。
- 实际完整提示词：

> Edit the provided Image 1 into semantic layer L02 for the exact same 3:1 side-scrolling mobile game background. Isolate and faithfully redraw ONLY the distant misty blue mountains, layered forested ridges, moonlit pagoda buildings with tiny warm orange windows, and distant waterfalls. Keep their exact rough positions, scale, blue atmosphere, distance haze and painted detail matching Image 1. The tall mountains and pagodas sit across the upper/middle half and fade into a continuous low dark-blue treeline behind the L03 willows. The night sky, moon, stars and clouds belong to L01 and must be transparent above the mountain silhouettes and between towers. All nearer willow trees, bushes, broad horizontal far-bank stone street, right foreground gateway, bridge, railing, foreground river, boats and water-front grass must be truly transparent. Behind the central bridge opening there should be distant blue water/landscape, never a stone road or solid black. Keep a full-frame genuine RGBA transparent canvas, fine natural alpha at mountain haze edges, no colored matte. Do not invent extra buildings, signage, characters or objects, and do not change the existing composition. This is one separated editable raster layer, not a new complete scene.

## L01 中心夜空

- 内置 `image_gen`，`transparent_background=false`；输入 S05R。原始默认输出 `/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-ec8bbbc2-1137-45c9-b3ce-afc444e534ed.png`；副本 `source/raw/l01_sky_center.png`，**2173×724 RGB**，SHA `f316bd819fc68fd6216ea998cb5381b7c6106ea6d57d40077f9e8ccc1b2c1556`。与其余中心层的2172×724相差1像素；bggg中心 manifest 对此层 `fit:cover`，同高裁掉多出的一列，不称为完全原像素相同。
- 实际完整提示词：

> Edit Image 1 into the complete farthest background L01 for a layered 2D mobile game scene. Output a full opaque 3:1 landscape night SKY canvas, same smooth painterly deep cobalt-to-indigo gradient, the single round warm peach moon near the upper center-right at precisely its original position and circular proportions, dark blue cloud bands, tiny scattered stars. Preserve the sky's atmosphere and illumination exactly. Remove ALL mountains, pagodas, waterfalls, foreground willow trees, shrubs, street, gateway, bridge, river, boats and grass, and naturally continue the night sky behind and below them across the entire canvas down to the bottom; this below-horizon sky is only an unseen fallback for parallax, with no new objects. No text, signs, foreground, duplicate moons or new landmarks. Keep full-frame 2172:724 proportions, clean illustration, no transparent holes; this is one L01 background layer aligned with Image 1.

五层中心用 `source/assembly/five_center_manifest.json` 等尺度叠放，源是独立语义层，产 `five_center_trial.psd`、`five_center_trial.png` 与 `five_center_layers/`。零位全图实看保留河前街后、单桥、水前草，缺新画布左右续绘；动态视差和客户端仍未测。

## 左翼首次 portrait 续绘与一次定向修订

- 首张内置 `image_gen`，`transparent_background=false`；输入五层中心合成。默认原始 `/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-2806d207-7f40-4cf5-9620-278b722d4e53.png`；副本 `source/raw/left_wing_complete_raw.png`，1024×1536 RGB，SHA `b64c4d346c450f8d7844a692909b26a49791d0cbc847c3f1d49b419bb8961a40`。`left_wing_crop_manifest.json` 等比裁至384×1024；与中心 x384 首拼 `left_join_trial.png` 出现云/山/柳/街栏/水位硬缝。
- 首张实际完整提示词：

> Create a NARROW PORTRAIT side-extension artwork for the LEFT end of Image 1, a seamless continuation of this exact blue-night Chinese riverside 2D game scene. Image 1 is the precise RIGHT-HAND neighbor and style/composition reference, not an object to place inside the new image. The RIGHT vertical edge of your new portrait panel should meet Image 1's LEFT vertical edge at the same heights and colors: deep indigo moonlit sky in upper half, misty blue far mountains and tiny distant lit pagodas at mid distance, willow trees and bushes behind a broad SHALLOW horizontal rear-bank stone street, stone post-and-chain railing and narrow blue river in front, a few tiny candle boats in the lower river, dark aquatic grass at lower-left foreground. Continue the road, river shore, railing, shrub line and blue fog horizontally off Image 1's left border with matching perspective and scale. Leave moon, bridge and large gateway outside this extension; no new focal point, no text, no figure. Put decorative dangling willow leaves from the TOP-LEFT corner to frame the scene. Keep river foreground, street on far bank behind it. This new artwork will fill a tall narrow wing; do not squeeze the original full scene into this panel. Paint detailed seamless scenery, not flat color bands or mirror repetition.

- 修订内置 `image_gen`，`transparent_background=false`；输入上张左翼与中心。默认原始 `/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-342c418d-84de-4b33-89e8-bbda9df46464.png`；副本 `source/raw/left_wing_corrected_raw.png`，1024×1536 RGB，SHA `e8b61c1c5061b2c74dec2806dea4de4e780674b87c89bcc46bd04c97690ff6d1`。街/岸纵向位置改善，局部树与纹理硬缝仍明显。该修订覆盖了 `left_join_trial.png` 现预览，首张原始输入文件仍保留。
- 修订实际完整提示词：

> Image 1 is the PORTRAIT LEFT-WING edit target. Image 2 is the exact landscape central scene that must attach to its RIGHT edge. Keep Image 1's painterly night sky, misty mountains, distant pagodas and top-left willow canopy style, but CORRECT THE LOWER HALF GEOMETRY to align precisely with Image 2's left border when both are shown at the SAME HEIGHT. In the finished portrait panel, the back shrub line / top of far-bank stone street begins at roughly 72% down the image height; the broad street runs to roughly 82%; chain-and-post railing and stone bank occupy roughly 82–87%; the foreground river begins below 87% and occupies only the bottom 13%; small foreground aquatic grass remains at bottom left. The current Image 1 puts the street, railing and river much too high and makes the river too deep; repaint those sections LOWER, with the same horizontal perspectives and right-edge colors/contours as Image 2's leftmost edge. Preserve a true street BEHIND the river, do not move it in front. At the RIGHTMOST edge of the portrait panel, keep river water continuous and unobstructed; do not put a giant rock, plant cluster or candle boat exactly at the seam. The panel remains a narrow side extension, no moon, no bridge, no gateway, no lettering. Keep vivid local stone/willow detail, natural sky/mountain continuity, portrait canvas.

## 左272原像素透明带局部续绘

- 首图前补充预案 `PREFLIGHT_AMENDMENT_LEFT_INPAINT.md` 经 Art/Tech 对同SHA预签。bggg把五层中心合成右移272原像素，在2172×724留下左侧透明带 `source/assembly/left_inpaint_input.png`。内置 `image_gen`，`transparent_background=false`，输入该图与完整中心。默认原始 `/Users/yuanquan/.codex/generated_images/01a11e6b-f14f-77a1-a30f-4cb8f139d30f/exec-087b24c8-d113-4e27-b016-bb612d457cac.png`；副本 `source/raw/left_inpaint_result_raw.png`，2172×724 RGB，SHA `f1d5c59a1bd782947ccb1d1be35ed559affae68755e502535d683e784215555e`。
- 实测 x≥272 已有99.95%像素被模型改写，原区平均RGB绝对差26.25；遵守补充预案只取生成左272px，以 bggg 裁放成384×1024，与原中心试拼。两区虽然高度更接近，x384的树/栏/水纹仍硬切。
- 实际完整提示词：

> Image 1 is the EDIT TARGET, a 2172×724 3:1 landscape PNG. Its LEFT 272-pixel vertical band (x=0 through x=271) is transparent/blank; x=272 through the right edge already contains the approved five-layer composite. Fill ONLY the transparent left 272-pixel band by painting a seamless LEFT continuation of the already visible adjacent scene. Do not redraw, move, blur, recolor, crop or shift any pixel at x>=272. At x=272 the sky cloud bands, mountain mist, willow shrubs, rear-bank stone street, stone post-and-chain railing, shallow front river, reflections and low aquatic grass must join the existing scene exactly at the same heights, perspective, colors and local texture; water stays in foreground and the broad horizontal street stays behind it. The bridge, moon, right gateway and central composition all remain unchanged and within x>=272. Paint new left-band detail with no copied/mirrored patterns, no new main subject, no letters. Image 2 shows the intact center scene for context only. Output same canvas and clean joined panorama. Critical: the 272-pixel band should be filled; original pixels to its right remain untouched.

## 91像素过渡拼接失败结论

Art/Tech又对 `PREFLIGHT_AMENDMENT_LEFT_OVERLAP.md` 同SHA预签，只使用上张生成图 x=0–335 的局部。bggg 原位裁成336×724，等比475×1024；前384px为翼段，后91px按13条7px、opacity从13/14递减至1/14渐过渡到原中心。`source/assembly/left_overlap_trial.png` 实看在 x384–475 产生柳树/灌木与栏杆重影、局部发虚，Art/Tech判失败；不可作为正式场景图或五层来源，右侧续绘停止。原始图与所有 manifest 保留，未调用API/CLI。
