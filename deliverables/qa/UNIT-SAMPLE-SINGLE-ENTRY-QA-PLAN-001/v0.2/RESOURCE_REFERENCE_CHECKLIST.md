# U01 资源引用与身份链检查清单 v0.2

本清单把 Tech `RESOURCE_REFERENCE_AUDIT.md` 的旧 UUID 和保留身份链转成后续执行核对项，并匹配 Client Brief `UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001 v0.2`（DRAFT，待批）的 Creator 两阶段属性顺序。此处记录的是待检清单，不代表资源已清理或 Creator 运行通过。引用范围应覆盖 `apps/client` 活动源码、场景、Prefab、构建入口及 Creator 导入检查；历史 Task、Review、Approval、交付和变更记录作为追溯资料排除在活动引用判定之外。

## Creator 序列化引用两阶段核验

1. 实施开始时记录代码/场景基线和 Creator 版本；确认 `UnitSampleGallery.ts` 的 Creator 可识别 `frames: SpriteFrame[]` property与旧消费者仍存在。
2. 先由 Creator Inspector 清空 `UnitSamples.scene` Gallery 序列化的21项旧 `frames` 值，以及旧场景节点/Prefab/TMX引用；由 Creator 保存、关闭并重开工程。逐项核对引用已清零、无 missing UUID、U01 Prefab引用完整。
3. 阶段一 Creator保存/重开核验通过后，才从代码移除 `frames` property和旧消费者。随后刷新/编译，并再次通过 Creator保存、关闭/重开；检查无 unknown property、missing UUID和残留旧引用。
4. 任一阶段无法打开、识别、保存或可靠核对即 `BLOCKED`，停止后续 property/消费者删除及资源清理；禁止手工编辑 `.scene` JSON或删除 `.meta` 掩盖问题。

两阶段分别记录 Creator版本、场景hash/diff、Inspector/Console结果和证据路径；静态 UUID扫描不能替代 Creator保存重开结果。

## 执行记录字段

每项填：检查项 ID、资源路径、实施前状态（含是否预存删除）、HEAD/基线状态、UUID/hash、活动引用位置、Creator 检查、实施后状态、删除或保留理由、证据路径、结论。不得只记录 `rg` 无命中：说明命令、搜索根目录、排除项和被检查的 Creator 场景/Prefab。历史文本命中须列出并分类，不当作运行引用；反之，发现任何活动引用或 Creator missing UUID 即阻断对应删除/通过结论。

## 退役引用目标

### 21 个旧 SpriteFrame UUID

