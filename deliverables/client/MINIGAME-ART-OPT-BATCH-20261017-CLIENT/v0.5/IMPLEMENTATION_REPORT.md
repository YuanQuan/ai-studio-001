# 客户端实现报告 v0.5

任务：`MINIGAME-ART-OPT-BATCH-20261017-CLIENT`。本版只修改共享文本阅读器以修复 v0.9 内置浏览器发现的 U01 长参数正文白色竖条问题；保留 v0.4冻结源快照和白条失败证据，不覆盖历史结果。v0.5 源身份见 `SOURCE_CHANGE_MANIFEST.json`；统一 Creator v0.10 构建见 `BUILD_MANIFEST.json`。Root 已对唯一 v0.10 输出目录完成 reader 专项内置浏览器复核；本报告记录其实际范围。Tech 对 helper delta 的专业 Review 与整体用户审批仍待后续流程。

## 实现范围

`framework/viewport` 提供平台 viewport、安全区、胶囊与朝向采集、窗口点和 Canvas 映射、有效逻辑尺寸投影；`framework/module-assets` 提供共享在途加载、依赖租约、Owner token/generation、取消、异常回滚与幂等释放，U04 继续使用既有 bundle/path/注册位置。原 Scene/Prefab 仍有全帧和店铺 Prefab 硬引用；当前未证明启动包、GPU 资源生命周期或完整驻留节省。

共享 `ScrollableTextPanel` 使用固定标题/操作区、独立矩形遮罩正文及全文末尾定位。阅读层开启时，Gallery 和 U01 的输入入口会主动屏蔽底层菜单、编辑和镜头手势，并清理在途手势。

## 页面实现与证据

| 页面 | 实现 | 当前可复核结果与未测项 |
|---|---|---|
| 入口菜单 | 单列卡片、说明按测量增高、列表可滚；按钮按逻辑字号/热区布局并使用 generation 防重入。 | v0.8 入口运行由 Root 验证；v0.10 再次内置浏览器复核中。 |
| U00 店铺总览 | 面板默认收起；窄屏的组别/人数控件位于正文滚动区；关闭、恢复、复制固定于页脚。操作节点用实际创建时引用映射，避开重命名后按旧名查询失配。 | v0.5 探针执行真实 `buildOverviewShopAdjustPanel` 和 `layoutOverview`：枚举 21 个实际可点节点、覆盖 16 个面板动作，检查常用标签≥16CSS px、操作热区≥48CSS px、同父级按钮不相交、页脚可见且正文可滚（最大偏移 367 UI 单位）。320CSS投影下的 v0.10真实截图/点击仍待Root。 |
| U01 樱花布局 | 保留原世界与用户参数；工具面板标题16CSS px、状态摘要可打开全文参数，错误/导出失败通过共享阅读层访问；镜头 resize 保持原视图参数。 | 实际 `layoutControls` 探针验证 `.6/73/91` 镜头状态保留、标题16、状态区48高；reader期间输入入口无世界编辑调用。v0.10 IAB在320×568实测顶部可读、底部跳到完整JSON末尾/计数与双闭合括号、顶部返回、native wheel滚动和关闭恢复世界；6种竖屏CSS viewport做了reader尾屏检查，均DPR1。 |
| U02 游客装扮 | 安全区内短标题 `U02 游客装扮`；舞台/托盘按剩余区域重排，不做非等比压缩；保留装扮与动作时序。 | 源方法投影探针验证热区48CSS px、正文16CSS px、辅助14CSS px、tray scaleY=1。真实v0.10视图待Root复核。 |
| U03 六店 | 短标题 `U03 六店`；长错误提供共享全文阅读，重试执行场景重载；失败ID和缺失结构条件可访问。 | 源方法探针与Creator语义检查通过。实际注入资源失败恢复未测（NOT_TESTED）。 |
| U04 店长对话 | 短标题 `U04 店长对话`；竖屏重排；横屏保留1280×720原组合并整体等比contain；长对白使用固定头尾和滚动正文。 | 导航父子坐标探针通过。v0.10真实横屏/对白滚动待Root复核。 |
| U05 奶茶实验室 | 独立Owner冻结版接入，未由主Client修改：保留1024×1536 contain、游戏状态和时序；不达标操作代理组默认收起，热区去重，计时24/32。 | 冻结源 SHA `159e914c6d6f11909eccf81dc798d5eb49bf28b1989ab83c1d04b570103c8726`，helper SHA `15e0b7b81b37bf078f25c065684b7456ee45bc202faf24b588ca1c56de49a0f7`，meta UUID `9a868daf-9e47-43ca-a0e7-8d127b9c1a65`。Owner对该源的语义/状态方法检查通过；v0.8内置浏览器已实际完成开始→配方→牛奶/配料/茶→提交→订单2且无新warn/error。v0.10整版复测待Root。 |

