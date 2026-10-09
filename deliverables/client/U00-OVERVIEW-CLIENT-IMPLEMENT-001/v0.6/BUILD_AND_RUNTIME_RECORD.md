# U00 v0.6 构建与运行记录

Creator 3.8.8：隔离副本为 `apps/client/temp/u00-v06-build-20261009`，由当时工作区完整复制 `assets/settings/profiles/.creator/package.json/tsconfig.json` 创建；U00 源码 SHA 和 `cocos-service.json` SHA 均与副本一致，哈希及12张并行U03纹理输入见 `BUILD_INPUT_HASHES.json` 与 `ASSET_INPUT_HASHES.json`。

TypeScript noEmit：PASS，Creator 3.8.8 TypeScript与生成声明，退出码0。命令和隔离副本 Gallery SHA 见 `TYPECHECK_RESULT.json`；stdout/stderr 原始文件亦已保留。使用 `--skipLibCheck --target ES2017`，检查项目 assets 脚本。

构建：BLOCKED / NOT_TESTED。首次 `Start-Process Creator.exe -Verb RunAs` 外层同时使用stdout/stderr重定向，PowerShell报告参数集冲突，Creator没有启动。根据该诊断按 runbook 改用管理员助手：Windows PowerShell helper及 `pwsh.exe` helper分别用 `-Verb RunAs -WindowStyle Hidden -Wait` 启动；两者进程创建均返回 `0xc0000142`，helper未运行，Creator无构建日志、新 build 或 Finished 标记。证据：`CREATOR_BUILD_RESULT.json`、`CREATOR_LAUNCH_RECOVERY.json`、`CREATOR_LAUNCH_RECOVERY_PWSH.json`。已停止重试，未改 ACL/系统设置。

HTTP / Codex 内置浏览器：NOT_TESTED。没有 v0.6 新构建产物。不得以旧v0.5输出替代。故障解除后从相同源码/当前资源输入重建，再按390×844和720×1280检查默认顾客1/0.20、六店scale 0.34、恢复数量为1、重进和导出。真机/平台性能未测。

用户另行明确表示“我已帮你验证通过了”，作为本单元示例当前v0.6参数修订的验收来源记录于 `USER_VALIDATION.md`。此确认未提供构建身份、视口、设备、逐项操作或截图，因此它不改变上述Agent Creator/HTTP/IAB状态，也不生成Agent运行证据。
