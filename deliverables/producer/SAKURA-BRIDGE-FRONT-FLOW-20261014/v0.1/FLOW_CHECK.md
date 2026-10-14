# 桥栏杆前景拆层流程核查 v0.1

任务：`SAKURA-BRIDGE-FRONT-FLOW-20261014`。本文件跟踪用户局部修订从准确范围授权、同批预签到具体切片送审；状态随真实文件更新。

## 审批边界与旧版保护

- 用户反馈“桥的栏杆部分要放在前面”退回 U00/U01 Client v0.1 实际运行效果的局部遮挡。原 `tasks/U00-U01-SAKURA-V03-CLIENT-20261014/ARTIFACT_APPROVAL.json` 已原样快照为 `ARTIFACT_APPROVAL_v0.1_PRE_BRIDGE_REVISION.json`；现行记录 `REJECTED`，Client Task `REVISION`。原 v0.3 美术图片 Gate2 `USER_APPROVED` 仍保留。
- `tasks/SAKURA-BRIDGE-FRONT-ART-20261014/ARTIFACT_APPROVAL_GATE1_v0.4.json` 为 USER_APPROVED，准确对象 `deliverables/art/SCENE-SAKURA-REDRAW-REUSE-20261013/v0.4/USER_REVISION_SCOPE.json` 绑定用户参考图 SHA 和本轮精准 Gate1：只把现有桥栏杆及所属灯柱拆成前景，不改桥面、拱、脚及其余资源，不额外生图。具体 v0.4 切片、遮挡示例及 PSD 仍须用户 Gate2 决定。此前用户批准不代替新切片批准。
- 旧 Client 工程保持冻结字节，U05 并行改动不被本轮覆盖，Art v0.4 Gate2 前不做正式导入、构建或运行判断；单元示例本轮无 QA Agent。自产切图直接交用户 Gate2，不新增切图效果专业复审。

## 可核阶段

| 关口 | 当前证据 | 结论 |
|---|---|---|
| Art/Tech 同批首图前预签 | Art `ART_PRESIGN.json` 12:30:28、Tech `TECH_PRESIGN.json` 12:30:45 同为 `SCENE-SAKURA-REDRAW-REUSE-20261013/v0.4`；Tech 绑定 Art 预签及制作方案 SHA 独立复算吻合 | 通过，限确定性拆层导出 |
| Tech 内部支持 | Tech 三 Required 实存、四项修订后 Task 原文验收同序 PASS；Master `TECH_MASTER_ACCEPTANCE.md` 实存，Task `DONE` / `PROFESSIONAL_REVIEW` | 通过，仅预签支持 |
| Art 实际 v0.4 | 首轮临时front越界、第2轮灯笼低alpha外晕定向修正后，最终16 Required及Master静态核验实存；准确Art v0.4 USER_REVIEW绑定FINAL_IDENTITY | 待用户Gate2，Art未DONE |
| Client 接入 | v0.4 用户 Gate2 未批准，Client Task 保持 `REVISION`，Master记录6项Client冻结字节不变 | 锁定 |

## 最终交付关口

Art 16份 Required 非空实存，交付18项索引均实存，四项 Task 原文验收同序 PASS。`CUT_MANIFEST.json` 与 `FILE_VERIFICATION.json` 记录19 PNG原型、45环境实例、17旧PNG同字节、桥半幅body/front像素唯一分配零差、全景与v0.3零差、零生图；前景301×199，原半幅bbox `[1235,34,1536,233)`。45层完整PSD、同尺度重组图、桥局部及有实体遮挡示意、37成员ZIP均实存。原图未含被栏杆遮住的完整桥面信息，Art明示未补画。Master `DELIVERY_FILE_CHECK.md`、`FILE_REASSEMBLY_CHECK.json`、`PSD_STRUCTURE_CHECK.json`仅核实际文件身份/静态重组/PSD结构，未添加自产切图专业效果复审；`FINAL_IDENTITY.json`的11项SHA经Producer逐项复算吻合。原生Photoshop打开、Creator正式导入/运行和目标机均未测试。

Art现行 `ARTIFACT_APPROVAL.json` 精确绑定v0.4 `USER_REVIEW_PACKET.md` 与Master `FINAL_IDENTITY.json`，Task进入 `USER_REVIEW`、`decided_at` 为null。用户尚未批准具体v0.4切片及遮挡效果，Art不得DONE；Client旧v0.1 Task保持REVISION且新切片不接入。Tech预签支持已内部DONE，Producer本FLOW三Required、continuity与复盘将送Master内部接受。
