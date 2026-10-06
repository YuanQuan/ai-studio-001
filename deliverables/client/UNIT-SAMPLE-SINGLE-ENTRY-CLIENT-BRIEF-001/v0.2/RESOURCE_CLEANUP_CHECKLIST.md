# 旧示例资源解除引用与清理清单 v0.2

Task：`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001`。此文档仅规划后续实施，**当前没有修改代码/场景/资源或执行删除**。旧资源已在本轮开始前出现在工作区删除状态；需用实施Task批准后的快照与 Creator 结果重新核账。完整静态证据源：`deliverables/tech_lead/UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001/v0.1/RESOURCE_REFERENCE_AUDIT.md`，包括 HEAD `.meta` UUID、引用位置及逐路径资源名单。

## 0. 实施停机规则

1. 后续独立 Client 实施 Task 获 Master 解锁且实施Artifact完成审批前，不改工程。
2. 实施开始时重新保存 `git status --short` 与目标文件 diff；沿用下文表格仅作历史基线，不把原有删除、修改或未跟踪文件算成本次改动。
3. Creator 必须能载入当前 `UnitSamples.scene`，并可检查/解除缺失资源引用。若不能载入、场景反序列化不可靠或保存后仍报引用错误，立即 `BLOCKED`，保留现场日志/截图并通知 Master。**禁止手工改写 `.scene` JSON、删除/移动 `.meta` 或清理 Library 来掩盖 missing 引用。**
4. 未完成场景/脚本解链、Creator 保存关闭重开复核、全仓路径/UUID扫描和逐项归属确认前，不扩大或确认任何候选删除。工作区早先删除的文件不得因为已缺失就视为完成删除验收；按 Tech 方案核账，Creator可验证时才纳入批准的最终 diff。
5. 任何共享归属、正式七项内容使用、构建入口、Creator必要性或UUID不明的项保持保留并向Master提交阻塞/变更请求。

## 1. 必须先解除的旧序列化引用

### 1.1 Creator分阶段清理 Gallery `frames` 中的21个旧 SpriteFrame UUID

下表每个 UUID 均为 `UnitSamples.scene` Gallery 组件 `frames` 数组的旧序列化项；资源路径是 HEAD 中对应 PNG，全部目前属于工作区预先删除候选。安全顺序：保持 `UnitSampleGallery.ts` 中 Creator 可识别的 `frames: SpriteFrame[]` 声明及消费者；先在 Creator Inspector 清空该序列化数组，处理同场景其他引用，保存并关闭重开，核对21项旧UUID归零且四层Prefab仍完整。**只有第一阶段保存/重开核验通过后，才移除脚本property和旧消费者代码**；之后再次由Creator刷新/编译、保存、关闭重开并核无unknown property/missing UUID。Creator不能载入或无法可靠保存时标 `BLOCKED`，禁止手改.scene JSON。一个 UUID 可能同时被旧 Prefab 实例引用，仍须处理对应场景节点。

