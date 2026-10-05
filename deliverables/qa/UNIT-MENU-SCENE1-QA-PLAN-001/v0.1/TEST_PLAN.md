# 单元示例1四层场景 Web 测试计划 v0.1

## 任务与依据

- Task：`UNIT-MENU-SCENE1-QA-PLAN-001`；阶段：`FUNCTIONAL` 计划设计，当前不执行测试。
- 产品验收：`UNIT-MENU-SCENE1-SCOPE-001 v0.1`，`ACCEPTANCE.md` 的 S01–S09。
- 切图：`UNIT-MENU-FOUR-LAYER-CUT-001 v0.3`，`USER_REVIEW_PACKET.md`；对应审批记录为 `USER_APPROVED`。
- 技术：`UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.2` 的 `TECH_RUNTIME_SPEC.md`、`PERFORMANCE_GATE_IMPACT.md` 和 `RESOURCE_PATH_AND_NAMING_SPEC.md`；对应审批记录为 `USER_APPROVED`。
- 资源登记：`project/ASSET_HANDOFF_REGISTRY.md`。它记录美术实际路径及哈希、拟议 Creator 路径；当前正式工程文件、`.meta`、UUID 和运行构建均未创建。
- 测试范围决定：`DEC-UNIT-MENU-WEB-TEST-005` 与 `CP-UNIT-MENU-WEB-TEST-GATE-002`。现阶段对象为 Web 浏览器中的多个模拟手机竖屏分辨率。
- Client 交叉 Review：已对照草案 `deliverables/client/UNIT-MENU-SCENE1-CLIENT-BRIEF-001/v0.1/FEATURE_BRIEF.md` 完成范围/预期/证据一致性 Review，见 `CLIENT_REVIEW.json`，结论 `APPROVED`。该 Feature Brief 仍未获用户批准，仅作同阶段一致性评审输入；本计划不以旧 Client Brief 代替。
- QA 规则：`rules/qa_protocol.md`（`studio-workflow-v2-policy`）。

## 目标与边界

计划将来验证示例1获批四层固定背景、水平视差、缩放与边界、重置、UI 输入隔离，以及资源版本映射。执行环境为 Web 构建，在获批的浏览器/操作系统与多个模拟手机竖屏视口中运行。至少需覆盖 720×1280 设计比例及一个不同竖屏比例；具体尺寸、浏览器/版本、OS、DPR、模拟方式、安全区假设和渲染后端，须在运行验收前形成版本化矩阵并经用户批准。

本计划不锁定具体候选视口、浏览器、DPR、倍率上限、性能阈值、采样时长或允许降级。Tech/Client/QA 后续提交矩阵与性能预算，批准前只能记录原始值，性能达标结论为 `NOT_TESTED`。不要求或执行实体手机、微信/抖音小程序容器、发布平台和实际弱网测试；这些范围不能由 Web 模拟结果推断。

当前完成的是规格覆盖审查和测试设计。Creator 功能、浏览器模拟分辨率下的运行视觉、输入、资源导入兼容性和性能都尚未实测，不生成测试报告或运行 `PASS`。S07/S08 是未来第4/7项接口；本次只核对边界设计，不执行或伪造其对象开关/组合运行结果。

性能实测与功能/视觉结果分开记录，预设未来用例 `SC1-PERF-001`：按获批方案测量冷启动/加载、静置及固定拖缩/重置样本，并保留可取得的原始 Profiler 数据。当前性能基线、矩阵、工具、采样时段/次数与硬阈值均未锁定，运行前另审；此项当前 `NOT_TESTED`。

## 开始运行前须锁定

