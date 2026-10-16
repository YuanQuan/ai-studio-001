# 配色继承记录 v0.1

本批沿原样式，不提出新视觉方向，不新增状态色、重绘底板或对图片换色。颜色下表从当前源码直接抄录，仅用于复用与Review，不意味着独立批准新资源。

| 范围/语义 | 当前值 | 证据 |
|---|---|---|
| 实验页背景 | #0A1422 | UnitSampleGallery.ts:20 |
| 实验页panel | #132233 | UnitSampleGallery.ts:21；U01编辑器同值 |
| 正文 | #E6EFF7 | UnitSampleGallery.ts:22 |
| 辅助/禁用描边 | #9BB2C7 | UnitSampleGallery.ts:23、327 |
| 描边/pressed | #6CC1E0 | UnitSampleGallery.ts:24、324 |
| 标题/强调 | #F6BD6D | UnitSampleGallery.ts:25 |
| 奶茶暖木panel | #67351F，alpha235 | milk_tea_lab.ts:22 |
| 奶茶正文 | #FAF2DA | milk_tea_lab.ts:23 |
| 奶茶muted | #B3BCB8 | milk_tea_lab.ts:24 |
| 奶茶暖边 | #A47552 | milk_tea_lab.ts:25 |
| 奶茶强调/错误提示 | #FFC25D | milk_tea_lab.ts:26 |
| 奶茶深棕文字 | #5E3721 | milk_tea_lab.ts:27 |
| 奶茶屋檐文字 | #FFEAC6 | milk_tea_lab.ts:28 |
| 奶茶disabled底 | RGBA(75,59,52,220) | milk_tea_lab.ts:345 |
| 奶茶disabled文字 | #88705A | milk_tea_lab.ts:368 |

源码路径均相对apps/client/assets。已批准图片中的色彩、光照、透明与遮罩保持原字节；本表不授权统一成某套色系。SafeHUD代理沿所在页现有panel/text/edge值，禁止奶茶改为实验页冷蓝皮肤。状态除原色变化还用文字“已选/加载中/未开放/失败”，避免仅凭颜色识别；高亮不改变热区大小。

本轮未重新测量图像背景下对比度，也未证明所有disabled/半透明组合可读。后续同背景实际尺度核验；若需颜色变化须提交Art差异Review与用户批准，不静默调整。字体来源和未知系统字体许可见components/COMPONENT_SPEC.md。
