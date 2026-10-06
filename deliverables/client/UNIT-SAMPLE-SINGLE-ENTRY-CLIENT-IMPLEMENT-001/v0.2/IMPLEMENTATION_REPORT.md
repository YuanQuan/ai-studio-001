# U01 竖屏全屏与镜头安全边界修订 v0.2

Task：UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001。依据：用户 2026-10-06 对待审 v0.1 的修订反馈。v0.1 保留历史，v0.2 待同版 Review 与用户确认；本报告为客户端实现验证，不是正式 QA TEST_REPORT。

## 修改结果

U01 场景铺满手机竖屏可见区域。采用固定设计宽度 720、按屏幕比例伸展可见高度的适配；原 660×680 小视口及上下说明区移除。四层仍共用已批准的 2172×724 图幅，按高度覆盖屏幕，从后到前横移速度为 0.3/0.8/1/1。已有 −、重置、+ 浮在底部，返回菜单浮在左上，按 Cocos 安全区定位。按钮区域捕获输入，按钮之间的空白允许拖动。

最前景以完整图幅为左右移动的限制。每边预留 2 个 UI 单位的覆盖余量：覆盖比例 `s0=max((视口宽+4)/2172,(视口高+4)/724)`；当前比例 `s=s0×zoom`；镜头源坐标左右范围 `±max(0,(2172-(视口宽+4)/s)/2)`。四层同图幅且其他层速度不大于最前景，因此该限制也覆盖其他层的图幅边缘。

缩放范围保留覆盖倍率 1×～1.8×；缩放或窗口变化后立即重新计算并限制镜头位置。重置回中心及当前屏幕的覆盖倍率。补充处理短桌面窗口的菜单位置，保证入口可达。复用原 Gallery、Controller、四层 Prefab 和图片，未增加持续逐帧处理。

## 穿帮检查与结论

旧实现按小视口计算极限，同时图片没有裁切到小视口；旧运行截图中画面超出小视口边框，因而原极限不能直接作为全屏手机安全边界。四张实际 PNG 均为 2172×724，本轮改为以真实全屏视口计算最前景边界，避免保留固定小视口的限位。

| 模拟手机视口 | 屏幕比例 | 最小/最大缩放左右端 | 全屏与控件 | 证据前缀 |
|---|---|---|---|---|
|360×640|9:16|PASS|PASS|evidence/portrait-9x16-|
|360×720|9:18|PASS|PASS|evidence/portrait-9x18-|
|390×844|约9:19.5|PASS|PASS|evidence/portrait-9x19_5-|
|360×800|9:20|PASS|PASS|evidence/portrait-9x20-|
|360×840|9:21|PASS|PASS|evidence/portrait-9x21-|

以上均在真实 Creator Web 构建中通过 Canvas 鼠标点击、连续拖动和按钮操作检查，观察到无露底、图幅边缝或前景截断后空白。放大到端点后缩小会自动回收镜头。最小倍率右端继续拖动、重置前后、从缩小按钮开始拖动以及返回重入的四组截图逐像素相同，见 `evidence/build-identity.json`。前景图中原有透明区域是分层设计，不作为缺图；检查结论针对超出完整图幅导致的穿帮。

## 构建与代码验证

- `tests/u01_fullscreen_bounds.cjs` 运行真实 Controller 转译代码，以节点替身检查实际变换覆盖四条视口边界，覆盖 5 种手机比例、缩放和镜头极值、缩小回收、重置及 1000 个视口变化；共 4280 条图层覆盖检查 PASS。此项是几何单元验证，不替代引擎。
- 修改的两份 TypeScript 源码定向类型检查 exit 0，见 `evidence/typescript-check.log`。全项目 `tsc -p` 会把 temp 中多个隔离工程/备份纳入并发生重复声明、引擎声明缺类型及备份相对导入错误；因此只把定向检查和 Creator 实际构建列为本变更的编译证据，未修改工程类型配置来掩盖问题。
- 锁定 Creator 3.8.8，以管理员 CLI 在 `apps/client/temp/u01-fullscreen-snapshot-20261006` 构建 Web Mobile、debug=false。首轮 16:36:20 开始、16:37:30 exit36，build 17.332 秒；五比例矩阵由该构建运行。
- 后续只补充短桌面窗口菜单可达性，Controller 及四层内容未改；最终构建 16:45:17 开始、16:45:58 exit36，build 17.200 秒。`final-portrait-9x19_5-*.png` 覆盖最终版全屏、放大右端、缩小回收和重置，`desktop-menu.png` 为最终加载后的菜单。
- HTTP 服务 `http://127.0.0.1:18040/` 仅 loopback，根目录/进程见 `evidence/http-service.json`；IAB tab2。服务与标签为本次审阅保留。最终源 assets/settings 与快照逐文件一致，构建/截图哈希在 `evidence/build-identity.json`。浏览器捕获的 error 日志为空，见 `console-errors-final.json`。
- Chromium 缓存访问拒绝、merge_dep 默认值以及构建 worker 结束 SIGTERM debug 记录保留于日志；实际引擎结束、exit36、当前产物与运行加载均通过，未将这些记录改写为空错误。

## 范围与门禁

源改动仅 Gallery 和 Controller；Scene、Prefab、四张 PNG 与所有 `.meta` 的字节及身份保留。源备份在 `apps/client/temp/u01-fullscreen-baseline`（忽略目录，不提交）。未增加资源、第三方依赖、协议或玩法规则。

本轮完成实现级几何、导入/构建、五比例画面、鼠标交互验证。真实触屏双指、安全区实体设备、微信/抖音 SDK、性能指标和正式 QA 未执行，状态 NOT_TESTED。实现 v0.2 获用户批准后，正式 QA 仍按已批准计划独立推进；本轮不标任务 DONE。


## 同版评审与送审记录

2026-10-06 17:07 +08:00：Client、Tech、Art、UI、QA与Master六份Review均APPROVED；Task与Approval进入USER_REVIEW。正式QA未解锁。本轮最后补充的1280×720桌面截图因浏览器自动审批服务返回403而未完成，未绕过；此前手机比例验证与最终390×844证据有效。定向类型检查结构化结果见evidence/typescript-check-result.json。
