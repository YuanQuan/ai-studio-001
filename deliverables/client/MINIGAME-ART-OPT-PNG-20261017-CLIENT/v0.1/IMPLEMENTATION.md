# 六PNG接入实施说明 v0.1

本次仅接入获批的六张PNG，不使用WebP、不做全库替换，也不新增画质档位。现行入口为 `apps/client/tools/asset-integration/build_staging.cjs --candidate-overrides apps/client/tools/asset-integration/approved_png_overrides.json --base-stage <隔离基线>`。清单将六个稳定ID逐项绑定至 Art `FILE_IDENTITY.json`、Master授权、候选/reference SHA、尺寸、路径、UUID与几何。基线 payload inventory 已纳入仓库 `apps/client/tools/asset-integration/approved_png_base_payload.json`（SHA-256 `7f3bf66203ff90cf92233a3188f14e508c2dda4b3053d0b7eb19db7240d9f114`），不再依赖临时目录中的清单。

六项中，sky、U04 portrait、U05 font 是全画布PNG，已同步替换活动工程对应字节；三张裁切bundle图保留活动工程的1024/512 legacy画布输入，仅隔离stage写入已批准的裁切PNG路径，避免改变旧loader语义。六项原始 `.meta` UUID不变。另按固定文本授权，将 `milk_tea_lab.ts` 中唯一“三杯完成！”改为“三杯完成!”以复用字体已有ASCII字形；无其他语义变化。活动差异 `layout`、bridge左右PNG及 `package.json` 均保留原字节。

## 基线恢复和完整重建

构建基线使用QA冻结仓库的历史 builder（SHA-256 `02c1bb3147a4189e92cc629213b628b757374e79f258166f68f2cc5fca438280`），而非当前活动workspace。原 QA 冻结repo位于 `/private/tmp/minigame-png-qa-frozen-repository-20261017`，旧builder依赖的Editor settings从冻结提交 `d123` 按路径取原字节，SHA-256 `252823ccfc1ddc591d264b636ca7da33be088bf181769bb918969708325c89c9`。冷恢复步骤见 `apps/client/tools/asset-integration/PNG_OVERRIDE_USAGE.md`：只从 `d123` 导出冻结 `apps/client/tests`、所需manifest/map/editor settings及Owner表，再根据冻结 `GENERATED_ASSET_MANIFEST.assets[].approvedExport` 动态抽取所有唯一PNG源路径（包含BATCH与PILOT实际来源）；不会将所有美术PSD归档到临时目录。独立冷恢复已由Tech验证：旧builder exit 0，667项基础payload与仓库持久清单完全一致。不要用活动工程临时目录充当冻结仓库。

完整可复制的历史builder、build-config和六PNG候选stage命令见上述 `PNG_OVERRIDE_USAGE.md`。

冻结旧builder重建baseline后，与冻结v0.8 staging的assets/settings/package逐路径核验：667项、36,266,325字节、逐文件SHA差异为空（Tech v0.2 `BASELINE_PAYLOAD_DIFF.json`）。当前完整stage盘点含3份平台配置共670文件；pre-import盘点是在导入后从冻结baseline和候选输入重构的证据，不冒称当时现场快照。Creator导入后有76项 `.meta`规范化/生成差异，原生PNG与脚本字节符合预期；Tech v0.3逐项核对了18项native引用与导入配置中的UUID/几何。
