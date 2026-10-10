# Gate2 用户审核包：五层整张重绘 v0.2

请审核这次**五张分别整层新绘**的实际效果。左为旧 v0.6，右为本版 v0.2：

- 全景同尺度：`review/old_left_new_right_full_same_scale.png`
- 中央手机视窗 1 倍：`review/mobile_comparison.png`
- 中央手机视窗 1.8 倍：`review/old_left_new_right_center_phone_18x.png`
- 左侧手机视窗：`review/old_left_new_right_left_phone_1x.png`
- 右侧手机视窗：`review/old_left_new_right_right_phone_1x.png`
- 原生尺度桥与河细节：`review/old_left_new_right_native_scale_bridge.png`
- 五层正式导出重组：`review/reassembled_from_exports.png`

本版交付 `source/scene_clarity_master.psd` 与 `exports/` 下五张 3072×1024 原位 RGBA PNG；层序与视差写在 `CUT_MANIFEST.json`。生成原生尺寸为 **2172×724**，正式尺寸通过等比适配实现；适配本身不代表新增细节。桥石纹、水纹、柳叶和云边的可见新结构请以同尺度对照判断。新图比旧图整体更亮，柳色更绿，暖灯和水蓝更明显，桥拱略高；空间关系仍为一座中央桥、右月、右牌楼、河前街后、宽街和两侧近草。

当前请求为 Gate2 对**具体切片版本与效果**的用户审核；尚未替换客户端工程，也未做接入后运行验证。批准后方可交客户端正式接入。
