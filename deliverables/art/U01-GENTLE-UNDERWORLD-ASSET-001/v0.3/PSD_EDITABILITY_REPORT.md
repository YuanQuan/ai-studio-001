# U01 v0.3 PSD 可编辑性与独立性核验

- `psd/u01_gentle_underworld_props.psd`：2172×724，24 个可单独显隐/移动的栅格层。旧 L01–L04 保留其原位像素；从保存后的 PSD 再读每层，与组装输入逐像素相同。
- 六件各有一张 2172×724 透明 PNG，可单件隐藏/整体移位；其 PSD 分部层名前缀为稳定 ID，同前缀多层组成逻辑挂件。桥牌分 `ties/board/letters`；路牌分 `pole/board/letters/arrow`；右匾三字各层；幡杆、布、结、脚座独立；两灯各分光晕、罩、短尾。
- PSD 写入器未创建原生 Photoshop 文件夹组；“挂件组”是同前缀独立栅格层集合，并有独立合成 PNG 与原始 SVG 路径。PSD 中没有原生矢量或文字对象。移动时可多选该 ID 前缀层；如仅用独立 PNG，可作为一张图整体移动。
- 读取器已核 24 层名称、次序、像素；脚本层级验证不是 Photoshop/Photopea GUI 的人工编辑测试。客户端独立节点与运行时移动能力未实现，`NOT_TESTED`。

| 挂件 | PSD 分部层数 | PNG alpha 盒 |
|---|---:|---|
| `U01_PROP_LANTERN_A` | 3 | `[772, 163, 814, 221]` |
| `U01_PROP_LANTERN_B` | 3 | `[1261, 184, 1295, 232]` |
| `U01_PROP_SOUL_BANNER` | 4 | `[683, 334, 744, 504]` |
| `U01_PROP_ROAD_SIGN` | 4 | `[832, 374, 913, 513]` |
| `U01_PROP_FENGDU_LETTERS` | 3 | `[2039, 259, 2092, 275]` |
| `U01_PROP_BRIDGE_SIGN` | 3 | `[1025, 417, 1147, 467]` |
