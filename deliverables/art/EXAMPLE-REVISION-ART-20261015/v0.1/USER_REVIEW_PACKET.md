# 樱花场景局部切片效果：用户 Gate2 送审 v0.1

本包供审核 **`EXAMPLE-REVISION-ART-20261015/v0.1` 的真实切片和同尺度重组效果**。制作依据是用户本轮已批准方案 `deliverables/master/EXAMPLE-REVISION-20261015/v0.1/APPROVED_PLAN.md` 与 `USER_AUTHORIZATION.json`；该 Gate1 已允许制作，尚未代表本包切片获批。新图目前只在 Art 交付目录，未导入客户端工程。

可下载的完整送审压缩包：`package/EXAMPLE_REVISION_ART_GATE2_v0.1.zip`；其 SHA-256、条目数和 CRC 结果见 `PACKAGE_MANIFEST.json`。下述文件也均可在本目录直接查看。

## 直接看图

| 要看什么 | 实际文件 | 审核重点 |
|---|---|---|
| 新版整场 3072×1024 | `review/reassembled_from_actual_exports.png` | 由实际 PNG 按清单重组，不是概念图；桥、街面、灯与前景关系 |
| 桥局部同尺度前后 | `review/bridge_before_after_same_scale.png` | 左旧右新；孤立细条和桥脚硬切水块清理后，拱形、单圆章、四灯与石脚是否保持 |
| 右石板街面同尺度前后 | `review/street_before_after_same_scale.png` | 左旧右新；右侧是否像左母版的水平镜像，接缝和光感是否可接受 |
| 眼睛亮、暗静帧 | `review/far_l_eyes_bright.png`、`review/far_l_eyes_dark.png` | 暗态有暖色微光，亮态保持旧效果；头骨其它部位不变 |
| 双眼完整循环 | `review/far_l_eyes_4s_loop.png`（动态 PNG/APNG） | 4.000 秒、32 帧、循环，无突然跳帧；双眼同步 |
| 修改区差异图 | `review/old_vs_new_difference.png` | 红色为实际差异；可结合旧、新整场对照 |

独立实图：`exports/tex_sakura_rr_bridge_street_master.png`、`exports/tex_sakura_rr_bridge_body_l_clean.png`、`exports/tex_sakura_rr_bridge_body_r_clean.png`、`exports/tex_sakura_rr_far_l_eye_dark_base.png`、`exports/tex_sakura_rr_far_l_eye_glow.png`。前景栏杆两张旧图的同 hash 副本也在 `exports/`。母版是 `source/scene_sakura_revision_master.psd`，48 层；`PSD_MANIFEST.json` 与 `SOURCE_EXPORT_MAP.md` 解释每层来源，`CUT_MANIFEST.json` 与 `ASSET_MANIFEST.md` 给出每个真实切片和实例的身份、尺寸、位置与 SHA-256。

## 本批完成的范围

桥 body 的断开残片和桥脚下硬切水块以局部透明遮罩清除，原 `water_rail` 水面透出；左石板街面截为 1172×270 唯一母图，右侧在 `(1900,598)` 使用同图水平镜像。中央桥结构仍保持左右独立 body，前层栏杆保持旧 PNG。前景草石未动。`far_l` 骷髅的两眼从现有像素拆成暗底及亮层；`far_r` 没有骷髅，维持原 SHA。眼睛亮层 99×54，偏移 `(1284,250)`；双眼亮度按 4 秒余弦循环，最暗仍有微光。正式游戏动画尚未接入，本动态 PNG 是同源像素的预览。

## 可复核结果与限制

- `FILE_VERIFICATION.json`：PSD 48 层可解码；PSD 合成、预览与**实际切片**重组均逐像素相同。旧版对新版有 10,717 个变化像素，全部在事先界定的桥/石板街面局部；批准变化区之外 RGBA 变化 0。全亮眼帧对旧版眼区变化 0。
- 旧版 18 张沿用 PNG 的 SHA 与旧 Art 包及现行工程同名资源逐一相同；本版新增 5 张唯一 PNG，右街面复用一张母图。新资源工程路径均标为计划，UUID 为空。没有修改 `apps/client`。
- 本地 `bggg-creator-image2psd` 仅以现有栅格全画幅层 `assemble` 新母版，生成式图片调用 0。该 PSD 可编辑范围为栅格层显隐、擦除、移动和局部调整；没有恢复原画笔触、矢量或被遮住的隐藏内容。
- Photoshop/Photopea 原生打开、Creator 导入、正式游戏视窗回放、压缩和目标设备性能均 `NOT_TESTED`。本包静态预览不能替代 Gate2 后的实际运行核验。

请按上述真实 PNG、重组图、循环预览和限制决定本版具体切片效果 Gate2。若退回，保留本版不覆盖，以新版本修订；若批准，Client 才能按清单正式接入，并复核实际 UUID、视窗、镜像、遮挡与性能。本批自产切图依现行契约直接交用户审核，不另设切图效果的专业复审。
