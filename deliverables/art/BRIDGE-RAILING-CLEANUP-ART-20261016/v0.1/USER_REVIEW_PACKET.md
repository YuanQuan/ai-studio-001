# 栏杆去边用户审阅包 v0.1

请先看 `review/BEFORE_AFTER.png`：左右栏杆各用原图和新版 3× 同尺度并排。`review/EDGE_BACKGROUNDS.png` 提供白底和深底对照，`review/scene_reassembled.png` 是 48 层完整场景重组。正式待批文件是 `exports/tex_sakura_rr_bridge_front_l.png`、`exports/tex_sakura_rr_bridge_front_r.png`，完整可编辑母版在 `source/scene_sakura_railing_clean_master.psd`。

本次仅处理用户对齐的 ①栏杆上缘蓝色斜带、②灯檐外蓝紫边、③圆球帽外蓝边。石栏、两灯与暖色顶线沿用原像素；两张新版 PNG 的 RGB 与原图逐像素相同，只在栏杆外缘降低 alpha。实际暖色顶线锚点 alpha 零差异，右侧蓝带中的 5 个悬空橙粉点已清除；部分混合色边缘 alpha 有减少，详见 `VALIDATION.json` 与 `review/WARM_LINE_CHECK.png`。桥身、水面与客户端工程未改。

请审阅这一具体切片版本的边缘效果。获得用户 Gate2 明确批准前，不接入客户端。
