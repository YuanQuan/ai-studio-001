# STREET_BASE_01｜正式空底板资源清单 v0.1 REV2

本批为菜单 1 空场景和菜单 7 组合场景的**同一底板源 ID**：`STREET_BASE_01`。它是供后续 Creator 引用的引擎中立分层资产，尚未创建 Creator UUID/Prefab，也未获得本批用户审批。审阅全景 `preview/empty_scene.png` 由实际分层 PNG 和清单 placement 重新合成，**不是运行时要额外加载的大贴图**。

## 真实文件与规模

可编辑母版 [`source/street_base_master.svg`](source/street_base_master.svg)，逐模块导出脚本 [`tools/export_layers.js`](tools/export_layers.js)，静态复核脚本 [`tools/verify_layers.js`](tools/verify_layers.js)。运行源为 [`layers/LAYER_MANIFEST.json`](layers/LAYER_MANIFEST.json) 中的 **16 张透明/不透明 PNG**，共 **42 个 world placement**；世界画布 `3072×1024`，左上为原点；单纹理最大边 `1024`。全部运行纹理 RGBA8 基础像素数 `2,211,840`，基础量 `8,847,360 B = 8.4375 MiB`。PNG 磁盘大小、解码临时量、mipmap、压缩格式、目标机显存和 DrawCall 不等于此基础量，均待 Client/Tech/QA 实测。

| 语义层（后到前） | PNG / 原生尺寸 | 放置/复用与插层 |
|---|---|---|
| `UB_SKY` | `sky_gradient` 32×1024、`moon` 128×128、`cloud_a/b` 各 512×192 | 全高不透明夜色延展全世界；月和四片低透明云独立放置。 |
| `UB_DISTANCE` | `distance_a/b/c` 各 1024×320 | 三块分段远山，含同纹理中远山与柔雾；无可切换树或商铺。 |
| `UB_WATER` | `water_river` 512×192、`water_branch` 384×256 | 前河六次复用，中央支流 x1344..1728、y640..896，与前河 y832..1024 重叠；桥洞透出水层。 |
| `UB_BANK` | `bank` 512×96 | 桥口两侧岸墙复用，靠桥/世界边的 256 宽截片以 `sourceRect` 对齐。 |
| `UB_GROUND` | `ground_full` 512×320、`ground_half` 256×320 | 左右铺地复用，x1280..1792 不放地面以留中央水口；桥两端接入 x1280/1792。 |
| `UB_BRIDGE_BACK` | `bridge_back` 512×384 | 世界 x1280,y410；独立步行坡/石拱后片，中央真实 alpha 洞；顾客层在其后/前片之间由 Client 安排。 |
| `UB_RAIL_BACK` | `rail_back` 512×96 | 街后侧断栏，不跨中央桥口；按完整/半段复用。 |
| `UB_BRIDGE_FRONT` | `bridge_front` 512×384 | 世界 x1280,y410；独立前栏/拱沿，可与未来顾客产生前遮挡。 |
| `UB_RAIL_FRONT` | `rail_front` 512×96 | 靠河侧断栏，前景遮挡片；板凳、桌椅未来单独加在其附近，不烘入底板。 |

上述 order 在实际 JSON 为 `0..11` 的具体模块顺序，world placement、`sourceRect`、左上 anchor、逐 PNG alpha bbox 与 SHA-256 一律以 JSON 的实际导出值为准。当前右向幽灵、独立板凳和后续店铺/树花灯都不能复制进空底板；组合入口应引用**同一 `STREET_BASE_01` 源/Prefab**，运行 UUID 由 Client 落地再验。

## 审阅图与边界

`preview/empty_scene.png` 为 3072×1024 实际纹理合成；`preview/layer_occlusion.png` 标注桥、前后栏与支流水口；`preview/viewport_min_left|min_center|min_right.png` 是 1.25 缩放的左/中/右裁图；`viewport_init_center|init_west|init_east.png` 是 1.35 候选初始/观察点；`viewport_max_center.png` 为 1.8 中心裁图。七图均 720×1280，均无透明边。菜单 1 与 7 共用 reset 中心 x1536；由于竖屏当前可见世界宽约 533，组合入口新增两侧店/精灵时需 Client 提供视点定位/拖动可达，西东裁图仅是镜头审阅建议，不是已批准的新 UI 交互。

`QA_STATIC.json` 的 `PASS_STATIC_CHECKS_ONLY` 只覆盖真实文件尺寸/哈希/alpha/水口/预览。Creator 3.8.8 导入、设备纹理上限/实际内存/批次、桥上顾客遮挡、镜头拖缩和主游戏同源使用仍 `NOT_TESTED`。
