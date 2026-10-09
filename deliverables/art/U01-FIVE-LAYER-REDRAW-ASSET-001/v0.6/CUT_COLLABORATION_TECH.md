# U01 v0.6 切图前技术协作

用户已选 3072×1024 同源五层候选。五张正式 PNG 应从同一已核五层栅格母版导出，均为 3072×1024、原位 RGBA、中心锚点，Cocos SpriteFrame 的 `trim` 设为 `none`，偏移为 0；不要为透明边改变节点画幅。顺序：`L01_Sky`、`L02_Mountains`、`L03_Ground`、`L04_WaterBridge`、`L05_WaterGrass`，候选视差 `[0.3, 0.8, 1, 1, 1]`。L03 后岸街、L04 前景水/桥、L05 水前草，L04 草后水面必须完整。无连续镜头遮挡证明，本批不作遮挡优化裁减。

五张 3072×1024 RGBA8 完全展开为 `3072×1024×4×5=62,914,560` 字节，即 **60 MiB**；这是未压缩基础估算，不是实际设备驻留内存或性能结论。当前客户端仍在 `apps/client/assets/labs/menu/scene1_camera_controller.ts` 硬编码 2172×724、四项视差和四层长度检查；`apps/client/assets/UnitSampleGallery.ts` 也只查四节点。具体切片经用户审核批准后，Client 需改 3072×1024/五层/第五视差，更新 Prefab 五节点、导入后的真实贴图和 SpriteFrame UUID、资源登记，并通过 Creator 导入、构建及实际多视窗拖缩核验。此记录仅供交接，不代表 Client 已接入或切片获批。

当前 Mac 只读工具核验：项目 `apps/client/package.json` 锁定 Creator `3.8.8`；本机实际存在 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app`，其 Info.plist 报 `CFBundleExecutable=CocosCreator`、版本 `3.8.8`，可执行文件在 `Contents/MacOS/CocosCreator`。旧 `project/DECISIONS.md` 的 `C:\...\CocosCreator.exe` 是历史 Windows 路径，本机不可用。仓库 `apps/client/settings/v2/packages/builder.json` 只有配置版本标识，当前未见现成 Web-Mobile 构建配置或 `build/web-mobile` 产物；此前 U02 的 `--project ... --build configPath=...` 记录为 Windows 命令范例。Client 在 Gate2 后应先核本机 3.8.8 CLI 接受的构建参数并准备本机配置，再执行导入/构建并保存当前日志与新产物 hash；不能沿用旧构建或仅凭安装判运行通过。本次只读调查没有启动 Creator、导入或构建。
