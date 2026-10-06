# 唯一 U01 的资源引用清理技术方案 v0.1

任务：`UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001`。Owner：Tech Lead。输入：已批准 `UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2`。状态：静态方案完成，等待专业 Review 与用户审批。技术方案不修改代码、场景、资产或登记表。

## 目标与边界

在既有 `apps/client/assets/UnitSamples.scene` 中将四层镜头样例作为唯一 U01。保持四张已批 PNG、`STREET_BASE_01` Prefab、`scene1_camera_controller.ts`、已有相机参数和行为语义。清除旧 U01–U09 菜单分支、旧动态场景节点/Prefab/帧数组和只服务退役演示的运行资源。没有服务端/API/新依赖/美术改图或独立 Lab Scene 变更。

菜单文案严格采用获批PRD原文：标题“U01 四层场景镜头”；说明“查看四层场景视差，并拖动、缩放或重置镜头。”；唯一操作“进入 U01”。产品审批并未解锁旧 Client Task `UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001`：它仍为 `BLOCKED`，其 U10实现报告仅作来源证据。本技术方案获用户批准后，Master 另建或重定 Client 实施Task；QA测试计划也由 QA 单独修订并审批。不能把本方案当作实施或QA运行授权。

## 现状和资产边界

详细路径清单、序列化UUID、hash、现存删除状态及检索结果见同版 [RESOURCE_REFERENCE_AUDIT.md](RESOURCE_REFERENCE_AUDIT.md)。当前关键事实：

- 工作树 `UnitSamples.scene` 仍有21个 `frames` SpriteFrame旧UUID（line 3582–3664），并包含旧节点/Prefab UUID。工作树已修改，但清理未完成。
- 同场景还保留 `streetBasePrefab`，引用 UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`（line 3668）。此值必须保留。
- 旧 demo PNG/Prefab/TMX 和 `.meta` 路径当前已在工作区被删除，但 `git ls-files` 仍显示它们来自版本库；不能以缺文件的工作区状态推断场景引用已清空或清理有效。
- 四 PNG的当前SHA与资源登记相同；PNG主UUID / Texture2D子UUID `@6c48a` / SpriteFrame子UUID `@f9941` 均与`.meta`及Creator Library JSON对应。`STREET_BASE_01` Prefab creator主UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`，四层SpriteFrame引用匹配。Controller主UUID `9ceb8fd6-3853-4688-aeb0-c736616a614e`。
- 哈希/UUID核验为文件与Creator导入元数据的静态证据。当前Creator编辑器重新打开、运行画面、构建和输入检查均 `NOT_TESTED`；运行清理效果为 `BLOCKED` 直至有Creator访问和新的Client/QA授权。

## 模块与依赖方向

`UnitSamples.scene` 持有场景根组件与Prefab序列化引用；`UnitSampleGallery.ts` 负责唯一菜单、进入/返回与运行页构建；Gallery 在U01页面实例化共用 `STREET_BASE_01` Prefab。Prefab按顺序依赖四张PNG产生的SpriteFrame子资源。Gallery再调用 `Scene1CameraController` 控制四层节点镜头行为。

依赖方向保持：`UnitSamples.scene → UnitSampleGallery → STREET_BASE_01 Prefab → 四张SpriteFrame`；`UnitSampleGallery → Scene1CameraController`。旧 `frames: SpriteFrame[]` 与菜单U01–U09生成逻辑一起删除，不再由场景注入旧图集。Prefab不承载菜单和操作控件。避免引入新的共用层或移动资产路径，降低UUID迁移风险。

## 建议的安全实施顺序

### A. 开始前盘点与冻结范围

Client接手后记录 `git status --short`、diff、所有旧路径的状态和Creator版本；识别哪些删除来自之前工作区。不得把其他角色无关变更或本 Task 文档变化算成其实现。以本Task资源逐路径清单与获批产品范围为唯一清理界限。

### B. 先解除场景/代码引用

1. 在 `UnitSampleGallery.ts` 中将菜单表改为产品批准的唯一U01文案；移除U01–U09的菜单数据、旧分支/状态字段/构造代码、旧 `frames` 属性及所有依赖它的签名和索引逻辑。保留U01调用的Prefab、四层节点查找、controller与镜头语义。删代码之前先定位引用者，防止错删仍需逻辑。
2. Creator打开当前 `UnitSamples.scene`。移除 `frames` 属性序列化数组内的21项旧SpriteFrame UUID、旧九样例承载节点/实例/属性覆盖以及失效Prefab和TMX序列化引用；移除旧 `WorldRoot`/旧背景节点只在确属退役样例后执行。保存时使用Creator，不通过手工删JSON绕过反序列化。
3. 保留唯一 U01 的入口、菜单页/返回重入功能与 `streetBasePrefab`；检查场景Controller组件脚本引用UUID未变。
4. 全局文本清理旧入口标题、旧多单元副标题/占位脚注和运行时可见功能说明。历史Artifact内容不重写。更新 `apps/client/README.md` 的活动结构；`project/unit_tests/UNIT_SAMPLES_v0.1.md` 由Owner决定标记历史退役/更正入口说明。旧构建辅助脚本先确认无package/build hook调用，再决定删除。

