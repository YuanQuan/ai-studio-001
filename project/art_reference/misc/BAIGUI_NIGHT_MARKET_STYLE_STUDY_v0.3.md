# 百鬼夜市横向平视效果图｜研发复用探索 v0.3

日期：2026-10-02。图片：[v0.3 效果图](BAIGUI_NIGHT_MARKET_STYLE_STUDY_v0.3.png)。内置 image_gen 新生成一次、定向修订两次，最终输出 2172×724；v0.1/v0.2 留档。本轮仍为候选视觉研究，未改变正式产品审批或 Creator 工程。

## 当前需求与依据

- 用户本轮明确要求按当前视角重新出效果图，考虑后期研发，通用图片资源尽量复用，特殊元素保留独立识别。
- project/DECISIONS.md 的 DEC-FIRST-STREET-VIEW-001 已记录用户要求的近似平视横向长街。PRODUCT-001 v0.20 的 SCENE_PRESENTATION.md 与 PRODUCT_OUTLINE.md 是当前待审产品草案；本图依本轮用户授权用于效果探索，不宣称整版 Product 已获批准。
- 左至右：阎罗殿 → 01 奶茶 → 02 糖画 → 03 炭烤 → 街市桥 → 04 理发 → 05 花灯 → 06 投壶 → 奈何桥。顾客右至左行进；投壶为箭入壶，不是套圈。
- 延续上轮宽敞、简化、六店不互遮、少量桌椅、少水面及祈愿纸船蜡烛的方向。图中桌椅与低栏杆位置仍需用手机视口核验。
- 孟桃的 brown bob／侧髻、绿围裙和橙束带参考项目内 UNIT-PILOT-ART-CONCEPT-001 v0.4 人物候选。该版仍 USER_REVIEW；小图只表达连续性，不确立新角色原画。其他五名店长待独立造型，图中保留各自工作台而未使用重复店员替代。

## 复用与独有组件建议

| 对象 | 通用图源／组件 | 独有部分 |
|---|---|---|
| 店体 | 瓦片纹理、瓦檐段、木柱、墙板、砖基、空牌匾框 | 六店宽高组合、开口与门面轮廓；不强行使用同一完整屋体 |
| 01 奶茶 | 木构、灯具、柜台基件 | 杯加吸管标识同一母版、封口／摇杯设备、无品牌纸盒牛奶、孟桃 |
| 02 糖画 | 遮棚、柜台、基础展示架 | 糖画动物展示、糖板与操作道具 |
| 03 炭烤 | 棚架、柜台、器皿基件 | 烤炉、串签与工作反馈 |
| 04 理发 | 封闭墙板、门框、灯具 | 剪刀标识、镜子、理发椅、工具；阿角造型独立 |
| 05 花灯 | 木架、柜台、基础灯笼 | 花灯展示形态与颜色组合；阿灯独立 |
| 06 投壶 | 屋檐、支架、柜台 | 更宽活动面、目标壶与箭束；小锦独立 |
| 两桥／阎罗殿 | 桥栏段、石材纹理、柱件可复用 | 两桥入口出口轮廓、阎罗殿标志性门面独立，不套普通店体 |
| 道路／河岸 | 铺地段、路沿、栏杆段 | 桥头接口、岸转折和局部前景按布局补片 |
| 桌椅／树／灯具 | 少量统一款式、多处同源实例 | 有叙事／功能身份的对象另做，避免纯装饰变体无限增长 |
| 顾客／店长 | 普通顾客可使用经批准的部件与配色变体 | 六店长、特殊顾客、魂状态含义各自独立，不能共用同一人物图替代 |

图中重复元素只有视觉上的组件家族关系，生成器并未输出精确相同的可编辑母版。正式资源必须重建统一母版并实例化，不能从整幅概念图裁图当成已经实现资源复用。

## 研发拆分与出图前复核

