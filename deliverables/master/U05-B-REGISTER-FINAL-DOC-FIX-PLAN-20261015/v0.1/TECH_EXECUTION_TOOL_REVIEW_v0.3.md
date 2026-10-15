# 受控执行工具最终静态复核 v0.3

结论：**脚本静态审查通过，可作为待审批后的同批受控工具；当前不得执行 `--commit`。** 审过的原字节已复制到 `deliverables/tech_lead/U05-B-BUTTON-TEXT-ASSET-TECH-20261015/v0.1/u05_final_doc_fix_once.py`，源与归档 SHA-256 均为 `544495d1a022c71441404eff6ca94e72512141716862568801b164c122792828`。本轮未执行正式提交，Art 四文件和冻结资源未改。

dry-run 临时预览 SHA：CUT `a1250ac79911913d750310d9cd6918fc21eb9884b301d7631e1825631a0442e4`；ASSET `9ce9f560516571d199a7819942ca47bade4fbefd8ff25b80fb40a91f20b641a8`；LEDGER `1f1813d5c8dccacbe6d94495b741daa40741a616ebbfc06244288c7376a18151`；DELIVERABLE `04945efbaa2eb8ca92099d64627e5133288e551105bbf84faa28f15cb0dd4cb0`。预览保留首轮原顶层时间/累计，记首轮最终超时与失败轮152秒；新轮实际终点不伪造，仅列观察检查点和全轮240秒保守上界，FULL/总累计上界2196.148/6351.092。CUT/LEDGER 为 BLOCKED 待独立 Tech 终审；DELIVERABLE 预算 FAIL、Tech终审 NOT_TESTED、Gate2 PENDING。54运行PNG与FNT计划路径、4项null、55处Markdown路径一致。

先前两项必修已解决：账本把 precommit/postwrite 明确称检查点，实际全轮结束由 Producer 在脚本退出后的事件记录闭合；全轮先按240秒保守入账。逐件替换前计算真实待写 SHA，并为第二次账本替换追加独立阶段 SHA；异常回滚逐件写原 SHA、拟写 SHA、恢复 SHA 与结果。脚本核冻结映射与路径边界、58 PNG逐项SHA/尺寸/mode/alpha、FNT SHA/字节、完整现用deliverable schema；审批门禁绑定准确批准记录、三份方案即时 SHA、同批 Tech 放行和这份脚本原字节 SHA。

执行条件：用户须先批准最终方案，Producer 落 `USER_APPROVED` 及三文件 SHA，同批 Tech 预算签写明此脚本 SHA；Art 从自身真实事件取当轮 UTC 起点，确认余额及四原文档 SHA 后，只运行归档脚本**一次**。作业在240秒活动硬线前停止并留60秒交接；脚本最后一次硬线检查后仍有输出和临时审计写入，所以 Producer 必须用实际任务退出事件再次核完整活动，若越线则保持 BLOCKED，不得以 `COMMIT_COMPLETE` 追认。若替换/回滚失败，核临时 rollback audit 和正式四文件 SHA，不能报齐包。正式完成后 Tech 独立核登记、账本、冻结10件；Master仅在 Producer 记录历史违规及本轮实际时间后，连同资源证据呈用户作具体 Gate2。此静态 PASS 不等于预算合规、资源 Gate2 或 Client 接入。
