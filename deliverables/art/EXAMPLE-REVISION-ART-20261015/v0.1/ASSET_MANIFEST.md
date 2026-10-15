# 新版资产清单 v0.1

批次 `EXAMPLE-REVISION-ART-20261015/v0.1`，母版画布 3072×1024。以下五张唯一新 PNG 均在 Art 交付目录，等待用户 Gate2 审核；尚未导入 `apps/client`，故新增资源没有 UUID。完整实例顺序、坐标、镜像、路径与 SHA-256 见 `CUT_MANIFEST.json`。

| 稳定 ID | 实图路径 | 尺寸 | SHA-256 | 工程路径状态 |
|---|---|---:|---|---|
| `FAR_L_EYE_DARK_BASE` | `exports/tex_sakura_rr_far_l_eye_dark_base.png` | 1536×720 | `ee02f590849e6aa4cb51244147d78a11a5c2e5560969d689e4c9db72cd5e3940` | 计划：`apps/client/assets/resources/sakura_v03/tex_sakura_rr_far_l_eye_dark_base.png` |
| `FAR_L_EYE_GLOW` | `exports/tex_sakura_rr_far_l_eye_glow.png` | 99×54 | `76faa9de3e47de8188eefdb28d8cd97bf4f57dbea02d85cf55c3a7e451fdb02b` | 计划：`apps/client/assets/resources/sakura_v03/tex_sakura_rr_far_l_eye_glow.png` |
| `BRIDGE_STREET_MASTER_L` | `exports/tex_sakura_rr_bridge_street_master.png` | 1172×270 | `2776d539b7acf3d73ead2dca112e35d0d14878065888930c6477641f4553a9d8` | 计划：`apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_street_master.png` |
| `BRIDGE_BODY_L_CLEAN` | `exports/tex_sakura_rr_bridge_body_l_clean.png` | 1536×270 | `1ad1777f7c084355532ba76c6aef0902062bfee8216b517a02a08b5d253e6e5b` | 计划：`apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_body_l_clean.png` |
| `BRIDGE_BODY_R_CLEAN` | `exports/tex_sakura_rr_bridge_body_r_clean.png` | 1536×271 | `cbbcd7b4db089169bd48e57445fa2f97337c975999bc6a60d46c0b4c8f1a8b82` | 计划：`apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_body_r_clean.png` |

左街面母图放在 `(0,598)`，同一 PNG 水平镜像后放在 `(1900,598)`；无右街面副本纹理。两个清理后的 bridge body 仍分别放在 `(0,598)`、`(1536,597)`，与旧图尺寸一致。`bridge_front_l/r` 旧实图分别为 225×177，SHA-256 `36cf1106837bd6fa760c471df484de07c1997fa75de268878e2a09174a3d2277` 和 `cf4d30b9a036cd5627dc015dab756e78a10952e684c98cd7afc6a21473fe0204`，本包 `exports/` 附副本，但不新建资源身份。

眼睛暗底放在 `(0,0)`，99×54 亮层放在 `far_l` 局部坐标 `(1284,250)`。亮层底色取 v0.5 已批准合成像素，使全亮姿态与旧图逐像素一致；暗态用原眼部像素做暖色降亮，保留微光。`far_r` 无骷髅，原 PNG 和 SHA-256 `b70c1a0f6b9eb658978783e2d4c6ac793ce774e7635575863e05a339a76d59de` 沿用。

其余 18 张正式 PNG（含上述两张 front 和 `far_r`）完整列表与每张旧版 SHA-256 均在 `CUT_MANIFEST.json` 的 `unchanged_exports`。本轮验证这些 SHA 与旧 Art 切片、现有工程同名资源逐张一致；现有工程 UUID 已在该 JSON 对应实例中登记。完整 PSD 为 `source/scene_sakura_revision_master.psd`，48 个栅格语义层的来源与顺序见 `PSD_MANIFEST.json`。新增五张的工程路径仅是计划，UUID 为空，正式导入及 Creator 运行均 `NOT_TESTED`。本批不改变现有 53 实例布局。
