# 资源引用审计 v0.1

Task：`UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001`。审计开始：2026-10-06 12:58:58 +08:00。状态：静态审计已完成；Creator 导入、构建和运行均 `NOT_TESTED`。审计起止12:58:58–13:03:46 +08:00，耗时4分48秒。

## 已确认的工作区基线（审计开始证据）

产品范围 `UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2` 的 `tasks/.../ARTIFACT_APPROVAL.json` 为 `USER_APPROVED`。产品批准允许启动技术清理方案，不授权本 Task 改场景或删除资源。

审计开始时 `git status --short` 已显示以下旧资源删除及客户端差异，均为本 Task 之前的工作区状态：

- `D`：`apps/client/assets/DemoScene.scene`、`.meta`、`assets/demo.meta`、`assets/demo/**` 下的角色/道具/场景 PNG、Prefab、TMX 及各 `.meta`。
- `M`：`apps/client/assets/UnitSamples.scene`、`UnitSampleGallery.ts`、`labs/menu/scene1_camera_controller.ts`、Creator `settings/v2/packages/information.json`；场景虽为既有修改，当前仍序列化21个旧frames UUID及旧Prefab UUID，另有既有技术交付/登记/流程文件改动。
- `??`：`apps/client/assets/units/background/prefabs/` 与 Creator package 文件；上述新增文件不是由本 Task 创建。
- `git ls-files` 仍枚举所有 `D` 路径，故这些路径在 HEAD 中有版本化内容，但工作树实体已缺失。以下引用分析按 `HEAD` 场景和 `.meta` 读取身份，按当前工作树判定资源存在状态。

## 已先核实：21 个旧 SpriteFrame 序列化引用

当前工作树的 `apps/client/assets/UnitSamples.scene` 可解析为129个对象；第3582行的Gallery `frames` 数组含21项 `cc.SpriteFrame` 引用，逐个UUID对上 `HEAD` 中旧 `assets/demo/**/*.png.meta`。`git show HEAD:...` 基线是153个对象，包含更多旧Prefab节点。当前工作树 `apps/client/assets/UnitSamples.scene` 在第3582行仍包含 `frames` 数组，第3584行起仍序列化全部21项旧 `cc.SpriteFrame` UUID；`streetBasePrefab` 在第3668行。旧引用尚未移除。后续正式清理必须先在 Creator 场景中解除21帧、对应旧节点/Prefab实例和脚本属性，再删除依赖文件。本 Task 不改场景或删资源。

