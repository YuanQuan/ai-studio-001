# 2026-10-12 22:50 隔离构建启动失败记录

第一次在默认沙箱权限下以 Creator 3.8.8 CLI 启动同一隔离工程，进程于构建开始前退出 134，stdout/stderr 日志为空。macOS 诊断记录 `~/Library/Logs/DiagnosticReports/CocosCreator-2026-10-12-225056.ips` 显示 `EXC_CRASH/SIGABRT`，触发帧为 `___RegisterApplication_block_invoke` / `NSApplication init`，不是工程编译错误。后以获批的正式进程权限重试同一 Creator CLI 命令，构建成功，结束标记见 `../CREATOR_BUILD_FINAL.log`。
