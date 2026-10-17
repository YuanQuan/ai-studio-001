# 10 件无损代表制作预案 v0.1｜同批预签对象

## 冻结身份与门禁

本预案继承已获用户 Gate1 批准的 `deliverables/art/MINIGAME-ART-OPT-20261016-ART/v0.1/PRODUCTION_PLAN.md`（SHA-256 `a5842fbc09c68eec2b18a8ebc750e3d201b5c0bb3d6d50da78edeef1732c691e`），批准原话及边界见 `deliverables/master/MINIGAME-ART-OPT-PILOT-20261017/v0.1/USER_AUTHORIZATION.json`。34 文件身份封存于 `deliverables/master/MINIGAME-ART-OPT-20261016/v0.2/REVIEW_IDENTITY.json`（自身 SHA-256 `d37943279f625a3b43c6bc017c83ba853eed64e186ccf3bc4e52d5e15a045155`）；Master 的 `INPUT_CHECK.json` 记载 34/34 身份一致、10/10 源 SHA 一致、687 项基线未变。

本预案与 Art/Tech 两份预签须绑定**本文件同一 SHA-256**。Art 和 Tech 均 `APPROVED` 且 SHA 一致之前，停止拟正式 PNG、PSD、切片及样张的任何输出。预签只授权下述 10 件生产，不等于其具体 Gate2 批准、全批扩张或 Client 接入。

## 范围、图层来源及原批准

| 资产 | 现行源与母版判断 | 原尺寸 | 裁框 `[l,t,r,b)` | offset `(x,y)` |
|---|---|---:|---|---|
| `U03_SHOP_01_BODY` | 当前工程 PNG 与 `U03-SHOP-FULL-REDRAW-20261009/v0.1/exports/tex_u03_shop_01_body_full_redraw_v01.png` 同 SHA；原 `shop_01_full_redraw_v01.psd` 的前三个区域层合并，另保留当前 PNG 作逐像素基准 | 1024² | `[137,280,886,904)` | `(-0.5,-80)` |
| `U03_SHOP_01_SIGN` | 同批原 PSD 第四层 `04_sign`，与获批 PNG 同 SHA | 1024² | `[783,533,876,733)` | `(317.5,-121)` |
| `UG_GHOST_01_WALK_00` | `U02-TOURIST-VFX-FRAMES-001/v0.2/frames/ug_ghost_01_walk_00.png`；旧游客 PSD 缺失，按当前 PNG 建独立原画布栅格层 | 512² | `[89,67,416,426)` | `(-3.5,9.5)` |
| `UG_GHOST_01_RUN_00` | 同版 `run_00.png`；虽与 walk00 同 SHA，动作 ID、时长及帧身份独立 | 512² | `[89,67,416,426)` | `(-3.5,9.5)` |
| `UG_GHOST_01_HAPPY_01` | 同版 `happy_01.png`，原像素独立栅格层 | 512² | `[82,110,425,448)` | `(-2.5,-23)` |
| `UG_GHOST_01_HAPPY_03` | 同版 `happy_03.png`，原像素独立栅格层 | 512² | `[98,23,413,418)` | `(-0.5,35.5)` |
| `UG_GHOST_01_SAD_04` | 同版 `sad_04.png`，原像素独立栅格层 | 512² | `[89,126,443,448)` | `(10,-31)` |
| `UG_GHOST_01_SAD_05` | 同版 `sad_05.png`，原像素独立栅格层 | 512² | `[89,127,444,448)` | `(10.5,-31.5)` |
| `UG_GHOST_01_SAD_06` | 同版 `sad_06.png`，原像素独立栅格层 | 512² | `[89,125,443,448)` | `(10,-30.5)` |
| `tex_sakura_rr_spirit_a_flame` | 当前工程 PNG 与获批 `SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3/exports/tex_sakura_rr_spirit_a_flame.png` 同 SHA；该版 `scene_sakura_reuse_master.psd` 有场景中四处火焰实例层，单独火焰导出取获批原 PNG 建 160² 栅格层，不把场景实例冒充源纹理原生层 | 160² | `[34,6,126,100)` | `(0,27)` |

