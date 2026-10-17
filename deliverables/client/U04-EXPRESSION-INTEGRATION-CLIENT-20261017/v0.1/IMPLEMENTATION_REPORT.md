# U04 表情 v0.3 六阶段客户端接入报告

本轮按用户批准的 Art v0.3 接入 MT_S2、AT_S0、AC_S0、AJ_S2、AD_S0、XJ_S0，共 42 张 native PNG：六组 base/front 与 30 个 face。生产源均取自 Art v0.3 `ASSET_MANIFEST.json`，42/42 源 SHA 与客户端目标 SHA 相等；39 张发生字节变化并在 `backup/pre_import/` 留存原文件，另 3 张原本即与批准源相同。目标 `.meta` 未改，旧 Image、SpriteFrame 与 Texture UUID 保持稳定。

资源映射沿用已有 `dialogue` bundle 和稳定路径。六组 base/face/front 的尺寸、source rect、pivot、offset、缩放和 `base → one face → front` 顺序沿用既有 handoff_normalized 几何；Tech Lead 已核对无需改 `UnitSampleGallery.ts`。`handoff_normalized.base/front` 内路径只作为历史几何来源标记；当前生产来源以映射顶层 base/front 及本版 `RESOURCE_IMPORT_MAP.json` 的 `source_path/source_sha256` 为准。AD/XJ 使用获批 native 192 PNG，不从 PSD 重导。其他十二阶段 60 个 face 及其他单元保持原状。

Creator 3.8.8 首轮 v1 CLI 有 Finished 标记并返回 Creator 成功码 36，但 Master 的实际 HTTP 浏览器检查发现其输入配置引用了不存在的 `assets/bundles/{world,tourist,shops,milk_tea}` 路径，导致五个运行依赖 bundle 未完整生成，页面加载失败。保留该轮完整输入身份、日志和浏览器失败证据于 `evidence/build-v1-failure/`，没有用该轮输出冒充可运行版本。

唯一恢复构建使用经过验证的 MINIGAME v0.8 portable staging 作为只读基底，生成独立 v2 快照；当前 31 个 TypeScript 文件逐一与基底一致，当前 dialogue 目录逐文件覆盖后与工作区一致（仅排除 `.DS_Store`）。v2 仅覆盖本轮 42 张 PNG 与 U04 runtime mapping；不改业务逻辑。Creator 3.8.8 web-mobile 新构建返回 36 并输出 Finished，五个 bundle（world、tourist、shops、dialogue、milk-tea）均包含真实 `config.json` 和 `index.js`。42/42 dialogue native 输出按既有 UUID 生成，SHA 与客户端输入完全一致。可复核的输入归档、逐文件 SHA 清单、build config、CLI/task 日志及 803 文件输出清单位于 `evidence/build-v2/`；构建身份汇总位于 `BUILD_CHECK.json`。

恢复版实际 HTTP 入口为 `http://127.0.0.1:8765/`，当前由 loopback 服务提供 v2 输出。Master已通过Codex内置浏览器完成并记录30/30新态、九处圈选/共享层、90/90巡检（0失败，7042ms）、三轴保留、快速切换、一次返回重入、390×844窄屏切换及v2控制台核查（warning/error 0）。最终证据见 `RUNTIME_CHECK.json` 与Master `RUNTIME_VERIFICATION.json`；Tech REVIEW为APPROVED。范围与平台/性能边界在运行记录中明确，本交付提交用户审核。未测微信/抖音小游戏、原生平台及目标设备性能。

本轮项目改动限于获批 42 张 PNG、六组资源映射溯源及本任务交付目录。既有 `Gallery.ts`、framework、其他单元和其他任务脏改均保留。Client 未执行 Git 操作。
