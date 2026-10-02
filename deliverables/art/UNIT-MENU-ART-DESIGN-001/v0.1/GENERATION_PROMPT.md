# 实际生成记录 v0.1

内置image_gen共四次，未用CLI/API/自绘占位。每次生成前Art+Tech签认范围/候选尺寸，见ATLAS_PREFLIGHT.md；输出只概念，实际RGBA软晕与固定远景歧义已记录。

## 01 空底板初稿

生成前记录：Art核对Product边界/原创/无字；Tech已签概念级分层/单源翻转/单页候选（01R专项去林冠签认）。
输入：deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png
transparent_background=false
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-fd4f400f-2db3-4652-ae71-031cda6fd02d.png
归档：deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/candidates/empty-scene-foliage-rejected.png

完整实际prompt：

```text
Use-case: stylized-concept. Create an ORIGINAL empty night-market base environment concept, a wide horizontal 3:1 composition. Input image 1 is ONLY a smooth 2D non-pixel Chinese cartoon painting palette/material/camera reference, NOT an edit target and NOT a scene to copy, crop, trace, or reproduce. Reimagine a quiet empty riverside stone promenade at night for a future modular game. Nearly frontal side-on camera with slight ground depth, no isometric view. Deep blue sky and layered simple distant mountain silhouettes with a soft round moon, subdued navy/stone grey palette, clean readable darker contours, broad flat paint shapes, minimal texture. A broad EMPTY grey stone walkway occupies the lower-middle of the image, spacious continuous left and right service zones ready for separate future shop objects. One ORIGINAL modest grey stone arch footbridge at center has two short ramp approaches connected to the walkway, a visible open semicircular underpass with a narrow branch stream joining the foreground river; the opening must connect all the way to the front water, never blocked by pavement or a fence. Plain stone railing posts with simple chains along the river edge stop at each side of this open bridge-water mouth. Enough foreground walkway space in front of future shops for customer travel and seating objects to be added later. A shallow band of calm dark-blue river occupies about the bottom fifth; subtle quiet moon reflection, not a bright magic or fire effect. Full scene edges rendered continuously for potential camera crop/pan. IMPORTANT empty base only: absolutely NO shop, buildings, gate, person, ghost, bench, table, chair, tree, grass, flower, leaves, bamboo, lantern, candle, paper boat, torch, sign, logo, words, labels or UI, no floating lights or ghost ornaments. Stone bridge and railing have no lamps. Moonlight only soft ambient, no local lantern illumination baked into the floor. Do not add decorative rocks/plants covering bridge mouth. This is one conceptual environment image describing future separable sky, distant mountains, floor, bank, water, bridge and railing layers; not an already separated production asset or texture atlas.
```

## 01R 去可辨林冠

生成前记录：Art核对Product边界/原创/无字；Tech已签概念级分层/单源翻转/单页候选（01R专项去林冠签认）。
输入：deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/scenes/empty-scene-concept.png（当时为初稿，已留candidates）
transparent_background=false
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-97d5246b-e9be-4142-9bf0-9a20df1505b1.png
归档：deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/scenes/empty-scene-concept.png

完整实际prompt：

```text
Use-case: precise-object-edit. Input image is our original empty-scene concept and is the edit TARGET. Change ONLY the dark rounded tree/forest/bush silhouettes in the entire distant landscape below the tall mountain peaks. Remove every recognizable foliage crown, bush edge and tree-like silhouette; replace their area with smooth empty blue mist, plain eroded rock slopes and low rock ridges. No vegetation anywhere. Keep the existing sky, moon, clouds, mountain peak arrangement, overall blue colors, frontal camera, stone walkway, central stone bridge, arch opening, branch stream connecting to river, railing and open mouth, foreground river and all other geometry exactly as it is. Keep landscape canvas2172x724 with no crop. Do not add trees, grass, flowers, lamps, shops, people, furniture, particles, signs, or text. Empty fixed base only, smooth non-pixel 2D cartoon game painting. This one revision prevents background vegetation being mistaken for independently toggleable trees.
```

## 02 幽灵五态/独立板凳

生成前记录：Art核对Product边界/原创/无字；Tech已签概念级分层/单源翻转/单页候选（01R专项去林冠签认）。
输入：deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png
transparent_background=true
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-b7f1b346-d78e-40a2-88dc-d88eddf368e9.png
归档：deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/characters/ghost-customer-concept.png