|旧帧序号|历史 SpriteFrame UUID|HEAD 中匹配资源路径|
|---:|---|---|
|1|`e6e8cfdd-daea-4a2b-b576-59c85b521916@f9941`|`apps/client/assets/demo/scenes/tile_ground.png`|
|2|`c38dcb77-2a95-4e15-8b8a-e1a64b3fb99f@f9941`|`apps/client/assets/demo/scenes/tile_stone_road.png`|
|3|`e34b835a-96bc-4f0c-837d-bcc1eb02439e@f9941`|`apps/client/assets/demo/scenes/tile_water.png`|
|4|`b8022828-48a5-4e3b-aa37-9cd453389eb7@f9941`|`apps/client/assets/demo/scenes/tile_shore.png`|
|5|`727c5454-5ce6-4180-ac31-574fe22aff82@f9941`|`apps/client/assets/demo/scenes/bridge_entry.png`|
|6|`098b994b-1716-480f-9537-98e85ef11499@f9941`|`apps/client/assets/demo/scenes/bridge_exit.png`|
|7|`d85d3ba5-6658-4ef0-b21d-118cc15a2b2a@f9941`|`apps/client/assets/demo/scenes/yama_palace.png`|
|8|`81d4b955-83f5-4829-97e2-1323ebd19f80@f9941`|`apps/client/assets/demo/props/stall_ruined.png`|
|9|`e266e6de-6054-48ce-a6c3-a4b86b617811@f9941`|`apps/client/assets/demo/props/stall_restored.png`|
|10|`ca7c5061-11f5-436c-b734-65ec50195181@f9941`|`apps/client/assets/demo/characters/keeper_ghost.png`|
|11|`e01a1aea-3bd8-45f2-baf5-553a3e7162da@f9941`|`apps/client/assets/demo/characters/guest_floating.png`|
|12|`9fb658f8-e78f-46e8-a49c-2e70762bc552@f9941`|`apps/client/assets/demo/characters/guest_floating_walk_01.png`|
|13|`98969c15-69c4-4e69-a361-6a887880a83b@f9941`|`apps/client/assets/demo/characters/guest_floating_walk_02.png`|
|14|`0a0d805b-7cd8-4af3-85a6-4eaf7b5c90ee@f9941`|`apps/client/assets/demo/characters/guest_horned_beast.png`|
|15|`510d8bb9-f8a1-45cf-a663-3bc4177cc63e@f9941`|`apps/client/assets/demo/characters/guest_horned_beast_walk_01.png`|
|16|`5b460a3e-28d6-4d3c-b722-ff1004bd44ae@f9941`|`apps/client/assets/demo/characters/guest_horned_beast_walk_02.png`|
|17|`7b30845f-bf3d-4765-8cc9-a75ab9818001@f9941`|`apps/client/assets/demo/characters/guest_paper_talisman.png`|
|18|`f399f40b-811d-4137-bb40-c0d2d980efeb@f9941`|`apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png`|
|19|`11a3927b-08ab-4ccf-948e-422b7027e8c7@f9941`|`apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png`|
|20|`2744955e-17e4-461e-b25e-ead20c2b04a4@f9941`|`apps/client/assets/demo/props/lantern_warm.png`|
|21|`771100b0-ee9a-4a95-8a7e-fa82e3ac5c00@f9941`|`apps/client/assets/demo/props/shore_tree.png`|

## 逐路径旧资源盘点

下表资源状态统一为审计开始时工作树。每一源资源旁的 `.meta` 都是 Creator 身份文件，不能独立作为“已验证可删”证据；目录 `.meta` 同理。旧 `UnitSamples.scene` 的帧引用位置见上表，Prefab 引用位置及每项 path/UUID 交叉引用仍在本轮剩余审计中补充。所有 demo 运行资源先归为“旧样例专属候选，删除前置条件是移除并复核引用”，不得在本技术 Task 内删除。

