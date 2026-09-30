# Demo 静态场景校准附录｜v0.1（部分完成，阻塞）

本附录记录已实测的工程和资产输入。Creator 工程已建，静态场景尚未创建；因此任何地图、相机、命中与路径数值都不得写成已校准。

## 工程与导入证据

- 唯一工程：`apps/client/`，由本机 `C:\ProgramData\cocos\editors\Creator\3.8.8\resources\templates\empty-2d` 内置模板建立。Creator 可执行文件的 FileVersion 与 ProductVersion 均为 3.8.8，工程 `package.json` 由 Creator 写入 `creator.version=3.8.8` 和工程 UUID。
- 批准输入：`deliverables/art/ART-ASSET-DEMO-001/v0.2/`。`scenes/`、`props/`、`characters/` 原路径分别映射到 `apps/client/assets/demo/` 下的同名子目录。21 张 PNG 文件名不变；逐文件 SHA-256 与源文件一致（21/21）。
- Creator 沙盒外启动后，`apps/client/temp/asset-db/log/2026-9-30 09-03.log` 出现 `asset-db:ready`。21 张 PNG 均由编辑器生成相邻 `.meta`，`imported=true`、`hasAlpha=true`；示例 `scenes/tile_ground.png.meta` 由 `image` importer 生成 texture 和 sprite-frame 子资源。包括文件夹在内，`assets/` 下共 25 个 `.meta`。没有手工编造 UUID 或场景文件。
- 图片原始尺寸：地表四张均 256×128；两桥与两态摊位均 768×512；阎罗殿、灯笼、岸树均 512×512；小幽灵与符纸客 512×384；妖兽与店长 543×724。Creator 自动裁剪可能改变 SpriteFrame 有效尺寸，例如 `tile_ground` 原图 256×128，自动裁剪后为 256×127；正式 TileSet 拼装前须在编辑器中检查纹理导入设置与接缝。

下表中的相对路径前缀分别为源 `deliverables/art/ART-ASSET-DEMO-001/v0.2/` 与导入 `apps/client/assets/demo/`；每一行均已检查源/导入 SHA-256 一致、PNG 尺寸一致、Creator 生成相邻 `.meta`。

| 同名相对路径 | 原图尺寸 | 核对 |
|---|---:|---|
| `scenes/tile_ground.png` | 256×128 | 一致，已导入 |
| `scenes/tile_stone_road.png` | 256×128 | 一致，已导入 |
| `scenes/tile_water.png` | 256×128 | 一致，已导入 |
| `scenes/tile_shore.png` | 256×128 | 一致，已导入 |
| `scenes/bridge_entry.png` | 768×512 | 一致，已导入 |
| `scenes/bridge_exit.png` | 768×512 | 一致，已导入 |
| `scenes/yama_palace.png` | 512×512 | 一致，已导入 |
| `props/stall_ruined.png` | 768×512 | 一致，已导入 |
| `props/stall_restored.png` | 768×512 | 一致，已导入 |
| `props/lantern_warm.png` | 512×512 | 一致，已导入 |
| `props/shore_tree.png` | 512×512 | 一致，已导入 |
| `characters/keeper_ghost.png` | 543×724 | 一致，已导入 |
| `characters/guest_floating.png` | 512×384 | 一致，已导入 |
| `characters/guest_floating_walk_01.png` | 512×384 | 一致，已导入 |
| `characters/guest_floating_walk_02.png` | 512×384 | 一致，已导入 |
| `characters/guest_paper_talisman.png` | 512×384 | 一致，已导入 |
| `characters/guest_paper_talisman_walk_01.png` | 512×384 | 一致，已导入 |
| `characters/guest_paper_talisman_walk_02.png` | 512×384 | 一致，已导入 |
| `characters/guest_horned_beast.png` | 543×724 | 一致，已导入 |
| `characters/guest_horned_beast_walk_01.png` | 543×724 | 一致，已导入 |
| `characters/guest_horned_beast_walk_02.png` | 543×724 | 一致，已导入 |

## 待静态场景标定的参数

| Tech Design 第 7 节参数 | 当前结果 | 必须补交的实际数据 |
|---|---|---|
| TileMap 尺寸 | 未测，场景未建 | 列×行、Tile 世界尺寸、等距方向 |
| 地图可显示包围矩形 | 未测 | minX/maxX/minY/maxY，包含地标外沿 |
| 初始/最远/最近相机 | 未测 | 世界中心、正交尺寸或倍率、竖屏视口覆盖截图 |
| 点击容差、目标 Prefab 命中区 | 未测 | 逻辑像素阈值、命中多边形或宽高与位置 |
| 两桥、摊位、店长锚点 | 未测 | 世界坐标与店长局部偏移 |
| 固定路径点 | 未测 | Entry、各转点、Exit、BeyondExit 有序世界坐标与道路截图 |
| 本地演示参数 | 未测 | 生成间隔、移动速度、活动顾客上限、动画频率 |
| 代表设备与采样 | 无真实手机记录 | 型号、芯片、RAM、系统、浏览器、视口；按已批准 `project/quality/PERFORMANCE_BUDGET.md` 的三轮 60 秒口径采样 |

默认、最近、最远镜头及目标命中／完整道路截图均未生成。当前不能据此请求 Tech Lead 对场景参数、遮挡或路径作通过结论。
