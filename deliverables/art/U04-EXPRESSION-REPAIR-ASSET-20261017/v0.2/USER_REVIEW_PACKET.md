# U04 六店长 30 态脸缘修订｜Gate2 具体资源审核包 v0.2

本包针对用户在 v0.1 圈出的肤色糊层，局部修复额发、眉缘和下颊发缘。六店长各五态仍用固定 `base → 单一 face → front` 三层重组；眼嘴与表情身份保留。此版本提交具体资源用户审核，尚未获得 Gate2 批准，Client 未正式导入，UUID 与运行 QA 均未生成。

![v0.2 30 态同尺度总板](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/U04_30_STATE_NAMED_ACTUAL_SCALE.png)

这张总板 SHA-256 为 `43bad960d22e4124ab5f1a623fe3098571c29fca80ee6a13d4e2df6f38f01a42`，30 格均直接裁自真实 1280×720 U00 显示像素，没有重缩放；逐格原图、裁切坐标与 SHA 见 [总板索引](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/U04_30_STATE_NAMED_ACTUAL_SCALE.json)。

## 先看圈区前后

- [13 处圈区近景与先验坐标索引](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/circle_before_after/INDEX.json)；每图左右标明修前/修后，放大只用于查发丝与眉缘。
- [MT 高兴下颊对照](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/circle_before_after/mt_s2_happy_cheek_before_after.png)、[AJ 高兴右眉对照](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/circle_before_after/aj_s2_happy_brow_before_after.png)、[AJ 高兴下颊对照](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/circle_before_after/aj_s2_happy_cheek_before_after.png)、[AD 惊讶额发对照](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/circle_before_after/ad_s0_surprised_bang_before_after.png)、[XJ 惊讶左眉对照](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review/circle_before_after/xj_s0_surprised_brow_before_after.png)。
- 100% 实际显示尺度的逐态修前/修后图在 [review 目录](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/review)；近景不是代替真实尺度验收。

## 实际修订与母版

| 阶段 | v0.2 实际文件 | 处理范围 |
|---|---|---|
| `MT_S2` | [PSD](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/source/u04_mt_s2_expression_edge_repair.psd) · [base](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/exports/u04_mt_s2_base_edge_repair.png) | 共用底图下颊发缘窄线；五态 face 和 front 旧 hash 不变。 |
| `AJ_S2` | [PSD](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/source/u04_aj_s2_expression_edge_repair.psd) · [base](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/exports/u04_aj_s2_base_edge_repair.png) | 共用底图下颊窄线；高兴/悲伤/微笑/生气四张 face 的眉额发肤色羽化收边；惊讶 face 原 hash。 |
| `AD_S0` | [PSD](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/source/u04_ad_s0_happy_expression_edge_repair.psd) · [base](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/exports/u04_ad_s0_base_edge_repair.png) | 共用底图中央额发尖；惊讶/悲伤 face 各微调 28/14 像素；生气 face 原 hash，高兴/微笑仅继承底图。 |
| `XJ_S0` | [PSD](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/source/u04_xj_s0_surprised_expression_edge_repair.psd) | 仅惊讶 face 左额发眉缘 380 像素；base/front 和其余四态原 hash。 |

每张透明脸片、固定 front、30 张逐态 U00、每态 PSD 开关预览、稳定 ID、尺寸及 SHA 均列于 [ASSET_MANIFEST.json](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/ASSET_MANIFEST.json)。[LAYER_EXPORT_MAP.json](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/LAYER_EXPORT_MAP.json)给出原生坐标、导出关系与计划 Client 路径。AT、AC 两组及其他未改实片直接按 v0.1 原路径和 hash 引用；旧 v0.1 的 1344 个基线文件核对为零变更。

## 归因、验证与预算

- [成品诊断补记](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/DIAGNOSIS_FINAL_ADDENDUM.json)区分 face 羽化侵入与共用底图污染。AJ 右眉残存的低 alpha 柔边属于新版眉语义层内部正常阴影/抗锯齿；更强收边会露旧眉碎段，两个拒绝试验留证，故未整图锐化。
- [先验 ROI](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/ALLOWED_ROI_BEFORE_EDIT.json)与 [AD 共用底图先验补登记](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/ALLOWED_ROI_AD_SHARED_BASE_ADDENDUM_BEFORE_EDIT.json)都在对应编辑前落盘。[差异遮罩](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/REVISION_DIFF_CHECK.json)记录 3 张 base、7 张 face、20 张 U00 逐像素差异及遮罩；所有差异在允许 ROI 或同尺度投影内，区外 0。
- [20 态语义层重组核](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/SEMANTIC_STATE_RECOMPOSE_CHECK.json)验证四组各五态的语义层合成与导出 face 完全相同；[综合检查](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/REVISION_CHECK.json)核 230 条登记路径/SHA 与旧 1344 文件保护。
- 本次 imagegen 调用 0；AJ 高兴首样确定性方案接受 1、被拒确定性试验 2、该眉灰分支按两轮修订计，详见 [TRIAL_LOG.json](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/TRIAL_LOG.json)。原批次已用 32/48 调用、本轮沿用原 6 小时墙钟停工复核限而非另获 6 小时，见 [PRODUCTION_LEDGER.json](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/PRODUCTION_LEDGER.json)。

- [30态逐态视觉扫描](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/THIRTY_STATE_VISUAL_SCAN.json)记录每一格是否修订及共享底图继承范围；[Tech 最终静态核验](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/tech_lead/U04-EXPRESSION-EDGE-REVISION-20261017/v0.1/TECH_CHECK.json)通过三层、PSD嵌入层、ROI、清单 SHA 与总板逐格直裁。
- [Art 同批预签](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.2/REVISION_PRESIGN.json)及 [Tech 同批预签](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/tech_lead/U04-EXPRESSION-EDGE-REVISION-20261017/v0.1/REVISION_PRESIGN.json)均在 AJ 首样前成立，签认的三份 Art 预案文件 SHA 保持。

## 请审核的决定

**请明确批准或退回 v0.2 的上述局部修订、对应 PSD/透明切片及 30 态真实 U00 同尺度效果。** 如需退回，请指出角色、表情和圈区。批准前保持 Client 正式接入关闭；本包静态检查不冒称运行 QA。
