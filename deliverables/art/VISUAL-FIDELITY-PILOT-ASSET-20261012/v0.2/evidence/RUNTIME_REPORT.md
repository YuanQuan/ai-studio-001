# 灯笼亮度 Pilot 运行记录

## 结果

状态：`BLOCKED`。已制作隔离的 Cocos Scene、组件、Effect 与 mask 实验引用；当前机器无法启动 Creator CLI 完成构建，因此没有真实 Cocos 运行画面、HTTP 产物或浏览器验证。代码候选不宣称已导入通过、效果通过或可供视觉成品审核。运行依赖项保持 `NOT_TESTED`。

## 时间与预算

- Client 实际开工：2026-10-12 15:26:31 +08:00。
- Creator 首次启动尝试：进程报告于 15:32:04 启动、15:32:08 崩溃；exit 134。
- 唯一恢复启动：在 15:33:42 至 15:34:14 +08:00 之间执行，精确秒未知；LaunchServices exit 1。
- Client 编码与证据记录：15:26:31 至 15:36:27 +08:00，9分56秒。生图 0 次，Art mask 候选 1 个，Client 实现内调整 1 次（状态提示初始化顺序/无效 import 清理；累计修正预算 1/2），新增费用 0 元。完整任务制作时长未达到 4 小时上限。Creator 导入/构建环境故障影响了运行验证时间，不能归为制作性能或归责于角色。

## 构建身份和诊断

使用 Creator 3.8.8 与专用配置 `build/creator-build-config.json`，只列出 `db://assets/labs/lantern-pilot-v02/LanternPilot.scene`，独立输出目标为 `/private/tmp/lantern-pilot-v02-build`，日志目标为本目录 `build/creator-build.log`。两次尝试均未创建输出目录或构建日志；没有使用既有 `apps/client/build/web-mobile` 作为新构建。完整命令、时间精度、退出码和诊断记录于 `build/build-attempts.json`。当前最终源码 hash 见 `build/pilot-implementation-hashes.sha256`；启动失败后的小幅源码整理没有对应构建输出。

首次直接 CLI 在 macOS 图形应用初始化期间 abort。系统诊断文件 `/Users/yuanquan/Library/Logs/DiagnosticReports/CocosCreator-2026-10-12-153208.ips` 记为 `EXC_CRASH / SIGABRT / Abort trap 6`，触发栈包含 `NSApplication sharedApplication` 与 `_NSGetAggregateUIMode`，未进入 Creator 构建阶段。随后唯一一次依据该证据执行 LaunchServices 启动；`open -a` 返回 `kLSNoExecutableErr`，尽管安装包 Info.plist 声明 `CocosCreator` 且 `Contents/MacOS/CocosCreator` 存在并有执行位。没有修改安装目录权限、安全设置或使用其他浏览器/运行入口。遵守一次恢复限制，没有继续启动 Creator。

## 分项状态

| 项目 | 结果 | 证据/原因 |
|---|---|---|
| 已批准 body/sign 字节保持不变 | PASS（静态 SHA 核对） | `build/source-hashes.sha256` 与 MASK_SPEC 中的源 hash 一致 |
| Art mask 候选身份 | PASS（输入核对） | 输入 SHA `f9a67671a0e1d4f03974f62b3fdf8de1131e4e99adc7aad4fecd13095fba7b9f`，128×256；Art 像素公式证据见其 `evidence/VISUAL_VALIDATION.json` |
| TypeScript/Effect Creator 导入及编译 | NOT_TESTED | Creator 未进入构建任务；临时编辑器缓存不作为通过证据 |
| 实际 SpriteFrame UV、trim、atlas、mask V 方向 | NOT_TESTED | 尚无 Creator Scene 运行，不能证明运行时采样映射 |
| 强度 1.0 原图零差，mask 外零差、alpha 不变 | NOT_TESTED | 未渲染实际 Cocos 画面；Art 的静态 reference 不替代本效果验证 |
| 完整循环、暂停/隐藏/复位 | NOT_TESTED | 没有可运行构建 |
| 新增 Draw Call ≤1 | NOT_TESTED | 未取 `director.root.device.numDrawCalls` 基线/候选样本 |
| mask 实际 GPU 格式/纹理占用 | NOT_TESTED | 未导入到 Creator 并读取 Texture2D/GFX format |
| CPU/GPU 0.1 ms 参考指标 | NOT_TESTED | 未进入实际设备测量 |
| loopback HTTP 与 Codex 内置浏览器 | NOT_TESTED | 没有构建产物，未启动服务 |

未观察到图像候选效果，因此本次没有可提交 Art 同尺度 Review 的 Cocos 回放帧。若恢复 Creator CLI 后继续，需要从现有源码/哈希身份重新构建并重新核验；不得复用旧 Web 输出当成本轮运行证据。
