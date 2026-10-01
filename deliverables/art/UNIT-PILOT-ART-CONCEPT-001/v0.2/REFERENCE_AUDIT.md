# 孟桃奶茶店概念 v0.2｜来源、提示词与权利初筛

日期：2026-10-01。范围：本版三张概念 PNG。独立归档见 `project/art_reference/misc/UNIT-PILOT-ART-CONCEPT-001-v0.2.md`。本记录为人工初筛，不是全网商标检索或法律结论。

## 实际来源

| 来源 | 用途与授权边界 |
|---|---|
| 用户本轮修订要求和 `v0.2/REVISION_BRIEF.md` | 指定孟婆家族视觉线索、现代奶茶店、奶茶机、价目表与牛奶瓶；未指定任何外部作品。 |
| 已批准 `UNIT-PILOT-PRODUCT-001/v0.1`、Art/Tech preflight v0.1 | 孟桃身份、单视角、对象拆分和出图门禁的项目内文字依据。 |
| 本项目 v0.1 孟桃和店铺 PNG | 作为内置 `image_gen` 的编辑目标，保持角色与店铺连续性；本版没有复制旧 Demo 资源。 |
| 本项目 v0.2 前两张 PNG | 作为同屏图的设计参考；同屏由生成器重绘，不是精确合成。 |
| 外部图片、商标、字体、网页参考 | 未使用；没有可读字形、数字或货币符号进入画面。 |

## 内置 image_gen 的完整提示词与输入

1. 角色编辑。编辑目标：`deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.1/characters/mengtao-concept.png`；透明背景；结果复制为 `v0.2/characters/mengtao-concept.png`。提示词：

> Use case: precise-object-edit. Asset type: original Mengtao character concept revision v0.2 for review, NOT a game sprite. Edit target: the supplied v0.1 Mengtao character image. Preserve her full-body 3/4 front view, face, short plum hair and tuft, open friendly expression, head-body proportions, green layered apron tunic, peach sash, indigo trousers, hand poses, shoes, colors, painterly 2D treatment and silhouette. Change the blank upper apron chest to show ONE unmistakable, original Mengpo family cue: a small but clearly readable stitched emblem shaped as a simple shallow soup bowl with one curved ladle above it and two soft curling steam lines, in muted pale peach thread. Also put a tiny matching bowl-and-ladle charm on her existing apron shoulder clasp if this can be done without clutter. The emblem is a personal family memory motif, NOT a known franchise logo, magic power, business brand, legal heraldry or coin. Keep fabric and attachments feasible for later bone segmentation. Genuinely transparent background. No letters, digits, text, watermark, weapon, existing IP mark, skull, or new menu/product. Concept only; no sprite sheet, atlas, bones or extra views.

2. 店铺编辑。编辑目标：`deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.1/scenes/milk-tea-shop-concept.png`；透明背景；结果复制为 `v0.2/scenes/milk-tea-shop-concept.png`。提示词：

> Use case: precise-object-edit. Asset type: original milk-tea shop concept revision v0.2 for review, NOT a game texture. Edit target: the supplied v0.1 isolated Mengtao shop image. Preserve a single 3/4 front view, compact open-service stall footprint, cool indigo and tea-green palette, warm internal light, blank main sign, clear standing space behind the counter, separate front counter plane, and exactly ONE small hanging fabric tab as the ONLY candidate animated shop element. Redesign the traditional curved canopy and lantern-heavy visual toward a distinctly modern small night-market milk-tea kiosk: simpler contemporary flat roofline, restrained geometric frame, practical stainless counter and clean lit work surface, while keeping softly rounded hand-painted 2D game-art edges. Make three new features visibly unmistakable: (1) a large original MILK BOTTLE silhouette integrated into the front upper sign surround or roof corner, plus a cluster of upright plain glass milk bottles on a visible shelf, no brand labels; the bottle is the strongest store-identifying shape; (2) a clearly identifiable modern milk-tea preparation machine on the back counter, with a dispenser, sealed canister and control area, but no recipe details; (3) a visible rectangular menu/price board inside the kiosk with only blank horizontal item rows and blank separate price slots, NO readable glyphs, digits, currency or actual products. Do not add a second hanging/dynamic piece. Keep plenty of head-and-arms clearance for a manager in the working position. Truly transparent outer background. No people, logos, brand trade dress, words, watermark, drink names, numbers, currency, completed drinks, cash register or game UI. Concept only; no atlas, bones or multiple views.

3. 同屏关系。参考图 1：本版角色 PNG；参考图 2：本版店铺 PNG；非透明场景；结果复制为 `v0.2/scenes/mengtao-shop-relationship.png`。提示词：

