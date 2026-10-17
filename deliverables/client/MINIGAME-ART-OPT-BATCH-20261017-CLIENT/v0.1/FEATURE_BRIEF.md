# 客户端功能概要：统一窗口适配与资源租约

任务：`MINIGAME-ART-OPT-BATCH-20261017-CLIENT`；版本：v0.1；Owner：Client。

## 1. 目标与范围

在已批准的 TECH_DESIGN、UI_SPEC、LAYOUT_SPEC 与 VFX_SPEC 下，为 Cocos Creator 3.8.8 单元示例增加统一视窗读取/映射和共享资源租约能力，并适配 `UnitSampleGallery` 的 U00—U04 与 `labs/u05/milk_tea_lab.ts`。保留页面视觉、玩法与时序；U05完整1024×1536等比contain，覆盖面板只代理实际测量不达标组且默认关闭；U04竖屏重排，横屏保持既有九宫格、人物叠前与角花组合。

本阶段不改 PNG、现有 meta/UUID、Scene/Prefab 硬引用，不迁移资源目录或新增分包；不改变游戏规则、特效帧/节奏、对话组合和素材。未获批准的新裁片不导入。示例由Owner留运行证据，不作为正式QA结论。

## 2. 现有能力复用

复用现有 Cocos `view`/Canvas/visibleSize、既有页面状态和输入流程、U04 dialogue 的当前在途加载/refcount 池（迁移所有权到唯一 ModuleAssets，不保留双池）、U05 BitmapFont 与 `u05_interaction_presentation.ts` 的唯一 run/presentation 状态，以及现有 Creator CLI 构建配置和 `serve-unit-build.mjs`。

新增公共模块的原因：当前没有跨页 ViewportAdapter/Mapper 或统一模块资源租约接口；在 Gallery 巨类或各页面重复平台判断/引用计数会造成职责膨胀与释放竞争。

## 3. 结构设计

新增 `apps/client/assets/framework/viewport/`：定义 `Rect`、`ViewportSnapshot`、`ViewportAdapter`，含 Web、微信、抖音适配器；平台 API 与 `window` 限于对应 Adapter。新增 `ViewportMapper`，根据 snapshot、实际 Canvas 内容矩形（含 letterbox）与 visibleSize 转换安全区、胶囊排除矩形及触点，DPR不参与逻辑坐标。事件按帧合并；零尺寸保留最近有效revision；订阅可释放。

新增 `apps/client/assets/framework/module-assets/`：提供按稳定资源键共享inflight的 `ModuleAssets.acquire(moduleId, ownerGeneration)` 与 `Lease.get/release`。每个Owner独立计数，重复释放幂等，取消/迟到完成按generation处理；依赖先取后放，失败逆序释放。页面仅持最小必要资源集合，退出先清节点引用再释放租约。U04现有局部池并入新所有权，避免新旧池同时持有。

Gallery与U05按上述边界接入，必要时抽出小型布局/安全面板辅助组件，避免继续扩张主Gallery；不抽象成大型通用UI框架。保持窗口级遮罩、48×48主热区、字号、间隔、滚动、状态、回退与各页状态保留规则。U04只基于实际方向判断横竖屏，不强制切换方向。

## 4. 协议与平台影响

不涉及网络/API/跨端业务Contract。平台差异封装在Web/微信/抖音 ViewportAdapter；实现前核实仓库已安装 SDK 可用API与坐标语义，不猜跨版本行为。平台胶囊缺失返回null，safe缺失回退窗口并记录诊断。当前验证范围为Web，小游戏平台与设备实测未覆盖时标NOT_TESTED。

## 5. 性能影响

- resize/orientation事件合并到每帧最多一次；页面仅在revision变化时重排，不新增常驻高频轮询或Tween。
- 映射使用少量矩形/点计算；实现避免逐帧临时对象分配。
- 新增公共模块不生成图片、图集、节点或DrawCall；U05覆盖层按需创建/显示，默认关闭。
- ModuleAssets避免同键重复加载、竞争释放与双池所有权；但现有启动入口对全帧/店铺Prefab的硬引用仍可能使资源全生命周期驻留，本任务不解除这些引用，也不宣称启动包/包体或GPU驻留已有收益。
- 序列帧、Shader、透明层、节奏和同时播放量维持现状；Web构建不证明GPU/目标设备性能。记录加载/失败/重入逻辑证据；无平台GPU测量则保持NOT_TESTED。

## 6. 日志与调试

记录稳定标签 `[Viewport]`、`[ModuleAssets]`，中文描述关键诊断（safe fallback、capsule unavailable、load failure、stale generation、release imbalance）。仅在异常/资源失败时输出，避免每帧日志。继续使用当前单元示例入口与独立U05 Lab，不增加新的美术资源或外部调试依赖。

## 7. 测试与验证

静态/受控测试覆盖窗口坐标到Canvas/UI映射、letterbox、safe/capsule裁切、方向变化、零尺寸恢复；租约覆盖并发共享、owner竞争、失败后重试、取消/迟到成功、依赖逆序释放、重复释放和20次进入退出稳定。适配页面后通过 Creator 3.8.8 隔离副本CLI构建与loopback HTTP产物，在Codex内置浏览器实际操作六种竖屏样本、U04两横屏及目标路径；浏览器无法实际设置DPR时逐项记NOT_TESTED，不伪称DPR矩阵通过。另报告真实运行错误/缺资源、画幅/热区/弹窗/滚动/返回/重试和页面重入证据。此为Owner示例验证，不邀请QA Agent，也不称正式QA通过。

## 8. 风险与 Tech Lead Review

1. 请确认Mapper使用的Canvas内容矩形与触点坐标域API、四角包围转换和safe/capsule合并规则，尤其Cocos触点值需要减去的画布原点。
2. 请确认 `acquire(moduleId, ownerGeneration)` 对同一模块多owner、依赖租约、取消与迟到Promise的契约，以及错误时计数回滚/显式重试边界。
3. 请Review U04在途帧加载与局部refcount池的迁移顺序，确保只有新池拥有底层资源且不提前释放其他页面共享帧。
4. 请确认各页 resize 适配不得重置选择、动画时相、滚动或奶茶 run/presentation，且U05代理组根据真实逻辑像素测量启用，不永久强制替换合格控件。
5. 当前系统字体来源未知；实现不引入新字体或伪称授权完成。当前 Web 运行不能替代小游戏平台、真机或GPU测量。
