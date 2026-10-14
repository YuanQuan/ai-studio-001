# 桥造型对照修订流程核查 v0.1

任务：`SAKURA-BRIDGE-SHAPE-FLOW-20261014`。可信执行起点：2026-10-14 13:41:47 +08:00；用户消息精确时刻未知。

## 输入与审批边界

用户要求“对比这个图的桥的部分来修改”，v0.5本地真实参考为 `deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.5/reference/user_bridge_shape.png`。v0.4 Art准确送审包与原 `USER_REVIEW` 审批已存快照 `tasks/SAKURA-BRIDGE-FRONT-ART-20261014/ARTIFACT_APPROVAL_v0.4_PRE_SHAPE_REVISION.json`；现行审批 `REJECTED`，旧Art Task `REVISION`。旧v0.4已批准的前景mask制作范围不等于新桥形、新预算或Gate2批准。U00/U01 Client旧v0.1维持`REVISION`、审批`REJECTED`，新桥切片用户Gate2前不得正式接入；v0.3既有美术批准与旧历史保留。并发U05保持独立。

## 诊断结果与成本门禁

Art v0.5 三 Required：`BRIDGE_DIAGNOSIS.md`、`PRODUCTION_PLAN.md`、`DELIVERABLE.json` 均非空实存；交付索引六条外部文件路径存在。诊断将同尺度原图与v0.4桥各按 `[1160,520,1912,868)` 裁出752×348，均未缩放；检查配置实存。差距具体覆盖桥顶、洞口宽高、侧坡和桥脚、四灯层级、中央涡旋圆章，未把旧栏杆拆层视作桥形修改。PSD现有桥为镜像栅格body/front，缺单独券石、灯具和标章原生笔画；整体缩放还会露出旧桥背后未绘街水，故零新增像素局部形变不足。此为Art诊断结论，不等于Producer独立视觉Review。

Art方案仅处理中央桥和必要补洞，初始ROI `[1160,520,1912,868)`；ROI外RGBA应零差，17非桥资源逐SHA保持，六店不重绘。累计生成调用15/15继承，本轮新增0。Art请求总上限15→16：仅桥ROI追加1次imagegen、1候选、0自动重试；候选检查计划墙钟上限60分钟，超时记录真实时间，未声称已花用。新预算与新像素制作方案需用户具体Gate1决定，Art/Tech同批首图前预签；失败停止并交Master决定，不自动追加调用。新切片/PSD/同尺度重组实际产出后仍需准确Gate2用户审批，Client正式接入及运行核验位于其后。本单元示例Art本轮无QA。

## 任务线结论

本 Producer FLOW 三 Required、两项Task原文验收与独立台账/看板、continuity及复盘已备齐，已获Master `FLOW_MASTER_ACCEPTANCE.md` 正式内部接受，`REVIEW→DONE`／`PROFESSIONAL_REVIEW`。Art诊断/方案是供用户决定的具体材料，不是正式新桥产出；相关新预算与Gate1仍待决定，不能将此等待标成已批准或把Art正式制作称DONE。旧Client REVISION有上游Gate2依赖，不擅自改动。本次DONE仅限Producer流程支持；Art v0.5方案准确`USER_REVIEW`，用户预算决定仍待。
