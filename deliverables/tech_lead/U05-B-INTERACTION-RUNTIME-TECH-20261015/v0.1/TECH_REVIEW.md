# U05-B 新资源接入与真实运行技术评审 v0.1

**结论：可提交用户实际试玩审核，但不能表述为完整交互运行验收通过。** 已有同一真实 Web 构建的进入、选料、确认、错单重做及短提示清理证据；8879 的连续截屏已显示成功后的眯眼过渡、开心表情、气泡收起、顾客位置变化与下一单新顾客；8879新增截屏还显示错杯后的失落脸、主动退出向左移动并被窗框裁切、返回选档，以及重开从左缘到中央的入场片段。用户试玩仍应检查正确交杯后的完整离场、连续无缝性、计时到零和其余难度。若这次用户审核被定义为“所有已批交互已验证”，目前证据不足，应先补这些实际运行检查。此结论是单元示例技术评审，不代替正式 QA。

## 资源与构建身份

Gate2 v0.3 审批 `USER_APPROVED`；历史 Art 预算 `FAIL_HISTORICAL_VIOLATION_NOT_WAIVED` 保留。旧已导入45张资源逐项核本地 SHA、Creator meta UUID 与 v0.3 Web `assets/resources/config.json`，45/45 匹配；新增9张 PNG 的源与 Client 文件 SHA、meta UUID、bundle UUID 9/9 匹配；BMFont `.fnt` SHA `14f9073139b14aa4b46a389d934dc93f7581804721c881b882995c1ca6101af1` 且 UUID 在 bundle。此处55项=45旧资源＋9新PNG＋1 FNT；字体 atlas PNG、许可文件另随旧已批资源保留，不能将55误称全部艺术文件总数。资源路径实际在 `apps/client/assets/resources/u05_milk_tea/u05_b/`，UUID是已导入实值而非 Art 清单计划值。新脸和身体 `trim=false` 接口在代码中；视觉完整边缘仍需真实动态检查。

v0.3 当前 `milk_tea_lab.ts`、`milk_tea_state.ts`、`u05_interaction_presentation.ts` SHA 与 Client BUILD_IDENTITY 相符；编译的 `assets/main/index.js` SHA 匹配隔离输出。Creator 3.8.8 Web-Mobile 输出769文件，HTTP 8879 返回200并被浏览器实际打开。构建日志末尾 `build Task (web-mobile) Finished`，但进程退出**36**且旧 profile 迁移有 `TypeError: Cannot convert undefined or null to object`；因此只判“产物存在且本轮Web可运行”，不判零退出码干净构建，也不推论其他平台可构建。8878旧输出未覆盖。

## 交互事务与实测边界

静态代码核：`submit()` 在点击确认时取不可变快照并调用业务 `submitCup` 一次；表现由独立 transaction/epoch 驱动，`shouldLockInput` 阻止表现期间重复提交，状态文件 SHA 未变。选料时三项在台面，确认后才绘工作杯；目标气泡缩小杯；正确或错误事务结束清临时文案。计时从开始持续，非胜利事务在截止时可被超时事务打断；胜利结果不因表现延时反判失败。退出事务从当前顾客 X 延续离场。静态采样定义脸部 squash/blink/expand/happy 或 disappointed、顾客左侧 -72 至停靠 309 的完整行程；这证明实现时序，**不证明浏览器每一帧的视觉效果**。存档、奖励和判定业务文件未改。

Root 在内置浏览器实际点击 8878：选料台面/空杯、确认合成、正确推进、错单保持原顾客原单重做、三杯结算与重试入场；截图为 `selected_8878.png`、`finish_8878.png`、`entry_8878.png`。8878 有短提示残留。v0.3 8879 在390×844正确单推进1/3→2/3后提示清除；790×950故意错杯后仍1/3、杯清空、同客同目标并可重做，提示清除；对应 `next_order_cleared_8879.png`、`wrong_cleared_8879.png`。Root 追加连续画布截屏 `combine_start_8879.png`、`face_squash_8879.png`、`face_happy_8879.png`、`face_happy_bubble_hidden_8879.png`、`customer_moving_8879.png`、`next_customer_8879.png`：成功反馈的眯眼与开心表情、气泡收起、位置变化及下一单接续在实际游戏中可见；这些离散帧不证明完整边缘到停靠轨迹。其后错杯有 `face_wrong_squash_8879.png`、`face_disappointed_8879.png`、`wrong_recovery_8879.png`，支持失落前眯眼与失落脸及回原订单。主动退出的 `exit_start_8879.png`、`exit_moving_left_8879.png`、`exit_return_select_8879.png` 支持人物向左移动、窗框裁切和返回选档；重开 `entry_from_left_8879.png`、`entry_mid_8879.png`、`entry_at_window_8879.png` 支持从左缘经窗内到中央。离散帧不证明逐帧无缝。Root 报浏览器 error/warn 为空；所见截图与报告相符。v0.3 未重复完整三杯通关；跨版沿用8878的三杯证据，仅因v0.3变更局限于提示清理且状态/表现文件SHA未变，作为有范围的回归证据。

**未测**：正确交杯后的完整离场边缘轨迹、进出逐帧无缝性、失落/成功表情未捕获的其余相位、计时到零、所有难度逐档通关、实体设备和目标平台。成功与失落表情各有可见片段，主动退出/重开入场有离散位置与窗框裁切证据；正确交杯完整离场与所有相位仍无连续完整证据，故不可将整项标 PASS。提交用户试玩前，应在呈报中列为明确体验核点；如用户反馈缺陷，退回 Client 定点修复并重建实测。历史美术预算 FAIL 不因这次运行结论变成 PASS。