| 序号 | SpriteFrame UUID | Tech 审计源路径 | 执行核对 |
|---:|---|---|---|
| 1 | `e6e8cfdd-daea-4a2b-b576-59c85b521916@f9941` | `apps/client/assets/demo/scenes/tile_ground.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 2 | `c38dcb77-2a95-4e15-8b8a-e1a64b3fb99f@f9941` | `apps/client/assets/demo/scenes/tile_stone_road.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 3 | `e34b835a-96bc-4f0c-837d-bcc1eb02439e@f9941` | `apps/client/assets/demo/scenes/tile_water.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 4 | `b8022828-48a5-4e3b-aa37-9cd453389eb7@f9941` | `apps/client/assets/demo/scenes/tile_shore.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 5 | `727c5454-5ce6-4180-ac31-574fe22aff82@f9941` | `apps/client/assets/demo/scenes/bridge_entry.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 6 | `098b994b-1716-480f-9537-98e85ef11499@f9941` | `apps/client/assets/demo/scenes/bridge_exit.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 7 | `d85d3ba5-6658-4ef0-b21d-118cc15a2b2a@f9941` | `apps/client/assets/demo/scenes/yama_palace.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 8 | `81d4b955-83f5-4829-97e2-1323ebd19f80@f9941` | `apps/client/assets/demo/props/stall_ruined.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 9 | `e266e6de-6054-48ce-a6c3-a4b86b617811@f9941` | `apps/client/assets/demo/props/stall_restored.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 10 | `ca7c5061-11f5-436c-b734-65ec50195181@f9941` | `apps/client/assets/demo/characters/keeper_ghost.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 11 | `e01a1aea-3bd8-45f2-baf5-553a3e7162da@f9941` | `apps/client/assets/demo/characters/guest_floating.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 12 | `9fb658f8-e78f-46e8-a49c-2e70762bc552@f9941` | `apps/client/assets/demo/characters/guest_floating_walk_01.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 13 | `98969c15-69c4-4e69-a361-6a887880a83b@f9941` | `apps/client/assets/demo/characters/guest_floating_walk_02.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 14 | `0a0d805b-7cd8-4af3-85a6-4eaf7b5c90ee@f9941` | `apps/client/assets/demo/characters/guest_horned_beast.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 15 | `510d8bb9-f8a1-45cf-a663-3bc4177cc63e@f9941` | `apps/client/assets/demo/characters/guest_horned_beast_walk_01.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 16 | `5b460a3e-28d6-4d3c-b722-ff1004bd44ae@f9941` | `apps/client/assets/demo/characters/guest_horned_beast_walk_02.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 17 | `7b30845f-bf3d-4765-8cc9-a75ab9818001@f9941` | `apps/client/assets/demo/characters/guest_paper_talisman.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 18 | `f399f40b-811d-4137-bb40-c0d2d980efeb@f9941` | `apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 19 | `11a3927b-08ab-4ccf-948e-422b7027e8c7@f9941` | `apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 20 | `2744955e-17e4-461e-b25e-ead20c2b04a4@f9941` | `apps/client/assets/demo/props/lantern_warm.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |
| 21 | `771100b0-ee9a-4a95-8a7e-fa82e3ac5c00@f9941` | `apps/client/assets/demo/props/shore_tree.png` | ☐ 场景/脚本/Prefab/Creator 无活动引用 |

### 旧 Prefab、TMX 和场景引用

当前Scene中有8个不同旧 Prefab主UUID命中和一个TMX主UUID。`Keeper.prefab` 是第9个旧 Prefab候选，Tech审计未发现当前Scene实例；它只在全仓活动路径/UUID扫描中单独检查，不计为当前Scene引用。

| 资源 | UUID | 清理前/后核对 |
|---|---|---|
| `apps/client/assets/demo/prefabs/EntryBridge.prefab` | `10562569-964f-4933-9484-f212e19e2f78` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/YamaPalace.prefab` | `9b4b7612-a6fe-419f-8cfa-288e6969b658` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/BackgroundStall.prefab` | `865446e5-cfcd-4aa0-9039-ab214a4339c1` | ☐ 多个场景实例逐个核对并解除 |
| `apps/client/assets/demo/prefabs/TargetStall.prefab` | `5cb2eae1-2d67-4e3a-ba2e-b77785be2c04` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/ExitBridge.prefab` | `9303d3e3-805e-4ec5-936c-529f5b68e0a9` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/GuestFloating.prefab` | `e8d7f5cb-a5b9-498f-90cf-9d0ef4e4ffa2` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/GuestHorned.prefab` | `addcbfd6-3c1f-4eaf-8814-e8b975430ba9` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab` | `927020ed-499a-4ffe-9e84-6b71a71e18c6` | ☐ 对应场景节点和所有序列化引用在删除前解除 |
| `apps/client/assets/demo/prefabs/Keeper.prefab` | `cf9128e5-3256-40d0-9411-1b648549868b` | ☐ HEAD 场景未列出实例；仍需检查 Gallery/脚本/其他 Prefab/构建引用后再判定 |
| `apps/client/assets/demo/tilemaps/NightMarket.tmx` | `3affc159-d837-4bb8-a030-4fb2df02b0e3` | ☐ TMX/节点引用在删除前解除 |
| `apps/client/assets/DemoScene.scene` | 对应 `.meta` 主 UUID（执行时取审计基线） | ☐ 场景不再作为运行/构建入口且无活动引用 |
| `apps/client/assets/UnitSamples.scene` | 保留场景；须保留 U01 Prefab 引用 | ☐ 删除旧节点、frames 数组和属性覆盖；保留唯一 U01 引用 |

