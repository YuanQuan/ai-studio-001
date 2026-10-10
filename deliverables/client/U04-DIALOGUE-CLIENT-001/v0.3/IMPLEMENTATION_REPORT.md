# U04 对话客户端实现报告 v0.3

## 实现内容

- 将用户批准的极简角饰原图同源 PNG 替换到 U04 两个稳定客户端路径。两张源图和客户端图 SHA 分别为 `d23f33279807d0e34d951d9e7504d35574aee07a9bf4530378bfd2863415da4b`、`6b0998e92425499ee78c791d5a8f3ba8cab3eacfeb3df6d05425c69bf269216f`。既有 `.meta` 未改，image、sprite-frame、texture UUID 均保留。
- 两个角饰 Sprite 使用 `Sprite.SizeMode.CUSTOM`，保持 128×96。左下角饰距面板左/下边 64/48，右上角饰距面板右/上边 64/48。面板九宫格 `Sprite.Type.SLICED` 和四边 inset 48 保持。
- base/face/front 肖像仍作为面板子层，按面板左下锚定位；姓名和对白沿用共同左边线及左对齐。未改人物127张图、服务端/API或加载释放机制；无新增依赖和持续循环。

## 构建与运行验证

源码 SHA-256：`1cebecc0e108c7e76e8253855eecd26df885b56dfe31c2e0415a68ddba47ad09`。Creator 3.8.8 CLI `web-mobile` 任务在2026-10-10 22:48:30 +08:00完成，退出码36，任务日志含 `build Task (web-mobile) Finished in (7 s)`。完整Creator任务日志及CLI捕获见 `evidence/CREATOR_BUILD_STDOUT.log`、`evidence/CREATOR_BUILD_CLI_CAPTURE.log`；当前index和dialogue config SHA见 `RUNTIME_CHECK.json`。

Master于22:54在同版HTTP构建执行内置浏览器Canvas点击和截图检查：两角显示和固定尺寸通过；384×192、768×256、1024×384三档面板无角饰拉伸；人物面板子层左下锚及姓名/对白左对齐通过；90/90组合0失败（6624ms）；三轴各自变更后另两轴保留；连续切换8次最终选择正确；651×898与1280×720视窗、竖屏返回重入通过；捕获控制台entries为空。过程与时间见 `evidence/MASTER_RUNTIME_OBSERVATIONS.json`，11张当前截图与SHA在同目录索引。

## 验收边界

Task五条验收逐项结论及证据见 `DELIVERABLE.json`；资源逐项登记见 `RESOURCE_IMPORT_MAP.json`。目标设备、SDK、GPU驻留和压力性能未测试；横屏菜单适配未测试。90组合巡检耗时不是设备性能数据。该包可提交专业Review，不能代替用户对本版本的正式审批。
