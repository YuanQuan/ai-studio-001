# U05-B v0.3 实际试玩待用户审核

请试玩 [隔离 Web 构建](http://127.0.0.1:8879/)，再决定是否接受这版选料、确认合成和顾客反馈。此链接对应 Creator 3.8.8 的 v0.3 独立产物；[构建身份](../../../client/U05-B-INTERACTION-CLIENT-20261014/v0.3/evidence/BUILD_IDENTITY.json)、[Client 交付](../../../client/U05-B-INTERACTION-CLIENT-20261014/v0.3/DELIVERABLE.json)、[浏览器实测记录](../../../master/U05-B-INTERACTION-RUNTIME-20261015/v0.1/BROWSER_RUNTIME_REPORT.md)和[独立技术评审](../../../tech_lead/U05-B-INTERACTION-RUNTIME-TECH-20261015/v0.1/REVIEW.json)已逐 SHA 锁在 `FRONTEND_V03_USER_REVIEW_HASHES.json`，审核范围为准确 v0.3。

实际画布已观察：三种原料先摆台面、点击「确认」后才合成；正确杯推进订单，错杯保留原顾客与目标并可重做；三杯结算和重试在前一 8878 构建实测。8879 修正后，正确/错误短提示在表现结束后清除；离散截图显示成功眯眼与开心脸、错杯失落脸、主动退出时左移与窗框裁切、重开后从左缘入场到中央。Tech 结论是 **可提交用户试玩审核**，不等于全部运行路径通过。

请特别留意正确交杯后顾客离场是否自然。正确交杯后的完整离场边缘轨迹、进出逐帧无缝、尚未捕获的表情相位、计时到零及五种难度逐个通关尚未完整实测；实体设备也未验证。Creator 构建日志为 Finished，但进程退出码 36 且有旧 profile 迁移 TypeError，均原样保留。美术资源首轮曾超 240 秒硬线约 16 秒，随后一次预检失败 152 秒，Art 预算仍为 **FAIL**，未追认合规。资源 Gate2 已批准，当前请求的是**试玩实现**的独立决定；此单元示例未设 QA 阶段。

若接受，请明确批准 U05-B v0.3 试玩实现；若需修改，请指出画面或操作的具体位置与目标效果。
