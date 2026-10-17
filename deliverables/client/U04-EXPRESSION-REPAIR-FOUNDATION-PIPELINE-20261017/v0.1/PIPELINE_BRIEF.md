# 旧表情底层清理支持工具 Brief

## 目标与范围

此工具仅消费 Art 已落地的局部 RGBA mask、源 ROI、同源肤色采样点及可选获批原画恢复来源，生成隔离 review 目录中的派生 base/front 和像素核对报告。它不选择清理区域、不生成表情、不挪动五官、不改变源文件，也不接入 `apps/client`。

## 确定性处理

- `base_repair`：按 Art 列出的当前 base 肤色点执行 IDW（距离平方反比），用 mask alpha 混合 RGB，保留现 base alpha。样点必须在 base_repair alpha 为 0 的位置。
- 可选 `hair_recovery`：仅按 Art 提供的获批原画 SHA、同绝对源坐标 ROI 与局部 mask，把原画 RGB 在 mask 内按 alpha 混回；保留 current base alpha。定义含有 `operation_order` 时，工具报告并执行样点修补后再发丝恢复。
- `front_erase`：按 Art 已定稿 mask 仅擦除 front alpha，原 RGB 保持不变；工具不再扣减保护 mask。`protect_review` 只计交叠供人工复核。
- 可选 `approved_optics_transfer_binding`：只验 SHA、尺寸并核对 Art 已重组的 256 ROI front 与完整 front 输入完全一致；不自行搬运、重绘或编辑镜圈。

## 检查边界

每次报告绑定定义、源层、局部 mask、样点、输出哈希、改动像素计数及 alpha/RGB 约束。base 允许改变范围为 Art base_repair 与 hair_recovery mask 的并集；front 允许改变范围为 Art front_erase mask；完整源 ROI 以外必须 RGBA 零差。输入/几何验证先于输出创建，结果写入同父目录临时文件夹，仅完整成功后原子改名；输出路径已存在时拒绝。

## 本轮结果

AC v04 实际工具候选位于 `review/AC_S0_foundation_cleanup_02/`；Art v04 是 `DRAFT_FOR_TOOL_PREVIEW`，故该图只用于工具审查。旧 AC v02 的 `cleanup_01` 已由 Art 明确拒绝，作为诊断记录保留，不能当作可用清理。AD v02 与 XJ v02 均实跑，XJ 的 approved-optics front ROI 与 Art 绑定 prototype RGBA 零差。所有工具视觉字段都是 `NOT_DECIDED_BY_TOOL`；未形成审美 PASS。MT 撤回定义未执行，AJ 与原生 192 导出未在本 Task 验证；本轮生图调用为 0。详见 `PIPELINE_CHECK.json`。
