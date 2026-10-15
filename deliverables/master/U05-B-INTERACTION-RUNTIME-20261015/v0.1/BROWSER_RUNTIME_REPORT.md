# U05-B 新资源接入浏览器实测记录

本记录仅针对前端单元示例。Root 使用 Codex 内置浏览器访问隔离的 Creator 3.8.8 Web-Mobile 构建；不把 Art 的审核动画或代码状态测试当成实际游戏运行。

## 首次构建：8878（待短暂反馈文案修正）

- 构建身份：`deliverables/client/U05-B-INTERACTION-CLIENT-20261014/v0.2/evidence/BUILD_IDENTITY.json`。HTTP `http://127.0.0.1:8878/`，输出 `/private/tmp/u05-interaction-client-v02-output/web-mobile`。Creator 日志结束为 `Finished`，进程返回 36；旧 profile 迁移 TypeError 按 Client 原日志保留。内置浏览器实际打开页面并进入 U05。
- 用户输入实测：在画布菜单点「进入 U05」，选择简单并开始；点茶、奶、小料后，三项图片出现在台面，中央杯保持空白；点「确认」后，杯子出现并逐步合成。订单气泡显示缩小后的成品杯。第一次正确交杯，订单从 1/3 变为 2/3。
- 第二单故意换错奶并确认：订单仍为 2/3，杯子清空，原顾客和订单保留，可重新选择。重做正确后进入 3/3；第三杯正确后出现「三杯完成！」「本地示例熟练度 +10」及「再玩一局」「返回菜单」。点击「再玩一局」实际回到 1/3，入场中顾客位于窗口左侧，随后到中央。
- 浏览器错误/警告日志读取为空。选料、错单重做、正确完成和重试均为实际画布点击观察；没有注入游戏状态。截屏：[选料摆台与空杯](evidence/selected_8878.png)、[结算](evidence/finish_8878.png)、[重试入场](evidence/entry_8878.png)。
- 受限项：成功/失落表情短时相位、完整离场路径未逐帧抓取；五档和计时未在该浏览器轮逐档通关。当前画面底部的「正确，下一杯！」在进入下一单后仍残留，且对比度低。UI 规格仅要求短暂反馈，相应 Client 修正已启动，新构建须重新实测受影响路径。

## 后续验证门槛

## 修正构建：8879

- 构建身份：`deliverables/client/U05-B-INTERACTION-CLIENT-20261014/v0.3/evidence/BUILD_IDENTITY.json`。Client 只在正确/错误表现结束时清除临时状态文字，业务状态与动画时序不改；Creator 3.8.8 新隔离产物由 `http://127.0.0.1:8879/` 提供，没有覆盖首轮 8878。
- Root 在 Codex 内置浏览器设置 390×844 竖屏，刷新后进入 U05，点选茶、奶、小料并确认；订单由 1/3 变为 2/3，台面清空，下一单底部不再残留「正确，下一杯！」。实际截图：[竖屏画面](evidence/mobile_8879.png)、[下一单提示清除](evidence/next_order_cleared_8879.png)。竖屏整张 B 图按 contain 显示，画面上下有留白；这是当前已批适配规则，未将留白当作新缺陷。
- Root 随后以 790×950 可读视口另开同一 8879 构建。第一单明确显示「月雾茶／霜铃乳／鬼火珠」，故意选「幽灯茶／霜铃乳／鬼火珠」并点确认；表现结束后订单仍 1/3、杯清空、原顾客与目标保留，底部错误提示清除，可重新选料。[错单重做画面](evidence/wrong_cleared_8879.png)。此轮浏览器 error/warn 日志为空。
- 错杯后重新选对同一单并确认，连续画布截屏看到[合成起始](evidence/combine_start_8879.png)、[杯中成品](evidence/cup_composed_8879.png)、[眯眼过渡](evidence/face_squash_8879.png)、[开心表情](evidence/face_happy_8879.png)、[气泡收起](evidence/face_happy_bubble_hidden_8879.png)、[顾客位置变化](evidence/customer_moving_8879.png)与[下一单新顾客](evidence/next_customer_8879.png)。这可证成功表情的部分相位与下一单接续在实际游戏中出现；顾客走到画面边缘、下一位从边缘走到中心的完整轨迹仍未逐帧核实。
- 第二单故意交错后又连续截屏，实际看到[失落前的眯眼相位](evidence/face_wrong_squash_8879.png)、[失落脸](evidence/face_disappointed_8879.png)和[恢复原订单](evidence/wrong_recovery_8879.png)。随后点击「退出」并确认，实际看到[原位置](evidence/exit_start_8879.png)→[向左移动、被窗框裁切](evidence/exit_moving_left_8879.png)→[返回选档界面](evidence/exit_return_select_8879.png)。再次开始同档，看到顾客从[窗口左缘](evidence/entry_from_left_8879.png)经[窗内移动](evidence/entry_mid_8879.png)到[窗口中央](evidence/entry_at_window_8879.png)。这些离散截图支持进出移动及窗框遮挡，但不是每帧无缝性或实体设备验证。
- 8879 复测核受影响的短反馈及相关真实画布路径；完整三杯结算和重试在 8878 已实测，v0.3 未重复逐杯通关。正确交杯后的完整离场边缘轨迹未逐帧捕获，不能凭本报告单独宣称全部时序视觉通过。五档逐个通关、计时到零、实体设备、正式 QA 仍未做。

下一环节由 Tech 独立核资源、代码、构建与本浏览器证据，再向用户提交新版实际试玩审核。历史美术预算 FAIL 保持，不因运行复测而改写。
