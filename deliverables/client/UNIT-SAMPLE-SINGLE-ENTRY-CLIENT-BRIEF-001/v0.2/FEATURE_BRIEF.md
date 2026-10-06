# 客户端功能概要｜唯一 U01 示例与旧资源清理 v0.2

Task：`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-BRIEF-001`。版本：v0.2 Revision。v0.1及其所有Reviews保留为历史；Tech Review v0.1为`CHANGES_REQUESTED`，指出Creator属性顺序不明确及文件计数需补足。当前版本待 Product、Art、Tech、QA、Master 同版 Review 与用户审批。产品范围 `UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2` 和技术方案 `UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001 v0.1` 已登记 `USER_APPROVED`，作为本概要输入。本文件是编码前实施边界；它本身不授权代码、场景、资源或项目说明改动。

本 Task 首轮实际开始于 **2026-10-06 13:14:09 +08:00**。v0.2 Revision 于 **2026-10-06 13:22:01 +08:00** 开始，证据为读取 Tech Review v0.1 `CHANGES_REQUESTED`，按意见重排 Creator 序列化属性清理顺序并重核旧 tracked 路径数量。Revision 只修改本 Client Brief Task 的文档和流程记录，不改工程代码/场景/资产。

## 1. 目标与范围

目标是在后续另行批准并解锁的 Client 实施任务中，将 `apps/client/assets/UnitSamples.scene` 的四层场景镜头示例作为唯一 U01。菜单可见文案按批准产品范围固定为：

- 标题：`U01 四层场景镜头`
- 说明：`查看四层场景视差，并拖动、缩放或重置镜头。`
- 唯一入口：`进入 U01`

保留四层背景、共用 `STREET_BASE_01` Prefab、镜头控制器、获批拖动/缩放/重置语义，以及同场景返回菜单与重复进入流程。清除旧九项实验的菜单数据、旧实现分支、场景节点/序列化引用、退役文案与仅供旧实验的运行资源。所有资源删除都以实际交叉引用证据为前提。

不改已批准的四层画面或镜头语义；不建独立 Lab Scene；不把另一套已批准七项正式内容接入新入口；不做 Server/API、存档/schema、VFX、新依赖、性能指标扩展或美术重制；不删除历史任务、Review、审批、变更和测试事实。当前 Brief Task 只产出规划 Artifact，不实现上述内容。

## 2. 现有能力复用

- 复用 `apps/client/assets/UnitSamples.scene` 作为唯一 Scene 与已有 `UnitSampleGallery` 组件承载，不另建 Scene。
- 复用 Gallery 当前四层页面的 `STREET_BASE_01` Prefab 实例化、四个命名图层查找及 `Scene1CameraController` 接入方式；实际实现需按获批 U01 语义改菜单路由/文案，不把当前 U10 标签或旧九项菜单逻辑视为新基线。
- 复用 `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab`、其四张批准 PNG 和 `apps/client/assets/labs/menu/scene1_camera_controller.ts`。当前 `.meta`/UUID 与登记的静态对应关系列于 `RESOURCE_CLEANUP_CHECKLIST.md`。
- 不新建共享 UI/输入/镜头组件。返回、重置和缩放按钮沿用现有页面内控件；控件区域需继续从镜头拖动输入中隔离。

## 3. 结构设计

目标依赖保持为：

`UnitSamples.scene → UnitSampleGallery → STREET_BASE_01 Prefab → 四张 PNG SpriteFrame`

`UnitSampleGallery → Scene1CameraController`

后续实施建议顺序：先完成已获批实施任务的工作区基线检查；在 `UnitSampleGallery.ts` 的 `frames: SpriteFrame[]` 属性仍声明且 Creator 可识别时，使用 Cocos Creator 清空场景序列化 `frames` 数组、退役样例节点/Prefab/TMX引用；保存场景、关闭并重开工程，确认21项旧帧和所有退役场景引用已清空且四层Prefab引用完整。**通过该检查前不得移除 `frames` 属性或其旧消费者代码。**通过后再移除 Gallery `frames` property、旧 `this.frames[...]` 消费者和旧样例代码，刷新/编译并由 Creator 再保存、关闭重开，确认没有未知属性、missing UUID或残留旧引用。不得手工编辑 `.scene` JSON。满足引用和归属删除条件后，再处理旧资源及旧 DemoScene 工具候选。详细逐项清单及遇错停机规则见 `RESOURCE_CLEANUP_CHECKLIST.md`。

