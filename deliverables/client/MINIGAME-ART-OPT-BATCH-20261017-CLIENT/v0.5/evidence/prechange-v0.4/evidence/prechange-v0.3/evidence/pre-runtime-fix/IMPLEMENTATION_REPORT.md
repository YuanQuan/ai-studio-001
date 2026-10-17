# 客户端实现报告 v0.2

任务：`MINIGAME-ART-OPT-BATCH-20261017-CLIENT`。Tech v0.8 对本版 Gallery/U01/阅读层修订作 `APPROVED`，准确身份见 `deliverables/tech_lead/MINIGAME-ART-OPT-BATCH-20261017-TECH/v0.8/CODE_REVIEW_IDENTITY.json`；该源码批准不代替 Creator 构建与 Master 实际运行复核。源快照、唯一 Creator 构建输入和输出 SHA 分别绑定于 `SOURCE_CHANGE_MANIFEST.json` 与 `BUILD_MANIFEST.json`。历史 v0.1 Brief、报告、Review 退修与 `evidence/prechange/` 三个冻结源快照均保留；本轮不改写既有失败证据。

## 代码与模块

新增 `framework/viewport` 的平台采集、映射与类型接口：Adapter 以逻辑窗口坐标提供有效快照、safe/capsule/orientation 与订阅；Mapper 把 safe 与触点投影到实际 Canvas 可见区，处理 letterbox、投影裁切、零尺寸保留、resize 通知与 48 逻辑像素双轴换算。微信 API 主路径抛错会尝试真实可用 fallback，初始快照不再是 1×1。

新增 `framework/module-assets` 的共享在途加载、依赖租约、Owner token/generation、迟到完成取消、失败回滚与幂等释放；保留 U04 原 dialogue bundle/path 与注册入口，不将既有池与新池双重持有。加载成功不能代表资源硬引用或生命周期常驻已经释放：Gallery/Scene 当前仍持全帧及 Prefab 硬引用，因此启动包、模块包体、GPU 驻留与完整生命周期节省均未证明。

新增 `ScrollableTextPanel` 供完整错误、状态、反馈和参数阅读复用。正文有独立图形矩形 mask、固定头尾与 8px 间隔，最大滚动到全文末端。阅读弹层激活期间，Gallery 菜单全局鼠标入口不触发底层按钮；U01 触摸、鼠标、滚轮和底图移动入口主动屏蔽，并在开/关时清除进行中的手势。

## 页面按 LAYOUT_SPEC 核对

