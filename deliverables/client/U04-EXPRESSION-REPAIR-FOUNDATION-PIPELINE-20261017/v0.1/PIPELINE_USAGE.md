# Foundation Cleanup 工具使用说明

## 依赖与位置

使用仓库已有 Pillow、NumPy 与指定 Python runtime；不引入新依赖。执行脚本：

```bash
/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/pipeline/foundation_cleanup.py \
  clean-definition --root . --definition <Art定义JSON> --stage <STAGE> \
  --out deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/review/<新唯一目录名>
```

`--only base|front` 可输出单层候选；正式组合检查默认 `both`。目标目录必须不存在且父目录先存在。脚本不覆盖输出。定义 SHA、源层 SHA、mask SHA、采样坐标与输出 SHA 都写入 `cleanup_report.json`。

## 本轮真实执行命令

```bash
# AC 首次工具预览：只使用 Art DRAFT_FOR_TOOL_PREVIEW v04，绝不覆盖旧输出
/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/pipeline/foundation_cleanup.py clean-definition --root . --definition deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/resume_20261017/AC_S0_FOUNDATION_DEFINITION_04.json --stage AC_S0 --out deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/review/AC_S0_foundation_cleanup_02

# AD v02：验证 Art 明确的同坐标发丝 RGB 恢复
/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/pipeline/foundation_cleanup.py clean-definition --root . --definition deliverables/art/U04-EXPRESSION-REPAIR-RESUME-ADXJ-20261017/v0.1/source/ad_s0_foundation_normalized_definition_02.json --stage AD_S0 --out deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/review/AD_S0_foundation_cleanup_02

# XJ v02：除 base 同坐标修补外，仅验证 Art 已完成的眼镜转移与 front 绑定
/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/pipeline/foundation_cleanup.py clean-definition --root . --definition deliverables/art/U04-EXPRESSION-REPAIR-RESUME-ADXJ-20261017/v0.1/source/xj_s0_foundation_normalized_definition_02.json --stage XJ_S0 --out deliverables/client/U04-EXPRESSION-REPAIR-FOUNDATION-PIPELINE-20261017/v0.1/review/XJ_S0_foundation_cleanup_02
```

将上面的 `/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3` 替换为指定绝对 runtime 路径；示例中的 Art `source` 只读，目标目录须用未使用的新名称。禁止将 `*_old_face_256.png` 这类已把 base+face+front 重组的 opaque 审图 crop 再当透明 oneface。此清理脚本只输出基础层，不接收或合成候选表情。

## 输入约束

- 定义需绑定 1024×1536 RGBA base/front、256×256 ROI 和 256×256 RGBA alpha masks；路径、文件 SHA 和 source geometry 必须匹配。
- 每个肤色样点以 ROI 左上角为局部坐标 `[x,y]`，必须在 base_repair mask alpha=0 处、current base alpha 非零；同一点不能重复。
- `hair_recovery` 支持两种显式结构：
  - `source_path`、`source_sha256`、`source_canvas_px`、`source_rect_xyxy`、`mask_path`、`mask_sha256`、`mask_canvas_px`、`channels: RGB`、`preserve_current_alpha: true`；
  - 兼容 Art 已落定义的 `approved_source` / `approved_source_sha256` / `source_rect_xyxy` / `mask:{path,sha256}`，或 `source_roi_xyxy`、`mask_path` / `mask_sha256`。
  源图须与完整 1024×1536 base 同尺寸，矩形必须精确等于 face ROI。hair mask alpha 内只按同坐标来源混 RGB，当前 base alpha 固定保留。
- 若有 `approved_optics_transfer_binding`，它只作引用完整性核验：approved face、annulus mask、derived annulus、derived ROI front 均要求与 JSON 绑定的 SHA 和 256 尺寸；derived ROI front 必须与 full front 对应 ROI 逐 RGBA 像素相等。工具不自行合并镜圈。
- 拒绝已撤回/拒用定义、输入哈希不符、非法尺寸/ROI、样点污染、缺失引用、已存在输出目标；失败时不写半成品。

## 结果解释

`CANDIDATE_FOR_ART_REVIEW` 只表示工具完成像素操作，不是视觉通过。优先检查 `roi_before_after.png`、mask overlay、源/新同尺度画面；若 Art 标注锚点、发丝、阴影或镜片问题，更新 Art 定义并换新输出目录重新执行。`PIPELINE_CHECK.json` 记录本轮实际检查及未执行项。
