# U04 客户端实现技术评审 v0.1

**结论：APPROVED，提交用户审核。** 对象为 `U04-DIALOGUE-CLIENT-001/v0.1` 的 Final10 实现，`UnitSampleGallery.ts` SHA-256 `3186b8ff463be0d0121b37a59789cb422662447b34f53304ca821efaab096ee4`，Creator 3.8.8 `web-mobile` 当前构建。此结论不代替用户批准，也不构成正式功能的 QA 结论。

编码前 `FEATURE_BRIEF.md` 已按坐标、SLICED、异步与横屏约束修订，内部 `BRIEF_REVIEW.json` 判 `PASS`。实现复用了 U00 五层背景及六店铺 Prefab；U04 资源放在独立 `dialogue` Bundle，运行时按当前组合加载。`refreshDialogue` 只在有效阶段映射存在时提交基底、脸片和前遮挡；选择代次与页面代次分别阻止旧异步回调改画面。映射 JSON 采用组件生命周期内单次加载与缓存，离页释放页内图像引用；重入后不以空映射的默认矩形绘制。底图、脸片、前遮挡以 1024×1536 源画布坐标叠放，AD/XJ 的 0.75 导出比例已纳入定位和显示倍率。

静态资源复核：Art `ASSET_MANIFEST.json` 的 129 个客户端路径均存在且 SHA-256 与源记录一致，129 个 PNG meta UUID 互异，SpriteFrame 子身份存在；18 阶段的源矩形×导出倍率尺寸校验无误。面板源图 512×256，meta 四边 Insets 均为 48；代码使用 `Sprite.Type.SLICED` 与 `Sprite.SizeMode.CUSTOM`。当前 `dialogue/config.json` SHA-256 `294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`，129 个正式 SpriteFrame 路径与 Art 清单逐项一致。证据见 `PREBUILD_STATIC_AUDIT.json`、`BUILD_BUNDLE_INDEX_AUDIT.json` 与 Client `RESOURCE_IMPORT_MAP.json`。静态索引本身不代表运行通过；下述 Web 观察独立记录。

构建与运行：Client `RUNTIME_CHECK.json` 记录 Creator 3.8.8 构建完成、CLI 36、HTTP 入口和 Bundle config 200。Master 在 Final10 同一源码版本的实际 Web 产物确认 U00 全景与店铺、默认 1280×720 人物及面板、90/90 组合且 0 失败（6432ms）、逐轴切换保留另外两轴、384×192/768×256/1024×384 三档面板，以及返回再进入后脸片和比例恢复。Tech 独立核对了当前源码、资源与 Bundle 索引，并查看了 Final10 默认、重入和 384×192 画面；完整运行截图及操作记录见 Client `evidence/MASTER_RUNTIME_OBSERVATIONS.json`；Tech已复核其中12张当前截图的SHA均匹配。960×540、连续8次切换与Final10浏览器控制台无新增错误/警告也见该记录。旧诊断截图只作为返工记录，不计入本次通过证据。

验收逐项：

1. **编码前核FEATURE_BRIEF复用点、目录命名、坐标映射、加载及适配约束并给Client明确可执行反馈。** PASS。简报已修订并通过 `BRIEF_REVIEW.json`；代码对照了 U00 复用、Bundle 目录、源画布映射与横屏布局。
2. **核129待导入PNG的真实源/工程hash、meta身份、SpriteFrame和SLICED Insets、三轴独立状态及异步生命周期；发现问题有明确Review Action。** PASS。129/129 源工程哈希、meta/SpriteFrame、四边48 Insets、三轴与异步生命周期均核对；Final10 90组合和重入实际运行通过。
3. **独立核当前构建与真实运行证据，区分静态/导入/构建/Web与目标设备，单元示例无QA；结论不以旧截图或占位证据代替。** PASS。当前构建身份与 HTTP 实际 Web 证据齐；静态、导入、构建、Web 分别记录。目标设备、原生、微信/抖音SDK及性能指标均为 `NOT_TESTED`，单元示例无 QA。

余项：冷网络/并发加载压力、目标设备帧率/GPU/驻留内存未测；6432ms是90步巡检耗时，不是设备性能结论。`UnitSampleGallery` 因单元示例继续增长，若U04升级为正式功能，Client应评估抽出独立页面/控制器，届时重新走正式接入与QA门禁。当前无阻断 Review Action。
