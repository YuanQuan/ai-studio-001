# U00/U01 主场景 v0.3 资源接入记录 v0.1

本次把用户已批准的 `SCENE-CLARITY-REDRAW-ASSET-20261010` v0.3 五张 3072×1024 RGBA 原位 PNG 替换到 `apps/client/assets/units/background/textures/`。五张客户端文件与获批 Art 导出逐项 SHA-256 相同；沿用原 `.meta` 与 image、Texture2D、SpriteFrame UUID，场景与 Prefab 引用不变。具体 ID、来源/客户端路径、哈希和 UUID 见 `evidence/ASSET_IMPORT_AUDIT_PREBUILD.json` 及 `project/ASSET_HANDOFF_REGISTRY.md`。本次未修改 U00 六店 0.34 基线、镜头视差 `[0.3,0.8,1,1,1]` 或其他单元逻辑。

Creator 3.8.8 的前两次沙箱 CLI 运行以 SIGABRT / 134 失败，诊断保存在 `evidence/CREATOR_CLI_CRASH_REPORT.ips`。随后 Client 使用获准主机权限恢复构建；当前 `/private/tmp/scene-clarity-client-v01/web-mobile/` 的 `index.html` SHA-256 为 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`。Creator CLI 以成功完成码 36 结束，`evidence/CREATOR_BUILD_LOG.log` 同时记录 `Build Task (web-mobile) Finished in 4 s`；构建身份、输出文件哈希与五张 UUID 路径 PNG 见 `evidence/BUILD_MANIFEST.json` 和 `evidence/ASSET_IMPORT_AUDIT_POSTBUILD.json`，Tech 独立核五张构建 PNG 与客户端/Art v0.3 字节一致。早期崩溃是已恢复的诊断历史；构建脚本子进程 SIGTERM 日志作为诊断信息保留，不影响 Creator 完成状态。

同一当前 Web 构建经 `127.0.0.1:8767` 提供并在 Codex 内置浏览器检查。Owner 的 U00/U01 进入、放大、拖动、Reset、Return 的实操及反馈已写入 `evidence/BROWSER_RUNTIME_CHECK.md`；Art 在该构建现场查看 U00 中段/右段和 U01 默认/放大视窗，结论见同版 `ART_REVIEW.json`。Tech 在 `TECH_REVIEW.json` 核构建身份与静态资源链，未声称独立重复浏览器操作。`evidence/HTTP_ACCESS.log` 保存本轮请求，其中 289 条 GET 均为缓存校验的 304 响应；五张构建图的当前字节已由 Tech 独立核对。Client 捕获并在工具输出中显示的截图只有入口菜单，U00/U01 场景帧未保存为本地文件，本交付不提供场景截图路径或哈希；操作记录、Art 现场 Review、构建身份和 HTTP 请求共同形成可追溯范围，截图缺口明确保留。

Art/Tech 当前 Review 均为 `APPROVED`，其结论限现有静态资源链和所见 Web 运行画面。真实手机触控、目标设备驻留/帧率、微信与抖音小游戏平台未测；五张 RGBA8 全展开约 60 MiB 仅为基础估算。Master 接受与用户对本次 Client v0.1 的审批仍是独立后续门禁，不由本报告或两份专业 Review 代替。
