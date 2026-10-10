# U04 对话版式 v0.2 运行证据索引

本文件汇总用户退回项1/3的客户端实现与Master同版IAB证据，供Client/Tech审查；当前不作为U04整包正式用户审批提交。新角花尚未制作并获用户批准，Art该门禁未完成。

- 当前源码SHA-256：`7b1c92c291f33a83a6851898154eb6ef69da32b006141bcd125df8285d8d29bb`。
- 构建：Creator 3.8.8 web-mobile；退出码36，Finished日志、HTTP 200及配置见`RUNTIME_CHECK.json`。
- IAB：面板前景/左下锚点及姓名对白左对齐见`evidence/runtime_revision_default.jpg`；三档尺寸见`runtime_revision_panel_384x192.jpg`、`runtime_revision_panel_768x256.jpg`、`runtime_revision_panel_1024x384.jpg`；651x898视窗见`runtime_revision_tall.jpg`；90/90零失败见`runtime_revision_sweep90.jpg`；返回重入见`runtime_revision_reentry.jpg`。观察时间、方法和各图SHA见`evidence/MASTER_RUNTIME_OBSERVATIONS.json`。
- 角花：截图继续使用Art v0.1已批准旧素材。新版角花制作、具体图用户审批和接入仍待完成；不把旧角花布局验证视为新版资源审批。
- 未测试：目标设备/SDK/GPU/FPS/压力性能与横屏菜单适配。6757ms仅是90组合巡检耗时。

完整Client实现和验收边界见`IMPLEMENTATION_REPORT.md`；资源条目与布局版本关联见`RESOURCE_IMPORT_MAP.json`。
