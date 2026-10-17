# Gallery 按页模块租约与裁片接入轻量 Brief v0.1

任务：`MINIGAME-ART-OPT-INTEGRATE-GALLERY-20261017-CLIENT`。当前基线 Gallery `apps/client/assets/UnitSampleGallery.ts` SHA-256 为 `fc660686f4059ddbbec69bfe0eb414b8f26b374229c25f55f51d6cfb5be106df`。接管 Gallery、新 `framework/asset-integration/gallery_asset_session.ts`，并按 Master 明确授权，为 `sakura_v03_environment.ts` 的 `populateSakuraV03` 增加可选页面预载 `ReadonlyMap<string, SpriteFrame>` 参数（key 是逻辑 ID，实际资源源路径仍按 `SAKURA_V03_LAYOUT.prototypes[].path` 精确解析）。不改已验证布局/玩法、不触碰资源 Owner 的 U01 editor/U05/registry/resolver/staging；原 `sakura_v03_layout.ts` 保持不动。

## 目标与结构

为 Gallery 增加 `@property public useOptimizedBundles=false`。false 保持原 Inspector / `resources.load` legacy 行为；true 时不读取尚未加载的 Inspector 资源字段、不通过 legacy loader 掩盖缺失映射。Gallery 在实例生命周期内只创建一次 `createClientAssetRuntime()`，共享其 `modules` 与 `derived`；U04 的 mapping、decoration、portrait Acquire 迁到该 `modules`，派生帧从同一 `derived` 取得，不再创建独立池。

每次页面切换创建有唯一 token 和 page epoch 的 `GalleryAssetSession`。目标页依赖全部到齐后才提交页面资源和显示页面；失败保留菜单/失败重试入口，重试使用新 epoch。迟到回调只能释放自身新租约，不能绑定或覆盖当前页。菜单卡片状态依据批准模块清单的静态可用性，不依赖尚未加载的 Prefab/Inspector 字段。

U00 取得 world、shops、tourist；U02 取得 tourist；U03 取得 shops；U04 取得 world、shops、dialogue 相关资源并与既有 U04 模块复用同一 runtime；U05 取得 milk-tea 及清单声明依赖。U01/U05 调用侧通过既定 `loadPageResource(path,type,callback)` / `releasePageResource(path,type)` 访问 Gallery；U05 在激活前绑定捕获该页 session 的 provider，legacy 模式传 null。共享资源按页租约保留到页面退出；单个资源 release 不 force-release 仍被共享的纹理。

派生帧仅由 `DerivedAssetResolver` 缓存创建；Prefab instance 在加入场景前替换已登记 frame，并设置 `Sprite.SizeMode.CUSTOM`、`trim=false`，保留原 Prefab 的 UITransform、anchor、position、scale。绝不修改共享导入 SpriteFrame 或 Prefab。40张游客主体帧顺序、挂点、动作/动画时序不变；特例保持原资源路径。

退出页面时先取消 session 与 pending requests、停止页面状态/输入回调，清空 SpriteFrame、Label.font 与 Gallery 的强引用，再 destroy 页面节点。核对 Creator 延迟销毁时序后，在安全的 after-draw 生命周期点释放 session module/derived leases。dispose 幂等；旧 generation 不得迟到绑定。onLoad 只建 Gallery/runtime/menu，不预加载各页资源。

## 输入核对与待协调项

现有 `createClientAssetRuntime()` 返回 `{ modules, derived }`，准确源文件为 `framework/asset-integration/client_asset_modules.ts`、`approved_asset_registry.ts` 和 `derived_asset_resolver.ts`。现有模块标识包含 `world`、`tourist`、`shops`、`milk-tea`，U04 的 `u04-mapping`、`u04-decoration` 与 portrait IDs 由 `U04_MODULE_MANIFEST` 声明。

将 `SAKURA_V03_LAYOUT.prototypes` 的23个ID按**真实 prototype path**逐项对照模块manifest。8项不在 `APPROVED_ASSET_MODULE_MANIFEST`：sky_l、sky_r、bridge_body_l、bridge_body_r、bridge_front_l、bridge_front_r、bridge_street_master、far_l_eye_glow。其中 far_l_eye_glow 仅在 `client_asset_modules.ts` 本地 extra 表登记；另7项缺少 Gallery 可用模块路径声明。最关键的是逻辑ID `tex_sakura_rr_far_l` 实际路径为 `sakura_v03/tex_sakura_rr_far_l_eye_dark_base/spriteFrame`（layout source SHA `ee02f590849e6aa4cb51244147d78a11a5c2e5560969d689e4c9db72cd5e3940`），而Art83新裁片 manifest 中同逻辑名 `tex_sakura_rr_far_l` 指向另一张 `.../tex_sakura_rr_far_l/spriteFrame`；不能用Art裁片替代 `eye_dark_base`，否则会恢复旧红眼表现。桥身实际路径为 `tex_sakura_rr_bridge_body_l_clean.png` / `_r_clean.png`；不能按ID推导路径。资源 Owner 需核对 staging 实际路径/UUID并补准确登记；我不猜补或改写其 registry/resolver/staging。已授权修改的环境 helper 增加可选预载frame map后，生产 U00/U04 可用Gallery session的准确路径 map，legacy调用仍保留原 `loadFrames` /全局 `frameCache` 行为。生产模式遇缺映射必须显式失败，禁止回退 legacy 隐藏问题。

## 验证与风险

先用实际 `ModuleAssets` / `DerivedAssetResolver` 与 Gallery helper 方法验证竞争同页加载、切换/取消 generation、失败重试、幂等退出、U04同池、共享租约保留、先清引用后释放及20次循环。再由父 Task 统一 Creator隔离CLI与IAB。既有 UI v0.5 布局源码冻结不改；新 session helper 不引入依赖。

当前 staging Scene 尚未接入 `useOptimizedBundles=true`，因此它的发布输入/Bundle分包/启动包收益不由本 Task 单独宣称；输出资产映射缺口与Prefab serialized field解除工作由资源 Owner staging 解决。UI/动作语义不变。
