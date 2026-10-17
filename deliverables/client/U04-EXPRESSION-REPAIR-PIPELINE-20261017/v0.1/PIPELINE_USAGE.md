# 表情局部合成工具用法

依赖项目运行时 Python、Pillow、NumPy。入口仅在本任务 `pipeline/expression_pipeline.py`。

## 1. 准备一个阶段规格

保存 JSON，例如 `mt_s2.json`。每次只传一个阶段、一个候选和一个经 Art 明确制作的 256×256 RGBA mask：

```json
{
  "source_canvas_px": [1024, 1536],
  "face_source_rect_xyxy": [360, 100, 616, 356],
  "base": "deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/exports/u04_mt_s2_base.png",
  "base_source_rect_xyxy": [218, 0, 869, 1024],
  "old_face": "deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/exports/u04_mt_s2_face_surprised.png",
  "front": "deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/exports/u04_mt_s2_front_hair.png",
  "front_source_rect_xyxy": [510, 97, 561, 219]
}
```

所有相对路径以 `--root` 为准。矩形为 `[left, top, right, bottom]`，使用批准源画布坐标。base/front 导出尺寸与矩形不同时，按映射恢复尺寸使用 Lanczos，报告会注明重采样；不把它描述为无损还原。`old_face` 必须是透明 oneface 层，尺寸为源ROI的 256×256；例子引用旧 face PNG。禁止把 `*_old_face_recomposed_source.png` 或其他 base+face+front 审图裁片填作 `old_face`，否则会把前发、镜框等已合成内容再次叠入脸层。AD/XJ 旧 face 原生导出是 192×192；应将该透明 face 单层按 Lanczos 等比归一到 256×256 后作为 oneface 输入，或使用已有的源尺寸 256×256 oneface 文件。Art `inputs/*_old_face_256.png` 是由显示脸片归一用于参考，不能误用 full recomposed crop。

## 2. 合成单个候选

```sh
/Users/yuanquan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 \
  deliverables/client/U04-EXPRESSION-REPAIR-PIPELINE-20261017/v0.1/pipeline/expression_pipeline.py \
  compose --spec mt_s2.json --root /绝对/项目路径 \
  --candidate /path/to/one_candidate.png --mask /path/to/art_semantic_mask.png \
  --out /path/to/review_output
```

候选仅按等比缩放适配 256×256，透明补边居中；不裁切、不挪眉眼嘴，也不生成图。mask 的 alpha 是唯一允许写入的范围，RGB 不参与遮罩。空 mask、尺寸错误、坏输入路径、越界/空矩形或 mask 外任一 RGBA 像素变化都会拒绝输出，不留下半截文件。输出目录必须不存在且其父目录已存在；工具先将全部结果写入同级临时目录，成功后一次性改名提交，拒绝覆盖旧目录。成功会输出 `face_candidate.png`、`recomposed_source_canvas.png`、`face_source_crop.png` 和 `pipeline_report.json`。报告的 `CANDIDATE_COMPOSED_ART_REVIEW_REQUIRED` 不是视觉通过结论；Art 需单独检查身份锚点和表情语义，漂移候选应拒收。

## 3. PSD 基础核对

```sh
python3 expression_pipeline.py inspect-psd /path/to/sample.psd
```

检查 Pillow 能否读取合成图，并解析 PSD v1 顶层图层名、可见 flag 和边界。现有六份旧 PSD 的图层 flag 核对显示眉/眼/嘴组成的 5 态中恰有一态全显、其余态全隐；这只证明 PSD 元数据 flag 与合成图可读，仍不等于在 Photoshop/Editor 里完成交互切换验证。旧 `image2psd_hidden_adapter.py` 可用于按现有 manifest 组装 PSD，但此脚本不擅自调用、不替换母版，也不把扁平合成图或栅格语义层称为原生笔触/矢量可编辑层。

所有候选、遮罩、输出和 PSD 均以输入/输出 SHA-256 标识。工具会拒绝覆盖输出目录内任何同名结果；每个候选使用新输出目录。该工具不判断样张通过、不扩展到其余 24 态，也不接入正式客户端资源。
