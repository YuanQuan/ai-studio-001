# PSD 续作与可编辑范围

输入为只读 v0.5 `scene_sakura_reuse_master.psd`，SHA-256 `1a0c525d679b5dbcbda7812ce97bba8401698c1d3fe0ace45f39b82a449d3d49`。基线 45 层，画布 3072×1024。新 PSD 用本地 `bggg-creator-image2psd/scripts/image2psd.py assemble` 装配 48 个实际全画幅 PNG 栅格层；新层为 `far_l_eye_glow`、`bridge_street_l_master`、`bridge_street_r_mirror_instance`。原层 `far_l`、`bridge_body_l`、`bridge_body_r` 在本批副本中作遮罩/亮度修改，其余层源像素沿用。工具没有新增图片生成调用。

源到输出：左桥身的街面 `(0,598)` 截为 1172×270 母图，右 `(1900,598)` 从该母图像素水平镜像；两侧桥 body 剩余独立结构，front 仍用原版。桥 body 上方断开的孤立弧线按明确矩形范围透明化；下缘硬切水块以桥脚石块轮廓下方的连续多边形透明化，露出本来就在下层的水面，不补绘新水。`far_l` 的两眼局部暗底来自原像素暖色降亮；全亮层取旧版已批准合成可见像素，解决原 far alpha 251–253 再叠合时的数值偏差。亮层全开后旧画面眼区差异为 0；眼外远景原样。

本版源与导出均是可编辑栅格，而非恢复原生笔触或被遮挡背景。所保存的全画幅 PNG 可以在 Photoshop/Photopea 原位叠放；PSD 已由本地脚本和 Pillow 解码确认 48 帧/层，尚未在 Photoshop/Photopea 原生软件中手动打开。无字体、新参考图、外部素材或新生图。旧版候选与 v0.5 母版保留原目录不覆盖；用户桥形参考未裁入生产资源。源与版权范围说明见 `ART_BRIEF.md`。
