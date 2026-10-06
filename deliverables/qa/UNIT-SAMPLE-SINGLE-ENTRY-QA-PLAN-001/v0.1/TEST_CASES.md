# 唯一 U01 清理与运行验收用例 v0.1

范围来源：已批准 `UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2` AC-01–AC-10 和 `UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001 v0.1`。所有用例均为待执行设计，状态 `NOT_TESTED`；不得把静态扫描、旧 `UNIT-SAMPLES-001` 验证记录或本计划 Review 当作本次实现通过证据。

## 共通执行记录

每次执行记录 Task/用例 ID、测试者、日期、实现 commit/hash、工作区基线、Creator 精确版本、Web 构建标识/hash、浏览器/OS/渲染后端/模拟视口/DPR/输入方式（按获批矩阵）、资源登记版本、结果、缺陷 ID、日志/截图/录屏/扫描报告路径。实际值缺失写 `NOT_RECORDED`；未跑写 `NOT_TESTED`；环境/输入/工程阻断写 `BLOCKED`。

| 用例 | 追溯 | 前置与步骤 | 预期结果 | 必要证据 | 当前状态 |
|---|---|---|---|---|---|
| `U01-PLAN-BASE-001` | Tech 基线；AC-05/06 | 实施 QA 前留存 commit、`git status --short`、涉及路径的 diff、Creator 版本；同 Tech 审计的既有删除/修改清单逐项标注本次实施是否接收、修复或保留。 | 能区分预存工作区改动与本次实现；未批准/无关变更不会被计为本次清理结果。 | 基线文本、差异清单、文件状态及路径。 | `NOT_TESTED` |
| `U01-STATIC-MENU-001` | AC-01/04/05 | 静态检查 `UnitSampleGallery.ts`、`UnitSamples.scene` 与当前入口实现；搜索菜单数据、编号分支、文案和可运行路由。运行菜单并枚举入口。 | 只有 U01 四层场景镜头入口；不存在 U02–U10 或旧 U01–U09 运行入口/实现分支；批准标题、说明、按钮吻合，旧副标题/页脚和占位说明不再作为活动菜单文案。 | 源码扫描结果、菜单入口枚举、运行截图及场景状态。 | `NOT_TESTED` |
| `U01-VISIBLE-TEXT-001` | AC-01/04 | 在初始菜单、U01运行页、返回菜单和交互状态逐屏列出全部可见标题、说明、按钮、提示、脚注；和批准文案基线逐字/语义核对。 | 所有可见文字只描述 U01 四层场景与有效镜头操作；没有旧标题/副标题/页脚、旧编号/名称、四方向/特效占位或建筑/UI/角色/性能说明。 | 各状态截图/短录屏、完整可见文案清单及差异结果。 | `NOT_TESTED` |
| `U01-NAV-REENTRY-001` | AC-02/03 | 从获批 Web 入口进入 U01；返回 UnitSamples.scene 菜单；再次进入。首轮操作后改变相机，再退回重进；观察节点/Prefab 数量和初态。 | 同一场景承载菜单与 U01；进入显示获批四层和操作，返回到唯一菜单；重入恢复批准初始镜头和操作状态，不遗留旧手势或重复背景/控制器实例，引用完整。 | 环境矩阵、每步录屏、进入前后节点/实例计数、相机状态和控制台日志。 | `NOT_TESTED` |
| `U01-CAMERA-INPUT-001` | AC-03；获批 Tech 镜头语义 | 在获批输入环境执行水平拖动、缩放到批准范围内的边界与中间值、重置；从镜头操作控件开始点击/拖动，再从背景开始手势；覆盖松开/取消等已批准 Client 交互状态。 | 水平拖动、缩放、重置符合已批准参数及语义；重置恢复获批初始镜头；由菜单/UI 控件捕获的输入不误拖动画面；背景手势不误触 UI。不得采用 Client 草案中的未批候选参数作为阈值。 | 获批参数引用、输入事件/镜头状态日志、操作录屏和各状态截图。 | `NOT_TESTED` |
| `U01-OLD-SERIALIZED-REF-001` | AC-05 | 对实现后的 `UnitSamples.scene`、其引用 Prefab/资源及活动 Creator 场景数据扫描 RESOURCE_REFERENCE_CHECKLIST 中21个旧 SpriteFrame UUID、当前场景命中的8个不同旧 Prefab 主 UUID、TMX UUID和旧节点/属性；检查 Gallery 不再序列化/注入 `frames` 集合。另按全仓活动路径/UUID扫描单独检查第9个 `Keeper.prefab` 候选；它未命中当前场景，不得记为当前场景残留。 | 当前 `UnitSamples.scene` 中旧21帧、8个不同旧 Prefab 主 UUID、TMX 和旧节点/属性引用均已解除；全仓活动代码、Prefab及构建入口不再引用旧样例资源（包含对 Keeper 候选的独立判断）；唯一 `streetBasePrefab`、四 SpriteFrame 和 Controller 引用保留。历史文档和审批记录中的字符串可留存并须与活动路径结果区分。 | 扫描命令及范围/排除说明；逐UUID命中表分别标明当前场景命中或全仓候选；Creator 场景对象/引用检查。 | `NOT_TESTED` |
| `U01-RESOURCE-DELETION-001` | AC-05/06 | 对实际删除清单逐路径检查：来源状态（预存/本次）、旧样例专用依据、Client/Tech 引用核查、Creator 必要性、实施后全仓活动引用；对存疑项检查其是否被保留并记录理由。 | 只删除已证明仅用于旧九项的运行资源；没有活动代码、场景、Prefab、构建或 Creator 必要引用；未能证明可删的路径保留并记录阻塞。不将“路径在 assets/demo”或“工作树已缺失”本身作为证明。 | 删除/保留清单、逐项命中和归属证据、实施前后扫描差异、疑项清单。 | `NOT_TESTED` |
| `U01-CREATOR-IMPORT-001` | AC-02/05/07 | 使用记录的 Creator 版本打开工程，刷新/导入；打开 `UnitSamples.scene` 检查 Inspector/Console；保存、关闭并重开，再检查场景序列化、Prefab依赖和missing UUID。 | 工程及场景可解析；不报旧资源 missing UUID；四层图、Prefab、Controller 可导入/引用；不通过手工删除序列化数据掩盖导入错误。 | Creator 版本、导入日志、Console、Inspector/场景截图、保存重开后 Scene hash/引用检查。 | `NOT_TESTED` |
| `U01-WEB-BUILD-RUN-001` | AC-02/03/05 | 依据获批环境矩阵，在 Creator 编译客户端脚本并构建 Web Mobile；打开该构建从实际配置入口运行唯一 U01，执行菜单/进入/返回/重入和镜头基本流程。 | 编译/构建成功；实际启动入口不再暴露旧示例；唯一 U01 引用加载完整并可运行。构建成功本身不等于功能、视觉或性能全部通过。 | 构建日志/退出码、commit/构建 hash、实际 startScene/入口、浏览器矩阵、运行日志/录屏。 | `NOT_TESTED` |
| `U01-IDENTITY-CHAIN-001` | AC-02/07 | 对四张 PNG逐件算 SHA-256，对 `.meta`、Creator Library导入数据与登记核主 UUID、Texture2D/SpriteFrame 子 UUID、尺寸/trim/offset；核对 Prefab 主 UUID及四层 SpriteFrame 依赖、Controller主 UUID及 Scene 引用。 | 文件 hash、路径、稳定 ID、主/子 UUID、Prefab/Controller 引用和登记一致；与已批准版本一致；真实 Creator 导入状态另由 `U01-CREATOR-IMPORT-001` 判定。 | 命令原始输出、`.meta`/Library/Scene/Prefab字段、登记差异表及实际导入日志。 | `NOT_TESTED` |
| `U01-PROJECT-DOCS-001` | AC-08/10 | 对 `apps/client/README.md`、`project/unit_tests/UNIT_SAMPLES_v0.1.md` 和实现提交涉及的活动说明做差异核对；确认旧运行入口描述已更新或清楚标为历史，七项正式内容及历史说明边界仍在。 | 活动项目说明不再称退役九项是当前运行入口；批准七项产品内容、审批和历史记录不被删除/失效；历史文档如保留须清晰标示历史，不误作当前入口指南。 | 文档前后差异、现行说明搜索结果、批准产品 Artifact/审批记录对照。 | `NOT_TESTED` |
| `U01-HISTORY-APPROVAL-001` | AC-08/09 | 对 `UNIT-MENU-PRODUCT-001 v0.2` Artifact/Approval、`UNIT-SAMPLES-001` Task 状态和旧交付/Review/批准记录做只读对照；核查新实施提交未改写这些历史文件。 | 七项正式规格及历史审批继续有效；旧 `UNIT-SAMPLES-001` 仍为 `CANCELLED`；旧九项验证不作为新 U01 运行证据；历史记录保留。 | 文件/审批版本清单、Task 状态、相关 Git diff。 | `NOT_TESTED` |

## 结果汇总规则

以上用例需随实际实现和获批矩阵执行。静态引用清零不能替代 Creator 重导入/场景检查和构建运行；Creator 导入成功也不能替代菜单及手势运行检查。遇到必要环境阻塞时相关项记 `BLOCKED`；未执行为 `NOT_TESTED`。不以本表或 Tech 静态审计预填任何 `PASS`。
