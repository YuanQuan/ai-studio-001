# Creator 工程与静态校准执行报告｜v0.1

任务：CLIENT-CALIBRATION-DEMO-001｜Owner：Client Agent｜结果：部分完成，静态场景阻塞

## 已完成

1. 找到本机 `C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe`，文件版本为 3.8.8。最初仅发现 Dashboard 的检查结论因此得到修正。
2. 从安装版 Creator 内置 `empty-2d` 模板建立唯一工程 `apps/client/`，用 `README.md` 说明入口；`client/` 仍只有组织说明和版本文件。
3. 导入已批准美术包 v0.2 的 21 张 PNG，全部与源文件 SHA-256 相同、原始尺寸符合清单。Creator 在沙盒外运行时完成 asset-db 导入，为每张 PNG 生成正式 `.meta`；工程 `package.json` 写入 Creator 3.8.8 标记。
4. 工程内没有正式玩法脚本、场景或 Prefab。本任务未添加相机手势、命中、修复状态或顾客移动逻辑。

## 启动与阻塞复现

- 沙盒内用 `Start-Process` 启动 `CocosCreator.exe --project D:\work\ai-studio-template\ai-studio-001\apps\client` 后，进程约 3 秒退出，退出码 `-36861`，未生成资源元数据。
- 获得执行环境放行后以同一参数启动，Creator 进程持续运行，asset-db 日志在 2026-09-30 09:03:38 显示 `asset-db:ready`，21 个图片 `.meta` 自动生成。
- Windows computer-use 工具此前在启动 Creator 的调用中被中断并回报 `aborted by user after 970.0s`。按其技能中断规则，本轮停止通过该工具发 GUI 输入。Creator 以隐藏窗口运行，当前没有可用的编辑器画布操作通道。
- 静态 `DemoScene`、TileMap、地标、摊位两态、相机和路径锚点必须通过 Creator 编辑器创建和保存；仅有导入成功不能代替场景校准。没有手工伪造 `.scene` 或 `.meta`。

## 解除阻塞所需步骤

在允许交互的 Windows 会话中用 Creator 3.8.8 打开 `apps/client/`，创建并保存 `DemoScene`，按已批准拼装说明放置 TileMap、桥、阎罗殿、摊位两态、角色示意与路径锚点。随后记录附录所列的实际数值和四组截图，交 Tech Lead 复核。Tech Lead 与用户审批通过前，正式玩法编码保持关闭。