## 本版长文本修复

Root 在唯一 v0.9 页面中发现 U01“查看完整参数”正文显示白色竖条，连续截图一致且无 console error。v0.10 IAB对修复版本实际验证：320×568首屏可读，点击“底部”后完整计数及JSON结尾 `}}` 可见，点击“顶部”恢复首行，native wheel滚动可用，关闭后场景恢复。360×640、390×844、412×915、414×896、720×1280均采集底部视图，全部为CSS DPR1。实际截图与运行记录位于 `../../../../master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-v10/REPORT.json`、`CONSOLE.json` 和同目录PNG；console记录为空数组。白条原因未通过 GPU/纹理上限实验确定，超长单 Label 风险仅为待证推测。本版只修改共享 `ScrollableTextPanel` helper：按可见滚动窗口重绘少量单行/分块 Label，单个逻辑节点宽高受限于 640；正文所有换行行仍参与完整滚动高度估算，并提供顶部/底部跳转。生产形态源方法探针执行 U01 `exportData()` 与 `updateStatus()`，结果为 56,164 字符、1,693 段、4,040 wrapped lines、估算逻辑 fullHeight 218,178、body 974、maxOffset 217,204。首屏窗口含21行，尾屏包含JSON终止符 `}`；每个活跃Label最大实测方法布局尺寸612×594。该方法探针和UITransform尺寸不是 GPU backing-store/DPR 实测。

## 验证与限制

`../v0.4/evidence/framework-contract-tests-v0.4.json` 通过共享加载、依赖逆序释放、异常清理、取消竞态、多Owner操作清理、重试与20次 acquire/release循环；viewport覆盖安全区胶囊跨中心、Canvas负偏移投影、双轴48逻辑热区、零尺寸保留、平台异常fallback、微信主接口失败后fallback及read/resize通知竞态。它们验证确定性接口契约，不代表GPU驻留或真机渲染。

`evidence/page-layout-probes-v0.5.json` 共20项检查通过；`evidence/u01-export-reader-probe-v0.5.json` 对完整导出内容、首尾窗口/纹理尺寸与控件字号热区探针通过。`evidence/typescript-semantic-v0.5.log` 使用隔离 Creator 3.8.8工程，exit 0。本轮新增探针在运行Gallery实际构建与布局方法后，反向遍历真实按钮节点并验证名称映射、固定页脚与正文滚动区、文字/热区尺寸和同父级交互目标不重叠。`evidence/typescript-semantic-v0.5.log` 使用Creator 3.8.8内置TypeScript 4.9.5及隔离项目Creator声明，对全量TS执行 `tsc -p temp/tsconfig.semantic.json --pretty false`，exit 0。

Creator 3.8.8隔离 `web-mobile` 构建使用 `configPath=/private/tmp/minigame-art-opt-batch-20261017-isolated-project/build-unit-samples-v0.10.json;platform=web-mobile`，Root以 `require_escalated` 执行，真实exit 36、日志含v0.10 `Finished in (11 s)`标记，781个输出文件的SHA逐项记录在 `BUILD_MANIFEST.json`。默认sandbox下两次Creator启动exit134且未生成日志/产物属于此前v0.9构建尝试；本次v0.10由Root以require_escalated成功构建。输出 `application.js` 明确设置 `showFPS=false`。

v0.10实际浏览器范围只包括U01 reader与6种竖屏reader底部，不表示本版本重新执行了其他页面全矩阵或U04横屏；其他页面沿用v0.9实际矩阵及其逐项状态。真实设备DPR2/3、native safe area、资源加载失败注入及GPU完整生命周期驻留目前未测，源方法探针不替代这些实测。因为原Scene/Prefab硬引用未释放，当前资源租约不表示包体或驻留收益已经实现。
