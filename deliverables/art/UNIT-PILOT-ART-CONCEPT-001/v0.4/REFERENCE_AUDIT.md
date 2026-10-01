# 孟桃奶茶店概念 v0.4｜来源、提示词与权利初筛

日期：2026-10-01。范围：三张 v0.4 概念 PNG。独立来源归档见 `project/art_reference/misc/UNIT-PILOT-ART-CONCEPT-001-v0.4.md`。本记录是项目内部人工初筛，不是全网商标检索或法律结论。

## 实际来源

- 用户最新反馈及本版 `REVISION_BRIEF.md`：店铺标识改为奶茶杯加吸管；角色只有腰牌写“孟”。
- 已批准 Product v0.1、Art/Tech preflight v0.1 和本项目 v0.3 三张概念图：仅用于项目内角色、建筑和构图连续性。未使用旧 Demo 资源。
- 未引入外部图片、网页图、现成品牌图形、字体文件或他人作品；三张图使用内置 `image_gen` 分别编辑生成。

## 内置 image_gen 完整提示词

### 1. 独立人物修订

输入：`v0.3/characters/mengtao-concept.png`，编辑目标。输出：`v0.4/characters/mengtao-concept.png`。

> Use case: precise-object-edit. Edit target: the attached Mengtao character concept. Preserve her identical cute cartoon face, hair, colors, gesture, clothing silhouette, full-body framing, Chinese-inspired outfit, and all unmentioned shapes. Make exactly this graphic design revision: remove the Chinese character from the chest apron entirely, leaving only the small unlettered bowl-and-steam motif; remove the Chinese character from the shoulder pendant entirely, leaving that pendant plain cream jade with no writing. Add ONE and ONLY ONE waist tag, visibly attached to the FRONT CENTER of the orange waist sash at waist height, hanging down a little on top of the green apron; the tag is a single cream oval or rectangular carved wooden/jade plaque with the single Chinese character '孟' large, dark green, upright and perfectly legible, correct strokes (子 above 皿). It must unmistakably be a waist tag attached at the belt, never at chest or shoulder. No other text or Chinese characters anywhere on the character, clothes, accessories, or background. Keep this original concept illustration, avoid any known IP. Truly transparent background with alpha zero outside the figure, no glow, drop shadow, floor, backdrop or color field.

### 2. 独立店铺标识修订

输入：`v0.3/scenes/milk-tea-shop-concept.png`，编辑目标。输出：`v0.4/scenes/milk-tea-shop-concept.png`。

> Use case: precise-object-edit. Edit target: the attached v0.3 standalone Chinese-style milk tea shop concept. Preserve the entire original cute game concept, architecture (curved dark tile roof, wood columns, warm brick wall), proportions, framing, color, menu board with blank rules and empty price boxes, milk tea shaker and cup sealer machines, plants and lanterns. Change ONLY the shop branding graphics. On the center roof sign, replace the large milk-carton silhouette with an ORIGINAL clear milk tea TAKEAWAY CUP icon: a rounded transparent or cream takeaway cup, visible lid, ONE straw inserted diagonally upward, with a simple small tea color region and no label. On the left green hanging cloth banner, replace its carton icon with the SAME recognizable cup-plus-straw logo drawing adapted for single-color print. The roof and banner icon should visibly represent the same reusable master logo design, not two different brands. Milk cartons on shelves and near counter remain unbranded plain cartons as static inventory only. No carton as external logo. No readable brand text, Chinese characters, numbers, prices, product labels, finished beverages, people or extra decorative lettering. Keep just one hanging cloth banner as movable candidate. Ensure true transparent alpha zero background outside the complete shop, with no ground color or backdrop. Original art, no known trademarks.

### 3. 同屏关系修订

输入：`v0.3/scenes/mengtao-shop-relationship.png` 为编辑目标，v0.4 独立人物与独立店铺为支持参照。输出：`v0.4/scenes/mengtao-shop-relationship.png`。

