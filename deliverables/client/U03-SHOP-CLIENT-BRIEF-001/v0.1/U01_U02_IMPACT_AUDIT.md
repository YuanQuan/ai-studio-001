# U03 对现有 U01 / 计划 U02 的只读影响审计 v0.1

审计日期 2026-10-06。仅检查工作区现存文件，未修改 Cocos Scene、Prefab、脚本或图像。下表 SHA-256 锁定本次只读快照；实施开始前需重新核差异和实际文件哈希，保护并行工作。

| 现有文件 | 本次 SHA-256 | 观察 |
|---|---|---|
| `apps/client/assets/UnitSampleGallery.ts` | `E386517D47FFCDD8B12ECE302152810CF46DB2A6D72D4169DC0F7A844C68F79D` | `onLoad` 建 720×1280 `FIXED_WIDTH` 菜单，仅一项 U01；全局 `MOUSE_DOWN/UP` 与按钮 `TOUCH_END` 并存。`clearPage` 销毁旧页。 |
| `apps/client/assets/UnitSamples.scene` | `68E1121AD5552D97897DFFC066CC6A7CA735FF51DEC8905AFB4CA0802881A76A` | Gallery 的 `streetBasePrefab` 序列化引用 `2d697fb3-01f0-4330-a180-a9c162310bf8`；未见 U02/U03 店或游客引用。 |
| `apps/client/assets/labs/menu/scene1_camera_controller.ts` | `64A3CE41176FC802E2B9AF18FE656F694FF838AC561392D5BCFADAFBE417D8BA` | U01 Controller 自有全局鼠标/触控订阅，销毁/禁用时解绑；四层、拖动、捏合、滚轮与返回逻辑属于 U01。 |
| `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab` | `2DF15D9D1820F4AD9EBC408DC369F191C27157936CEA3DAB5E18D227A4038ED2` | U01 四层 Prefab 已存在；主 UUID 与 Scene 引用一致。 |

本次 `rg --files apps/client/assets` 未发现 U02 游客或 U03 店铺正式资产/脚本/Prefab 路径。U02 有单独已批 Product/Art Gate1/Tech/UI/Client 设计，但这不构成现有 Creator 实例。实施时不能假设 U02 已接入；需核当时分支与用户批准记录。如果 U02 先实现，Gallery 承载 U01/U02/U03 三张入口并保留各自页面状态；如果尚未实现，U03 只在 U01 旁新增入口，菜单结构预留不等于偷做 U02。未来 U02 与 U03 并行修改同一 Gallery/Scene 时由 Master 排序集成和回归，Client 不覆盖另一任务的未审工作区差异。

U01 保护线：保留四层 `STREET_BASE_01` Prefab 的 UUID、纹理内容、Prefab 依赖与 Scene 引用；不改 `Scene1CameraController` 的 `calculateScene1Bounds`、`EDGE_GUARD=2`、四层视差比、拖缩/重置/返回语义。Gallery 的 `sceneControls` 透明空隙目前留给拖动，新增菜单按钮或 U03 页面捕获区不得覆盖 U01 视口。`layoutScene()` 当前按 `visibleSize`、`visibleOrigin` 和 `safeAreaRect(false)` 定位 U01 控件，U03 布局应另加本页分支，不复用 `sceneViewport` 引用导致 U01 位置变化。菜单短窗口下移规则也需实测多入口可达性，不能仅复制单 U01 布局。

输入回归线：当前 Gallery 通过 `menuMouseDown` 记录按下节点，再在全局鼠标抬起判同节点命中；`button()` 又注册 `TOUCH_END`。未来多入口不能只把 `menuEntry` 改为数组而保留两路各自导航。统一激活与跨输入去重后，分别测真实鼠标、触控、拖出再抬起、控件禁用、返回重入；一次物理动作只导致一次页面转移或一次序号步进。U01 Controller 的全局监听只在其页有效；U03 页面不接 U01 镜头拖缩，也不让返回/切换事件穿透至旧控制器。

后续最小回归：U01 进出、四层顺序、左右极值无露边、拖动/捏合/滚轮/重置、按钮之间空隙可拖、返回后再入；U03 六店单店/循环/快切/错误/重入及竖屏安全区；若 U02 届时已上线，按其获批四动作、装扮、朝向、重置/返回范围执行其既有回归。三项单元菜单应显示实际已实施范围，旧 U01–U09 实验入口不恢复。当前只读审计不提供上述运行 `PASS`。
