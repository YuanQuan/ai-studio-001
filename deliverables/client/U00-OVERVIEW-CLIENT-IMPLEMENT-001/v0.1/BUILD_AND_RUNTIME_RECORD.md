# U00 构建与运行记录 v0.1

| 阶段 | Owner | 结果 | 当前证据 |
|---|---|---|---|
| 首轮 Creator 3.8.8 Web-Mobile CLI 构建 | Tech Lead | PASS（已被下方修订取代） | 2026-10-09 14:37–14:38 +08:00，隔离副本 `/private/tmp/u00-isolated-whfZRn`，退出码36；149文件、25,895,468字节。原始证据仍保留在 `evidence/BUILD_MANIFEST.json` 与 `evidence/CREATOR_BUILD_LOG.txt`，但源码身份已过期，不用于验收修正版。 |
| 修正版 Creator 3.8.8 Web-Mobile CLI 构建 R2 | Tech Lead | PASS（已由R3取代） | Gallery SHA `0198bf710af3e3d693d9af292e152f95c2027ece912b39428d2b1a8859d57ea2`、Camera SHA `1bf7a59c3accecd2ce4efa85813a6d4c27033e7af15c699225e0f06648625f81`；14:46:24 +08:00 退出码36，149文件、25,896,603字节；见 `evidence/BUILD_R2_MANIFEST.json`、`evidence/CREATOR_BUILD_R2_LOG.txt`。R2主体运行通过，菜单首卡与标题重叠促成R3修复。 |
| 当前 Creator 3.8.8 Web-Mobile CLI 构建 R3 | Tech Lead | PASS（当前版） | Gallery SHA `17dbbcff503796dd2031baf8bc97da14987e320c17a7414307470cdee96c2ee4`、Camera SHA `1bf7a59c3accecd2ce4efa85813a6d4c27033e7af15c699225e0f06648625f81`；同一隔离副本 `/private/tmp/u00-isolated-whfZRn`，14:55:19 +08:00，参数 `--project /private/tmp/u00-isolated-whfZRn --build 'platform=web-mobile;debug=true'`，退出码36，日志 `Build Assets success` / `build Task (web-mobile) Finished`。149文件、25,896,603字节；见 `evidence/BUILD_R3_MANIFEST.json`、`evidence/CREATOR_BUILD_R3_LOG.txt`。R2→R3源码仅菜单布局两处105→155。 |
| HTTP 实际构建入口 | Master | PASS | HTTP 200；index.html SHA 与R3清单一致，证据 `evidence/RUNTIME_R3_MANIFEST.json`；服务由Master启动，session4953，根目录为上述R3实际构建。 |
| Codex 内置浏览器画面与交互 | Master | PASS | 390×844、720×1280；真实点击/拖动执行进入、三个独立开关、数量0→1和3→8/上限、隐藏后增减保持隐藏、缩放拖动重置、返回重进。六店顺序/落脚与顾客在栏杆后方可见。原U01/U02/U03入口加载及U01重置通过。证据 `evidence/iab/r3-*` 和R3运行清单；console error/warn为[]。 |
| Creator AssetDB/Library 资产导入核验 | Tech Lead | PASS（构建导入）/ NOT_TESTED（逐 UUID 回读） | 独立工程无 `library/temp/build` 缓存复制；本轮 Creator 完成 AssetDB 导入、`Build Assets success` 与 `Asset DB is resume!`，输出 149 文件。现有资源及 `.meta` 的 196/196（排除两份授权TS）原始字节核查见 `RESOURCE_INTEGRITY_CHECK.json`；本轮未逐项回读 Library 中的 SpriteFrame UUID/像素。 |
| 真机触控与性能 | 未执行 | NOT_TESTED | 需设备测试才能得出结论；不由桌面 Web 证据替代 |

## 构建边界

R1、R2源码及构建证据仅作历史，不当作R3验收。R3隔离副本与工作区构建前后两份源码 SHA 一致，R3日志 SHA-256 为 `2f161e1a7df87179607560a1c900f7b53921d8b6c7191e0aa5fda888dce32eac`。R3实际运行及截图于 2026-10-09 14:59–15:05 +08:00 完成，当前验收仅绑定R3。

## Master 实际 Web 检查

R3 两视口的控件均可真实点击。顾客分布在桥两侧街道，8人是整个场景总数，当前视窗可能只看到其中部分。左右拖动观察奶茶、糖画、炭烤、桥、理发、花灯、投壶；店铺整体与地面同步，桥面保持空出。初始和重置聚焦左街，返回后再进入恢复3人及三个显示状态。

截图可观察到走动、开心与沮丧姿态以及栏杆对顾客的遮挡。原地情绪期间位移为0的精确保证来自源码分支评审；随机动作运行截图不作为逐帧位移测量或全部随机分支统计覆盖。菜单原有开发态统计面板会覆盖第四卡部分文字，但实际U00入口可点且进入后面板消失；退出恢复原先统计状态。R3修复后的菜单标题完整可见。

本轮为单元示例Owner检查，不作正式QA结论。未执行真机触控、性能基准或逐UUID Library回读；不影响当前桌面Web示例审核范围。预览服务保留供用户本机审核，隔离构建目录为临时路径，仓库内留存构建清单、日志和截图，未加入生成构建文件。