1. 可复现的 Web 构建 commit/hash、Creator 精确版本、获批四张 PNG 的源版本/hash，以及 Client 导入后的路径/hash/UUID 登记记录。
2. 浏览器名称与完整版本、宿主 OS、渲染后端；每个模拟竖屏的逻辑视口尺寸、DPR、设备模拟方式、安全区/浏览器 UI 扣除方式。矩阵至少有设计比例和另一种不同竖屏比例。
3. 鼠标、滚轮、模拟单指和双指输入的工具/事件来源及是否支持多点模拟；不能将模拟触控称为实体触摸。
4. 测试场景入口、冷/热加载定义、手势路径、各倍率边界、重复次数、采样时长和截图/录屏命名规则。
5. 性能预算：适用指标、采样工具、基线、重复方法、硬阈值及容差。示例指标可包括帧时间/FPS、DrawCall、纹理实际格式、加载耗时、可取得的内存信息；本计划不为指标填入目标值。
6. 对 S03 的位置数据导出方式，以及获批测量容差。Tech v0.2 提出的“至少100逻辑像素取样、公式偏差≤1逻辑像素”是待批技术建议；未由后续 Client/Tech 和用户锁定前，不作为正式判定阈值。

## 用例组织与证据

客户端逐项用例见 `CLIENT_TEST_CASES.md`。视觉检查点见 `VISUAL_QA_CHECKLIST.md`。每条执行记录须填测试构建、矩阵项、资产 ID 与源/工程哈希、操作步骤、结果和证据路径；缺环境或输入无法复现时记 `BLOCKED`，未运行记 `NOT_TESTED`。不得用源 PNG 存在、规格公式成立或代码审阅代替 Creator/Web 实测。

Client 最新方案将场景职责明确为：Gallery 只提供进入/退出导航，四层画面及镜头运行在独立 `scn_unit_menu_scene1` 场景。运行用例从 Gallery 导航进入该场景；此结构调整不增加产品范围，也不改变 S01–S09 的预期。

运行前核对四项图像的稳定 ID、来源目录/文件名和 SHA-256：

| 稳定 ID | 美术源文件 | SHA-256 | 计划 Creator 文件（非实际路径证明） |
|---|---|---|---|
| `STREET_BASE_01_L01` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/01_01_94477409.png` | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1` | `apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png` |
| `STREET_BASE_01_L02` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/02_02_933386cf.png` | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478` | `apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png` |
| `STREET_BASE_01_L03` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/03_03_23db4183.png` | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d` | `apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png` |
| `STREET_BASE_01_L04` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/04_04_c82fb659.png` | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b` | `apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png` |

对每项比较登记表与实际工作树/导入工件，记录源、目标 SHA-256；确认目标 PNG `.meta` 中 image UUID、Texture2D UUID、SpriteFrame UUID 各自字段及键名，以及 Prefab UUID、依赖和 Scene 实例。实际导入前工程路径和所有 UUID 均保持空缺/`PLANNED_NOT_IMPORTED`，不得在计划或结果中伪造。PSD `moonlit_four_layers.psd` 与 `overall_from_psd.png` 仅为母版/审核基线，不是运行贴图。

## 视觉评审与结果门禁

视觉证据按锁定的 Web 矩阵项采集初始桥景、拖动过程、左右边界、倍率边界、复位与 UI 交互截图/短录屏，包含视口/DPR/构建元数据。与 Gate2 v0.3 具体批准的资源版本及同尺度效果核对。QA 检查可见事实和版本一致性；Art 对关键画面差异作视觉判断，Tech 核对实现/测量，自动差异只用于发现候选偏差。用户已直接审核批准切图，本阶段不另设切图效果环境复审门禁。

正式功能结果、视觉结果、性能结果分别记录。P0/P1 按既有规则阻塞；P2 明列。矩阵或预算未批准时相应覆盖/性能保持未测，不能汇总为整体 `PASS`。未来发布平台、实体设备与容器结果保持 `NOT_TESTED`，除非另有批准任务和实测证据。

## 明确排除

- 七菜单其他单元、独立店铺/角色/道具/特效，及第4/7项实际功能与组合运行。
- 实体手机、手机操作系统/芯片/内存差异、微信/抖音小游戏容器和发布平台。
- 实际弱网、断线/重连专项、服务端/API/持久化测试。
- 广泛无关回归，以及未获批浏览器/分辨率矩阵之外的平台兼容性声明。
