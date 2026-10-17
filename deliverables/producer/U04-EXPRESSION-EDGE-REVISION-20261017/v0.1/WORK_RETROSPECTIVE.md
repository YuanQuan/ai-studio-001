# U04 表情边缘返工本轮复盘

- 周期：U04-EXPRESSION-EDGE-REVISION-20261017；用户退回证据 2026-10-17T07:13:13Z 至Producer收口 2026-10-17T07:50:33Z，UTC墙钟 37分20秒。该区间含Art制作、Tech诊断/核验、跨角色等待和流程登记，不能视为单人净制作耗时。各角色净工时及用户审批等待仍未知；Gate2用户审批尚未开始。
- 结果：Art v0.2具体资源已冻结进入USER_REVIEW，Tech内部DONE，Producer待Master内部接受。证据 `deliverables/master/U04-EXPRESSION-EDGE-REVISION-20261017/v0.1/GATE2_PACKAGE_IDENTITY.json`、`deliverables/producer/U04-EXPRESSION-EDGE-REVISION-20261017/v0.1/FLOW_REPORT.md` 与 `CONTINUITY_CHECK.json`。0次新增生成，旧v0.1保留；Client锁。
- 慢因：尚无可比时限基线，不能判定角色效率。可证实返工来自用户圈区暴露的AJ额发feature羽化与共享base下颊软化两种原因；两次额外眉软边试验被否决并停止，见Art `TRIAL_LOG.json`。局部修复和跨角色核验耗时无法独立拆分。
- 建议：Art在下一轮同类脸片制作前，把用户圈区映射为原生先验ROI并做代表样；代价为一次局部对照，复核点为下一批样张签认。Tech在下一批共享base变更时同时抽验该阶段所有态；代价为额外静态比对，复核点为下一次组检。Producer在下一次Gate2退回时继续将旧版本保留为历史链、单一新Task承接；代价为版本索引维护，复核点为下一次continuity。
