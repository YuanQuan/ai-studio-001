# U05 B 实际浏览器验收记录

记录时间：2026-10-14 11:57（Asia/Shanghai）。执行者：Master；单元示例 Owner 联合复核，无 QA Agent。

## 当前可复核版本

- URL：http://127.0.0.1:8876/，Creator 3.8.8 实际 Web Mobile 产物；入口为单元示例 U05。
- v4 构建完成：2026-10-14 11:46:14 +08:00。真实路径及源文件 SHA 见 Client `evidence/BUILD_IDENTITY.json`。
- `assets/main/index.js` SHA256：`ce640e70c3c40b9c5cc26e95595a55cd9d7ef8288046638f638b4e9ba2588c9b`。
- Master 核对当前四份 U05 脚本、配置、九宫格底板、字图/FNT/OFL 均与 v4 构建输入一致。Gallery 当前工作文件存在另一线程后续变更，不能宣称整仓库与隔离构建一致；本次未修改或提交 Gallery。
- 首轮错误杯形构建保留为历史失败证据，最终杯内容使用原始 183×233 透明画布，关闭 Sprite 自动 trim，实际两杯内容位置一致。

## 实际操作与结果

| 检查 | 结果 | 实际证据 |
|---|---|---|
| 简单档逐单完成三杯 | PASS | `browser-first-easy-win.jpg`：完成三杯，获得10熟练度 |
| 错配不计完成并清空杯、可重做 | PASS | `browser-wrong-cup.jpg`，仍为1/3 |
| 撤销最后一次有效选择 | PASS | `browser-last-choice-undo.jpg`：茶被撤销，奶与小料保留 |
| 刷新后保存正常进度 | PASS | v4 `browser-v4-normal-persisted.jpg`：熟练度10，已通关1/5；仅简单解锁 |
| 噩梦第二阶段3茶/3奶/6小料 | PASS | `browser-final-small-nightmare.jpg`，360×640实际浏览器 |
| 查看配方计时继续 | PASS | `browser-final-small-recipe-running.jpg`；不暂停倒计时 |
| 时间耗尽失败、重试重新计时 | PASS | `browser-final-small-timeout.jpg`；重试回到90秒 |
| 小屏选择与正确交付 | PASS | `browser-final-small-timed-correct.jpg`：正确交付至2/3 |
| v4小屏帮助字可读、退出入口可用 | PASS | `browser-final-small-readable-help.jpg`、`browser-final-small-exit-confirm.jpg` |
| 普通模式中途退出不给经验 | PASS | v4真实退出→本局结束→返回菜单→U05，`browser-v4-exit-no-reward.jpg`：仍10熟练度、1/5 |
| 实际标签/艺术字/确认按钮/成品气泡 | PASS | v4 `browser-v4-final-workstation.jpg`：共用细边框小圆角底板，气泡只含成品杯，按钮“确认” |

截图统一位于 `deliverables/client/U05-B-FRONTEND-LANDING-20261014/v0.1/evidence/`。前期操作证据分别来自显示修订前 v2/v3；最终 v4 只调整帮助显示与失败标题，状态文件 SHA 始终为 `bb981d662b8d334556b2418e7e837e787773742ae60aa2a2e31a539f2f43aea6`。不得将历史失败或旧帮助字号截图当最终视觉结果。

## 交付状态与边界

临时小屏 viewport 已 reset。验证模式关闭，阶段回到1；当前保留正常简单档工作台供用户试玩，已选择与订单一致的月雾茶、云魄乳、梦纹冻，尚未确认该杯。正式进度未被验证存档污染。最后读取当前页 warn/error 日志返回空数组。

本次纯前端；配置静态检查和状态检查见 Client 记录。没有宣称实体手机触控、原生包、后台服务、长期性能或正式 QA 通过。高级难度通过显式隔离验证模式检查，正常解锁保持成长门槛。最终实现包进入 USER_REVIEW；资源底板 v0.2 已批并不替代最终实现接受。
