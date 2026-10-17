# U04 表情样张技术恢复检查（进行中）

## 预签与范围

- 已批准制作方案 `deliverables/art/U04-EXPRESSION-REPAIR-PLAN-20261017/v0.2/PRODUCTION_PLAN.md` 当前 SHA-256 为 `691699afcd70db3df4c82490cf7be27be1f3c055f72ac1a69907b2945e9e955a`，与原 `TECH_PRESIGN_BINDING.json`、Art 预签及本轮生成台账绑定相同。
- Art 预签文件当前 SHA-256 为 `6c52cb9edd7906ddceea2340c1711695c0d3ad1692fab6414377487916ec4eeb`，与技术绑定相同。原技术预签仅覆盖六代表样张首图前方案，不授权余24态扩批，也不等于实图通过。
- 本轮调用台账保守计数 2/48（MT_S2 surprised 旧调用 `UNKNOWN_COUNTED` 1 次；AT_S0 sad 成功 1 次），余额 46。六样实际 PSD、切片、同尺度重组和互斥检查未齐，扩批不放行。

## AT_S0 sad 候选几何检查

- 候选 `candidates/at_s0_sad_imagegen_01.png` 实际 1254×1254、RGB、无 alpha，SHA-256 `284af40cb10421c96c800dc814fee0f62e6683ac1484c30f20ee47936fc79176`。不是 256×256 的可直接导入脸片。
- Art 的 256×256 归一化预览 `resume_20261017/at_s0_sad_normalized_preview_256.png` 与 `at_s0_old_grid_preview.png` 按同一 16 px 网格目视对照：两眼约在 y=110–125，口约 y=160–170，脸下缘约 y=180，头向和主轮廓接近旧脸框；技术上可继续尝试局部配准。眉形、眼睑、嘴形确有改动，不能要求修复区与旧图零差。
- 候选右下衣肩/配饰及左下有黑区和彩色噪边，部分发缘与旧画面不同。必须用预先登记的脸部局部 mask 仅取所需五官及相连皮肤阴影，不得整图缩放覆盖 256 脸片。当前尚无可核的正式 mask、透明 oneface 或同尺度重组；“可尝试配准”不是配准已通过。
- 固定源画布 1024×1536，AT_S0 脸源框 `[380,180,636,436]`，导出 256×256，旧脸片相对 base 偏移 `[133,180]`。后续须核实际透明切片仍用原 source rect、offset、pivot、稳定 ID 与 `base + oneface + front` 顺序；以现行旧 PSD 可见层/旧切片重组作为 ROI 外 RGBA 基准。

## 待实图验证

AT_S0 的真实 mask、透明 oneface、PSD 五态互斥、ROI 外 RGBA 零差（含 alpha/清边）、前发遮挡与同尺度接缝均为 `NOT_TESTED`。其余五代表样张及六样整体核验、XJ_S0 镜框/镜片仅前遮挡显示一次、实际纹理预算、Client 导入和运行画面也为 `NOT_TESTED`。哈希一致仅证明文件绑定，不能证明表情自然、身份一致或视觉通过；Art 与 Master 的视觉结论独立记录。

Art 正在制作 AT_S0 中间稿，以上 `NOT_TESTED` 指**定稿版本尚未核验**，不表示制作任务停止。对 `at_s0_sad_composite_01` 按其 `pipeline_report.json` 声明的 mask02（SHA-256 `e7007ba545b268b9a21b008fabc44f33789816c33f01e89b6ac5aeb5b3a9fc3a`）做中间检查：脸片 256×256 RGBA，mask02 外相对现行旧脸片改变 0 像素，mask 内改变 24,998 像素；mask02 非零范围 `(0,42)-(212,198)`，现行旧 oneface 非透明仅 7,855 像素、范围 `(18,63)-(190,173)`。mask02 覆盖较宽，不能仅凭其外零差推断方案要求的**预先登记脸部局部 ROI 外**保真通过。方案允许必要的 skin/shading 支持合入 oneface，关键是不得越过脸型、头发、衣物边界，且需解决旧 base 孔洞灰边与候选 patch 可见接缝。Art 已产生 mask03 草案，仍须以 Art 定稿交接的每份 `pipeline_report` 所指实际 mask 路径及 SHA、透明层和重组重新核验。六样未齐是当前待验依赖，样张技术 Review 和扩批复签保持未通过；Tech 任务本轮仍在执行。

