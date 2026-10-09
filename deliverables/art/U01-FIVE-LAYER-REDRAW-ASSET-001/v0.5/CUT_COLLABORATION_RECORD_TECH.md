# U01 五层切图技术协作记录（v0.5，切图前）

Tech Lead 只读核对当前客户端与已批准 Gate1 v0.3；本记录为制作和后续接入约束，不是成品切片专业复审，也不代表已批准导入。

- 五张 PNG 均用同一 `3840×1024` 画布、左上源坐标与中心锚点，RGBA，尺寸及图层顺序不得因透明边自动裁框改变。稳定命名：`tex_street_base_01_l01_sky.png`、`l02_mountains.png`、`l03_ground.png`、`l04_water_bridge.png`、`l05_water_grass.png`，均带完整 `tex_street_base_01_` 前缀。图层节点名称沿用 `L01_Sky`、`L02_Mountains`、`L03_Ground`，新增 `L04_WaterBridge`、`L05_WaterGrass`；正式名称若以 Art 的已批 manifest 为准，Client 必须同步匹配。
- L01 天空、L02 远山/建筑、L03 柳树/后岸街道/右牌楼、L04 桥栏/河水/灯船、L05 水前水草。L03 在河水后岸，L04 前景河水在前，桥面左右接街、侧拱面向河。L05 草只出现一次；L04 草下水面和岸线补齐，以免异速或边缘采样露洞。
- 候选水平视差 `[0.3, 0.8, 1, 1, 1]`，五层同缩放。未得到连续视窗/缩放/拖动状态与过滤支持域的遮挡证明前，保留未裁完整层源；不要凭静态截图裁透明。压缩后 PNG 文件字节数、解码后纹理内存与目标机性能分别报告。
- 目前 `apps/client/assets/labs/menu/scene1_camera_controller.ts` 源宽高仍为 `2172×724`，比率只有四项且 `recalculate()` 要求 `layers.length===4`；`apps/client/assets/UnitSampleGallery.ts` 亦硬编码四个节点。Gate2 用户明确批准实际五层切片后，Client 接入时必须同步改源尺寸、五层列表和比率，更新 Prefab、贴图/Meta UUID、登记簿与菜单说明，并核多视窗拖动/1.0–1.8 倍缩放、采样边、运行实际显示尺度。静态文件改动不能代替 Creator 导入、构建与运行核验。
- 五张同尺 RGBA8 原始展开量为 `3840×1024×4×5=78,643,200` 字节（75 MiB），尚不是目标机实测。3840 宽纹理兼容、真实导入格式、DrawCall、驻留内存、手机性能均待 Client 接入后测试；预签不得写成已通过。

依据：`deliverables/art/U01-FIVE-LAYER-REDRAW-PLAN-001/v0.3/`、`tasks/U01-FIVE-LAYER-REDRAW-ASSET-001/TASK.json`、上述只读客户端源码。Tech Lead 记录；时间和最终预签状态以 `TECH_PREFLIGHT.json` 为准。
