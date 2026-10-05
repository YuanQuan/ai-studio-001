# 单元示例1客户端接入实施报告 v0.1

任务：`UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001`
输入：Product S01–S09、Gate2 v0.3、Tech Runtime v0.2、Client Brief v0.1、QA Plan v0.1（均为已批准输入）
报告状态：`BLOCKED_CREATOR_IMPORT`（完整实现未交付，不进入用户审核）

## 当前已落盘

1. Gate2 v0.3 的四张 PNG 已逐字节复制到 `apps/client/assets/units/background/textures/`。四个目标 SHA-256 与获批源文件一致，仍为 `2172×724 RGBA`。复制没有裁切、调色、压缩替换或改写像素。
2. 新增 `apps/client/assets/labs/menu/scene1_camera_controller.ts`，实现 `{cameraX,z}` 状态、`zMin=1.00/zMax=1.80`、四层 `[0.3,0.8,1,1]` 水平位移系数、边界夹取、鼠标拖动/滚轮缩放、触控单指拖动/双指缩放、重置、UI 控件捕获、取消/切换手势清理和视口变化重算。每次重算从 `SceneViewport` 的 `UITransform.contentSize` 取得有效逻辑尺寸，并计算 `coverScale=max(width/2172,height/724)` 与可见源宽度；鼠标/触控点先转到该节点本地逻辑坐标，再驱动与其同坐标系的背景层。触控监听改为全局 `input` 事件：任何新触点落在 UI 捕获区或视口外会立即取消当前手势；第三指、鼠标/触控模式切换、触点结束、取消及移出视口也清除全部旧手势基准。`SceneViewport` 尺寸变化通过 `Node.EventType.SIZE_CHANGED` 监听器触发重算并夹取相机位置。安全区需由 SceneViewport 的锚点/尺寸布局体现；当前 Scene 未创建，因此安全区几何尚未运行核实。控件监听和全局监听在停用时按原 callback/context 成对解除。
3. `apps/client/assets/UnitSampleGallery.ts` 增加 U10「四层场景镜头」入口，只负责导航到 `scn_unit_menu_scene1`；独立 Scene 和共用 Prefab 尚未真实创建。
4. `project/ASSET_HANDOFF_REGISTRY.md` 已如实标注四张 PNG 为“目标文件已复制、SHA 已核、Creator 导入阻塞”，image 主 UUID、Texture2D/SpriteFrame 子 UUID、Prefab UUID 和 Scene 引用均未填。

本轮的实际执行顺序为：核对正式 Task 与已批准输入 → 逐字节复制并比较四张源/目标 SHA-256 → 尝试用 Creator 3.8.8 打开同一 `apps/client` 工程 → 检查 Creator 窗口/日志/`.meta` → 编写镜头控制器及 U10 路由 → 按 Tech 首轮 Review 的两项 BLOCKED 发现修正视口逻辑坐标与全局触控捕获 → 根据 Tech 复审提示补回覆盖缩放公式 → 重跑 Creator 随附 tsc → 回填资源登记和本报告。没有在缺失 `.meta` 时手造 Scene/Prefab 序列化或写 UUID。

## Creator 导入阻塞

Creator 版本为 3.8.8。先前通过项目参数 `--project D:\work\ai-studio-template\ai-studio-001\apps\client` 启动时，日志证据显示 engine plugin 加载遇到 ProgramData 下 `resources\3d\engine\bin\.cache\dev\editor\import-map.json` 的 `EPERM` 写入失败，之后反复出现 `query-engine-info` 消息缺失；目标 PNG 未生成 `.meta`。

2026-10-05 19:37，Master 另启动 PID 43180，参数包含 `--user-data-dir=apps/client/temp/codex-cocos-user-data --project apps/client`。检查时该 PID 仍在运行但 `MainWindowHandle=0`；同一时段的 Creator 进程也无窗口句柄，纹理目录没有 `.meta`。读取 `apps/client/temp/logs/project.log` 被操作系统拒绝访问，CUA 返回 `apps=[]` 并报请求失败。因此目前无法确认 PID 43180 是否完成项目打开/索引，亦无真实导入证据。

已测内置 engine/resources 目录总量约 2.39 GB；复制完整引擎不是本任务可接受的轻量缓存绕行方案。未尝试管理员权限、未扩大系统目录写权限，也未伪造 UUID。阻塞解除后须由 Creator 实际导入 PNG 并生成 `.meta`，再完成 Prefab、独立 Scene 与资源引用配置。

## 源码检查与验证边界

使用 Creator 安装包随附 TypeScript 编译器执行：

```text
node C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\bin\tsc --noEmit --skipLibCheck -p apps/client/tsconfig.json
结果：exit code 0
```

未加 `--skipLibCheck` 时，编译器报告 Creator 随附引擎声明文件内部缺失/不匹配类型；本地源码的类型检查在跳过第三方声明检查后通过。此项不是 Creator 构建、编辑器打开、Web 预览或运行验证。

