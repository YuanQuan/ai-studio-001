# 灯笼首样技术运行核对 v0.2

状态：`BLOCKED`（Creator 3.8.8 两次受限启动均未进入构建）。引擎兼容、运行视觉及性能各项均为 `NOT_TESTED`。静态 Art 像素参考与源码检查不能替代真实构建和运行。

## 本次构建阻塞与独立核对

- Client 的 [`build-attempts.json`](build/build-attempts.json) 记录：首次直接 CLI 于 2026-10-12 15:32:04–15:32:08 +08 退出码 134；本机 `/Users/yuanquan/Library/Logs/DiagnosticReports/CocosCreator-2026-10-12-153208.ips` 确有 `EXC_CRASH` / `SIGABRT`，触发线程栈进入 `NSApplication sharedApplication` 与 `_NSGetAggregateUIMode`。这证明应用初始化阶段崩溃，尚不能断言更底层原因或项目代码错误。
- 唯一恢复尝试 `open -a` 于 15:33:42–15:34:14 +08 窗口内退出码 1，记录 `kLSNoExecutableErr`；Client 已核 app 内可执行文件存在。两次均未形成 Creator 构建日志；核对时 `/private/tmp/lantern-pilot-v02-build` 与本批 `creator-build.log` 均不存在。未再次启动 Creator，旧 `apps/client/build/web-mobile` 不作本批证据。
- 当前 `lantern_pilot.ts`、`lantern_lighting.effect`、`LanternPilot.scene` 的 SHA-256 分别为 `25f2dd19202ba5269aee961df5db464deded183d93ce094b085c9cb8ca1c8c4e`、`ba0dbf42329a025d38831440ef667c337b27543862c92fbb2d1d1cf64a105069`、`cc157a9fe9344bed9229672fe1cf34a2e4be430fcd86a5fccf169c5a14af3297`，与 Client 身份表一致。相比上次 Tech 审查版，TS 第 4 行及 Effect 第 1 行仅各删除一处尾随空格，未改逻辑；这项整理不产生构建证据。Client 记载两次失败后曾清理源码，因此这组当前文件没有关联的构建产物。
- 静态检查可见独立新 `SpriteFrame` 共享 body 纹理、全幅 rect、`packable=false`、单实例材质与 2 秒强度曲线；Effect 按全图 UV 计算局部 mask 位置并保留采样源 alpha。Scene 的 JSON 引用结构检查为 `STATIC_PASS`，但该检查明确未覆盖 Creator 导入、资源解析、Effect 编译或运行；静态阅读未发现可确定的同批实现错误，也不能据此判定渲染正确。

本次结论：构建、Scene 导入与资源解析、Effect 编译、实际 UV/atlas/trim 和 mask 采样、1.0 回源及 mask 外/alpha 零差、动画/暂停/重入、Draw Call、纹理实际格式与内存、CPU/GPU、HTTP 与浏览器画面全部 `NOT_TESTED`。本批运行验收为 `BLOCKED`，没有性能或兼容性 `PASS`。

## 已核的本机依据

- 本机 Creator `3.8.8` 安装于 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app`，项目版本同为 `3.8.8`。内置引擎 `cocos/gfx/base/device.ts` 暴露 `numDrawCalls`、`memoryStatus`，`cocos/profiler/profiler.ts` 的 Draw call 和纹理内存显示取自同一设备计数。
- 同版 `Texture2D` 继承的纹理接口可读 `width`、`height`、`getPixelFormat()` 与 `getGFXTexture()`；底层 GFX texture 可读 `format`、`width`、`height`。这些是导入后观察入口；PNG 的 `L` 模式与 32,768 字节理论 R8 数据量，不能证明 Creator 实际 GPU 格式或常驻内存。
- 同版 `SpriteFrame` 可读 `uv`、`rect`、`originalSize`、`packable`、`texture`。当前正式 body `.meta` 为 1024×1024、无 trim、`atlasUuid` 空但 `packable=true`；试验运行时新 frame 设 `packable=false`，仍须在实际渲染中证明纹理、UV 与原图 ROI 映射。

## 首个真实构建的最小核法

1. 记录本次 Creator 命令、实际结束日志、构建输出路径与时间、Scene/Effect/脚本/掩码身份；旧 build 文件不能作本次证据。确认独立 pilot Scene 打开且无资源/Shader 错误。
2. 在运行时记录 body 与 mask 的实际 Texture2D/GFX 尺寸、格式、mipmap/采样设置，frame 的 UV/rect/trim/atlas 状态和材质实例身份。以源图 ROI `[178,505,280,670]` 与非零 bbox `[200,533,249,598]` 检查 V 方向、滤波边缘和 sign/其他像素；强度 1.0 要在固定同背景、尺度和色彩条件下回到源 RGB/alpha，动态仅非零 mask 内有 RGB 差异。
3. 同一独立 Scene、相同视窗与渲染顺序，分别取静态 1.0 与播放稳定帧的多次 Draw Call 样本，按 `director.root.device.numDrawCalls` 或内置 Profiler 核新增量 ≤1；0 只是优化目标。不要用场景切换、首帧 Effect 编译或不同图集状态的计数相比。
4. 核 mask 纹理实际格式与可能的副本，按真实格式/尺寸/mipmap估算增量，并用 `device.memoryStatus.textureSize` 的总量变化交叉核；不能把总量变化单独归因于 mask，且不可复制约 4 MiB 的全店 body。mask 增量硬上限 0.25 MiB。CPU/GPU 各 0.1 ms/帧仅参考，须有目标设备、测量精度、基线/候选与误差才可判断；无精度或未测保持 `NOT_TESTED`。
5. 回放完整约 2 秒单曲线、最暗点、循环接缝、暂停/隐藏/重入和静态降级；保留实际 HTTP 构建与 Codex 内置浏览器画面。该示例由 Owner 留证，不安排 QA；正式接入另走审批与适用 QA。

上述核法留作后续 Creator 能正常构建时的复核标准；本次两次启动失败，未产生任何可供运行核对的新产物。
