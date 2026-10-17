# Gallery 按页资源会话实现记录 v0.1

任务：`MINIGAME-ART-OPT-INTEGRATE-GALLERY-20261017-CLIENT`。输入简报 `FEATURE_BRIEF.md` SHA-256 `15896c9c9dee3a04052f3e96b32d0c7f8cfc01f4cb9fa2bf8bf472f118f35abb`；Tech 轻评通过，Master 接受并授权实现。该阶段未改 UI 布局、动作时序、Scene/Prefab 硬引用、原 PNG、现有 UUID 或 layout 数据。

## 实现内容

`UnitSampleGallery` 新增默认关闭的 `useOptimizedBundles`。Gallery 实例只创建一个 `createClientAssetRuntime()`，并将同一 `ModuleAssets` 交给 U04；优化模式在菜单阶段清理 Inspector 硬引用，卡片可用性按静态模块清单判断。按页入口为 U00 world/shops/tourist、U01 world/shops、U02 tourist、U03 shops、U04 world/shops/U04 mapping/U04 decoration、U05 milk-tea/tourist。所有页资源准备成功后才调用原页面构造；失败页保留重试入口，重试创建新 page token/generation。

新增 `GalleryAssetSession` 管理页面 module lease、派生帧句柄、精确路径查找、异步回调、取消和幂等释放。页面退出时先清 Gallery 的 Prefab/JSON/frame 强引用，再销毁节点，等待 Creator `Director.EVENT_AFTER_DRAW` 后释放页面会话；派生帧句柄先于底层模块租约释放。每个 await 后的派生帧交接会校验当前 generation；迟到的租约释放后拒绝，不能写回已关闭页面。dispose 同时清派生源帧映射。精确路径的同 Bundle/路径/类型/修订别名去重，跨 Bundle 或修订冲突失败。

派生 Prefab 帧替换先设 `Sprite.SizeMode.CUSTOM` 和 `trim=false`，再赋 frame，并还原原 UITransform 尺寸、anchor、Node position 和 scale。页面资源 Provider 捕获当前 session，U01/U05 不从 Gallery 动态回查其他页的 session；U01 provider 提供 `bindPrefab(root,moduleId)`，资源 Owner 已在六店 Prefab 克隆入场前调用。U01 页面已加入 shops 模块并准备店铺派生帧，保留原六店与布局数据。

`sakura_v03_environment.ts` 的 `populateSakuraV03` 增加可选 `ReadonlyMap<string,SpriteFrame>`：生产页使用按 layout 实际 prototype.path 预载的帧，不写入全局 frame cache；没有参数时原 `loadFrames()` 兼容路径不变。far_l 与桥身等资源按 layout 实际路径解析，不根据逻辑 ID 猜测。

## 验证

- Creator 3.8.8 随附 TypeScript 4.9.5 语义检查：`tsc --noEmit --skipLibCheck --lib es2018,dom -p apps/client/tsconfig.json`，退出码 0。
- `tests/gallery_asset_session_probe.cjs` 实际执行 session、ModuleAssets 和 DerivedAssetResolver 方法：迟到派生租约取消、stale handle 释放、非 CUSTOM Prefab 派生绑定保留几何、两个 Owner 共享同一来源与派生缓存，以及 20 轮页面双 Owner 释放后缓存/来源 refcount 归零，PASS。
- Creator 导入、隔离 Web 构建、实际浏览器/IAB 页面验证由父 Task 统一执行；本子任务不宣称已运行。
- 实际 20 次 Web 页面循环、listener cleanup 计数、DPR2/3 与真实平台释放曲线尚未测量。session 控制台诊断记录 generation、lease/inflight/derived 计数；监听清理计数如实显示 `NOT_TESTED`。

## 当前限制

本 Task 交付的是 Client 调用点与按页资源会话；启用生产 Scene flag、Prefab 序列化硬引用转换、资源 staging、Bundle 启动包/生命周期收益判断和最终统一构建属于父 Task 与资源 Owner 的聚合范围。准确源文件、meta UUID 与语义/方法级验证见 `SOURCE_CHANGE_MANIFEST.json`、`OWNER_VERIFICATION.json`。
