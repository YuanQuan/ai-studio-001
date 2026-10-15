# U05 短反馈提示生命周期修正 v0.3

## 修正内容

Root 在 v0.2 的真实浏览器操作中观察到低对比度“正确，下一杯!”会残留到后续订单。按获批交互范围，仅在正确单或错误单的 presentation transaction 完成时清除临时状态文案并恢复默认文案颜色；没有改变 `milk_tea_state.ts`、判定时点、计时、奖励、事务阶段时长、顾客移动或资源。

修改前 `milk_tea_lab.ts` SHA256：`c462558edb5034de3ad56868091a0d4af7093e65102a88890df0bed4ba842068`（8878 已验证版本）；修改后 SHA256：`1e9228cd3b7925ba2c43cad12c23cf9c2da9ef07cef1f915ef31dbe4dc00b41c`。业务状态文件 SHA256 仍为 `bb981d662b8d334556b2418e7e837e787773742ae60aa2a2e31a539f2f43aea6`。新输出和服务分别使用 v0.3 隔离目录与 8879 端口，8878 历史构建保持不变。

## 检查状态

修改后 TypeScript 检查通过；编译产物 `assets/main/index.js` 已静态确认 `finishPresentation()` 对 `correct` 和 `wrong` 分支清空 `status` 并恢复默认颜色。Creator 3.8.8 独立 Web-Mobile 构建日志以 `build Task (web-mobile) Finished` 结束，进程退出码 36；产物 769 文件。8879 HTTP 服务返回 200，输出身份和日志记录于 `evidence/BUILD_IDENTITY.json`。

Root v0.2 首轮运行依据见 `deliverables/master/U05-B-INTERACTION-RUNTIME-20261015/v0.1/BROWSER_RUNTIME_REPORT.md`。修正后的 v0.3 已由 Root 在 Codex 内置浏览器实测：390×844 竖屏进入 U05 并选料、交杯，正确单从 1/3 推进到 2/3 后台面短提示清除，截图为 `deliverables/master/U05-B-INTERACTION-RUNTIME-20261015/v0.1/evidence/next_order_cleared_8879.png`；790×950 下以幽灯茶替换月雾茶提交错单后，进度仍为 1/3、杯清空且同客/目标保留，错误短提示清除并可重做，截图为 `deliverables/master/U05-B-INTERACTION-RUNTIME-20261015/v0.1/evidence/wrong_cleared_8879.png`。另有 `mobile_8879.png` 记录390竖屏。Root 报告浏览器 error/warn 日志均为空。该次验证覆盖本补丁的正确/错误提示生命周期；逐帧表情/完整离场、超时/退出、全部难度档通关仍未验证；本任务为单元示例 Owner 自检，不构成正式 QA。
