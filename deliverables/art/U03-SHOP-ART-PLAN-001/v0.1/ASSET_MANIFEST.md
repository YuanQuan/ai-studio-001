# U03 六店计划资产登记 v0.1

**全表均为计划，不代表文件存在。** 资产 ID 在本批稳定；PSD 与审阅重组不作为 Cocos 运行纹理。Art 实际源路径、版本、哈希与 Client 实际目录/`.meta`/UUID 在后续任务成图、Gate2 批准及导入时分别回填到 `project/ASSET_HANDOFF_REGISTRY.md`，不得写计划为已导入。画布像素、裁切边、支点、纹理页数待首图前 Art/Tech 同批预签。

`DEC-UNIT-FINAL-ASSET-004` 要求单元输出与未来主体游戏**同源正式资源**；下表的 U03 前缀是本方案追踪用候选稳定 ID，不表示存在 U03 专用替代版。已批技术管线使用 `MT_SHOP_01` 指向奶茶店，需在首图前由 Art/Tech 核定 `U03_SHOP_01_*` 与该 ID 是继承、复用还是正式变更，并将唯一有效 ID/Prefab 映射写入资源登记。若冲突扩大到跨任务契约，由 Master 处理，不静默复用或重号。

| 稳定 ID | 类型、内容 | Art 计划路径（未生成） | Client 计划路径（未导入） | 当前状态 |
|---|---|---|---|---|
| `U03_SHOP_01_MASTER` | 奶茶独立完整多层 PSD | `deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_01_milk_tea.psd` | 不接入 | `PLANNED`；UUID 不适用 |
| `U03_SHOP_02_MASTER` | 糖画独立完整多层 PSD | `deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_02_sugar_art.psd` | 不接入 | `PLANNED`；UUID 不适用 |
| `U03_SHOP_03_MASTER` | 炭烤独立完整多层 PSD | `deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_03_charcoal_grill.psd` | 不接入 | `PLANNED`；UUID 不适用 |
| `U03_SHOP_04_MASTER` | 理发独立完整多层 PSD | `deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_04_barber.psd` | 不接入 | `PLANNED`；UUID 不适用 |
| `U03_SHOP_05_MASTER` | 花灯独立完整多层 PSD | `deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_05_lantern.psd` | 不接入 | `PLANNED`；UUID 不适用 |
| `U03_SHOP_06_MASTER` | 投壶独立完整多层 PSD | `deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_06_pitch_pot.psd` | 不接入 | `PLANNED`；UUID 不适用 |
| `U03_SHOP_01_VISUAL`–`U03_SHOP_06_VISUAL` | 六店从各 PSD 导出的单店图或分件组合；具体图层到 PNG 映射待签认 | `deliverables/art/U03-SHOP-ASSET-001/v0.1/exports/` | **计划** `apps/client/assets/units/shops/textures/tex_u03_shop_01_*.png` 至 `tex_u03_shop_06_*.png`；准确文件由 Tech/Client 确认 | `PLANNED`；UUID `待生成`，不可预填 |
| `U03_SHOP_REVIEW` | 六店同尺度对照、逐店同尺度重组图和屋顶近景 | `deliverables/art/U03-SHOP-ASSET-001/v0.1/review/` | 不接入 | `PLANNED`；仅审阅证据 |
| `U03_SHOP_COMMON_GROUND` | 可选公共低对比夜色/地面，不含其他店或地标 | 路径待首图预签后定 | **计划** `apps/client/assets/units/shops/textures/tex_u03_shop_common_ground.png` | `OPTIONAL_PLANNED`；若不采用则取消并留原因 |

每店牌匾及前后遮挡暂归各独立 PSD 与同店导出图，不另造六张同形公牌。所有 Client 路径仅为命名提案，需先经 Tech/Client 核定统一 `snake_case` 命名和目录；后续实际导入以工程真实路径、哈希、`.meta` 与 SpriteFrame UUID 为准。
