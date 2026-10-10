# 主场景店铺画风匹配重绘 v0.3｜Gate2 具体切片审核

请审核本版实际五层切片与组合效果。主图为 [五层重组](review/reassembled_from_exports.png)；把当前已接入六店按 U00 v0.6 已确认脚点及 0.34 缩放放进场景的静态参考见 [六店同屏](review/current_shops_on_v03_scene.png)。[旧版在上、新版在下且两版均有同批六店](review/current_shops_v02_top_v03_bottom_full_1x.png) 便于审看画风关系。手机同尺度中心/左/右视窗见 `review/v02_left_v03_right_center_1x.png`、`...left_1x.png`、`...right_1x.png`，中心 1.8 倍细节见 `review/v02_left_v03_right_center_18x.png`，整合对照见 `review/mobile_comparison.png`；桥原生同尺度裁切见 `review/native_bridge_v02_left_v03_right_1x.png`。

与 v0.2 相比，L01 星空月云、L02 远山远楼逐字节保留；L03 柳林街牌楼、L04 桥河灯船、L05 前草各完整全幅新绘。树冠深黑密叠面积、桥石重缝与强金边、前草厚暗面收轻，保留蓝夜与暖灯。中央只有一桥；后岸街左右接桥肩，桥洞后为蓝色水道；右月、右牌楼、宽街、河前街后和左右前草保持。实图的色块、比例与灯光请由用户判断是否符合当前店铺风格。

生产文件为 [五层 PSD](source/scene_clarity_master.psd)、`exports/` 五张 3072×1024 全画布 RGBA PNG，精确路径和 SHA 见 [切片清单](CUT_MANIFEST.json)，母版读回合成与重组逐像素相同。三张新层原生均 2172×724；等比适配不等于新增清晰细节。此包是静态资源审看，当前客户端未替换，Creator/设备运行效果尚未验证。本组织自行切图，按规则直接送用户 Gate2，不添加切图成品专业复审。

请对 `CUT_MANIFEST.json` 绑定的 **v0.3 具体五张 PNG 与 PSD/重组效果** 明确批准或指出要退回的可见差异。批准后才可进入客户端正式接入，后续仍需运行实图与技术指标核验。