逐项核对源 `.meta` 和目录 `.meta`，但不以 `.meta` 自身缺失/存在替代 Creator 引用检查。旧样例生成/校准工具、Gallery 旧分支、`apps/client/README.md` 及 `project/unit_tests/UNIT_SAMPLES_v0.1.md` 单列审查：确认调用链及说明用途；项目/历史说明按职责更新或留档，不能作为批量资源删除目标。

## U01 必须保留的身份链

以下值来自已批准 Tech 资源审计/项目登记；执行时再次从源文件、Creator 导入输出与登记核对。表中已知值是基线，目标路径实际存在及 Creator 可导入须另取执行证据。

| 稳定 ID | Creator 正式路径 | SHA-256 | 主 UUID | 子身份/依赖 |
|---|---|---|---|---|
| `STREET_BASE_01_L01` | `apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png` | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1` | `7108d512-5f6f-42d1-9411-c6f48de13939` | Texture `@6c48a`；SpriteFrame `@f9941` |
| `STREET_BASE_01_L02` | `apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png` | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478` | `c788f23d-127c-48a9-890c-36679d56dce4` | Texture `@6c48a`；SpriteFrame `@f9941` |
| `STREET_BASE_01_L03` | `apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png` | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d` | `8fae7865-9c46-46f6-8484-849ebe8a6634` | Texture `@6c48a`；SpriteFrame `@f9941` |
| `STREET_BASE_01_L04` | `apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png` | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b` | `685d480f-3b1a-4f77-b796-79b9ec5de834` | Texture `@6c48a`；SpriteFrame `@f9941` |
| `STREET_BASE_01` Prefab | `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab` | `2df15d9d1820f4ad9ebc408dc369f191c27157936cea3dab5e18d227a4038ed2` | `2d697fb3-01f0-4330-a180-a9c162310bf8` | 源 JSON/Creator import/Scene 引用；四个 SpriteFrame UUID |
| 镜头 Controller | `apps/client/assets/labs/menu/scene1_camera_controller.ts` | `69be28ea236795a1b840d0a294d05e88ae60b93c5d255a68f563bfe8f9a4b400` | `9ceb8fd6-3853-4688-aeb0-c736616a614e` | `.meta` TypeScript 主 UUID；UnitSamples/Gallery 活调用 |

保留资源执行逐项核验：源 SHA 与登记一致；`.meta`主 UUID与表一致；PNG子 UUID字段与相应 Creator 导入条目一致；PNG trim=`none`、画布及 offset 与批准资产规格一致；Prefab UUID及四个 SpriteFrame依赖不变；Controller UUID和组件/脚本引用不变；更新登记由其 Owner 执行并保留历史值。Creator 刷新/重导入、场景解析和运行均需独立记录，静态匹配不能代替这些结果。

## 文件分类结论栏

| 类别 | 文件范围 | 判据与处置 |
|---|---|---|
| 旧运行资产候选 | DemoScene、`assets/demo/**` PNG/Prefab/TMX及相应 `.meta` | 先解除场景、Gallery、Prefab、构建引用；证明仅供旧九项后才删除。Tech 审计记载的预存删除需按基线复核。 |
| U01保留 | 四层 PNG、Prefab、Controller、UnitSamples 场景所需引用及身份 `.meta` | 哈希/UUID/依赖一致并通过 Creator 导入与 Web 运行证据。 |
| 共享/环境 | 活动目录元数据、Creator项目设置及 Library/缓存 | 不按目录名批删；变更需给出项目范围和 Creator 证据。 |
| 历史/审批 | Tasks、Deliverables、Reviews、Approvals、变更/历史说明、七项正式产品资料 | 保留并按历史职责核对，不参与活动运行引用清零判定。 |
| 工具与说明 | DemoScene/TMX工具、README、UnitSamples历史指南 | 分别确认活动调用/文档现行性，由 Client 或文件 Owner 更新/退役；不把历史字符串命中当作运行依赖。 |

任何资产归属不明、Creator 仍要求资源或有未解释活动命中时，结论为阻塞并保留该资源；不以猜测补齐登记或删除依据。
