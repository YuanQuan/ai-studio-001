# v0.6 gesture 修复重建与复核

## 冻结输入与授权范围

本版沿用 711 文件资源冻结 SHA-256 `e1a4b752ee1847371247b3c6200079b994e0a9cd94dda58d3dec20992b4ea0bb`、Reader Addendum SHA-256 `44b5b8a52b8f1553de4e591c24d50abcca5d3711655953eb54d60621c33a8a68` 及已授权 profile 恢复。唯一代码差异为 Master 批准的小屏手势修复：Gallery manifest `0f93418bcea5ec3fb8af87a8dcba6a85dca16ea634e23584c3f70cf578ad1774`、Gallery `UnitSampleGallery.ts` `e403e97715f2f4fd7dfba60482fd39a62fac9a9017c7050b70803dac100214b3`、U01 `sakura_layout_editor.ts` `184f3610ffbd298e10dad79ec83e179f3e859b1a2fd3e9b612046b3180951a46`。问题输入为 `deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/GESTURE_FAILURE_REPORT.md`。不修改共享 ScrollableTextPanel、U05、布局、美术或玩法时序。

Task v0.6 的五条验收逐字同序记录在 `DELIVERABLE.json`。v0.5 三平台构建和20次生命周期结果保留作历史证据；其20次退出后计数归零且无warn/error，但小屏菜单触拖方向反向仍是失败，不能作为本版运行证据。

## 当前 staging 与可复现命令

已生成候选 staging `/private/tmp/minigame-art-opt-integration-staging-v0.6-gesturefix`，`STAGING_INPUT_MANIFEST.json` SHA-256 `201afbc1c2882abc73cdf11b874b6224ebc114ece585c99ec11e35e90e83c26f`，`OWNER_SOURCE_OVERRIDES.json` SHA-256 `990dd592cf8518ed537c59c28e2c06f54a1e7c5796fd39d7319d624017b54fab`。Staging 命令必须显式传第二个 overrides 参数：

```sh
node apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.6-gesturefix \
  /Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.6/OWNER_SOURCE_OVERRIDES.json
node apps/client/tools/asset-integration/generate_build_configs.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.6-gesturefix
node tests/client/asset-integration/asset_integration.test.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.6-gesturefix
```

三命令已在本版执行通过。Root 已将 staging 复制到 `/private/tmp/minigame-art-opt-integration-final-v0.6-gesturefix`，在 final 副本重生 configs 并完成三平台 Creator CLI 构建。最终配置 SHA-256：Web `a1e465f27d852916809c4aba592299c063e1d155f49bef5e31af7c1cb380a2b3`、微信 `55d86f3cf472f4693494a5d80b0bc72b8d707906c7e861f557d50944b9fdd186`、抖音 `11a0b9420e16fbe94c8c1b62cb3094d6bfe7e53d17c5f1dd24920086cfcce949`。三平台均 exit 36 + Finished；对应时间、日志 SHA、实际输出文件清单见 `evidence/BUILD_RUN_RESULTS.json`、`evidence/EVIDENCE_FILE_HASHES.json` 与 `evidence/OUTPUT_FILES_*.json`。没有把整个 build-output、library 或 temp 目录复制到交付物。

```sh
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project /private/tmp/minigame-art-opt-integration-final-v0.6-gesturefix \
  --build 'configPath=/private/tmp/minigame-art-opt-integration-final-v0.6-gesturefix/build-configs/web-mobile.json;platform=web-mobile'
```

微信与抖音构建分别使用同目录 `wechatgame.json` / `bytedance-mini-game.json`，将 `platform` 换成对应名字。final config 哈希须单独登记，不能复用 staging config hash。

Root 已实际验证 320×568 菜单向上拖至底部、向下返回顶部、滚轮到达底部、拖动不误点，并从小屏菜单进入 U05 完成配方提交至订单 2/3；截图 SHA 引用见 `evidence/GESTURE_SMOKE_RESULTS.json`。其他手势面板和完整退出/释放循环仍由 Root 继续验证，暂记 `NOT_TESTED`。无需重跑 v0.5 的20次循环；本版不据已测样本推断90项巡检、完整矩阵、DPR/GPU或设备性能。物理字节仅表示当前构建输出文件总和，不代表压缩上传体积或平台配额。
