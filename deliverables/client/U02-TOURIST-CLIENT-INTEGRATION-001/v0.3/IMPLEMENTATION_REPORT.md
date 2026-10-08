# U02 Client v0.3 实施记录

日期：2026-10-08（+08:00）  
Owner：Client  
输入：U02-VFX-A/v0.2 Gate2 `USER_APPROVED`，批准重组图 SHA-256 `4a76eaeb64270be2914c41e0ca648a38e2dd4542696d3ead4d363edce76c027a`

## 实施范围

- 将运行时资源换为 walk/run/happy/sad 各 10 帧，共 40 张；客户端 PNG 与 VFX v0.2 原始文件 SHA-256 一致，合计 5,793,640 bytes。
- Adapter 读取 40 帧逐帧 manifest 与 mounts，核验帧 ID、哈希、动作数量、时长和播放模式；walk/run 使用相同姿态，run 时长为 walk 的一半；四动作均 loop。
- View 按逐帧 foot 与 head/face/wristNear/wristFar 挂点布置身体与独立配件；保留帽、眼镜、手环的独立切片及遮挡层。矩阵分解使用 Creator 3.8.8 内置 `UISkew`，已在 `engine.json` 启用该模块。
- Scene 的 `touristBodyFrames` 更新为 40 个 SpriteFrame 引用。U02 Prefab UUID `e94ff176-13d1-4691-b958-61765f95cd89`、U01 UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`、6 个 U03 店铺引用与 4 个配件引用保留。Scene 仅有 `touristBodyFrames` 序列化字段变化。
- 资源 Map 与 `project/ASSET_HANDOFF_REGISTRY.md` 加入新批次路径、哈希和 SpriteFrame UUID。旧 20 帧及 Scene/Map 基线保存在 `evidence/old-client-frame-backup/`。

## 静态验证结果

`evidence/audit-v0.3-static.mjs` 复算通过：40 帧、40 个挂点记录、160 个 affine 矩阵，最大绝对重建误差 `4.440892098500626e-16`；脚点均为 `(256,440)`，全部 loop，run/walk 速度比为 2；40 个主体 SpriteFrame UUID 唯一且与 Scene 顺序一致；4 个配件切片、6 个 U03 店铺引用完整。Scene 与 v0.3 开工前快照在游客帧数组以外完全相同。

Scene 链接脚本 `check-scene-links.mjs` 返回 `STATIC_PASS`，19 个对象 / 26 个对象引用，无结构或必需 UUID 错误。Creator 自带 TypeScript 3.8 编译器对 integration check 配置以 `--target es2019` 执行，退出码 0。未加该 target 时会出现 Gallery 的 `String.padStart` ES2017 lib 诊断；初次R1静态审计时Gallery尚未修改。R2只删除4行caption相关字段/布局引用，随后重新通过该TypeScript检查。

历史静态风险：happy03 独立帽子顶部超出主体画布约4.81px；静态未见TouristStage裁切Mask，附件为独立Sprite。该风险已在R2移除辅助caption后由Art/UI复核批准，详见R2运行记录；精确happy03帧单独截图未捕获。

## Creator 导入与构建

首次 CLI 尝试因 Windows 管理员令牌未激活，在 Creator 3.8.8 安装引擎缓存处遇到 EPERM；历史权限诊断保留在 `evidence/creator-environment-diagnostic.json`，安装目录 ACL 未改动。用户随后明确批准管理员 UAC 运行，Creator 3.8.8 AssetDB 成功导入，Web-Mobile Build Task 于 2026-10-08 23:50:38 记录 `Finished in 120553ms`。

`evidence/creator-import-library-audit.json` 对 40 个主体帧与 4 个附件逐项回读：image/Texture2D/SpriteFrame UUID 与登记一致，Library PNG SHA-256 与客户端源字节一致，SpriteFrame rect/originalSize 为完整原画布且 offset 为零。输出 `apps/client/build/u02-integration-v03-web-mobile` 有 147 文件、20,421,577 bytes；Creator stdout 记录 Build Assets success、Asset DB resumed、Build Task Finished。父进程 ExitCode 记录为 null，构建日志没有 fatal errors；唯一 Rollup warning 为 DragonBones 的 `THIS_IS_UNDEFINED`。每个输出文件和构建设置的 SHA-256 已列于 `evidence/retry-20261008/BUILD_MANIFEST.json`。

该段仅描述R1构建历史。R1运行画面不替代独立R2最终验收；R2运行证据见后续R2收敛记录与WEB_RUNTIME_RECORD.md。

## R2 UI 修正（2026-10-09）

- Art/UI 对 v0.3 R1 的 happy03 实图评审发现帽顶与舞台内的“游客展示区”辅助 caption 重叠，要求最小改动：只删除该舞台 caption，保留页面标题、导航/重置、动作/装扮/状态控件、游客与逐帧配件表现。
- [UnitSampleGallery.ts](../../../../apps/client/assets/UnitSampleGallery.ts) 本轮仅删除 caption 字段、清理赋值和布局位置，共4行；改前源 SHA-256 `dcdf3f43e3b450d5fef1df7c794ae78453f64ea740bc07ee184505229a6ac33e`，R2 源 SHA-256 `1266d7c9715af95f49a71b13a7f742175e6207b71fdd8fcb76249c86332ecef5`。改前源副本与修正边界见 `evidence/retry-20261009-r2/`。
- 静态源/绑定审计仍 `PASS`；Creator TypeScript `--noEmit --strict false --target es2019` 退出码0；Scene 链接 `STATIC_PASS`（19对象/26引用）。Scene 未被本次修正修改。
- Master 在已授权的管理员会话启动 R2；Creator 3.8.8 Web-Mobile Task `U02-TOURIST-CLIENT-INTEGRATION-001-v0.3-R2` 于 2026-10-09 00:20:50 完成。独立输出 `apps/client/build/u02-integration-v03-r2-web-mobile` 为147文件、20,421,377 bytes；完整清单见 `evidence/retry-20261009-r2/BUILD_MANIFEST.json`。Creator父进程ExitCode为null，但构建日志记录 Build Assets success、Asset DB resume、Task Finished；无 Rollup warning 或 fatal error，build-script子进程记录 SIGTERM 并留痕。
- R2 AssetDB/Library只读回读44/44通过，报告见 `evidence/retry-20261009-r2/creator-import-library-audit.json`。R1原 build manifest 中的147文件再次逐项比对仍为0 mismatch；R2只读 audit 页作为两个独立sidecar添加，hash和不计入 Creator build 的证据见 `evidence/retry-20261009-r2/RUNTIME_HARNESS_MANIFEST.json`。R2 HTTP `http://127.0.0.1:8775/` 和 `/audit.html` 均200。
- R2编译输出已确认不含舞台caption。其后Master在390×667与390×844 IAB视口完成运行检查，Art/Tech/UI同版复核批准。精确happy03帧专门截图未独立采集，作为证据局限保留；当前不再据旧R1视觉问题阻塞R2。


