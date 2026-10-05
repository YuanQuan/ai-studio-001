# 项目美术资产索引

## 示例1四层背景：当前已批交付入口

`STREET_BASE_01_L01`–`L04` 的**实际美术目录、逐件文件与 SHA-256、层用途、Gate2 版本**，以及对应 **Creator 计划目录与待导入状态**，统一查 [美术交付与工程资源交接登记](ASSET_HANDOFF_REGISTRY.md)。四层 PSD 母版和同尺度整体审核图在该登记中单列为“不接入”；四张正式 PNG 的 Gate2 `v0.3` 已获用户批准。Creator 文件、`.meta`、UUID 和运行效果仍待 Client 实际导入与验证。下文 `UNIT-MENU-BASE-ASSET-001` 的 16 图空景为历史候选，不代表本次获批四层图组，也不能替代其交接记录。

用户已退回加宽稿，选定 v0.4 未加宽非像素附件为视觉参考；孟桃单元 v0.5 三图与拆件方案已获用户批准。七菜单 Product 与 Art/Tech/UI/VFX v0.2 已于 2026-10-03 获用户批准；`UG_GHOST_01` / `BENCH_01` 已有真正可编辑源与导出，Art/Tech 及 Master Review 已通过，**仍待用户审批及 Creator/目标机接入验收**。历史 `UNIT-MENU-BASE-ASSET-001` 候选曾为 `STREET_BASE_01` 产出 16 张分层纹理和同源预览，Art/Tech 成品 Review 曾通过，但该任务已取消、v0.2 审批状态为 `SUPERSEDED`，不覆盖上方示例1四层已批交付。其他对象尚无生产源/骨骼/图集证据。每个生产对象由各自正式 Manifest 维护尺寸、格式、状态和源路径。

