# 实际生成记录 v0.5

内置image_gen，三次独立调用；每次先执行Art/Tech本轮联合预检。未使用CLI/API，不裁全景，没有后处理编辑图片。透明属性以实际检查为准。

## 01 孟桃独立全身

生成前检查：人物唯一腰牌、简单剪影、透明脚点、单页对象、版权初筛；技术签认见TECH_PREFLIGHT.json，Art见ART_PREFLIGHT.md。

输入路径（均以deliverables/art/为前缀）：
- ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png

transparent_background=true。
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-a665e529-4fa2-43cd-9477-26c5306927b0.png
项目落盘：deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/characters/mengtao-concept.png

完整实际提示词：

```text
Use-case: stylized-concept. Create an ORIGINAL independent full-body character design for a Chinese cute fantasy mobile game, Mengtao, granddaughter of Meng Po who wants her own milk tea shop. Input image 1 is ONLY a style, palette, and near-front side-view game camera reference; do not copy/crop any character or reproduce its scene. Output one full-body young adult female chibi shop manager with feet entirely visible, centered on a genuinely transparent canvas, roughly square framing, no floor or baked shadow, no labels or extra view panels. Match the reference's smooth 2D hand-painted cartoon look, clean dark brown contours, simple readable shapes, restrained shading, warm lantern highlights against cool shadows, NOT pixel art or anime poster detail. Approximately 3.5 heads tall, short tousled brown bob, big warm brown eyes, friendly confident slightly mischievous smile; cream cross-collar blouse with simple green short sleeves, muted jade-green plain working apron, orange waist sash, loose navy trousers and simple green cloth shoes. Keep accessories sparse, arms slightly away from torso to support future bone-animation splitting, one hand open and one casually bent, neutral standing legs. At the FRONT OF THE WAIST sash hang exactly ONE cream wood tag displaying exactly the single Chinese character '孟' (upper 子, lower 皿), facing the viewer and large enough to inspect. Nowhere else any text, glyphs, logo or badge. No chest logo, no shoulder emblem, no extra surname, no horns, skeletons, scary motifs, copyright character imitation, weapon or magical effects. Clothing has broad flat areas and no repetitive intricate brocade. This is a visual concept only, not an atlas or skeleton export.
```

## 02 无人店身

生成前检查：无人店身、奶茶匾/杯吸管/纸盒/机器、空价格板、帘单页、静动边界；技术签认见TECH_PREFLIGHT.json，Art见ART_PREFLIGHT.md。

输入路径（均以deliverables/art/为前缀）：
- ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png

transparent_background=true。
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-befa3ecb-5618-48cb-aee8-80d85451f47d.png
项目落盘：deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/scenes/milk-tea-shop-concept.png

完整实际提示词：

```text
Use-case: stylized-concept. Generate a NEW ORIGINAL independent milk tea shop asset concept, no people at all. Input image 1 is a STYLE AND CAMERA reference only: use its restrained smooth 2D cute Chinese night-market illustration, near-front camera, traditional wood and blue-grey tiled roof and warm amber lamps; do not crop, trace, copy its exact shop or panorama. One compact regular-width storefront centered on a truly transparent background with the whole building and stone plinth visible, target landscape 3:2 framing; no street, trees, water, exterior tables or background, no baked ground shadows. Camera is almost straight frontal, only very slight visible right timber depth, NOT isometric, NOT pixel art, NOT photorealistic. Building has a squat simple blue-grey tiled curved roof, weathered brown wooden frame and a little grey brick side base. Put a NORMAL modest horizontal rectangular cream plaque inside a wooden frame below the roof with exactly two large Chinese characters '奶茶', no other writing. One small original hanging milk-tea cup icon WITH A STRAW sits beside the opening, no oversized rooftop icon. A short cream awning hangs above a wide clear serving opening and can later be split into 3 broad cloth strips; two simple amber lanterns at the outer pillars. The rear shelf displays four unbranded cream-and-muted-green folded paper MILK CARTONS (not glass bottles), some empty paper cups. A compact stainless steel milk-tea mixer and cup-sealing machine are unmistakable on the rear worktop; leave a central manager work gap. On the right interior wall put a small rectangular EMPTY cream price-list board with four plain blank lines and blank price squares, absolutely no numbers, invented drink names or decorative text. Wooden front counter is clearly distinct from rear interior and slightly low enough to support a visible manager waist tag in relationship image. Counter front is restrained plain timber slats, no shop emblems, no surname text. Keep geometry broad/simple and few props, darker contour, large readable material planes, night-blue roof shadows/warm interior. Cute everyday fantasy mood, no horror, no skulls, no brands. Concept image only; no cutout panels, no exploded parts, no animation atlas.
```

## 03 同屏关系

生成前检查：本版主体两图保持、人物脸/手/牌遮挡、无新NPC/规则、非生产合图；技术签认见TECH_PREFLIGHT.json，Art见ART_PREFLIGHT.md。

输入路径（均以deliverables/art/为前缀）：
- ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png
- UNIT-PILOT-ART-CONCEPT-001/v0.5/characters/mengtao-concept.png
- UNIT-PILOT-ART-CONCEPT-001/v0.5/scenes/milk-tea-shop-concept.png

transparent_background=false。
原始输出：C:/Users/admin/.codex/generated_images/01a0fb62-0660-7f93-b798-29deaa1d3d8b/exec-e76d00cc-2918-44ae-8005-68e2ba8871ec.png
项目落盘：deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/scenes/mengtao-shop-relationship.png

完整实际提示词：

```text
Use-case: stylized-concept. Create one relationship concept for the Mengtao milk tea shop unit, landscape 3:2, smooth 2D Chinese cute hand-painted mobile game art, NON PIXEL. Image 1 is the selected night-market CAMERA/PALETTE style reference only; do not reproduce the whole panorama. Image 2 is the exact NEW Mengtao character design to preserve; Image 3 is the exact NEW shop design to preserve, not a suggestion to redesign. Show ONE complete compact shop from Image 3 and ONE manager from Image 2 at its central rear work position, frontal camera with only minimal depth. Maintain every key shop design: squat blue-grey tiled curved roof, cream wood-framed horizontal '奶茶' plaque, three simple short cream awning strips, one small right hanging cup-and-straw mark, two amber outer lanterns, four unbranded cream-and-green paper milk cartons on left rear shelf, mixer and sealing machine, blank four-line price board with empty squares on right wall, plain wooden front counter, grey stone base. Preserve exact manager identity: short brown bob, simple cream/green blouse, plain jade apron, orange sash, navy trousers, friendly confident cute face. Only her ONE front-waist tag says '孟', correct 子 over 皿. Show her head, shoulders, both hands and waist tag just ABOVE counter top; lower body is naturally occluded BEHIND the separate counter front. Do not put the tag on counter or chest. Put a simple unbranded small metal shaker in her hands to suggest a beverage-making work pose, no effects or magic, no product text. Use a quiet deep blue blurred night background with sparse willow silhouettes, a simple grey stone ground and just a hint of railing at the lowest edge; all background secondary, no water, no other shops, no people, no ghosts, no additional UI/buttons/text or extraneous furniture. Manager modest in scale and clearly belongs inside the stall; preserve broad quiet readable planes and the original compact proportions, do not make the shop larger/wider or add ornamental complexity. No brand/price/recipe/order/economy meaning. This is a relationship visual concept, not a baked combined production asset.
```
