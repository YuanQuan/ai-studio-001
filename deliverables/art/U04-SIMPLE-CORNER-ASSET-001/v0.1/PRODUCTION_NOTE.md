# U04 极简角饰原图拆分制作记录 v0.1

- 本批唯一源图：`deliverables/art/U04-DIALOGUE-CORNER-REVISION-001/v0.3/concept/corner_simple_concept.png`，1672×940 RGBA，SHA-256 `821f0420d989d1914560a78569fe4cb570f319f1d37be90cc75f5f200e71e043`。用户已明确“好的替换到U04中”，批准该实图并授权原样拆分替换；不重绘、不改轮廓、金色与深蓝配色。
- 源图按画布中线分成互不重叠的左下与右上原位透明区域。PSD 保留完整源图参考层及两个 1672×940 原位 RGBA 真区域层；平面图拆层仅可分别移动两角，不能编辑各角内部矢量形状，也不补洞或重建。
- 导出边界按 alpha≥2 的实物包围盒向外留约 8 源像素：左下 `[48,590,404,883)`（356×293）；右上 `[1362,58,1637,281)`（275×223）。右上远离主体的 alpha=1 离散噪点不纳入切片；区域内原像素保持，仅对实际显示缩小进行 RGBA 抗锯齿采样。
- 两张输出均为 128×96 RGBA。沿用现有 U04 两角可见高度 70 px，以左下裁区为尺度基准，统一等比缩放系数 `70/293`：左下约 85×70，靠画布左下锚定；右上约 66×53，靠画布右上锚定。因此两角的相对大小关系不变，四周为真透明。实际整数像素与缩放核对以 `EXPORT_MAP.json` 为准。
- 对应客户端稳定路径为 `apps/client/assets/units/dialogue/ui/tex_u04_dialogue_corner_cloud_bottom_left.png`、`.../tex_u04_dialogue_corner_cloud_top_right.png`；现有 `.meta` UUID 保留，由 Client 接入并验证运行。本 Art 批次只写 `deliverables/art/U04-SIMPLE-CORNER-ASSET-001/v0.1/`，保留旧图。
- 来源为本项目先前原创生成概念图，未使用外部图片或字体；当前检查未发现可识别第三方 IP。首图导出前由 Art 与 Tech Lead 对本批来源 SHA、两角尺寸/边界/锚点、PSD 与路径共同预签。用户直接替换授权覆盖本次原图无创拆分与接入；需要变更已批准外观则另报 Master。
