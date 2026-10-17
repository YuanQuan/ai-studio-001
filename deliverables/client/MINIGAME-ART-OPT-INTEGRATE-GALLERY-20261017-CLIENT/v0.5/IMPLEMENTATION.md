# U01 调节面板手势结束状态修复 v0.5

修复U01面板拖动后，下一次关闭或普通按钮点击无响应的问题。滚动行里的按钮在触摸结束时会停止事件冒泡，因此面板视口收不到自己的结束事件，旧版 `panelScrollY` 与拖动标记可能残留。

按钮触摸开始现在总是开启新一轮手势并清除旧拖动标记。按钮触摸结束先记下本轮是否拖动，再清除 `panelScrollY`；若本轮拖动则抑制此次回调，否则正常触发。触摸取消清除指针并保持取消/拖动抑制状态，避免后续合成的结束事件误触；下一次开始会重新开启正常手势。面板视口自己的取消路径也会清理指针并维持取消抑制。实现位于通用U01 button helper，不针对“关闭”按钮做特判。

本版只修改 `apps/client/assets/labs/u01/sakura_layout_editor.ts`。Gallery方向修订SHA维持v0.4的 `e403e97715f2f4fd7dfba60482fd39a62fac9a9017c7050b70803dac100214b3`。修复前U01源码SHA `184f3610ffbd298e10dad79ec83e179f3e859b1a2fd3e9b612046b3180951a46` 已保存在 `evidence/prechange/sakura_layout_editor_candidate.ts`；Root v0.6实测失败图为 `deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-integration-v06/U01-close-stuck-after-drag-320.jpg`。

## 验证

- Creator 3.8.8 TypeScript 4.9.5全项目语义检查通过。
- `u01_button_gesture_probe.cjs` 转译并实例化真实 `button()` helper绑定的事件回调，验证拖动结束不误触、结束事件未到视口时仍清除指针、随后新关闭按钮点击立即响应、取消后结束不触发、下次普通点击恢复。通过。
- v0.4滚动方向有效方法探针、v0.3 U04重入探针及session有效方法回归均通过。
- 本候选尚未Creator重建或IAB实测；Root需在新构建复查320px拖动后直接点关闭、取消/普通tap及之前要求的实际滚动矩阵。
