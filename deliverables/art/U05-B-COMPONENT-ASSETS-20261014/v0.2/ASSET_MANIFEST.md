# U05 标签纸签修订｜资源登记 v0.2

状态：用户退回 v0.1 名牌外形/边框后，v0.2 已按同批 Art/Tech 预签局部制作；新底板及重组待用户 Gate2 审核。v0.1 历史快照完整保留。详尽路径、实例坐标、九宫格切线、尺寸和 SHA-256 见 [`CUT_MANIFEST.json`](CUT_MANIFEST.json)。

| 资产 | 实际路径 | 本版处理 |
| --- | --- | --- |
| `LABEL_PLATE_9SLICE` | `exports/LABEL_PLATE_9SLICE.png` | 唯一改变的导出：123×45 RGBA，约 8px 小圆角纸签、约 2px 细深棕边和弱右下影；奶油色从 v0.1 名牌内区取样；inset 18/18/12/12，12 实例原坐标不变。 |
| `U05_ART_FONT.png/.fnt` | `exports/` 同名文件 | 719 字图集与度量原字节继承 v0.1，已批准子集，不随标签返工。 |
| 其余 46 件导出 | `exports/` 同名文件 | 原字节继承 v0.1，含 45 张 B 其它 PNG 与“确认”视觉样层；完整 49 件中仅底板 SHA 改变。 |
| 多层母版 | `source/workspace_b_master.psd` | 1024×1536、61 个栅格语义层；只换十二个名牌实例层，其余源层引用 v0.1 同哈希文件。 |

同尺度重组见 `review/reconstructed.png`，v0.1 与 v0.2 并列见 `review/comparison.png`，123/130/131 宽九宫格实样见 `review/component_sheet.png`。PSD 脚本预览与重组逐像素一致；新旧重组所有变化像素均位于十二个既有标签矩形，区外 0 变化。边框与角在三种宽度样图中连续；客户端真实 Sprite SLICED 导入、目标机字号/视觉和性能仍未验证。

本批图像来源仅为已登记 B 空名牌及 v0.1 同源字体，无新参考图像、无 imagegen。PSD 名牌是栅格层；纸签样式可修改，但不声称文字是 PSD 原生文字对象。所有客户端路径仍为计划、UUID 为空；新底板在 Gate2 明确批准前不能正式接入。