### C. Creator确认场景已脱链后才处理资源

保存并关闭/重开Creator工程，确认scene中的21个frames旧UUID、旧Prefab UUID、TMX UUID全部消失，Inspector不再含已删资源missing引用。对计划删路径运行全仓路径与Creator UUID检索，除了任务/历史/本审计的追溯记录外，不得有活动场景/Prefab/脚本/构建入口引用。

只有验证无活动引用且归属确为旧U01–U09独用后，才可在Client Task中删除审计清单里的旧运行图、Prefab、TMX、DemoScene及各自 `.meta`/目录 `.meta`。当前已删项由Client按基线和批准方案正式核账，不要恢复后重删来制造干净diff。Generator/README等源代码与文档单独判断职责和引用，不把源码目录名或历史字符串当成运行依赖。

### D. 保留身份核对、导入和运行验收

1. 对4个PNG重新计算SHA-256，并与本Task审计和资源登记一致；核对各PNG `.meta` image主UUID、texture `@6c48a`、SpriteFrame `@f9941`、`trimType=none`、2172×724、offset(0,0)以及Library同UUID JSON。
2. 核对Prefab源JSON、`.meta`和Library主资源对应；UUID应继续是 `2d697fb3-01f0-4330-a180-a9c162310bf8`，四个Sprite引用应保持原SpriteFrame UUID。核对场景序列化Prefab字段仍指向该UUID。不要重建或手工换UUID。
3. 核对Controller `.ts` 与 `.meta`，脚本主UUID保持 `9ceb8fd6-3853-4688-aeb0-c736616a614e`。静态文件核验不能替代Creator导入状态。
4. 在Creator刷新/重导入，打开UnitSamples场景，检查无missing UUID并正常序列化。运行Creator TypeScript编译与Web Mobile构建，打开构建，验证唯一菜单、进入、返回后重进无重复对象、拖动、缩放、重置和初始状态。保留构建日志/截图或录屏和版本信息。
5. 超出桌面Web/产品验收范围的真机兼容、帧率/DrawCall等不得推断通过；按新获批QA计划逐项记录。此次审计未运行上述任何命令/环境行为，统记 `NOT_TESTED`。

## 可删除候选、保留项、未决项

- **当前已删、待Client按本方案核账**：`DemoScene.scene/.meta`、`assets/demo.meta`和其下全部 tracked旧人物、道具、场景图、9个Prefab、TMX、资产及目录`.meta`。完整清单及 `git status=D` 见 RESOURCE_REFERENCE_AUDIT.md。
- **解除引用后可删候选**：上述旧运行资源；旧 `UnitSampleGallery` 九项实现代码与场景序列化数据；依赖已退役DemoScene/TMX的 `apps/client/tools/attach-tiledmap.mjs`、`build-tilemap.mjs`、`build-static-scene.mjs`、`calibrate-static-scene.mjs`、`export-static-prefabs.mjs`、`link-static-prefabs.mjs`、`prune-disabled-ground.mjs`、`extend-exit-route.mjs`、`create-unit-samples-scene.mjs`、`validate-static-scene.mjs`、`render-static-layout.py` 等一次性工具。Client需查证package.json、Creator构建脚本、开发流程是否有入口依赖；若被调用，先更新调用再删。
- **U01保留**：四层PNG及`.meta`、共用Prefab及`.meta`、镜头Controller及`.meta`、UnitSamples.scene和改写后的UnitSampleGallery.ts、必要Creator Library导入数据、资源登记稳定ID/hash/UUID链。
- **历史留存**：task/review/approval/已取消任务、Milestone/Retrospective/Change/旧交付物，作为审批追溯不删。客户端README修订为当前结构；旧unit_tests文档由文档Owner标为历史，不作为代码清理对象。
- **共享/Creator元数据**：Creator设置、通用工程配置、其他运行资源及Library/缓存不按目录名称批删。只在Creator实际证明其为被清资产的生成缓存且工具规定可重建时，由Client单独确认；本Task建议全部保留。
- **未决**：Creator真实重导入/场景解析/构建/运行均待后续任务；工具的package/build调用边界待Client查清；DemoScene历史编辑器状态不可由当前静态仓库证明。

## 接口、数据、安全与迁移风险

本任务没有Server/API/持久化/schema变更。Prefab、场景和SpriteFrame以Creator UUID作为内部引用身份；直接移动/重建会造成断链，因此不建议对保留资产执行rename/move/regenerate UUID。可能风险是删除PNG时留下frames数组，或删Prefab前场景仍存序列化UUID，造成Creator导入错误；另一风险是只删旧入口卡片而保留旧运行文案，违反产品验收。风险缓解依靠先代码/场景解引用、保存重开和UUID检索，再删运行资源，最终Creator构建/运行复核。

## 专业Review与后续门禁

本任务 Tech Review 仅签技术依赖、清理顺序与保留身份链可行性。Product / Art / Client / QA / Master Review 由对应Owner独立产出，不由Tech Lead代签；Creator无法实测的项明确保留 `NOT_TESTED`。所有同版Review通过后进入用户审批。只有用户明确批准本Tech Artifact后，Master才可推进Client实施；Client和QA分别走自己的正式Artifact与审批门禁。

