# U00 六店默认脚点更新报告 v0.3

## 变更范围

按用户发回的 `U00_SHOP_LAYOUT_FEEDBACK_V0_2` 参数，正式将 U00 六店默认脚点更新为：奶茶店 `MT_SHOP_01` (-1080,-235)、糖画摊 `SHOP_02` (-780,-245)、炭烤摊 `SHOP_03` (-410,-235)、理发店 `SHOP_04` (350,-237)、花灯铺 `SHOP_05` (690,-250)、投壶铺 `SHOP_06` (1030,-249)。六店缩放均保持0.4，ID和顺序未变。收到的原始参数已逐项保存在 [USER_LAYOUT_INPUT.json](USER_LAYOUT_INPUT.json)。

本轮只更改 [UnitSampleGallery.ts](../../../../apps/client/assets/UnitSampleGallery.ts) 中的六店 `OVERVIEW_SHOP_BASELINE` 数值和相邻注释。原有调店面板、临时预览/恢复、整组导出、菜单顺序、镜头、显隐、人数和动画逻辑均保留；本轮没有读取或消费未获批 Excel，也没有变更其他代码/资产。用户授权的是这组坐标默认值；U00 v0.3 Artifact 本身仍待专业Review和用户审批。

## 静态、资源及构建结果

- Creator 3.8.8 随附 TypeScript 编译器 `tsc --noEmit --strict false --target es2019 --skipLibCheck -p apps/client/tsconfig.json` 退出码0。
- [RESOURCE_INTEGRITY_CHECK.json](RESOURCE_INTEGRITY_CHECK.json) 逐项核对198个Git跟踪 `apps/client/assets` 文件：仅 `UnitSampleGallery.ts` 有本轮差异，其他197项与Git HEAD逐字节一致。授权源码由v0.2末 SHA `42d27216233c26995a3d8eba052b3a828cf32b1433680277595b5967f2df2f20` 更新至 `238a76c18a0b095e5646800e08f2c2adfbc7db1510bab75fb980823a5872ec82`；Camera源码保持 `3b3b55cdb6cbc9cb7cb21bcfc30b521ddedc4edd830356296ec591b6bc085ef7`。
- Creator 3.8.8 隔离工程本轮唯一一次Web-Mobile CLI构建完成，exec session 21944，退出码36；日志有 `Build Assets success`、`Asset DB is resume!`、`build Task (web-mobile) Finished`。产物149文件、25,935,219字节；源代码与隔离副本SHA相同。完整文件级SHA清单见 [BUILD_R1_MANIFEST.json](evidence/BUILD_R1_MANIFEST.json)，原始日志见 [CREATOR_BUILD_R1_LOG.txt](evidence/CREATOR_BUILD_R1_LOG.txt)。日志同时记录 build-script worker SIGTERM 诊断，之后继续成功；本报告不推断该诊断为正常终止。

## HTTP和运行验证

构建实际输出位于 `/private/tmp/u00-isolated-whfZRn/build/web-mobile`，既有 loopback 服务 PID 83580、端口4174指向该目录。显式绕过环境代理后，对 `http://127.0.0.1:4174/` 与 `/assets/main/index.js` 的GET/HEAD均返回200；两个GET响应SHA与当前构建文件清单完全匹配。早先经代理的urllib请求返回502，已确认为代理路径结果，不代表本地服务状态。本轮没有另起或修改服务。HTTP记录见 [HTTP_R1_CHECK.json](evidence/HTTP_R1_CHECK.json)。

Master已在Codex内置浏览器检查本轮R1产物，运行清单 [RUNTIME_MANIFEST.json](evidence/RUNTIME_MANIFEST.json) 绑定实际HTTP主脚本SHA和最终源码身份。390×844确认奶茶店显示为(-1080,-235)，整组导出六店ID/脚点/缩放与用户输入逐项一致；微调后恢复、离页重进均回到新基线。720×1280逐店选择六店并保存画面，投壶店显示(1030,-249)。控制台warn/error为空。真机触控、设备性能与Library逐UUID回读未测。

## 审批状态

本轮的坐标输入与代码变更仍待Tech/Master同版Review及用户审核；这里明确区分“用户授权这组默认位置”与“v0.3 Artifact正式获批”。本交付不是QA结论，不代表任务已DONE。