## Creator 导入与构建补充证据

用户授权管理员 UAC 会话后，Creator 3.8.8 AssetDB 成功导入。

- `evidence/audit-creator-import.mjs` 检查 40 个主体帧和 4 个附件：meta 导入标记、image/Texture2D/SpriteFrame UUID、Library PNG 哈希、SpriteFrame 全画布 rect/originalSize、零偏移均通过；Library 源 PNG 与客户端资源 SHA-256 一致。
- `web-mobile` Build Task `(U02-TOURIST-CLIENT-INTEGRATION-001-v0.3)` 日志记录 Finished，耗时 120553ms；输出 147 文件，总计 20,421,577 bytes。身份与每文件 SHA-256 见 `evidence/retry-20261008/BUILD_MANIFEST.json`。Creator 父进程记录的 ExitCode 为 null，但其 stdout 明确记录 Build Assets success、Asset DB resume 和 Finished；未见 fatal error。
- R1 HTTP/运行结果为历史证据，最终实现基于独立R2输出，详情见下方R2收敛记录。


## R2 同版运行收敛（2026-10-09）

- 最终运行版本为 U02-TOURIST-CLIENT-INTEGRATION-001-v0.3-R2，HTTP http://127.0.0.1:8775/；Creator 3.8.8 Web-Mobile构建147文件、20,421,377 bytes，R1文件哈希历史保全。身份与逐文件哈希见 evidence/retry-20261009-r2/BUILD_MANIFEST.json。
- 只读harness在390×844观测并渲染40/40动作帧，160/160挂点矩阵有效（invalidRows=0、最大重建误差4.44e-16）；390×667下40/40组合通过。循环回绕walk/run/happy/sad计数38/8/12/4。4动作、附件独立穿脱、朝向、重置、返回由Master在IAB人工点击核实。
- R2双视口happy循环、sad镜像与walk/run全装扮画面留存在 evidence/retry-20261009-r2/；U01缩放/拖动/reset与U03六店回归证据见U01_REGRESSION_RECORD.md。Art、Tech Lead、UI对同版实现/修订批准；QA仅批准实现准备/证据范围，正式QA最终报告仍待。
- 短期浏览器性能样本见WEB_RUNTIME_RECORD.md，不等于正式60秒×3性能PASS。真实触屏与目标设备未测。R2时间窗Console无error/warn；原采集文件中的一条MutationObserver异常发生在R2启动前，筛选说明见 evidence/retry-20261009-r2/browser-console-r2-window.json。
