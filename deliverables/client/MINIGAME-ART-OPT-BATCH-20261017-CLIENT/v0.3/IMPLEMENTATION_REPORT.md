# 客户端实现报告 v0.3

任务：`MINIGAME-ART-OPT-BATCH-20261017-CLIENT`。本版修正 v0.7 真实小屏运行检查发现的 U00 面板布局/状态查找、U01 面板标题和状态摘要、U02–U04 导航标题问题；U05 使用独立 Owner 冻结的 v0.3 源。源码身份见 `SOURCE_CHANGE_MANIFEST.json`，Creator v0.8 构建及 781 个输出文件的 SHA-256 清单见 `BUILD_MANIFEST.json`。Tech 对本版最终源码的 Review 和 Master 对本版唯一输出目录的 IAB 运行检查尚待完成，因此不宣称整版验收通过。

## 实现范围

`framework/viewport` 提供平台 viewport/safe/capsule/orientation 采集、窗口点与 Canvas 映射，以及逻辑尺寸投影。`framework/module-assets` 提供模块共享在途加载、依赖租约、Owner token/generation、取消、错误回滚和幂等释放；沿用 U04 既有 bundle/path 与注册位置。无论租约测试通过与否，当前 Scene/Prefab 仍有原有帧和 Prefab 硬引用，因此未证明启动包、GPU 资源生命周期或完整驻留有节省。

共享 `ScrollableTextPanel` 提供固定标题/操作区、独立矩形遮罩的可滚正文及全文末尾定位。阅读层打开时，Gallery 和 U01 的输入入口主动屏蔽底层菜单、编辑和相机手势，并清理在途手势。

## 页面与可核对结果

| 页面 | 当前实现 | 可核对证据及剩余验证 |
|---|---|---|
| 入口菜单 | 卡片单列、说明按测量增高、列表可滚；按钮保持逻辑字号/热区和 generation 防重入。 | 源方法探针、Creator 语义检查通过。v0.8 的实际入口/失败卡滚动由 Master 用内置浏览器复核中。 |
| U00 店铺总览 | 调节面板默认收起，窄屏将组别/人数调节放入面板；固定关闭/恢复/复制与独立正文遮罩。面板按钮迁入滚动内容后，布局和状态刷新均从该内容节点取控件。完整原始坐标/比例通过阅读层查看，显示摘要不改变底层保存值。 | `page-layout-probes-v0.3.json` 执行真实 `layoutOverview`，在 320 CSS px 投影中验证店铺/顾客切换、上一项/下一项、X/Y/缩放/步长控件宽度 72–148 CSS px、高 48 CSS px、标签 16 CSS px；另执行状态刷新和全文值方法，确认游客模式隐藏店铺专属行且浮点保存值不变。v0.7 截图中的 tiny 控件仍是历史失败；v0.8 实际画面/触摸结果待 Master 核验。 |
| U01 樱花布局 | 保留原 3072×1024 世界和用户参数；工具面板标题 16CSS、状态区 48CSS 高并展示短摘要，点按可读完整导出参数；导航标题一行显示。长错误与无可用剪贴板提示通过共享全文层访问。 | 实际 `layoutControls` 探针验证面板标题字号 16、状态区高度 48，镜头 `.6/73/91` resize 后保持；编辑器独立按钮和 Gallery 通用按钮均 16/24。阅读输入屏蔽/全文层和语义检查通过。v0.8 IAB 仍需复核状态阅读的真实可见性。 |
| U02 游客装扮 | 导航显示短标题 `U02 游客装扮`，完整动作/状态由当前状态与全文阅读入口表达；stage 根据剩余安全区计算，不对舞台/托盘作非等比压缩。原动作时序、装扮输入及 resize 状态保留。 | 实际布局方法 320CSS 投影：主热区 48CSS、正文 16CSS、辅助 14CSS，托盘 scaleY=1；标题逻辑禁用换行。v0.8 页面及实际可滚末项仍待内置浏览器核验。 |
| U03 六店 | 导航简化为一行 `U03 六店`；保留六店状态与 generation 保护。失败状态含失败 ID、结构条件和实际重载说明，短错误摘要可点开共享全文阅读层；重试调用当前场景资源重新加载。 | Owner 方法探针覆盖正文滚动/安全区布局及 error reader；Creator 语义检查和 Web build 通过。实际失败资源恢复未在 v0.8 构建内注入，故 NOT_TESTED。 |
| U04 店长对话 | 导航简化为 `U04 店长对话`；竖屏采用重排，横屏保留 1280×720 面板美术基线与人物、九宫格、角花组合的统一等比缩放；长对白通过固定头尾+滚动正文阅读。 | 安全区父子导航定位方法探针通过。v0.8 横屏实际画面和长对白滚动需 Root IAB 核验。 |
| U05 奶茶实验室 | 独立 Client-U05 Owner 冻结 v0.3：保留 1024×1536 contain、状态/时序，代理面板按不达标组默认收起、原位热区去重，计时显示 24/32；主 Client 未编辑 U05。 | 主构建绑定 `milk_tea_lab.ts` SHA `159e914c…`、helper SHA `15e0b7b8…` 与 helper meta UUID `9a868daf-9e47-43ca-a0e7-8d127b9c1a65`。Owner 对冻结版的语义/状态方法检查已通过；最终整版 Tech review 和 v0.8 IAB 页面检查待核。 |

