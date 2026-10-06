# U01 正式功能 QA 的 Web 测试环境矩阵 v0.1

任务：`UNIT-SAMPLE-SINGLE-ENTRY-QA-MATRIX-001`。阶段：`FUNCTIONAL` 的环境与证据方案，**尚未执行正式 QA**。规则文本版本：`studio-workflow-v2-policy`。本矩阵需完成同版 QA、Client、Tech、Master Review 并获用户批准，随后才可作为正式运行环境输入。矩阵批准本身不生成 `TEST_REPORT` 或功能通过结论。

## 已批准输入与测试对象

- 产品：`UNIT-SAMPLE-SINGLE-ENTRY-SCOPE-001 v0.2`，AC-01～AC-10；技术：`UNIT-SAMPLE-SINGLE-ENTRY-TECH-PLAN-001 v0.1`；QA：`UNIT-SAMPLE-SINGLE-ENTRY-QA-PLAN-001 v0.2` 的 `TEST_PLAN.md`、`TEST_CASES.md`、`RESOURCE_REFERENCE_CHECKLIST.md`；客户端：`UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001 v0.2`。这些版本的 Approval 均为 `USER_APPROVED`。
- 决策：`project/DECISIONS.md` 的 `DEC-UNIT-MENU-WEB-TEST-005` 将本阶段“真机测试”限定为 Web 内多个模拟手机竖屏视口；实体手机、小游戏容器及发布平台不由本矩阵覆盖。
- 被测对象为独立 QA 执行任务届时锁定的同一份 `apps/client/` 源提交、四层资产哈希、Cocos Creator `3.8.8`、Web Mobile 构建及入口。当前客户端报告中的实现级截图、4280 条几何检查和浏览器操作仅供确定风险与步骤，**不回填正式 QA 的 PASS**。执行前记录实际 commit、构建目录和构建产物 SHA-256；若重建、源码或资源变更，先做影响分析并重测受影响项。

## 固定环境提案

在当前可用的 Windows 测试主机上，固定 **Windows 10 Pro 22H2，build 19045.2965** 与 **Google Chrome 154.0.8037.98**。版本号来自 2026-10-06 只读系统登记和 `chrome.exe` 文件版本盘点，属于环境候选，不是正式 QA 运行证据。正式执行时再次保存 `winver`/系统版本、`chrome://version` 页面、Chrome 可执行文件版本与是否启用硬件加速；任一版本不同须先更新矩阵并复审，不能把变更环境的结果并入本版。浏览器用干净会话，关闭扩展，保持默认页面缩放 100%，桌面显示缩放和 GPU/驱动信息记入环境记录；不以扩展或强制软件渲染替代下表环境。

构建由 Creator `3.8.8` 的 Web Mobile 目标、`debug=false` 生成，经 `127.0.0.1` 本地 HTTP 提供。保留构建配置、命令、原始日志、退出码、实际入口和产物哈希。优先通过 Codex 内置浏览器对实际 HTTP 构建做加载与基础运行核对并单独登记；本正式矩阵另使用 Chrome DevTools 设备模式，因为前轮内置浏览器仅提供视口尺寸与鼠标交互，不能固定 DPR 或可靠地产生两点触控。Chrome 是本矩阵明确提请审批的环境，不把其证据标作内置浏览器证据。每个矩阵项均重新加载同一构建，在 Chrome 设备模式设置 **CSS 视口尺寸**与 **设备像素比 DPR**；设备预设名称只作标签，不当成真实机型。预期渲染后端为 **WebGL 2，Chrome 默认 GPU/ANGLE 路径**；执行时记录引擎实际选中的 WebGL 版本、`chrome://gpu` 的图形状态、GPU/驱动和控制台渲染信息。若实际回退 WebGL 1、软件渲染或上下文丢失，保留日志并将该矩阵项记 `BLOCKED`/`FAIL`（按原因），不得悄悄更换后端并报通过。WebGL 1 如需支持，另提环境版本与适用性评审。

| 矩阵 ID | 竖屏 CSS 视口 | 约略宽高比 | DPR | 浏览器 / OS / 渲染后端 | 输入覆盖 | 状态 |
|---|---:|---:|---:|---|---|---|
| `WEB-01` | 360×640 | 9:16 | 2 | Chrome 154.0.8037.98 / Win10 22H2 / WebGL 2 | 鼠标拖动、按钮；单指模拟触控；双指缩放边界 | `NOT_TESTED` |
| `WEB-02` | 360×720 | 9:18 | 2 | 同上 | 鼠标拖动、按钮；单指模拟触控 | `NOT_TESTED` |
| `WEB-03` | 390×844 | 约 9:19.5 | 3 | 同上 | 鼠标拖动、滚轮、按钮；单指与双指模拟触控；取消/移出 | `NOT_TESTED` |
| `WEB-04` | 360×800 | 9:20 | 2 | 同上 | 鼠标拖动、按钮；单指模拟触控 | `NOT_TESTED` |
| `WEB-05` | 360×840 | 9:21 | 2 | 同上 | 鼠标拖动、按钮；单指模拟触控；双指缩放边界 | `NOT_TESTED` |