- `apps/client/assets/demo/characters.meta` — `D apps/client/assets/demo/characters.meta`
- `apps/client/assets/demo/characters/guest_floating.png` — `D apps/client/assets/demo/characters/guest_floating.png`
- `apps/client/assets/demo/characters/guest_floating.png.meta` — `D apps/client/assets/demo/characters/guest_floating.png.meta`
- `apps/client/assets/demo/characters/guest_floating_walk_01.png` — `D apps/client/assets/demo/characters/guest_floating_walk_01.png`
- `apps/client/assets/demo/characters/guest_floating_walk_01.png.meta` — `D apps/client/assets/demo/characters/guest_floating_walk_01.png.meta`
- `apps/client/assets/demo/characters/guest_floating_walk_02.png` — `D apps/client/assets/demo/characters/guest_floating_walk_02.png`
- `apps/client/assets/demo/characters/guest_floating_walk_02.png.meta` — `D apps/client/assets/demo/characters/guest_floating_walk_02.png.meta`
- `apps/client/assets/demo/characters/guest_horned_beast.png` — `D apps/client/assets/demo/characters/guest_horned_beast.png`
- `apps/client/assets/demo/characters/guest_horned_beast.png.meta` — `D apps/client/assets/demo/characters/guest_horned_beast.png.meta`
- `apps/client/assets/demo/characters/guest_horned_beast_walk_01.png` — `D apps/client/assets/demo/characters/guest_horned_beast_walk_01.png`
- `apps/client/assets/demo/characters/guest_horned_beast_walk_01.png.meta` — `D apps/client/assets/demo/characters/guest_horned_beast_walk_01.png.meta`
- `apps/client/assets/demo/characters/guest_horned_beast_walk_02.png` — `D apps/client/assets/demo/characters/guest_horned_beast_walk_02.png`
- `apps/client/assets/demo/characters/guest_horned_beast_walk_02.png.meta` — `D apps/client/assets/demo/characters/guest_horned_beast_walk_02.png.meta`
- `apps/client/assets/demo/characters/guest_paper_talisman.png` — `D apps/client/assets/demo/characters/guest_paper_talisman.png`
- `apps/client/assets/demo/characters/guest_paper_talisman.png.meta` — `D apps/client/assets/demo/characters/guest_paper_talisman.png.meta`
- `apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png` — `D apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png`
- `apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png.meta` — `D apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png.meta`
- `apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png` — `D apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png`
- `apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png.meta` — `D apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png.meta`
- `apps/client/assets/demo/characters/keeper_ghost.png` — `D apps/client/assets/demo/characters/keeper_ghost.png`
- `apps/client/assets/demo/characters/keeper_ghost.png.meta` — `D apps/client/assets/demo/characters/keeper_ghost.png.meta`
- `apps/client/assets/demo/prefabs.meta` — `D apps/client/assets/demo/prefabs.meta`
- `apps/client/assets/demo/prefabs/BackgroundStall.prefab` — `D apps/client/assets/demo/prefabs/BackgroundStall.prefab`
- `apps/client/assets/demo/prefabs/BackgroundStall.prefab.meta` — `D apps/client/assets/demo/prefabs/BackgroundStall.prefab.meta`
- `apps/client/assets/demo/prefabs/EntryBridge.prefab` — `D apps/client/assets/demo/prefabs/EntryBridge.prefab`
- `apps/client/assets/demo/prefabs/EntryBridge.prefab.meta` — `D apps/client/assets/demo/prefabs/EntryBridge.prefab.meta`
- `apps/client/assets/demo/prefabs/ExitBridge.prefab` — `D apps/client/assets/demo/prefabs/ExitBridge.prefab`
- `apps/client/assets/demo/prefabs/ExitBridge.prefab.meta` — `D apps/client/assets/demo/prefabs/ExitBridge.prefab.meta`
- `apps/client/assets/demo/prefabs/GuestFloating.prefab` — `D apps/client/assets/demo/prefabs/GuestFloating.prefab`
- `apps/client/assets/demo/prefabs/GuestFloating.prefab.meta` — `D apps/client/assets/demo/prefabs/GuestFloating.prefab.meta`
- `apps/client/assets/demo/prefabs/GuestHorned.prefab` — `D apps/client/assets/demo/prefabs/GuestHorned.prefab`
- `apps/client/assets/demo/prefabs/GuestHorned.prefab.meta` — `D apps/client/assets/demo/prefabs/GuestHorned.prefab.meta`
- `apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab` — `D apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab`
- `apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab.meta` — `D apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab.meta`
- `apps/client/assets/demo/prefabs/Keeper.prefab` — `D apps/client/assets/demo/prefabs/Keeper.prefab`
- `apps/client/assets/demo/prefabs/Keeper.prefab.meta` — `D apps/client/assets/demo/prefabs/Keeper.prefab.meta`
- `apps/client/assets/demo/prefabs/TargetStall.prefab` — `D apps/client/assets/demo/prefabs/TargetStall.prefab`
- `apps/client/assets/demo/prefabs/TargetStall.prefab.meta` — `D apps/client/assets/demo/prefabs/TargetStall.prefab.meta`
- `apps/client/assets/demo/prefabs/YamaPalace.prefab` — `D apps/client/assets/demo/prefabs/YamaPalace.prefab`
- `apps/client/assets/demo/prefabs/YamaPalace.prefab.meta` — `D apps/client/assets/demo/prefabs/YamaPalace.prefab.meta`
- `apps/client/assets/demo/props.meta` — `D apps/client/assets/demo/props.meta`
- `apps/client/assets/demo/props/lantern_warm.png` — `D apps/client/assets/demo/props/lantern_warm.png`
- `apps/client/assets/demo/props/lantern_warm.png.meta` — `D apps/client/assets/demo/props/lantern_warm.png.meta`
- `apps/client/assets/demo/props/shore_tree.png` — `D apps/client/assets/demo/props/shore_tree.png`
- `apps/client/assets/demo/props/shore_tree.png.meta` — `D apps/client/assets/demo/props/shore_tree.png.meta`
- `apps/client/assets/demo/props/stall_restored.png` — `D apps/client/assets/demo/props/stall_restored.png`
- `apps/client/assets/demo/props/stall_restored.png.meta` — `D apps/client/assets/demo/props/stall_restored.png.meta`
- `apps/client/assets/demo/props/stall_ruined.png` — `D apps/client/assets/demo/props/stall_ruined.png`
- `apps/client/assets/demo/props/stall_ruined.png.meta` — `D apps/client/assets/demo/props/stall_ruined.png.meta`
- `apps/client/assets/demo/scenes.meta` — `D apps/client/assets/demo/scenes.meta`
- `apps/client/assets/demo/scenes/bridge_entry.png` — `D apps/client/assets/demo/scenes/bridge_entry.png`
- `apps/client/assets/demo/scenes/bridge_entry.png.meta` — `D apps/client/assets/demo/scenes/bridge_entry.png.meta`
- `apps/client/assets/demo/scenes/bridge_exit.png` — `D apps/client/assets/demo/scenes/bridge_exit.png`
- `apps/client/assets/demo/scenes/bridge_exit.png.meta` — `D apps/client/assets/demo/scenes/bridge_exit.png.meta`
- `apps/client/assets/demo/scenes/tile_ground.png` — `D apps/client/assets/demo/scenes/tile_ground.png`
- `apps/client/assets/demo/scenes/tile_ground.png.meta` — `D apps/client/assets/demo/scenes/tile_ground.png.meta`
- `apps/client/assets/demo/scenes/tile_shore.png` — `D apps/client/assets/demo/scenes/tile_shore.png`
- `apps/client/assets/demo/scenes/tile_shore.png.meta` — `D apps/client/assets/demo/scenes/tile_shore.png.meta`
- `apps/client/assets/demo/scenes/tile_stone_road.png` — `D apps/client/assets/demo/scenes/tile_stone_road.png`
- `apps/client/assets/demo/scenes/tile_stone_road.png.meta` — `D apps/client/assets/demo/scenes/tile_stone_road.png.meta`
- `apps/client/assets/demo/scenes/tile_water.png` — `D apps/client/assets/demo/scenes/tile_water.png`
- `apps/client/assets/demo/scenes/tile_water.png.meta` — `D apps/client/assets/demo/scenes/tile_water.png.meta`
- `apps/client/assets/demo/scenes/yama_palace.png` — `D apps/client/assets/demo/scenes/yama_palace.png`
- `apps/client/assets/demo/scenes/yama_palace.png.meta` — `D apps/client/assets/demo/scenes/yama_palace.png.meta`
- `apps/client/assets/demo/tilemaps.meta` — `D apps/client/assets/demo/tilemaps.meta`
- `apps/client/assets/demo/tilemaps/NightMarket.tmx` — `D apps/client/assets/demo/tilemaps/NightMarket.tmx`
- `apps/client/assets/demo/tilemaps/NightMarket.tmx.meta` — `D apps/client/assets/demo/tilemaps/NightMarket.tmx.meta`