|状态|序号|旧 SpriteFrame UUID|原资源路径|Creator解除/重开证据|
|---|---:|---|---|---|
| [ ] | 1 | `e6e8cfdd-daea-4a2b-b576-59c85b521916@f9941` | `apps/client/assets/demo/scenes/tile_ground.png` | 待实施填写 |
| [ ] | 2 | `c38dcb77-2a95-4e15-8b8a-e1a64b3fb99f@f9941` | `apps/client/assets/demo/scenes/tile_stone_road.png` | 待实施填写 |
| [ ] | 3 | `e34b835a-96bc-4f0c-837d-bcc1eb02439e@f9941` | `apps/client/assets/demo/scenes/tile_water.png` | 待实施填写 |
| [ ] | 4 | `b8022828-48a5-4e3b-aa37-9cd453389eb7@f9941` | `apps/client/assets/demo/scenes/tile_shore.png` | 待实施填写 |
| [ ] | 5 | `727c5454-5ce6-4180-ac31-574fe22aff82@f9941` | `apps/client/assets/demo/scenes/bridge_entry.png` | 待实施填写 |
| [ ] | 6 | `098b994b-1716-480f-9537-98e85ef11499@f9941` | `apps/client/assets/demo/scenes/bridge_exit.png` | 待实施填写 |
| [ ] | 7 | `d85d3ba5-6658-4ef0-b21d-118cc15a2b2a@f9941` | `apps/client/assets/demo/scenes/yama_palace.png` | 待实施填写 |
| [ ] | 8 | `81d4b955-83f5-4829-97e2-1323ebd19f80@f9941` | `apps/client/assets/demo/props/stall_ruined.png` | 待实施填写 |
| [ ] | 9 | `e266e6de-6054-48ce-a6c3-a4b86b617811@f9941` | `apps/client/assets/demo/props/stall_restored.png` | 待实施填写 |
| [ ] | 10 | `ca7c5061-11f5-436c-b734-65ec50195181@f9941` | `apps/client/assets/demo/characters/keeper_ghost.png` | 待实施填写 |
| [ ] | 11 | `e01a1aea-3bd8-45f2-baf5-553a3e7162da@f9941` | `apps/client/assets/demo/characters/guest_floating.png` | 待实施填写 |
| [ ] | 12 | `9fb658f8-e78f-46e8-a49c-2e70762bc552@f9941` | `apps/client/assets/demo/characters/guest_floating_walk_01.png` | 待实施填写 |
| [ ] | 13 | `98969c15-69c4-4e69-a361-6a887880a83b@f9941` | `apps/client/assets/demo/characters/guest_floating_walk_02.png` | 待实施填写 |
| [ ] | 14 | `0a0d805b-7cd8-4af3-85a6-4eaf7b5c90ee@f9941` | `apps/client/assets/demo/characters/guest_horned_beast.png` | 待实施填写 |
| [ ] | 15 | `510d8bb9-f8a1-45cf-a663-3bc4177cc63e@f9941` | `apps/client/assets/demo/characters/guest_horned_beast_walk_01.png` | 待实施填写 |
| [ ] | 16 | `5b460a3e-28d6-4d3c-b722-ff1004bd44ae@f9941` | `apps/client/assets/demo/characters/guest_horned_beast_walk_02.png` | 待实施填写 |
| [ ] | 17 | `7b30845f-bf3d-4765-8cc9-a75ab9818001@f9941` | `apps/client/assets/demo/characters/guest_paper_talisman.png` | 待实施填写 |
| [ ] | 18 | `f399f40b-811d-4137-bb40-c0d2d980efeb@f9941` | `apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png` | 待实施填写 |
| [ ] | 19 | `11a3927b-08ab-4ccf-948e-422b7027e8c7@f9941` | `apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png` | 待实施填写 |
| [ ] | 20 | `2744955e-17e4-461e-b25e-ead20c2b04a4@f9941` | `apps/client/assets/demo/props/lantern_warm.png` | 待实施填写 |
| [ ] | 21 | `771100b0-ee9a-4a95-8a7e-fa82e3ac5c00@f9941` | `apps/client/assets/demo/props/shore_tree.png` | 待实施填写 |

### 1.2 旧场景 Prefab / TMX 引用

路径和 UUID 由当前工作树 `UnitSamples.scene` 的序列化对象及 Tech Audit 对照 HEAD `.meta` 核验。单独一项资源可能在场景多处实例化；Creator 保存/重开后应通过完整场景 UUID 检索确认这些主UUID和实例属性覆盖一并消失。

