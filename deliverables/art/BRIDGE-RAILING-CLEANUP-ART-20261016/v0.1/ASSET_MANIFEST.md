# 栏杆去边资产登记 v0.1

| 稳定资产 ID | 描述 | 本批正式美术路径 | 原工程路径（仅供映射，未接入） | 场景 PSD 图层 | 状态 |
|---|---|---|---|---|---|
| sakura_rr_bridge_front_l | 左栏杆局部去蓝边，225×177 RGBA | `exports/tex_sakura_rr_bridge_front_l.png` | `apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_l.png` | `bridge_front_l`，底到顶索引 18，场景 `(1311,573)` | 待用户 Gate2 |
| sakura_rr_bridge_front_r | 右栏杆局部去蓝边，225×177 RGBA | `exports/tex_sakura_rr_bridge_front_r.png` | `apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_r.png` | `bridge_front_r`，底到顶索引 21，场景 `(1536,573)` | 待用户 Gate2 |

完整母版为 `source/scene_sakura_railing_clean_master.psd`，3072×1024、48 层；`PSD_MANIFEST.json` 记录图层顺序与文件。除两个 front 层外，其余 46 层逐文件 SHA-256 与 10/15 已确认母版相同。本批没有写入工程资源，导入 UUID 尚无新值。来源仅为项目现有已确认 PNG/PSD，imagegen 候选只参考 alpha，候选重画的 RGB 全部弃用。
