# ART-ASSET-DEMO-001｜最小可集成资产清单

版本：v0.2｜状态：DRAFT。v0.1 保留为有切分残片的草稿；本版本为待评审的修正运行包。全部文件为带 alpha 的独立 PNG。

| 类型 | 文件 | 尺寸 | 用途与锚点 |
|---|---|---:|---|
| 地表 | `scenes/tile_ground.png` | 256×128 | 空地 Tile，中心锚点 |
| 地表 | `scenes/tile_stone_road.png` | 256×128 | 石路 Tile，中心锚点 |
| 地表 | `scenes/tile_water.png` | 256×128 | 水面 Tile，中心锚点 |
| 地表 | `scenes/tile_shore.png` | 256×128 | 水岸 Tile，中心锚点 |
| 地标 | `scenes/bridge_entry.png` | 768×512 | 奈何桥入口，底部中心锚点 |
| 地标 | `scenes/bridge_exit.png` | 768×512 | 离场桥，底部中心锚点；可镜像 |
| 地标 | `scenes/yama_palace.png` | 512×512 | 远端阎罗殿，底部中心锚点 |
| 摊位 | `props/stall_ruined.png` | 768×512 | 破败状态，底部中心锚点 |
| 摊位 | `props/stall_restored.png` | 768×512 | 修复状态，与破败摊位使用同一底部中心锚点 |
| 装饰 | `props/lantern_warm.png`、`props/shore_tree.png` | 512×512 | 灯笼、岸树，分别用悬挂点／底部中心锚点 |
| 店长 | `characters/keeper_ghost.png` | 543×724 | 修复后唯一店长，脚底中心锚点 |
| 顾客 | `characters/guest_floating_walk_01.png`、`_02.png` | 512×384 | 浮游顾客两帧，脚底中心锚点 |
| 顾客 | `characters/guest_paper_talisman_walk_01.png`、`_02.png` | 512×384 | 符纸顾客两帧，脚底中心锚点 |
| 顾客 | `characters/guest_horned_beast_walk_01.png`、`_02.png` | 543×724 | 小妖兽顾客两帧，脚底中心锚点 |

不带 `walk` 的顾客文件是静态主帧。当前朝向为等距右下；Demo 可按路径镜像，正式全向动画须另行生产。所有资产按场景、道具、角色分组图集；透明边保留至少 2 px，导入时应避免边缘色渗出。