完整实际prompt：

```text
Use-case: stylized-concept. Create an ORIGINAL cute ghost customer concept sheet for a smooth 2D Chinese night-market mobile game. Input image 1 is ONLY palette/camera/art rendering reference, not a character to copy or crop. Landscape 3:2 with a genuinely transparent background, no paper frame, labels, letters, UI, landscape, floor texture, baked shadows or glow. One simple original little spirit design repeated in FIVE pose studies, ALL facing RIGHT in the same near-side/front side-on game view, not a multi-direction turnaround. Body is a compact soft ivory pear-shaped cloud with a small rounded head/body continuous silhouette, two small nub hands, two soft rounded lower tail lobes, tiny dark navy eyes and a simple expressive mouth, cool soft blue intrinsic shadows with NO strong one-sided light. No hat, clothing, badge, text, earrings, fixed left/right motif, item, wings, halo or brand; do not imitate Casper, Boo, a commercial mascot or existing IP character. Generic friendly original spirit, cute and harmless. Composition: upper row has FOUR clear separated same-scale poses from left to right: gently moving right with hands relaxed and tail trailing left; running right with body leaning and hands swinging, visibly energetic; happy facing right with lifted hands and warm smile; sad facing right with shoulders/hands dropped and a mild downturned mouth. Lower row at left has the SAME RIGHT-FACING spirit in a stable seated pose on a simple short street bench, body gently compressed and bottom resting visibly on the top seat board, hands resting naturally, no floating gap or penetrating bench. At lower right show an EMPTY matching bench ALONE well separated from every ghost pose: plain weathered warm brown rectangular wooden seat board, two simple legs, no backrest, arms, carvings, words or objects. The seated reference and independent empty bench demonstrate a shared seat contact only, not a combined production sprite. The ghost should be simple enough for future skeleton layers, with readable pose differences and all original shapes naturally supporting a horizontal flip for LEFT-facing states; do NOT draw left-facing ghosts or separate opposite-direction artwork. Keep everything fully visible and spaced, broad flat shading and dark clean contours matching the reference's non-pixel hand-painted game style. Concept sheet only, NOT a sprite animation atlas or runtime resource.
```

## 03 树花灯

生成前记录：Art核对Product边界/原创/无字；Tech已签概念级分层/单源翻转/单页候选（01R专项去林冠签认）。
输入：deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png
transparent_background=true
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-3dee27a5-aa12-4a30-be95-f092c1f1c632.png
归档：deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/props/toggle-elements-concept.png

完整实际prompt：

```text
Use-case: stylized-concept. Create an ORIGINAL simple modular scenery concept sheet for a non-pixel 2D cute Chinese night-market game. Input image 1 is ONLY a palette, contour, and painting style reference, never crop/trace existing props. A genuinely transparent landscape 3:2 canvas shows exactly THREE separated, complete, independent candidates with generous empty space between them: on the left one medium small WILLOW TREE with a readable muted brown trunk, forked branches and several simple hanging muted jade/olive-green foliage clusters, full trunk base and shallow roots visible, broad calm forms suitable for later bone animation (do not make an enormous forest); at lower middle one low FLOWER-AND-GRASS CLUMP with a handful of long soft green leaves and three small friendly coral-red rounded spider-lily-inspired flower heads on thin stems, no pot or rock pedestal, clean base; on the right one separate modest warm orange-red CHINESE LANTERN with simple cylindrical body, a hanging loop and short dark-red tassel, all parts fully visible, no pole, tree support or beam. All three share smooth hand-painted 2D mobile game art, clean dark brown outlines, restrained warm highlights and cool shading, large readable shapes, little fine texture. Tree and flower are natural material colors, not glowing spirits. Lantern has a warm interior highlight but no environmental halo, floor glow or baked cast shadow; tree base/grass base no baked ground shadow. No labels, text, Chinese characters, logo, frame, grid, ground, buildings, background, bench, character, ghosts, water, extra objects, or effects. Cute gentle underworld night-market mood, not spooky or sinister, no skulls/face masks/horror. These THREE candidates will be toggled independently and moving shapes are intended for independent bone objects each with one atlas page. This is only a concept display sheet, NOT already separated production assets, texture atlas, animated sprite sheet, or Creator resources.
```