1. 远景按夜空／远山、地府剪影、柳树分层；主街按可见区段加载候选，六店独立 Prefab 与资产源。桥、道路接口和服务点以明确脚线组装。手机单屏显示 1～3 店，整图是长街总览。
2. 通用静态部件先建可编辑母版，再组合店体与三档翻新；脚线、工作开口与招牌／灯笼／广告挂点跨档稳定。特殊店面与经营道具保留独有图源。
3. 动态店长、顾客，以及确需运动的树／布件等按骨骼对象拆分；每个骨骼对象所有附件使用独占一页图集。角色身份专有的部件与动画语义保持独立。
4. 杯标识与通用道具在源文件层复用；需要进入不同独占骨骼图集时可从同源母版导出副本。图源复用、图集共用与渲染合批是不同指标。
5. Art 与 Tech 在正式图片生产前逐对象签认最终显示尺寸、极限动作外扩、采样留白、图集页数与内存、材质和遮挡，再实测目标设备批次。共图集不保证一次 Draw Call，不把整街打成一张超大纹理。
6. 单元示例与主体游戏引用同一获批 Prefab／配置／资产源及公共 UI，独立示例工程作为验证宿主；通过共用源和导入流程反复迭代，避免复制后各自修改。
7. 图中桥面、队列、栏杆与桌椅尚未经过导航、点击和遮挡验证；角色细节及小字须在近景复核，不能由全景图推断单元接入完成。

## 参考、权利与生成记录

没有新增外部图片、字体文件、第三方商标或现成游戏资产。旧用户参考图仅保留抽象像素画法方向；本次重新构图。孟桃参照是项目内 v0.4 生成候选。正式图源仍需原创重绘和商标／外观相似复核；如使用字体，须核验实际使用、嵌入、分发和修改许可。

### 初次生成完整提示词

Use case: original 2D game environment visual concept for 百鬼夜市, designed for later modular Cocos Creator production. Create a NEW panoramic SIDE-ELEVATION / near-eye-level horizontal Chinese ghost night-market street, wide 3:1 landscape composition. This is a side-scrolling management game overview: camera faces the shopfronts, orthographic elevation with only a very shallow view of sidewalk depth and small building side faces. All shop feet and customer feet share one continuous horizontal ground baseline. NO isometric camera, NO 45-degree overhead view, NO H-shaped riverbank map, NO deep vanishing-point street. Keep crisp charming small-pixel 2D game art, readable simplified shapes, restrained indigo night and warm amber light. Entire horizontal journey visible, comfortable spacing. LEFT TO RIGHT exact order: a modest distinct Yanluo hall landmark, MILK TEA shop, SUGAR PAINTING stall, CHARCOAL SKEWER stall, central MARKET BRIDGE, BARBER shop, PAPER LANTERN shop, wider ARROW-THROWING INTO VASES shop (traditional touhu game, NOT ring toss), then NAIHE ENTRY BRIDGE at far RIGHT. This order is important: ghosts travel from right to left. EXACTLY SIX economic shops, all fronts and roof silhouettes entirely visible without overlap or cropping; bridges and hall are separate landmarks. Bridge decks connect to the horizontal customer baseline, shallow side-profile stone arches over small tributary gaps, readable walking connections. Six shops look like a modular family: reuse the same dark blue-gray roof tiles, timber post widths, warm wood wall panels, red-brick plinths, cream signboard frames, simple orange lanterns and pavement tiles. Repeated components should visibly look identical and reusable, never six unrelated bespoke buildings. Give each shop its OWN distinctive silhouette and purpose using a restrained unique front kit: milk tea is a retro Chinese timber-and-brick shop with a simple original takeaway CUP AND STRAW icon, cup sealer and shaker machine, a couple of unbranded milk cartons; sugar painting is a smaller open canopy with a flat work slab and a few amber sugar-animal display sticks; charcoal skewers is a low open-front kiosk with a grill and skewers, subtle small smoke; barber is a compact enclosed facade with visible chair and mirror and an unlettered scissors icon; paper lantern is an open wooden display frame with a limited collection of colored handmade lanterns; touhu is visibly wider than the others, with a sheltered counter and a spacious visible target-vase activity bay and arrow bundles. Do not use ring-shaped targets. Keep shops separated by quiet paved gaps and a few reusable wooden table-and-chair sets in recessed pockets; generous clear pedestrian strip in front, tables never hide storefronts or customers. Sparse cute small white ghost customers with distinct simple silhouettes walk or wait at fronts; small staff figures may appear within work windows without inventing elaborate character designs. Foreground is a THIN strip of river, no more than 10 percent of scene height, with 4-6 folded cream paper wishing boats each carrying a tiny candle; repeatable low riverbank rails leave clear gaps so feet and clicks remain visible. Far background: minimal separate flat layers of night sky, mountain silhouettes, faint distant underworld roofs and just a few willow silhouettes, suitable for parallax. No dense foliage, crowded decorations, oversized water areas or extra shops. Warm welcoming supernatural night market. Clear top/middle/foreground layer boundaries, moderate low detail, uncluttered production-friendly game concept. No UI, watermark, readable text, invented prices, numerals, real brand marks, copyrighted game characters, labels, asset-sheet panels or technical annotations. A beautiful coherent street overview, not a diagram.

