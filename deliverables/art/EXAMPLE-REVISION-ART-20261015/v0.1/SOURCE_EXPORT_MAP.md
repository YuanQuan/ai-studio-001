# 母版层到切片映射 v0.1

旧母版 `v0.5/source/scene_sakura_reuse_master.psd` 为只读基线；新母版 `source/scene_sakura_revision_master.psd` 使用 `bggg-creator-image2psd` 的本地 `assemble` 将 48 个全画幅 RGBA 栅格层装配。`PSD_MANIFEST.json` 是全部层的精确顺序、路径与混合方式；`CUT_MANIFEST.json` 是全部实际切片的实例位置、尺寸、翻转和身份。参考/预览图不覆盖语义层。

| PSD 稳定层 | 源像素/处理 | 实际导出 | 图内坐标与实例 | 编辑边界 |
|---|---|---|---|---|
| `far_l` | v0.5 `03_far_l.png` 中仅双眼内部降亮 | `tex_sakura_rr_far_l_eye_dark_base.png` | 1536×720；`(0,0)` | 眼外原 RGBA 零差；暗底不是恢复出的眼后隐藏信息 |
| `far_l_eye_glow` | 原 v0.5 合成图双眼可见像素的遮罩拆分 | `tex_sakura_rr_far_l_eye_glow.png` | 99×54；`(1284,250)` | 双眼局部；全亮帧逐像素恢复原画；原 far alpha 251–253，亮层采用不透明已合成色防二次 alpha 漂移 |
| `far_r` | v0.5 原层直接沿用 | 旧 `tex_sakura_rr_far_r.png` | 1536×720；`(1536,0)` | 无骷髅、不改 |
| `bridge_street_l_master` | v0.5 `bridge_body_l` 的 x `[0,1172)` 街面区 | `tex_sakura_rr_bridge_street_master.png` | 1172×270；左 `(0,598)` | 同一像素母图供两侧 |
| `bridge_street_r_mirror_instance` | 上一母图确定性水平镜像 | **同一** `tex_sakura_rr_bridge_street_master.png` | 右 `(1900,598)`，`mirror_x=true` | 无第二纹理；镜像范围到石板街面，不复制中央圆章/灯/桥脚 |
| `bridge_body_l` | 从 v0.5 body 去除街面母区、孤立残片和桥脚硬切水块 | `tex_sakura_rr_bridge_body_l_clean.png` | 1536×270；`(0,598)` | 独立桥体与过渡保留；无补绘 |
| `bridge_body_r` | 从 v0.5 body 去除右街面区、孤立残片和桥脚硬切水块 | `tex_sakura_rr_bridge_body_r_clean.png` | 1536×271；`(1536,597)` | 独立桥体与过渡保留；无补绘 |
| `bridge_front_l/r` | v0.5 原层直接沿用 | 旧 `tex_sakura_rr_bridge_front_l/r.png` | 左 `(1311,573)`、右 `(1536,573)` | 前景栏杆/灯与店铺遮挡顺序不改 |
| 其余 39 层 | v0.5 原始全画幅 PNG | 旧资源 15 种唯一切片及实例 | 逐项见两份 JSON | hash 沿用，不改画面 |

所有切片为直通 alpha RGBA PNG；场景视窗和色值沿用原 3072×1024 母版。亮层动画在 4 秒内令 alpha 按 `0.5 + 0.5 cos(2πt/4)` 循环，同步驱动双眼；`t=0/4` 全亮，`t=2` 暗底微光。32 帧动态 PNG（APNG）每帧 125 ms，仅作同源像素循环预览；正式客户端动画参数待 Gate2 后接入。

原 PSD 是栅格分层，本版新增层可单独显示、隐藏、擦除和局部修改；不提供原生笔触、矢量、独立骨骼或被遮挡内容。未导入工程，无新 UUID。旧前景草石与其它背景依原 PNG hash 原样沿用。
