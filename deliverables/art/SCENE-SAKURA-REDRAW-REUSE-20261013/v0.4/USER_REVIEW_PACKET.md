# v0.4 桥栏杆前景切片 — 用户具体版本审核

请审核本次从 v0.3 原桥拆出的 **v0.4 栏杆前景**。桥上栏杆与其所属灯柱可置于游客或店脚前；桥面、拱和桥脚保持后景。此次没有重画、没有新增六店，也没有接入客户端。

优先看三张实图：`review/bridge_layer_breakdown.png`（原图/body/front 同尺度分层）、`review/occlusion_placeholder_demo.png`（标记几何占位的遮挡层序）、`review/reassembled_from_exports.png`（3072×1024 完整静态环境）。局部全景特写为 `review/bridge_front_detail.png`。实际透明切片为 `exports/tex_sakura_rr_bridge_front_half.png`；对应后景为 `exports/tex_sakura_rr_bridge_body_half.png`。PSD 母版与 19 张环境 PNG 见 ZIP `package/SCENE_SAKURA_BRIDGE_FRONT_GATE2_v0.4.zip`。

核验：原半幅有 alpha 的可见像素 0 差、body/front alpha 交集 0；空场景切片重组对 v0.3 全景 RGBA 0 差；其它 17 PNG 字节 SHA 不变。前景裁框为源半幅 `[1235,34,1536,233)`，输出 301×199，左右对称复用。正式接入前应再核真实游客/店脚遮挡、运行画面、缩放与性能；这些本批未测试。

请特别确认栏杆下缘、灯光外晕、圆标章和中线、以及与游客/店脚的前后关系是否符合“桥的栏杆部分要放在前面”。v0.3 原图没有被栏杆挡住的桥面像素，前景若在运行中移开可能露出空洞；本轮遵照局部无损授权未补画。此处待审核的是实际 v0.4 切片及同尺度效果，用户 Gate2 未批准前 Client 不正式接入。
