# 本批第二次出图前修订签认｜左右方向可读性

任务 `UNIT-MENU-GHOST-ASSET-001`，v0.1 的修订签认 01；2026-10-03。首次导出有原始双签，完整源/图/哈希/时间见 `audit/round0/`。首次导出的 23 张帧各不相同、atlas 实际一页，但 `preview/contact_sheet.png` 中两向的脸部近似正面，**Art 自检不通过**，不能把仅能翻转技术上成立视为美术十格通过。因此本文件形成下一次正式图片输出前的新门禁，旧双签只覆盖首轮。

## 拟改范围（保持签认规格）

- 只在现有 `source/ghost_master.svg` 原创可编辑母版内，把脸与局部侧轮廓改为**轻微面向右的三分之四视角**：远眼变小并向鼻侧收拢、近眼较大、鼻点/笑口向画面右侧移动，近手与远手有前后差。左向仍仅镜像同一帧，不能增加第二套帧、文字、外部图或贴图道具。新增造型需先在 `preview/contact_sheet.png` 十格中明显辨识左右，同时仍是柔和、可爱的非恐怖小鬼。
- 板凳 SVG 和座点不变；角色逻辑画布 `160×192`、右向原画、五态 `6+6+3+3+5=23` 帧、`ghostFoot=(80,168)`、`seatContact=(80,146)` 不变。预览时长、透明 alpha、4px padding、`1024×1024` 候选一页 RGBA8、普通透明材质、Node/sharp/libvips 版本与工具许可不变。
- 变更后的脸/手和动作帧仍从同一 SVG 母版和脚本导出，不触及参考图像。若新 bbox 超出已签草排、最终页数变化、边界不净或源产生明显外观近似，停止导出并回 Art/Tech 重评。原有 `PREFLIGHT_PLAN.md` 的权利、支点、双座点/前后遮挡、内存/合批和目标设备 `NOT_TESTED` 边界继续适用。

## 审批顺序

1. `ART_PREFLIGHT_REV1.json` 对本修订先作 Art 签认。
2. Tech Lead 阅读本文件和 `audit/round0/`，在新文件 `TECH_PREFLIGHT_REV1.json` 对**第二次** SVG 修改与 PNG/GIF 导出作结论。旧 `TECH_PREFLIGHT.json` 不自动授权这次母版形体变更。
3. 双签后才修改正式 `source/ghost_master.svg` / 导出脚本并重出 23 帧、atlas、左右预览。更新哈希清单，保留首轮审计快照，出图后进行 Art/Tech 质量 Review。
