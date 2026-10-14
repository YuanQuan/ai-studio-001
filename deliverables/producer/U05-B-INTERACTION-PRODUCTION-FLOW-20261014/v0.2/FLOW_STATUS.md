# U05交互生产流程 v0.2：PATCH-03唯一尝试

- 用户明确“批准局部复用方案，继续制作”（call_01a42e43225643eeb88ca0decf09d1a5），Producer 2026-10-14 16:47:44 +08:00登记；原消息精确秒未知。原三待审文件逐SHA仍一致；`APPROVED_PLAN_HASHES.json`登记准确批准与方法身份。v0.1生产FLOW和三次失败历史均不覆盖。
- 准许一次PATCH-03：以MANUAL-01工作静底为底，仅在三个已审背景片区把同源donor RGB8按原坐标回贴，只改STATIC_BARE；同问题额外唯一轮次2→3。可见片区内自然材质和潜在接缝风险由用户批准方案承接，但实图仍必须检查；失败按原停止线停，不外扩、不自动改走GEN-03。
- 代表/FULL制作活动预算调整为65/10分钟，总75分钟累计上限不变；旧REP-01/REP-02/MANUAL-01用量不重置，imagegen历史仍0/3。Master `deliverables/master/U05-B-INTERACTION-PRODUCTION-20261014/v0.1/BUDGET_ACTIVITY_BOUND.json`用Art自身 task_started/task_complete 元数据核得五个完整turn保守活动上界3525.352秒（含turn内等待、诊断和文档），当前turn始于2026-10-14T08:48:56.216Z，代表上限3900秒、FULL上限600秒。turn间停工与用户等待不计；净活动真实值仍UNKNOWN。当前turn上界随运行增长，Art/Tech须以实时时钟复核余额和候选加视觉检查的可完成时限，越界即停，不把旧05:51–06:46 UTC整段日历墙钟当活动。
- Art/资产Tech同批 `PATCH-03` 方法预签与Tech 120秒硬停止预算放行实存。Art唯一样张 `deliverables/art/U05-B-INTERACTION-ASSETS-20261014/v0.1/exports/STATIC_BARE_PATCH03.png` SHA256 `3c70ed0096fcac5d649117eb57328a2ee116f44a0a554a5063450299624845b6`：`PATCH03_METRICS.json`证实三框外改动0像素、框内与donor差异0像素；Art Owner在实图看见框外旧杯沿与杯身底缘残线，判REVISE/STOP，Tech `PATCH03_TECH_RESULT.json`登记BLOCKED_REVISE_STOP。像素边界正确不等于视觉合格。
- Art报告制作及检查区间2026-10-14 08:57:54–09:00:03 UTC，约129秒，超过Tech已签120秒硬线约9秒；如实记超限，不追认或悄然放宽。唯一PATCH-03候选已耗尽，不扩框、不补第二张、不改走GEN-03。无代表PASS、FULL复签、正式PSD/全套切片/GIF、Gate2或新运行；Art/资产Tech/Client均BLOCKED，旧Web8876不变。
- Continuity：已授权唯一候选确已制作且失败；现有批准方法与原三文件SHA保持历史有效，但不能凭方案批准放行失败资源。下一步完整旧杯区域替换仅为Master拟议的新待决方向，未获用户决定前不制作；本轮无可继续的已授权候选。
