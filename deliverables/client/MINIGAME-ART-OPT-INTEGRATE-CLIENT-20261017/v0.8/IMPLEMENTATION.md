# Resource v0.8 可移植发布输入生成

v0.8 为现有 staging 生成器增加可复现的可移植输入路径。生成器排除所有 `.DS_Store` 元数据和 `apps/client/profiles/**`（本地 Editor 偏好设置）；当相应冻结源文件与 HEAD 字节不同时，只使用 Master 授权清单中由 SHA 固定的四份快照。其余冻结路径与已授权 Owner overrides 仍严格校验。本版没有修改任何 runtime、玩法、UI、图片或 Scene 源码。

输出候选位于 `/private/tmp/minigame-art-opt-integration-staging-v0.8-portable`；其 `STAGING_INPUT_MANIFEST.json` 的 SHA-256 为 `77ab51753aa906f2dbc78cfe9b9af18cbcc94aedb3de7ee7ad121ad252d6a7d0`。

在项目根目录运行以下命令，可重新生成 staging 并执行 clean-like 比较：

```sh
node apps/client/tools/asset-integration/build_staging.cjs /private/tmp/minigame-art-opt-integration-staging-v0.8-portable deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json
node apps/client/tools/asset-integration/portable_input_recovery.test.cjs deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json /private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix /private/tmp/minigame-art-opt-integration-staging-v0.8-portable
```

clean-like 测试使用普通临时目录，不是 Git checkout。测试只对四个已授权文件使用 `git show HEAD:<path>` 字节，排除22个指定路径，并在篡改一项无关冻结输入后验证生成器严格拒绝。测试比较 assets/settings/package payload：共667个文件、36,266,325字节，inventory SHA-256 为 `ea20600a5423fa653850746b749dde4d1ba42aa0b564bcca235f06b13b19d172`；v0.7 baseline、clean-like 输出与 v0.8 输出完全一致。详见 `evidence/PORTABLE_INPUT_RECOVERY_TEST.json`。

## Creator 构建与有限范围的运行证据继承

Root 已使用 v0.8 final 副本构建 Web Mobile、WeChat Game 和 ByteDance Mini Game；每次 Creator 调用均以 exit code 36 结束并记录 `Finished`。Root 与 Tech 对完整输出文件清单进行比较：每个平台与 v0.7 相比都只有一个原始哈希不同的文件，即生成的 main 脚本。脚本字节长度不变；Tech 仅规范化生成的 `_RF.push` UUID，以及 `client_asset_modules` factory 内按作用域解析的根变量别名后，证明完整脚本相等。其他所有输出文件（包括原生 `game.json`）均逐字节相同。因此可在 Tech 审核确认的有限范围内关联 v0.7 运行证据；v0.8 本身没有重复执行完整20轮 IAB 测试。准确 config/log/evidence 哈希见 `evidence/CREATOR_PORTABLE_BUILD_AND_EQUIVALENCE.json`。

导入前 payload 指 staging 中的 `assets/**`、`settings/**` 与 `package.json`，不含生成的配置、manifest、evidence、`.DS_Store` 或 profiles。该 payload 共667个文件、36,266,325字节。Creator 输出是另一套清单：Web 为803个文件、38,670,790字节；WeChat 为823个文件、38,707,433字节；ByteDance 为821个文件、38,681,779字节。这些目录字节总数不代表上传压缩包大小。两个原生 `game.json` 均声明八个 subpackages。
