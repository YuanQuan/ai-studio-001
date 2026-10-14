# v0.3 资产映射预案

首图前计划，实产路径、尺寸、SHA 与层数以最终 `CUT_MANIFEST.json` 为准。六店既不画也不输出。

| 稳定资产 ID | 来源与处理 | 计划 PSD/PNG | 客户端状态 |
|---|---|---|---|
| `sakura.rail.stone_chain.prototype` | 本批第15次内置 imagegen 新画单根灰蓝圆帽石柱和一段独立深色下垂链；透明背景；附件仅风格参照 | `source/native/stone_chain_native.png` 原件及实际透明部件 | 未接入、UUID未知 |
| `sakura.rail.half` | 移除 v0.2 半幅旧灯/绳，保留石岸植物；按旧柱位复用新绘柱和链 | 唯一新正式纹理 `exports/tex_sakura_rr_street_rail_half.png`，左右实例层；active总数仍18 | 未接入、UUID未知 |
| 原 17 个环境切片 | v0.2 原字节复制，无改动 | `exports/` 同名 PNG、原 41 PSD 语义层 | 未接入、UUID未知 |

v0.2 具体资源未获用户成品批准，作为已退修历史基线。旧 `street_rail_half` 是唯一允许替换的既有切片，原件仍在 v0.2；本版增加的语义层数量按实际新绘拆分后登记，不预称已经生成。
