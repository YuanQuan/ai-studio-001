# 孟桃奶茶店概念 v0.3｜来源、提示词与权利初筛

日期：2026-10-01。范围：三张概念 PNG。独立归档见 `project/art_reference/misc/UNIT-PILOT-ART-CONCEPT-001-v0.3.md`。本记录为人工初筛，不是全网商标检索或法律结论。

## 实际来源与边界

- 用户本轮修订与 `REVISION_BRIEF.md`：复古中式木砖建筑、可爱卡通人物、纸盒牛奶、单字“孟”。
- 已批准 Product v0.1 与 Art/Tech preflight v0.1：角色身份、单视角、对象划分和出图门禁。
- 本项目 v0.2 人物与店铺图只作当前项目内部身份和类别参照；未复用旧 Demo 资源。
- 没有引入外部图片、网页图、现成商标或字体文件；“孟”字由提示词要求生成，非字体文件，也不能据此声称字体许可。

## 内置 image_gen 完整提示词

### 1. 人物卡通化与“孟”字初稿

输入：v0.2/characters/mengtao-concept.png 作为编辑参照；非透明候选。

> Use case: style-transfer / stylized-concept. Asset type: original game character concept for UNIT-PILOT-ART-CONCEPT-001 v0.3. Input image 1 is the v0.2 local character concept used only as identity and palette reference; redesign it for the user's latest direction. Create one full-body, single usable three-quarter front view of Mengtao, a cheerful young female milk-tea shop manager and granddaughter of Mengpo in a Chinese fantasy town. Make her emphatically CUTE CARTOON GAME ART: chibi-like 3.5-4 head proportions, round expressive face, clean confident outlines, simple readable shapes and flat-to-soft cel shading; not semi-real anime illustration. Preserve the short tousled dark brown hair with little tied bun, warm amber eyes, sage green + warm peach palette, cream inner robe, practical apron and loose trousers as identity cues; simplify costume for feasible eventual skeletal parts. Add the EXACT single Chinese character “孟” (U+5B5F: upper 子 above lower 皿) as large, dark green, highly legible hand-drawn brush-style embroidery on a light cream rectangular apron patch at her upper chest. Repeat the exact correct “孟” once on a little cream pendant tied at her shoulder. Clearly show exactly 子 over 皿; no other Chinese letters, no Latin letters or invented marks. This is original hand-drawn lettering, not an existing commercial font/logo. Optional tiny soup bowl and spoon shape around the patch, but the single “孟” remains primary. Plain pale warm background, no shop, no other person, no copyrighted character or brand, no watermark. Make the apron lettering visually easy to inspect. Concept illustration only, no sprite slicing or production claim.

### 2. 木砖中式店铺初稿

输入：v0.2/scenes/milk-tea-shop-concept.png 作为编辑参照；非透明候选。

> Use case: style-transfer / stylized-concept. Asset type: original single-view game building concept for UNIT-PILOT-ART-CONCEPT-001 v0.3. Input image 1 is the prior milk tea shop concept used only to preserve useful shop function and general cozy color palette; substantially redesign the architecture according to latest user direction. Draw ONE small freestanding Chinese retro fantasy-town milk tea shop in a cute cartoon game illustration style with rounded shapes, clean outlines, soft cel shading; it must visually match a chibi character, not a realistic architectural rendering. Clearly CHINESE TRADITIONAL WOOD AND BRICK construction: warm timber posts, carved but simple wood lattice window frames, reddish-brown brick side wall, visible wood plank counter, curved tiled eaves pitched roof with raised corners. No modern flat roof, no metal exterior shell. Open storefront three-quarter single practical view, isolated on light warm background. Show several unmistakable BRAND-FREE PAPER MILK CARTONS: rectangular folded gable-top cartons with triangular tops and a simple plain cream/sage color block, no labels, no words; one carton icon sign on roof or side plus 2-3 cartons on shelf. NO glass or plastic milk bottles anywhere. Inside shop show a compact modern mechanical milk-tea shaker and cup-sealing machine as small working equipment that fits naturally behind wooden counter. Mounted framed PRICE MENU layout with 4-5 empty horizontal rules and empty small price slots; absolutely NO names, letters, numerals, currency marks, prices. Maybe one short fabric pennant suitable for future bone animation. Do not add people, brands, text, logos, watermark. Keep shop silhouette legible and all objects visible. Concept illustration only, not a production texture, no sprite atlas.

### 3. 人物去成品杯并提取透明背景

输入：步骤 1 候选作为编辑目标；最终独立人物图。

> Use case: precise-object-edit / background-extraction. Edit target: the generated v0.3 Mengtao character candidate. Preserve her full-body identity, exact cute chibi cartoon proportions, costume, pose and expressive face, and the clearly correct Chinese character “孟” (子 over 皿) on chest patch and shoulder pendant. Remove ONLY the prepared pearl milk tea cup from her right hand; make that hand empty, open and ready for later work gesture. Also extract the entire character onto a genuinely transparent alpha background with clean silhouette edges, no painted background, halo, ground shadow or checkerboard. Keep the whole body in frame. Do not change any lettering or add new text, drink products, logos, props, people. This is only a concept cutout, not a production sprite.

### 4. 同屏关系初稿

输入：步骤 3 人物候选及步骤 2 店铺候选为输入参照；关系重绘。

