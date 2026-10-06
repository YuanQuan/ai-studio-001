# 工作区基线与验证顺序 v0.2

Task：`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001`。版本：v0.2 Revision，等待Product、Art、Tech、QA、Master同版Review和用户审批。v0.2 Revision于2026-10-06 13:22:01 +08:00开始；本文记录本 Client Brief Task 开始时看到的客户端相关工作区事实，以免把用户/其他任务已有差异误记为本 Task 产出。v0.1文件及其Reviews保留为历史。

## 1. Task 开始证据与基线快照

- **实际开始时间**：2026-10-06 13:14:09 +08:00。该时点已读取 READY Task Packet，核对上游批准记录并查看 `git status --short -- apps/client`；随后只创建本 Client Brief Task 的规划文件。
- **正式输入门禁**：`tasks/UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001/ARTIFACT_APPROVAL.json` 将产品 PRD v0.2 记录为 `USER_APPROVED`（2026-10-06 12:57:00 +08:00）；`tasks/UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001/ARTIFACT_APPROVAL.json` 将 Tech v0.1 记录为 `USER_APPROVED`（2026-10-06 13:11:43 +08:00）。它们允许此 Client Brief 消费对应范围和审计，不授权代码/场景/资源修改。
- **Git 记录边界**：实际 `git status --short -- apps/client` 基线中，Git 已跟踪的旧 Demo 文件呈 `D`，UnitSamples/Gallery/Controller/Creator 设置呈 `M`，四层 Prefab 目录与 Cocos package 文件有 `??`。以下是状态类别摘要；逐文件旧资源清单见本目录 `RESOURCE_CLEANUP_CHECKLIST.md` 末尾路径清单及 Tech Audit。实施 Task 开始时必须重新取状态与 diff，因为共享工作区会继续变化。

|基线状态|路径/内容|开始时观察及来源判断|本 Task处理|
|---|---|---|---|
|`D`|`apps/client/assets/DemoScene.scene`、`.meta`、`apps/client/assets/demo.meta`、`apps/client/assets/demo/**`（含目录`.meta`、9 Prefab、21 PNG、NightMarket TMX及各自`.meta`）|开始前已有的 tracked 文件工作树删除；与当前场景残留引用并存|保留为预存diff；本 Task不恢复、不新删、不声明清理完成|
|`M`|`apps/client/assets/UnitSamples.scene`|已有场景重排/编辑；当前仍序列化21个旧 SpriteFrame UUID、8个不同旧 Prefab 主UUID、1个 TMX 主UUID和四层 Prefab UUID|本Task仅读取，不编辑|
|`M`|`apps/client/assets/UnitSampleGallery.ts`|已有局部修改；仍保留旧 U01–U09菜单/实现及U10四层分支，`frames`序列化属性仍由21条旧UUID填充|本Task仅以静态现状制作规划，不改实现|
|`M`|`apps/client/assets/labs/menu/scene1_camera_controller.ts`|已有镜头脚本差异，归属并非本Brief产物|本Task不编辑|
|`M`|`apps/client/settings/v2/packages/information.json`|已有 Creator 工程设置差异；Creator构建场景选择仍未用编辑器核验|本Task不编辑|
|`??`|`apps/client/assets/units/background/prefabs.meta`、`assets/units/background/prefabs/pf_street_base_01.prefab(.meta)`|已有四层 U01 Prefab及目录身份文件|本Task不编辑，列保留链|
|`??`|`apps/client/settings/v2/packages/cocos-service.json`、`apps/client/.creator/asset-template/`（开始时 status 中可见）|已有Creator/package环境文件|不编辑、不纳入清理 |
|跨项目既有差异|其他 `apps/client` 外的ART/Project/Task/历史Artifact等修改和未跟踪产物|开始时完整仓库状态含大量其他角色既有工作；不属于Client Brief|本Task不编辑，不纳入Client实现暂存范围|

> 本基线不把开始时看到的 `D/M/??` 状态声称为本Task创造。资源审计在另一已批准Tech Task中于13:03:46前后完成；此 Client Task 的开始时间更晚。当前场景命中计数须准确区分：21个旧SpriteFrame引用，8个不同旧Prefab主UUID，加1个TMX主UUID；旧demo目录本身有9个Prefab文件，第9个是未见于当前场景UUID命中表的 `Keeper.prefab`，但仍需全仓检查后判断归属。

Revision中的tracked候选路径数量复核命令为：`git ls-files -- 'apps/client/assets/DemoScene.scene' 'apps/client/assets/DemoScene.scene.meta' 'apps/client/assets/demo.meta' 'apps/client/assets/demo/**'`，输出70条：DemoScene相关2条、demo路径68条（含`demo.meta`）。v0.1 Tech Review提出的69仅作为历史意见，不作为当前数量。

## 2. 当前静态状态：不等于通过

在开始时的 `apps/client/assets/UnitSamples.scene`：