## 验证、历史和限制

`evidence/framework-contract-tests-v0.3.json` 的契约测试通过共享加载/依赖逆序释放/异常清理、取消竞态、多 Owner 操作清理、重试及 20 次 acquire/release 循环；viewport 覆盖安全区胶囊、Canvas 负偏移投影、零尺寸快照、平台异常 fallback 与 read/resize 通知竞态。这些是可复现的确定性逻辑检查，不代替运行画面或 GPU residency 取证。

`evidence/page-layout-probes-v0.3.json` 共 19 项检查通过，执行真实 Gallery、U01、U02、U04 与文本面板源方法；新增 U00 迁移后控件状态和 320 CSS px 实际投影尺寸测量。`evidence/typescript-semantic-final.log` 使用 Creator 3.8.8 内置 TypeScript 4.9.5 和隔离项目的 Creator declarations 执行 `tsc -p temp/tsconfig.semantic.json --pretty false`，exit 0。

Creator 3.8.8 的隔离 `web-mobile` build 使用 `configPath=/private/tmp/minigame-art-opt-batch-20261017-isolated-project/build-unit-samples-v0.8.json;platform=web-mobile`，CLI exit 36，日志含对应 `CLIENT-v0.8 Finished` marker，输出 781 个文件且逐文件 SHA 与 `BUILD_MANIFEST.json` 一致。Creator 同时打印了本机 Editor layout/window JSON 解析诊断及 build-script 子进程 SIGTERM 日志；该项目以 CLI 既有成功 exit、匹配 Finished marker 和完整输出身份作为 build 判定，不把这些输出隐藏。实际 Web canvas 是否正常及页面交互以 Master 对新建唯一版本路径的内置浏览器结果为准。

v0.7 的内置浏览器运行确实发现 U00 调节控件字号/坐标布局、U01 面板标题/信息可读性、U02 长导航标题裁切问题；这些结果保存在旧版截图和报告中，不覆写为通过。v0.8 尚未获得内置浏览器最终复核，六尺寸×DPR 1/2/3 真实设备矩阵、U04 横屏最终渲染、注入资源失败恢复及 GPU 全生命周期驻留均标为 `NOT_TESTED`。不得用 CSS 尺寸映射方法测试代替实际 DPR 或设备运行证据。

历史 v0.2 Required Artifact 原样存于 `evidence/pre-runtime-fix/`。它沿用当时的 status/acceptance 字段和 v0.7 run；其中 `DELIVERABLE.json` 的 acceptance criterion 文本与当前 Task 原条目不一致，作为历史快照保留。本 v0.3 交付的四条 criterion 逐字复制当前 `TASK.json`，不改写 Task 验收来适配报告。