如果 Creator 无法载入当前仍含缺失资产引用的场景，实施任务必须记为 `BLOCKED`，保存可核对错误信息并交 Master 处理。不得手工改写 `.scene` JSON 或删除 `.meta` 掩盖 missing 引用。此 Brief 不提前执行上述步骤。

## 4. 协议与平台影响

无网络/API/Proto/存档/服务端接口或持久化格式变化。无新增平台 SDK 或适配器。延续 Cocos Creator 3.8.8 当前工程与已批准桌面/Web Mobile检查边界；Creator 当前打开、构建配置和运行状态均未在本 Task 测试，不作通过声明。目标平台外的真机兼容不从桌面构建推断。

## 5. 性能影响

设计本身不增加后台 `update`、计时器、事件循环、对象池或特效。唯一 U01 运行时仍实例化一份四层背景并由已存在 Controller 操作四层节点；菜单返回后应销毁/清理本次运行页与控制器，重复进入不得累积背景实例、监听器或 UI 节点。后续实施验证记录实例数/监听器生命周期和构建结果；产品未定义 FPS、DrawCall、内存阈值，本 Brief 不新增数值验收门槛。四张 2172×724 PNG 与既有 Prefab 设置不换图、不改图集、不移动资源。

## 6. 日志与调试

继续使用当前 `UnitSampleGallery`、Creator Console 与场景预览作为调试入口，不添加正式 Lab 或独立调试场景。若运行缺少 Prefab 或图层结构异常，应留下中文可理解错误/状态和 Creator Console 证据；不要以空状态或忽略 missing UUID 继续验收。历史功能调试代码和对旧 demo 路径的工具由后续实施按 Checklist 逐项核调用后处理，不在当前 Brief Task 操作。

## 7. 测试与验证计划

本 Task 不执行实现测试、Creator导入、构建或 QA。获批的后续 Client实施任务须留下以下证据，并标明 Creator 版本、目标构建与结果：

1. 静态检查：菜单唯一且文案符合基线；Gallery 无旧 U01–U09 菜单/分支/旧可见文案；已完成 Creator 序列化清理后才移除 `frames` 属性/旧消费者。场景无旧帧、Prefab、TMX UUID和失效组件；活动工程引用扫描覆盖脚本、Scene、Prefab、构建入口与 README，历史文档命中单独说明。
2. Creator：保持脚本 `frames` property 可识别，先在 Inspector 清空21项序列化值及旧节点/Prefab/TMX引用；保存、关闭、重开并核无残留后，才改代码移除 property/消费者。代码变更后再刷新/编译，通过 Creator 保存场景、关闭/重开并复核无 unknown property/missing UUID，四层 Prefab身份仍在。
3. TypeScript/构建：执行 Creator TypeScript 编译与 Web Mobile 构建，保存日志与构建版本信息。
4. 运行：检查唯一菜单标题、说明、按钮和页面全部可见文字；进入后显示四层背景；返回同一菜单；重复进入不重复实例；水平拖动、滚轮/按钮缩放、重置恢复初始状态；按钮交互不误触镜头拖动。保存菜单/运行/返回画面或录屏与引用清单。
5. QA：实际 QA 覆盖范围、测试矩阵、设备和结果由独立获批 QA Task 决定。Client 不代替 QA 执行报告或扩展测试范围。

上述均为未来验证计划，当前均为 `NOT_TESTED`。若 Creator 无法载入或不能可靠保存引用解除结果，记录 `BLOCKED`，不得以静态 JSON 编辑补足运行证据。

## 8. 风险与 Tech Lead Review

- 工作区已有 DemoScene/demo 删除，而当前 UnitSamples 场景仍指向旧 PNG/Prefab/TMX；不能把预先删除误判为已完成安全清理。精确状态、序列化 UUID 和保留身份链见 `WORKSPACE_BASELINE_AND_VALIDATION.md` 与 `RESOURCE_CLEANUP_CHECKLIST.md`。
- Creator 是否仍能编辑/保存已丢失的旧资源引用依赖 `frames` property继续被脚本识别；因此必须先由 Creator 清空序列化引用并保存/关闭重开，再移除脚本property与旧消费者代码。若场景无法载入或不能证明第一阶段保存成功则 BLOCKED。
- 资源目录、文件名、旧 `.meta` 或历史字符串命中本身不足以决定删除；共享引用/构建入口/Creator需要的资产必须先调查，未核清保留并上报。
- Client 静态 Review 已确认四层资源身份链需保留；本 Brief Task 仍须 Product、Art、Tech、QA 与 Master 同版 Review，用户批准本 Brief 后只形成 Client实施边界审批，仍需 Master 新建/解锁具体 Client 实施Task。实施/删除/QA 不因本 Brief 自动获批。

