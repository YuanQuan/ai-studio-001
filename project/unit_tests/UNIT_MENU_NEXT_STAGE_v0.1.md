# 七项菜单单元样例：产品批准后的专业阶段

日期：2026-10-02。事实输入为已获用户批准的 `UNIT-MENU-PRODUCT-001 v0.1`、`DEC-UNIT-DIRECTION-003` 及已批准的孟桃奶茶店概念 v0.5。旧四份孟桃专业 v0.1 仍各自处于 `USER_REVIEW`，本阶段只把其中可参考的候选内容作为对照，不把它们当成已批准工程契约。

## 当前四条并行任务线

| Task | Owner | 本阶段真实交付 | 下一审批门禁 |
|---|---|---|---|
| `UNIT-MENU-TECH-DESIGN-001` | Tech Lead | 七入口 Scene/Prefab 与主体同源契约、平视镜像骨骼/座点/遮挡、Creator 审计、图集和性能计划 | 技术设计 `USER_REVIEW` |
| `UNIT-MENU-ART-DESIGN-001` | Art | 原创空背景、单方向幽灵与板凳、树花灯概念图；分层、清单、单页预检与版权记录 | 美术概念及出图预案 `USER_REVIEW` |
| `UNIT-MENU-UI-SPEC-001` | UI | 七入口及子项、共享身份 UI、孟桃演示对话、组件状态及可编辑样张 | UI 规格 `USER_REVIEW` |
| `UNIT-MENU-VFX-SPEC-001` | VFX | 奶茶店暖灯亮暗投影、树花灯及顾客状态反馈的触发、清理和降级 | 特效规格 `USER_REVIEW` |

以上四项可在已批准 Product 和 ART_GUIDE 下各自制作候选规格；必要的 Art/Tech 与 Art/UI/VFX 交叉评审在送用户审批前补齐。概念 PNG、SVG 和尺寸草排均须标明候选状态，不能冒充可集成骨骼、atlas 或运行效果。

## 后续依赖

四专业正式 Artifact 各自经用户批准后，Master 再编排原创可编辑分层/骨骼与图集生产、Client `FEATURE_BRIEF.md` 与 QA `TEST_PLAN.md` 开工包。正式图片每次输出前 Art 与 Tech Lead 联合签认来源许可、图像尺寸、包围盒、单页排布、合批及目标机预算；随后才可实施 Creator 七入口和动态组合。Client 实现、技术评审、用户确认、QA 执行及用户确认仍分别过门禁。

## 已锁定的方向与可核验边界

幽灵顾客以一个方向的原创骨骼图像为源，水平翻转得到另一向。左右 × 移动、跑动、高兴、沮丧、坐姿为 10 个运行验收格，不是 10 套新图。文字和通用 UI 保持非镜像同源节点；若确需另一朝向新绘附件，必须显式变更并获用户批准。店铺与孟桃仍为实际单视角。空背景与所有可切换对象分离；组合场景复用第 1 项底板与第 2—4 项正式对象，不导出一张合成图充数。

## v0.1 提交用户审阅的实际版本

四项专业规格与概念均完成各自 Task 的 Required Artifact、五项验收及专业/Master Review，目前状态均为 `USER_REVIEW`，尚未获得用户批准：

| 项目 | 可审阅入口 | 本次明确选择 / 风险 |
|---|---|---|
| 技术 | [TECH_DESIGN](../../deliverables/tech_lead/UNIT-MENU-TECH-DESIGN-001/v0.1/TECH_DESIGN.md) | 提议一个物理Creator工程，按背景/店/角色/树花灯等独立Prefab与Lab Scene并行编辑；组合与未来主体引用同源UUID。现有720×1280画布上的镜头边界与目标设备性能待实测。 |
| 美术 | [ART_BRIEF](../../deliverables/art/UNIT-MENU-ART-DESIGN-001/v0.1/ART_BRIEF.md) | 三张新概念分别为空底板、单原向幽灵/板凳、可切换树花灯；固定远景可能被读成林影，需在真实开关画面复查。祈愿纸船与蜡烛保留为后续独立河面装饰意图，不烘入空底板。 |
| UI | [UI_SPEC](../../deliverables/ui/UNIT-MENU-UI-SPEC-001/v0.1/UI_SPEC.md) | 三张可编辑SVG表达菜单、组合/对话及共用控件；组合样张的树木、花草、灯笼已分别控制。字体文件许可与实机可读性未通过。 |
| VFX | [VFX_SPEC](../../deliverables/vfx/UNIT-MENU-VFX-SPEC-001/v0.1/VFX_SPEC.md) | 店灯亮部与邻近暗部/投影成对变化、元素效果随对象退出、幽灵情绪不加新奖励粒子；时序和降级是候选，未有运行效果/性能证据。 |

本版审阅批准只会解锁下一阶段正式分层/骨骼/图集和Client/QA开工包编排，不等于七项Creator单元已经完成。生产前每张图仍按已列Art/Tech双签字段复核真实来源、许可、尺寸、单页排布和合批。