| Asset ID | 名称 | 类型 | Source Artifact | Format/Size | 状态 | 用途 | 说明 |
|---|---|---|---|---|---|---|---|
| CONCEPT-FIRST-STREET-03 | 第一街横向研究v0.3 | 整景概念 | `project/art_reference/misc/BAIGUI_NIGHT_MARKET_STYLE_STUDY_v0.3.png` | PNG 2172×724 | 用户采纳布局/画风 | 方向依据 | 不可裁图充当生产母版 |
| CONCEPT-FIRST-STREET-04 | 第一街建筑修订v0.4 | 整景概念 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.1/scenes/night-market-v0.4.png` | PNG 2172×724 RGB | 历史稿，用户退回 | 建筑/原则整体效果 | 尚非生产图源，未获用户批准 |
| REF-FIRST-STREET-BUILDING-01 | 用户建筑参考 | 参考 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.1/references/user-building-reference.png` | PNG 2172×724 | 权利未知/研究用 | 通用构造提炼 | 不直接裁用或临摹 |
| ART-FIRST-STREET-DIRECTION-01 | 第一街美术方向 | 版本文档 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.1/ART_DIRECTION.md` | Markdown | 历史稿，用户退回 | 美术持续性 | 确认部分与待审细则分开，新细则未获用户批准 |
| CONCEPT-FIRST-STREET-05A | 第一街桥/牌匾修订原插画A | 整景概念 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/scenes/night-market-v0.5-original.png` | PNG 2172×724 RGB | 历史稿，用户追加修订，未整版批准 | A/B表现比较 | 非分层生产图源 |
| CONCEPT-FIRST-STREET-05B | 第一街桥/牌匾修订轻像素B | 整景概念 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/scenes/night-market-v0.5-pixel.png` | PNG 2172×724 RGB | 历史稿，用户追加修订，未整版批准 | A/B表现比较 | 未锁生产像素网格/采样 |
| REF-FIRST-STREET-BRIDGE-02 | 桥近景参考 | 参考 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/references/bridge-reference.png` | PNG 466×377 RGB | 权利未知/研究用 | 石拱、两坡、支流通河 | 不直接裁用或临摹 |
| REF-FIRST-STREET-PLAQUE-02 | 牌匾参考 | 参考 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/references/plaque-reference.png` | PNG 2172×724 RGB | 权利未知/研究用 | 木框浅底类别横竖牌 | 不复制字形/角色/装饰 |
| ART-FIRST-STREET-DIRECTION-02 | 第一街双风格美术方向 | 版本文档 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/ART_DIRECTION.md` | Markdown | 历史稿，用户追加修订，未整版批准 | 八条原则延续 | B未自动替代原方向 |
| CONCEPT-FIRST-STREET-06A | 店宽/通路/地府装饰原插画A | 整景概念 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.3/scenes/night-market-v0.6-original.png` | PNG 2172×724 RGB | 历史加宽/像素稿，被用户退回 | A/B表现比较 | 实际3:1，不宣称实现请求4:1 |
| CONCEPT-FIRST-STREET-06B | 店宽/通路/地府装饰轻像素B | 整景概念 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.3/scenes/night-market-v0.6-pixel.png` | PNG 2172×724 RGB | 历史加宽/像素稿，被用户退回 | A/B表现比较 | 关键内容同布局，局部重绘 |
| ART-FIRST-STREET-DIRECTION-03 | 第一街追加范围美术方向 | 版本文档 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.3/ART_DIRECTION.md` | Markdown | 历史加宽/像素稿，被用户退回 | 八条原则延续 | 未锁生产网格/导出尺寸 |

拟生产模块与独有组件ID见[新单元ASSET_MANIFEST](../deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/ASSET_MANIFEST.md)及同版PARTS_PLAN。通用件维护同源母版，特殊身份独立。每动态骨骼对象附件一页，复用母版可导出副本；共图源、共图集、一次Draw Call不是同一个事实。独立单元与主体最终共用批准源、Prefab、配置与UI组件。


## 当前参考与新单元

| ID | 路径 | 实际规格 | 状态/范围 |
|---|---|---|---|
| REF_FIRST_STREET_SELECTED_V04 | deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png | PNG 2172×724 RGB | 用户精确选定未加宽非像素，参考不裁生产 |
| CONCEPT_MT_CHAR_V05 | deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/characters/mengtao-concept.png | PNG 1254² RGBA | USER_APPROVED全身概念，唯一腰牌孟；非生产分层 |
| CONCEPT_MT_SHOP_V05 | deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/scenes/milk-tea-shop-concept.png | PNG 1536×1024 RGBA | USER_APPROVED无人店身概念，半透明光晕须剥离 |
| CONCEPT_MT_REL_V05 | deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/scenes/mengtao-shop-relationship.png | PNG 1536×1024 RGB | USER_APPROVED关系概念，不能合图生产 |

正式独立对象、候选ID/挂点与前后层见[本轮生产前Manifest](../deliverables/art/UNIT-PILOT-ART-SOURCE-PREFLIGHT-001/v0.1/ASSET_MANIFEST.md)与PARTS_BOUNDING_PLAN；MT_CHAR_01/MT_SHOP_STATIC_01/MT_SHOP_MOTION_01尚无分层/骨骼/atlas文件。旧pilotv0.4当前入口被替换，历史保留；老Creator九示例尚未替换代码或资源。

## 新七菜单历史美术候选 v0.1

| ID | 图稿 | 实际规格 | 状态 |
|---|---|---|---|
| UC_BASE_CONCEPT_01 | deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/scenes/empty-scene-concept.png | RGB PNG 2172×724 | 历史候选，所属Art v0.1整体REJECTED；固定蓝远景与可切换绿柳仍须视觉区分 |
| UC_GHOST_BENCH_CONCEPT_01 | deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/characters/ghost-customer-concept.png | RGBA PNG 1536×1024 | 历史五态/独立空凳概念，所属Art v0.1整体REJECTED；不可裁作最终帧序列 |
| UC_ELEMENTS_CONCEPT_01 | deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/props/toggle-elements-concept.png | RGBA PNG 1536×1024 | 历史柳树/花草/灯候选，所属Art v0.1整体REJECTED；尚非可集成独立资产 |

拟独立UG_GHOST_01/BENCH_01/UE_TREE_01/UE_GRASS_01/UE_LANTERN_01与基础层的历史清单见[七菜单Manifest v0.1](../deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/ASSET_MANIFEST.md)。旧LAYER_OCCLUSION_PLAN/ATLAS_PREFLIGHT只保留追溯，幽灵骨骼方案被DEC-004覆盖；透明展示板有环境软晕，不能直接裁PNG作帧序列/Creator资源。

## 当前正式资源方向｜DEC-UNIT-FINAL-ASSET-004

[Product v0.2](../deliverables/product/UNIT-MENU-PRODUCT-001/v0.2/PRD.md)及 [Art v0.2 出图前资产清单](../deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.2/ASSET_MANIFEST.md)、Tech Lead、UI、VFX 各 v0.2 已于 2026-10-03 获 `USER_APPROVED`。这些是正式制作输入，不替代每批出图双签。幽灵/板凳 v0.1 当前已有真正源与导出，但 Creator 稳定资源 UUID、运行十格与目标机证据仍未建立。

| 对象/ID候选 | 当前制作方式 | 正式交付门槛 |
|---|---|---|
| UG_GHOST_01 | 一个原方向原创透明序列帧，另一方向水平翻转；不使用骨骼 | 原创可编辑逐帧源；需循环动作以每动作约4–6帧为预算起点；左右×五状态十格、首尾循环/节拍、原点/体量/透明边、板凳接触与遮挡；真实图集页数/材质/合批/内存签认 |
| BENCH_01 | 独立可复用静态道具/前后遮挡片候选 | 不烘进顾客帧，两向座点、进稳离及关闭板凳安全退出可检 |
| MT_CHAR_01、MT_SHOP_MOTION_01、UE_TREE_01、UE_GRASS_01、UE_LANTERN_01 | 动态对象继续骨骼，每对象附件单页 | 实际可编辑分件/骨骼源、极限pose包围盒、真实单页导出及Creator/目标设备证据 |
| MT_SHOP_STATIC_01与背景基础层 | 独立静态分层 | 材料/比例与已选风格一致；去除烘底环境软晕，灯影独立；背景不烘入可切换对象 |

除下表已存在的幽灵/板凳候选，其余 ID 仍是待生产索引，不从此表推断文件已存在。每次正式出图前 Art/Tech 联合核对原创来源、版权/IP与字体/工具许可、动作/镜像、像素尺寸/透明留白及图集/合批；缺许可不得生产集成。单元、组合与未来主体最终引用同一批准源/导出/资源版本，共用 UI/VFX；Lab 控制可独立。旧 v0.1 概念交付正文留档不改写。

## 当前真实出图候选｜UNIT-MENU-GHOST-ASSET-001 v0.1

| 对象 | 可编辑源与实际导出 | 当前状态与后续门禁 |
|---|---|---|
| `UG_GHOST_01` | [正式候选 Manifest](../deliverables/art/UNIT-MENU-GHOST-ASSET-001/v0.1/ASSET_MANIFEST.md)：右向 SVG 母版、23 张 `160×192` PNG、`1024×512` 单页图集与帧/哈希索引；左右预览 | 三轮出图前 Art/Tech 双签、出图后双专业及 Master Review 已通过；待用户审批。Creator 导入、目标机动态辨识、同源 UUID 与未来主体接入 `NOT_TESTED`。 |
| `BENCH_01` | 同版 SVG 母版、`256×128` 独立后/前片及组合预览，双向座点/角色接触锚点已记录 | 与幽灵同批 Art/Tech/Master Review 通过；待用户审批。Creator 前后层与两向坐姿接触 `NOT_TESTED`。 |

本批 1024×512 atlas 基础 RGBA8 为 2 MiB，不能据单页推断一次 DrawCall；详细来源、首轮退稿审计、权利与质量边界见同版 `RIGHTS_AND_SOURCE.md`、`QUALITY_REPORT.md`。正式 SpriteFrame/Prefab UUID 由 Client 在资源获用户批准后建立。

## 历史空底板候选｜UNIT-MENU-BASE-ASSET-001 v0.1 REV2

| 对象 | 可编辑源与实际导出 | 当前状态与后续门禁 |
|---|---|---|
| `STREET_BASE_01` 历史候选 | [历史 Manifest](../deliverables/art/UNIT-MENU-BASE-ASSET-001/v0.1/ASSET_MANIFEST.md)：3072×1024 SVG 母版、16 张独立 PNG / 42 placements、7 张竖屏审阅图、源/层哈希与真桥洞 alpha；RGBA8 基础 8.4375 MiB | 原版/REV1/REV2 出图过程保留追溯；Art/Tech 成品 Review 曾通过，但正式任务已取消，v0.2 审批状态为 `SUPERSEDED`。不作为示例1四层 Gate2 已批资源；Creator 拖缩与菜单 1/7 同 UUID 均 `NOT_TESTED`。 |

本批空景不烘奶茶店、人物、板凳、可切换树花灯、纸船蜡烛或暖 VFX。审阅合成全景不作为运行纹理；同源复用与 DrawCall 由后续 Creator/目标机实测，不按 16 图静态数量推断运行批次。
