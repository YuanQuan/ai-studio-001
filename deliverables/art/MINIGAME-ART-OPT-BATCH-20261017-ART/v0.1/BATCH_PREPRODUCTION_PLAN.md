# 全批无损资源制作预案 v0.1（首图前冻结对象）

本预案承接用户已批准的整体无损方案 `PRODUCTION_PLAN.md`（SHA-256 `a5842fbc09c68eec2b18a8ebc750e3d201b5c0bb3d6d50da78edeef1732c691e`）、已获 Gate2 批准的 10 件样本及本批 Master `USER_AUTHORIZATION.json`。它规定本次**确切新生产范围 73 件**；不把 264 件同 SHA Art 源视为 264 件均获独立批准。逐项事实与坐标固定于 `SCOPE_INVENTORY.json`（SHA-256 `e5e68cf5012af2c3b17a1abc6d69feedae8107530814d880b4e898348b05f5ed`）。Art 与 Tech Lead 须对本文件**同一 SHA-256**分别签 `APPROVED`，签齐前不输出任何本批新 PNG/PSD/切片。预案改动须重签，不能以样本旧签替代。

## 逐项范围与批准来源

| 类别 | 件数 | 本批动作 |
|---|---:|---|
| 已批样本 | 10 | 按原已批身份与路径引用，绝不覆盖重制。游客 7、奶茶店 2、樱花火焰 1。|
| 新生产游客 | 33 | 40 帧中的其余 33 帧；每帧 ID、现行 PNG SHA 与 `U02-TOURIST-VFX-FRAMES-001` v0.2 `FRAME_MANIFEST.json` 逐 ID 同 SHA，且 v0.2 `ARTIFACT_APPROVAL.json` 为 `USER_APPROVED`。|
| 新生产奶茶店 | 10 | shop_02～06 的 body/sign；每件现行 PNG SHA 与 `U03-SHOP-FULL-REDRAW-20261009` v0.2 `CUT_MANIFEST.json` 逐件同 SHA，`ARTIFACT_APPROVAL_GATE2.json` 为 `USER_APPROVED`。|
| 新生产樱花场景 | 14 | 当前 v0.3 场景获批18导出中除已批火焰和2幅满画布天空的可裁 14 件；逐件 SHA 与 v0.3 `CUT_MANIFEST.json` 同一，`ARTIFACT_APPROVAL.json` 为 `USER_APPROVED`。桥 body 的后续 v0.5 与此批准不能混同。|
| 新生产 U05 组件 | 16 | `BTN_CONFIRM_TEXT`、12 件 `CUP_*`、3 件 `LOCK_*`；逐 ID/SHA 与 v0.2 `CUT_MANIFEST.json` 对齐，v0.2 `ARTIFACT_APPROVAL_v0.2.json` 为 `USER_APPROVED`；保持每件原尺寸与各层相对位置。|
| 暂不裁：无收益 | 50 | alpha>0 已铺满原画布，保留旧图。包括天空、部分桥件与 U05 组件。|
| 暂不裁：特殊或未核 | 135 | 对话手工 `sourceRect` 及角饰 117、U05 交互未形成 Gate2 6、U05 九宫格/字体图集 2、U01 后续示例 5、桥栏清理 1、固定 UV 灯笼已满画布 0（计入无收益）、无匹配批准源配饰 4。所有现图保留。|

合计 268 = 10 已批原样引用 + 73 新生产 + 50 无收益保留 + 135 特殊/未核保留。`SCOPE_INVENTORY.json` 每行含稳定 ID、客户端路径及 SHA、准确 Art 源及 SHA、批准记录、原 W/H、alpha bbox、拟裁框/offset/pivot、meta 边界、特殊类型、PSD 路线与保留理由。对话层源画布内人工 `sourceRect` 不能套通用补偿；`LABEL_PLATE_9SLICE` 的已批九宫格 insets 与 `tex_u04_dialogue_panel_9s` meta 四边 48 不改；`U05_ART_FONT` 字形/UV 图集不裁；灯笼 mask shader 固定 UV 不裁；U01 眼光与桥街实例需场景专项复核。4 件游客配件同 SHA Art 源未找到，不猜造 PSD/批准。U05 交互任务仍 `BLOCKED`、无 Gate2。此 185 件本批不产图、不删除、不以候选冒充完成。

## 原尺寸坐标与像素不变约束

源图片均为 RGBA8、未见 ICC/gamma 标记；现行客户端文件与准确源 SHA 已逐项核对。bbox 只以 alpha>0 求 `[x0,y0,x1,y1)`，即使 alpha=1 也保留。实际裁框 `[l,t,r,b)=[max(0,x0-2),max(0,y0-2),min(W,x1+2),min(H,y1+2)]`，不重绘、不缩放、不旋转、不降采样、不改变 alpha 或任何 alpha>0 RGB。`originalSize=[W,H]`；`offsetX=(l+r-W)/2`、`offsetY=(H-t-b)/2`；pivot 原样。游客每帧原 512²、帧序/各动作时长/foot与配件挂点不变；奶茶店原 1024²、招牌边缘原可见零星像素保留；U05 杯/锁原画布内叠放坐标与按钮字样定位不变；樱花原场景实例源坐标与视窗不变。Tech 既定受影响 SIMPLE Sprite `CUSTOM`、`trim=false`、`UITransform` 原逻辑尺寸，由 Client 后续按本批用户 Gate2 决定接入，Art 不修改 `apps/client`。

