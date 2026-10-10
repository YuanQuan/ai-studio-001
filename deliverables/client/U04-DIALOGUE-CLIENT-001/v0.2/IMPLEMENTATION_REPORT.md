# U04 对话客户端版式修订报告 v0.2

## 变更

- base/face/front三层继续组成一个裁切肖像。页面构建后，肖像Mask作为对话面板节点子节点，使用面板左下角局部坐标定位；默认1280x720视窗时肖像裁切框下缘与面板底边相距10设计单位。三层源映射、素材像素、UUID和.meta不变。
- 姓名与演示对白明确设置为Label左对齐，布局复用同一文本列左边界；面板宽度和视窗变化时由现有布局函数重新计算肖像与文字安全列。旧角花仍是场景层的后置节点，绘制在肖像之上。
- `RESOURCE_IMPORT_MAP.json` 从v0.1逐项继承129条资源记录；新增v0.2布局/运行证据元数据。资源来源路径、SHA、客户端路径、UUID、meta和导出映射事实没有变化。
- 本版只确认用户调整1/3。Art制作的新角花仍未制作、用户审批或接入；不将完整v0.2作为用户正式审批包。

## 当前构建与运行证据

Creator 3.8.8 `web-mobile`构建于2026-10-10 21:42:48 +08:00完成，CLI退出码36，日志含`build Task (web-mobile) Finished in (5 s)`；当前源码SHA-256为`7b1c92c291f33a83a6851898154eb6ef69da32b006141bcd125df8285d8d29bb`。最终日志：`evidence/CREATOR_BUILD_ELEVATED_STDOUT.log`及`evidence/CREATOR_BUILD_ELEVATED_STDERR.log`。日志中有build-script SIGTERM调试信息，但主构建任务结束标记、退出码和本次更新的构建入口/对话bundle均有效。

当前构建通过loopback `http://127.0.0.1:8765/`提供，入口与dialogue配置HTTP均200。Master于21:49:34 +08:00以Codex内置浏览器Canvas原生点击实测当前产物，未使用引擎状态注入。逐项观察与截图SHA见`evidence/MASTER_RUNTIME_OBSERVATIONS.json`。

## 验收结论

| 项目 | 结果 | 证据/限制 |
|---|---|---|
| 三层肖像作为面板子层显示在前景并按面板左下角定位；默认下缘间距10单位 | PASS | 默认布局截图及IAB观察记录 |
| 姓名和对白使用共同左边线并左对齐 | PASS | 默认与三档面板截图 |
| 384x192、768x256、1024x384面板尺寸 | PASS | 三档IAB截图 |
| 651x898与1280x720视窗响应 | PASS | tall与default截图 |
| Task验收2：90组合资源与三轴独立切换 | PARTIAL | 90/90、0失败；本轮未独立复测三轴保留与异步快速覆盖，独立轴处理代码未改 |
| 当前竖屏返回并重入、捕获控制台错误/警告 | PASS | reentry截图；console entries为空 |
| Task验收3：旧批准资源组合、九宫格尺寸与当前版式 | PASS（范围限旧批准素材） | PNG与既有129条资源未变；三档面板实测通过。新版角花尚未制作/审批/接入，不计作本项完成之外的Art任务完成 |
| 新角花制作、具体版本用户批准及接入 | PARTIAL | 新图尚未制作/审批/接入；旧角花继续用于本次布局。整包v0.2不送用户审批 |
| Task验收4：资源登记、UUID/映射、加载释放与重入 | PASS | 129条登记字段从v0.1原样继承；当前返回重入PASS，加载/释放代码未改 |
| Task验收5：本机Creator构建、HTTP/IAB及九宫格实测 | PASS（平台范围有限） | Creator 3.8.8 CLI+HTTP/IAB通过；原生/SDK目标平台未测 |
| 目标设备、SDK、GPU/FPS及压力性能 | NOT_TESTED | 本轮未执行；6757ms仅为组合巡检耗时 |
| 横屏菜单返回后的适配 | NOT_TESTED | 本轮在当前竖屏视窗返回并重新进入；未验收横屏菜单布局 |

## 交接

当前Client交付可进入Tech Lead Review。Producer继续维护`U04-DIALOGUE-CLIENT-001`处于REVISION的Task及角花用户审批门禁；这份Client交付的READY_FOR_REVIEW不代表整体任务DONE，也不代表Art新角花或整包v0.2已获得用户批准。
