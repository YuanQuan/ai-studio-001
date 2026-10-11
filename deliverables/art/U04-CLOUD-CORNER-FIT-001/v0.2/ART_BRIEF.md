# U04 祥云角花线条修订：静态候选 v0.2

## 修订目标

用户已认可 v0.1 左下与右上角花和边框的贴合方式，但认为云纹线条不够舒服。本轮沿用现图与贴边关系，只修订两处角花轮廓：减少琐碎小钩、密集内卷和蛇形尖角，改为两到三段舒展的主云弧，转接圆润、线宽均匀。左下沿底边向内铺开，右上沿上边与右边转角相接；主卷云有大小节奏和留白。色彩沿用深蓝填色及不过亮的暗暖金细线。

## 输入与来源

- 唯一图像编辑目标：`deliverables/art/U04-CLOUD-CORNER-FIT-001/v0.1/cloud_corner_fit_preview.png`，1672×941。v0.1 是以当时 U04 运行截图为底图生成的静态候选。
- v0.1 的通用祥云语言来自用户提供的图片；来源与未核明的授权范围见 v0.1 `ART_BRIEF.md`。本轮没有将该参考图作为图像工具输入，不将候选认定为正式生产素材。

## 生成方式和提示词

使用内置 `image_gen` 的图像编辑，输入仅为上述 v0.1 图。提示词：

> Use case: precise-object-edit. Asset type: revision of a static game UI candidate. The single input image is the v0.1 candidate and the exact EDIT TARGET. Keep its full scene, composition, character portrait, background, dialogue text, all tabs and buttons, dark navy dialogue panel, overall color, dimensions, and existing gold frame placement as close to the input as possible. Edit ONLY the decorative gold-outline cloud ornaments at the lower-left and upper-right corners of the large bottom dialogue panel. The user already approves how these ornaments meet the frame edges: preserve their position and continuous tangent connections to the thin frame lines, with no floating ends and no extra gold L-shaped overlay. Improve only the cloud contour linework. The upper-right currently has crowded tiny pointed hooks; the lower-left has too many inner spirals. Replace these with two or three broad, open, relaxed cloud-petal arcs at each corner. Do not draw more closed spirals. Use rounded, smooth transitions, consistent visible but fine line width, and a slightly softer restrained dark warm gold matching the frame; fill each cloud in the same deep navy as the panel. Give the main curl a clear larger-to-smaller rhythm and leave breathing space between arcs. Lower-left cloud spreads inward along the bottom border; upper-right cloud remains compact around the top/right frame turn. Avoid extra ornament, additional curls, jagged points, bright gold highlights, or changes anywhere else. No new text.

## 用途和限制

本轮输出：`cloud_corner_fit_preview.png`，1672×941，SHA-256 `bdcb0002f9da7bd504e38e37bcf5a369b16eb9c7062c99b37cde2ee1565d2a21`。仅提交静态方向候选。生成式编辑可能改动画面其他像素；即使视觉上接近，也不声明非角花区域逐像素不变。此尺寸沿用 v0.1 候选，不是原客户端运行截图的 1280×720。无 PSD、正式切片或客户端接入，不代表真实运行或九宫格缩放验证。正式生产仍须按项目美术审批流程另行推进。
