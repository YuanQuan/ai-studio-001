# U05资源登记定点纠正关键节点 v0.9

- `REGISTER_CORRECTION_PLAN_USER_APPROVED`（Producer 2026-10-15T05:59:52Z登记，用户消息精确秒未知）：三冻结SHA逐件匹配，旧USER_REVIEW快照留存，方案Task DONE。只改四文档的计划路径、最终超时账本/交付；冻结10件，代表70/FULL36/总106分钟累计，旧活动不清零，新活动240秒硬停+60秒交接。原约16秒超时不追认。
- `REGISTER_CORRECTION_FLOW_STARTED`：Producer v0.9三Required首产、Task IN_PROGRESS；新Art Task READY待Art/Tech同批补签及实际首产。原四文档仍为Tech BLOCKED版本；具体资源Gate2及Client导入未发生。
- `REGISTER_CORRECTION_PREFLIGHT_FAILED_STOP`：Tech同批预算补签实存；Art06:01:38–06:04:10 UTC约152秒唯一纠正预检误读FROZEN_INPUTS.files映射类型而失败，正式四文档写入前即停，原四文档/冻结10件未改。新Art/AssetTech/Client BLOCKED，目录及超时记录仍错，Tech原BLOCKED终审有效；Gate2未送。