|状态|原资产路径|HEAD Creator 主 UUID|当前场景证据|Creator解除/重开证据|
|---|---|---|---|---|
|[ ]|`apps/client/assets/demo/prefabs/EntryBridge.prefab`|`10562569-964f-4933-9484-f212e19e2f78`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/YamaPalace.prefab`|`9b4b7612-a6fe-419f-8cfa-288e6969b658`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/BackgroundStall.prefab`|`865446e5-cfcd-4aa0-9039-ab214a4339c1`|5处实例/引用|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/TargetStall.prefab`|`5cb2eae1-2d67-4e3a-ba2e-b77785be2c04`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/ExitBridge.prefab`|`9303d3e3-805e-4ec5-936c-529f5b68e0a9`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/GuestFloating.prefab`|`e8d7f5cb-a5b9-498f-90cf-9d0ef4e4ffa2`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/GuestHorned.prefab`|`addcbfd6-3c1f-4eaf-8814-e8b975430ba9`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab`|`927020ed-499a-4ffe-9e84-6b71a71e18c6`|节点实例|待实施填写|
|[ ]|`apps/client/assets/demo/tilemaps/NightMarket.tmx`|`3affc159-d837-4bb8-a030-4fb2df02b0e3`|WorldRoot/TMX序列化引用|待实施填写|

> 当前 UnitSamples.scene 命中 **8个不同 Prefab 主UUID** 和 **1个 TMX 主UUID**。旧 `apps/client/assets/demo/prefabs/` 共 tracked 9个 Prefab 资源；第9个 `Keeper.prefab`（主UUID `cf9128e5-3256-40d0-9411-1b648549868b`）不在 Tech Audit 的当前 Scene UUID 命中表中。它仍是旧目录删除候选，但必须另行全仓检查引用/归属后再决定，不能把它计作场景引用。

### 1.3 Gallery 旧代码与场景旧节点

- [ ] `apps/client/assets/UnitSampleGallery.ts`：仅在Creator已清空场景`frames`数组并保存、关闭重开确认21个旧UUID无残留后，才删除旧 `UNITS` U01–U09 项与 U10 标签、旧 `UnitId` 0–10/路由、旧样例构造/状态、`frames: SpriteFrame[]` 属性与所有 `this.frames[...]` 引用；保留 U01 所需 `Prefab`/instantiate/Controller 依赖。删除代码后再由Creator刷新/编译、保存并关闭重开复核。
- [ ] 旧菜单文案：移除“百鬼夜市 · 单元样例”、“每个入口只验证一组独立能力”、“四方向与特效目前采用机制占位，正式资产需补做”，以及运行页内所有旧方向占位状态/说明。仅保留产品批准 U01 文案及有效控件提示。
- [ ] `apps/client/assets/UnitSamples.scene`：通过 Creator 清除 Gallery 的旧 `frames` 序列化值、旧 `WorldRoot`/地块、建筑、地标、角色、桥、道路、TMX组件、Prefabs和 property overrides；逐节点确认归属退役实验。场景中 `streetBasePrefab` 及其 UUID 必须留存。
- [ ] 阶段A（脚本property仍保留）：Creator Inspector清空21个frames序列化值及旧节点/Prefab/TMX引用；保存、关闭重开，核场景内旧UUID零残余且U01 Prefab/四层依赖仍在。此步失败即按第0节BLOCKED，不能进入代码property删除。
- [ ] 阶段B（仅阶段A通过后）：移除脚本frames property和旧消费者；Creator刷新/编译、保存、关闭重开，核无unknown property/missing UUID、旧场景引用零命中。另全仓扫描第9个目录Prefab `Keeper.prefab` 归属；未核清不得删除。

### 1.4 旧运行资源删除候选（均需核引用后，按逐路径核账）

仅本列表中工作树缺失、且Tech Audit明细所列的 tracked 文件构成既有候选，不代表本 Task 已删除。核数命令：`git ls-files -- 'apps/client/assets/DemoScene.scene' 'apps/client/assets/DemoScene.scene.meta' 'apps/client/assets/demo.meta' 'apps/client/assets/demo/**'`；输出70条（DemoScene相关2条，demo路径68条，含`demo.meta`）。下列完整清单按该 Git HEAD pathspec 枚举；每项实施时须独立核对 Creator `.meta` 与活动引用后勾选。Tech v0.1 Review中的69为历史Review意见，不作为本版计数事实。

- [ ] `apps/client/assets/DemoScene.scene` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/DemoScene.scene.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_floating.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_floating.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_floating_walk_01.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_floating_walk_01.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_floating_walk_02.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_floating_walk_02.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_horned_beast.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_horned_beast.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_horned_beast_walk_01.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_horned_beast_walk_01.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_horned_beast_walk_02.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_horned_beast_walk_02.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_paper_talisman.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_paper_talisman.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_paper_talisman_walk_01.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/guest_paper_talisman_walk_02.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/keeper_ghost.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/characters/keeper_ghost.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/BackgroundStall.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/BackgroundStall.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/EntryBridge.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/EntryBridge.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/ExitBridge.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/ExitBridge.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/GuestFloating.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/GuestFloating.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/GuestHorned.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/GuestHorned.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/GuestPaperTalisman.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/Keeper.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/Keeper.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/TargetStall.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/TargetStall.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/YamaPalace.prefab` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/prefabs/YamaPalace.prefab.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/lantern_warm.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/lantern_warm.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/shore_tree.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/shore_tree.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/stall_restored.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/stall_restored.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/stall_ruined.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/props/stall_ruined.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/bridge_entry.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/bridge_entry.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/bridge_exit.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/bridge_exit.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_ground.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_ground.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_shore.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_shore.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_stone_road.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_stone_road.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_water.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/tile_water.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/yama_palace.png` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/scenes/yama_palace.png.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/tilemaps.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/tilemaps/NightMarket.tmx` — 工作树缺失/删除候选（复核前不得据此认定安全删除）
- [ ] `apps/client/assets/demo/tilemaps/NightMarket.tmx.meta` — 工作树缺失/删除候选（复核前不得据此认定安全删除）

### 1.5 README、工具和项目说明

