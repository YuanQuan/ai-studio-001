# 六PNG候选发布输入

正式六PNG由 `approved_png_overrides.json` 固定绑定当前获批 Art `FILE_IDENTITY.json`、Master PNG授权、六个稳定资产 ID、参考/候选 SHA、尺寸、原始 `.meta` UUID、几何与发布路径。WebP明确不采用。U05「三杯完成！」到「三杯完成!」另由固定文本授权文件SHA绑定，只有原文SHA、目标SHA和唯一锚点全部相符才接受。

可复现的当前输入基线由冻结 QA 仓库中的历史 builder生成，不得直接复用活动项目或Creator导入后的stage。执行时先按旧入口生成baseline并生成平台配置，再调用候选入口：

```sh
node /private/tmp/minigame-png-qa-frozen-repository-20261017/apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-png-baseline-regenerated-20261017 \
  /private/tmp/minigame-png-qa-frozen-repository-20261017/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json \
  /private/tmp/minigame-png-qa-frozen-repository-20261017
node /private/tmp/minigame-png-qa-frozen-repository-20261017/apps/client/tools/asset-integration/generate_build_configs.cjs \
  /private/tmp/minigame-art-opt-png-baseline-regenerated-20261017
node apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-png-stage-20261017-v05 \
  --candidate-overrides apps/client/tools/asset-integration/approved_png_overrides.json \
  --base-stage /private/tmp/minigame-art-opt-png-baseline-regenerated-20261017
```

若`/private/tmp`已清理，使用冻结提交`d123`恢复实际输入。为了不导出历史PSD，仅抽取冻结的Client输入、工具和测试、三个已锁定manifest/map、Editor settings、v0.7 Owner overrides及83项approved exports：

```sh
export FROZEN=/private/tmp/minigame-png-qa-frozen-repository-20261017
mkdir -p "$FROZEN"
git -C "$GAME_REPO" archive d123 \
  apps/client tests \
  deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RESOURCE_STAGING_INPUT_FREEZE.json \
  deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RESOURCE_STAGING_INPUT_FREEZE_ADDENDUM.json \
  deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/portable-inputs \
  deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/editor-bundle-probe/CREATOR_EXPORTED_BUILDER_SETTINGS.json \
  deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/APPROVED_ASSET_HANDOFF_MAP.json \
  deliverables/tech_lead/MINIGAME-ART-OPT-IMPORT-TECH-20261017/v0.1/BUNDLE_REFERENCE_MAP.json \
  deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.1/GENERATED_ASSET_MANIFEST.json \
  deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json \
  | tar -x -C "$FROZEN"
# 依冻结 GENERATED_ASSET_MANIFEST 的全部approvedExport生成精确路径列表，再仅取清单实际引用的PNG。
python3 - "$FROZEN/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.1/GENERATED_ASSET_MANIFEST.json" "$FROZEN/approved-exports.nul" <<'PY'
import json,sys
rows=json.load(open(sys.argv[1],encoding='utf-8'))['assets']
paths=sorted({row['approvedExport'] for row in rows if row.get('approvedExport')})
with open(sys.argv[2],'wb') as out:
    out.write(('\0'.join(paths)+'\0').encode())
print(f"approvedExport count={len(paths)}")
PY
xargs -0 git -C "$GAME_REPO" archive d123 < "$FROZEN/approved-exports.nul" | tar -x -C "$FROZEN"
# 校验旧builder和本轮实际使用输入的SHA；错误时停止。
shasum -a 256 "$FROZEN/apps/client/tools/asset-integration/build_staging.cjs"
shasum -a 256 "$FROZEN/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json"
shasum -a 256 "$FROZEN/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.1/GENERATED_ASSET_MANIFEST.json"
shasum -a 256 "$FROZEN/deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/editor-bundle-probe/CREATOR_EXPORTED_BUILDER_SETTINGS.json"
node "$FROZEN/apps/client/tools/asset-integration/build_staging.cjs" /private/tmp/minigame-art-opt-png-baseline-regenerated-20261017 "$FROZEN/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json" "$FROZEN"
node "$FROZEN/apps/client/tools/asset-integration/generate_build_configs.cjs" /private/tmp/minigame-art-opt-png-baseline-regenerated-20261017
```

上述`git archive`按路径导出，避免恢复7.4GB历史PSD。

历史builder、v0.7输入、Editor settings、baseline manifest及本次stage manifest的完整SHA见交付`BUILD_MANIFEST.json`。正式冻结清单`approved_png_base_payload.json`严格限定为assets/settings/package共667项、36,266,325字节，SHA-256 `7f3bf66203ff90cf92233a3188f14e508c2dda4b3053d0b7eb19db7240d9f114`；排除`.DS_Store`、`build-configs`、`evidence`及`build-output`。三份平台build-config由配置生成器针对隔离stage重新生成，不作为冻结业务payload。此次pre-import重构盘点的670项（另含三份config）是历史证据。与冻结v0.8的667项逐路径SHA/字节相同，详Tech v0.2`BASELINE_PAYLOAD_DIFF.json`。

接入逻辑会在写目标前检查完整baseline payload清单、冻结stage身份、六项唯一ID、身份和授权SHA、source/reference/candidate bytes和SHA、PNG签名及尺寸、image/frame UUID、源Meta SHA和已批准几何。随后只在隔离副本内写六候选，`.meta`保持原样；三个bundle裁切图使用Tech映射的生成bundle目标，不覆盖1024/512 legacy画布。全画布 sky、U04 portrait、U05字体同步写入活动工程原资源路径。原始裁切尺寸、offset、pivot及uuid不变。

Creator 导入会对部分 SpriteFrame `.meta`作格式规范化；验证区分输入阶段的原Meta SHA保留与导入后UUID、frame UUID、几何保持。构建Web仅作调试冒烟；微信和抖音为正式目标。当前构建命令、文件哈希、平台原生PNG、HTTP和IAB结果按任务证据单独登记，不将旧stage结果当成新候选验证。
