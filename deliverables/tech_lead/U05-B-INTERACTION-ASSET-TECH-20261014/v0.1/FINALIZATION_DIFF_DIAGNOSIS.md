# FINALIZATION PSD 预览差异只读诊断

状态：**BLOCKED**。只比较现有 `review/workspace_b_master_preview.png` 与冻结的 `review/reconstructed.png`，未重渲染、改清单、改 PSD 或消耗 Art 制作预算。两图同为 1024×1536 RGB；逐像素相异 **57,225** 点，半开外接界 `[65,564,973,1084)`，与 Art 的 `FINALIZATION_REVIEW.json` 一致。

将 v0.1 Workspace 与 v0.2 Component 的 12 张 `LABEL_PLATE_*_full.png` 可见 alpha 区域取并集后，**56,895** 个差异点落在标签源覆盖区；余 **330** 点精确落在 `[509,806,566,819)`，且全部位于 `TEXT_SAMPLE_DYNAMIC_full.png` 与 `TEXT_LABELS_HEADER_full.png` 的可见 alpha 重叠区。分别只用旧或新标签的 alpha 并集会漏掉边缘差异，因此应以两版源覆盖区的并集归因。上述集合统计说明差异集中位置，不声称每个标签像素的颜色变化都由唯一一层独占。

来源偏差可由现有文件直接定位：`source/build_full.py` 的 `layer()` 固定从 `U05-B-WORKSPACE-ASSETS-20261014/v0.1/source/layers` 读取；其货架重组把 12 张 `LABEL_PLATE_*` 取自该旧目录。冻结的 `source/psd_manifest_full.json` 却将同名 12 层指向 `U05-B-COMPONENT-ASSETS-20261014/v0.2/source/layers`，两版对应文件并非同字节；PSD 预览因此与冻结重组图使用不同标签源。剩余 330 点在类别标题文字区；manifest 同时保留 `TEXT_SAMPLE_DYNAMIC` 旧层和新增 `TEXT_LABELS_HEADER` 层，二者在该处可见 alpha 重叠，需核明确的合成顺序/单一文字来源，不能以微小差异自动放行。

候选修正仅限**源身份与层次对齐**：由 Art/Root 先确定最终应以已批 v0.2 标签还是冻结重组图所用旧标签为准，并固定相同来源供重组图与 PSD 清单消费；同时消除类别标题的双层叠加差异。若选 v0.2 标签，须更新冻结重组图及其 SHA；若选旧标签，须改变已冻结 72 层 manifest 的 12 条路径/SHA。两种都会触及用户已批准的 `FROZEN_INPUTS.json`，不能以本诊断擅改或把已失败的 PSD 判 PASS。应由 Master 按原审批范围组织差异决定，形成可追溯新冻结版本和同批 Art/Tech 复签；若属于具体视觉版本变更，交用户决定。修正后仍只按既有技术条件核可解码层数、合成像素和真实切片登记，自产资源最终直接交用户具体 Gate2，不新增效果专业复审门禁。Client 在 Gate2 前仍不得正式接入。
