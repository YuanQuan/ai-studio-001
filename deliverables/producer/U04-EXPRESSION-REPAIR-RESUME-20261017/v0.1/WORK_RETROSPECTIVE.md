# U04 表情修正恢复执行流程复盘 v0.1

- 周期：`U04-EXPRESSION-REPAIR-RESUME-FLOW-20261017`，Producer本轮核录至 2026-10-17T14:27:08+08:00。Art准备账本起点 2026-10-17 12:07:41 +08:00；Gate2准确包送审登记 14:25:20 +08:00，墙钟 2:17:39。这是跨角色含工具、制作、专业核验与内部放行的历时，不能归为单个Owner净制作。用户实际Gate2等待自送审后开始，尚无用户决定；GPU时间与费用未知。
- 结果：Gate1 v0.2已批准，六样视觉13:20:34（72分53秒）和完整Art/Tech复签及Master扩批13:26:26（78分45秒）均低于90分钟cap。30唯一态、六PSD/三层切片/真实U00同尺度图实际生成；Master先写无标签答案后核映射30/30，Tech全30静态APPROVED，旧129 Client PNG+18原PSD+18批准原画共165件SHA保持。Gate2准确v0.1审核包经Master接受提交资格、Art三线USER_REVIEW，用户未批准、Client未正式导入。
- 预算：31张确认候选PNG＝30态＋AJ旧拒收1；总32/48调用＝main14＋MTAT8＋ADXJ10，其中旧MT UNKNOWN1，返修2/12；foundation生图0。不能把AJ旧退稿当作额外态，也不能把旧MT未知当作确认图。
- 可证实的过程偏差：MTAT前四次调用最初未作pre-call账本登记。Master随后仅从本Task session日志按完整输入与prompt、唯一call_id和候选SHA恢复四次可观察工具调用包络（`MTAT_TIME_RECOVERY.json` 与strict5 Review APPROVED），旧Unknown快照留存。包络不是GPU或服务内部处理时长；第5–8次已改为pre-call保守占额。此偏差未改变像素、计数或Gate2身份。
- 慢因判断：首六样符合既定90分钟cap，整批没有可比净工时基线，不给角色贴“慢”结论。较明确的等待/返工环节是旧MT首调用连接错误、AT遮罩灰缝的定向修复、旧层污染清理和AJ首候选被拒后的返修；各环节净耗时缺少独立计时，不能拆分为精确责任时长。CLI缺Key是未采用备选配置的历史状态，不是本轮内置路线的阻塞。
- 建议：MTAT Owner在下一次图像批次逐调用pre-call预占额并保存输入/prompt/结果唯一身份，Producer在下一批首次调用及第5次节点复核，代价为每次一次账本写入。Art Owner在局部mask候选进入PSD前先核同尺度边界与旧front/base污染，Tech在下一次六样门槛复核；代价为每态一次实图对照，可减少返工。Producer在Gate2用户决定后核批准版本SHA、计划Client路径转正式路径及真实UUID，复核点为正式导入前，避免旧UUID被误用。

- Producer最终内部收口：2026-10-17T14:29:48+08:00。自12:07:41起墙钟 2:22:07，包含Gate2送审后Master内部流程接受的等待/核录；Gate2送审本身为14:25:20（2小时17分39秒）。不能把后续等待或Git保存计为Art图像制作/GPU耗时。
