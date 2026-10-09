# U03 v0.3 PSD 图层与导出映射

正式版本为 `r3-light-middle`，1024×1024，脚点 `(512,900)`。每店导出同画布 RGBA `body`、`sign` 两片，在原点叠合。逐文件路径、SHA-256 和 alpha 边界见 [CUT_MANIFEST.json](CUT_MANIFEST.json)。以下图层顺序均从底到顶；`reference_source` 隐藏，其余工作层可见。

| 店铺 | PSD | body 工作层 | sign 工作层 | 来源与可编辑性 |
| --- | --- | --- | --- | --- |
| 01 奶茶 | [shop_01_visual_fidelity_v03.psd](psd/shop_01_visual_fidelity_v03.psd) | `ground_contact`, `body_facade`, `body_roof`, `interior`, `light`, `front`, `body_repair_01` | `sign_hardware_r3`, `sign_board_r3`, `sign_logo_r3` | body 原字节继承 v0.2；高清杯叶小牌源在 `source/imagegen/shop_01_sign_light_r1.png`。挂件、牌板、图形为独立可选栅格区；图形背后未重建完整牌面。 |
| 02 糖画 | [shop_02_visual_fidelity_v03.psd](psd/shop_02_visual_fidelity_v03.psd) | `umbrella`, `operating_objects`, `light`, `ground_contact` | `sign_board_light_r3`, `sign_spoon_syrup_light_r3`, `sign_glyph_reused_sugar_small_r3` | body 原字节继承 v0.2；简框板与勺浆分别取 `source/parallel_shop_02/board_tall_raw.png`、`spoon_syrup_raw.png`；“糖”取 v0.2 正式 PSD 字层并缩小一次，不用方向图的 AI 文字。三者是独立栅格层。A/B/C 和宽板候选未进入正式切片。 |
| 03 现烤 | [shop_03_visual_fidelity_v03.psd](psd/shop_03_visual_fidelity_v03.psd) | `body_structure`, `canopy`, `smoke`, `operating_objects`, `ground_contact`, `light` | `sign_hardware_reused`, `sign_board_reused`, `sign_glyph_reused_kao`, `sign_glyph_official_xian_r3` | body、牌板、挂件和原“烤”字为 v0.2 原像素；仅新“现”独立栅格字层取 `source/parallel_shop_03/sign_glyph_xian_candidate_v03.png`，由官方 ZCOOL KuaiLe OFL 1.1 字源制作并匹配旧字粗度与暖橙边。字体文件未嵌入 PSD/PNG。 |
| 04 理发 | [shop_04_visual_fidelity_v03.psd](psd/shop_04_visual_fidelity_v03.psd) | `ground_contact`, `body_facade`, `body_roof`, `interior`, `light`, `front` | `sign_hardware_reused`, `sign_board_reused`, `sign_icon_scissors_comb_light_r3` | body、原横牌板和挂件沿用；仅图案独立栅格层换成 `source/imagegen/shop_04_scissors_comb_light_r1.png` 的高清双环剪刀和梳齿。 |
| 05 花灯 | [shop_05_visual_fidelity_v03.psd](psd/shop_05_visual_fidelity_v03.psd) | `body_structure`, `rack`, `lantern_objects`, `light`, `ground_contact` | `sign_hardware`, `sign_board`, `sign_glyph` | PSD、body、sign 全部按 v0.2 原字节复制，原“花灯”不重渲。 |
| 06 投壶 | [shop_06_visual_fidelity_v03.psd](psd/shop_06_visual_fidelity_v03.psd) | `body_structure`, `rack`, `operating_objects`, `light`, `ground_contact` | `sign_hardware`, `sign_board`, `sign_glyph` | PSD、body、sign 全部按 v0.2 原字节复制，原“投壶”不重渲。 |

## 导出对应关系

01–06 的正式切片文件统一在 `exports/light_r3_final/`：`tex_u03_shop_XX_body_visual_fidelity_v03.png` 对应表中 body 工作层合成；`tex_u03_shop_XX_sign_visual_fidelity_v03.png` 对应 sign 工作层合成。图层是可单独选择与移动的**栅格可编辑性**，不宣称矢量、真实材质分层或遮挡背面完整可编辑。01–04 工作源和构建脚本保留在 `source/`；05/06 的原 PSD 工作源仍保留在 v0.1/v0.2，不作无意义重制。

本版所有六店 body 切片与 v0.2 原字节相同；01–04 仅牌面差异。`DIFF_AND_RECOMPOSITION_REPORT.json` 验证六店旧/新牌 alpha 覆盖区域外的合成差异像素均为 0；这证明局部改动范围，视觉判断仍以用户最新中间明暗选择和实际视窗为准。
