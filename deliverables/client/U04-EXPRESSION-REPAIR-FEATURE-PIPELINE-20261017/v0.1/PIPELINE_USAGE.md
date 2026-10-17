# 使用说明

运行环境使用系统已配好的 Pillow 与 NumPy，不新增依赖。仓库根目录执行：

```sh
PY=/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
$PY deliverables/client/U04-EXPRESSION-REPAIR-FEATURE-PIPELINE-20261017/v0.1/pipeline/expression_pipeline.py extract-features \
  --root . \
  --spec deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/resume_20261017/at_s0_sad_compose_spec_01.json \
  --definition deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/resume_20261017/AT_S0_SAD_FEATURE_MASK_DEFINITION_02.json \
  --out deliverables/client/U04-EXPRESSION-REPAIR-FEATURE-PIPELINE-20261017/v0.1/review/AT_S0_SAD_feature_extract_05
```

`--out` 必须指向全新目录。运行成功输出 `oneface_combined.png`、六张 `semantic_layers/*.png`、union mask、base→new oneface→front 源坐标重组图、ROI 裁图和 `feature_extract_report.json`。候选和 mask 的 SHA 必须与 Art definition 完全一致；名称、图像尺寸、坐标或输入解码失败时，工具拒绝输出。

## 当前可复用产物

- 透明单脸：`review/AT_S0_SAD_feature_extract_04/oneface_combined.png`，SHA-256 `8f0621cb20f46af99788731bfb9d08be46b17a92922d9b7e246e82a5584e38ed`。
- 语义层：同目录 `semantic_layers/01_left_brow.png`、`02_right_brow.png`、`03_left_eye.png`、`04_right_eye.png`、`05_mouth.png`、`06_nose_minor.png`。本次 Art PSD 中这六个新 SAD 层可见，旧 HAPPY / SURPRISED / SAD / SMILE / ANGRY 共 15 层隐藏。
- 同尺度审图：`review/AT_S0_SAD_feature_extract_04/recomposed_same_scale_1280x720.png`。

Art 可从上述输出复制 oneface / 语义 PNG 到新的 Art 候选资源目录，记录本次输入与输出 SHA，再自行准备并核查 PSD。Client 工具不把这些候选自动写进 Art exports 或旧 PSD，也不生成用户批准或视觉通过记录。

## 透明 oneface 与源尺寸

透明 `old_face` 只适用于旧版 `compose` 命令；它必须是 256×256 的透明 oneface（例如 `deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/exports/u04_mt_s2_face_surprised.png`），不是不透明的 `*_old_face_256.png` 审图 crop。后者已经把 base+face+front 重组到一起，再叠一次会重复显示眼镜、头发或五官。

新 `extract-features` 的 `old_oneface_path` 仅作只读来源登记，旧五官不会被复用。当前定义示例使用 AT_S0 的 `u04_at_s0_face_sad.png`。AD/XJ 的若源脸导出为 192×192，不能直接填入要求 256×256 ROI 的旧 `compose`；应先按获准 `LAYER_EXPORT_MAP` 对应关系使用/导出与批准 source ROI 对齐的 256×256 源裁切，并把转换来源、rect、算法与 SHA 记入 Art definition。192→256 的插值只是重采样，不可称作找回原生像素。不要将重组 review crop 当作透明 oneface。

## PSD 检查与限制

```sh
$PY deliverables/client/U04-EXPRESSION-REPAIR-FEATURE-PIPELINE-20261017/v0.1/pipeline/expression_pipeline.py inspect-psd deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/source/u04_at_s0_expression_repair.psd
```

新 PSD 由 Art 组装于 `deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/source/u04_at_s0_expression_repair.psd`。当前检查结果保存于 `review/AT_S0_new_psd_inspection.json`：Pillow 合成预览可读，24 个顶层图层中 6 个 `SAD_NEW` 可见，15 个旧表情层隐藏，base/front 可见，参考层隐藏。旧 PSD 检查记录另存为 `review/old_at_s0_psd_inspection.json`。

检查器只读 PSD v1 顶层 layer-record 可见 flag 和 Pillow 合成预览。它不能验证分组/嵌套组的实际开关效果，也不能证明原生画笔或矢量编辑性。Art 已完成 PSD/同尺度视觉检查并报告 PASS； Client 工具本身不审批视觉效果或正式资源接入。
