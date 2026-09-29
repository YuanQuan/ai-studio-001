# ART-ASSET-DEMO-001｜Cocos 场景拼装说明

版本：v0.1｜状态：DRAFT

## 1. 导入与压缩

将 `scenes/`、`props/`、`characters/` 分目录导入 Cocos Creator。保持 PNG alpha；生成图集前留 2 px 透明边并关闭会导致边缘色渗出的压缩选项。Demo 建议分为地表、地标／道具和角色三组图集；不要把整张大地图合为一张纹理。

## 2. TileMap 与大地图

使用 256×128 的菱形等距格：`tile_ground` 铺满可显示矩形；以 `tile_water` 围出水域；以 `tile_shore` 接合水岸；用连续的 `tile_stone_road` 铺成从左上桥到右下桥的 S 形可行走带。可重复铺设以形成大于初始竖屏视野的地图。TileMap 只绘制地表，不承载摊位和桥的交互状态。

## 3. 地标、摊位与遮挡

1. 在左上道路端放置 `bridge_entry`，其桥面中段设为 `WalkwayRoot.Entry`。
2. 在右下道路端放置 `bridge_exit`，其桥面中段设为 `WalkwayRoot.Exit`；必要时镜像桥的 x 轴以使朝向连通石路。
3. 将 `yama_palace` 放在远端背景；其轮廓只作远景识别，不放置命中区。
4. 在多处 TileMap 空地放置 `stall_ruined`。只有目标摊位采用 `TargetStall` Prefab，并注册命中区。
5. `TargetStall.RuinedVisual` 和 `TargetStall.RestoredVisual` 以相同的底部中心对齐；初始只显示前者。修复后切换为后者，并在柜台前侧的 `StaffAnchor` 生成一次 `keeper_ghost`。
6. 按地标底边与角色脚点的等距深度排序。树木、桥栏杆等需要压住角色的部分放入前景遮挡层，不按节点创建顺序决定遮挡。

## 4. 角色与客流

三类顾客使用各自 `walk_01` / `walk_02` 以 4–6 FPS 循环。它们是 Demo 级两帧微动，不承诺正式行走动画；沿固定路径平移本身承担“行走”阅读。按路径方向镜像精灵，保持脚底中心贴路。到 `Exit` 后继续跨过桥的可见边界再回收，避免屏幕内消失。

## 5. 建议绘制层级

`Background / GroundTileMap / LandmarkBack / ActorsRoot(depth sorted) / LandmarkFront / ScreenCanvas`。

暖灯、树叶和水面动画不在本包内；如果后续增加，使用共享材质或少量序列帧，不能改动 TileMap、摊位锚点或客流路径语义。

## 6. 已知制作边界

本包中的独立角色和地标来自同一风格化源图集后切分，视觉适合 Demo 远景验证。切分后的素材仍应在 Cocos 导入后检查透明边、镜像、缩放和跨层遮挡；若出现图集边缘串色或桥面路径不连通，应以导入配置或路径点校正解决，不修改产品规则。