裁框内 alpha=0 的隐藏 RGB 也要保留当前批准源原值。`bggg-creator-image2psd` 的 PSD 读回若清零隐藏 RGB，导出处理只允许在 alpha=0 且裁框内，从**同件已批准源同坐标**回填 RGB；alpha>0 的 RGBA 必须来自**真实 PSD 层读回**且逐像素与批准源全等。清单分别记录 PSD 可见层零差、透明 RGB 回填像素数、导出后裁框 RGBA 全通道零差和原尺寸重组的可见 RGBA/alpha 零差，不将“PSD 层全通道原样保存”作为不实声明。不得用直接裁原 PNG 冒充 PSD 层导出。保留透明 RGB 旨在降低 `linear`、`fixAlphaTransparencyArtifacts=false` 下的边缘风险，但静态零差不证明线性采样或 Creator 运行；Tech 独立核边界，实际运行仍 `NOT_TESTED`。

## 母版评估与确定性转换

先只读现行母版：六店 PSD 各有 `01_front_and_ground`、`02_structure_and_interior`、`03_roof_and_upper`、`04_sign`；v0.3 樱花 PSD 有全景/已缩放场景实例，**实例层并非每件纹理的原尺寸源层**；U05 v0.2 `workspace_b_master.psd` 为 61 个界面布局层，银行杯/锁层与按钮示例并非逐件原画布导出层；游客静态 `tourist_body_master.psd` 原路径当前缺失，v0.2 VFX 为逐帧批准 PNG。旧 PSD 一律只读保留。为可追溯的逐件原尺寸导出，使用已读 `bggg-creator-image2psd` skill 的 `assemble`，从确切获批 PNG 建本批独立**栅格层**；不补画、不借 AI 重建。可编辑范围是该栅格层像素/位置/透明裁边；不声称恢复原生笔触、被遮挡物、动态文字、动画或旧 PSD 内部结构。

新母版为非运行资源库，按模块分 13 个 PSD、73 个实层，不制作运行巨图集：游客 `tourist_walk/run/happy/sad.psd` 各 2048×1536，以帧号 4列×3行、每槽512²定位，仅放 33 新帧；奶茶 `shop_02`～`shop_06.psd` 各2048×1024，body/sign各一原尺寸层；樱花 `scene_background.psd` 3072×1064 放 far_l/r、water_rail_half、street_rail_half，`scene_foreground.psd` 1536×1024 放 foreground_l/r、tree_a/b、gate，`scene_spirits.psd` 800×160 放另外 5 个灵体纹理；U05 `u05_components.psd` 1024² 按稳定 ID 顺序 4列×4行、每槽256²放16层。每层保持源画布 W/H，库坐标单独记，读回按库定位反向裁成**该件原画布**，再按前述裁框导出。PSD 预览只展示库布局，不能当同尺度场景效果或运行图集。若任何层丢可见像素、PSD 读回失败或模块布局不符，停止该模块，不从源 PNG 绕过导出。运行图集需 Tech 证明收益和接口后另议，页每边≤2048，不以本 PSD 尺寸推断运行页。

## 逐项验证、审阅和预算

沿用已批 `cmp-v1`：Pillow 11.3.0 解码 RGBA8、无 ICC 转换、源 sRGB 编码值逐通道比较；源/PSD层读回/裁片/原尺寸重组各自登记 SHA。对原尺寸重组检查 alpha 与 alpha>0 的 RGB 全零差；对裁框内源与切片检查 alpha=0 RGB 也零差。以原图与重组在黑 `#000000`、灰 `#808080`、白 `#FFFFFF`及同版实际场景背景、**同视窗同显示尺度**并排核对，固定整数 round-half-up。游客逐帧标 ID/动作/时长/挂点并抽关键极值；U05 同位置叠杯/锁；店铺 body/sign 同原画布叠放；樱花与同版背景。contact sheet 逐格 fit 仅作索引，不代表游戏显示尺度。保留 `CUT_MANIFEST.json`、真实 PSD 层到导出映射、逐项比较 JSON、制作账本、原尺寸重组、四背景对照和可交用户审阅包。静态与文件核对由 Art Owner 完成后**直接**送本批用户 Gate2，不加切后效果专业复审或额外 Creator 预览门禁。未经该批具体切片用户批准不得正式接入；平台/性能/运行均记 `NOT_TESTED`。

新批预算为确定性处理 **0 次生成调用**，首版逐件一次；制作墙钟≤90分钟，独立静态核对≤45分钟，同一问题最多2轮纠错，超限或遇源/预签漂移立即停受影响支线并报 Master，不自行扩预算。时间账本分别记前置盘点、等待、实际图像制作、静态核查、返工，不以脚本执行秒数冒充全部工作时长。费用遥测未知，零生成不授权购买。任何超预算、源 SHA 变动、可见像素差、PSD 层无法追溯、九宫格/sourceRect/UV 误入、权限或色彩转换异常都停止相应资源；旧源、旧meta、已批10件与未核185件原样保留。