> Use case: compositing / stylized-concept. Asset type: same-screen relationship concept for UNIT-PILOT-ART-CONCEPT-001 v0.3. Input image 1 is the newly approved-style v0.3 cute cartoon Mengtao character cutout, identity and costume reference. Input image 2 is the newly designed v0.3 retro Chinese wood-and-brick milk tea shop, architecture and equipment reference. Make ONE cohesive original cute cartoon game scene in the same clean linework, round proportions and soft cel shading as both references. Put Mengtao behind the wooden service counter in a welcoming empty-handed work gesture. She must preserve the face, short hair/bun, peach-and-sage costume and clearly visible chest patch bearing EXACTLY the single Chinese character “孟” (U+5B5F, upper 子 and lower 皿); if pendant is visible it also bears the same exact character. The wooden timber posts, reddish brick side wall, lattice windows, curved tiled roof, warm lanterns and wood counter should match image 2, never a modern metal flat-roof kiosk. Include brand-free gable-top PAPER milk cartons on shelves and carton-shaped roof sign, NO milk bottles. Keep mechanical milk-tea shaker and cup sealer visible behind counter and a menu board with only blank horizontal lines and empty little price boxes, absolutely no numbers, letters, prices, currency, item names or recipes. No completed drinks in her hands, no other people or silhouettes. Evening Chinese fantasy street background kept subtle, shop and manager primary. The character-to-counter scale should be physically plausible for a shop manager. No brand, watermark, slogans, invented text or other Chinese characters. This is relationship concept only, not production asset or actual pixel-perfect compositing.

### 5. 店铺去柜前布片并提取透明背景

输入：步骤 2 候选作为编辑目标；最终独立店铺图。

> Use case: precise-object-edit / background-extraction. Edit target: v0.3 independent retro Chinese milk tea shop candidate. Preserve the cute cartoon wooden-and-brick building, curved tile roof, wood columns and lattice, paper milk-carton sign and shelf cartons, mechanical shaker, cup sealer, and fully blank menu exactly. Change only TWO things: (1) remove the green hanging cloth runner with gold tassel from the FRONT of the service counter and replace it with fixed flat sage-green painted wood inlay, flush with the wood panel, no hanging edge or tassel; keep the tall green hanging pennant at the LEFT post as the ONLY possible future animated cloth. (2) remove the entire cream background and ground shadow, providing a genuinely transparent alpha exterior around the entire shop with clean edges, no checkerboard rendered into pixels. Keep every part of the building inside frame. No people, bottles, letters, numbers, prices, brands, watermarks or new props. Concept cutout only.

### 6. 同屏柜前改固定木板

输入：步骤 4 候选作为编辑目标；最终同屏图。

> Use case: precise-object-edit. Edit target: v0.3 same-screen relationship concept showing Mengtao at her wooden-and-brick retro Chinese milk tea shop. Preserve the entire scene, adorable cartoon style, Mengtao's face/body/work gesture, readable exact Chinese “孟” (子 above 皿) on her chest and pendant, curved tile roof, timber/brick architecture, paper milk cartons, mechanical shaker, cup sealer and blank menu. Change only the FRONT COUNTER: remove its central green hanging fabric runner and tassel completely, and replace the space with a fixed flat sage-green painted wood inlay flush within the carved counter panel, matching the revised standalone shop. Retain the single green hanging pennant on left post as the only animated cloth candidate. No new text, prices, names, bottles, people or props. Keep all other composition and details as close to source as possible. Concept only.

## 人工目视与文件检查

- 人物最终图为 1024×1536 RGBA PNG，外部角点 alpha=0；店铺最终图为 1323×1189 RGBA PNG，外部角点 alpha=0；同屏图为 1323×1189 RGB PNG。透明只要求独立图。三张最终图逐张目视核对。
- 人物胸前及肩部字形均按“子在上、皿在下”的“孟”目视核对；同屏胸前“孟”可辨。生成阶段曾出现已完成珍珠奶茶杯，已移除；双手为空。正式原画须人工重写该字并在目标显示尺寸、低分辨率与对比度下复核。
- 店铺为木构、砖墙、弯檐瓦顶，纸盒牛奶为通用无品牌折顶轮廓，无瓶装奶。机械摇杯架、封口机和只有空线/空价格栏的价目表可辨。柜前布片已删，改固定漆木板；仅左绿挂旗为可动候选。灯笼穗为静态外观，屋外小立牌和远景建筑只作氛围，不自动扩大为独立生产对象。独立店铺有真实透明外背景。
- 同屏图由生成器重新绘制，人物与店铺细节不是独立图精确像素合成；夜街只作氛围。未见实际价目、饮品名称、货币、品牌、额外人物或顾客。

## 版权、字体与后续处置

- “孟”是常用单字，但生成图的笔画、装饰构图仍需人工原创规范化，排查与现成商标、徽章近似；不得从未经核验许可的字体直接描摹。修改他人字体本身不产生授权。正式系统字体和美术字体应分别验证实际显示、嵌入、分发、修改许可。
- 纸盒造型、店铺外观和柜台设备为通用元素组合，未使用品牌文字；正式生产前仍需针对目标市场商标、外观和 trade dress 做相似复核。发现高风险相似时停止使用并走 `project/research/ip_copyright/` 复评。
- 生成概念缺少统一可编辑分层源、骨骼、图集及真机数据。正式资源应人工重绘并由 Art 与 Tech 在图片合批、尺寸和性能上逐对象签认。图中无品牌文字不等于全部权利风险已排除。
