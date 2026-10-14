# U05 交互事务代码与状态检查

日期：2026-10-14（Asia/Shanghai）  
任务：U05-B-INTERACTION-CLIENT-20261014  
阶段：独立代码/状态检查完成；等待新 Art 资源 Gate2 与后续构建授权。未做 Creator 新构建或新版本试玩。

## 检查结果

| 检查项 | 结果 | 证据 |
|---|---|---|
| TypeScript 项目检查 | PASS | Creator 3.8.8 随附 TypeScript 5.8.2 对 apps/client/tsconfig.json 执行 --noEmit --skipLibCheck --target ES2017，无诊断。 |
| 事务状态纯逻辑检查 | PASS | evidence/STATE_CHECK_TEST.cjs 编译并运行 u05_interaction_presentation.ts，通过不可变快照、首次顾客入场、正确/错杯阶段、脸状态节奏采样、完整 mask 位移、deadline 中断、离屏超时不召回、退出起点连续、最终胜利隐藏订单气泡和输入锁用例。 |
| 业务状态源未改 | PASS | apps/client/assets/labs/u05/milk_tea_state.ts SHA256 为 bb981d662b8d334556b2418e7e837e787773742ae60aa2a2e31a539f2f43aea6，与 U05 前一已复核版本一致；submitCup 仍只在确认处理处单点调用，使用本次同一 nowMs。 |
| 旧退出 API | PASS | 保留 setExitHandler(handler) 与 onExit。 |
| 新资源边界 | PASS（源检查） | 客户端代码没有引用 FACE_NEUTRAL/BLINK/HAPPY/DISAPPOINTED/SQUASH 计划资源名，未把 Art 候选新 PNG/PSD 导入正式 resources/；新 helper 已分配 Creator TS .meta UUID 0ef1a0a5-c289-4225-8298-21a72d55ad45。 |
| 稀疏脸图绑定要求 | 待 Gate2 | 未来 Gate2 脸部 PNG 均为 332×301 全画布且透明区域稀疏；绑定时必须 `Sprite.trim = false`，保持原画布尺寸，避免 auto-trim 将局部脸部拉伸放大。当前未引用或绑定脸图。 |
| Creator 序列化/资源导入 | NOT_TESTED | Gate2 前不运行 Creator 导入/构建。新 Mask 的锚点、实际裁剪、SpriteFrame 绑定和资源包 UUID 尚未被引擎验证。 |
| 实际浏览器交互/视觉 | NOT_TESTED | 不访问或覆盖既有 8876 服务；本轮不部署新产物。素材尚无新顾客表情与 STATIC_BARE 台面/窗口净底，不能声称完整视觉运行。 |
| 性能实测 | NOT_TESTED | 实现为活动事务期间更新稳定节点属性、阶段外无表现采样；帧率、DrawCall、设备性能待 Gate2 后实际构建再测。 |

## 本轮代码映射

- milk_tea_lab.ts：选料期间隐藏工作杯，显示三项台面原料；撤销/重选沿用旧 Run；确认前冻结订单和三类原料快照，同一 nowMs 仅调用一次 submitCup；表现快照不读取提交后已清空/已推进的业务选择。三槽无热区。
- u05_interaction_presentation.ts：独立于业务 Run 的 immutable presentation transaction 与 epoch；按 elapsed 采样首次入场、650ms 合成、结果脸序列、完整离场/下一客入场、错误留客、超时中断及主动退出。事务采样复用组件侧输出对象。
- 台面移动图标与杯内容只在动态提交阶段创建；活动事务每帧更新既有节点位置/透明度，不按帧销毁重建 root。游戏静止时槽内显示原料而不显示工作杯。
- 订单杯围绕 (653,416) 以单一父节点缩放 0.78，杯内容、前后壁与吸管同组；顾客身体使用固定 [260,278,490,505] 图形矩形 Mask，左侧完整离窗从 x=309 到 x=-72。
- timeout 如中断正确结果的顾客移动，会从当下采样的 source X 继续离窗；若客人已到 x=-72，超时事务直接完成，不会把已离场顾客召回。末杯胜利的订单气泡保持隐藏。

静态/状态结果仅证明独立代码路径与采样器，不证明 Cocos 反序列化、Mask 实际画面、face 素材、净底、完整浏览器操作或目标设备质量。Gate2 和后续构建解锁后需另行提交真实运行证据。