### 场景旧节点与 Prefab UUID

以 `git show HEAD:apps/client/assets/UnitSamples.scene` 的 153 个 Creator 对象为对照，脚本解析每个对象序列化内容并匹配 `HEAD` demo `.meta` 的 UUID，发现旧 Prefab 实例/引用如下（同一 UUID 多次出现表示场景含多处对应组件/覆盖引用）：

|路径|UUID|场景对象索引/证据|状态|
|---|---|---|---|
|`apps/client/assets/demo/prefabs/EntryBridge.prefab`|`10562569-964f-4933-9484-f212e19e2f78`|17|工作区已删除；需先移除 EntryBridge 节点和序列化引用|
|`apps/client/assets/demo/prefabs/YamaPalace.prefab`|`9b4b7612-a6fe-419f-8cfa-288e6969b658`|25|已删除；需先移除 Palace 节点/引用|
|`apps/client/assets/demo/prefabs/BackgroundStall.prefab`|`865446e5-cfcd-4aa0-9039-ab214a4339c1`|36、47、55、63、86|已删除；对应多个背景摊位实例|
|`apps/client/assets/demo/prefabs/TargetStall.prefab`|`5cb2eae1-2d67-4e3a-ba2e-b77785be2c04`|78|已删除；需移除目标摊位实例|
|`apps/client/assets/demo/prefabs/ExitBridge.prefab`|`9303d3e3-805e-4ec5-936c-529f5b68e0a9`|97|已删除；需移除 ExitBridge 节点/引用|
|`apps/client/assets/demo/prefabs/GuestFloating.prefab`|`e8d7f5cb-a5b9-498f-90cf-9d0ef4e4ffa2`|116|已删除；需移除顾客实例|
|`apps/client/assets/demo/prefabs/GuestHorned.prefab`|`addcbfd6-3c1f-4eaf-8814-e8b975430ba9`|124|已删除；需移除顾客实例|
|`apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab`|`927020ed-499a-4ffe-9e84-6b71a71e18c6`|132|已删除；需移除顾客实例|

