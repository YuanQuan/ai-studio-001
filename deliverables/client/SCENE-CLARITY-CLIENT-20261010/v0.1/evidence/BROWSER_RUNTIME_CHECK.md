# U00/U01 Web 运行核验记录

- 任务：`SCENE-CLARITY-CLIENT-20261010`；资源版本：Art `v0.3`（用户已批准）；Client 接入：`v0.1`。
- 构建身份：Cocos Creator `3.8.8` / `web-mobile` / debug；目录 `/private/tmp/scene-clarity-client-v01/web-mobile`；服务 URL `http://127.0.0.1:8767/`；当前 `index.html` SHA-256 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`（字节 `2103`）。完整输出文件校验摘要见 `evidence/BUILD_MANIFEST.json`，Creator 日志见 `evidence/CREATOR_BUILD_LOG.log`。
- 构建过程：两次默认沙箱启动在 macOS app registration 阶段 SIGABRT（exit 134）；随后使用审批的宿主执行环境成功完成 Creator 3.8.8 导入与构建。Creator 以成功完成码 exit 36 结束，输出 `Build Task (web-mobile) Finished in 4 s`。日志另记 build-script 子进程 SIGTERM，随后使用 engine cache；该子进程日志保留为构建诊断信息，不改变Creator已完成状态。
- HTTP：HTTP 访问记录已保存于 `evidence/HTTP_ACCESS.log`，共 289 条 GET，状态码统计 `{'304': 289}`。记录包含 `index.html`、`assets/main/config.json`、主 bundle、五个资源 import JSON 与五张 UUID PNG 请求；五个图片和其import JSON请求均为 HTTP 304（If-Modified-Since/ETag缓存校验），表示本次标签命中了浏览器缓存验证响应。五张当前构建 PNG 已由 Tech Lead 将内容与源/目标版本独立逐字节核对。服务现已关闭（loopback:8767）。
- IAB 运行：Codex 内置浏览器 viewport 约 `1277×720`。Owner在该当前构建中进入 U00、U01；U00 执行过 camera `+`、画面拖拽平移、Reset、Return；随后再次进入 U00 连续按 `+` 到明显放大、在放大状态拖拽、Reset、Return。U01 执行过 `+`、拖拽、Reset；再次进入 U01 连续按 `+` 到明显放大、在放大状态拖拽、Reset、Return。输入后画面相应缩放/平移，Reset回到默认视图，Return回示例入口；未观察到脚本异常导致的空白场景。此为Owner现场操作记录，未由Tech重复操作。
- Art 现场 Review：Art 在同一构建的 IAB 现场查看 U00 中段/右段及 U01 默认/放大状态并签 `APPROVED`，详见同版本 `ART_REVIEW.json`。Tech 的当前 `APPROVED` 结论见 `TECH_REVIEW.json`，核验了构建身份、资源字节和证据链；Tech没有将Client描述转述为其独立浏览器复测。
- 截图边界：Client 的 CUA 截图 API `getScreenshot()` 返回原生 `Uint8Array`；Client 本轮只捕获并在工具输出中显示入口菜单画面，未捕获或保存 U00/U01 场景帧，故不提供虚构截图路径或哈希。Art 在同一构建 IAB 现场实看 U00/U01 默认/放大及 U00 中段/右段，并据此签署 `ART_REVIEW.json`；U00/U01画面结论以Art现场Review与Owner实际IAB操作为据，结合构建身份和HTTP日志追溯。
- 未测：真实手机触控与分辨率适配、微信/抖音小游戏平台、目标设备GPU驻留/DrawCall/帧率、长时运行与弱网。桌面IAB不是这些指标的替代。
