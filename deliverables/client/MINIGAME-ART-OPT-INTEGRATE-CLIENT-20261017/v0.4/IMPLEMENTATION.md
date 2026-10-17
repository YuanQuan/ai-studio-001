# Client 实现记录 v0.4

本版修复 v0.3 Creator Web 实测中发现的资源清单回流：奶茶模块合并额外资源时改为从过滤后的 `approvedProduction` 合并，避免已退役 `far_l` 从历史审批表重新进入运行时。恢复三项已批准 LOCK 裁片的物理文件和登记；仅将当前无调用的旧 `far_l`、旧 bridge body 左右图、`CUSTOMER_GHOST` 与 `STATIC_BARE` 排除在生产输入之外。原始工程文件均保留。

v0.4 将完整 83 项身份/历史映射与实际可达生产输入分开记录：生成清单列出 83 项，实际生成的唯一派生 PNG 为 72 张（72 个不同输出路径及 SHA-256，总 PNG 字节数 11,728,804）。Bundle 共五个本地归属：world、tourist、shops、dialogue、milk-tea；dialogue 依赖 world/shops，milk-tea 依赖 tourist。Scene 序列化组件移除了模块资源硬引用并启用 `useOptimizedBundles`。覆盖测试确认生产模块清单的 419 条资源路径全部映射到五个配置根目录；这不是启动菜单实际递归依赖计数，需以 Creator 构建读回和页面运行验证。

Root 已在隔离副本完成 web-mobile、wechatgame、bytedance-mini-game 三个平台构建，三项 CLI 均 exit 36 并有 Creator `Finished` 记录；微信与抖音 `game.json` 各有 8 个分包条目（internal、resources、main 和五个本地模块 Bundle）。实际 Web 检查已覆盖 U00、U03及六店；其余页面、20 次循环、UUID/frame 独立回读与真机表现仍待测。微信全输出物理字节 38,706,193（main 3,256,025），抖音全输出 38,680,539（main 3,230,374）。这些构建文件大小不是上传包/传输大小或平台配额验证，DPR 和真机 GPU/性能未测。

构建日志、平台 config、两份 `game.json`、构建运行结果、输出文件逐项 SHA-256 清单及其文件列表见本版 `evidence/`。只保存这些必要日志和清单，没有复制 Creator 的 library/temp/build-output 整树。两项 profile 文件使用 Master 授权的冻结快照输入；live profile 未改写。原 v0.3 失败证据保持不变。

可重跑 staging：

```sh
node apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.4d \
  /Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.4/OWNER_SOURCE_OVERRIDES.json
node tests/client/asset-integration/asset_integration.test.cjs /private/tmp/minigame-art-opt-integration-staging-v0.4d
```

在单独复制出的隔离工程中构建前，先对该副本运行 `node apps/client/tools/asset-integration/generate_build_configs.cjs <finalRoot>`，因为 `buildPath` 与 `logDest` 均含绝对 final 路径；随后传 `--build 'configPath=<absolute-final-config>;platform=<platform>'`。最终 config 的 SHA-256 独立登记，不混用原 staging config hash，也不属于 `STAGING_INPUT_MANIFEST.sourceFiles`。本 Owner 未在 staging 项目内运行 Creator，以避免导入缓存污染可再生输入。