| 验证项 | 状态 | 证据边界 |
|---|---|---|
| 四张复制文件 SHA-256 | `PASS` | 与 Gate2 v0.3 原图逐件一致；仅证明字节复制完整 |
| TypeScript 源码检查 | `PASS` | Creator 随附 tsc、`--noEmit --skipLibCheck`；不证明 Creator 构建 |
| Creator `.meta`、UUID 与导入设置 | `BLOCKED` | 无 `.meta`；不填主 UUID 或子 UUID |
| `STREET_BASE_01` Prefab / 独立 Lab Scene | `BLOCKED` | 尚未在 Creator 创建或验证序列化资源 |
| Creator 编辑器构建/打开冒烟 | `BLOCKED` | 无可见窗口或可读日志证据 |
| Art Review v0.1 | `BLOCKED` | 确认静态资源映射与四图 SHA 一致；因缺 Creator 导入、Prefab/Scene 与运行画面，不能完成整项视觉接入 Review |
| Tech Review v0.1 | `BLOCKED` | 首轮视口与第二触点源码问题已静态修订，复审确认 coverScale 与 tsc；Creator 导入、节点绑定、安全区/事件路径仍待实际验证 |
| QA Review v0.1 | `BLOCKED` | 认可已批准 QA 方案的可测性设计；Creator 工程/场景不存在，不能执行实现用例；运行矩阵与预算继续待后续批准 |
| Web 运行、不同模拟视口与 DPR | `NOT_TESTED` | 正式 QA 未解锁；未执行 QA 用例 |
| 性能预算与正式 QA 报告 | `NOT_TESTED` | 未运行正式 QA，不生成 TEST_REPORT |

## 改动范围与回滚

变更仅涉及示例1四张目标 PNG、镜头控制器、Gallery U10 路由、资源交接登记和本报告。没有修改其他单元行为、服务端/API、图像像素或已批准产品范围。回滚时删除上述新增控制器与复制 PNG，撤回 Gallery 的 U10 路由和登记表中的本次状态记录；待实际 Creator 资源建立后，还需一并回滚相应 Prefab、Scene 与 `.meta` 文件。

本次可审阅输出的精确路径为：

- `apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png`
- `apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png`
- `apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png`
- `apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png`
- `apps/client/assets/labs/menu/scene1_camera_controller.ts`
- `apps/client/assets/UnitSampleGallery.ts`
- `project/ASSET_HANDOFF_REGISTRY.md`
- `deliverables/client/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/v0.1/IMPLEMENTATION_REPORT.md`
- `deliverables/client/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/v0.1/DELIVERABLE.json`
- `deliverables/client/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/v0.1/ART_REVIEW.json`
- `deliverables/client/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/v0.1/TECH_REVIEW.json`
- `deliverables/client/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/v0.1/QA_REVIEW.json`
- `deliverables/client/UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001/v0.1/MASTER_REVIEW.json`

本次任务整体状态为 `BLOCKED`：源码和四份图片的内容校验已经完成，Creator 导入/序列化输出缺少可确认编辑器窗口、索引日志及真实 `.meta` 输入。四个 Creator 纹理 `.meta`、控制器 `.meta`、Prefab、独立 Scene 和其 `.meta` 均尚未生成；没有把缺失项写成已交付。

## 资源目录与命名追溯

已批准的统一路径与命名规则见 `deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/RESOURCE_PATH_AND_NAMING_SPEC.md`。项目登记表 `project/ASSET_HANDOFF_REGISTRY.md` 保留四张图的稳定 ID、内容描述、美术交付目录/文件名/SHA-256、计划 Creator 目录/文件名和实际文件哈希对照；当前工程路径均按批准的 `tex_street_base_01_l0x_<description>.png` 规则命名。Creator 实际 `.meta` 导入字段明确待补：image 主 UUID、Texture2D/SpriteFrame 子 UUID与资源键、Creator 导入设置、Prefab UUID、Scene 引用及实际导入路径/版本。由于没有真实导入数据，此部分只完成映射登记，未完成实际身份链。

## 交接

同版 `ART_REVIEW.json`、`TECH_REVIEW.json`、`QA_REVIEW.json` 与 `MASTER_REVIEW.json` 均已落盘并给出 `BLOCKED`。Art 认可静态源图映射与 SHA 核对，待运行场景核视觉层序与画面；Tech 确认视口本地尺寸、coverScale、UI 第二触点源码修订、`SIZE_CHANGED` 监听及 tsc 结果，待 Creator 核资源、节点、安全区和事件路径；QA 认可用例计划可测性，未运行测试或产生 TEST_REPORT。安全区须由 SceneViewport 几何布局表达，待 Scene 在 Creator 建立后核验。由于 Creator 资源及引用链缺失，本报告不能作为完整实现验收；仍须补交 Prefab、Scene、真实 UUID/导入设置、Creator 冒烟证据和同版专业续审、Master 复核，再由 Producer 核送下一用户门禁。当前整体保持 `BLOCKED`，不申请用户审核或 DONE。
