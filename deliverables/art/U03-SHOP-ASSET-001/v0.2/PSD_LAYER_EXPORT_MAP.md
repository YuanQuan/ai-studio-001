# U03 六店 v0.2 PSD 图层与切片映射

批次 `U03-SHOP-SIGN-REVISION-V02`；各店 1024×1024 RGBA，脚点 `(512,900)`。PSD 中隐藏的 `reference_source` 只留原画追溯，不参与导出。以下图层从下到上；各店的 `body` 与 `sign` 在同画布原点叠合。

| 店 | body 导出图层 | sign 导出图层 | 来源与可编辑边界 |
|---|---|---|---|
| 01 | `ground_contact`, `body_facade`, `body_roof`, `interior`, `light`, `front`, `body_repair_01` | `sign_hardware_new`, `sign_board_new`, `sign_logo_new` | 原 PSD 六个主体层；仅旧牌后 `(346,470,678,591)` 缺口有独立局部补像素层。小牌/logo 来自获授权方向图牌匾局部像素，按对象拆成透明栅格层，不是向量。参考裁块仅 61×98，再放大至 122×196，放大清晰度有上限。 |
| 02 | `umbrella`, `operating_objects`, `light`, `ground_contact` | `sign_board_new`, `sign_spoon_syrup_new`, `sign_glyph_reused_sugar` | 原主体切片逐字节沿用。车前牌板、勺浆来自获授权方向图局部；“糖”从原正式 `sign_glyph` 独立层取像素并调色。参考牌裁块 64×126，再放大至 135×266；仅栅格对象可编辑。r1 AI 预览文字已撤，见 `SAMPLE_REVISION_R2.md`。 |
| 03 | `body_structure`, `canopy`, `smoke`, `operating_objects`, `ground_contact`, `light` | `sign_hardware_reused`, `sign_board_reused`, `sign_glyph_reused_kao`, `sign_glyph_official_xian` | 主体 PNG 与原版逐字节相同。原“烤”及牌框原像素保留；新“现”取 Google Fonts 官方 ZCOOL KuaiLe TTF 栅格化，加厚主体笔画并仿原深棕填色和暖橙描边。字体源/OFL 本地核验记在 `source/rights/RIGHTS_SOURCE.md`；TTF 不进入客户端或 PSD。 |
| 04 | `ground_contact`, `body_facade`, `body_roof`, `interior`, `light`, `front` | `sign_hardware_reused`, `sign_board_reused`, `sign_icon_scissors_comb_new` | 主体 PNG 与原版逐字节相同；保留原框纸芯，从获授权方向图剪梳局部 `x203–274,y684–729` 抽像素，放大后在同一独立透明栅格层局部修复原图偏淡的第二指环，增强梳齿与交叉轮廓。参考区仅 71×45，非向量。 |
| 05 | `body_structure`, `rack`, `lantern_objects`, `light`, `ground_contact` | `sign_hardware`, `sign_board`, `sign_glyph` | PSD、body/sign PNG 与 v0.1 原版全部逐字节相同；原“花灯”牌字原像素。 |
| 06 | `body_structure`, `rack`, `operating_objects`, `light`, `ground_contact` | `sign_hardware`, `sign_board`, `sign_glyph` | PSD、body/sign PNG 与 v0.1 原版全部逐字节相同；原“投壶”牌字原像素。 |

`CUT_MANIFEST_V02.json` 对六 PSD、12 PNG、逐店重组和静态视窗记实存路径与 SHA-256。01–04 新 PSD 工作层及旧牌历史层在 `source/psd_work_r2/`、`source/psd_work_final/`；05/06 源层在 v0.1 `source/psd_work/`，均不删除。01 的局部补图源在 `source/shop_01_gap_imagegen_raw.png`。生成与核验脚本在 `source/`；实际 PSD 图层是像素可编辑，不承诺文字仍为字体对象或图形为矢量对象。
