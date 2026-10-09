# U00 v0.5 构建与运行记录

源码 SHA-256 与隔离副本 SHA-256：299F72C84A01653C696B28015E6ACFF7130CC14CFAEB181CAD3B852A87306C0A。Creator 版本为项目锁定的 3.8.8。

TypeScript：PASS，退出码0。使用 Creator 3.8.8 自带 TypeScript，命令为 `node <Creator>/resources/app.asar.unpacked/node_modules/typescript/lib/tsc.js --noEmit --project apps/client/temp/u00-scale-build-20261009/tsconfig.json --skipLibCheck --target ES2017`。范围是隔离副本 `assets` 项目脚本，使用 Creator 生成的声明；隔离 Gallery SHA 与源码 SHA 一致。未对Creator声明库本身作完整类型检查（`skipLibCheck`）。

构建状态：BLOCKED / NOT_TESTED。第一次隔离副本 `apps/client/temp/u00-v05-build-20261009` 是从当时当前 `apps/client/assets/settings/profiles` 创建，Gallery 和 settings 均为本轮源码/工作区版本；此副本直接非管理员启动返回 `-36863`，没有输出。随后按已有本机 runbook，更新旧 U00 成功构建副本 `apps/client/temp/u00-scale-build-20261009` 的 `UnitSampleGallery.ts` 为本轮 SHA；它的 assets/settings/profiles 仍沿用 v0.4 成功构建快照。该副本的管理员 PowerShell 启动器两次均报 Windows 错误 `0xc0000142`，Creator脚本未运行，未产生当前版Creator日志、构建输出或Creator结果文件。两种隔离输入均无法完成构建；没有再走其他提权路径。

本轮工作区存在未提交的 U03 PNG 与 `cocos-service.json` 改动。当前设置和资源修改是否能随本轮源码构建通过没有验证。两个隔离输入的来源以上述记录为准；由于当前没有可核的本版产物，不将任何既有 build 或 v0.4 HTTP/IAB 记录称为 v0.5 验证。

HTTP / Codex 内置浏览器：NOT_TESTED。故障解除后需用 v0.5 源码与明确记录的同一资源/设置身份重新构建，再检查 390×844、720×1280、默认脚点/缩放、恢复、参数导出及重进。真机/平台性能同样未测。
