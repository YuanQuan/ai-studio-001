# U05 B 组件局部修订｜资源登记 v0.1

状态：真实资源已制作并完成文件及同尺度视觉自核，提交具体版本 Gate2 用户审核；客户端正式路径仍为计划，导入 UUID 均为空。资源细粒度坐标、尺寸、哈希、继承关系和计划路径以同版 [`CUT_MANIFEST.json`](CUT_MANIFEST.json) 为准。

| 资产 ID | 实际路径 | 规格与用途 | 版本/状态 |
| --- | --- | --- | --- |
| `LABEL_PLATE_9SLICE` | `exports/LABEL_PLATE_9SLICE.png` | 123×45 RGBA 空名牌；inset 左右 18、上下 12；12 格共用同一 PNG，123/130/131 宽演示见 `review/component_sheet.png` | 本批 v0.1，待 Gate2 |
| `U05_ART_FONT_ATLAS` | `exports/U05_ART_FONT.png` | 1024×1024 单页白字透明图集，运行时深棕/米白 tint | 本批 v0.1，待 Gate2 |
| `U05_ART_FONT_FNT` | `exports/U05_ART_FONT.fnt` | BMFont 文本，719 个字符，含动态数字、当前中文和标点；逐字坐标/度量见 `source/font_metrics.json` | 本批 v0.1，待 Gate2 |
| `BTN_CONFIRM_TEXT` | `exports/BTN_CONFIRM_TEXT.png` | “确认”局部视觉样层，仅用于重组对照；运行由 BMFont 排字 | 本批 v0.1，样本，不独立正式接入 |
| B 基线其余 45 张 PNG | `exports/` 同名文件 | 场景、幽灵、12 原料、杯内容与其余组件；与 B 基线 SHA-256 逐一相同 | 继承 B v0.1，仍须本批 Gate2 准入 |
| `workspace_b_master` | `source/workspace_b_master.psd` | 1024×1536，61 个真实栅格语义层；旧 12 名牌层替换为共用九宫格实例，文字样层改“确认” | 本批 v0.1，待 Gate2 |

`source/LAYER_MANIFEST.json` 将每个 PSD 图层映射至新层或 B 基线原层。图集是白色 alpha glyph，允许程序着色；它不是 12 个固定字串，也不锁死计数和计时。`source/font/ZCOOLKuaiLe-Regular.ttf` 及完整 `source/font/OFL.txt` 源自已核权利的 B 批同哈希文件。字形由字体栅格化，PSD 字层也是栅格，不声称是 Photoshop 可编辑文字对象。新增图样仅复用项目内原有空名牌与该许可字体，没有新参考图片或 imagegen。

同尺度画面在 `review/reconstructed.png`，B 基线与新画面并列在 `review/comparison.png`；`review/psd_skill_preview.png` 与重组逐像素一致。比较基线时，共有 34,256 个像素变化，全部落在十二标签矩形或主按钮文字区，计划区外 0 个变化。九宫格宽度样图为 123/130/131，四角保留；真实 Creator 的 Sprite SLICED/BitmapFont 解析、运行中文字缩放、DrawCall、设备帧率仍由正式接入阶段验证，不能用静态自核代替。

每个正式图片的客户端路径只在 `CUT_MANIFEST.json` 以 `client_path_plan` 登记；实际导入前 `client_import_status=PLANNED`、`client_uuid=null`。用户对本批切片版本和效果明确批准前，不得将其视为客户端正式资源。
