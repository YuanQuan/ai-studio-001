# U04 表情修正技术检查 v0.1

首图前同批预签已 `APPROVED`，绑定 Gate1 v0.2 方案 SHA `691699afcd70db3df4c82490cf7be27be1f3c055f72ac1a69907b2945e9e955a` 与 Art 预签 SHA `6c52cb9edd7906ddceea2340c1711695c0d3ad1692fab6414377487916ec4eeb`。它只确认已批准的六样文字方案和旧来源文件、坐标、三层接口、48次上限；不代表新图或运行通过。

Art 的 `PRODUCTION_LEDGER.json` 记录 MT_S2 surprised 首次内置 image_gen 调用返回连接发送错误，没有请求 ID 或输出，状态 `UNKNOWN_COUNTED`；保守占1/48，余额47，确认新候选0。AT未调用，Art B调用0。详情与首次输入文件后续同名写入限制见 Art `BLOCKER_REPORT.md`。本技术检查没有重新生成、导出或运行。

六代表样张的新 PSD、切片和同尺度重组均未产生，所以实际 ROI 外可见像素与 alpha 零差、清边、五态互斥、小锦圈纹镜仅一次显示、贴图面积/页数、驻留内存、DrawCall 和实际运行画面均 `NOT_TESTED`。`SAMPLE_TECH_REVIEW.json` 和 `BATCH_EXPANSION_PRESIGN.json` 均为 `BLOCKED`；余24态不放行。Gate1方案批准保持有效，Gate2具体版本仍为草案，不能将旧图作为新图送审。

恢复时先查原请求结果及预算归属；工具无可查 ID 时保留这次保守计数，不盲重发。Art取得六样后，Tech依据实际PSD/切片/同尺度重组及调用账本复核，再决定扩批复签。自产切图成品按现行规则直接交用户Gate2，不添加专业效果复审或额外预览环境门禁。
