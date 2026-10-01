# 孟桃与奶茶店｜参考、生成与权利初筛 v0.1

日期：2026-10-01。范围：本版三张候选 PNG 与一次角色局部修订。本文件是**概念阶段初筛**，不构成法律意见、全网排他检索或正式生产许可。

独立来源档案：`project/art_reference/misc/UNIT-PILOT-ART-CONCEPT-001-v0.1.md`。

## 实际输入来源

| 来源 | 实际用途 | 许可与处置 |
|---|---|---|
| 用户已批准的 `UNIT-PILOT-PRODUCT-001/v0.1/PRODUCT_SPEC.md` | 孟桃的四项角色约束、店铺关系、单元展示语义 | 项目内正式文字输入，只取产品含义。 |
| 已批准的 `UNIT-PILOT-ART-PREFLIGHT-001/v0.1/ART_BRIEF.md`、`PARTS_PLAN.md` 和 `UNIT-PILOT-TECH-PREFLIGHT-001/v0.1/TECH_PREFLIGHT.md` | 单视角、对象拆分、冷夜暖灯文字方向、单页骨骼对象门禁 | 只取宽泛文字约束；未向生成器输入历史 Demo 图片、Prefab、UI 图稿或旧店长／摊位造型。 |
| 内置 `image_gen` | 从文字生成角色与店铺概念；利用本轮新生成的两张概念图构思同屏关系；对本轮初次角色图做局部修订 | 输出是候选图，不自动具备对外部作品的相似性排除或正式资产资格。生成原文件位于 Codex `generated_images`，本交付目录存放选定副本。 |
| 外部图片、网页参考、商标、字库 | **未使用** | 无外部图像或字体进入本版。若下轮加入，逐项登记作者、链接、许可和用途。 |

## 本次实际生成步骤与提示词

下面记录最终候选的生成路径。提示词没有指定在世艺术家、具体游戏角色、品牌或受保护作品的画法。三张图按顺序分别生成，角色最终稿还做过一次局部编辑。

1. 角色原稿：内置 `image_gen`，透明背景；输入只有下列文字。

   > Use case: stylized-concept. Asset type: ORIGINAL character concept illustration for a Cocos Creator game pilot, review only, NOT a production sprite, NOT an atlas. Create a single full-body character design on a genuinely transparent background. Character is Mengtao, a young adult female night-market milk-tea shop manager in a whimsical underworld, granddaughter of Mengpo. She is self-directed and lively, with a gently rebellious personality and fondness for sweets, but do not show a specific sweet, drink, tool, recipe, or magical ability. Fresh, distinctive original silhouette: soft rounded head-body shapes, asymmetrical short dark plum hair with one lifted tuft and a small twisted cloth tie, expressive warm face, practical loose layered apron-tunic in muted tea-leaf green and warm peach over deep indigo trousers, simple rounded shoes, rolled sleeves that leave both hands legible for future rigging. One consistent actual-use 3/4 front view, full body head to feet, relaxed ready-to-work pose, hands visible and separated from torso, feet grounded. Playful 'cute underworld night market' atmosphere expressed subtly via cool dusk shadows and warm lantern highlights, without skulls or familiar copyrighted motifs. Clean hand-painted 2D game concept art, elegant readable contours, restrained detail, clear arm/leg/garment overlap suitable for later bone segmentation. No border, no labels, no Chinese or English text, no logo, no watermark. Do not resemble an existing game character, brand uniform, historical demo art, or protected IP. This image is concept only; do not render a sprite sheet, atlas, bone guides, or multiple views.

