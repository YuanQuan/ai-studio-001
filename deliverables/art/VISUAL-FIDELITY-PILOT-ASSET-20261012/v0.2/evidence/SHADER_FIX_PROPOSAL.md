# 灯笼 Effect 最小修正提案

状态：`PROPOSAL_ONLY_NOT_APPLIED_NOT_VALIDATED`

记录时间：2026-10-12 21:07:41 +08:00  
目标文件：`apps/client/assets/labs/lantern-pilot-v02/lantern_lighting.effect`  
原文件 SHA-256：`ba0dbf42329a025d38831440ef667c337b27543862c92fbb2d1d1cf64a105069`

## 依据与建议

现有 Creator 3.8.8 Editor 错误记录为 `EFX2209: Block declarations must be semicolon-terminated, non-array-typed and instance-name-free`。原 Effect 的常量块声明为 `uniform Constant { float strength; } cc_lantern;`，并在唯一读取处使用 `cc_lantern.strength`。本机同版引擎随附的 `default_file_content/effect/default.effect` 展示 `uniform Constant { vec4 mainColor; };` 后直接以 `mainColor` 访问成员。这仅为源码语法依据；没有证明本 Effect 能编译或运行。

建议仅做两处联动文本调整：移除 `Constant` 块实例名，保留块结尾分号；唯一成员访问由 `cc_lantern.strength` 改为 `strength`。补丁见同目录 `SHADER_FIX_PROPOSAL.patch`。

## 范围与门禁

`EXECUTION_LEDGER.json` 记录 `cumulative_correction_rounds=2`，上限为 2；Art 预览和 Client 实现各计 1 轮。若应用本提案，它将是累计第 3 轮修正，不能按缺陷或新任务清零。**本提案不构成预算例外授权，当前上限仍为 2/2。**只有用户明确授权针对本补丁的一次性 +1 修正预算例外后，Master 才记录该授权并组织受影响 Art/Tech 完成预签续签；Producer 随后更新执行账本。不得借此扩展 mask、图像、曲线、效果范围或任何硬指标；该一次额度不含自动重试许可。

本提案及补丁不改变源码、批准画面、任务状态、预签、账本或共享日志。未执行 Creator 导入、Effect 编译、构建、运行或视觉/性能验证；所有这些结果仍为 `NOT_TESTED`，不得据此宣称 `PASS`。只有获得所需续批并由授权执行者实际验证后，才能报告对应结果。

## 本轮记录

- 2026-10-12 21:07:27 +08:00：记录原 Effect SHA-256，与既有 `SHADER_COMPILE_DIAGNOSIS.md` 中哈希一致。
- 2026-10-12 21:07:41 +08:00：核对本机 Creator 3.8.8 内置 `default.effect` 的无实例名常量块写法；仅读取引擎文件。
- 2026-10-12 21:07:41 +08:00：提案撰写起始时间。本轮不计入资源制作墙钟，也不增加修正轮次。

必要复核：写入后核对补丁只含上述两处改动、以 `git apply --check` 只读检查其对当前原文件的可应用性，并重新读取原文件 SHA 确认源码未变。以上均不运行 Creator 或构建。

实际文件完成记录时间：2026-10-12 21:09:39 +08:00（随后执行最终只读复核）。