裁框和输入 SHA 的逐项准确值见同批 `INPUT_CHECK.json`，以本预案所列值交叉核对。奶茶原具体 Gate2 凭据为 `tasks/U03-SHOP-FULL-REDRAW-20261009/ARTIFACT_APPROVAL_GATE2.json`（v0.2 六店清单继承 shop01 原字节）；游客原 v0.2 帧批准按已批 `SOURCE_APPROVAL_MAP.json` 和当前正式批准记录；火焰原具体 Gate2 凭据为 `tasks/SCENE-SAKURA-REDRAW-REUSE-20261013/ARTIFACT_APPROVAL_GATE2_v0.3.json`。这些原批准仅确立既有素材身份，新裁片仍需本批 Gate2。

原来源/权利沿原交付资料：奶茶为该 U03 新绘栅格画，字形为画中像素，未引入可分发字体文件；游客沿 VFX 已批准帧；火焰沿樱花 v0.3 已批准资产。本批不引入网络图片、第三方字体或参考图，不增新视觉表达。若来源/许可链与获批映射不一致，停止受影响件并报 Master。

## 确定性制作与母版

每件从 `INPUT_CHECK.json` 锁定的当前工程 PNG 解码为 RGBA8，alpha > 0 的 bbox 四边各加 2px 并裁到原画布边界。仅按 `[l,t,r,b)` 裁取，保持所有可见 RGBA 像素及弱透明边，不旋转、不缩放、不重绘、不调色、不重算 alpha。原图与导出层的像素比较必须为零差。新切片保存至本 Task `exports/`，源文件只读。

使用 `bggg-creator-image2psd` 的 `assemble`，以本 Task `source/` 下的 manifest 和原画布 RGBA 栅格层建立 `source/optimization_pilot_master.psd`。该 PSD 为 3072×2048 的**多资产资源库画布**，不是运行纹理或任何单件的合成原图。10 个独立栅格层在资源库中互不重叠：奶茶 body/sign 分置 `(0,0)`、`(1024,0)`；游客 walk00、run00、happy01、happy03 依次置 `(0,1024)`、`(512,1024)`、`(1024,1024)`、`(1536,1024)`，sad04/05/06 依次置 `(0,1536)`、`(512,1536)`、`(1024,1536)`；火焰置 `(2048,1024)`。各层的像素内容不缩放，取层时按资源库定位反向平移并恢复其**独立原尺寸画布**；逐件层→原尺寸画布→裁片映射要实测验证。奶茶与场景既有 PSD 保持只读，并在映射中引用真实原层；游客七帧和单火焰仅为各自完整栅格层，可编辑其像素和透明边，不能恢复笔触、遮挡背面、可移动对象或动画绑定。不用不存在的隐藏组或顶层参考层冒充完整母版。

从切片放回原尺寸画布 `(l,t)` 得到重组 PNG，逐像素与冻结源比；另以黑 `#000000`、灰 `#808080`、白 `#FFFFFF` 背景比较 alpha 合成差异。奶茶 body/sign 同位置合成再核相对关系；游客七帧核动作极值与方向标识；火焰核光缘与莲座关系。同背景、同视窗、同显示尺度的现行场景静态对照只在已核当前节点尺寸和背景证据下制作，标明静态投影；任何 Creator 实际运行、导入后 UUID、性能都标 `NOT_TESTED`。

比较配置：Pillow 11.3.0、RGBA8、保留源 sRGB 编码值、直通 alpha，alpha=0 的 RGB 另计并归零后再比；源尺寸 1:1，不缩放；背景合成采用固定整数 round-half-up。记录每件源/裁片/重组 SHA、alpha bbox、最大 alpha/可见 RGB 差及变化像素。只接受差值 0；出现 ICC/gamma 需转换、像素差、源 SHA 漂移或 offset 无法保持时立即停该支线，不自行放宽阈值。

## 预算、产物与下一门禁

生成调用 0；代表制作最多 60 分钟，静态核验最多 30 分钟，总 90 分钟；每件一初版，同问题最多两轮纠错。时间从真正制作首图开始记，预签等待单独记。达到上限、需要补洞/生图、两轮仍失败时停止受影响支线，保留日志并报告 Master。

交付包含本 Task 的 10 切片、原尺寸重组、黑灰白与同背景同尺度证据、PSD 与图层/导出映射、裁框清单、比较 JSON、制作账本、联系人审阅图及具体版本用户审阅包。组织 Agent 自切图按现行规则在 Owner 文件与像素核对后直接交用户 Gate2；不新增切图后专业效果复审或 Creator 新预览门禁。未经该确切版本用户批准，Client 不接入。
