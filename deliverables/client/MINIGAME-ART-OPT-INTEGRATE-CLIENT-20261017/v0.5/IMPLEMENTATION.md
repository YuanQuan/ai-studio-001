# Client 实现记录 v0.5

本版绑定 Master 批准的 Gallery U04 重入/取消修复。实际 v0.4 Web 运行曾在 U04 重入时将旧请求正常取消记为错误，证据为 `deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-integration-v04/CONSOLE_ALL_BEFORE_U04_FIX.json`，SHA-256 `ff62ca907c88fe8cfb10ca997aabd2ee4a7b084f2886d47357625fa450c62b94`。Gallery Owner v0.3 变更只处理重复 refresh 和过期页代次/请求身份的取消与错误日志防护；本 Client v0.5 不再编辑 Gallery，只通过准确 source override 将其接入冻结候选。

v0.5 staging 目录为 `/private/tmp/minigame-art-opt-integration-staging-v0.5-u04fix`，输入 `STAGING_INPUT_MANIFEST.json` SHA-256 为 `6204555aa424f066b43bd4f6da617bf4c0da6f287a9f097927dee5d67a069fc3`，override SHA-256 为 `add9b8418930f2690a9deb02d8099ccc539961aab18319de55fcd40ae24c0700`。它基于 711 项冻结源与已授权 Reader Addendum，明确纳入 Gallery v0.3 manifest（SHA-256 `243d396bf07befbe28e2902acfd0ca465bc7d08afa9e9ac10e1a8ab8898016dd`）及 UnitSampleGallery.ts SHA-256 `00fc815b9edec3b9c1dcd3c6ed00ee1d38fd9243bbe8d0e752604fdc4e1d944b`。不吸收其他工作区漂移。

生成器、覆盖测试和 Creator TypeScript 语义检查已通过。Root 的三平台 Creator 3.8.8 final 构建均以 exit 36 和 `Finished` 结束：Web 9秒、微信 10秒、抖音 13秒。两种小游戏 `game.json` 均有 8 个分包根，包含 internal/resources/main 与五个本地业务 Bundle。微信输出递归文件总计 38,706,903 bytes，其中排除8个分包目录后的主包文件 3,256,025 bytes；抖音总计 38,681,249 bytes，其中主包文件 3,230,374 bytes；Web 输出 38,670,260 bytes。逐文件 SHA 清单、日志、final configs 和 game.json 已归档于 `evidence/`。这些物理输出字节不是上传/传输体积或平台配额验证。

Root 实际 IAB v0.5 完成 20 次跨页进入/退出；20/20 次退出后 `moduleLeases`、`pendingRequests`、`heldDerivedFrames`、`moduleInflight`、`derivedLive` 均为0且 `pageBindingsCleared=true`。70条console事件均为log/info，无warn/error；其中两次U04重入无错误。证据为本目录 `evidence/cycles.json`、`DISPOSAL_RESULTS.json`、`CONSOLE.json` 和 `browser-integration-v05` 的循环截图。另一次 320×568 菜单拖动发现 `UILocation` delta 方向反向（`evidence/menu-reversed-drag.jpg`）；该实际输入问题由 Master 指派 Gallery/U01 修复，v0.5 不能视为完全通过。90项巡检、最终矩阵、DPR/真机GPU与设备性能仍待测。

重建 staging 时必须显式给 `build_staging.cjs` 第二位置参数，否则脚本会回退 v0.1 默认 override：

```sh
node apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.5-u04fix \
  /Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.5/OWNER_SOURCE_OVERRIDES.json
node apps/client/tools/asset-integration/generate_build_configs.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.5-u04fix
node tests/client/asset-integration/asset_integration.test.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.5-u04fix
```

Creator 需运行在隔离 final 副本。复制后须在 final 路径重新运行 `generate_build_configs.cjs <finalRoot>`，因为配置中的 `buildPath` 与 `logDest` 是绝对路径；final config SHA 应独立记录，不能沿用 staging config SHA。详见 `REBUILD_PLAN.md`。
