# U03 六店客户端接入执行记录 v0.1

## 输入与实现

- 用户已批准六店 Gate2 v0.4；接入前核 `SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json` SHA-256 为 `C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191`，逐张核 12 张 PNG 源哈希后复制。没有改动图片字节。
- 每店一个强引用 Prefab，顶层名称依次为 `MT_SHOP_01`、`SHOP_02` 至 `SHOP_06`。每个 Prefab 包含同店 `body`、`sign` Sprite 及 `ground_contact` 脚点；SpriteFrame UUID 来自对应 `.meta`，Scene 的 `shopPrefabs` 顺序与六店顺序一致。
- `UnitSampleGallery.ts` 新增 U03 菜单入口。进入默认请求 01，上一店/下一店循环；`presentedIndex`、`desiredIndex`、`failedTarget` 和 `shopGeneration` 控制连按、旧请求失效、失败重试及返回重入。提交时旧完整店与新完整店、身份字同帧替换。结构核验检查顶层 ID、三个子节点及两张 SpriteFrame。
- U03 菜单入口在显示前预检六个 Prefab 的顶层 ID、body/sign SpriteFrame 和脚点；不完整时显示“资源未就绪”且不提供激活入口。首次加载使用中性面板，失败时保持中性错误与返回/重试；已有店失败时状态字明确写“仍显示 XX”。上一店/下一店在首店未呈现时保持灰态，按钮按下有即时填色反馈。
- 日志分别记录 `requestAt/readyAt/validatedAt/commitAt`，并在 `Director.EVENT_AFTER_DRAW` 且店仍是当前代次时记录 `presentedFrameAt`。构建实际运行前不将此日志设计视为性能实测。

## 本轮验证

| 项目 | 结果 |
|---|---|
| Gate2 清单及 12 张复制后 PNG SHA-256 | PASS |
| 六个 Prefab JSON 对象引用索引、两片 UUID 与 Scene 强引用 UUID | PASS（静态脚本） |
| Gallery TypeScript 转译语法 | PASS（Creator 安装包 TypeScript `transpileModule`） |
| `git diff --check` | PASS |
| Creator 3.8.8 实际导入 | PASS，六个 Prefab 与 12 张 PNG 在 AssetDB 中 `imported: true`、UUID/依赖可查 |
| 当前 Web 构建、HTTP、内置浏览器 | PASS，R3 builder task `1791356044228` success；107 个输出文件哈希见 R3 清单；两候选竖屏限定鼠标/视觉冒烟见运行记录 |
| 性能、真实触摸、目标设备 | NOT_TESTED |
| 微信/目标设备 | NOT_TESTED |

本版 Client、Tech、UI、QA、Master 五份同版 Review 均为 `APPROVED`。Creator 导入、R3 构建与限定 Web 视觉/鼠标冒烟已完成；真实性能、触屏和目标平台仍需按 QA 计划实测。五份专业 Review 不替代本实现版本的用户审批或后续正式 QA TEST_REPORT；当前任务尚非 `DONE`。

## R1 Editor 构建与入口修复

Master 使用当前 Creator Editor 构建任务 `1791355037008` 获构建成功，但 390×844 实际页面显示 U03 入口“资源未就绪”，故 R1 的 U03 运行验收失败。检查六个 Prefab 发现 Creator 将序列化根节点 `_name` 和 `.meta.userData.syncNodeName` 自动同步为资产文件名 `pf_mt_shop_01`、`pf_shop_02` 至 `pf_shop_06`，而入口预检曾要求根节点名称为 `MT_SHOP_01`、`SHOP_02` 至 `SHOP_06`。直接修改根 `_name` 并分别尝试同名 `syncNodeName` 和 `false`，两次经 Editor `refresh_assets` 后都被重写为文件名；AssetDB 检查仍保留原 Prefab UUID 与 body/sign 依赖。

R2 源码修订让入口按六个固定 Prefab 文件名预检；实例化后、结构检查与原子提交前将**运行实例**顶层名称设为稳定店 ID。六个 Prefab 资产名、UUID、两张切片、脚点和 Scene 强引用均未改变。六份序列化 Prefab 名称/UUID/子节点、TypeScript 转译语法和 `git diff --check` 静态通过。随后 R2 Editor 构建和运行发现下节记录的空白画面问题；R1 构建成功未被当作 R2 的运行通过证据。

