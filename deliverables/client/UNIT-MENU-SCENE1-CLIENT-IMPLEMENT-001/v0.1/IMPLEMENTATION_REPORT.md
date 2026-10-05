# 单元示例1客户端接入实施报告 v0.1

任务：`UNIT-MENU-SCENE1-CLIENT-IMPLEMENT-001`
输入：Product S01–S09、Gate2 v0.3、Tech Runtime v0.2、Client Brief v0.1、QA Plan v0.1（均为已批准输入）
报告状态：`BLOCKED_PREFAB_SCENE_AND_EDITOR_EVIDENCE`（四图Creator身份/Library全画布几何已静态核验；Prefab/Scene、可见编辑器及构建运行证据未完成）

## 当前已落盘

1. Gate2 v0.3 的四张 PNG 已逐字节复制到 `apps/client/assets/units/background/textures/`。四个目标 SHA-256 与获批源文件一致，仍为 `2172×724 RGBA`。复制没有裁切、调色、压缩替换或改写像素。
2. 新增 `apps/client/assets/labs/menu/scene1_camera_controller.ts`，实现 `{cameraX,z}` 状态、`zMin=1.00/zMax=1.80`、四层 `[0.3,0.8,1,1]` 水平位移系数、边界夹取、鼠标拖动/滚轮缩放、触控单指拖动/双指缩放、重置、UI 控件捕获、取消/切换手势清理和视口变化重算。每次重算从 `SceneViewport` 的 `UITransform.contentSize` 取得有效逻辑尺寸，并计算 `coverScale=max(width/2172,height/724)` 与可见源宽度；鼠标/触控点先转到该节点本地逻辑坐标，再驱动与其同坐标系的背景层。触控监听改为全局 `input` 事件：任何新触点落在 UI 捕获区或视口外会立即取消当前手势；第三指、鼠标/触控模式切换、触点结束、取消及移出视口也清除全部旧手势基准。`SceneViewport` 尺寸变化通过 `Node.EventType.SIZE_CHANGED` 监听器触发重算并夹取相机位置。安全区需由 SceneViewport 的锚点/尺寸布局体现；当前 Scene 未创建，因此安全区几何尚未运行核实。控件监听和全局监听在停用时按原 callback/context 成对解除。
3. `apps/client/assets/UnitSampleGallery.ts` 增加 U10「四层场景镜头」入口，只负责导航到 `scn_unit_menu_scene1`；独立 Scene 和共用 Prefab 尚未真实创建。
4. Creator 3.8.8 已为四张 PNG 生成真实 `.meta`，image 主 UUID、Texture2D 子 UUID（键 `6c48a`）与 SpriteFrame 子 UUID（键 `f9941`）已登记。四图工程 SHA-256 与获批源一致；四份 SpriteFrame `.meta` 的 `trimType=none` 与最新 Library JSON 一致，均为 rect/originalSize `2172×724`、offset `(0,0)`。镜头脚本主 UUID也已登记。Prefab、Scene及其身份/引用仍不存在。

本轮的实际执行顺序为：核对正式 Task 与已批准输入 → 逐字节复制并比较四张源/目标 SHA-256 → 尝试用 Creator 3.8.8 打开同一 `apps/client` 工程 → 检查 Creator 窗口/日志/`.meta` → 编写镜头控制器及 U10 路由 → 按 Tech 首轮 Review 的两项 BLOCKED 发现修正视口逻辑坐标与全局触控捕获 → 根据 Tech 复审提示补回覆盖缩放公式 → 重跑 Creator 随附 tsc → 回填资源登记和本报告。没有在缺失 `.meta` 时手造 Scene/Prefab 序列化或写 UUID。

本次继续执行顺序为：核验四图与控制器 `.meta` 主/子 UUID → 对照批准源逐图复核工程 PNG SHA-256 → 重读四份 Library SpriteFrame JSON及写入时间 → 逐项确认 rect/originalSize=2172×724、offset=(0,0)、Texture2D依赖UUID与 meta trimType=none一致 → 保留CLI隔离构建曾因CreateFile拒绝访问(0x5)后FATAL退出的记录（该尝试不是构建结论，且不认定其导致异步Library更新）→ 更新登记/报告/DELIVERABLE并复跑Creator bundled tsc。PNG内容未改动，Creator UUID均取自真实meta。

## Creator 重导与场景创建阻塞

