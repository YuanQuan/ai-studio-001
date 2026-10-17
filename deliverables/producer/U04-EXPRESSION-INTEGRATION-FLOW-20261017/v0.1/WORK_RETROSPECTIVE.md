# U04 v0.3 接入流程复盘

- 起点：用户批准记录 2026-10-17T08:50:51.219833Z。Client 与 Tech 的首产、v1 新构建、v1 IAB 4928 失败、一次 v2 隔离恢复、同版 IAB 最终通过，均有本轮 FLOW_REPORT.md、BUILD_CHECK.json、RUNTIME_VERIFICATION.json 与 Tech 文件可核。Producer收口2026-10-17T09:17:16Z，UTC墙钟26分25秒；各角色净制作时间未知；用户审核 Client 成果尚未开始。
- 可证实慢因是 v1 隔离快照缺既有 world 等四个 bundle 整理与 Scene 优化，造成静态构建完成但运行加载失败。Tech 核 31 个 TS 与成熟 stage 同 SHA、六组几何相同后，只做一次有证据的隔离 v2 恢复；旧失败证据保留。没有可比时限基线，不能以墙钟归责某角色。
- 建议：Client 下一次隔离构建前检查配置引用的全部 bundle 根目录，代价是一次静态清单检查，复核点为下一次新构建；Tech 下一次构建成功后以首个 IAB 加载请求核 bundle 输出，代价是一次运行冒烟，复核点为下一次 Web 接入；Producer 保留“构建完成、运行失败、恢复通过”三个独立节点，代价是记录维护，复核点为下一次连续性检查。

- 结果：Client准确v0.1 USER_REVIEW、Tech内部DONE、Producer待Master接受；最终Web证据和continuity分别见Master RUNTIME_VERIFICATION.json与本目录CONTINUITY_CHECK.json。用户审核等待尚未开始。