> Use case: precise-object-edit and compositing. Image 1 is the edit target v0.3 Mengtao-in-shop scene; preserve its camera, cute game illustration style, warm evening lighting, character identity, Chinese revival wood/brick/curved-tile shop, empty menu lines and price boxes, machines and plain milk-carton inventory. Image 2 is the NEW APPROVED visual reference for the character's corrected outfit details. Image 3 is the NEW APPROVED visual reference for the shop's revised cup logo. Edit image 1 to match images 2 and 3: replace the milk-carton brand icons on rooftop sign, left green hanging banner AND small outside A-frame board on the lower right with ONE SAME reusable original milk-tea cup-plus-straw logo (lidded takeaway cup with a clearly inserted single straw). Keep cartons only on shelves/counter as unbranded static stock. Remove ALL Chinese characters from the character's chest apron and shoulder pendant; the chest can retain only a small blank bowl-steam motif. Add ONE and ONLY ONE accurately drawn dark-green Chinese '孟' (top 子, bottom 皿) on a single cream waist tag, visibly suspended from the front of her orange WAIST SASH. Keep the tag in front at true waist height and COMPLETELY VISIBLE ABOVE the counter's top edge by positioning the character slightly higher or the counter edge slightly lower; do not relocate it to chest, shoulder, counter, or apron center. This visible waist tag is the ONLY writing anywhere in the image. No other text, no numbers, no prices, no finished beverages or extra people. Preserve the blank menu. Do not add a new background subject or new asset. Original art, no known trademarks.

提示词中 `NEW APPROVED visual reference` 仅表示本次图像编辑时使用的新概念参照，并不表示用户已批准 v0.4 Artifact；其状态仍待正式评审与用户审批。

## 人工目视与文件核查

- 三张图均逐张目视检查。人物独立图 1024×1536 RGBA PNG、店铺独立图 1323×1189 RGBA PNG，四角 alpha 均为 0；同屏图 1322×1190 RGB PNG，作为氛围关系图不要求透明。
- 人物的单一“孟”字位于束带前侧一枚腰牌，字形目视为上“子”下“皿”；胸前只见无字汤碗与蒸汽，肩部圆牌无字。同屏图腰牌位于柜台上缘可见位置，图中未见第二处“孟”。正式原画仍须人工校字并做缩小显示检查。
- 独立店铺的屋顶与左挂旗、同屏图的屋顶、左挂旗和右下外立牌均为带盖奶茶杯与吸管图形；未见外部纸盒 logo。杯形的生成细节尚非精确母版，正式图必须同源重绘。纸盒只在货架／柜内无字陈列。
- 木柱、红砖、瓦檐、机械摇杯架、封口机与只有空行和空价格栏的价目表可辨；未见实际商品名、数字、货币、促销文案、品牌或成品饮品。左挂旗仍为唯一店铺可动候选。
- 同屏图由生成器重绘，人物、店铺、标识与独立图不保证像素一致；夜街和外立牌不构成本轮新增生产对象。

## 版权、商标与字体处理

- 杯加吸管是常见类别图形，生成结果仍须对目标市场商标、现有饮品店 logo 及整体装潢做近似检索。正式资源需人工原创统一母版，不能直接描摹已有商标或从概念 PNG 裁图。
- “孟”是常用汉字，当前字形来自提示词驱动的概念图，不是经授权的字体资产。正式图须人工原创规范化并核查标识近似风险；若改用现有字体，须核验实际使用、嵌入、分发、修改许可。修改现有字体本身不等于取得授权。
- 牛奶纸盒、建筑和设备为通用类别元素组合，当前无可读品牌；正式生产前继续核对商标、外观与 trade dress 近似风险。高风险相似项转 `project/research/ip_copyright/` 复评。
- 本版没有分层原画、骨骼、图集、合批或真机验证；Art 与 Tech 须在正式出图前逐对象签认。