Creator 版本为 3.8.8。此前启动时 engine plugin 在 ProgramData 下 `resources\3d\engine\bin\.cache\dev\editor\import-map.json` 写入遇到 `EPERM`，之后出现 `query-engine-info` 消息缺失。Master隔离用户数据目录重试后，2026-10-05 22:12 Creator为四张PNG与镜头脚本生成 `.meta` 和初次Library数据。其后四份 SpriteFrame Library JSON 的写入时间更新到 22:32:00；本轮直接逐项读取并确认完整 `rect=2172×724`、`originalSize=2172×724`、`offset=(0,0)`，并确认各自 texture 字段指向对应 `@6c48a` UUID。四张 `.meta` 的 `trimType=none` 与Library几何一致；四个工程PNG SHA-256均匹配获批美术源。

Creator与AssetDB资源身份及全画布几何映射已通过静态核验。对应Library JSON路径为 `apps/client/library/<UUID前两位>/<SpriteFrame UUID>.json`，四文件mtime均为 2026-10-05 22:32:00。控制器 `.meta` 主 UUID为 `9ceb8fd6-3853-4688-aeb0-c736616a614e`。后台Creator进程无可交互窗口句柄，故无法提供可见Editor打开证据；Prefab/Scene亦未创建。

2026-10-05 曾尝试以 Creator 3.8.8 CLI 对 `apps/client` 构建到隔离路径 `project://build/scene1-client-smoke`。进程日志出现 `CreateFile: 拒绝访问 (0x5)`、随后 `FATAL ... 拒绝访问 (0x5)` 和 crashpad 自终止；隔离 build 输出目录未生成。后续Library JSON在22:32:00呈现完整几何，但没有证据将其归因于此失败的CLI进程。该CLI尝试明确失败，不能视为Creator构建/运行验证通过。当前无可交互Editor窗口，未重复启动。

剩余可复验Creator步骤：在有交互窗口的Creator 3.8.8中打开同一 `apps/client`，核对四个SpriteFrame Inspector的 Trim Type= None 和Library JSON现状；创建/保存 `STREET_BASE_01` 共用Prefab与独立Scene `apps/client/assets/labs/menu/scn_unit_menu_scene1.scene`，确认四层依赖引用与Scene节点/安全区布局，并留存 `.meta` 和可见编辑器证据。当前没有可交互窗口，因此Prefab/Scene及Editor冒烟验证仍阻塞。

CLI失败记录仅用于说明此次命令行构建未成功；四图的Library几何已由后续AssetDB文件静态核验。未尝试管理员权限、未扩大系统目录写权限，也未伪造UUID。剩余阻塞是Creator可见Editor中的Prefab/Scene创建与打开/构建验证。

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
| Creator `.meta`、UUID 与Library几何 | `PASS` | 四图真实主/子UUID、hash、trimType=none、Library完整2172×724矩形/原始尺寸、offset=(0,0)已逐项静态核验；不代表Creator可见Editor或运行验证 |
| `STREET_BASE_01` Prefab / 独立 Lab Scene | `BLOCKED` | 尚未在 Creator 创建或验证序列化资源 |
| Creator 编辑器构建/打开冒烟 | `BLOCKED` | 无可交互窗口；一次隔离CLI build因CreateFile拒绝访问(0x5)后FATAL退出且无输出；该尝试不构成构建结论 |
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

本次任务整体状态仍为 `BLOCKED`：四图SHA、Creator真实meta身份与最新Library全画布几何映射均已完成静态核验，控制器源码类型检查通过；但共用Prefab、独立Scene、可见Creator编辑器证据及成功构建/运行验证尚缺。CLI build曾因访问拒绝崩溃，不作为构建结论。

## 资源目录与命名追溯

已批准的统一路径与命名规则见 `deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/RESOURCE_PATH_AND_NAMING_SPEC.md`。登记表保留稳定ID、描述、美术路径/hash、Creator实际路径/hash及四图主/子UUID和子资源键；命名符合 `tex_street_base_01_l0x_<description>.png`。四图Library几何与trimType=none已一致核验；待补项是Creator导入commit、Prefab/Scene及实际依赖UUID、可见Editor和运行证据。

## 交接

同版 `ART_REVIEW.json`、`TECH_REVIEW.json`、`QA_REVIEW.json` 与 `MASTER_REVIEW.json` 均已落盘并给出 `BLOCKED`。Art认可静态映射与哈希核对，待场景画面；Tech确认控制器源码修订及tsc结果，待Creator节点、安全区/事件路径和运行验证；QA认可计划可测性，未运行测试或生成TEST_REPORT。安全区待SceneViewport布局实测。四图Library几何现已静态核验，需Tech/Art据此更新各自Review结论；仍需Creator可见窗口创建Prefab/Scene并留证，之后Master复核。整体仍 `BLOCKED`，不申请用户审核或DONE。