2. 店铺概念：内置 `image_gen`，透明背景；输入只有下列文字。

   > Use case: stylized-concept. Asset type: ORIGINAL isolated milk-tea shop concept for a Cocos Creator game pilot, review only, NOT a production texture or atlas. Show a single compact night-market milk-tea stall, one actual-use 3/4 front view, against a genuinely transparent background. It belongs to Mengtao, a lively young manager in a whimsical underworld night market, but DO NOT include any person. Fresh original architectural silhouette: low broad rounded canopy with a subtle folded cloth edge, open service counter, warm interior glow, cool indigo/blue-green frame and muted tea-leaf green panels with restrained warm peach details. A clear blank sign area with no letters or symbols so UI may later supply licensed text. Keep a generous unobstructed standing/work position behind and to one side of the counter for a separate character, and visually distinct front/back counter planes for future layering. Include exactly one modest hanging fabric tab under the canopy as the candidate independent bone-animated moving part; it is visually separable and does not obscure the sign or working position. Soft clean hand-painted 2D game concept art, cute underworld night market feeling via night colors and cozy light, rounded readable contours, practical modular construction; readable at small game scale. No menu, drink, dessert, merchandise, price, coins, customers, logos, trademarks, Chinese or English text, watermark, skull motif, known franchise shape, copied brand trade dress, or existing game stall. Do not render multiple views, rigging overlays, or sprite sheet.

3. 角色修订：以内置 `image_gen` 编辑本轮角色原稿；发现初稿腰间出现易读作钱币的挂饰，故删除。修订文字如下。

   > Use case: precise-object-edit. Edit the supplied Mengtao character concept image only. Remove the round coin-like medallion and dangling charm chain at the waist entirely; replace that small area with a plain uninterrupted apron sash, preserving the original green-and-peach cloth folds. Keep the same character identity, face, hair, expression, standing pose, proportions, colors, garment layers, hands, shoes, lighting, transparent background and full canvas framing. No new accessory or object, no text or watermark. This remains an ORIGINAL review-only character concept, not a game production sprite.

4. 同屏关系：以内置 `image_gen` 输入本轮最终角色图和店铺图，分别作为新生成的设计参考；没有输入旧图。修订后的角色图为输入图 1，店铺图为输入图 2。提示词如下。

   > Use case: compositing / stylized-concept. Asset type: ORIGINAL same-screen relationship concept illustration for a Cocos Creator unit pilot, review only. Use image 1 solely as the approved-for-this-draft Mengtao character design reference and image 2 solely as the matching milk-tea shop design reference. Preserve their distinguishing silhouette, outfit/hair colors, green-indigo/peach palette, rounded architecture, empty sign panel and one small hanging fabric tab. Compose the same two separate objects together in one readable 3/4 front game camera view: Mengtao stands at the shop's working position immediately behind the front counter but remains visible from head through her arms/hands, clearly belonging to this stall. Show front counter layer in front of her lower torso and shop interior behind her. Give both objects coherent scale and grounding. Cool twilight night market with restrained warm shop lights, simple atmospheric ground and unobtrusive background. No other people, no customer, no product, no finished drink, no transaction, no coin, no menu/price, no skull motif, no UI, no text/logo/watermark, no reward/upgrade state. One single use perspective only, no four-direction sheet, no sprite atlas, no bone guides. Make it an elegant hand-painted 2D game concept image with a clear silhouette at thumbnail size. Do not invent a different costume or shop design; no known franchise or brand resemblance.

## 视觉初筛与处置

- 已目视检查三张正式候选：没有可读品牌文字、商标、价格、产品成品、顾客、旅客四方向或既有作品名称。角色初稿的钱币形挂饰已移除；原稿只留在 `characters/drafts/` 作为内部生成记录，不供集成。
- 店铺抽象火苗、布片花形、屋顶和灯笼是候选视觉符号。它们未经过商标／外观全域排查，正式定稿前须与实际使用的参考及目标市场品牌做相似检查；若出现可识别近似，应停用并改绘。
- 同屏图由生成器重构，可能改变独立图的细节。后续可编辑原画需以统一设计重新制作，不能把同屏图裁切成角色、店铺或背景正式贴图。
- 本版**无系统字体、美术字体或图内字形**。未来 UI 显示“奶茶店”“孟桃”时，须登记具体字体、来源与覆盖游戏内显示、嵌入、打包分发的许可；美术字体若改造还需明确修改许可，不能以改形替代授权。授权不明者不得进入正式资产。
- 图片生成结果仍需人工原创重绘、相似性复核、Art 与 Tech 出图前联合确认，并完成用户对正式资产版本的审批，才可进入生产链。生成工具的使用不是版权风险消除措施。
