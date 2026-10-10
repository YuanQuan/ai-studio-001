# v0.3 实图视觉锚点检查

| 锚点 | 结果 | 实图证据 |
| --- | --- | --- |
| 当前店铺画风 | PASS（静态） | `review/current_shops_on_v03_scene.png` 使用当前客户端六店 body/sign，按 U00 v0.6 已确认脚点和 0.34 缩放；蓝瓦暖木、金橙灯与较柔和的场景块面同屏可读。 |
| L01 星空月云、L02 远山远楼 | PASS | 两张正式 PNG 对 v0.2 SHA-256 逐字节一致。 |
| 柳林、宽街和右牌楼 | PASS（静态） | `review/reassembled_from_exports.png`：较少密叠深黑树冠，一座右牌楼，后岸宽街从两侧接桥肩。 |
| 单座中央桥、河前街后 | PASS（静态） | 中心 1x/1.8 对照：前景只有 L04 一座桥，L03 中间预留透明水道，无第二石拱、斜石或街穿桥洞。 |
| 桥石/水纹/前草阴影 | PASS（待用户视觉判断） | `review/v02_left_v03_right_center_1x.png`、`review/v02_left_v03_right_left_1x.png`：桥体和草石中间调增多，深石缝与厚暗面收轻；河仍夜蓝。 |
| 五层透明、母版一致 | PASS | 五张 3072×1024 RGBA；PSD 读回合成与 `review/reassembled_from_exports.png` 逐像素一致。 |

目前比较均为同背景同尺度静态图，不代表 Creator 运行或性能通过。正式接入须待 Gate2 用户批准。
