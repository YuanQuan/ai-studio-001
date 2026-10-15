# 登记纠正脚本失败：只读技术诊断

结论：脚本未改四份正式文档或冻结视觉文件；本轮已依“一次失败即停”停止，**不可直接重跑**。本报告仅审实际脚本和输入，不执行脚本、不补写 Art 文件。

1. **直接失败原因**：`FROZEN_INPUTS.json.files` 是 `{相对 v0.3 路径: {sha256, bytes}}` 映射，脚本 `for item in files` 取得的是路径字符串，随后 `item['path']` 必然 TypeError。最小代码修正是 `for name, expected in files.items(): path = BASE / name`，再核 `expected['sha256']` 和 `expected['bytes']`。应先只读检查映射类型、键数与相对路径限制（不得 `..` 逸出 v0.3），再检查文件实际 SHA/字节。
2. **修完仍会遇到的确定性问题**：`START` 固定为 `2026-10-15T06:01:38Z`，新一次执行到末尾的 `(now-START)<240` 必然失败。新的执行须用该次真实开始事件初始化计时，不能沿用已失败轮的时间或把这152秒抹去。当前 `ASSET_MANIFEST.md` 旧前缀出现55次、CUT运行PNG54项+FNT1项，与脚本计数吻合；DELIVERABLE第一项目前PASS、末项NOT_TESTED，ledger precommit180.281，均与脚本旧输入断言吻合。
3. **执行前应补的检查**：四份当前输入字节哈希固定为 CUT `6bcbec86536d72940e0bf3c76d8dd8d53c86d5279fa0b78512557dc9e5a593d9`、ASSET `9a7d6f7844ff13a952081f4ab65b071f5c3814cab6750b1ccfc06c8491da57ce`、LEDGER `88e4de97f029a570b9f55f85eb2dd8400ca18e153c3bb6631f91ad9ef8949eac`、DELIVERABLE `19d3cd9b170d1c53b0d05c173cb906faeecf97895b5bd1a6b759fe9866b2919`。临时只读预检先核这四 SHA、冻结10件、55旧前缀、54运行PNG/2历史/2 PSD专用、FNT实际文件名、DELIVERABLE schema 和计划输出目标；仅语法检查不足以发现映射类型错误。`verify()` 当前主要核路径/数量与部分账本字段，未核四份文档之间的所有引用和 schema；正式提交前应另做完整预检。
4. **提交/回滚风险**：`os.replace` 对单文件原子，但四文件并非整体事务。脚本 catch 中逐件 `write_bytes(old)`，若回滚本身失败会留混合版本；须记录每份提交前 SHA 与逐份替换/回滚结果，失败保持 BLOCKED，不宣告齐包。账本在临时阶段写 `correction_activity_precommit_end_utc`，实际执行后续自核/交接时间仍可能未入账；最终须以事件闭合记录保守全轮时长，避免重复上一轮只记 precommit 的缺口。原上一轮超时须保留 FAIL，不因新限额追认。

**预算**：新限 FULL2160、总6360秒；签前旧用上界1804.148/5959.092秒。本次失败 06:01:38–06:04:10 UTC 约152秒保守全计后，FULL 余额约 `203.852` 秒、总余额约 `248.908` 秒，FULL绑定。原放行的240秒活动硬线虽未触及，但“一次失败即停”已触发；且当前余额不足再次提供240秒活动+60秒交接。最小安全后续是 Master/Producer 先确定新一轮文档纠正授权与可核预算；Art在**不写正式文件**的静态预检中修映射与新轮时钟，审上列断言/身份与回滚，核时间余额，再做最多一次有限提交。若未获得新的执行授权，只能停在现有四文件 BLOCKED，Gate2 与 Client 接入继续等待。
