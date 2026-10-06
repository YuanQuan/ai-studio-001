# U01 客户端实现报告 v0.1

Task：`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001`。当前状态：实现、锁定Creator导入/CLI构建及实现级IAB冒烟已完成，资源脚本清理有归属/引用/备份证据，提交同版专业Review；正式QA未执行。本报告不将实现级冒烟写作正式QA通过。

## 开始基线与预存差异保护

- 实际开始：2026-10-06 14:05:17 +08:00。开始时读取最新Task、Cocos方法迁移补充及批准输入，复核 `rules/cocos_cli_browser_workflow.md` 与共享skill。
- 开始前 `git status --short -- apps/client` 显示 `UnitSamples.scene`、`UnitSampleGallery.ts`、Controller、Creator设置为已有修改；四层Prefab目录/Creator配置为已有未跟踪状态。`DemoScene.scene/.meta`、`assets/demo/**` 和目录 `.meta` 的70条tracked删除均早于本Task开始，未恢复、未重复删除、未计成本次删除。
- 开始时SHA-256：`UnitSamples.scene`=`E48FF6357E2B5647460F907BFC056CC637ECAF0511F76AA56764DE6476507BAD`；`UnitSampleGallery.ts`=`A7A7A4CBEC94FE95C07862C7B0D3E266C721EDF6D0614385DC942EDFF8EE2A8D`。
- 原件副本保存在系统临时目录 `C:\Users\admin\AppData\Local\Temp\UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001-20261006-140517\`，未进入工作区或提交范围。
- 70条旧资源路径按 `git ls-files -- 'apps/client/assets/DemoScene.scene' 'apps/client/assets/DemoScene.scene.meta' 'apps/client/assets/demo.meta' 'apps/client/assets/demo/**'` 复核，为2条DemoScene路径与68条demo路径（含demo.meta）。这些预存删除目前仅作为清理基线。

## 实现变更

### UnitSamples.scene受控对象图转换

- 输入是开始时工作树版本的Creator序列化数组，129个对象。旧 `ScreenCanvas/WorldRoot` 子树承载TileMap、静态地标、步道、角色示例、8个当前场景Prefab实例及TMX组件；旧 `frames` 数组含21个SpriteFrame UUID。Gallery序列化组件另有必须保留的 `streetBasePrefab` UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`。
- 按两阶段顺序：先在脚本属性仍声明时，将21项 `frames` 序列化值清为空数组；删除 `WorldRoot` 下的旧节点、组件、PrefabInfo/Instance及TileMap引用；从场景PrefabInfo中移除指向已删实例的嵌套根引用；对保留对象建立旧/新索引映射并递归改写全部 `__id__`。校验保留Node的parent/children及Node/component双向关系；随后才移除Gallery的 `frames` property和所有旧消费者代码，最后从场景组件移除已清空的旧序列化字段。
- 数组由129项变为19项，移除110个序列化对象（47个Node及其组件/Prefab记录）。保留Scene、ScreenCanvas、Camera、Canvas/Gallery组件、Scene Globals与唯一 `streetBasePrefab` 引用。Scene PrefabInfo的旧实例根列表为空。
- 当前Creator保存后的场景SHA-256：`68E1121AD5552D97897DFFC066CC6A7CA735FF51DEC8905AFB4CA0802881A76A`。该值取代早先受控转换后记录的`264EC5D...`；CLI导入/保存对场景进行了序列化规范化，当前内容重新解析仍为19对象，静态引用检查通过。
- `check-scene-links.mjs` 对最终场景检查返回 `STATIC_PASS`：Scene SHA-256=`68E1121AD5552D97897DFFC066CC6A7CA735FF51DEC8905AFB4CA0802881A76A`，19个对象、26条对象索引引用有效；Tech清单中的21个旧SpriteFrame UUID、8个旧Scene Prefab UUID和TMX UUID共30个身份在场景内零命中；保留Prefab UUID精确命中1次。独立对象图校验为`OBJECT_GRAPH_PASS`，2个`cc.Node`（ScreenCanvas、Camera）的父子/组件关系双向有效，无越界`__id__`。完整结果见`evidence/scene-reference-audit.json`。随后同一Scene由Creator 3.8.8导入并参与最终Web Mobile构建；源assets与构建隔离快照字节匹配，实际IAB加载/操作成功，详见`evidence/SMOKE_REPORT.md`及`u01-final-build-identity.json`。静态检查自身不证明引擎反序列化，但此处另有引擎与运行证据。

