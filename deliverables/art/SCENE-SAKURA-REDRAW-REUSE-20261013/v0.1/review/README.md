# 本地审阅入口

在本版本目录开启本地 HTTP 静态服务后，打开 `review/micro_motion_preview.html`。页面采用天空、远景、静态中景和四张复用的水上火焰图，每帧七次 `drawImage`。天空 ±12px、远景同向 ±6px、四处水上火焰 ±2px，周期 3 秒；莲座与倒影不随火焰移动，五处山间火灵保持静态。“暂停并回基准”可显示静态正式图；动态图分组零位因 RGBA8 分组合成的量化，最大通道差 2，未做 Cocos 验证。`review/scene_environment.png` 是无动画的 3072×1024 正式环境预览。此页只证明浏览器 CPU 微动方案，不是 Cocos 运行结果，也未证明目标设备帧率或显存指标。

ZIP 只放正式环境母版、活动切片、映射、预览和说明。原生生图、逐笔工具原件路径、参考来源及弃用候选的完整审计仍保留在项目内本版本目录的 `source/native/`、`EXECUTION_LEDGER.json`、`reference/` 和 `history/candidates/`，不在正式环境资源包内。
