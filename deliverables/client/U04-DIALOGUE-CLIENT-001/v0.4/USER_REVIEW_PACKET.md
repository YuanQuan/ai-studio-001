# U04 对话客户端内部祥云替换 v0.4 审阅材料

本版按用户授权，将Master静态接受的 `U04-CLOUD-CORNER-ASSET-001` v0.1 两张同源128×96 PNG接入U04。两张旧图替换前已留存；原稳定客户端路径和Meta UUID保留，人物PNG、代码、九宫格与依赖未修改。完整129项资源映射及两角来源、客户端和Creator native SHA见 `RESOURCE_IMPORT_MAP.json`。

Creator 3.8.8 `web-mobile` CLI 构建于2026-10-11 13:19:56完成，实际退出码36。当前源码 SHA-256 为 `1cebecc0e108c7e76e8253855eecd26df885b56dfe31c2e0415a68ddba47ad09`，构建入口 `index.html` SHA-256 为 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`，dialogue bundle config SHA-256 为 `294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`。完整日志、构建尝试和两张旧图见 `evidence/`。

Master 于2026-10-11 13:27:59在当前HTTP 8765构建上完成实际检查：新角饰显示和固定尺寸通过；三档面板检查无拉伸；90/90组合检查0失败；独立轴、连续切换、返回重入及控制台检查通过。截图及SHA、精确检查步骤见 `evidence/MASTER_RUNTIME_OBSERVATIONS.json`。目标设备、原生平台、SDK、GPU驻留与压力性能未测，保持 `NOT_TESTED`。

逐项验收结果见 `DELIVERABLE.json` 与 `RUNTIME_CHECK.json`。本包提交Tech同版Review；之后仍须遵守项目用户审批和Producer状态门禁，不表示用户已批准Client v0.4或Task DONE。

Master另对HTTP实际输出直连核验：入口、dialogue config和两张角饰native图片均HTTP 200，4项SHA与当前构建吻合；见 `evidence/HTTP_RESOURCE_IDENTITY.json`。
