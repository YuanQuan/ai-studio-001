# U04 对话客户端实现报告 v0.4

## 实施内容

- Master 对 `U04-CLOUD-CORNER-ASSET-001` v0.1 静态接受后，先把 v0.3 左下、右上角 PNG 复制到 `evidence/v0.3_previous/`，再仅替换两张稳定客户端路径 PNG。
- 新图 SHA-256：左下 `4ef91cb8a1cdd4b81a8a3862d4fd6ad95430a7d91fcc1e0327deb1f1e4dd2174`；右上 `e3e79754e8f7f970c2262310e01487e51db6d99258b16df849f8189f8d23a62d`。客户端 PNG 与 Art 导出逐字节相同。旧图备份 SHA 分别为 `d23f33279807d0e34d951d9e7504d35574aee07a9bf4530378bfd2863415da4b`、`6b0998e92425499ee78c791d5a8f3ba8cab3eacfeb3df6d05425c69bf269216f`。
- 两个 `.meta` 均未修改；image/sprite-frame/texture UUID 保持稳定。Creator 导入数据仍为 128×96 全画布，九宫格四边48和既有角点布局未更改。人物PNG、TypeScript、Scene/Prefab、依赖及其他游戏资源均未由本次替换修改。
- `RESOURCE_IMPORT_MAP.json` 保留129条逐资源记录，仅更新本任务两条角饰来源/哈希、备份、实测 Meta 哈希和构建产物身份。项目登记只更新 U04 两角行。

## Creator 构建与静态资源核验

Creator 3.8.8 官方 CLI 于 2026-10-11 13:19:51 +08:00开始 `web-mobile` 构建，13:19:56 出现 `build Task (web-mobile) Finished in (5 s)ms`，CLI 实际退出码36（该版本成功码）。源码 `UnitSampleGallery.ts` SHA-256 为 `1cebecc0e108c7e76e8253855eecd26df885b56dfe31c2e0415a68ddba47ad09`。当前输出为 `apps/client/build/web-mobile`；`index.html` SHA-256 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`，dialogue bundle config SHA-256 `294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`。两张 native PNG 的 SHA 与 Art 源及客户端 PNG 一致。完整 CLI 捕获与 Creator 任务日志分别保存在 `evidence/CREATOR_BUILD_CLI_CAPTURE.log`、`evidence/CREATOR_BUILD_STDOUT.log`。

默认沙箱下的一次 CLI 启动在 AppKit 注册时异常退出，未产生构建；按正式授权通道使用同一 Creator CLI 后构建通过。成功构建任务日志中有一条子 worker SIGTERM 诊断记录，但同一任务明确记录 Finished，且 CLI 实际退出码36；尝试与结果见 `evidence/BUILD_ATTEMPTS.json`。

## Master 同版 HTTP/IAB 观察

Master 于 2026-10-11 13:27:59 +08:00 在 `http://127.0.0.1:8765/` 检查当前构建；观察记录绑定源码 SHA `1cebecc0e108c7e76e8253855eecd26df885b56dfe31c2e0415a68ddba47ad09`，与本次构建一致。新角饰两角显示、固定形状、与九宫格边缘接合通过；1024×384、768×256、384×192 三档面板均未拉伸，竖屏肖像前景/锚点及姓名和对白左边线通过。90/90 组合检查0失败（6587ms），独立轴切换和连续8次切换结果正确；菜单返回与U04重入通过，控制台 warn/error 为空。完整记录与12张截图及SHA见 `evidence/MASTER_RUNTIME_OBSERVATIONS.json` 和截图文件。

目标设备、原生平台、SDK、GPU性能/驻留内存与长时压力未执行，均为 `NOT_TESTED`。90组合巡检耗时不代表性能数据。单元示例不执行QA；本版仍需Tech同版Review和后续用户审批，不表示Task DONE。

Master于13:29:47 +08:00对HTTP 8765当前实际产物作直连身份核对：index、dialogue config及两张新native PNG均返回200，响应SHA与当前Creator构建输出一致。核对明细在 `evidence/HTTP_RESOURCE_IDENTITY.json`；初次代理urllib返回502后，按任务约定使用localhost直连得到上述有效结果。