单指触控用 Chrome 设备模式的 `Mobile`（触摸）类型；鼠标输入用同一模拟视口下的 `Mobile (no touch)` 类型，切换后重新加载、核对实际视口/DPR 并记录 DevTools 模式。Chrome 官方文档说明这两类模式分别发出 touch 与 click 事件，并支持设置 DPR，见 [Chrome 设备模式说明](https://developer.chrome.com/docs/devtools/device-mode)。双指先用 Chrome 设备模式的 `Shift`+拖动模拟 pinch，且必须在事件轨迹中确认游戏收到**两个同时有效触点**，不能仅看页面缩放；该手势是 Chrome 团队历史文档描述的操作，见 [Chrome DevTools 移动端说明](https://developer.chrome.com/blog/devtools-mobile/)。若当前 Chrome 版本不产生两点触控，pinch 条目记 `BLOCKED`，交由 Master 决定补充可审查输入工具或修订矩阵，不用滚轮或“+/-”按钮冒充双指，也不绕过浏览器权限。鼠标检查记录按下、移动、松开；滚轮仅在 `WEB-03` 检查。各输入方式分别记结果，不合并为“触控通过”。没有成本型第三方设备云依赖。

## 固定记录与复现

每次执行记录矩阵 ID、用例 ID、执行人和时间、源提交、资源清单/哈希、Creator 精确版本、构建配置/哈希、HTTP 地址、浏览器与 OS 精确版本、GPU/驱动和 WebGL 实际后端、Chrome 设备模拟设置、输入来源。运行页同时记录 `window.innerWidth/innerHeight`、`window.devicePixelRatio`、Canvas 的 CSS 边界及实际像素尺寸、Creator 可见视口与安全区值；这些**实际读数待执行时填写**。若读数不等于提案尺寸/DPR，先纠正或修订矩阵，不能用预设标签推断实测值。截图注明矩阵 ID、镜头倍率与左右位置；保留无裁剪全画布 PNG、短录屏、浏览器 Console/Network 原始日志、输入轨迹及必要的相机/四层节点状态。所有文件登记在正式 `TEST_REPORT`，可按构建哈希和用例复核。

## 用例分配与检查点

1. **公共静态与 Creator 检查（同一锁定实现执行一次，变更后按影响重做）**：执行批准计划的 `U01-PLAN-BASE-001`、`U01-OLD-SERIALIZED-REF-001`、`U01-RESOURCE-DELETION-001`、`U01-CREATOR-IMPORT-001`、`U01-IDENTITY-CHAIN-001`、`U01-PROJECT-DOCS-001`、`U01-HISTORY-APPROVAL-001`。分别保留工作区基线、Creator 保存重开/导入日志、旧引用扫描、逐资源删除依据、四张 PNG/Prefab/Controller 身份及历史记录。Web 画面不能代替这些证据。
2. **每个 `WEB-01`～`WEB-05`**：执行 `U01-WEB-BUILD-RUN-001`、`U01-STATIC-MENU-001`、`U01-VISIBLE-TEXT-001`、`U01-NAV-REENTRY-001`、`U01-CAMERA-INPUT-001` 的适用 Web 步骤。先拍菜单完整文字与唯一入口，进入 U01 拍全屏及悬浮按钮；在覆盖倍率 1× 与上限 1.8× 的中心、左端、右端检查画面四边和最前景完整图幅边缘，连续向外拖到限位，再从放大端缩回、重置、返回并重进。记录遮挡、按钮可触达、菜单状态、镜头状态与重复实例数。
3. **交互专项**：五视口均分别从画面和悬浮按钮区域开始拖动，核对 UI 输入隔离；单指拖动至左右边界后继续拖动，检查边界不越界。`WEB-01/03/05` 的双指先放大到上限附近并抵达左右端，再缩小到覆盖倍率下限，检查位置自动回收、无露底；`WEB-03` 增加滚轮、触摸取消、鼠标移出/松开，以及视口尺寸和 DPR 切换后重新计算边界、无遗留手势。若 DevTools 重新加载导致状态丢失，记录切换方式并从可复现初态重做，不能将两次构建状态拼接。
4. **视觉判定**：四层合成画面及悬浮控件要与获批 U01 资源/产品文字和客户端 v0.2 交互一致。检查全屏是否出现图幅外空白、边缝、透明穿底、前景被推离后露出缺口；四张源图设计上透明的上部区域不能仅因透明被判为资源缺失。保留同构图截图/必要差异图，QA 逐图核对，关键视觉差异交 Art/UI 专业判断。自动几何/像素比对只提供线索，不代替运行视觉结论。
5. **异常与处置**：任一视口或输入模式发生可复现穿帮、按钮遮挡不可触达、边界失效、重入重复对象、missing UUID 或错误资源，记录复现步骤、环境、截图/视频和日志并按批准的 P0/P1/P2 规则分级；P0/P1 阻塞。单个矩阵项失败不能以其他比例通过覆盖。必需环境、后端、触点注入或证据缺失为 `BLOCKED`/`NOT_TESTED`，说明具体项与原因；修复后以锁定新构建重跑受影响矩阵。

## 性能与范围界限

本矩阵固定功能/视觉 Web 环境，**不设性能数值阈值**。按 `rules/qa_protocol.md`，正式 FUNCTIONAL QA 须对 U01 首次/重复进入、拖动/缩放、重复进入释放等作性能适用性评估；Tech/Client/QA 在执行前另行锁定并批准指标、采样方法、基线和预算，功能与性能在报告中分列。`project/quality/PERFORMANCE_BUDGET.md` 是旧 `DEMO-001` 的待批预算，不能直接充作 U01 硬门槛。必要预算未批或实测缺失时，性能结论写 `NOT_TESTED`/`BLOCKED`，不写总体验收 PASS。

排除实体手机触屏与刘海/系统安全区、浏览器地址栏动态变化、iOS Safari/Android Chrome 真机差异、微信/抖音容器、发布平台、真实弱网、Server/API/存档/经济，以及七项正式内容功能和无关全量回归。Web 设备模拟的 DPR 与输入只证明本矩阵指定的桌面 Chrome 条件；实体设备及 RELEASE 结论保持 `NOT_TESTED`。正式报告分别列功能、视觉、性能的结果、缺陷和未测项；用户确认报告并由 Master 接受前，不能将功能标 `DONE`。
