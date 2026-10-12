# Client 实现报告：灯笼亮度 Pilot v0.2

## 实现范围

在 `apps/client/assets/labs/lantern-pilot-v02/` 新增隔离的 `LanternPilot.scene`、`LanternLightingPilot` 组件、独立 `lantern_lighting.effect` 及 mask 实验纹理引用。场景使用原奶茶店 body/sign 纹理作为只读引用；body SpriteFrame 在运行时新建，指向源 body 的同一 Texture2D，设 `packable=false` 并明确完整 1024×1024 rect/originalSize/offset。材质对象只由单个 pilot Sprite 持有。效果代码按批准的 mask 坐标与单条 2 秒曲线实现亮度参数；强度 1.0 时使用源 RGB，输出保留原采样 alpha。画面提供播放、暂停、复位按钮和简短状态行。

功能 brief：[FEATURE_BRIEF.md](FEATURE_BRIEF.md)。没有修改 UnitSampleGallery、正式奶茶店 PNG/meta/Prefab、全局 builder/package settings 或引入新依赖。现有工作区里 `apps/client/assets/UnitSampleGallery.ts` 在本任务开始前已处于 modified；本任务未编辑它。

## 复用、验证与限制

复用 Art 唯一 mask（输入 hash 与 128×256 尺寸写入 `evidence/build/source-hashes.sha256`），以及正式 body/sign 图片和 Texture2D；没有复制完整 body。静态 SHA 核验确认 body/sign 图片及 meta 与批准来源一致。

Creator 3.8.8 首次 CLI 调用在 `NSApplication` 初始化时 SIGABRT，随后唯一一次 LaunchServices 恢复返回 `kLSNoExecutableErr`。无当前构建产物，故 Creator 导入/Effect 编译、实际 UV/采样、亮度循环与复位、Draw Call、GPU纹理格式、性能、HTTP 和内置浏览器验证均为 `NOT_TESTED`。Scene 的对象索引和资源引用静态检查通过（`../evidence/build/scene-static-check.json`，范围不含 Creator schema/导入）；当前源码 hash 见 `../evidence/build/pilot-implementation-hashes.sha256`。详情见 [RUNTIME_REPORT.md](../evidence/RUNTIME_REPORT.md) 和 `../evidence/build/build-attempts.json`。未使用旧 build 输出或静态 CPU 图像模拟代替 Cocos 结果。

当前交付为受环境阻塞的代码候选，不等同于已验证或已批准的动画成品。Master/Tech 如有恢复后的 Creator 运行环境，可按本简报与原始 hash 重新构建、回放和留证；任一 UV、零差、alpha、材质隔离或 DrawCall 硬门槛失败，应停止并退回修订。
