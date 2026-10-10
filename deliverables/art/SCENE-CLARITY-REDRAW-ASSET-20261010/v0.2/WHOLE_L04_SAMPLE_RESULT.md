# 完整 L04 首图实图判定 v0.2

内置 imagegen 以旧 v0.6 完整 L04 PNG 为身份/构图/透明参考，一次**整层重绘**得到 `source/new_l04_whole_native.png`，原生 **2172×724 RGBA**，SHA-256 `35c090a66700da82ccabfafab16ded54c93807ede05fd4b055ceffbbde8305ee`。这不是原生 3072×1024；`review/new_l04_whole_3072_format_probe.png` 只为最终画布尺寸验证做等比适配，像素增长本身不计入清晰度提升。

证据：`review/l04_whole_with_old_other_layers.png` 以旧 L01–L03、旧 L05 和新 L04 原位重组；`review/l04_whole_phone_1x_compare.png` 左旧右新，均为中心576×1024静态竖屏裁窗；`review/l04_whole_phone_18x_compare.png` 两侧均取中心桥/河 `[1376,1696)×[455,1024)` 并同倍率显示；`review/l04_whole_native_bridge_crop.png` 为新源原生像素裁切。静态图不冒充Creator运行。

Art 实核：新片有且只有一座中央桥，桥栏石缝、立柱边与前景水纹新增可辨结构；河在前、街在后，桥与旧L03街连接可读，L04上方为真透明、没有旧分区的第二桥鬼影。桥拱高度略高、暖灯和蓝水偏亮，扩批须以v0.6色光为约束，并在新五层重组后再核。结论：**PASS，仅作为五张整层方法扩批条件**；最终五层图、PSD和Gate2均 `NOT_TESTED`，原生尺寸限制须在交付说明中显著披露。
