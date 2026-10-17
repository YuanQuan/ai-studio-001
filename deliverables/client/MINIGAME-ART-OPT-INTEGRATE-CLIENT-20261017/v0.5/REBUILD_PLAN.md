# v0.5 重建准备记录

当前为准备材料，不是已生成的 v0.5 staging，也不代表 Gallery v0.5 源已冻结。v0.4 记录保持不变。重建触发条件为 Master/Gallery Owner 提供 U04 generation-cancel guard 最终 SHA 与对应源冻结确认；收到前不改 Gallery、不替换该路径 SHA，也不运行 v0.5 staging/Creator。

## 输入冻结

沿用已批准的 `RESOURCE_STAGING_INPUT_FREEZE.json`（SHA-256 `e1a4b752ee1847371247b3c6200079b994e0a9cd94dda58d3dec20992b4ea0bb`）及已授权 Reader Addendum（SHA-256 `44b5b8a52b8f1553de4e591c24d50abcca5d3711655953eb54d60621c33a8a68`）。Profile 仅沿用明确授权的两份恢复快照，授权文件 SHA-256 `83fc7a29266755ac15987053953a7aca15ecacc88e2c2320ba6b49e6ef7bfbe4`。其余冻结输入仍严格校验，不能自动吸纳工作区漂移。

此目录 `OWNER_SOURCE_OVERRIDES.json` 是 v0.4 overrides 的准备副本。当前 Gallery SHA 仍是历史候选值，待 Owner 冻结后再明确更新。生成前必须对所有 overrides 与 711 输入逐项校验；禁止把本文件当前副本当作 U04 修复版依据。

## 精确生成与构建命令

脚本 CLI 的第二个位置参数才是 overrides 文件路径（`node build_staging.cjs <stageRoot> <overridesPath>`）；省略会退回脚本内 v0.1 默认值，不能用于本版本重建。收到新的 Gallery SHA 并完成 v0.5 overrides 后执行：

```sh
node apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.5-u04fix \
  /Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.5/OWNER_SOURCE_OVERRIDES.json
```

Creator 必须在单独复制的隔离项目上构建，不能在 staging 源目录写入 library/temp/build-output。由于生成的 config 内的 `buildPath` 和 `logDest` 是绝对 staging 路径，复制后须先在 final 副本重生三端 config，再运行 Creator；不复用 staging config SHA 冒称 final config SHA。`STAGING_INPUT_MANIFEST.json` 的 `sourceFiles` 是冻结资源/代码输入清单，不收录后生成的 `build-configs/*.json`；最终 build config SHA 作为独立构建选项身份记录：

```sh
cp -a /private/tmp/minigame-art-opt-integration-staging-v0.5-u04fix \
  /private/tmp/minigame-art-opt-integration-final-v0.5-u04fix
node apps/client/tools/asset-integration/generate_build_configs.cjs \
  /private/tmp/minigame-art-opt-integration-final-v0.5-u04fix
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project /private/tmp/minigame-art-opt-integration-final-v0.5-u04fix \
  --build 'configPath=/private/tmp/minigame-art-opt-integration-final-v0.5-u04fix/build-configs/web-mobile.json;platform=web-mobile'
```

WeChat 与 ByteDance 分别使用 `configPath=/private/tmp/minigame-art-opt-integration-final-v0.5-u04fix/build-configs/wechatgame.json;platform=wechatgame` 和 `configPath=/private/tmp/minigame-art-opt-integration-final-v0.5-u04fix/build-configs/bytedance-mini-game.json;platform=bytedance-mini-game`。Root 已完成三端命令：Web 36 + Finished 9秒、微信 36 + Finished 10秒、抖音 36 + Finished 13秒；日志、final configs、真实 game.json 与逐项 SHA 清单见 `evidence/`。构建文件字节不等同上传大小。

## 触发回归范围

v0.5 必须保留 v0.4 包体及 U00/U03 证据，仅对照 U04 重入/正常取消是否仍产生 console error；其余页面、20次生命周期、DPR/真机 GPU 检查维持独立状态，不从 U04 单项通过推断全项通过。
