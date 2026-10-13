# 本轮美术资源登记 v0.1

状态：制作前计划。除用户参考图、现行六店源外，下列 `source/`、`exports/`、PSD 与预览均尚未制作；实际路径、原生尺寸、SHA-256、PSD 层数和 UUID 在产出后填入，不以计划路径冒充文件。画布审阅尺寸 3072×1024；原型输出尺寸待原生图与实尺样张确定。稳定 ID 不带版本号，文件位于本任务 v0.1，正式客户端目录仅为计划，UUID 未导入。

| 稳定 ID | 内容/复用 | 美术预定路径 | 客户端正式路径/UUID | 当前状态 |
|---|---|---|---|---|
| SAK-RR-SKY | 非对称天空及单月 | `exports/tex_sakura_rr_sky.png` | 待 Tech/Client 定目录；UUID 未导入 | 计划 |
| SAK-RR-DISTANCE-L/R | 同一非对称远景源按中线分成不同左右片，含骷髅山/楼阁/雾 | `exports/tex_sakura_rr_distance_left.png` / `_right.png` | 同上 | 计划 |
| SAK-RR-BRIDGE-H | 完整新绘街桥取左半，右半镜像 | `exports/tex_sakura_rr_bridge_half.png` | 同上 | 计划 |
| SAK-RR-RAIL-WATER-H | 水栏左半，右半镜像 | `exports/tex_sakura_rr_rail_water_half.png` | 同上 | 计划 |
| SAK-RR-FG-L | 左前景独立框景 | `exports/tex_sakura_rr_fg_left.png` | 同上 | 计划 |
| SAK-RR-FG-R | 右前景独立框景 | `exports/tex_sakura_rr_fg_right.png` | 同上 | 计划 |
| SAK-RR-TREE-A/B | 两樱树透明原型，多实例 | `exports/tex_sakura_rr_tree_a.png` / `_b.png` | 同上 | 计划 |
| SAK-RR-SPIRIT-A/B | 两水上火灵透明原型，各内部拆出火焰与固定莲座/倒影，多实例 | `exports/tex_sakura_rr_spirit_a_flame.png` / `_base.png` 与 B 同式 | 同上 | 计划 |
| SAK-RR-GATE-R | 右牌楼独立透明层 | `exports/tex_sakura_rr_gate_right.png` | 同上 | 计划 |
| SAK-RR-MASTER | 全景真实语义图层 PSD | `source/scene_sakura_reuse_master.psd` | 不作为运行贴图；UUID 不适用 | 计划 |
| SAK-RR-REASSEMBLED | 切片按版式重组 3072×1024 | `review/reassembled_from_exports.png` | 审阅图，不导入 | 计划 |
| SAK-RR-SHOPS-PREVIEW | 本轮环境叠现行六店 3072×1024 | `review/scene_with_existing_shops.png` | 审阅图，不导入 | 计划 |

现行六店共 12 张 body/sign 源，位于 `apps/client/assets/units/shops/{milk_tea,sugar_art,charcoal_grill,barber,lantern,pitch_pot}/textures/`；具体文件与 SHA-256 见 `SCENE-ANIME-FIVE-CONCEPT-20261010/v0.1/evidence/SHOP_SOURCES_SHA256.txt`，后续再核当前文件 hash、`.meta` UUID 和实际组合。六店原源均为 1024² RGBA，保留不重绘、不缩源。全景审阅使用各店 body/sign 的独立合成，不直接拿旧 v0.2 截图代表现行源；六个店层在 PSD 独立可关闭。运行总纹理目标 40 MiB 已受六店理论 48 MiB 展开量影响，环境另计，实际运行 `NOT_TESTED`。

参考图已作为外部只读源存 `reference/user_reference_3072x1024.png`，不进 PSD 生产层；旧 v0.2 图只用于同尺度对照。计划尺寸上限、切片关系见 `PRODUCTION_PLAN.md`，均非生成器原生分辨率承诺。实例版式、实际绘制顺序、锚点、完整源到半幅/实例的映射在 `CUT_MANIFEST.json` 形成后记录。所有项目交付均在本版本目录；未批准的切片不得正式接入客户端。