### 空间与奶茶道具修订完整提示词

输入：本次初次生成的横向图。

Use case: precise composition refinement. Edit the attached near-eye-level horizontal Ghost Night Market panorama, KEEP its front-facing side-scrolling projection, six-shop identities, LEFT TO RIGHT order (Yanluo hall, milk tea, sugar painting, charcoal skewers, market bridge, barber, lanterns, touhu arrow/vase game, Naihe bridge), common timber/tile module language, muted night colors and small-pixel style. Give EACH adjacent shop a visible paved separation of about 15 percent of the ordinary shop width; none of their roof ends should touch or overlap. Fit all six complete shops in the panorama, touhu remains wider, no cropping. Widen the clear foreground customer walkway by roughly 60 percent, keep customers and service points visible, with a few identical table/chair sets in gaps behind the walking band. Reduce the river strip to about 10 percent of frame height, retaining the folded paper candle boats and both stone bridges connecting to the ground path. In MILK TEA shop on the left, make inventory clearly folded-top off-white PAPER MILK CARTONS, not bottles, on one small shelf; add a plainly visible original compact cup-sealing machine and tall mixing/shaker unit at the counter. Keep original cup-and-straw roof icon. Limit distant architecture to faint simple silhouettes and quiet willow shapes, no crowded details. Preserve the reusable roof tile, post, pavement, lantern and furniture design family, while the six unique working fronts/icons remain unmistakable. No readable text, prices, UI, watermarks, new shops, characters covering buildings or isometric perspective.

### 角色一致性修订完整提示词

输入：空间修订图（编辑目标）、项目内 v0.4 孟桃人物图（身份参照）。

Use case: precise character consistency edit. Image 1 is the EDIT TARGET: preserve every shop, spacing, camera, bridge, path, paper boat, roof icon, background and all furniture exactly. Image 2 is the supporting Mengtao identity reference, not an edit target. ONLY revise staff characters: in the milk tea shop, replace the anonymous male clerk with a small pixel-art rendition of Mengtao from image 2, matching her brown bob and side bun/ribbon, cream sleeves, dark green apron and orange waist sash, cute cheerful girl. Keep her at the milk tea work station at appropriate sprite scale. If any family character can be legible it must be ONLY on a small tag at her waist; no writing on her chest, shoulders or shop. Her upper body and waist tag should be visible at the counter. Remove the other four identical male clerk clones from the sugar, charcoal, barber and touhu shop windows (leave their workstations/props visible); they are awaiting distinct character design and must not appear as clones. Keep all small white ghost CUSTOMERS already in the street and barber customer chair unchanged, including lantern shop ghost customer. Do not add other staff characters. Keep the warm shop lights, pixel game style and no text or UI.

## 目视结果

横向近似平视，六店順序可数，门面与瓦檐间有分隔；两桥及阎罗殿为独立地标。通用瓦檐、木柱、砖基、灯笼、铺地和桌椅形成统一家族；六店以标识、工作台和道具区分。孟桃保留绿橙服装与单一腰牌线索，其他角色未锁定。水面为前景窄带，有带蜡烛的纸船。没有实际品牌、菜单价格或 UI。准确比例、图集、骨骼与性能仍待正式规格和验证。
