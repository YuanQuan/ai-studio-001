# Tech Lead 技术评审

任务：`VISUAL-FIDELITY-COMPUTE-20261012`；候选版本：v0.1；结论：`APPROVED`。

规范把冻结图、PSD 整体导出、真实切片重组和引擎画面分开验收；承认透明度、色彩与复杂混合的限制，不把平面图拆层等同于恢复原生编辑能力。序列帧、骨骼动画均要求可追溯源、代表动作与运行兼容验证。增量缓存、同问题累计两轮修正、预算上限与未知调用的保守处理具备人工执行路径。

前次两项建议均已落实：规则 §3.3 与模板固定比较配置、色彩及 alpha 归一条件；规则 §7 与模板保留工具返回的请求 ID 和可用幂等键，未知结果无法查询时停止重复提交。候选文本保留 Gate1/Gate2、自行切图直接交用户审核及适用 QA，未宣称工具已实装或节省比例已验证。

本次核对的 SHA-256：`rules/visual_fidelity_compute_contract.md` 为 `ce99d03f4f0a79812d9b711e655d2412658c3f46bdef2f88aad6e86513d32b9d`；`agents/art/VISUAL_FIDELITY_PACKET_TEMPLATE.md` 为 `7ca4f438cf95e81c254557eae7e92e90315091c1e5ecbccabe02907c9c578a9c`。