HEAD 场景对象索引 11 引用 TMX 主 UUID `3affc159-d837-4bb8-a030-4fb2df02b0e3`，来源 `apps/client/assets/demo/tilemaps/NightMarket.tmx.meta`（当前工作区同样删除）。以上与 21 帧合计确证 30 项“资源 UUID × 场景对象”引用关系；其余帧 UUID 在 gallery 所有帧集合对象 152 再各命中一次，为验证序列化帧集合，与前述21项相同资产，不构成额外资产种类。

## 引用检索范围和结果

- `apps/client/assets/UnitSamples.scene`（工作版）：第3582行仍有 `frames` 数组、第3584行起仍有21个旧 SpriteFrame UUID，另有 `GuestFloating_Example` 等旧节点文字/Prefab UUID；`streetBasePrefab` 在第3668行，真实序列化 UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`。旧资源残留须由 Client 逐项清除，并且不得触碰新 Prefab 引用。
- `apps/client/assets/UnitSampleGallery.ts`：仍定义 U01–U09 菜单和 `UnitId` 0..10、旧交互分支、21帧 `frames` 属性、旧多单元文案（含“四方向与特效目前采用机制占位...”）；U10 分支实例化共享 Prefab。`scene1_camera_controller` 的 import 是保留依赖。
- `apps/client/README.md`：仍描述 DemoScene、assets/demo、九个 Prefab/TMX 及 U01–U09 实验，需在后续 Client 任务更新为唯一 U01事实；它是可维护说明，不是应随资产删除的运行资源。
- `apps/client/tools/attach-tiledmap.mjs`、`build-tilemap.mjs`、`build-static-scene.mjs`、`calibrate-static-scene.mjs` 均只针对已退役 DemoScene/NightMarket；`create-unit-samples-scene.mjs` 依赖 DemoScene 和21帧旧PNG，用于一次性迁移构建。它们是“旧演示专用实现/开发工具”候选，需 Client 在实施任务中确认无当前构建调用或开发用途后再删除，未查到 package script 主动调用（`apps/client/package.json`/根配置的完整调用链需Client复核）。
- `project/unit_tests/UNIT_SAMPLES_v0.1.md` 描述旧U01–U09和 assets/demo 21帧，是运行说明候选，应在本任务后由负责该文档的 Master/Producer 决定迁移到历史档案或标注退役；此路径不属于运行资产。旧任务、验收与审批记录全部历史保留。
- 仓库范围静态 `rg` 排除 `deliverables/`、`tasks/`、`.git/` 和 Cocos `Library/` 后，命中旧 DemoScene/demo 运行路径的活引用集中在 `apps/client` README、tools、UnitSampleGallery、UnitSamples 场景；没有查到 Server/API/构建目标清单对 demo 资产的独立依赖。项目文档/历史交付中大量 U01–U09 字样属于留档，不应按字符串命中清除。
- Creator 构建配置及场景入口还需 Client 在Creator中核：`apps/client/settings/v2/packages/information.json` 当前为既有修改；构建任务、startScene和Web预览现状未从Creator界面验证，均 `NOT_TESTED`。不能以 `rg` 未命中推定 Creator 构建依赖已清空。

## U01 必须保留的真实身份链

|稳定ID|正式路径|SHA-256|Creator主 UUID|Creator子身份/检查|
|---|---|---|---|---|
|`STREET_BASE_01_L01`|`apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png`|`fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1`|`7108d512-5f6f-42d1-9411-c6f48de13939`|Texture `@6c48a` / SpriteFrame `@f9941`|
|`STREET_BASE_01_L02`|`apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png`|`3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478`|`c788f23d-127c-48a9-890c-36679d56dce4`|Texture `@6c48a` / SpriteFrame `@f9941`|
|`STREET_BASE_01_L03`|`apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png`|`af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d`|`8fae7865-9c46-46f6-8484-849ebe8a6634`|Texture `@6c48a` / SpriteFrame `@f9941`|
|`STREET_BASE_01_L04`|`apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png`|`8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b`|`685d480f-3b1a-4f77-b796-79b9ec5de834`|Texture `@6c48a` / SpriteFrame `@f9941`|
|`STREET_BASE_01` Prefab|`apps/client/assets/units/background/prefabs/pf_street_base_01.prefab`|`2df15d9d1820f4ad9ebc408dc369f191c27157936cea3dab5e18d227a4038ed2`|`2d697fb3-01f0-4330-a180-a9c162310bf8`|四层 SpriteFrame UUID 已写入源 JSON，Prefab UUID在工作版 `UnitSamples.scene` 引用|
|镜头 Controller|`apps/client/assets/labs/menu/scene1_camera_controller.ts`|`69be28ea236795a1b840d0a294d05e88ae60b93c5d255a68f563bfe8f9a4b400`|`9ceb8fd6-3853-4688-aeb0-c736616a614e`|`.ts.meta` importer=typescript，imported=true|

四 PNG 的 SHA-256 与 `project/ASSET_HANDOFF_REGISTRY.md` 已登记值相同。四张当前 `.meta` 中 `trimType=none`，SpriteFrame 子 UUID均为 `<主UUID>@f9941`，尺寸与原尺寸均 `2172×724`，offset `(0,0)`；Prefab JSON 中逐层引用四个 SpriteFrame 子 UUID。素材/Prefab/脚本均存在于工作树。实际 Creator Library 再导入结果、Prefab 被运行时实例化成功、画面/输入与目标平台构建尚未于本任务验证，状态 `NOT_TESTED`。

## 后续清理顺序（给 Client 实施任务）

1. Client 先留存实施前 `git status` 快照并在 Creator 中打开当前 UnitSamples.scene，逐一核对当前已删除旧 UUID导致的missing asset条目；修复方案先从Gallery移除旧数组属性和U01–U09生成分支，再清空场景中旧演示容器/根节点、21个frames成员、Prefabs实例和引用属性，保留唯一 U01流程、`streetBasePrefab`、四层/Controller引用。不能先恢复或删身份 `.meta` 来压住missing提示。
2. 保存Creator场景，关闭/重开工程再检查 scene 中 21项frames与任何节点Prefab UUID均不再指向待删名单；Creator Console不再报这些 assets 的missing UUID。保留Prefab与四层SpriteFrame引用并核hash/UUID一致。
3. 删除仅由旧U01–U09依赖的运行图片、Prefab、TMX、DemoScene及其 `.meta`、目录 `.meta`；逐路径以表中枚举和引用检索复查。开发脚本/README按上节分别更新或删除。若发现新引用、Creator需要该资产或归属不明，该条转为BLOCKED并保留。
4. Creator刷新/重导入，检查四PNG和Prefab主/子UUID不漂移；打开保存后的 UnitSamples 场景、构建 Web Mobile并运行唯一U01，验证菜单与返回/重入、拖动/缩放/重置，检查控制台错误。QA矩阵、设备性能等按独立获批QA计划执行，不能以本技术方案替代。
5. 运行全仓路径/UUID扫描，再运行适用的静态检查。将每项文件实际删改结果和运行证据回填新版本资源登记，由其Owner执行；不覆盖该登记的历史值。

## 分类与阻塞

- **工作区已经删除**：`git ls-files apps/client/assets/demo/**` 当前全部显示为 tracked 路径；本审计检索时资源及 `.meta` 实体已缺失。这既是重要预存差异，也导致当前 Creator 缺失引用检查不可作为清理完成证明。
- **旧样例专属删除候选**：`DemoScene.scene/.meta`、`assets/demo/`目录下旧 scene/props/characters PNG、旧 Prefab、TMX及对应资产/目录 `.meta`；另含上述只服务DemoScene的生成/校准脚本（需Client排除任何活动调用）。必须按前序解除scene/脚本引用后再删，已有工作区删除只能在Client Task核审与正确版本审批后纳入。
- **U01必须保留**：四层PNG和各 `.meta`、`pf_street_base_01.prefab/.meta`、`scene1_camera_controller.ts/.meta`、场景中指向Prefab/Controller的活引用；`UnitSampleGallery.ts` 文件仍保留，但需重写为唯一U01实现。
- **共享/元数据/历史留存**：Creator项目设置、`assets`根目录及其他活动目录元数据、Library缓存、`project/ASSET_HANDOFF_REGISTRY.md`（后续由Owner追加新版本）、旧Task/审批/Review/变更/验收/里程碑与复盘；`apps/client/README.md` 和 `project/unit_tests/UNIT_SAMPLES_v0.1.md` 需由职责Owner修订/标历史退役，不能把文档记录当作待删运行资源。
- **未决阻塞**：Creator真实打开、refresh/import/构建与缺失UUID console检查目前均 `NOT_TESTED`；`apps/client/tools/*DemoScene*`调用边界需Client从package/build链复核；Creator Settings是否存在场景UUID入口亦需编辑器核验。资源删除仅有静态候选判断，待Client执行时确认并获相应Task与Artifact审批。


### 当前工作树的额外交叉证据（与HEAD逐项区分）

当前工作树 `UnitSamples.scene` 在第3582–3664行仍有全部21个旧 `frames` UUID（不是已移除）。同一当前场景还保留：TMX主UUID `3affc159-d837-4bb8-a030-4fb2df02b0e3`（第444行）；Prefab UUID `10562569-964f-4933-9484-f212e19e2f78`（EntryBridge，第682行）、`9b4b7612-a6fe-419f-8cfa-288e6969b658`（YamaPalace，第827行）、`865446e5-cfcd-4aa0-9039-ab214a4339c1`（BackgroundStall，第1081、1335、1480、1625、2186行共5处）、`5cb2eae1-2d67-4e3a-ba2e-b77785be2c04`（TargetStall，第2041行）、`9303d3e3-805e-4ec5-936c-529f5b68e0a9`（ExitBridge，第2440行）、`e8d7f5cb-a5b9-498f-90cf-9d0ef4e4ffa2`（GuestFloating，第3086行）、`addcbfd6-3c1f-4eaf-8814-e8b975430ba9`（GuestHorned，第3231行）、`927020ed-499a-4ffe-9e84-6b71a71e18c6`（GuestPaperTalisman，第3376行）。四类共形成51个“旧资产×场景对象”静态命中（21帧×Gallery序列化对象加图层/Prefab实例/TMX引用）；帧数组是单一组件属性列表。`streetBasePrefab` UUID位于第3668–3669行，必须保留。

全仓命令：`rg -n --hidden --glob '!**/.git/**' --glob '!**/library/**' --glob '!**/temp/**' --glob '!**/deliverables/**' --glob '!**/tasks/**' 'DemoScene\.scene|assets/demo|NightMarket\.tmx|旧Prefab UUID...' apps/client`。结果除当前场景所有上述 UUID外，活动工程引用仅命中 `UnitSampleGallery.ts`、`apps/client/README.md` 及 `apps/client/tools/` 历史DemoScene/TMX工具；未发现Server/API或其它游戏运行目录引用。`apps/client/package.json` 仅含名称、Creator版本与工程UUID，无 scripts 字段；`settings/v2/packages/project.json`仅含分辨率适配，`builder.json`仅版本字段，因此从这些静态文件未见构建钩子/场景白名单对旧资源的引用。Creator UI实际构建场景选择未核，仍 `NOT_TESTED`。

当前工作树引用扫描还发现的单文件路径：
- `apps/client/tools/attach-tiledmap.mjs` → `DemoScene.scene`、`NightMarket.tmx.meta`。
- `apps/client/tools/build-tilemap.mjs` → `assets/demo/tilemaps/NightMarket.tmx`。
- `apps/client/tools/build-static-scene.mjs`、`calibrate-static-scene.mjs`、`export-static-prefabs.mjs`、`link-static-prefabs.mjs`、`prune-disabled-ground.mjs`、`extend-exit-route.mjs` → `DemoScene.scene`。
- `create-unit-samples-scene.mjs` → `DemoScene.scene`及21旧图路径；`validate-static-scene.mjs`、`render-static-layout.py` → DemoScene/TMX及TMX meta。
- `UnitSampleGallery.ts` 注释和 `apps/client/README.md` 说明都是路径/旧行为引用，应由Client在唯一U01实现中更新。文档 `project/unit_tests/UNIT_SAMPLES_v0.1.md`、Milestone与历史任务里同样出现路径，但属历史事实保留。

四层身份核对额外证据：Prefab源 `.meta` SHA-256=`a8681a89c2f721cc97a1f27fa5c1783132922d3b8ae7ee8bca4fa0aba3e2bd81`，UUID与登记相同；Controller `.meta` SHA-256=`2dc2b78f7727cead08ce42f327b2047ff0697646e0374c7fd0b67de055f9b191`，UUID与登记相同。Creator Library中四PNG的实际导入索引分别为`apps/client/library/71/7108d512-5f6f-42d1-9411-c6f48de13939@f9941.json`与`@6c48a.json`、`apps/client/library/c7/c788f23d-127c-48a9-890c-36679d56dce4@f9941.json`与`@6c48a.json`、`apps/client/library/8f/8fae7865-9c46-46f6-8484-849ebe8a6634@f9941.json`与`@6c48a.json`、`apps/client/library/68/685d480f-3b1a-4f77-b796-79b9ec5de834@f9941.json`与`@6c48a.json`。Prefab Library主资源为`apps/client/library/2d/2d697fb3-01f0-4330-a180-a9c162310bf8.json`。这些本机Library条目证明曾有Creator导入输出，不能证明当前编辑器可重建/运行；依仓库规则Library缓存本次留存。

分类复核：`assets/demo/**`图像/Prefab/TMX与目录Meta属于旧示例运行/Creator资产身份文件，工作区删除且场景仍引用；只有场景/脚本脱链并由Creator重导入后才可确认删除。Creator meta是稳定身份和导入设置载体，与旧资源内容一并评估，不单独孤立删除。`assets/units/background/textures/**`、`assets/units/background/prefabs/**`、`assets/labs/menu/scene1_camera_controller.ts(.meta)`是唯一U01直接依赖，必须保留。`apps/client/library/**`是导入数据库缓存，项目设置及Creator全局元数据属于工程共享/可再生成环境状态，均不随demo批量删除。`project/ASSET_HANDOFF_REGISTRY.md`是稳定ID/路径/hash/UUID/审批追溯事实源，留存并待责任Owner在实施Task后续更新。

