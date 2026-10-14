# U05 B 修订落地流程 v0.1

登记时间：2026-10-14T10:25:15+08:00；用户原消息精确时刻未知。

- 用户明确将标签背景改为可复用九宫格、艺术字改程序可用图集、按钮文字“确认交杯”改“确认”，并继续U05落地。`USER_DIRECTION.md` 记录范围；新图制作须同批Art/Tech预签，新实际切片另经Gate2。
- Product人工源、Tech配置只读审查、UI文字交互三包v0.1已呈现，原绑定SHA逐一复核为8/8、5/5、7/7；Master裁定本次继续实施构成准确包批准。各原审批已保留待审快照，现行审批为USER_APPROVED，Task DONE仅对应规格阶段。UI旧“确认交杯”文字被本次用户指令覆盖，实施以“确认”为准。
- 旧Art整包57片/17 Required未整体获批。`RETAINED_ASSETS.json` 对既有未变PNG逐ID/SHA限定采纳（45片）；12片文字相关旧PNG待修订，Art Task REVISION。新资源切片仍待实际Gate2 USER_APPROVED，旧整包Approval保持历史USER_REVIEW。
- Client可使用已批配置/交互及保留子集推进代码；新版标签/图集不得正式接入，Creator实际画面与性能仍待运行证据。U05为前端示例，无QA阶段。
- Continuity：三份规格已解锁；Art/Tech新组件任务需以首份Required实产认IN_PROGRESS；Client实施任务由Master创建后同理跟进。当前不以本FLOW首产作为结束已授权落地的理由。

## 新版成品送审节点

- 2026-10-14 10:35:50 +08:00：Art v0.1 七Required、49导出、PSD与三审阅图均逐SHA核对；`ART_GATE2_FROZEN_HASHES.json`为可复核版本清单。45旧片逐字节不变；12旧牌由1九宫格替代，719字BMFont与按钮“确认”实际成品已由Master呈现。Art Task USER_REVIEW，新版Gate2尚未用户批准。
- Client FEATURE_BRIEF首产及Tech概要评审APPROVED，Task IN_PROGRESS；正式导入新图、Creator构建与运行待后续实际证据。

## Gate2用户退回

- 用户明确“需要修改这批组件资源”；具体需改的组件、尺寸、字形或位置尚未说明，Master已询问。v0.1 Gate2 `REJECTED`，Art Task `REVISION`；本版切片、PSD、图集、重组和逐SHA审计保留，不覆盖。新版本需重新提交真实切片与重组审核。
- Client继续已批配置/状态、45张保留PNG与通用组件代码；新版切片与字体图集继续禁止正式导入。

## 字体图集保留子集批准

- 用户将需改项限定为“标签底板”；Master解释为仅九宫格底板继续REVISION，具体问题待答。`APPROVED_FONT_SUBSET.json`逐SHA锁定719字图集PNG/FNT、metrics、字体源与OFL；对应`ARTIFACT_APPROVAL_FONT_SUBSET_v0.1.json`为范围限定USER_APPROVED。Client可正式使用该图集并另记Creator实际验证。按钮文案仍采用用户指定“确认”。
- Art v0.1完整Gate2保持REJECTED；PSD、重组、底板与49项整包未因此获批，旧45片既有子集批准保持。

## v0.2实际底板Gate2批准

- 用户原话“批准这版底板，继续接入试玩”，Producer 2026-10-14 10:57:59 +08:00登记；消息精确秒未知。`ART_GATE2_V02_APPROVED_HASHES.json`锁七Required、49导出、61层PSD及三Review图；v0.2 Gate2 USER_APPROVED，Master最终接受Art Task DONE。旧v0.1 REJECTED与字体子集审批历史保留。Client可正式接入此版，运行仍待。
- `BUILD_PATH_INCIDENT.md`记录隔离profile曾误写另一通用临时目录；已登记灯光独立目录三关键文件SHA一致，但通用目录原身份未知。Client自有输出修复重建与浏览器验收待证。

## 前端最终包送审

- Client v4五Required、最终Tech三Required、Master浏览器报告及父整合报告实存。Tech终审APPROVED；准确文件SHA绑定`FRONTEND_FINAL_HASHES.json`，Client和父Task只到USER_REVIEW，等待用户最终实现接受。Web8876可试玩，最终截图为`browser-v4-final-workstation.jpg`；旧v2/v3截图是历史操作证据，不冒充v4最终显示。
- FLOW固定交付与复盘已更新，Producer本任务准备REVIEW，待Master AUTO接受。Continuity：本轮获授权的制作、构建、核对均有实际产出；当前剩用户最终实现接受门禁。
