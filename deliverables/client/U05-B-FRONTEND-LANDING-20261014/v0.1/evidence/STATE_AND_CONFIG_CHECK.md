# 状态与配置验证记录

日期：2026-10-14（Asia/Shanghai）  
任务：U05-B-FRONTEND-LANDING-20261014

| 检查项 | 结果 | 证据 |
|---|---|---|
| 生产配置生成 | PASS | `tooling/config/milk_tea_three_class_generator.py --mode production-filter` 使用批准源表与审批记录生成 12 原料、174 配方、10 阶段；输出散列 `9d46e76e6cf942cd513a8c5f35e5dfaafc6188146e767a5eeb1b31dbcce479dc`，与正式客户端配置一致。重跑输出在隔离临时目录 `/private/tmp/u05-b-client-build-20261014/config-verify2`。 |
| 源表数值一致性 | PASS | 生成器逐单元比较批准工作簿与正式源表；除已授权 `status`、`export_enabled` 状态晋升外，无业务字段差异。 |
| 配方和阶段 | PASS | 三类分别为 TEA 3、MILK 3、TOPPING 6；五档难度各两阶段；每档两阶段可用组合与各自开放池一致，总计 174 个唯一三元组。 |
| 阶段状态 | PASS | `milk_tea_state.ts` 保留既有进度字段；本局选料顺序按最近选择维护，撤销移除最近选项；成功杯、错误杯、新单和新局清空选择栈；计时到期、结算与重复结算保护已核。 |
| 状态逻辑样例 | PASS | 手动运行状态模块样例：进度归一化、阶段选择、同类别重新选择、顺序撤销、三杯通关、经验只结算一次、中等难度计时到期。 |
| TypeScript | PASS | Creator 随附 TypeScript 5.8.2 `tsc --project apps/client/tsconfig.json --noEmit --skipLibCheck --target ES2017`，无诊断。 |
| 批准资源散列 | PASS | 45 个保留 PNG、v0.2 标签底板及 719 字 BMFont 子集均按 Producer 精确 SHA 清单核对；字体可见字形检查排除合法换行/回车/制表符。 |
| Creator 资源打包 | PASS | 构建 `assets/resources/config.json` 含 `LABEL_PLATE_9SLICE`、`U05_ART_FONT` 和图集 SpriteFrame 资源路径/UUID。杯内容资源继续使用原始 trim SpriteFrame，并在杯层组件上关闭 Sprite trim，以原 183×233 画布定位。 |
| 实际浏览器游戏逻辑 | PASS（Master Owner 实测） | 在同一 8876 来源完成正常三杯通关、错配方反馈、最近选择撤销；刷新后 XP 10、通关 1/5 保持。截图：`browser-first-easy-win.jpg`、`browser-wrong-cup.jpg`、`browser-last-choice-undo.jpg`、`browser-final-persisted-progress.jpg`。 |
| 小屏与计时实际流程 | PASS（Master Owner 实测） | 360×640 噩梦第 2 阶段显示 3/3/6；配方帮助开启时倒计时仍从 90 降到 49 再到 0，失败后可重试恢复 90 秒；正确选料推进至第 2/3 杯。截图：`browser-final-small-nightmare.jpg`、`browser-final-small-recipe-running.jpg`、`browser-final-small-timed-correct.jpg`、`browser-final-small-timeout.jpg`。 |
| 最新帮助字级与限时状态 | PASS（Master Owner 实测） | 360×640 浏览器实测顶部配方字可读、到时失败、重试和正确单杯交付；v4 按 CSS 实际缩放将帮助正文设为至少14 CSS px、标题约12 CSS px，并在失败弹层显示“时间到，本局失败”。截图：`browser-final-small-readable-help.jpg`、`browser-final-small-exit-confirm.jpg`。 |
| 普通模式最终复核 | PASS（Master 实际浏览器报告） | v4 退出确认后选择不验证，返回菜单并重进 U05 不发奖励；经验仍10、通关仍1/5。最终工作台保留月雾茶、云魄乳、梦纹冻且未交付，验证模式关闭、阶段1、viewport已复原，warn/error 为空。证据：`deliverables/master/U05-B-FRONTEND-LANDING-20261014/v0.1/BROWSER_RUNTIME_REPORT.md`、`browser-v4-exit-no-reward.jpg`、`browser-v4-normal-persisted.jpg`、`browser-v4-final-workstation.jpg`。 |

所有体验检查均属单元示例 Owner 与 Master 的实际复核，不构成 QA Agent 的正式 QA 结论。Creator v4 产物 JS SHA256 为 `ce640e70c3c40b9c5cc26e95595a55cd9d7ef8288046638f638b4e9ba2588c9b`；构建身份与工作区 Gallery 后续差异见 `evidence/BUILD_IDENTITY.json`。该交付进入 USER_REVIEW，尚未由 Master 最终接受。
