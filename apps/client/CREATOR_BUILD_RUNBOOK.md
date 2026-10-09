# 本项目 Creator 构建操作记录

## 2026-10-09 U00 重试成功原因

本机 Creator 3.8.8 位于 `C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe`。此前普通 Windows 进程无法打开安装目录 `engine/bin/.cache/dev/editor/import-map.json`，出现 `EPERM`，随后出现 `engine - query-engine-info` 消息错误，构建没有完成。沙箱 `require_escalated` 只解除工具沙箱限制；当时实际 Windows `IsAdministrator` 仍为 `false`。

成功重试通过 PowerShell `Start-Process -Verb RunAs -WindowStyle Hidden` 启动构建助手，助手先确认 Windows 管理员令牌 `admin:true`，再启动 Creator。没有修改安装目录 ACL、没有关闭用户既有 Editor。隔离工程复用当前 assets/settings/profiles，最终源码复制进去后重新构建。

证据目录：`deliverables/client/U00-OVERVIEW-CLIENT-IMPLEMENT-001/v0.4/`。

- `ISOLATED_BUILD_STDERR.log`：普通进程的 EPERM 历史。
- `ADMIN_RETRY_START.json`：首次真正管理员重试，admin:true；此构建仍含早期源码，不能替代最终构建。
- `FINAL_BUILD_START.json`：admin:true，开始于 2026-10-09 22:22:05 +08:00，最终源码 SHA256 `3CE9BF4185EE176053E2A7508B7B286FC62D848236BEEF43407D7651C4889E4C`。
- `FINAL_BUILD_RESULT.json`：22:22:42 +08:00 结束，退出码36；`FINAL_BUILD_STDOUT.log` 有 `build Task (web-mobile) Finished`，本次构建任务日志耗时12秒。
- 两竖屏截图、恢复参数JSON和控制台记录：证明本次 HTTP 实际产物运行，非旧 build。

## 下次执行前必须核对

1. 读取本记录；核当前 Creator 版本、工程路径、用户已有进程及工作区差异。以上安装路径与权限结论仅适用于本机，不作为跨机器默认。
2. 记录实际构建进程的 Windows 管理员令牌，而不是把沙箱提权当作管理员。检查表达式：`([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)`。本机安装缓存权限问题仍存在时，沿用已成功的正规 RunAs 路径，并遵守实际权限审批；令牌为 false 就先停止该路径，不重复等待同一 EPERM。
3. 优先使用已有工程；需要隔离时复制当前 assets/settings/profiles 与必要工程标识，避免复制整个 temp 或借旧快照冒充当前源码。构建前记录实际输入文件 SHA256；源码修正后必须重新复制并重建。
4. 启动 Creator 时使用隐藏窗口，将 stdout/stderr 和开始/结束、PID、退出码保存为当次独立文件。保留进程句柄再等待退出，以可靠读取退出码。不要停止用户已有 Editor，只管理自己启动的进程。
5. 本版本本次成功退出码为36，不能只按“非0即失败”判断，也不能只靠退出码判成功；共同核 Finished 标记、无致命错误、新输出及源码身份。其他版本应重新核对应 CLI 约定。
6. 类型检查只涵盖正式 assets 与当前 Creator 声明；排除 temp/build/library 中历史恢复工程和平台模板。记录命令与退出码，不把临时模板错误误诊为正式源码问题，也不把 transpile 语法检查称作完整类型检查。
7. 仅监听 loopback，通过 HTTP 打开本次真实 Web 输出；检查菜单、目标功能、恢复、导出、重进和控制台。390×844 与720×1280分别加载；改变视口后重新加载，让 Cocos 重新布局。Web 检查不替代真机/小游戏平台验证。

若仍失败，先按日志重新诊断权限、引擎初始化或源码问题；不要盲目再次超时重试，不修改安装目录安全设置，不用旧输出判通过。所有新结果绑定新的源码SHA和证据文件。