> Use case: compositing. Asset type: original same-screen relationship concept v0.2, review only. Input image 1 is the revised full-body Mengtao character design reference; input image 2 is the revised modern milk-tea shop design reference. Compose the SAME Mengtao at her work position inside the SAME shop in one 3/4 front game-camera view, keeping the character's plum short hair, peach and green clothing and clearly visible bowl-ladle-steam emblem on her upper apron. Preserve the shop's flat modern roof, prominent large milk-bottle roof sign, shelves of glass milk bottles, milk-tea dispenser machine, rectangular blank menu board with horizontal item rows and separate empty price slots, empty upper main sign and exactly one small hanging fabric tab on the left. Mengtao's head, chest emblem, arms and hands must remain unobstructed above or beside the foreground counter; the counter appears in front of her waist, interior behind her. Coherent scale, no redesign of either independent concept. Cool twilight night-market ambience with restrained warm shop light, simple ground; no additional people or distinct props. Menu board contains no glyphs, words, digits, currency, SKU names or actual prices. No finished drinks, transaction, UI, brand, trademark, watermark, skull, magical power, sprite sheet, atlas or multiple directions. Hand-painted polished 2D game concept scene. This image is a relationship illustration, NOT a precise composite or production asset.

4. 美术复核发现设备偏像普通咖啡机，因此再次编辑店铺图。编辑目标：上述步骤 2 的店铺图；透明背景；选定结果覆盖本版尚未交付的店铺候选。提示词：

> Use case: precise-object-edit. Asset type: revision of the supplied v0.2 isolated modern milk-tea shop concept, review only. Change ONLY the center back-counter preparation equipment, currently resembling a generic coffee dispenser, into a recognizable compact MILK-TEA PREPARATION STATION: a visible stainless mechanical shaker stand gripping a closed metal shaking canister next to a small circular cup-sealing press with an open empty sealing ring. Keep it practical, simplified and readable at game thumbnail size. No finished drink, no filled cup, no specific ingredient, no recipe. Preserve precisely the shop's modern flat roof, large glowing blank milk-bottle silhouette sign at upper left, blank main sign, shelves full of plain white milk bottles, rectangular empty menu board with five blank horizontal item lines and blank price slots, navy and tea-green architecture, warm lighting, foreground counter, planter, exactly one left hanging fabric tab, isolated 3/4 view and genuine transparent outer background. Do not add people, text, digits, currency, brand, logo, second fabric piece, bones or atlas.

5. 同屏初稿的远景出现模糊人形剪影，且设备仍与独立店铺图不一致。输入图 1：上述步骤 3 的同屏候选（编辑目标）；输入图 2：上述步骤 4 的店铺候选（设备参考）。非透明场景；选定结果覆盖本版尚未交付的同屏候选。提示词：

> Use case: precise-object-edit / compositing. Image 1 is the v0.2 same-screen Mengtao-in-shop scene to edit. Image 2 is the UPDATED isolated shop design reference. In image 1, replace only the old coffee-like machine behind Mengtao with the updated milk-tea preparation station from image 2: a stainless mechanical shaker stand holding a closed metal canister beside a compact circular cup-sealing press with empty ring. Keep that equipment visible without obscuring Mengtao. Also remove all distant humanoid silhouettes/people from the night-market background at far left and right; replace them with empty softly blurred building fronts and warm lights. Preserve every other meaningful element of image 1: Mengtao's same face, plum hair, bowl-ladle-steam apron emblem and shoulder charm, standing pose, clothing, hands, position behind counter; modern flat-roof kiosk, large milk-bottle roof sign, plain bottle shelves, blank main sign, rectangular menu board with blank item lines and empty price slots, exactly one small hanging fabric tab, planter, foreground counter, twilight lighting, viewpoint and image framing. No readable text, digits, currency, new product, finished drink, customers, shadows resembling people, logos, watermark, bones or atlas. Review-only 2D concept image.

## 目视初筛与处置

- 胸前刺绣及挂件采用普通汤碗、汤勺、雾线的重组，不宣称它们是已获批准的正式家徽；正式生产前应对目标市场相似标志进一步检索。屋顶瓶形与无标瓶列采用通用牛奶瓶轮廓，不能描摹具体品牌容器或店面 trade dress。
- 价目表只有线条与空槽。没有饮品名、数字价格、货币、系统字体、美术字体；图像生成器可能产生似字形噪点，后续拆件时须手工清除并由 UI 采用获批且许可覆盖显示、嵌入、分发及所需修改的字体。
- 同屏初稿的模糊人物剪影已在最终候选中移除；背景建筑和灯光仅为氛围，不作为旅客资产、四方向设计或新增玩法。独立图和同屏图存在笔触及细节差异，不能裁切为正式贴图。
- 三张图已人工目视核对：孟桃大胸章与小挂件、店铺牛奶瓶、制作设备、空白价目表均可见，未见可读品牌、数值或货币。透明背景仅限独立图。此初筛不证明全域无相似风险；遇高风险外观停用并进入 `project/research/ip_copyright/` 复评。
- 生成图没有可编辑分层源，也未通过目标设备、图集与合批验证。正式生产资产须以人工统一设计、逐项来源许可与 Art/Tech 联合签认为前提。