| 页面 | 当前落实 | 有效代码验证 / 尚未验证 |
|---|---|---|
| 入口 | `layoutScene` 单列卡片、原顺序、滚动位置保留、按钮 generation 防重复；卡片说明超出内容按实际测量增高。失败项显示原因并在卡内重试，不对卡片作非等比缩放。 | 实际方法探针与全源 Creator TS 语义检查通过。IAB 构建版的菜单失败卡实际渲染/滚动仍待本版 IAB；真实资源故障恢复未强行伪造。 |
| U00 | safe 区导航；短屏仅留相机常驻，人数/开关收入默认关闭面板；固定关闭/恢复/复制与独立可滚正文遮罩；打开时遮罩提升为 UI 最上层、清除底层拖动目标，阻断世界相机和旧按钮全局命中；按钮文本统一 16/24 CSS 逻辑规格映射。 | 实际方法探针检查父子层序、手势清理、全局输入无动作及实际绘制 Label 的 16/24。Root 的 v0.6 截图曾发现导航/调节字体偏小及相机控件盖住 footer；本版代码针对修复，但本版 v0.7 IAB 视觉截图/实点仍待 Master 复核。 |
| U01 | 保持 3072×1024 世界源画布及用户导出坐标。导航标题简化为 `U01 樱花布局`，临时/恢复说明由状态及全文层表达；按钮按 16/24 逻辑尺寸绘制；滚动调节面板默认关闭。阅读层屏蔽触摸、鼠标拖图/拖镜头、滚轮缩放和底层 UI，开关时取消在途 pointer/drag。错误列完整资源 ID并以 `resources.load` 实际重试；无剪贴板时明确报告复制失败并在阅读层提供完整 JSON。 | 实际 `layoutControls` 保持 `.6/73/91` 用户镜头状态；实际读层输入四入口不调用 world handler，pointer/drag 清空；按钮绘制方法探针 16/24 PASS。v0.6 实际截图旧版导航文字偏小，v0.7 实物检查待 Root。 |
| U02 | safe 区分导航、世界舞台和滚动托盘；按剩余高度计算舞台、不设挤出 viewport 的200/240最低；托盘按实际逻辑像素换算布局、不作横向拉伸；长状态与装扮说明有全文阅读层。 | 实际布局方法映射 320 CSS：主热区48、正文16、辅助14、控件 scaleY=1。动画时序与旋转状态不被 resize 重置；IAB 实际末项/短屏世界显示待复核。 |
| U03 | 安全区导航、舞台、身份、状态、独立重试行；失败原因按完整文本层阅读；目标失败可重新 load 当前序列化场景资源，避免仅重画页面冒充重试。快速切换以 generation 接纳最新资源，旧呈现不与新状态混搭。 | 实际布局/全文阅读器探针 PASS；Creator语义与构建通过。真实资源故障、快切与触屏检查待本版 IAB。 |
| U04 | 竖屏导航/对话重排；保留横屏 1280×720 面板与人物/九宫格/角花组合的相对比例，面板整体等比 fit，不分别 clamp 宽高；对子正文提供滚动阅读层；返回/标题 parent-local 坐标修正。 | 实际 `layoutDialogue` 位置探针验证导航置于 safe 顶下56且父子坐标未重复。横屏实际构图、长对白运行待 IAB 横屏复核。 |
| U05 | 由独立 Client-U05 Owner 提交冻结源；完整1024×1536 contain，不移动原主体/操作语义；按实测不达标操作组代理，面板默认关闭、原位热区去重，倒计时不停；计时显示24/32。 | 子Owner实码探针/状态/语义与 Tech v0.6 Review PASS；源/helper/meta UUID在本清单绑定。纳入本版统一语义检查及 Creator 构建。IAB合并产物实际页面与操作仍待Root。 |

## 验证与证据

`evidence/framework-contract-tests-v0.2.json` 由所有者受控契约测试 PASS：共享加载、依赖逆序释放、异常清理仍 settle、cancelOwner 多 operation 继续清理、重试/取消、20次加载释放；viewport safe/capsule 跨中线、负偏移 Canvas 投影、48逻辑像素双轴、读操作与 resize 通知竞态、零尺寸保留、平台异常 fallback 与微信可用 fallback。属于确定性接口测试，不代表GPU资源或真机效果。

`evidence/page-layout-probes-v0.2.json` 执行实际 Gallery/U01/U02/U04/ScrollableTextPanel 源方法，不是只做正则匹配。检查 U00 最上层遮罩、交互清理、读层底层输入零触发、U01世界输入屏蔽、按钮 16/24、U01镜头不重置、U02 320 CSS投影热区/字号、U04安全导航，以及长正文滚至末尾且与固定 footer 留8px，全部 PASS。

`evidence/typescript-semantic-v0.2.log` 用 Creator 3.8.8 内置 TypeScript 4.9.5 和项目 Creator typings 对隔离副本全源执行 `tsc -p temp/tsconfig.semantic.json --pretty false`，exit 0。Creator CLI 使用隔离副本、`configPath` 明确路径及 `platform=web-mobile` 构建，日志见 `evidence/creator-build-v0.7.log`；Finished marker 有效，Creator 该CLI exit 36 按项目已验证规则代表成功。产物在 `/private/tmp/minigame-art-opt-batch-20261017-build-v0.7/minigame-art-opt-batch-20261017-web-mobile-v0.7`，debug关闭以便检查小屏底部。内置浏览器对 v0.7 的启动、交互、错误控制台、六竖屏与 U04横屏取证由 Root 接手，结果写入最终 Verification 前不宣称 PASS。

本版不伪造 DPR 1/2/3 或原生安全区验证；IAB无法通过CSS视窗证明 DPR/设备矩阵。当前交付处于 `READY_FOR_REVIEW`，必须结合本版 IAB 真实运行结果与最终Tech/Master接收推进后续状态。