## R2 空白画面与 R3 修复

Master 的 R2 Editor 构建任务 `1791355626625` 成功，HTTP 200；390×844 内置浏览器中 U03 入口可用，01→02 的身份和 `request/commit/presented frame` 日志均变化，但单店展示区始终空白，故 R2 视觉/功能失败。两张 PNG 网络请求 200，Prefab body/sign Sprite 均在 UI_2D 层且有 1024×1024 变换，图片本身有非透明像素。

查 Creator 3.8.8 引擎 `cocos/scene-graph/node.ts` 的 `Node.setScale` 实现，只有 `setScale(Vec3)` 或 `setScale(x, y, z?)`；传单个 number 时被作为 Vec3 读取 `x/y/z`，产生无效缩放。U03 在首次提交与布局重排两处均曾传单个 number。R3 已改为 `setScale(scale, scale, 1)`。同文件其他菜单卡片使用双数字参数，未受此缺陷影响。R3 TypeScript 语法与 `git diff --check` 通过；实际构建、店图可见性和六店切换已按下节当前构建证据复核。

## R3 当前实现证据

Creator 3.8.8 Editor builder task `1791356044228` 于 2026-10-07 14:54:04–14:54:24 +08:00 执行并成功，独立输出 `apps/client/build/u03-shop-client-r3-web-mobile` 共 107 个文件；日志 SHA-256 `265D4EA7DA4926D22C6111A9B325492336F6223A88CA9220553060C4E146C607`，逐文件与源码 SHA 见 `evidence/R3_BUILD_MANIFEST.json`。本地 HTTP `127.0.0.1:8776` 返回 200。

Codex 内置浏览器 390×844：U03 默认 01 奶茶店，下一店 02→03→04→05→06→01，各步可见同一店的店体、牌匾和身份，一次只显示一间；返回重进复位 01。720×1280：01 和 04 实图可见，快速三次下一店从 04 到 01，目标与实图一致。两视口 console warn/error 均未见。U01 四层场景可见、放大/重置响应；U02 游客可见、walk 与帽子穿卸响应。详细范围和未测项见 `WEB_RUNTIME_RECORD.md` 与 `U01_U02_REGRESSION_RECORD.md`。这些均为有限冒烟，不等于完整 QA、真实触控或性能阈值通过。

R3 截图与控制台现已落盘：`evidence/r3_iab/` 含 16 张两尺寸截图及 `console_logs.json`，逐件字节数、真实 JPEG 格式、像素尺寸和 SHA-256 见 `evidence/R3_IAB_EVIDENCE_MANIFEST.json`。日志混含 R1/R2，按 R3 服务端口 `8776` 筛得 102 条（log 3、info 99、warn/error 0），其中 `request/commit/presented frame` 各 33 条；计数不是性能测量或所有状态覆盖证明。

## Creator 独立副本尝试

共享工程检测到 14 个现有 `CocosCreator` 进程，无法只读确认所有进程的项目归属，故未对共享 AssetDB 并发构建。建立 `apps/client/temp/u03-client-isolated-20261007/`，只复制 `assets/settings/profiles/extensions/package.json/tsconfig.json`（137 个 assets 文件），不带 `.git/build/library/temp` 缓存；副本的 Gallery、Scene、U03 定义文件与源文件 SHA-256 相同，记录于副本 `source-hashes.json`。Web 配置复用已完成的 U02 R5 `web-mobile` 参数，改 Task、`buildPath`、`outputName`、`logDest`，存于副本 `u03-build-config.json`。

调用安装的 `C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe`，参数为 `--project <独立副本> --build "configPath=<副本配置>;logDest=<副本日志>" --user-data-dir=<副本 user-data>`。默认环境和正式 `require_escalated` 环境各尝试一次，均立即返回 `$LASTEXITCODE=-1`，`cli-output.txt`/`cli-output-escalated.txt` 为空，未产生本轮构建日志、AssetDB 输出或 Web 产物。进程数仍为 14，没有终止或修改既有 Creator 进程。按工作流停止重复尝试；不能以旧 U02 Web 包代替 U03 验证。
