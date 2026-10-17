# 现行街景路径语义保护与接入授权

2026-10-17，本轮已批准资源正式接入期间，Master核对现行 `sakura_v03_layout.ts`：逻辑 `tex_sakura_rr_far_l` 实际指向 `tex_sakura_rr_far_l_eye_dark_base.png`；逻辑 bridge_body_l/r 实际指向对应 `_clean.png`。因此逻辑ID与图像文件名不能互换。

生产resolver必须按现行真实路径解析。暗眼底图、clean桥体及未裁天空、眼光等资源保持冻结原图；不得把获批但已不被现行布局引用的旧far_l裁片替换回当前画面。83件裁片保持完整身份映射和审批追溯，实际发布只包含可证明可达的资源。

候选旧场景图：far_l.png 1,281,645字节、bridge_body_l.png 434,325字节、bridge_body_r.png 435,246字节，总计2,151,216字节（2.05156MiB）。仅在代码/Prefab/UUID/动态路径与构建图核对后排除发布输入，保留源文件和历史交付；暗眼底图为现行使用，不属于这三件旧图。

Gallery子任务补充授权同一Client Owner修改 `sakura_v03_environment.ts` 的可选页面预载帧入口，避免生产进入legacy全局frameCache；layout及动作/时序不变。资源Owner继续registry、staging、U01/U05。该补充是已批准同一Client实现阶段内部的必要路径与缓存修正，不新增用户门禁。最终准确源码、隔离工程、真实构建和运行证据仍聚合Tech Review及USER_REVIEW。
