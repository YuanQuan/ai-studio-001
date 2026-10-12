# 灯笼 Effect 编译错误诊断

只读核查时刻：2026-10-12 21:05:08 +08:00。Master 从当前原生 Creator 3.8.8 Editor 无障碍界面报告 `EFX2209: Block declarations must be semicolon-terminated, non-array-typed and instance-name-free`；本文件据该现场报错与磁盘 Effect、同版内置引擎 Effect 交叉判断。我未启动构建或改实现，现场错误尚无本批独立构建日志可绑定。

当前 `apps/client/assets/labs/lantern-pilot-v02/lantern_lighting.effect` SHA-256 为 `ba0dbf42329a025d38831440ef667c337b27543862c92fbb2d1d1cf64a105069`。其片元段第 59–62 行为：

```glsl
uniform Constant {
  float strength;
} cc_lantern;
```

第 69 行以 `cc_lantern.strength` 读取。块末已有分号，成员是标量；与错误中“instance-name-free”直接相符的是块结束后的实例名 `cc_lantern`。本机同版引擎 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/editor/assets/effects/builtin-unlit.effect` 第 179–182 行使用 `uniform Constant { ... };`，后续直接引用成员；`internal/editor/terrain-select-brush.effect` 第 29 行附近亦有 `float` 块成员。故最小候选修正为删除 `cc_lantern` 实例名，保留 `};`，并把唯一读取改为裸成员 `strength`：

```glsl
uniform Constant {
  float strength;
};
// 原 cc_lantern.strength 处改为 strength
```

这只处理所见 EFX2209；不能预判下一轮 Effect 导入、采样/alpha 或运行通过。既有 Creator 启动环境诊断仍说明先前 CLI 两次失败，但当前 Editor 已给出更近的实际编译阻塞，不能继续把“完全无法进入 Creator”作为唯一理由。Creator 编译、构建与全部运行/性能项目仍未通过。

预算边界：同批 `preflight/TECH_PRESIGN.json` 的 `production_budget.cumulative_correction_rounds_max=2`，`EXECUTION_LEDGER.json` 已记累计 `2/2`（Art 预览 1、Client 实现 1）。这次 Shader 源码修正将是新的修正轮次，**不能**以“每个缺陷另算”或新任务重置；须经用户明确授权该预算例外后，由 Master 记录并组织受影响同批 Art/Tech 预签及执行账本续签。例外只针对上述最小修正，不能顺带改 mask、源图、曲线、其他效果或放宽运行指标。本诊断不代替例外记录及续签。
