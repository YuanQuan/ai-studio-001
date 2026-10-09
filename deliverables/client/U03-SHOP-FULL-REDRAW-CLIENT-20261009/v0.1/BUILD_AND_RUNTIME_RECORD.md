# U03 六店替换构建与运行记录 v0.1

## 构建身份

- Creator：3.8.8，安装路径 `C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe`。
- 当前快照：`apps/client/temp/u03-shop-full-redraw-client-v01/`，从本轮工作区复制 `assets/settings/profiles/package.json/tsconfig.json/.creator`；不复制活动 `library/temp/build/local`。快照在本轮 12 张资源替换完成后创建，构建前核了店铺 PNG 哈希与工作区一致。
- 构建配置：`evidence/creator-build-config.json`；场景 `UnitSamples.scene`，平台 `web-mobile`，输出 `apps/client/build/u03-shop-full-redraw-client-v01-web-mobile/`。
- Creator 以隐藏 RunAs helper 启动；`evidence/creator-admin-launch.json` 记录 `admin=true`，PID `32428`。构建结果 exit code `36`，结束于 2026-10-09 22:36:36 +08:00；`evidence/creator-build.log` 有 `build Task (U03-SHOP-FULL-REDRAW-CLIENT-20261009-v0.1) Finished in (18 s)ms`。
- 首次普通启动尝试 exit `-1`，stdout/stderr 空且无构建产物；按已有本机 Runbook 执行一次管理员恢复后成功。第一次启动结果、RunAs 脚本、标准输出/错误及主构建日志均留在 `evidence/`。没有改 ACL 或停止其他 Creator 进程。
- 构建输出 149 个文件，共 27,155,048 bytes；日志 SHA-256 `7DFA0F3FED6F8886E6FA797C17FC499EA16B54D31610E34435FCD3F69186BCE7`。逐文件构建 SHA 与 12 张正式店图对照见 `evidence/BUILD_OUTPUT_MANIFEST.json`。
- 12 张图在 Creator 快照 Library 的导入 PNG 与 Web Mobile `assets/main/native/` 中都与目标图逐字节一致，所有 `.meta` 显示 `imported=true`。六 Prefab 两张 SpriteFrame 引用与 Scene Prefab UUID 静态核验通过。

## HTTP 与内置浏览器运行

- 实际构建通过只监听 `127.0.0.1` 的静态服务提供：`http://127.0.0.1:8789/`，PID `15668`，入口 HTTP 200；`index.html` SHA-256 `012EEC93E5A90F4CCEFEDE6C3E85F6CA56E22223AF46A3C51D8B7C7B55646F4E`。Master完成浏览器检查后，已停止本任务启动的Node服务；停止时再次确认 PID 与启动记录一致，8789 不再监听。
- 服务证据：`evidence/http-server-record.json`、`evidence/http-server.stdout.log`、`evidence/http-server.stderr.log`。
- Master 通过 Codex 内置浏览器检查该 HTTP 构建。390×844 与 720×1280 均逐家查看 U03 的 01–06 新图，店体与牌匾对应；390 上一店 06→05、返回菜单再进入恢复 01；720 下一店 06→01 循环。两视窗 U00 都显示更新后的 01/02 店铺图；720 下店铺隐藏后恢复正常。页面操作后观察得到的 console warn/error 均为 0，原始记录为 `evidence/runtime_console.json`。
- 18 张当次运行截图、每图 SHA-256、字节数、格式与视窗映射见 `evidence/RUNTIME_EVIDENCE_MANIFEST.json`。截图内容为 JPEG/JFIF，文件扩展名已更正为 `.jpg`。Master 检查后已恢复浏览器视口并关闭验证标签。
- 真实触摸、目标设备、小游戏 SDK 与性能采样未执行，均为 `NOT_TESTED`。本轮为 Client Owner 实施核验，不分派单元示例 QA；不把 Web 冒烟作为正式 QA 或用户对 Client 实施 Artifact 的批准。