### UnitSampleGallery.ts与README

- Gallery现只构造批准的U01菜单及同场景四层运行页；入口/说明为批准文案，运行页继续实例化 `STREET_BASE_01`、定位四个图层，并挂接现有 `Scene1CameraController` 的拖动、缩放、重置、返回和UI输入隔离。
- 移除了U01–U09/U10菜单表、旧`UnitId`路由、瓦片/占格/建筑/方向/遮挡/特效/UI/密度示例构造、旧`frames`属性和消费者。未改Controller源码及其 `.meta`。
- Root首次Web Mobile/IAB实际交互发现按钮缩放与重置失败：点击`+`后图像几何未改变，拖动后点击重置仍未恢复居中（证据`evidence/u01-zoom-in.png`、`evidence/u01-reset-attempt.png`）。源码原因已定位：`Scene1CameraController.onEnable()`立即调用`bindTouchControls()`；Gallery先`addComponent()`触发生命周期，再赋按钮节点，所以四个按钮Map没有绑定。任务开始前备份中的U10实现没有`enabled`开关；旧按钮直接捕获Controller并调用`zoomBy/reset`，没有这次新增的组件按钮绑定时序。因此未发现遗漏旧enable开关，问题来自当前重构的初始化顺序。
- 已修正Gallery：先将Controller节点设为inactive，添加组件并赋完layers、viewport、UI捕获根及四个按钮，再激活节点触发`onEnable`，最后调用`reset()`。保持Controller源码及身份不变。旧构建缩放/重置曾FAIL；Root使用修复后的同版源重建并在IAB复测，修复后+放大、−恢复，拖动、重置、UI隔离、返回和重入均通过。实际构建/浏览器截图及身份详见`evidence/SMOKE_REPORT.md`和`evidence/u01-final-build-identity.json`。
- 更新 `apps/client/README.md` 说明唯一U01活动入口、批准资源关系、Web Mobile本地服务及工具目录现状；旧历史文档与审批链未改。

### 旧资源归属与引用核查

- TechPlan v0.1 `RESOURCE_REFERENCE_AUDIT.md` 对70条tracked路径逐项列出旧`DemoScene.scene`或`assets/demo/**` PNG、Prefab、TMX及Creator `.meta`身份文件，均归属退役旧样例；本次用Tech清单与命令`git ls-files -- 'apps/client/assets/DemoScene.scene' 'apps/client/assets/DemoScene.scene.meta' 'apps/client/assets/demo.meta' 'apps/client/assets/demo/**'`逐路径复核，共70条（2条DemoScene、68条demo目录路径）。实现开始前这70条工作树删除已存在；当前场景30个旧UUID零命中、无活动旧资产引用，且最终Creator导入/构建与实际U01运行通过。本次核账确认该70项预存删除可纳入相关实现提交；它们仍是预存删除，未宣称为本轮新增成果。
- 其中第9个目录Prefab `apps/client/assets/demo/prefabs/Keeper.prefab` 不计入旧场景8个Prefab引用。按HEAD中Prefab内容与meta核对，其meta UUID为`cf9128e5-3256-40d0-9411-1b648549868b`，根节点名为Keeper，只引用21项旧SpriteFrame之一`ca7c5061-11f5-436c-b734-65ec50195181@f9941`。当前场景无Keeper路径/UUID/frames；当前项目活动源及配置搜索、HEAD中排除该Prefab及自身meta后的引用搜索均无其他Keeper路径/UUID命中。结合TechPlan逐路径分类、运行资源目录归属及最终Creator构建/IAB无缺失资源提示，确认Keeper也是旧demo专属且无活动引用，可随预存删除纳入相关提交。历史任务、交付和审批文字仍属追溯资料并保留。逐路径核账和Keeper证据见`evidence/resource-cleanup-audit.json`、场景审计见`evidence/scene-reference-audit.json`。
- `rg` 全仓扫描 `apps/client` 当前源/配置后未找到11个工具名在工具目录之外的活动调用引用；`package.json`无scripts入口，Creator设置也无工具调用入口。逐文件确认它们都直接读写旧`DemoScene.scene`和/或`assets/demo/NightMarket` TMX/Prefab产物。Root确认同版无调试Creator构建及实际U01运行通过后，已明确授权删除这11个一次性旧Demo专属工具。删除前逐个复制到系统临时备份并比对SHA-256，之后用PowerShell `Remove-Item -LiteralPath`删除精确文件；删除后逐项`Test-Path`确认不存在。清单、hash、命令、备份路径见`evidence/resource-cleanup-audit.json`。保留`serve-unit-build.mjs`，用于本次Web Mobile实际产物服务。
- 资源范围包括原70条预存删除路径中的旧DemoScene、demo目录素材/Prefab/TMX及身份meta；它们原本已缺失，不计为本次新删除。目录有9个旧Prefab资产，其中8个UUID曾在旧WorldRoot场景实例中命中；`Keeper.prefab` 是第9个，仅在全仓归属/引用核查后判定，未计入场景引用。
- U01正式资源身份复核通过：四张PNG的SHA-256、主UUID及`.meta`中的`@6c48a`/`@f9941`子身份均与 `project/ASSET_HANDOFF_REGISTRY.md`一致；`pf_street_base_01.prefab` SHA-256=`2df15d9d1820f4ad9ebc408dc369f191c27157936cea3dab5e18d227a4038ed2`、UUID=`2d697fb3-01f0-4330-a180-a9c162310bf8`，四个SpriteFrame依赖齐全；镜头Controller UUID=`9ceb8fd6-3853-4688-aeb0-c736616a614e`。未修改PNG、其`.meta`、保留Prefab或Controller身份。