- [ ] `apps/client/README.md`：更新唯一 U01 当前运行入口和四层资源依赖说明，删除将 U01–U09/DemoScene/assets/demo 描述为当前运行结构的文字；历史事实应明确标记。
- [ ] `apps/client/tools/attach-tiledmap.mjs`、`build-tilemap.mjs`、`build-static-scene.mjs`、`calibrate-static-scene.mjs`、`export-static-prefabs.mjs`、`link-static-prefabs.mjs`、`prune-disabled-ground.mjs`、`extend-exit-route.mjs`、`create-unit-samples-scene.mjs`、`validate-static-scene.mjs`、`render-static-layout.py`：属于已退役 DemoScene/TMX 的工具候选。后续 Client 实施需查 Creator/开发/build调用链，活动调用先更新并验证；无调用且无当前维护用途方可删除。`serve-unit-build.mjs` 不是旧 Demo 工具，不因同目录删除。
- [ ] `project/unit_tests/UNIT_SAMPLES_v0.1.md`：文档所有者在另行授权后将旧九项记录标明历史/已退役；Client Brief不自行改此 Product/QA历史文档。旧任务、审批、Review、测试报告、Milestone/Change/Retrospective保留。
- [ ] 对历史 Artifact/Task 留存的 U01–U09、旧路径和旧 UUID 命中作分类备注，不做机械字符串清除。

## 2. U01 必须保留的正式资源身份链

以下路径、文件、`.meta`、UUID/子UUID和登记事实全部保护。实施删除清单不得把这些条目归进 assets/demo 清理范围。

|状态|稳定资产ID|正式路径|SHA-256|Creator身份|
|---|---|---|---|---|
|[ ] 保留|`STREET_BASE_01_L01`|`apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png`|`fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1`|主`7108d512-5f6f-42d1-9411-c6f48de13939`; Texture `@6c48a`; SpriteFrame `@f9941`|
|[ ] 保留|`STREET_BASE_01_L02`|`apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png`|`3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478`|主`c788f23d-127c-48a9-890c-36679d56dce4`; Texture `@6c48a`; SpriteFrame `@f9941`|
|[ ] 保留|`STREET_BASE_01_L03`|`apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png`|`af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d`|主`8fae7865-9c46-46f6-8484-849ebe8a6634`; Texture `@6c48a`; SpriteFrame `@f9941`|
|[ ] 保留|`STREET_BASE_01_L04`|`apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png`|`8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b`|主`685d480f-3b1a-4f77-b796-79b9ec5de834`; Texture `@6c48a`; SpriteFrame `@f9941`|
|[ ] 保留|`STREET_BASE_01`|`apps/client/assets/units/background/prefabs/pf_street_base_01.prefab`|`2df15d9d1820f4ad9ebc408dc369f191c27157936cea3dab5e18d227a4038ed2`|Prefab主`2d697fb3-01f0-4330-a180-a9c162310bf8`; 引用上列四个SpriteFrame子UUID|
|[ ] 保留|`SCENE1_CAMERA_CONTROLLER`|`apps/client/assets/labs/menu/scene1_camera_controller.ts`|`69be28ea236795a1b840d0a294d05e88ae60b93c5d255a68f563bfe8f9a4b400`|TypeScript主`9ceb8fd6-3853-4688-aeb0-c736616a614e`|

所有 `.meta`、必要 Creator Library 导入数据与 `project/ASSET_HANDOFF_REGISTRY.md`稳定资产ID/hash/UUID记录留存。执行者只在获批实现Task后由对应Owner按追溯规则更新登记的新版本，不覆盖本次已有事实。

## 3. 删除前后的逐项证据与门禁

每个待删除资源至少填：工作区初始状态和来源；HEAD路径及 Creator UUID；所有活动 Scene/Prefab/脚本/构建入口/其他功能引用检索结果；Creator场景打开/保存/重开后引用状态；确认“旧样例专用且无 U01/其他功能/Creator必要引用”的证据；实际改动后的diff路径。任一项不通过或未知，状态填`BLOCKED/KEEP`，不删除。静态检索排除 `deliverables/`、`tasks/` 和历史审批内容的理由应记录，Creator构建入口还须在编辑器中检查；未核环境项写 `NOT_TESTED`。

|项目|执行前|解链/引用核验|可删判定证据|最终路径状态|
|---|---|---|---|---|
|DemoScene与demo运行资源逐路径|待实施Task记录|待Creator及全仓核验|未证明项KEEP|待实施|
|Gallery旧实现、frames属性及UnitSamples旧节点|待实施Task记录|待Creator保存/重开、静态扫描|仅删除退役九项分支/节点|待实施|
|DemoScene/TMX辅助工具|待实施Task记录|待查package、Creator和开发入口|无活动调用才可删|待实施|
|四层PNG、Prefab、Controller及meta|已登记基线|核UUID/hash/子UUID不变|永不归入旧资源删除|必须保留|
|历史任务、审批、Review、测试、项目登记|已登记基线|核文件未改写/删除|历史留存|必须保留|

后续 Client Implementation Report 和 Tech/QA Artifact按批准任务完成。此Checklist所有实施栏当前未执行、未通过。

