# U03 六店整体重绘｜PSD 图层与切片映射 v0.1

六店均为 `1024×1024 RGBA`，脚点 `(512,900)`；完整新画保存在 `source/shop_XX/imagegen_whole_r1.png`，归一化源在各店 `source/shop_XX/psd_work/whole_normalized.png`。每份 PSD 四个**栅格区域层**，由下至上为 `01_front_and_ground`、`02_structure_and_interior`、`03_roof_and_upper`、`04_sign`。前三层合并导出 `U03_SHOP_XX_BODY`；第 4 层导出 `U03_SHOP_XX_SIGN`。两张 1024 全画布透明 PNG 同原点叠合，逐像素复原该店的归一化新画。实路径、尺寸、alpha、哈希见 `CUT_MANIFEST.json`。

| 店 | 新 PSD | 主体 / 牌片 |
| --- | --- | --- |
| 01 奶茶 | `psd/shop_01_full_redraw_v01.psd` | `exports/tex_u03_shop_01_body_full_redraw_v01.png` / `exports/tex_u03_shop_01_sign_full_redraw_v01.png` |
| 02 糖画 | `psd/shop_02_full_redraw_v01.psd` | `exports/tex_u03_shop_02_body_full_redraw_v01.png` / `exports/tex_u03_shop_02_sign_full_redraw_v01.png` |
| 03 现烤 | `psd/shop_03_full_redraw_v01.psd` | `exports/tex_u03_shop_03_body_full_redraw_v01.png` / `exports/tex_u03_shop_03_sign_full_redraw_v01.png` |
| 04 理发 | `psd/shop_04_full_redraw_v01.psd` | `exports/tex_u03_shop_04_body_full_redraw_v01.png` / `exports/tex_u03_shop_04_sign_full_redraw_v01.png` |
| 05 花灯 | `psd/shop_05_full_redraw_v01.psd` | `exports/tex_u03_shop_05_body_full_redraw_v01.png` / `exports/tex_u03_shop_05_sign_full_redraw_v01.png` |
| 06 投壶 | `psd/shop_06_full_redraw_v01.psd` | `exports/tex_u03_shop_06_body_full_redraw_v01.png` / `exports/tex_u03_shop_06_sign_full_redraw_v01.png` |

**真实可编辑范围。** 图层由新整画作矩形/多边形区域掩模分出，可独立选择和局部修像素；它们不是原生手绘对象层、矢量、可任意换位的完整器件，也未重建遮挡物背面。`sign` 是牌区栅格，边缘可能含邻近店体像素；单独隐藏它会留下相应区域空洞，必须同店 `body + sign` 同原点显示。PSD 与切片保持**可见合成一致**，不承诺拆片后各对象独立动画。后续若需要真正独立牌件运动/换皮，须在获批视觉目标下补画被遮挡区域并重新评审契约。
