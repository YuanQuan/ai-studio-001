# v0.2 资源映射预案

本表为首图前计划，实产路径、SHA、层数与实例坐标以完成后的 `CUT_MANIFEST.json` 为准。资产均为无店环境，不登记或输出六店。

| 稳定资产 ID | 来源/本版处理 | PSD 语义层 | 计划正式 PNG | 客户端路径/UUID |
|---|---|---|---|---|
| `sakura.rail.half` | 从 v0.1 本批新绘 water_rail 半幅上缘提取并只保留杆/绳/必要足部 | 左右 2 层；桥街之后、前景之前 | `exports/tex_sakura_rr_street_rail_half.png`，1536 宽透明半幅 | 未接入，计划；UUID 未生成 |
| `sakura.bridge.junction.left/right` | 仅圈中接缝；优先现有新绘像素局部部件，确有必要才 1 次新绘补片 | 左右 0–2 层，真实局部透明层 | 需要时新增 `exports/tex_sakura_rr_bridge_junction_half.png` | 未接入，计划；UUID 未生成 |
| v0.1 的 17 个 active 环境 PNG | 原字节复制，全部 SHA 与 v0.1 相同；若制作证明某个必须改，则须在最终映射明确差异 | 原 41 环境层 | `exports/` 同名文件 | 未接入，计划；UUID 未生成 |

v0.1 正式资源目录仅作为冻结/已退修历史基线，具体资源未获用户批准，不被 v0.2 回写。最终 PSD 与导出图片从同一层序重组。六店不在本表、不在 v0.2 PSD 或正式 ZIP。