随后出现的 `at_s0_sad_composite_02/pipeline_report.json` 指向 mask03（SHA-256 `352587f3182627f7f3fc04e2c9b7f913a133a5063fc5a6ef97c426edb576ae02`），其记录 mask 外 RGBA 改变 0 像素。实际打开 `recomposed_source_canvas.png` 可见脸中横向灰色矩形接缝与脸下缘方形边，说明 mask 外零差不足以证明拼接效果。此中间稿不能作为样张通过证据；需 Art 继续修正并交定稿，Tech 再复核对应真实文件。

已打开 Art 实际文件 `deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/resume_20261017/at_s0_base_front_without_face_crop.png`：当前旧 base + front 在脸内呈完整、平整的空白肤底，旧五官已去除；此前灰缝更符合RGB候选整块skin patch与现行肤底色差，不能再把“旧base有孔洞”当作已证实根因。Art计划改为确定性 feature-only 提取，弃旧oneface，以该空白base承底。**路线技术预判**与获批方案第3点相容：眉/眼/嘴须为实际可核的语义透明栅格层，必要相连skin/shading仅精确局部；合并后仍导出单一oneface，客户端接口维持 `base + oneface + front`。此处是路线评估，尚未独立验证新特征层。后续须以Art交付的各层、多边形软边mask和重组核mask范围、soft-alpha边缘是否有色晕、接缝和ROI外现行显示基准零差；若不能完全拆分，按原方案如实登记局部合并与编辑限制。此修改属已批准制作路线内的局部修复，不新增图像生成调用或审批门禁。

## AT_S0 feature-only 实际静态核验

新输出位于 `deliverables/client/U04-EXPRESSION-REPAIR-FEATURE-PIPELINE-20261017/v0.1/review/AT_S0_SAD_feature_extract_01/`（是 Client 授权的资产支持脚本产物，并非正式接入）。逐项独立核验其 `feature_extract_report.json` 所列真实路径与哈希：Art mask02 SHA-256 `198b659fb66b6ec5df084072ca17072aad4b44ca859342617f7fe7b388ee093c`、mask定义、候选图、六个语义层和四个输出均匹配。`oneface_combined.png` 为 256×256 RGBA；LEFT/RIGHT_BROW、LEFT/RIGHT_EYE、MOUTH、NOSE_MINOR 六层各有独立非零透明区域，报告记载语义层重组与combined差0像素。它们是栅格语义层，不是原生笔触或矢量可编辑层。

按报告的真实base、oldface、front切片及source rect重新叠出当前旧显示基准，再与 `recomposed_source_canvas.png` 比较：1024×1536全源画布在脸源框 `[380,180,636,436]` **外RGBA改变0像素**，框内改变11,341像素。另以base+front空白肤底重组，Art union mask外RGBA改变0像素。旧oneface仅作只读来源，未叠进新结果；实际合成仍为 `base -> oneface -> front`。打开 `recomposed_face_roi.png` 目视，先前宽灰缝已消除，眉眼嘴为可辨的低落表情，脸缘与前发未见明显色晕/矩形接缝；这只是当前同尺度静态图检查，不能代替Art/Master视觉决定。soft-alpha边缘仍需在Art最终PSD与导出重组中复核。

AT这份 feature-only 输出可作为Art继续制作PSD/同尺度正式样张的技术候选。PSD五态互斥、正式切片版本、六代表样张整体、XJ眼镜及余24态扩批依然 `NOT_TESTED`；不提前复签扩批。

## MT_S2 surprised 未知调用恢复条件

原失败调用保持 `UNKNOWN_COUNTED`，占用 1/48，不复写历史。先查原工具返回、生成目录和已有台账是否可恢复同一次调用的真实图像；若找到，登记原调用对应的原始输出路径、哈希、尺寸、时间与可核身份后按旧调用候选评估，不新增计数。若核查仍无可访问输出，向 Master 提交“原结果不可恢复”证据后，可在原首六样范围内考虑一次**受控新调用**：单独赋新序号、输入/提示/起止/结果与状态，预算从当前余额再扣 1，失败或未知同样计数；这不是对原调用的盲重发，也不能重置额度。是否启动由 Master 按当前批次进度决定；本记录不授权或执行该调用。
