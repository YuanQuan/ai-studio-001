# ART-ASSET-DEMO-001｜最小可集成资产清单

版本：v0.1｜状态：DRAFT。全部运行资产为 PNG，带 alpha 通道；均为本任务实际生成或从本任务生成图集切分而来，不是概念参考图。

## 场景

| 资产 ID | 文件 | 尺寸 | 用途 | 锚点／层级 |
|---|---|---:|---|---|
| `scene.tile.ground` | `scenes/tile_ground.png` | 256×128 | 等距空地 Tile | 图块中心；`GroundTileMap` |
| `scene.tile.road` | `scenes/tile_stone_road.png` | 256×128 | 石路 Tile | 图块中心；`GroundTileMap` |
| `scene.tile.water` | `scenes/tile_water.png` | 256×128 | 水面 Tile | 图块中心；`GroundTileMap` |
| `scene.tile.shore` | `scenes/tile_shore.png` | 256×128 | 水岸过渡 Tile | 图块中心；`GroundTileMap` |
| `scene.bridge.entry` | `scenes/bridge_entry.png` | 512×512 | 左上奈何桥 | 底部中心；`LandmarkRoot`，道路连接点在桥面中段 |
| `scene.bridge.exit` | `scenes/bridge_exit.png` | 512×512 | 右下离场桥 | 底部中心；`LandmarkRoot`，可在场景中镜像 |
| `scene.yama_palace` | `scenes/yama_palace.png` | 512×512 | 远端阎罗殿地标 | 底部中心；背景地标层，低于角色 |

## 道具与摊位

| 资产 ID | 文件 | 尺寸 | 用途 | 锚点／层级 |
|---|---|---:|---|---|
| `prop.stall.ruined` | `props/stall_ruined.png` | 512×512 | 背景或目标摊位的破败状态 | 底部中心；`TargetStall.RuinedVisual` |
| `prop.stall.restored` | `props/stall_restored.png` | 512×512 | 目标摊位修复后状态 | 与破败摊位同锚点；`TargetStall.RestoredVisual` |
| `prop.lantern.warm` | `props/lantern_warm.png` | 512×512 | 营业暖灯点缀 | 顶部悬挂点；前景装饰层 |
| `prop.shore_tree` | `props/shore_tree.png` | 512×512 | 岸边树木与石头 | 底部中心；前景／地标装饰层 |

## 角色

| 资产 ID | 文件 | 尺寸 | 用途 | 锚点／动作 |
|---|---|---:|---|---|
| `actor.keeper.ghost` | `characters/keeper_ghost.png` | 543×724 | 修复后唯一店长 | 脚底中心；放入 `StaffAnchor` |
| `actor.guest.floating` | `characters/guest_floating_walk_01.png`、`guest_floating_walk_02.png` | 543×724 | 浮游小鬼顾客 | 脚底中心；2 帧上下浮动 |
| `actor.guest.talisman` | `characters/guest_paper_talisman_walk_01.png`、`guest_paper_talisman_walk_02.png` | 543×724 | 符纸小鬼顾客 | 脚底中心；2 帧微移 |
| `actor.guest.beast` | `characters/guest_horned_beast_walk_01.png`、`guest_horned_beast_walk_02.png` | 543×724 | 小妖兽顾客 | 脚底中心；2 帧微移 |

同名不带 `walk` 的三张角色 PNG 是保留的静态主帧，便于预览或制作后续方向帧。当前朝向为等距右下；其它行进方向可在 Demo 内镜像，不能拿镜像替代正面 UI 头像或正式角色立绘。

## 来源与运行边界

`scenes/bridge_*`、`scenes/yama_palace`、`props/*` 与 `characters/*` 源自本任务的 ImageGen 原创资产图集后切分；`tile_*.png` 为本任务绘制的基础等距地形图块。它们是 Demo 运行资产，未使用 `deliverables/visual-concepts/DEMO-001/` 的两张概念参考图作为纹理。该资产包仅覆盖 Demo，不构成正式项目完整角色或店铺库。
