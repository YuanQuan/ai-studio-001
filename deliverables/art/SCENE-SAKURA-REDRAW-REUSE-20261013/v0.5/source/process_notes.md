# PSD 转换与局部分层记录

母版基于 v0.4 的 45 层全画幅栅格 PSD 延续；新桥仅替换 `bridge_body_l/r` 与 `bridge_front_l/r` 四层。其余 41 个全画幅层由 v0.4 保留。`bggg-creator-image2psd` 的 `assemble` 已把本版 `PSD_MANIFEST.json` 装配为 `scene_sakura_reuse_master.psd`，并另存 `scene_psd_preview.png`。

唯一新像素来源为 `native/bridge_candidate_16.png`，1844×853 RGB；按 2.452 左右的近等比例 Lanczos 采样到 752×348 局部坐标，生成 `bridge_candidate_aligned.png`。参考图只作造型输入，未裁进资源。`build_v05.py` 的两张显式语义掩膜控制桥改动与栏杆前后：old front 高灯移除后露出原天空，旧低栏及桥脚暴露部分由同一次候选在 ROI 内补；新桥体与栏杆的像素只分到各自一个语义层，不拿生成图的山、瀑布、树、链柱或外围水面覆盖原层。水路上沿少量旧拱残留由同一候选在 body 内渐变补洞。左右切在 x=1536，不镜像，单旋涡圆章只保留一次。

PSD 可编辑范围为栅格层的显示、擦除、局部像素修改与层序调整；新桥不是原生矢量/笔触文件，生成候选没有恢复桥背面的全套隐藏街道。用户实际 Gate2 批准前本版不进入 Client。原生 Photoshop 软件打开测试未做；以脚本生成、Pillow PSD 解码、45 层与 RGB/PNG 同尺度重组核对为本批文件验证范围。