## 验收状态

|验收项|状态|证据/边界|
|---|---|---|
|唯一U01菜单文案、入口及同场景返回/重入实现|PASS|`evidence/SMOKE_REPORT.md`及`u01-final-menu.png`、`u01-final-enter.png`、`u01-final-return.png`、`u01-final-reenter.png`；菜单只有批准U01入口，进入/返回/重入成功。|
|旧frames、Prefab/TMX场景序列化引用解除和索引/对象关系有效|PASS|`evidence/scene-reference-audit.json`记录当前Scene SHA-256`68E1121AD5552D97897DFFC066CC6A7CA735FF51DEC8905AFB4CA0802881A76A`、19对象/26引用、旧21帧+8场景Prefab+TMX共30 UUID零命中、对象图`OBJECT_GRAPH_PASS`及唯一保留Prefab UUID。`SMOKE_REPORT.md`和`u01-final-build-identity.json`证明该同版资产由Creator 3.8.8导入、构建exit36并在实际IAB运行通过。|
|U01四层PNG/Prefab/Controller身份链保留|PASS（静态）|四PNG SHA/meta子UUID、Prefab SHA/UUID/四层依赖和Controller UUID均与资源登记相符。|
|旧菜单与示例实现/README活动说明清理|PASS|Gallery与README仅列U01。11个无活动引用的专属旧Demo工具按授权备份/删除；保留Web服务工具与历史文档。70项旧素材路径删除为预存基线，未记成本轮新增删除。|
|Creator 3.8.8导入、反序列化及脚本编译|PASS|`evidence/SMOKE_REPORT.md`、`u01-final-result.json`及`u01-final-out.log`：Creator 3.8.8隔离快照构建完成，exit 36，17.371s；当前源assets与快照逐项字节相同，实际U01运行加载成功。|
|Web Mobile构建及HTTP实际产物内置浏览器交互|PASS（实现级冒烟）|`evidence/SMOKE_REPORT.md`与9张`u01-final-*.png`：唯一菜单、进入、+/-、拖动、重置、UI隔离、返回、重入通过；console errors=[]。旧失败截图保留用于追溯。|
|本Task之外的正式QA|NOT_TESTED（范围外）|本Client实施Task未执行正式QA、未生成TEST_REPORT。获批QA Plan当前覆盖范围为用户批准的Web浏览器模拟手机矩阵及适用性能检查（指标/方法须获批）；原生/实体设备和原生容器不在当前QA Plan范围，结论为NOT_TESTED，不称其已获后续批准。|

## 待完成门禁

同版Creator导入、构建、内置浏览器实现级冒烟及资源逐路径核账均已记录，当前交给同版专业Review。正式QA仍须等待实现Artifact用户批准并由独立QA Task执行；其范围按已批准QA Plan限定于获批Web模拟手机矩阵及适用性能检查。原生/实体设备与容器不在当前计划范围，保持NOT_TESTED。本报告的实现级冒烟不替代上述正式QA。
