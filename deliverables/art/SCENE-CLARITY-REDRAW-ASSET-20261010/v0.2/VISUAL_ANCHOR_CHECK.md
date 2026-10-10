# 视觉锚点实图检查 v0.2

基线为 v0.6 `review/overall_from_psd.png`；新图为本版 `review/reassembled_from_exports.png`。已目视检查全景、中央和右侧同尺度手机视窗、中央 1.8 对照及原生尺度桥裁切。旧图置左、新图置右。

| 锚点 | 结果 | 实图依据与差异 |
| --- | --- | --- |
| L01 右月与蓝夜 | PASS | 月仍在右部；云边有新笔触，蓝夜略亮。 |
| L02 雾山远楼 | PASS | 远楼、山脊和旧有右瀑布保留；山石与楼体可辨，局部对比更高。 |
| L03 柳林、宽街、右牌楼 | PASS | 一座右牌楼；旧有中央街道石拱仍在原区域；街在河后，柳叶更清楚且偏绿。 |
| L04 中央桥、前景河、灯船 | PASS | 桥石缝、栏杆和河纹新结构可辨；桥拱略高，暖灯与水蓝更亮。 |
| L05 左右水草 | PASS | 左右草石原位，中央视觉上留空；L04 河面连续。中间区域仅有生成透明通道的 1/255 残余 14 个原生像素，正式导出 28 个像素，不可见。 |
| 五层重组与层序 | PASS | 无分区接缝、双桥鬼影或明显透明露洞；`review/psd_readback_composite.png` 与 PSD 预览逐像素相同。 |
| U00/U01 实际运行 | NOT_TESTED | Gate2 资源尚未获用户批准，客户端未替换；运行遮挡留待接入后验证。 |

手机对照：`review/mobile_comparison.png`、`review/old_left_new_right_center_phone_18x.png`、`review/old_left_new_right_left_phone_1x.png`、`review/old_left_new_right_right_phone_1x.png`。原生尺度裁切：`review/old_left_new_right_native_scale_bridge.png`。