- Gallery `frames` 属性数组在约第3582–3664行序列化21个旧 SpriteFrame UUID；当前缺失的旧图片不能视为引用解除。
- Scene还包含8个不同旧Prefab主UUID（EntryBridge、YamaPalace、BackgroundStall、TargetStall、ExitBridge、GuestFloating、GuestHorned、GuestPaperTalisman）和一个 `NightMarket.tmx` 主UUID `3affc159-d837-4bb8-a030-4fb2df02b0e3`；逐项路径/UUID/实例位置见 `RESOURCE_CLEANUP_CHECKLIST.md` 与同版Tech Audit。`Keeper.prefab` 的HEAD主UUID为 `cf9128e5-3256-40d0-9411-1b648549868b`，审计当前场景未命中。
- 保留的 `streetBasePrefab` 在Scene序列化UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`。Prefab JSON依赖四层SpriteFrame子UUID；它们对应的 PNG及 `.meta` 均须保留。
- Gallery源码仍包含旧九项菜单/功能和frames消费者；已存在文件差异不是清理完成证据。
- Creator UI、打开/刷新/重导入、序列化、TypeScript构建、Web Mobile构建、运行交互在本 Client Brief Task 均未执行，状态 `NOT_TESTED`。

## 3. 后续实施验证顺序（建议，不在本 Task 实施）

以下仅是后续另行获批 Client 实施Task的建议步骤；本 Task实际做的只有规划文档和其交付清单。当前**没有**代码改写、场景保存、资源删除、Creator导入/构建或QA执行。

1. **取得新基线**：后续实施Task获 Master 解锁后，实施Owner保存完整 `git status --short`、相关 `git diff --` 与旧资源文件状态；对照本基线，将已存在差异、其他Owner差异、本次实施变更逐项分开。暂存/提交只纳入已批准实施Task的实际产物。
2. **核 Creator 可操作性**：在 Cocos Creator 3.8.8 中打开当前 `apps/client/assets/UnitSamples.scene`，记录Console/Inspector缺失UUID；如果Creator无法载入、解析或可靠保存场景，设为 `BLOCKED`，保存报错证据并通知Master。**不得用手改 `.scene` JSON、删除或替换 `.meta`、清空Library/缓存来绕过该阻塞。**
3. **先清场景序列化值**：在独立实施Task授权后，保留 `UnitSampleGallery.ts` 中Creator可识别的 `frames: SpriteFrame[]` 声明和消费者；先由Creator清空21项序列化frames及旧节点/Prefab/TMX引用，保存、关闭、重开，核旧UUID零残留且四层Prefab身份链仍完整。失败或不能可靠保存即BLOCKED，禁止手改.scene JSON。
4. **再移除脚本属性与消费者**：仅在第3步Creator核验通过后，删除frames property、`this.frames[...]`消费者和旧分支；Creator刷新/编译，再保存、关闭、重开，核无unknown property/missing UUID与旧引用，且U01依赖仍有效。
5. **核资源删除条件**：解链后做路径和UUID全仓检索（说明纳入/排除历史文档、任务、Review的理由）；核实每个候选为旧样例专用，且无其他功能、构建入口或Creator必要引用。保留项和未能证明的项继续留存并标 `KEEP/BLOCKED`。历史 `apps/client/tools` 工具逐个排除package、Creator构建/场景入口和当前开发用法后再决定；`apps/client/README.md`更新当前结构；项目级旧测试说明交其职责Owner处理。
6. **只在符合门槛后整合已有删除**：对开始时已标D的资源逐路径按已批准实现范围核账，不以“工作区本来就没了”代替证明。如果 Creator 载入/保存/脱链失败，不把这些删除纳入干净交付，并按Master决定的安全流程阻塞处理。
7. **验证保留身份与运行**：对四张PNG重新计算SHA、检查主UUID/Texture `@6c48a`/SpriteFrame `@f9941`、trim/尺寸和Library；核 `pf_street_base_01.prefab` 主UUID `2d697fb3-01f0-4330-a180-a9c162310bf8` 及四层Sprite UUID，Controller主UUID `9ceb8fd6-3853-4688-aeb0-c736616a614e`；Creator刷新/重导入、保存重开无missing；运行编译和Web Mobile构建，验证唯一菜单、进入/返回/重入、拖动/缩放/重置和控件不误触镜头。留版本、日志、引用扫描、完整文字清单和画面证据；每一步的真实结果填实现Task Artifact，未做写 `NOT_TESTED`，不由Client代QA。

## 4. 本 Task 产出与版本范围

本 Task 计划草案的准确路径：

- `deliverables/client/UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001/v0.2/FEATURE_BRIEF.md`
- `deliverables/client/UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001/v0.2/RESOURCE_CLEANUP_CHECKLIST.md`
- `deliverables/client/UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001/v0.2/WORKSPACE_BASELINE_AND_VALIDATION.md`
- `deliverables/client/UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001/v0.2/DELIVERABLE.json`

所有草案只定义边界与后续建议。即使Brief用户审批，也必须由Master新建或解锁单独Client实施Task；Client不得把本Brief审批、已有工作树diff或静态审计误作代码实现/删除授权。当前Creator验证与所有AC通过状态均未执行。

