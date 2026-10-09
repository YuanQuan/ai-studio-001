# v0.2 图层与导出关系

04 理发店由本版透明原画重建为四个栅格层：`01_front_and_ground`、`02_structure_and_interior`、`03_roof_and_upper`、`04_sign`。`body` 为前三层合成，`sign` 为牌面区域，二者合成与 `preview/shop_04_recomposed.png` 逐像素一致。分层按画面区域裁切，可分别移动/调整可见像素；被遮挡的背面没有补绘，`sign` 边界可能含邻接店体像素，不能视为独立三维部件或字体源。原画、四层源 PNG、PSD 与导出文件由 `CUT_MANIFEST.json` 逐件定位。

01、02、03、05、06 完全引用 v0.1 的原 PSD 与切片，不复制、不重导出；其图层说明沿用 [v0.1 PSD_LAYER_EXPORT_MAP.md](../v0.1/PSD_LAYER_EXPORT_MAP.md)。本版保持 1024×1024、脚点 (512,900) 和稳定资产 ID。
