# Tech 阶段性代码 Review（待运行证据）

输入：当前工作树的 U00/U01 共用场景、U01 编辑器、U05 顾客实现，以及 `deliverables/client/EXAMPLE-REVISION-CLIENT-20261015/v0.1/evidence/CLIENT_ASSERTIONS.json`。这些是进行中代码，最终 `REVIEW.json` 须待同版构建和实际浏览器证据后给出。

## 已复核

- 场景背景的旧自动位移已移除；河面完整三件组通过 53 实例识别为 7 组，方向交错、同组共享位移。纯逻辑断言核到 24 源像素/秒、位置差固定；实际画面、循环接缝仍 `NOT_TESTED`。
- U01 `reorder()` 仅调层序，不再把动画节点的位置重置为基础坐标；命中框和选中描边读实际节点，描边逐帧跟随；拖动起点按显示位置计算，写回仍为基础数据，导出函数读取 `item.left/top`。静态代码符合分离意图，拖动手感、重入与导出实值待 IAB 复核。
- U05 Gallery 将 host 置为 inactive，注入已有 UG_GHOST_01 prefab、manifest、帧数组后再激活；Lab 对缺资源给安全提示。现行 manifest 的 happy 10 帧合计 1400ms、sad 10 帧合计 2800ms，表现采样以 phaseStartedAtMs 的墙钟相位提交对应帧。超时由 run 状态决定并使旧表现 epoch 失效，表现完成函数未结算或发奖励，静态代码未见重复结算路径。
- 7 条辅助断言只执行纯函数和 manifest 数据，未覆盖 Cocos 组件生命周期、编辑器真实命中/拖动、实际帧贴图与渲染、HTTP 页面或超时与点击竞争。因此这些场景保持 `NOT_TESTED`；不能用断言的 PASS 代替运行结论。

## 后续核验

Client 提交 Creator 3.8.8 同版导入/CLI 构建及实际 HTTP Web 输出身份后，Root 采集 Codex 内置浏览器交互证据。Tech 再核 U01 可见幽灵点击/拖动/导出/重入、整组越界循环及手动镜头，U05 等待静态姿态、完整反馈时长、超时优先、重复操作和退出清理。新桥和眼睛未获 Gate2，须确认正式工程未导入；目标机与性能若无证据记 `NOT_TESTED`。
