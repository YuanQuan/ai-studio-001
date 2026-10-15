# U05登记四文档受控修正关键节点 v1.0

- `FINAL_DOC_FIX_PLAN_USER_APPROVED`（Producer 2026-10-15T07:01:27Z登记，用户消息精确秒未知）：三冻结SHA逐件匹配、旧USER_REVIEW快照保留，方案Task DONE。仅允许签名脚本核后一次修四文档，冻结10件视觉；代表70/FULL39/总109分钟累计，旧超时16秒及152秒预检失败留痕，新活动240秒硬停+60秒交接。
- `FINAL_DOC_FIX_FLOW_STARTED`：Producer v1.0三Required首产、Task IN_PROGRESS；新Art Task READY待同批补签和首产。原四文档仍有路径及超时漏报，具体资源Gate2/Client导入未发生。
- `FINAL_DOC_FIX_ONCE_COMMIT_COMPLETE`：Tech同批预算签实存；Art唯一签名脚本一次--commit退出码0，退出检查点07:06:00.078646 UTC，完整活动07:05:22–07:06:06 UTC保守44秒<240秒硬线。四正式SHA与run_exit_audit一致，冻结10件报告零改；账本保守240秒上界与实际44秒分别保留，原16秒超限/152秒失败未追认。Art Task REVIEW，Tech独立终审待产，Gate2/Client仍锁。
- `ACTUAL_RESOURCE_V03_GATE2_USER_REVIEW`：Tech终审REVIEW.json APPROVED for Gate2，静态身份/路径/格式通过、历史预算FAIL仍随包呈报。Producer `GATE2_FROZEN_HASHES.json`锁72实际文件路径/SHA，审计SHA ff1d60b0…04090d5；原Art v0.3 Task与审批USER_REVIEW，用户具体资源尚未批准，Client仍锁。
