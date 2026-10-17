# Client 实现记录 v0.6

本版只接入 Master 已批准的 Gallery 与 U01 小屏手势方向/回调修正。源变更为 Gallery SHA-256 `e403e97715f2f4fd7dfba60482fd39a62fac9a9017c7050b70803dac100214b3`、U01 `sakura_layout_editor.ts` SHA-256 `184f3610ffbd298e10dad79ec83e179f3e859b1a2fd3e9b612046b3180951a46`，Gallery source manifest SHA-256 `0f93418bcea5ec3fb8af87a8dcba6a85dca16ea634e23584c3f70cf578ad1774`。布局、美术、玩法时序、ScrollableTextPanel 与 U05 均未改。

Staging `/private/tmp/minigame-art-opt-integration-staging-v0.6-gesturefix` 的输入 manifest SHA-256 `201afbc1c2882abc73cdf11b874b6224ebc114ece585c99ec11e35e90e83c26f`；83资源身份、72张派生图、419生产路径覆盖5个Bundle根，asset integration test通过。Root在 final `/private/tmp/minigame-art-opt-integration-final-v0.6-gesturefix` 完成Web、WeChat和ByteDance三平台 Creator 3.8.8 CLI 构建，均exit 36并有 Finished：Web 11秒、微信9秒、抖音9秒。准确final config hash和日志SHA记录在 evidence/BUILD_RUN_RESULTS.json。

真实输出目录逐文件SHA清单归档于 evidence/OUTPUT_FILES_*.json。物理输出：Web 803文件/38670624字节；微信 823文件/38707267字节，主包（排除8个子包目录）3256025字节；抖音 821文件/38681613字节，主包 3230374字节。两小游戏实际game.json均列8个子包根。文件物理字节不等同上传、压缩传输或平台账户限额口径。

Root实际320×568验证菜单向上拖至底部、向下拖回顶部、滚轮到达底部且拖动未误点；从该菜单进入U05后配方正确提交至订单2/3。截图及逐张SHA引用在 evidence/GESTURE_SMOKE_RESULTS.json。其它手势面板、完整页面退出/释放循环及整体视觉矩阵仍待Root继续验证。v0.5 20次生命周期计数归零且无warn/error仅作历史事实，不是v0.6新循环证据。
