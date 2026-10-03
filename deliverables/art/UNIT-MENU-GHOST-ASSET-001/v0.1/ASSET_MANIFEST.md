# UG_GHOST_01 与 BENCH_01｜正式候选资源清单 v0.1

任务 `UNIT-MENU-GHOST-ASSET-001`；2026-10-03。状态：**Art/Tech 输出评审已通过，待 Master/用户审批的正式资源候选**。本批可编辑源、真实导出与预览已存在；Creator 3.8.8 导入、目标设备及未来主体同源接入尚未进行，不能标为 `INTEGRABLE` 或整个七菜单完成。

| 资产 ID | 资源与实际文件 | 尺寸、用途、状态 |
|---|---|---|
| `UG_GHOST_01` | `source/ghost_master.svg`；`tools/export_assets.js`；`frames/move_00..05.png`、`run_00..05.png`、`happy_00..02.png`、`sad_00..02.png`、`sit_00..04.png`；`frames/FRAME_MANIFEST.json`；`sprites/ghost_atlas.png` / `.json` | 原创右向 23 张，每张 `160×192` RGBA 逻辑画布；左向镜像同源显示节点。Atlas 实际 `1024×512`、**1 页**、4px padding，RGBA8 基础 `2,097,152 B`。菜单 3B 与 7 计划共用同一对象和动画身份；Art/Tech 已评审，待用户审批和 Client 实际接入。 |
| `BENCH_01` | `source/bench_master.svg`；`sprites/bench_back.png`、`bench_front.png`（实际前后片）；`bench.png`（组合预览） | 独立道具，三张导出各 `256×128` 透明 PNG；预设右向座点 `(76,56)`、左向座点 `(180,56)`、板凳落脚 `(128,114)`。菜单 3B 与 7 共用；待实际 Creator 前后层/两向接触复验。 |
| 视觉审阅 | `preview/contact_sheet.png`、`preview/frame_sheet.png`、`preview/loop_preview.gif` | 十格左右关键姿态、23 帧全表和 23 页 GIF 预览。仅供 Art/Tech/用户审核，**不是**运行时纹理或目标机测试录像。 |
| 审计 | `audit/round0/`、`audit/round1/` | 首轮正面脸未通过与第二轮修订后 1024² atlas 的冻结原件；最终当前输出为第三轮 1024×512。不得把早期图导入游戏。 |

## 稳定身份与哈希

| 文件 | SHA256 |
|---|---|
| `source/ghost_master.svg` | `9f160728f28827f83aaa1ae6929a923c35a3c3805ecbaf8c6c37a8d0d488c972` |
| `source/bench_master.svg` | `4630f39bebb659ff0083480abd0feae4377470ef29c57ebda3afb4581796401a` |
| `tools/export_assets.js` | `7fd3acff1f6ed2f5cd09933a69cc43492337d8a20d97956bbc09481d320b52a0` |
| `sprites/ghost_atlas.png` | `1b897c97ea73183162606d13a4a8b6eab56ffd09968cfb533e8d8360c75a1983` |
| `sprites/bench.png` | `1f032a80fd6f47a75826232f07e2bfd19a7e71f47c502a01bdedfc9ff4a2a2ba` |
| `sprites/bench_back.png` / `bench_front.png` | 分别为 `e767e7bb36815adf58b3e6fbb2d2b4b54edc1e49fada2262f7d5fb394e7b5976` / `4d1137423fc4c123c19b5664b90e2099e616cf155ae7304322a05e8883f27aa3` |

逐帧 SHA256、atlas rect、裁切偏移、原点、预览节拍见 `frames/FRAME_MANIFEST.json`；不在本清单复制 23 行以免产生第二份事实源。可用 `tools/verify_assets.js` 复核实际文件。运行时应读取 `ghost_atlas.png` 与其索引，不要同时把 23 张源 PNG 加载为额外纹理；板凳运行时使用后/前片，组合 `bench.png` 只作审阅。Creator SpriteFrame `.meta` UUID、Prefab 与双入口依赖尚待后续 Client 建立，不用当前文件名冒充已建立引用。
